/**
 * @author zyc
 * @copyright © 2022 
 * @description rd1.2 调拨
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, Descriptions, InputNumber, Input, Modal } from 'antd';
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './TowerLoftingAssign.module.less';
import { IAllot, ILoftingProductStructureVOS } from "./ISetOut";
import { RuleObject } from "antd/es/form";
import { StoreValue } from "antd/es/form/interface";
import { PlusOutlined } from "@ant-design/icons"

interface AllotModalProps {
    id: string;
    allotData: IAllot;
    status: number;
}

export default forwardRef(function AllotModal({ id, allotData,status }: AllotModalProps, ref) {
    const [form] = Form.useForm();
    const [visible,setVisible] = useState<boolean>(false)
    const [towerData,setTowerData] = useState<any[]>([])
    const [selectedRowKeys, setSelectedRowKeys]=useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows]=useState<any[]>([]);
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
            form.setFieldsValue({ ...allotData, loftingProductStructure: allotData?.loftingProductStructureVOS })
            resole(allotData)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })


    const { run: submitRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(`/tower-science/productStructure/getAllocation/submit`, postData);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(`/tower-science/productStructure/getAllocation/save`, postData);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await form.validateFields()
            await submitRun({
                productId: id,
                productCategory: data?.productCategory,
                productHeight: data?.productHeight,
                productCategoryName: data?.productCategoryName,
                productNumber: data?.productNumber,
                segmentInformation: data?.segmentInformation,
                productStructureSaveDTOList: form.getFieldsValue(true).loftingProductStructure
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })
    const onSave = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(async res => {

                await saveRun({
                    productId: id,
                    productCategory: data?.productCategory,
                    productHeight: data?.productHeight,
                    productCategoryName: data?.productCategoryName,
                    productNumber: data?.productNumber,
                    segmentInformation: data?.segmentInformation,
                    productStructureSaveDTOList: form.getFieldsValue(true).loftingProductStructure
                })
                resolve(true);
            })
        } catch (error) {
            reject(false)
        }
    })

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
            title: '数量',
            width: 120,
            dataIndex: 'basicsPartNum',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['loftingProductStructure', index, 'basicsPartNum']} rules={[{
                    required: true,
                    message:'请输入数量'
                    // validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                    //     if (value !== null && value !== undefined && value !== '') {
                    //         const data = form.getFieldsValue(true).loftingProductStructure;
                    //         let BasicsPartTotalNum = 0;
                    //         data?.filter((item: ILoftingProductStructureVOS) => { return record.codeRelation === item.codeRelation }).forEach((items: ILoftingProductStructureVOS) => { BasicsPartTotalNum += Number(items?.basicsPartNum) });
                    //         if (BasicsPartTotalNum > record.BasicsPartTotalNum) {
                    //             callback('关联段号数量和等于单段件数')
                    //         } else {
                    //             callback()
                    //         }
                    //     } else {
                    //         callback('请输入数量')
                    //     }
                    // }
                }
                ]}>
                    <InputNumber min={0} max={record.BasicsPartTotalNum} onBlur={() => {
                        form.validateFields()
                    }} disabled={data?.specialStatus === 2} size="small" />
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
                    <Input disabled={data?.specialStatus === 2} size="small" />
                </Form.Item>
            )
        }
        
    ]

    useImperativeHandle(ref, () => ({ onSave, onSubmit, resetFields }), [ref, onSave, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent style={{padding:'20px'}}>
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
                    <Descriptions.Item key={1} label="复用杆塔">
                        {status===4?data?.segmentInformation:
                            <Form.Item name='tower'>
                                <Input disabled addonAfter={
                                    <PlusOutlined onClick={async () => {
                                        // const value:any[] = await RequestUtil.get(``,{id:data?.id})
                                        // setTowerData(value)
                                        setVisible(true)
                                    }} />
                                }/>

                            </Form.Item>
                        }
                    </Descriptions.Item>
                </Descriptions>
                <p style={{ padding: "12px 0px", fontWeight: "bold", fontSize: '14PX' }}>特殊件号信息</p>
                <CommonTable
                    columns={columns}
                    pagination={false}
                    dataSource={data?.loftingProductStructureVOS} />
            </Form>
        </DetailContent>
        <Modal
            destroyOnClose
            visible={visible}
            title="复用杆塔"
            okText='保存'
            cancelText='关闭'
            onCancel={() => {
                setVisible(false)
            }}
            onOk={()=>{
                // RequestUtil.get(``,selectedRows)
                // form.setFieldsValue({

                // })
                setVisible(false)
            }}
        >
            <CommonTable dataSource={towerData} pagination={false} rowSelection={{
                selectedRowKeys: selectedRowKeys,
                onChange: (selectedRowKeys: React.Key[], selectedRows:any)=>{
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
            ]}/>
        </Modal>
    </Spin>
})

