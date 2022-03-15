/**
 * @author zyc
 * @copyright © 2022
 * @description 工作管理-组焊列表-组焊清单-添加组焊
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, Modal, Row, Col, TreeSelect, message, InputNumber, Radio, Popconfirm, Descriptions } from 'antd';
import { CommonTable, DetailContent, DetailTitle, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './AssemblyWelding.module.less';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import AuthUtil from '../../../utils/AuthUtil';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { IComponentList, ISegmentNameList } from './IAssemblyWelding';
import { weighingtypeOptions } from '../../../configuration/DictionaryOptions';


export default function AddAssemblyWelding(): React.ReactNode {

    const [refresh, setRefresh] = useState(false);
    const params = useParams<{ id: string, productCategoryId: string }>();
    const userId = AuthUtil.getUserId();
    const [weldingDetailedStructureList, setWeldingDetailedStructureList] = useState<IComponentList[]>();
    const [mainPartId, setMainPartId] = useState<string>('');
    const [componentList, setComponentList] = useState<IComponentList[]>([]);
    const [settingData, setSettingData] = useState<IComponentList[]>([]);
    const [drawTaskId, setDrawTaskId] = useState<string>('');
    const [checkUser, setCheckUser] = useState([]);
    const [form] = Form.useForm();
    const history = useHistory();

    const { loading, data } = useRequest<ISegmentNameList[]>(() => new Promise(async (resole, reject) => {
        const data: ISegmentNameList[] = await RequestUtil.get(`/tower-science/welding/getWeldingSegment?weldingId=${params.id}`);
        resole(data);
    }), {})

    const segmentNameList: ISegmentNameList[] = data || [];

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: '零件号',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: '材料',
            dataIndex: 'materialName',
            key: 'materialName'
        },
        {
            title: '材质',
            dataIndex: 'structureTexture',
            key: 'structureTexture'
        },
        {
            title: '规格',
            dataIndex: 'structureSpec',
            key: 'structureSpec'
        },
        {
            title: '长（mm）',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '宽（mm）',
            dataIndex: 'width',
            key: 'width'
        },
        {
            title: '厚度（mm）',
            dataIndex: 'width',
            key: 'width'
        },
        {
            title: '单组件数',
            dataIndex: 'singleNum',
            key: 'singleNum'
        },
        {
            title: '备注',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: '是否主件',
            dataIndex: 'isMainPart',
            key: 'isMainPart',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Radio key={record.structureId} checked={weldingDetailedStructureList && weldingDetailedStructureList[index].isMainPart === 1} onChange={(e) => {
                    let newWeldingDetailedStructureList: IComponentList[] = weldingDetailedStructureList || [];
                    if (e.target.checked) {
                        setMainPartId(record.code);
                        newWeldingDetailedStructureList = newWeldingDetailedStructureList.map((item: IComponentList, ind: number) => {
                            if (index === ind) {
                                return {
                                    ...item,
                                    isMainPart: 1
                                }
                            } else {
                                return {
                                    ...item,
                                    isMainPart: 0
                                }
                            }
                        })
                    } else {
                        newWeldingDetailedStructureList[index] = {
                            ...newWeldingDetailedStructureList[index],
                            isMainPart: 0
                        }
                    }
                    setWeldingDetailedStructureList([...newWeldingDetailedStructureList])
                }}></Radio>
            )
        },
        {
            title: '电焊长度（mm）',
            dataIndex: 'weldingLength',
            key: 'weldingLength',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Input type="number" min={0} key={record.structureId} defaultValue={record.weldingLength} onChange={(e) => {
                    const newWeldingDetailedStructureList: IComponentList[] = weldingDetailedStructureList || [];
                    const electricWeldingMeters = form.getFieldsValue(true).electricWeldingMeters;
                    newWeldingDetailedStructureList[index] = {
                        ...newWeldingDetailedStructureList[index],
                        weldingLength: Number(e.target.value)
                    }
                    setWeldingDetailedStructureList([...newWeldingDetailedStructureList])
                    form.setFieldsValue({ 'electricWeldingMeters': Number(electricWeldingMeters) - Number(record.weldingLength) * Number(record.singleNum) + Number(e.target.value) * Number(record.singleNum) });
                }} bordered={false} />
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Popconfirm
                    title="确认移除?"
                    onConfirm={() => removeRow(record, index)}
                    okText="移除"
                    cancelText="取消"
                >
                    <Button type="link">移除</Button>
                </Popconfirm>
            )
        }
    ]

    const componentColumns = [
        {
            title: '段名',
            dataIndex: 'segmentName',
            key: 'segmentName'
        },
        {
            title: '构件编号',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: '材料名称',
            dataIndex: 'materialName',
            key: 'materialName'
        },
        {
            title: '材质',
            dataIndex: 'structureTexture',
            key: 'structureTexture'
        },
        {
            title: '单段件数',
            dataIndex: 'basicsPartNum',
            key: 'basicsPartNum'
        }, {
            title: '剩余数量',
            dataIndex: 'basicsPartNumNow',
            key: 'basicsPartNumNow'
        },
        {
            title: '备注',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Button type="link" onClick={() => addComponent(record, index)}>右移</Button>
            )
        }
    ]

    /**
     * @description 构件信息移除行 
     */
    const removeRow = async (record: Record<string, any>, index: number) => {
        let weight: number = Number(form.getFieldsValue(true).singleGroupWeight || 0) - (Number(record.basicsWeight) || 0);
        let electricWeldingMeters: number = Number(form.getFieldsValue(true).electricWeldingMeters || 0) - Number(record.weldingLength || 0);
        form.setFieldsValue({ 'singleGroupWeight': weight, 'electricWeldingMeters': electricWeldingMeters });
        if (record.singleNum === 1) {
            weldingDetailedStructureList?.splice(index, 1);
            setWeldingDetailedStructureList([...weldingDetailedStructureList || []])
        } else {
            setWeldingDetailedStructureList(weldingDetailedStructureList?.map((res: IComponentList) => {
                if (res.id === record.id) {
                    return {
                        ...res,
                        singleNum: Number(res.singleNum) - 1
                    }
                } else {
                    return res
                }
            }))
        }
        let isNewComponent: boolean = (componentList|| []).every((items: IComponentList) => {
            return record.structureId !== items.id;
        })
        if(isNewComponent) {
            let data: IComponentList[] = await RequestUtil.get(`/tower-science/welding/getStructure`, {
                segmentName: form.getFieldsValue(true).segmentName,
                productCategoryId: params.productCategoryId
            });
            data.filter(res => {return res.id === record.structureId})
            setComponentList([
                {
                    ...data[0], 
                    basicsPartNumNow: 1
                }, 
                ...componentList
            ])
        } else {
            setComponentList(componentList?.map((res: IComponentList) => {
                if (res.id === record.structureId) {
                    return {
                        ...res,
                        basicsPartNumNow: Number(res.basicsPartNumNow) + 1
                    }
                } else {
                    return res
                }

            }))
        }
    }


    /**
     * @description 获取构件明细列表 
     */
    const getComponentList = () => {
        if (form) {
            form.validateFields(['segmentName']).then(async res => {
                // const settingData = this.state.settingData || [];
                let data: IComponentList[] = await RequestUtil.get(`/tower-science/welding/getStructure`, {
                    segmentName: form.getFieldsValue(true).segmentName,
                    productCategoryId: params.productCategoryId
                });

                // if (this.props.name === '编辑') {
                //     settingData.forEach((items: IComponentList) => {
                //         data = data.map((item: IComponentList) => {
                //             if (items.structureId === item.id) {
                //                 console.log(Number(item.basicsPartNumNow || 0) + Number(items.singleNum || 0))
                //                 return {
                //                     ...item,
                //                     basicsPartNumNow: Number(item.basicsPartNumNow || 0) + Number(items.singleNum || 0)
                //                 }
                //             } else {
                //                 return {
                //                     ...item,
                //                     basicsPartNumNow: Number(item.basicsPartNumNow || 0)
                //                 }
                //             }
                //         })
                //     })
                // }
                // let newData: IComponentList[] = data?.filter((item: IComponentList) => {
                //     return weldingDetailedStructureList?.every((items: IComponentList) => {
                //         if (items.singleNum === item.basicsPartNumNow) {
                //             return item.id !== items.structureId;
                //         } else {
                //             return item
                //         }
                //     })
                // })
                console.log(data)
                // weldingDetailedStructureList?.forEach((items: IComponentList, index: number) => {
                //     newData = newData.map((item: IComponentList) => {
                //         if (item.id === items.structureId) {
                //             const num = (settingData && settingData[index]?.singleNum) || 0;
                //             const now = !!(items.id && items.id?.length > 0) ? Number(item.basicsPartNumNow || 0) - Number(items.singleNum || 0) + num : Number(item.basicsPartNumNow || 0) - Number(items.singleNum || 0)
                //             return {
                //                 ...item,
                //                 basicsPartNumNow: now,
                //                 totalWeight: Number(now || 0) * Number(item.basicsWeight || 0)
                //             };
                //         } else {
                //             return {
                //                 ...item,
                //                 totalWeight: Number(item.basicsPartNumNow || 0) * Number(item.basicsWeight || 0)

                //             }
                //         }
                //     })
                // })
                setComponentList([...data])
            })
        }
    }

    /**
    * @descriptions 可选构件明细右移
    */
    const addComponent = (record: Record<string, any>, index: number) => {
        let newWeldingDetailedStructureList: IComponentList[] = weldingDetailedStructureList || [];
        let weldingLength: number = 0;
        let weight: number = Number(form.getFieldsValue(true).singleGroupWeight || 0) + (Number(record.basicsWeight) || 0) * (Number(record.singleNum) || 1);
        let isNewComponent: boolean = newWeldingDetailedStructureList.every((items: IComponentList) => {
            return record.id !== items.structureId;
        })
        let newComponentList: IComponentList = isNewComponent ? {
            ...record,
            id: '',
            // segmentId: this.props.segmentId,
            structureId: record.id,
            singleNum: 1,
            weldingLength: 0,
            isMainPart: 0
        } : {}
        newWeldingDetailedStructureList = newWeldingDetailedStructureList.map((item: IComponentList) => {
            if (item.structureId === record.id) {
                return {
                    ...item,
                    singleNum: Number(item.singleNum) + 1,
                    basicsPartNumNow: Number(record.basicsPartNumNow || 0)
                }
            } else {
                return {
                    ...item,
                    basicsPartNumNow: Number(record.basicsPartNumNow || 0)
                }
            }
        })
        weldingDetailedStructureList?.forEach((item: IComponentList) => {
            weldingLength = weldingLength + (Number(item.singleNum) || 1) * Number(item.weldingLength || 0);
        })
        form.setFieldsValue({ 'singleGroupWeight': weight, 'electricWeldingMeters': weldingLength });
        setWeldingDetailedStructureList(Object.keys(newComponentList).length > 0 ? [...newWeldingDetailedStructureList, newComponentList] : [...newWeldingDetailedStructureList]);
        if (record.basicsPartNumNow === 1) {
            componentList.splice(index, 1);
            setComponentList([...componentList]);
        } else {
            setComponentList(componentList?.map((res: IComponentList) => {
                if (res.id === record.id) {
                    return {
                        ...res,
                        basicsPartNumNow: Number(res.basicsPartNumNow) - 1
                    }
                } else {
                    return res
                }

            }))
        }
    }

    return <DetailContent operation={[
        <Space direction="horizontal" size="small" className={styles.bottomBtn}>
            <Button key="cancel" type="ghost" onClick={() => history.goBack()}>返回</Button>
            <Button key="save" type="primary" onClick={() => { }}>保存并返回</Button>
            <Button key="saveC" type="primary" onClick={() => { }}>保存并继续</Button>
        </Space>
    ]}>
        <DetailTitle title="组焊信息" />
        <Form form={form}>
            <Row>
                <Col span={3}>
                    <Form.Item name="componentId" label="组件号">
                        <Input placeholder="自动产生" maxLength={10} disabled />
                    </Form.Item>
                </Col>
                <Col span={3} offset={1}>
                    <Form.Item name="electricWeldingMeters" label="电焊米数（mm）" rules={[{
                        "required": true,
                        "message": "请输入电焊米数"
                    }]}>
                        <Input placeholder="请输入" disabled />
                    </Form.Item>
                </Col>
                <Col span={3} offset={1}>
                    <Form.Item name="segmentName" label="段号" rules={[{
                        "required": true,
                        "message": "请输入段号"
                    }]}>
                        <Select placeholder="请选择" style={{ width: '100%' }} onChange={() => {
                            setWeldingDetailedStructureList([]);
                            getComponentList()
                        }} >
                            {segmentNameList.map((item: any) => {
                                return <Select.Option key={item.id} value={item.name}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={3} offset={1}>
                    <Form.Item name="singleGroupWeight" label="单组重量（kg）" style={{ width: '100%' }} rules={[{
                        "required": true,
                        "message": "请输入单组重量"
                    }]}>
                        <Input placeholder="自动计算" style={{ width: '100%' }} disabled />
                    </Form.Item>
                </Col>
                <Col span={3} offset={1}>
                    <Form.Item name="segmentGroupNum" label="单段组数" rules={[{
                        "required": true,
                        "message": "请输入单段组数"
                    }]}>
                        <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={3} offset={1}>
                    <Form.Item name="type" label="组焊类型" rules={[{
                        "required": true,
                        "message": "请选择组焊类型"
                    }]}>
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                            {weighingtypeOptions?.map((item: any, index: number) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <DetailTitle title="构件信息" />
        <CommonTable
            haveIndex
            columns={componentColumns}
            dataSource={componentList}
            pagination={false}
            style={{
                width: '40%',
                position: 'absolute'
            }}
        />
        <CommonTable
            columns={columns}
            style={{
                width: '55%',
                position: 'relative',
                left: '42%'
            }}
            dataSource={[...(weldingDetailedStructureList || [])]}
            pagination={false}
        />
    </DetailContent>

}