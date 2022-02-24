/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-组焊列表-校核-问题单
*/

import React, { useState } from 'react';
import { Spin, Button, Space, Input, Row, Col, Modal, InputNumber, Radio, Popconfirm, message } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './AssemblyWelding.module.less';
import useRequest from '@ahooksjs/use-request';
import { FixedType } from 'rc-table/lib/interface';
import { IComponentList } from './AssemblyWeldingNew';

export default function Questionnaire(): React.ReactNode {
    const tableColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'createDeptName',
            title: '操作部门',
            dataIndex: 'createDeptName',
        },
        {
            key: 'createUserName',
            title: '操作人',
            dataIndex: 'createUserName'
        },
        {
            key: 'createTime',
            title: '操作时间',
            dataIndex: 'createTime'
        },
        {
            key: 'status',
            title: '问题单状态',
            dataIndex: 'status',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 0:
                        return '已拒绝';
                    case 1:
                        return '待修改';
                    case 2:
                        return '已修改';
                    case 3:
                        return '已删除';
                }
            }
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }
    ]

    const paragraphColumns = [
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
            title: '长度（mm）',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '单组件数',
            dataIndex: 'singleNum',
            key: 'singleNum'
        },
        {
            title: '是否主件',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '电焊长度（mm）',
            dataIndex: 'weldingLength',
            key: 'weldingLength'
        }
    ]

    const componentColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            fixed: 'left' as FixedType,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
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
            title: '规格',
            dataIndex: 'structureSpec',
            key: 'structureSpec'
        },
        {
            title: '单段件数',
            dataIndex: 'basicsPartNumNow',
            key: 'basicsPartNumNow'
        },
        {
            title: '长度',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '宽度',
            dataIndex: 'width',
            key: 'width'
        },
        {
            title: '单件重量（kg）',
            dataIndex: 'basicsWeight',
            key: 'basicsWeight'
        },
        {
            title: '小计重量（kg）',
            dataIndex: 'totalWeight',
            key: 'totalWeight'
        },
        {
            title: '备注',
            dataIndex: 'description',
            key: 'description'
        }
    ]

    const newColumns = [
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
            title: '长度（mm）',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '单组件数',
            dataIndex: 'singleNum',
            key: 'singleNum',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <InputNumber
                    key={record.structureId + record.basicsPartNumNow}
                    defaultValue={record.singleNum}
                    onChange={(e) => {
                        weldingDetailedStructureList[index] = {
                            ...weldingDetailedStructureList[index],
                            singleNum: Number(e)
                        }
                        setElectricWeldingMeters(Number(electricWeldingMeters) - Number(record.weldingLength) * Number(record.singleNum) + Number(record.weldingLength) * Number(e));
                        setSingleGroupWeight(Number(singleGroupWeight) - Number(record.singleNum) * Number(record.basicsWeight) + Number(e) * Number(record.basicsWeight));
                        setWeldingDetailedStructureList([...weldingDetailedStructureList]);
                    }}
                    bordered={false}
                    max={Number(record.basicsPartNumNow)}
                    min={1}
                />
            )
        },
        {
            title: '是否主件',
            dataIndex: 'isMainPart',
            key: 'isMainPart',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Radio key={record.structureId} checked={weldingDetailedStructureList && weldingDetailedStructureList[index].isMainPart === 1} onChange={(e) => {
                    if (e.target.checked) {
                        setMainPartId(record.code);
                        weldingDetailedStructureList = weldingDetailedStructureList.map((item: IComponentList, ind: number) => {
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
                        weldingDetailedStructureList[index] = {
                            ...weldingDetailedStructureList[index],
                            isMainPart: 0
                        }
                    }
                    setWeldingDetailedStructureList([...weldingDetailedStructureList]);
                }}></Radio>
            )
        },
        {
            title: '电焊长度（mm）',
            dataIndex: 'weldingLength',
            key: 'weldingLength',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Input type="number" min={0} key={record.structureId} defaultValue={record.weldingLength} onChange={(e) => {
                    weldingDetailedStructureList[index] = {
                        ...weldingDetailedStructureList[index],
                        weldingLength: Number(e.target.value)
                    }
                    setElectricWeldingMeters(Number(electricWeldingMeters) - Number(record.weldingLength) * Number(record.singleNum) + Number(e.target.value) * Number(record.singleNum));
                    setWeldingDetailedStructureList([...weldingDetailedStructureList]);
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
                    onConfirm={() => removeRow(index)}
                    okText="移除"
                    cancelText="取消"
                >
                    <Button type="link">移除</Button>
                </Popconfirm>
            )
        }
    ]

    const history = useHistory();
    const params = useParams<{ id: string, productCategoryId: string, segmentId: string }>();
    const [description, setDescription] = useState('');
    const [selectVisible, setSelectVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [componentList, setComponentList] = useState<IComponentList[]>([]);
    let [weldingDetailedStructureList, setWeldingDetailedStructureList] = useState<IComponentList[]>([]);
    const [singleGroupWeight, setSingleGroupWeight] = useState(0);
    const [electricWeldingMeters, setElectricWeldingMeters] = useState(0);
    const [weldingDetailedList, setWeldingDetailedList] = useState([]);
    const [mainPartId, setMainPartId] = useState('');

    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const resData: [] = await RequestUtil.get(`/tower-science/welding/getStructureById`, { segmentId: params.segmentId });
        const data = await RequestUtil.get<any>(`/tower-science/welding/getIssueById?segmentId=${params.segmentId}`);
        setWeldingDetailedList(resData);
        resole(data);
    }), {})
    const detailData: any = data;

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    /**
     * @protected
     * @description 点击选择获取构件明细列表 
     */
    const getComponentList = async () => {
        let resData: IComponentList[] = await RequestUtil.get(`/tower-science/welding/getStructure`, {
            segmentName: detailData.weldingDetailedVO.segmentName,
            productCategoryId: params.productCategoryId
        });
        weldingDetailedList.forEach((res: IComponentList) => {
            resData = resData.map((item: IComponentList) => {
                if (item.id === res.structureId) {
                    return {
                        ...item,
                        basicsPartNumNow: Number(res.singleNum || 0) + Number(item.basicsPartNumNow || 0)
                    }
                } else {
                    resData.push(res);
                    return {
                        ...item
                    }
                }
            })
        })
        let newData: IComponentList[] = resData?.filter((item: IComponentList) => {
            return weldingDetailedStructureList.every((items: IComponentList) => {
                if (items.singleNum === item.basicsPartNumNow) {
                    return item.id !== items.structureId;
                } else {
                    return item
                }
            })
        })
        weldingDetailedStructureList.forEach((items: IComponentList) => {
            newData = newData.map((item: IComponentList) => {
                if (item.id === items.structureId) {
                    return {
                        ...item,
                        basicsPartNumNow: Number(item.basicsPartNumNow || 0) - Number(items.singleNum || 0),
                        totalWeight: Number(item.basicsPartNumNow || 0) * Number(item.basicsWeight || 0)
                    };
                } else {
                    return item
                }
            })
        })
        setComponentList([...newData]);
        setSelectVisible(true);
    }

    /**
     * @protected
     * @description 构件明细列表确认显示在构件信息
     */
    const selectComponent = () => {
        let list: IComponentList[] = selectedRows || [];
        let weight: number = singleGroupWeight;
        let weldingLength: number = 0;
        list.forEach((item: IComponentList) => {
            weight = Number(weight || 0) + (Number(item.basicsWeight) || 0) * (Number(item.singleNum) || 1);
        })
        let newComponentList: IComponentList[] = list?.filter((item: IComponentList) => {
            return weldingDetailedStructureList.every((items: IComponentList) => {
                return item.id !== items.structureId;
            })
        })
        newComponentList = newComponentList.map((item: IComponentList) => {
            return {
                ...item,
                id: '',
                segmentId: params.segmentId,
                structureId: item.id,
                singleNum: 1,
                weldingLength: 0
            }
        })
        selectedRows.forEach((items: IComponentList) => {
            weldingDetailedStructureList = weldingDetailedStructureList.map((item: IComponentList) => {
                if (item.structureId === items.id) {
                    return {
                        ...item,
                        singleNum: Number(item.singleNum) + 1
                    }
                } else {
                    return {
                        ...item
                    }
                }
            })
        })
        weldingDetailedStructureList.forEach((item: IComponentList) => {
            weldingLength = weldingLength + (Number(item.singleNum) || 1) * Number(item.weldingLength || 0);
        })
        setElectricWeldingMeters(weldingLength);
        setSingleGroupWeight(weight);
        setSelectVisible(false);
        setWeldingDetailedStructureList([...weldingDetailedStructureList, ...newComponentList]);
        setSelectedRowKeys([]);
        setSelectedRows([]);
    }

    /**
     * @protected
     * @description 构件信息移除行 
     */
    const removeRow = (index: number) => {
        weldingDetailedStructureList?.splice(index, 1);
        let weight: number = 0;
        let electricWeldingMeters: number = 0;
        weldingDetailedStructureList.forEach((item: IComponentList) => {
            weight = Number(weight || 0) + (Number(item.basicsWeight) || 0);
            electricWeldingMeters = Number(electricWeldingMeters || 0) + (Number(item.singleNum) || 0) * Number(item.weldingLength || 0);
        })
        setElectricWeldingMeters(electricWeldingMeters);
        setSingleGroupWeight(weight);
        setWeldingDetailedStructureList([...weldingDetailedStructureList]);
    }

    const save = () => {
        if (weldingDetailedStructureList && weldingDetailedStructureList?.filter(item => item && item['isMainPart'] === 1).length < 1) {
            message.warning('请选择主件');
        } else {
            const value = {
                description: description,
                issueWeldingDetailedDTO: {
                    id: params.segmentId,
                    componentId: detailData.weldingDetailedVO.componentId,
                    mainPartId: mainPartId,
                    segmentName: detailData.weldingDetailedVO.segmentName,
                    electricWeldingMeters: electricWeldingMeters,
                    singleGroupWeight: singleGroupWeight,
                    weldingId: params.id,
                    weldingDetailedStructureList: [...(weldingDetailedStructureList || [])]
                },
                weldingDetailedDTO: {
                    id: params.segmentId,
                    componentId: detailData.weldingDetailedVO.componentId,
                    mainPartId: detailData.weldingDetailedVO.mainPartId,
                    segmentName: detailData.weldingDetailedVO.segmentName,
                    electricWeldingMeters: detailData.weldingDetailedVO.electricWeldingMeters,
                    singleGroupWeight: detailData.weldingDetailedVO.singleGroupWeight,
                    weldingId: params.id,
                    weldingDetailedStructureList: [...(weldingDetailedList || [])]
                }
            }
            RequestUtil.post(`/tower-science/welding/saveVerification`, { ...value }).then(res => {
                message.success('问题单提交成功');
                history.goBack()
            });
        }
    }

    return <>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" >
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
                <Button type="primary" onClick={() => save()}>提交</Button>
            </Space>
        ]}>
            <DetailTitle title="问题信息" />
            <Row className={styles.header}>
                <Col>校核前</Col>
                <Col offset={1}>段号：{detailData.weldingDetailedVO.segmentName}</Col>
                <Col>组件号：{detailData.weldingDetailedVO.componentId}</Col>
                <Col>主件号：{detailData.weldingDetailedVO.mainPartId}</Col>
                <Col>电焊米数：{detailData.weldingDetailedVO.electricWeldingMeters}</Col>
            </Row>
            <CommonTable columns={paragraphColumns} dataSource={weldingDetailedList} pagination={false} />
            <Row className={styles.header}>
                <Col>校核后</Col>
                <Col offset={1}>段号：{detailData.weldingDetailedVO.segmentName}</Col>
                <Col>组件号：{detailData.weldingDetailedVO.componentId}</Col>
                <Col>主件号：{mainPartId}</Col>
                <Col>电焊米数：{electricWeldingMeters}</Col>
                <Button type="primary" onClick={() => getComponentList()} className={styles.btnright} ghost>选择</Button>
            </Row>
            <CommonTable columns={newColumns} dataSource={weldingDetailedStructureList} pagination={false} />
            <DetailTitle title="备注" />
            <Input.TextArea value={description} onChange={(e) => {
                setDescription(e.target.value)
            }} />
            <DetailTitle title="操作信息" />
            <CommonTable columns={tableColumns} dataSource={detailData.issueRecordList} pagination={false} />
        </DetailContent>
        <Modal
            visible={selectVisible}
            width="60%"
            title="构件明细"
            footer={<Space direction="horizontal" size="small" className={styles.bottomBtn}>
                <Button type="ghost" onClick={() => setSelectVisible(false)}>关闭</Button>
                <Button type="primary" onClick={() => selectComponent()} ghost>确定</Button>
            </Space>}
            onCancel={() => setSelectVisible(false)}
        >
            <CommonTable columns={componentColumns} dataSource={componentList} pagination={false} rowSelection={{
                selectedRowKeys: selectedRowKeys || [], onChange: (selectedKeys: [], selectedRows: []) => {
                    setSelectedRowKeys(selectedKeys);
                    setSelectedRows(selectedRows);
                }, getCheckboxProps: (record: Record<string, any>) => ({
                    disabled: Number(record.basicsPartNumNow) === 0
                })
            }} />
        </Modal>
    </>
}