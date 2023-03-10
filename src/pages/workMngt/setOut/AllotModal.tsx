/**
 * @author zyc
 * @copyright © 2022 
 * @description rd1.2 特殊件号(调拨)
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, Descriptions, InputNumber, Input, Modal, Button } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './TowerLoftingAssign.module.less';
import { IAllot, ILoftingProductStructureVOS } from "./ISetOut";

interface AllotModalProps {
    id: string;
    allotData: IAllot;
    status: number | string;
    getLoading: (loading: boolean) => void
}

export default forwardRef(function AllotModal({ id, allotData, status, getLoading }: AllotModalProps, ref) {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [towerData, setTowerData] = useState<any[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [checkRowKeys, setCheckRowKeys] = useState<any[]>([]);
    const [checkRows, setCheckRows] = useState<any[]>([]);
    const [msgData, setMsgData] = useState<any>();
    const { loading, data } = useRequest<IAllot>(() => new Promise(async (resole, reject) => {
        try {
            allotData = {
                ...allotData,
                loftingProductStructureVOS: allotData?.loftingProductStructureVOS?.map((res: ILoftingProductStructureVOS) => {
                    // let BasicsPartTotalNum = 0;
                    // allotData?.loftingProductStructureVOS?.filter(item => { return res.codeRelation === item.codeRelation }).forEach((items: ILoftingProductStructureVOS) => { BasicsPartTotalNum = Number(items?.basicsPartNum) });
                    return {
                        ...res,
                        basicsPartNum: res.basicsPartNum || '0',
                        BasicsPartTotalNum: res.specialBasicsPartNum
                    }
                })
            }
            const towerData: any = await RequestUtil.get(`/tower-science/product/lofting?page=1&size=1000&productCategoryId=${allotData.productCategory}&productId=${id}`)
            setTowerData(towerData?.records.filter((item: any) => {
                return item.isSpecial === 1 && item.isSpecial !== null && item.specialStatus !== 2
            }))
            setMsgData(allotData?.loftingProductStructureVOS || [])
            form.setFieldsValue({ ...allotData, loftingProductStructure: allotData?.loftingProductStructureVOS })
            resole(allotData)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id, allotData, status] })

    const { run: visibleData } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            form.setFieldsValue({ ...allotData, loftingProductStructure: allotData?.loftingProductStructureVOS })
            resole(true)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: submitRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            RequestUtil.post(`/tower-science/productStructure/getAllocation/submit`, postData).then(res => {
                resole(true)
                getLoading(false)
            }).catch(e => {
                getLoading(false)
                reject(e)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onCheck = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await form.validateFields()
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await form.validateFields()
            getLoading(true)
            await submitRun({
                // productId: id,
                // productCategory: data?.productCategory,
                // productHeight: data?.productHeight,
                // productCategoryName: data?.productCategoryName,
                // productNumber: data?.productNumber,
                // segmentInformation: data?.segmentInformation,
                productIds: [id, ...selectedRowKeys],
                productStructureSaveDTOList: form.getFieldsValue(true).loftingProductStructure
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    // const onSave = () => new Promise(async (resolve, reject) => {
    //     try {

    //         form.validateFields().then(async res => {

    //             await saveRun({
    //                 // productId: id,
    //                 // productCategory: data?.productCategory,
    //                 // productHeight: data?.productHeight,
    //                 // productCategoryName: data?.productCategoryName,
    //                 // productNumber: data?.productNumber,
    //                 // segmentInformation: data?.segmentInformation,
    //                 productIds: [id,...selectedRowKeys],
    //                 productStructureSaveDTOList: form.getFieldsValue(true).loftingProductStructure
    //             })
    //             resolve(true);
    //         })
    //     } catch (error) {
    //         reject(false)
    //     }
    // })

    const resetFields = () => {
        form.resetFields();
    }

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
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
            title: '构件号',
            width: 120,
            dataIndex: 'code'
        },
        {
            key: 'BasicsPartTotalNum',
            title: '单段件数',
            width: 120,
            dataIndex: 'BasicsPartTotalNum'
        },
        {
            key: 'basicsPartNum',
            title: '单基数量',
            width: 120,
            dataIndex: 'basicsPartNum',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['loftingProductStructure', index, 'basicsPartNum']} rules={[{
                    required: true,
                    message: '请输入数量'
                    // validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                    //     if (value !== null && value !== undefined && value !== '') {
                    // const data = form.getFieldsValue(true).loftingProductStructure;
                    // let BasicsPartTotalNum = 0;
                    // data?.filter((item: ILoftingProductStructureVOS) => { return record.codeRelation === item.codeRelation }).forEach((items: ILoftingProductStructureVOS) => { BasicsPartTotalNum += Number(items?.basicsPartNum) });
                    // if (parseInt(value) < parseInt(record.weldingNum)) {
                    //     callback(`需要大于或等于电焊件中包含数${record.weldingNum}`)
                    // } else {
                    //     callback()
                    // }
                    //     } else {
                    //         callback('请输入数量')
                    //     }
                    // }
                }
                ]}>
                    {/* <InputNumber min={0} max={record.BasicsPartTotalNum} onBlur={() => {
                        form.validateFields()
                    }} disabled={data?.specialStatus === 2} size="small" /> */}

                    <InputNumber min={0} max={99} size="small" onChange={() => {
                        const data = form?.getFieldsValue(true)?.loftingProductStructure;
                        setMsgData([...data])
                    }} />
                </Form.Item>
            )
        },
        {
            key: 'description',
            title: '备注',
            width: 150,
            dataIndex: 'description',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['loftingProductStructure', index, 'description']}>
                    <Input maxLength={20} size="small" />
                </Form.Item>
            )
        }

    ]

    useImperativeHandle(ref, () => ({ selectedRowKeys, onCheck, onSubmit, resetFields, visibleData }), [ref, selectedRowKeys, onCheck, onSubmit, resetFields, visibleData]);
    return <Spin spinning={loading}>
        <DetailContent style={{ padding: '20px' }}>
            <Form form={form} className={styles.descripForm}>
                <p style={{ paddingBottom: "12px", fontWeight: "bold", fontSize: '14PX' }}>基础信息</p>
                <Descriptions title="" bordered size="small" colon={false} column={4}>
                    <Descriptions.Item key={1} label="杆塔号">
                        {data?.productNumber}
                    </Descriptions.Item>
                    <Descriptions.Item key={1} label="呼高">
                        {data?.productHeight || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item key={2} label="配段信息">
                        {data?.segmentInformation}
                    </Descriptions.Item>
                    <Descriptions.Item key={3} label="复用杆塔">
                        <Button onClick={async () => {
                            setSelectedRowKeys(checkRowKeys)
                            setVisible(true)
                        }} type='link'>请选择</Button>
                    </Descriptions.Item>
                </Descriptions>
                <p style={{ padding: "12px 0px", fontWeight: "bold", fontSize: '14PX' }}>特殊件号信息</p>
                <CommonTable
                    columns={columns}
                    pagination={false}
                    onRow={(record: Record<string, any>) => ({
                        className: record.basicsPartNum == 0 ?
                            undefined : styles.row_color_1
                    })}
                    dataSource={msgData || []} />
            </Form>
        </DetailContent>
        <Modal
            destroyOnClose
            visible={visible}
            title="复用杆塔"
            okText='保存'
            cancelText='关闭'
            onCancel={() => {
                setSelectedRows([])
                setSelectedRowKeys([])
                setVisible(false)
            }}
            onOk={() => {
                setCheckRowKeys(selectedRowKeys)
                setCheckRows(selectedRows)
                setVisible(false)
            }}
        >
            <CommonTable dataSource={towerData} pagination={false} rowSelection={{
                selectedRowKeys: selectedRowKeys,
                onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
                    setSelectedRowKeys(selectedRowKeys);
                    setSelectedRows(selectedRows)
                }
            }} columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    key: 'index',
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                {
                    title: '杆塔号',
                    dataIndex: 'productNumber',
                    key: 'productNumber'
                },
                {
                    title: '呼高',
                    dataIndex: 'productHeight',
                    key: 'productHeight'
                }
            ]} />
        </Modal>
    </Spin>
})

