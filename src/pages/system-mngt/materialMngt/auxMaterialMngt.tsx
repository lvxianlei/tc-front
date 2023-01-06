/**
 * @author zyc
 * @copyright © 2021 
 * @description 配置管理-原材料管理（sw1.1）
 */

import React, { useState } from 'react';
import {
    Space, Input, Select, Button,
    Form, Modal, Spin, Row, Col, Popconfirm, message, Upload
} from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { IMaterial, IMaterialType } from '../material/IMaterial';
import { RuleObject } from 'rc-field-form/lib/interface';
import AuthUtil from '@utils/AuthUtil';
import { exportDown } from '@utils/Export';

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
            key: 'directMaterialTypeName',
            title: '大类',
            width: 150,
            dataIndex: 'directMaterialTypeName'
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
            title: '单位',
            width: 150,
            dataIndex: 'unit'
        },
        {
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
                        const data = await RequestUtil.get<IMaterial[]>(`/tower-system/material/detail/${record.id}`);
                        setVisible(true);
                        const list = materialType.filter((res: IMaterialType) => res.id === data[0].materialType);
                        const typeList = list[0]?.children.filter((res: IMaterialType) => res.id === data[0].materialCategory)
                        setMaterialList(list[0]?.children);
                        setDirectMaterialTypeList(typeList[0]?.children)
                        let newData = {
                            ...data[0],
                            materialType: {
                                label: data[0].materialTypeName,
                                value: data[0].materialType
                            },
                            materialCategory: {
                                value: data[0].materialCategory,
                                label: data[0].materialCategoryName
                            },
                            directMaterialType: {
                                value: data[0].directMaterialType,
                                label: data[0].directMaterialTypeName
                            },
                            // materialCode: data[0].materialCode
                            // materialCode: data[0].materialCode?.substring(4)
                        }
                        // setCode(data[0].materialCode?.substring(0, 4) || '')
                        setDetailData(newData as any);
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
                    materialType: values.materialType.value,
                    materialTypeName: values.materialType.label,
                    materialCategory: values.materialCategory.value,
                    materialCategoryName: values.materialCategory.label,
                    directMaterialType: values.directMaterialType.value,
                    directMaterialTypeName: values.directMaterialType.label,
                    // materialCode: code + values.materialCode,
                    materialDataType: 2
                }
                if (title === '新增') {
                    RequestUtil.post(
                        '/tower-system/material/auxiliary',
                        values
                    ).then(res => {
                        message.success('保存成功');
                        history.go(0)
                    })
                } else {
                    RequestUtil.put(
                        '/tower-system/material/auxiliary',
                        {
                            ...values,
                            id: detailData.id
                        }).then(res => {
                            close();
                            setRefresh(!refresh);
                            message.success('保存成功');
                            history.go(0)
                        })
                }
            })
        }
    }

    /**
     * @description 验证编号是否重复
     */
    const checkBatchSn = (value: string): Promise<void | any> => {
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            const resData = await RequestUtil.get('/tower-system/material/checkMaterialCode', {
                materialCode: code + value,
                id: detailData.id,
                materialDataType: 2
            });
            resolve(resData)
        }).catch(error => {
            Promise.reject(error)
        })
    }
    const [materialList, setMaterialList] = useState([]);
    const [directMaterialTypeList, setDirectMaterialTypeList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('新增');
    const [detailData, setDetailData] = useState<IMaterial>({});
    const [refresh, setRefresh] = useState<boolean>(false);
    const [form] = Form.useForm();
    const history = useHistory();
    const [code, setCode] = useState('');
    // const [ruleFront, setRuleFront] = useState('');
    const [filterValue, setFilterValue] = useState({ materialDataType: 2 });
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: IMaterialType[] = await RequestUtil.get<IMaterialType[]>(`/tower-system/materialCategory`, {
            materialDataType: 2
        });
        resole(data);
    }), {})
    const materialType: any = data || [];

    const handleDownload = () => {
        exportDown(
            `/tower-system/tower-system/material/auxiliary/export`,
            "POST",
            {},
            undefined,
            "辅材信息模版"
        )
    }

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
            extraOperation={<Space direction="horizontal" size="small">
                <Upload
                    action={() => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl + '/tower-system/material/auxiliary/import'
                    }}
                    headers={
                        {
                            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    showUploadList={false}
                    onChange={(info) => {
                        if (info.file.response && !info.file.response?.success) {
                            message.warning(info.file.response?.msg)
                        }
                        if (info.file.response && info.file.response?.success) {
                            message.success('导入成功！');
                            setRefresh(!refresh);
                        }
                    }}
                >
                    <Button type="primary" ghost >导入</Button>
                </Upload>
                <Button type="primary" ghost onClick={handleDownload}>模版下载</Button>
                <Button type="primary" onClick={() => { setVisible(true); setTitle('新增'); }} ghost>新增</Button>
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>}
            searchFormItems={[
                {
                    name: 'materialType',
                    label: '类别',
                    children: <Form.Item name="materialType" initialValue="">
                        <Select
                            placeholder="请选择"
                            style={{ width: "150px" }}
                            onChange={(e) => {
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
                        <Select
                            placeholder="请选择"
                            style={{ width: "150px" }}
                            onChange={(e) => {
                                const list: any = materialList.filter((res: IMaterialType) => res.id === e);
                                setDirectMaterialTypeList(list[0]?.children);
                            }}
                        >
                            <Select.Option value="" key="6">全部</Select.Option>
                            {materialList && materialList.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'directMaterialType',
                    label: '大类',
                    children: <Form.Item name="directMaterialType" initialValue="">
                        <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value="" key="6">全部</Select.Option>
                            {directMaterialTypeList && directMaterialTypeList.map((item: any) => {
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
                setFilterValue({ ...filterValue, ...values })
                return values;
            }}
        />
        <Modal
            title={title}
            visible={visible}
            width="40%"
            okText="保存"
            onCancel={close}
            onOk={save}>
            <Form form={form} labelCol={{ span: 6 }}>
                <Row>
                    <Col span={11} offset={1}>
                        <Form.Item
                            label="类别"
                            name="materialType"
                            rules={[{
                                required: true,
                                message: '请选择类别'
                            }]}>
                            <Select
                                placeholder="请选择"
                                style={{ width: "100%" }}
                                labelInValue
                                onChange={(e: any) => {
                                    const list = materialType.filter((res: IMaterialType) => res.id === e?.value);
                                    setMaterialList(list[0].children);
                                    form.setFieldsValue({
                                        materialCategory: "",
                                        directMaterialType: "",
                                        materialCode: ""
                                    });
                                    setCode('');
                                }}>
                                {materialType && materialType.map((item: any) => {
                                    return <Select.Option
                                        key={item.id}
                                        value={item.id}
                                    >{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item></Col>
                    <Col span={11} offset={1}>
                        <Form.Item
                            label="类型"
                            name="materialCategory"
                            rules={[{
                                required: true,
                                message: '请选择类型'
                            }]}>
                            <Select
                                placeholder="请选择"
                                style={{ width: "100%" }}
                                labelInValue
                                onChange={(e: any) => {
                                    const list: any = materialList.filter((res: IMaterialType) => res.id === e?.value);
                                    setDirectMaterialTypeList(list[0]?.children);
                                    form.setFieldsValue({
                                        directMaterialType: "",
                                        materialCode: ""
                                    });
                                    setCode('');
                                    // setRuleFront(list[0]?.ruleFront)
                                }}>
                                {materialList && materialList.map((item: any) => {
                                    return <Select.Option
                                        key={item.id}
                                        value={item.id}
                                    >{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={11} offset={1}>
                        <Form.Item
                            label="大类"
                            name="directMaterialType"
                            rules={[{
                                required: true,
                                message: '请选择大类'
                            }]}>
                            <Select
                                placeholder="请选择"
                                style={{ width: "100%" }}
                                labelInValue
                                onChange={(e: any) => {
                                    // const list: any = directMaterialTypeList.filter((res: IMaterialType) => res.id === e?.value);
                                    // setCode(list[0].code);
                                    form.setFieldsValue({
                                        materialCode: ""
                                    });
                                }}>
                                {directMaterialTypeList && directMaterialTypeList.map((item: any) => {
                                    return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item></Col>
                    <Col span={11} offset={1}><Form.Item label="编号" name="materialCode" 
                    // rules={[{
                    //     required: true,
                    //     message: '请输入编码'
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
                        {/* <Input addonBefore={code} maxLength={3} /> */}
                        <Input  disabled placeholder='自动生成'/>
                    </Form.Item></Col>
                </Row>
                <Row>
                    <Col span={11} offset={1}>
                        <Form.Item
                            label="品名"
                            name="materialName"
                            rules={[{
                                required: true,
                                message: '请输入品名'
                            }, {
                                pattern: /^[^\s]*$/,
                                message: '禁止输入空格',
                            }]}>
                            <Input maxLength={20} />
                        </Form.Item></Col>
                    <Col span={11} offset={1}>
                        <Form.Item
                            label="规格"
                            name="structureSpec"
                            rules={[{
                                required: true,
                                message: '请输入规格'
                            }, {
                                pattern: /^[^\s]*$/,
                                message: '禁止输入空格',
                            }]}>
                            <Input maxLength={20}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={11} offset={1}>
                        <Form.Item
                            label="单位"
                            name="unit"
                            rules={[{
                                required: true,
                                message: '请输入单位'
                            }, {
                                pattern: /^[^\s]*$/,
                                message: '禁止输入空格',
                            }]}>
                            <Input maxLength={20} />
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