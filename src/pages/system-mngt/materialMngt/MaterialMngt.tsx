/**
 * @author zyc
 * @copyright © 2021 
 * @description 配置管理-原材料管理（sw1.1）
 */

import React, { useState } from 'react';
import { Space, Input, Select, Button, Form, Modal, Spin, Row, Col, InputNumber, Popconfirm, message } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { IMaterial, IMaterialType } from '../material/IMaterial';
import { RuleObject } from 'rc-field-form/lib/interface';

export default function MaterialMngt(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'materialCode',
            title: '编号',
            width: 150,
            dataIndex: 'materialCode'
        },
        {
            key: 'materialTypeName',
            title: '类别',
            width: 150,
            dataIndex: 'materialTypeName',
        },
        {
            key: 'materialCategoryName',
            title: '类型',
            width: 150,
            dataIndex: 'materialCategoryName'
        },
        {
            key: 'materialName',
            title: '品名',
            width: 150,
            dataIndex: 'materialName'
        },
        {
            key: 'structureSpec',
            title: '规格',
            dataIndex: 'structureSpec',
            width: 120,
            type: "string"
        },
        {
            key: 'proportion',
            title: '比重',
            width: 200,
            dataIndex: 'proportion',
            render: (text: number, record: any, index: any) => {
                return text == -1 ? <span>-</span> : <span>{text}</span>
            }
        },
        {
            key: 'updateUserName',
            title: '修改人',
            width: 150,
            dataIndex: 'updateUserName'
        },
        {
            key: 'updateTime',
            title: '修改时间',
            width: 150,
            dataIndex: 'updateTime'
        },
        {
            key: 'weightAlgorithmName',
            title: '算法',
            width: 150,
            dataIndex: 'weightAlgorithmName'
        },
        {
            key: 'externalCode',
            title: '用友编码',
            width: 150,
            dataIndex: 'externalCode'
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            width: 200,
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={async () => {
                        const data = await RequestUtil.get<any[]>(`/tower-system/material/detail/${record.id}`);
                        setVisible(true);
                        const list = materialType.filter((res: IMaterialType) => res.id === data[0].materialType);
                        setMaterialList(list[0]?.children);
                        let newData = {
                            ...data[0],
                            materialType: data[0].materialType + ',' + data[0].materialTypeName,
                            materialCategory: data[0].materialCategory + ',' + data[0].materialCategoryName,
                            // materialCode: data[0].materialCode?.substring(4),
                            proportion: data[0].proportion == -1 ? undefined : data[0].proportion,
                            structureSpec: data[0].ruleFront?data[0].structureSpec?.split(data[0].ruleFront)[1]:data[0].structureSpec
                        }
                        setCode(data[0].materialCode?.substring(0, 4) || '')
                        setRuleFront(data[0].ruleFront)
                        setDetailData(newData);
                        form.setFieldsValue({ ...newData });
                        setTitle('编辑');
                    }}>编辑</Button>
                    <Popconfirm title="要删除该数据吗？" placement="topRight" onConfirm={() => {
                        RequestUtil.delete(`/tower-system/material?id=${record.id}`).then(res => {
                            setRefresh(!refresh);
                            message.success('删除成功');
                        })
                    }}>
                        <Button type="link">删除</Button>
                    </Popconfirm>

                </Space>
            )
        }
    ]

    const close = () => {
        setVisible(false);
        // setMaterialList([]);
        setDetailData({});
        form.resetFields();
        // setCode('');
    }

    const save = () => {
        if (form) {
            form.validateFields().then(res => {
                let values = form.getFieldsValue(true);
                values = {
                    ...values,
                    materialType: values.materialType.split(',')[0],
                    materialTypeName: values.materialType.split(',')[1],
                    materialCategory: values.materialCategory.split(',')[0],
                    materialCategoryName: values.materialCategory.split(',')[1],
                    // materialCode: code + values.materialCode,
                    structureSpec: ruleFront?ruleFront + values.structureSpec:values.structureSpec,
                    materialDataType: 2
                }
                if (title === '新增') {
                    RequestUtil.post(
                        '/tower-system/material',
                        [values]
                    ).then(res => {
                        // close();
                        // setRefresh(!refresh);
                        message.success('保存成功');
                        history.go(0)
                    })
                } else {
                    RequestUtil.put(
                        '/tower-system/material',
                        [{
                            ...values,
                            id: detailData.id
                        }]).then(res => {
                            close();
                            setRefresh(!refresh);
                            message.success('保存成功');
                            history.go(0)
                        })
                }
            })
        }
    }

    // /**
    //  * @description 验证编号是否重复
    //  */
    // const checkBatchSn = (value: string): Promise<void | any> => {
    //     return new Promise(async (resolve, reject) => {  // 返回一个promise
    //         const resData = await RequestUtil.get('/tower-system/material/checkMaterialCode', {
    //             materialCode: code + value,
    //             materialDataType: 2,
    //             id: detailData.id
    //         });
    //         resolve(resData)
    //     }).catch(error => {
    //         Promise.reject(error)
    //     })
    // }

    const [materialList, setMaterialList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('新增');
    const [detailData, setDetailData] = useState<IMaterial>({});
    const [refresh, setRefresh] = useState<boolean>(false);
    const [form] = Form.useForm();
    const history = useHistory();
    const [code, setCode] = useState('');
    const [ruleFront, setRuleFront] = useState('');
    const [filterValue, setFilterValue] = useState({});
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: IMaterialType[] = await RequestUtil.get<IMaterialType[]>(`/tower-system/materialCategory`);
        resole(data);
    }), {})
    const materialType: any = data || [];

    return <Spin spinning={loading}>
        <Page
            path="/tower-system/material"
            columns={[
                ...columns.map((item: any) => {
                    if (item.dataIndex === "structureSpec") {
                        return ({
                            title: item.title,
                            dataIndex: item.dataIndex,
                            width: 50,
                            render: (_: any, record: any): React.ReactNode => (
                                <span>{record?.structureSpec}</span>
                            )
                        })
                    }
                    return item;
                })
            ]}
            headTabs={[]}
            refresh={refresh}
            filterValue={filterValue}
            // exportPath={`/tower-system/material`}
            extraOperation={<Space direction="horizontal" size="small">
                {/* <Button type="primary" ghost>模板下载</Button>
                <Button type="primary" ghost>导入</Button> */}
                <Button type="primary" onClick={() => { setVisible(true); setTitle('新增'); }} ghost>新增</Button>
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>}
            searchFormItems={[
                {
                    name: 'materialType',
                    label: '类别',
                    children: <Form.Item name="materialType" initialValue="">
                        <Select placeholder="请选择" style={{ width: "150px" }} onChange={(e) => {
                            const list = materialType.filter((res: IMaterialType) => res.id === e);
                            setMaterialList(list[0]?.children);
                        }}>
                            <Select.Option value="" key="6">全部</Select.Option>
                            {materialType && materialType.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'materialCategory',
                    label: '类型',
                    children: <Form.Item name="materialCategory" initialValue="">
                        <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value="" key="6">全部</Select.Option>
                            {materialList && materialList.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="编号/品名/规格" />
                }
            ]}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values)
                return values;
            }}
        />
        <Modal title={title} visible={visible} width="40%" okText="保存" onCancel={close} onOk={save}>
            <Form form={form} labelCol={{ span: 6 }}>
                <Row>
                    <Col span={11} offset={1}><Form.Item label="类别" name="materialType" rules={[{
                        required: true,
                        message: '请选择类别'
                    }]}>
                        <Select placeholder="请选择" style={{ width: "100%" }} onChange={(e: string) => {
                            const list = materialType.filter((res: IMaterialType) => res.id === e?.split(',')[0]);
                            setMaterialList(list[0].children);
                            form.setFieldsValue({ materialCategory: '',materialCode:'' });
                            // setCode('');
                            setRuleFront('')
                        }}>
                            {materialType && materialType.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id + ',' + item.name}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item></Col>
                    <Col span={11} offset={1}><Form.Item label="类型" name="materialCategory" rules={[{
                        required: true,
                        message: '请选择类型'
                    }]}>
                        <Select placeholder="请选择" style={{ width: "100%" }} onChange={(e: string) => {
                            const list: any = materialList.filter((res: IMaterialType) => res.id === e?.split(',')[0]);
                            form.setFieldsValue({ materialCode:'' });
                            // setCode(list[0].code);
                            setRuleFront(list[0].ruleFront)
                        }}>
                            {materialList && materialList.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id + ',' + item.name}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item></Col>
                </Row>
                <Row>
                    <Col span={11} offset={1}><Form.Item label="品名" name="materialName" rules={[{
                        required: true,
                        message: '请输入品名'
                    }, {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                    }]}>
                        <Input maxLength={20} />
                    </Form.Item></Col>
                    <Col span={11} offset={1}><Form.Item label="编号" name="materialCode" 
                    // rules={[{
                    //     required: true,
                    //     message: '请输入编号'
                    // }, {
                    //     pattern: /^[^\s]*$/,
                    //     message: '禁止输入空格',
                    // }, {
                    //     pattern: /^[0-9]*$/,
                    //     message: '仅可输入非负数',
                    // }, {
                    //     validator: (rule: RuleObject, value: string, callback: (error?: string) => void) => {
                    //         checkBatchSn(value).then(res => {
                    //             if (res) {
                    //                 callback()
                    //             } else {
                    //                 callback('物料编号重复');
                    //             }
                    //         })
                    //     }
                    // }]}
                    >
                        {/* <Input addonBefore={code} maxLength={4} /> */}
                        <Input  disabled placeholder='自动生成'/>
                    </Form.Item></Col>
                </Row>
                <Row>
                    <Col span={11} offset={1}><Form.Item label="规格" name="structureSpec" rules={[{
                        required: true,
                        message: '请输入规格'
                    }, {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                    }, {
                        pattern: /^[^\u4e00-\u9fa5]*$/,
                        message: '仅可输入数字/字母/特殊字符',
                    }]}>
                        <Input maxLength={20} addonBefore={ruleFront}/>
                    </Form.Item></Col>
                    <Col span={11} offset={1}><Form.Item label="比重" name="proportion" rules={[{
                        required: true,
                        message: '请输入比重'
                    }]}>
                        <InputNumber min={0} step="0.0001" precision={4} max={999999.9999} style={{ width: '100%' }} />
                    </Form.Item></Col>
                </Row>
                <Row>
                    <Col span={11} offset={1}><Form.Item label="比重算法" name="weightAlgorithm" rules={[{
                        required: true,
                        message: '请选择比重算法'
                    }]}>
                        <Select style={{ width: '100%' }}>
                            <Select.Option value={3} id={3}>
                                比重（法兰类）
                            </Select.Option>
                            <Select.Option value={2} id={2}>
                                比重*面积（钢板类）
                            </Select.Option>
                            <Select.Option value={1} id={1}>
                                比重*长度（角钢类）
                            </Select.Option>
                        </Select>
                    </Form.Item></Col>
                    <Col span={11} offset={1}><Form.Item label="用友编码" name="externalCode">
                        <Input maxLength={30} />
                    </Form.Item></Col>
                </Row>
                <Row>
                    <Col span={11} offset={1}><Form.Item label="备注" name="description">
                        <Input.TextArea maxLength={300} />
                    </Form.Item></Col>
                </Row>
            </Form>
        </Modal>
    </Spin>
}