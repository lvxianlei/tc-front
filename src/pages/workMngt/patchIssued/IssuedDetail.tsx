import React, { useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Radio, Row, Select, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { Page, SearchTable } from '../../common';
import RequestUtil, { jsonStringifyReplace } from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { useForm } from 'antd/es/form/Form';
import { columns } from './patchIssued.json'
import styles from './PatchIssued.module.less';

export default function IssuedDetail(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const params = useParams<{ id: string, productCategoryId: string }>()
    const history = useHistory();
    const [form] = useForm();
    const [pageForm] = useForm();
    const [visible, setVisible] = useState<boolean>(false);
    const [pageVisible, setPageVisible] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [formTable] = useForm();

    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/material?current=1&size=1000`);
        const value: any = Array.from(new Set(data?.records.map((item: { materialCategoryName: any; }) => item.materialCategoryName)));
        resole(value);
    }))

    const { data: specDatas, run: specRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/supplyBatch/structure/spec/${params.id}`);
        resole(data || []);
    }), { manual: true })

    const { data: textureDatas, run: textureRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/supplyBatch/structure/texture/${params.id}`);
        resole(data || []);
    }), { manual: true })

    const { data: craftDatas, run: craftRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/supplyBatch/craft/name/${params.id}`);
        resole(data || []);
    }), { manual: true })

    const { data: materialDatas, run: materialRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/supplyBatch/material/name/${params.id}`);
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

    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }

    const GeneratePDFPage = () => new Promise(async (resolve, reject) => {
        try {
            pageForm.validateFields().then(res => {
                setConfirmLoading(true)
                RequestUtil.post<any>(`/tower-science/supplyBatch/structure/page/print`, {
                    ...pageForm?.getFieldsValue(true),
                    supplyBatchId: params?.id
                }).then(res => {
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
                RequestUtil.post<any>(`/tower-science/supplyBatch/structure/print`, {
                    ...form?.getFieldsValue(true),
                    supplyBatchId: params?.id
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
            <Form form={pageForm} layout='horizontal' labelCol={{ span: 4 }}>
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
            <Form form={form} layout='horizontal' labelCol={{ span: 4 }}>
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
                <Form.Item>
                    <Button htmlType="reset">重置</Button>
                </Form.Item>
            </Form>
        </Modal>
        <SearchTable
            path="/tower-science/supplyBatch/batchDetail"
            columns={[

                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    fixed: 'left' as FixedType,
                    render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...columns?.map(res => {
                    if (res?.dataIndex === "weldingEdge") {
                        return {
                            ...res,
                            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                                <span>{_ === -1 ? undefined : _}</span>
                            )
                        }
                    }
                    return res
                })
            ]}
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
                <Button type='primary' onClick={() => {
                    Modal.confirm({
                        title: "查找",
                        width: '40%',
                        icon: null,
                        content: <Form form={formTable} className={styles.searchForm} labelAlign="right" labelCol={{ span: 6 }} layout="inline">
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label='段名' name='loftingMoreScreenDTO.segmentName'>
                                        <Input placeholder="请输入" maxLength={200} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='部件号' name='loftingMoreScreenDTO.code'>
                                        <Input placeholder="请输入" maxLength={200} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='材料' name='loftingMoreScreenDTO.materialName'>
                                        <Select placeholder="请选择材料名称" allowClear>
                                            {materialDatas && materialDatas.map((item, index) => {
                                                return <Select.Option key={index} value={item}>
                                                    {item}
                                                </Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='材质' name='loftingMoreScreenDTO.structureTexture'>
                                        <Select placeholder="请选择材质" mode='multiple' allowClear>
                                            {textureDatas && textureDatas.map((item, index) => {
                                                return <Select.Option key={index} value={item}>
                                                    {item}
                                                </Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='规格从' name='loftingMoreScreenDTO.structureSpecTop'>
                                        <Select placeholder="请选择规格" allowClear defaultValue={''} >
                                            {specDatas && specDatas.map((item, index) => {
                                                return <Select.Option key={index} value={item}>
                                                    {item}
                                                </Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='规格至' name='loftingMoreScreenDTO.structureSpecAfter'>
                                        <Select placeholder="请选择规格" allowClear defaultValue={''} >
                                            {specDatas && specDatas.map((item, index) => {
                                                return <Select.Option key={index} value={item}>
                                                    {item}
                                                </Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='电焊' name='loftingMoreScreenDTO.electricWelding'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='特殊件号' name='loftingMoreScreenDTO.specialCode'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='切角' name='loftingMoreScreenDTO.chamfer'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='火曲' name='loftingMoreScreenDTO.bend'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='铲背' name='loftingMoreScreenDTO.shovelBack'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='清根' name='loftingMoreScreenDTO.rootClear'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='开合角' name='loftingMoreScreenDTO.openCloseAngle'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='打扁' name='loftingMoreScreenDTO.squash'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='钻孔' name='loftingMoreScreenDTO.perforate'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='坡口' name='loftingMoreScreenDTO.groove'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='冲孔' name='punching'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='扩孔' name='loftingMoreScreenDTO.withReaming'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='气割孔' name='loftingMoreScreenDTO.gasCutting'>
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item>
                                        <Button htmlType='reset'>重置</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>,
                        onOk: () => new Promise(async (resolve, reject) => {
                            try {
                                const value = await formTable.getFieldsValue(true)
                                setFilterValue({
                                    ...value
                                })
                                resolve(true)
                            } catch (error) {
                                reject(false)
                            }
                        }),
                        onCancel() {
                            formTable.resetFields()
                        }

                    })
                }} ghost>高级查找</Button>
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
    </>
    )
}