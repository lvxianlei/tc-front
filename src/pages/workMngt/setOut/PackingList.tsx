/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-包装清单
*/

import React, { useRef, useState } from 'react';
import { Space, Button, Popconfirm, Spin, Modal, message, Form, Select } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil, { jsonStringifyReplace } from '../../../utils/RequestUtil';
import ExportList from '../../../components/export/list';
import { IBundle, ICount, IPackingList } from './ISetOut';
import { bundleColumns, columns } from './SetOutInformation.json';
import ApplyPacking, { EditProps } from './ApplyPacking';
import AuthUtil from '../../../utils/AuthUtil';
import { useForm } from 'antd/lib/form/Form';

export default function PackingList(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productId: string }>();
    const match = useRouteMatch();
    const [isExport, setIsExport] = useState(false);
    const [bundleData, setBundleData] = useState<IBundle[]>([]);
    const location = useLocation<{ status: number }>();
    const [loading1, setLoading1] = useState(false);
    const editRef = useRef<EditProps>();
    const [visible, setVisible] = useState<boolean>(false);
    const userId = AuthUtil.getUserInfo().user_id;
    const [form] = useForm();
    const [pageForm] = useForm();
    const [noPageVisible, setNoPageVisible] = useState<boolean>(false);
    const [pageVisible, setPageVisible] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    const { data: isShow } = useRequest<boolean>(() => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-science/productCategory/assign/user/list/${params.id}`);
            result.indexOf(userId) === -1 ? resole(false) : resole(true)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/packageStructure/${params.productId}`).then((res: any) => {
            return res
        }).catch(error => {
            setTimeout(() => {
                history.goBack();
            }, 500)
        });
        resole(data)
        if (data && data?.length > 0) {
            const resData: IPackingList = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/structure/list?id=${data[0]?.id}`);
            setBundleData([...(resData.packageRecordVOList || [])]);
        }
    }), {})
    const detailData: any = data;

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

    const { data: count } = useRequest<ICount>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<ICount>(`/tower-science/packageStructure/count/${params.productId}`);
        resole(data);
    }), {})

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const getBundleData = async (id: string) => {
        const resData: IPackingList = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/structure/list?id=${id}`);
        setBundleData([...(resData.packageRecordVOList || [])]);
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit();
            message.success('复用成功');
            setVisible(false);
            history.go(0);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    const GeneratePDFWeight = () => new Promise(async (resolve, reject) => {
        try {
            pageForm.validateFields().then(res => {
                setConfirmLoading(true)
                RequestUtil.get<any>(`/tower-science/packageStructure/packagePrint/${params.productId}?printerName=${pageForm.getFieldsValue(true)?.printerName}`).then(res => {
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
                RequestUtil.get<any>(`/tower-science/packageStructure/packagePrint/noWeight/${params.productId}?printerName=${form.getFieldsValue(true)?.printerName}`).then(res => {
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


    return <>
        <Modal
            visible={pageVisible}
            title="生成PDF-不带重量"
            onOk={GeneratePDFWeight}
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
                <Form.Item>
                    <Button htmlType="reset">重置</Button>
                </Form.Item>
            </Form>
        </Modal>
        <Modal
            visible={noPageVisible}
            title="生成PDF-带重量"
            onOk={GeneratePDF}
            onCancel={() => {
                setNoPageVisible(false);
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
        <Modal
            destroyOnClose
            visible={visible}
            title="套用包"
            width='70%'
            footer={<Space>
                <Button key="back" onClick={() => {
                    setVisible(false);
                }}>
                    关闭
                </Button>
                <Button type='primary' onClick={handleModalOk} ghost>复制</Button>
            </Space>}
            className={styles.tryAssemble}
            onCancel={() => {
                setVisible(false);
            }}>
            <ApplyPacking id={params.productId} detailData={detailData} ref={editRef} />
        </Modal>
        <Space direction="horizontal" size="small" className={styles.titleContent}>
            <span>塔型：
                <span className={styles.content}>{count?.productCategoryName}</span>
            </span>
            <span>杆号：
                <span className={styles.content}>{count?.productNumber}</span>
            </span>
            <span>已打包捆数：
                <span className={styles.content}>{count?.packageStructureCount}</span>
            </span>
            <span>总件数：
                <span className={styles.content}>{count?.count}</span>
            </span>
            <span>未打包件数：
                <span className={styles.content}>{count?.untreatedCount}</span>
            </span>
        </Space>
        <Space direction="horizontal" size="small" className={`${styles.padding16}`}>
            <Button type="primary" onClick={() => {
                setNoPageVisible(true);
                printerRun()
            }} ghost>生成PDF-带重量</Button>
            <Button type="primary" onClick={() => {
                setPageVisible(true);
                printerRun()
            }} ghost>生成PDF-不带重量</Button>
            <Button type="primary" onClick={() => setIsExport(true)} ghost>导出</Button>
            <Button type="primary" ghost onClick={() => setVisible(true)} disabled={!isShow}>套用包</Button>
            <Button type="primary" disabled={!isShow} onClick={() => {
                RequestUtil.post(`/tower-science/packageStructure/automatic/${params.id}/${params.productId}`).then(res => {
                    history.go(0)
                    message.success('自动打包成功');
                }).catch(error => {
                    console.log(error)
                })
            }} ghost>自动打包</Button>
            <Link to={{ pathname: `/workMngt/setOutList/poleInformation/${params.id}/packingList/${params.productId}/packingListNew`, state: { productCategoryName: detailData?.productCategoryName, productNumber: detailData?.productNumber } }}><Button type="primary" disabled={!isShow} ghost>添加</Button></Link>
            <Popconfirm
                title="确认完成?"
                onConfirm={() => {
                    setLoading1(true);
                    RequestUtil.post(`/tower-science/packageStructure/submit?productId=${params.productId}`).then(res => history.goBack()).catch(error => {
                        setLoading1(false);
                    })
                }}
                disabled={location.state?.status === 4 || !isShow}
                okText="确认"
                cancelText="取消"
            >
                <Button loading={loading1} disabled={location.state?.status === 4 || !isShow} type="primary">完成</Button>
            </Popconfirm>
            <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
        </Space>
        <DetailContent key="packinglist">
            <CommonTable
                haveIndex
                columns={[
                    ...columns,
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed: 'right' as FixedType,
                        width: 100,
                        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                            <Space direction="horizontal" size="small" className={styles.operationBtn}>
                                <Link to={`/workMngt/setOutList/poleInformation/${params.id}/packingList/${params.productId}/packingListSetting/${record.id}`}>
                                    <Button type="link" disabled={record.packStatus === 2 || !isShow}>编辑</Button>
                                </Link>
                                {/* 已接收不可删除 */}
                                <Popconfirm
                                    title="确认删除?"
                                    onConfirm={() => { RequestUtil.delete(`/tower-science/packageStructure?id=${record.id}`).then(res => history.go(0)) }}
                                    okText="确认"
                                    cancelText="取消"
                                    disabled={record.packStatus === 2 || !isShow}
                                >
                                    <Button type="link" disabled={record.packStatus === 2 || !isShow}>删除</Button>
                                </Popconfirm>
                            </Space>
                        )
                    }
                ]}
                style={{ marginBottom: '50px' }}
                dataSource={detailData}
                pagination={false}
                onRow={(record: Record<string, any>, index: number) => ({
                    onClick: async () => { getBundleData(record.id); }
                })} />
            <CommonTable
                dataSource={[...bundleData]}
                haveIndex
                columns={bundleColumns}
                pagination={false}
            />
        </DetailContent>
        {isExport ? <ExportList
            history={history}
            location={location}
            match={match}
            columnsKey={() => {
                let keys = [...columns]
                return keys
            }}
            current={detailData?.current || 1}
            size={detailData?.size || 10}
            total={detailData?.total || 0}
            url={`/tower-science/packageStructure/${params.productId}`}
            serchObj={{ productId: params.productId }}
            closeExportList={() => setIsExport(false)}
        /> : null}
    </>
}