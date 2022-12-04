import React, { useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Radio, Row, Select, Space } from 'antd';
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
    const { loading } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/material?current=1&size=1000`);
        const value: any = Array.from(new Set(data?.records.map((item: { materialCategoryName: any; }) => item.materialCategoryName)));
        setMaterialNames(value)
        resole(value);
    }))

    const { data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get(`/tower-science/loftingBatch/batchDetailCount`, {
            ...filterValue
        });
        resole(result);
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

    const { data: printerDatas, run: printerRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        fetch(`http://127.0.0.1:2001/getprinters`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res: any) => {
            return res.json();
        }).then(data => {
            resole(data.Data);
        })
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
        },
        {
            "key": "electricWelding",
            "title": "电焊",
            "dataIndex": "electricWelding",
            "width": 130
        },
        {
            "key": "groove",
            "title": "坡口",
            "dataIndex": "groove",
            "width": 130
        },
        {
            "key": "chamfer",
            "title": "切角",
            "dataIndex": "chamfer",
            "width": 130
        },
        {
            "key": "openCloseAngle",
            "title": "开合角",
            "dataIndex": "openCloseAngle",
            "width": 130
        },
        {
            "key": "bend",
            "title": "火曲",
            "dataIndex": "bend",
            "width": 130
        },
        {
            "key": "shovelBack",
            "title": "铲背",
            "dataIndex": "shovelBack",
            "width": 130
        },
        {
            "key": "rootClear",
            "title": "清根",
            "dataIndex": "rootClear",
            "width": 130
        },
        {
            "key": "squash",
            "title": "打扁",
            "dataIndex": "squash",
            "width": 130
        },
        {
            "key": "specialCode",
            "title": "特殊件号",
            "dataIndex": "specialCode",
            "width": 130
        },
        {
            "key": "suppress",
            "title": "压制",
            "dataIndex": "suppress",
            "width": 130
        },
        {
            "key": "grooveMeters",
            "title": "坡口米数（米）",
            "dataIndex": "grooveMeters",
            "width": 130
        },
        {
            "key": "spellNumber",
            "title": "拼数",
            "dataIndex": "spellNumber",
            "width": 130
        },
        {
            "key": "slottedForm",
            "title": "开槽形式",
            "dataIndex": "slottedForm",
            "width": 130
        },
        {
            "key": "intersectingLine",
            "title": "相贯线",
            "dataIndex": "intersectingLine",
            "width": 130
        },
        {
            "key": "type",
            "title": "零件类型",
            "dataIndex": "type",
            "width": 130
        },
        {
            "key": "description",
            "title": "备注",
            "dataIndex": "description",
            "width": 130
        },
        {
            "key": "arcContaining",
            "title": "含弧",
            "dataIndex": "arcContaining",
            "width": 130
        },
        {
            "key": "perforate",
            "title": "钻孔",
            "dataIndex": "perforate",
            "width": 130
        },
        {
            "key": "perforateNumber",
            "title": "钻孔孔径孔数",
            "dataIndex": "perforateNumber",
            "width": 130
        },
        {
            "key": "withReaming",
            "title": "扩孔",
            "dataIndex": "withReaming",
            "width": 130
        },
        {
            "key": "reamingNumber",
            "title": "扩孔孔径孔数",
            "dataIndex": "reamingNumber",
            "width": 130
        },
        {
            "key": "gasCutting",
            "title": "气割孔（0/1）",
            "dataIndex": "gasCutting",
            "width": 130
        },
        {
            "key": "gasCuttingNumber",
            "title": "气割孔孔径孔数",
            "dataIndex": "gasCuttingNumber",
            "width": 130
        },
        {
            "key": "basicsWeight",
            "title": "单件重量（kg）",
            "dataIndex": "basicsWeight",
            "width": 130
        },
        {
            "key": "totalWeight",
            "title": "总重（kg）",
            "dataIndex": "totalWeight",
            "width": 130
        },
        {
            "key": "craftName",
            "title": "工艺列（核对）",
            "dataIndex": "craftName",
            "width": 130
        },
        {
            "key": "sides",
            "title": "边数",
            "dataIndex": "sides",
            "width": 130
        },
        {
            "key": "perimeter",
            "title": "周长",
            "dataIndex": "perimeter",
            "width": 130
        },
        {
            "key": "surfaceArea",
            "title": "表面积(m²)",
            "dataIndex": "surfaceArea",
            "width": 130
        }
    ]

    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }

    const GeneratePDFPage = () => new Promise(async (resolve, reject) => {
        try {
            pageForm.validateFields().then(res => {
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
                        return res?.json();
                    }).then((res) => {
                        res?.Msg === '' ? message.success('打印成功') : message.success(res?.Msg)
                        resolve(true)
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
            })
        } catch (error) {
            setConfirmLoading(false)
            console.log(error)
            reject(false)
        }
    })

    const GeneratePDF = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(res => {
                setConfirmLoading(true)
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
                        return res?.json();
                    }).then((res) => {
                        res?.Msg === '' ? message.success('打印成功') : message.success(res?.Msg)
                        resolve(true)
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
            confirmLoading={confirmLoading}
        >
            <Form form={pageForm} layout='horizontal' labelCol={{ span: 6 }}>
                <Form.Item label='打印机' name='printerName' rules={[{
                    required: true,
                    message: '请选择打印机'
                }]}>
                    <Select placeholder="请选择打印机">
                        {printerDatas && printerDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
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
                <Form.Item label='钢板件号汇总打印' name='summaryType' initialValue={1}>
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
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
            confirmLoading={confirmLoading}
        >
            <Form form={form} layout='horizontal' labelCol={{ span: 6 }}>
                <Form.Item label='打印机' name='printerName' rules={[{
                    required: true,
                    message: '请选择打印机'
                }]}>
                    <Select placeholder="请选择打印机">
                        {printerDatas && printerDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
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
                <Form.Item label='钢板件号汇总打印' name='summaryType' initialValue={1}>
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
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
                <Row gutter={12}>
                    <Col>重量：<span>{data?.totalWeight}</span></Col>
                    <Col>件号数：<span>{data?.totalNumberCount}</span></Col>
                    <Col>件数：<span>{data?.totalCount}</span></Col>
                    <Col>孔数：<span>{data?.totalHolesNum}</span></Col>
                    <Col>切角数量：<span>{data?.totalChamfer}</span></Col>
                </Row>
                <Button type="primary" onClick={() => {
                    specRun();
                    craftRun();
                    textureRun();
                    materialRun();
                    setPageVisible(true);
                    printerRun();
                }} ghost>打印PDF-分页</Button>
                <Button type="primary" onClick={() => {
                    specRun();
                    craftRun();
                    textureRun();
                    materialRun();
                    setVisible(true);
                    printerRun();
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
                    name: 'materialName',
                    label: '规格',
                    children: <Select placeholder="请选择规格" allowClear defaultValue={''} >
                        <Select.Option value={''} key={''}>全部</Select.Option>
                        {specDatas && specDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'materialName',
                    label: '材质',
                    children: <Select style={{ width: "100px" }} defaultValue={''}>
                        <Select.Option value={''} key={''}>全部</Select.Option>
                        {textureDatas && textureDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'materialName',
                    label: '工艺',
                    children: <Select style={{ width: "100px" }} defaultValue={''}>
                        <Select.Option value={''} key={''}>全部</Select.Option>
                        {craftDatas && craftDatas.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="" maxLength={200} />
                }
            ]}
        />
    </>
    )
}