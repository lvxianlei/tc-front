import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Select, Modal, message } from 'antd';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { CommonTable } from '../../common';
import RequestUtil, { jsonStringifyReplace } from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { downloadTemplate } from '../setOut/downloadTemplate';
import { useForm } from 'antd/lib/form/Form';

export default function ReleaseList(): React.ReactNode {
    const history = useHistory();
    const [filterValue, setFilterValue] = useState<any>({});
    const [form] = useForm();
    const [segmentDataSource, setSegmentDataSource] = useState<any[]>([]);
    const params = useParams<{ id: string, weldingId: string }>()
    const [visible, setVisible] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [pages, setPages] = useState<any>({
        current: 1,
        size: 20
    })
    const { loading, data, run } = useRequest<any[]>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/loftingBatch/getBatchWeld`, { ...pages, weldingId: params.weldingId, fuzzyMsg: data?.fuzzyMsg, id: params.id })
            const dataSource: any = result?.records?.length > 0 ? await RequestUtil.get(`/tower-science/loftingBatch/getBatchWeldStructure`, { segmentId: result?.records[0]?.id }) : [];
            setSegmentDataSource([...dataSource]);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [params.id] })

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

    const handleCHange = async (page: number, pageSize: number) => {
        setPages({
            ...params,
            size: pageSize,
            current: page
        })
    }

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
            width: 100,
            dataIndex: 'segmentName'
        },
        {
            key: 'mainPartId',
            title: '主件号',
            width: 100,
            dataIndex: 'mainPartId'
        },
        {
            key: 'processGroupNum',
            title: '加工组数',
            dataIndex: 'processGroupNum',
            width: 120
        },
        {
            key: 'weldGrade',
            title: '电焊等级',
            dataIndex: 'weldGrade',
            width: 120
        },
        {
            key: 'weldingTypeName',
            title: '电焊类型',
            dataIndex: 'weldingTypeName',
            width: 120
        },
        {
            key: 'singleGroupWeight',
            title: '单组重量（kg）',
            width: 100,
            dataIndex: 'singleGroupWeight'
        },
        {
            key: 'electricWeldingMeters',
            title: '电焊米数（mm）',
            width: 100,
            dataIndex: 'electricWeldingMeters',
        }
    ]
    const detailColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'code',
            title: '零部件号',
            width: 150,
            dataIndex: 'code'
        },
        {
            key: 'isMainPart',
            title: '是否主件',
            width: 150,
            dataIndex: 'isMainPart',
            render: (number: any) => {
                return number ? [0, '0'].includes(number) ? '否' : '是' : '-'
            }
        },
        {
            key: 'materialName',
            title: '材料',
            dataIndex: 'materialName',
            width: 120
        },
        {
            key: 'structureTexture',
            title: '材质',
            width: 200,
            dataIndex: 'structureTexture'
        },
        {
            key: 'structureSpec',
            title: '规格',
            width: 150,
            dataIndex: 'structureSpec',
        },
        {
            key: 'length',
            title: '长度（mm）',
            width: 150,
            dataIndex: 'length',
        },
        {
            key: 'width',
            title: '宽度（mm）',
            width: 150,
            dataIndex: 'width',
        },
        {
            key: 'singleNum',
            title: '单组件数',
            width: 150,
            dataIndex: 'singleNum',
        },
        {
            key: 'craftName',
            title: '工艺',
            width: 150,
            dataIndex: 'craftName',
        }
    ]

    const GeneratePDF = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(res => {
                setConfirmLoading(true)
                RequestUtil.get<any>(`/tower-science/loftingBatch/weld/${params.id}?printerName=${form.getFieldsValue(true)?.printerName}`).then(res => {
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

    return (
        <>
            <Modal
                visible={visible}
                title="生成PDF"
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
                    <Form.Item>
                        <Button htmlType="reset">重置</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Form layout="inline" style={{ margin: '20px' }} onFinish={async (values) => {
                console.log(values)
                setFilterValue(values)
                await run({
                    ...values
                })
            }}>
                <Form.Item label='模糊查询项' name='fuzzyMsg'>
                    <Input placeholder="" maxLength={200} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="reset">重置</Button>
                </Form.Item>
            </Form>
            {/* <Button  type="primary" onClick={() => setIsExport(true)} ghost>导出</Button> */}
            <Button style={{ margin: '0px 10px 20px 20px' }} type="primary" onClick={() => {
                downloadTemplate(`/tower-science/loftingBatch/downloadBatch`, '组焊', {
                    id: params.id,
                    fuzzyMsg: filterValue?.fuzzyMsg,
                    weldingId: params.weldingId
                }, false, 'array')
            }}>导出</Button>
            <Button type="primary" onClick={() => {
                setVisible(true);
                printerRun();
            }} ghost>打印PDF</Button>
            <Button style={{ margin: '0px 20px 0px 0px' }} onClick={() => history.goBack()} >返回</Button>
            <div style={{ display: 'flex', width: '100%' }} >
                <div style={{ width: '40%', padding: '0px 20px 20px 20px' }}>
                    <CommonTable
                        style={{ padding: "0" }}
                        loading={loading}
                        columns={columns}
                        rowKey={(item: any) => `${item.id}`}
                        pagination={{
                            current: pages?.current,
                            pageSize: pages?.size,
                            onChange: handleCHange
                        }}
                        onRow={(record: any) => ({
                            onClick: async (event: any) => {
                                const data: any = await RequestUtil.get(`/tower-science/loftingBatch/getBatchWeldStructure`, { segmentId: record.id });
                                setSegmentDataSource([...data]);
                            }
                        })}
                        dataSource={data as any || []}
                    />
                </div>
                <div style={{ width: '60%', paddingRight: '20px' }} >
                    <CommonTable columns={detailColumns} dataSource={segmentDataSource} pagination={false} />
                </div>
            </div>
        </>
    )
}