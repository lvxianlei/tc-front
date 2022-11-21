import React, { useState } from 'react';
import { Button, Form, Input, message, Modal, Select, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common';
import RequestUtil, { jsonStringifyReplace } from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { useForm } from 'antd/lib/form/Form';

export default function ReleaseList(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [materialNames, setMaterialNames] = useState([]);
    const params = useParams<{ id: string, productCategoryId: string }>()
    const history = useHistory();
    const [form] = useForm();
    const [pageForm] = useForm();
    const [visible, setVisible] = useState<boolean>(false);
    const [pageVisible, setPageVisible] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/material?current=1&size=1000`);
        const value: any = Array.from(new Set(data?.records.map((item: { materialCategoryName: any; }) => item.materialCategoryName)));
        console.log(value)
        setMaterialNames(value)
        resole(value);
    }))

    const { data: specDatas, run: specRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/loftingBatch/structure/spec/${params.id}`);
        resole(data || []);
    }), { manual: true })

    const { data: textureDatas, run: textureRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/loftingBatch/structure/texture/${params.id}`);
        resole(data || []);
    }), { manual: true })

    const { data: craftDatas, run: craftRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/loftingBatch/craft/name/${params.id}`);
        resole(data || []);
    }), { manual: true })

    const { data: materialDatas, run: materialRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/loftingBatch/material/name/${params.id}`);
        resole(data || []);
    }), { manual: true })


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
            key: 'repeatNum',
            title: '段重复数',
            width: 150,
            dataIndex: 'repeatNum'
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
            key: 'assembleNum',
            title: '试装数',
            width: 200,
            dataIndex: 'assembleNum'
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

    const GeneratePDFPage = () => new Promise(async (resolve, reject) => {
        try {
            setConfirmLoading(true)
            RequestUtil.post<any>(`/tower-science/loftingBatch/structure/print/page`, {
                ...pageForm?.getFieldsValue(true),
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
                    setConfirmLoading(false)
                    resolve(true)
                    // return res.blob();
                }).catch(e => {
                    setConfirmLoading(false)
                    console.log(e)
                    reject(false)
                })
            }).catch(e => {
                setConfirmLoading(false)
                console.log(e)
                reject(false)
            })
        } catch (error) {
            setConfirmLoading(false)
            console.log(error)
            reject(false)
        }
    })

    const GeneratePDF = () => new Promise(async (resolve, reject) => {
        setConfirmLoading(true)
        try {
            RequestUtil.post<any>(`/tower-science/loftingBatch/structure/print`, {
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
                    setConfirmLoading(false)
                    resolve(true)
                    // return res.blob();
                }).catch(e => {
                    setConfirmLoading(false)
                    console.log(e)
                    reject(false)
                })

            }).catch(e => {
                setConfirmLoading(false)
                console.log(e)
                reject(false)
            })
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })

    return (<>
        <Modal
            visible={pageVisible}
            title="生成PDF-分页"
            onOk={GeneratePDFPage}
            onCancel={() => {
                setPageVisible(false);
                pageForm.resetFields()
            }}
        >
            <Form form={pageForm} layout='horizontal' labelCol={{ span: 4 }}>
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
            </Form>
        </Modal>
        <Modal
            visible={visible}
            title="生成PDF-不分页"
            onOk={GeneratePDF}
            onCancel={() => {
                setVisible(false);
                form.resetFields()
            }}
        >
            <Form form={form} layout='horizontal' labelCol={{ span: 4 }}>
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
            </Form>
        </Modal>
        <Page
            path="/tower-science/loftingBatch/batchDetail"
            columns={columns}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            refresh={refresh}
            requestData={{ productCategoryId: params.productCategoryId, id: params.id }}
            exportPath="/tower-science/loftingBatch/batchDetail"
            extraOperation={<Space>
                <Button type="primary" onClick={() => {
                    specRun();
                    craftRun();
                    textureRun();
                    materialRun();
                    setPageVisible(true);
                }} ghost>打印PDF-分页</Button>
                <Button type="primary" onClick={() => {
                    specRun();
                    craftRun();
                    textureRun();
                    materialRun();
                    setVisible(true);
                }} ghost>打印PDF-不分页</Button>
                <Button type='primary' ghost onClick={async () => {
                    await RequestUtil.post(`/tower-science/loftingBatch/downloadBatch/${params.id}`);
                    message.success('更新成功！')
                    history.go(0)
                }} >更新下达明细</Button>
                <Button type='primary' ghost onClick={async () => {
                    await RequestUtil.post(`/tower-science/loftingBatch/refreshBatchDetailed/${params.id}`);
                    message.success('刷新成功！')
                    history.go(0)
                }} >刷新件号数据</Button>
                <Button type='primary' ghost onClick={() => history.goBack()} >返回上一级</Button>
            </Space>}
            searchFormItems={[
                {
                    name: 'materialName',
                    label: '材料名称',
                    children: <Select style={{ width: "100px" }} defaultValue={''}>
                        <Select.Option value={''} key={''}>全部</Select.Option>
                        {materialNames && materialNames.map((item: any) => {
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
    </>
    )
}