import React, { useState } from 'react';
import { Button, Form, Input, message, Modal, Select, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common';
import RequestUtil, { jsonStringifyReplace } from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { useForm } from 'antd/es/form/Form';

export default function IssuedDetail(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const params = useParams<{ id: string, productCategoryId: string }>()
    const history = useHistory();
    const [form] = useForm();
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/material?current=1&size=1000`);
        const value: any = Array.from(new Set(data?.records.map((item: { materialCategoryName: any; }) => item.materialCategoryName)));
        resole(value);
    }))
    
    const { data: specDatas } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/supplyBatch/structure/spec/${params.id}`);
        resole(data || []);
    }))

    const { data: textureDatas } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/supplyBatch/structure/texture/${params.id}`);
        resole(data || []);
    }))

    const { data: craftDatas } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/supplyBatch/craft/name/${params.id}`);
        resole(data || []);
    }))

    const { data: materialDatas } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/supplyBatch/material/name/${params.id}`);
        resole(data || []);
    }))

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 150,
            dataIndex: 'segmentName'
        },
        {
            key: 'code',
            title: '构件编号',
            dataIndex: 'code',
            width: 120
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 200,
            dataIndex: 'materialName'
        },
        {
            key: 'structureTexture',
            title: '材质',
            width: 150,
            dataIndex: 'structureTexture',
        },
        {
            key: 'structureSpec',
            title: '规格',
            dataIndex: 'structureSpec',
            width: 200,
        },
        {
            key: 'materialStandardName',
            title: '标准',
            dataIndex: 'materialStandardName',
            width: 200,
        },
        {
            key: 'width',
            title: '宽度（mm）',
            width: 200,
            dataIndex: 'width'
        },
        {
            key: 'thickness',
            title: '厚度（mm）',
            width: 200,
            dataIndex: 'thickness'
        },
        {
            key: 'length',
            title: '长度（mm）',
            width: 200,
            dataIndex: 'length'
        },
        {
            key: 'basicsPartNum',
            title: '单段件数',
            width: 200,
            dataIndex: 'basicsPartNum'
        },
        {
            key: 'processNum',
            title: '加工数',
            width: 200,
            dataIndex: 'processNum'
        },
        {
            key: 'basicsWeight',
            title: '单件重量（kg）',
            width: 200,
            dataIndex: 'basicsWeight'
        },
        {
            key: 'totalWeight',
            title: '小计重量（kg）',
            width: 200,
            dataIndex: 'totalWeight'
        },
        {
            key: 'sumWeight',
            title: '总计重量（kg）',
            width: 200,
            dataIndex: 'sumWeight'
        },
        {
            key: 'holesNum',
            title: '单件孔数',
            width: 200,
            dataIndex: 'holesNum'
        },
        {
            key: 'totalHolesNum',
            title: '总孔数',
            width: 200,
            dataIndex: 'totalHolesNum'
        },
        {
            key: 'craftName',
            title: '工艺',
            width: 200,
            dataIndex: 'craftName'
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'apertureNumber',
            title: '各孔径孔数',
            width: 200,
            dataIndex: 'apertureNumber'
        },
        {
            key: 'weldingEdge',
            title: '焊接边（mm）',
            width: 200,
            dataIndex: 'weldingEdge',
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_ === -1 ? undefined : _}</span>
            )
        }
    ]

    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }

    const GeneratePDFPage = async () => {
        Modal.confirm({
            title: "生成PDF",
            icon: null,
            content: <Form form={form} layout='horizontal' labelCol={{ span: 4 }}>
                <Form.Item label='材料名称' name='materialNameList'>
                    <Select placeholder="请选择材料名称" mode='multiple' allowClear>
                        {materialDatas && materialDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='规格' name='structureSpecList'>
                    <Select placeholder="请选择规格" mode='multiple' allowClear>
                        {specDatas && specDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='材质' name='structureTextureList'>
                    <Select placeholder="请选择材质" mode='multiple' allowClear>
                        {textureDatas && textureDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='工艺' name='craftNameList'>
                    <Select placeholder="请选择工艺" mode='multiple' allowClear>
                        {craftDatas && craftDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="reset">重置</Button>
                </Form.Item>
            </Form>,
            onOk: () => new Promise(async (resolve, reject) => {
                try {
                    RequestUtil.post<any>(`/tower-science/supplyBatch/structure/page/print`, {
                        ...form?.getFieldsValue(true),
                        batchIssuedId: params?.id
                    }).then(res => {
                        console.log(res)
                        fetch(`http://127.0.0.1:2001/print`, {
                            mode: 'cors',
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(res, jsonStringifyReplace)
                        }).then((res) => {
                            console.log(res)
                            resolve(true);
                            // return res.blob();
                        })

                    })
                } catch (error) {
                    console.log(error)
                    reject(false)
                }
            }),
            onCancel() {
                form.resetFields()
            }
        })

    }

    const GeneratePDF = async () => {
        Modal.confirm({
            title: "生成PDF",
            icon: null,
            content: <Form form={form} layout='horizontal' labelCol={{ span: 4 }}>
                <Form.Item label='材料名称' name='materialNameList'>
                    <Select placeholder="请选择材料名称" mode='multiple' allowClear>
                        {materialDatas && materialDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='规格' name='structureSpecList'>
                    <Select placeholder="请选择规格" mode='multiple' allowClear>
                        {specDatas && specDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='材质' name='structureTextureList'>
                    <Select placeholder="请选择材质" mode='multiple' allowClear>
                        {textureDatas && textureDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='工艺' name='craftNameList'>
                    <Select placeholder="请选择工艺" mode='multiple' allowClear>
                        {craftDatas && craftDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="reset">重置</Button>
                </Form.Item>
            </Form>,
            onOk: () => new Promise(async (resolve, reject) => {
                try {
                    RequestUtil.post<any>(`/tower-science/supplyBatch/structure/print`).then(res => {
                        console.log(res)
                        fetch(`http://127.0.0.1:2001/print`, {
                            mode: 'cors',
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(res, jsonStringifyReplace)
                        }).then((res) => {
                            console.log(res)
                            resolve(true)
                            // return res.blob();
                        })

                    })
                } catch (error) {
                    console.log(error)
                    reject(false)
                }
            }),
            onCancel() {
                form.resetFields()
            }
        })

    }

    return (
        <Page
            path="/tower-science/supplyBatch/batchDetail"
            columns={columns}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            refresh={refresh}
            requestData={{ id: params.productCategoryId }}
            exportPath="/tower-science/supplyBatch/batchDetail"
            extraOperation={<Space>
                {/* <Button type='primary' ghost onClick={async () => {
                    await RequestUtil.post(`/tower-science/loftingBatch/downloadBatch/${params.productCategoryId}`);
                    message.success('更新成功！')
                    history.go(0)
                }} >更新下达明细</Button>
                <Button type='primary' ghost onClick={async () => {
                    await RequestUtil.post(`/tower-science/loftingBatch/refreshBatchDetailed/${params.productCategoryId}`);
                    message.success('刷新成功！')
                    history.go(0)
                }} >刷新件号数据</Button> */}
                <Button type="primary" onClick={GeneratePDFPage} ghost>打印PDF-分页</Button>
                <Button type="primary" onClick={GeneratePDF} ghost>打印PDF-不分页</Button>
                <Button type='primary' ghost onClick={() => history.goBack()} >返回上一级</Button>
            </Space>}
            searchFormItems={[
                {
                    name: 'materialName',
                    label: '材料名称',
                    children: <Select style={{ width: "100px" }} defaultValue={''}>
                        <Select.Option value={''} key={''}>全部</Select.Option>
                        {data && data?.map((item: any) => {
                            return <Select.Option key={item} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="" maxLength={200} />
                },
            ]}
        />
    )
}