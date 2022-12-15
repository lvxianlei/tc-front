/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-绩效奖励明细-奖励明细配置
 */

import React, { forwardRef, useState } from "react";
import { Button, Form, Input, InputNumber, message, Modal } from 'antd';
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './GenerationOfMaterial.module.less';
import { FixedType } from 'rc-table/lib/interface';
import SelectUser from "../../common/SelectUser";

interface modalProps {

}

export default forwardRef(function RewardDetailsConfiguration({ }: modalProps, ref) {
    const [form] = Form.useForm();
    const [otherForm] = Form.useForm();
    const [detailData, setDetailData] = useState<any>([])
    const [otherData, setOtherData] = useState<any>([])

    const columns= [
       {
           "key": "loftingTaskNumber",
           "title": "奖励条目",
           "width": 120,
           "dataIndex": "loftingTaskNumber"
       },
       {
           "key": "productCategoryName",
           "title": "参数1",
           "dataIndex": "productCategoryName",
           "width": 80
       },
       {
           "key": "productTypeName",
           "title": "参数2",
           "dataIndex": "productTypeName",
           "width": 80
       },
       {
           "key": "wasteStructureNum",
           "title": "参数3",
           "dataIndex": "wasteStructureNum",
           "width": 120
       },
       {
           "key": "wasteNum",
           "title": "参数4",
           "dataIndex": "wasteNum",
           "width": 120
       },
       {
           "key": "penaltyAmount",
           "title": "参数5",
           "dataIndex": "penaltyAmount",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "参数6",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "参数7",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "参数8",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "参数9",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "参数10",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "参数11",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "参数12",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "奖励金额",
           "dataIndex": "rejectWeight",
           "width": 120,
           "type": "number"
       }
   ]

   const otherColumns= [
    {
        "key": "loftingTaskNumber",
        "title": "配置条目",
        "width": 120,
        "dataIndex": "loftingTaskNumber"
    },
    {
        "key": "productCategoryName",
        "title": "参数1",
        "dataIndex": "productCategoryName",
        "width": 80
    },
    {
        "key": "productTypeName",
        "title": "参数2",
        "dataIndex": "productTypeName",
        "width": 80
    },
    {
        "key": "rejectWeight",
        "title": "状态",
        "dataIndex": "rejectWeight",
        "width": 120
    }
]

    const { loading, data, run } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            // const result: any = await RequestUtil.get(``);
            setDetailData([{
                id: '45555'
            }])
            resole(true)
        } catch (error) {
            reject(error)
        }
    }), { })

    const { run: otherRun } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            // const result: any = await RequestUtil.get(``);
            setOtherData([{
                id: '45555'
            }])
            resole(true)
        } catch (error) {
            reject(error)
        }
    }), { })

    const onSave = () => new Promise(async (resolve, reject) => {
        try {
           form.validateFields().then(async res => {
            const values = await form.getFieldsValue(true);
            console.log(values)
            resolve(true);
           })
        } catch (error) {
            reject(false)
        }
    })

    const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(``, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            await submitRun({
                ...value
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const { run: submitRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(``, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return <DetailContent>
       <CommonTable 
       haveIndex
       dataSource={detailData}
       columns={[
        ...columns, 
        {
            "key": "rejectWeight",
            "title": "状态",
            "dataIndex": "rejectWeight",
            "width": 120,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Button type="link" onClick={() => {
                    RequestUtil.post(``, data).then( res => {
                        message.success('状态变更成功！');
                        run();
                    })
                }}>{record?.status === 1 ? '启用' : '停用'}</Button>
            )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Button type="link" onClick={() => {
                    Modal.confirm({
                        title: '编辑',
                        content:<Form form={form}>
                                <Form.Item label="奖励金额" name="money" rules={[{
                                    required: true,
                                    message: '请输入奖励金额！'
                                }]}>
                                    <InputNumber style={{width: '100%'}} max={9999.99}/>
                                </Form.Item>
                            </Form>,
                            onOk: onSave,
                            onCancel: () => {
                                form.resetFields();
                            }
                    })
                }}>编辑</Button>
            )
       }
       ]}
       pagination={false}
       />
       <DetailTitle title={"其他配置"}/>
       <CommonTable 
       haveIndex
       dataSource={otherData}
       columns={[
        ...otherColumns, 
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Button type="link" onClick={() => {
                    Modal.confirm({
                        title: '编辑',
                        content:<Form form={otherForm}>
                            
                                <Form.Item label="参数1" name="money" rules={[{
                                    required: true,
                                    message: '请输入参数1！'
                                }]}>
                                    <Input size="small" disabled suffix={
                                                <SelectUser
                                                    key={'loftingLeader'}
                                                    selectedKey={[otherForm?.getFieldsValue(true)?.loftingLeader]}
                                                    onSelect={(selectedRows: Record<string, any>) => {
                                                        otherForm.setFieldsValue({
                                                            loftingLeader: selectedRows[0]?.userId,
                                                            loftingLeaderName: selectedRows[0]?.name
                                                        })
                                                    }} />
                                            } />
                                </Form.Item>
                            </Form>,
                            onOk: onSubmit,
                            onCancel: () => {
                                otherForm.resetFields();
                            }
                    })
                }}>编辑</Button>
            )
       }
       ]}/>
    </DetailContent>
})