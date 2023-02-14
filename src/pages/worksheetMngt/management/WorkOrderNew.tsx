/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理-人工创建工单/编辑
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Form, Input, InputNumber, Select, Space, Spin } from 'antd';
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './Management.module.less'

interface modalProps {
    type: 'new' | 'edit';
    rowId: string;
    getLoading: (loading: boolean) => void
}

export default forwardRef(function WorkOrderNew({ type, rowId, getLoading }: modalProps, ref) {
    const [form] = Form.useForm();
    const [dealList, setDealList] = useState<any[]>([]);
    const [customList, setCustomList] = useState<any[]>([]);

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(`/tower-work/workOrder/${rowId}`);
        form.setFieldsValue({
            workTemplateId: result?.workTemplateName + ',' + result?.workTemplateId,
            node: [...result?.workOrderNodeVOList || []]
        })
        setDealList(result?.workOrderNodeVOList);
        setCustomList(result?.workOrderCustomDetailsVOList)
        resole(result);
    }), { manual: type === 'new', refreshDeps: [rowId, type] })

    const { data: templateList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-work/template?size=1000`);
            const newData = result?.records?.filter((res: any) => res?.status === 1)
            resole(newData)
        } catch (error) {
            reject(error)
        }
    }))

    const columns = [
        {
            key: 'node',
            title: '层级',
            dataIndex: 'node',
            width: 100
        },
        {
            key: 'pattern',
            title: '模式',
            dataIndex: 'pattern',
            width: 100
        },
        {
            key: 'upstreamNode',
            title: '上游节点',
            dataIndex: 'upstreamNode',
            width: 100
        },
        {
            key: 'agingType',
            title: '时效类型',
            dataIndex: 'agingType',
            width: 100
        },
        {
            key: 'agingSize',
            title: '时效',
            dataIndex: 'agingSize',
            width: 100,
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['node', index, 'agingSize']} rules={[{
                    required: true,
                    message: '请输入时效要求'
                }]} initialValue={_}>
                    <InputNumber size="small" onChange={
                        (e) => {
                            dealList[index] = {
                                ...dealList[index],
                                agingSize: e
                            }
                            setDealList([...dealList])
                        }
                    } placeholder="请输入时效要求" style={{ width: '100%' }} min={1} max={99} precision={0} />
                </Form.Item>
            )
        },
        {
            key: 'processingName',
            title: '处理名称',
            dataIndex: 'processingName',
            width: 100
        },
        {
            key: 'postName',
            title: '岗位',
            dataIndex: 'postName',
            width: 100
        },
        // {
        //     key: 'colour',
        //     title: '颜色',
        //     dataIndex: 'colour',
        //     width: 100,
        //     render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
        //         <Space>
        //             <div className={styles.color_set_show} style={{ backgroundColor: _ }}></div>
        //             <div>{_}</div>
        //         </Space>
        //     )
        // }
    ]

    const customColumns = [
        {
            key: 'sort',
            title: '排序',
            dataIndex: 'sort'
        },
        {
            key: 'fieldKey',
            title: '字段名称',
            dataIndex: 'fieldKey'
        },
        {
            key: 'required',
            title: '是否必填',
            dataIndex: 'required',
            type: "select",
            enum: [
                {
                    value: 0,
                    label: "否"
                },
                {
                    value: 1,
                    label: "是"
                }
            ]
        },
        {
            key: 'workOrderNode',
            title: '所属节点',
            dataIndex: 'workOrderNode'
        }
    ]

    const { run: saveRun } = useRequest((data: any) => new Promise(async (resove, reject) => {
        try {
            await RequestUtil.post(type === 'new' ? `/tower-work/workOrder/createWorkOrderArtificial` : `/tower-work/workOrder/saveWorkOrder`, data).then(res => {
                resove(true)
            }).catch(e => {
                getLoading(false)
                reject(e)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(res => {
                const value = form.getFieldsValue(true);
                getLoading(true)
                saveRun({
                    id: data?.id,
                    workTemplateId: value?.workTemplateId.split(',')[1],
                    workTemplateName: value?.workTemplateId.split(',')[0],
                    workOrderNodeDTOList: dealList,
                    workOrderCustomDTOList: customList
                })
                resolve(true);
            })
        } catch (error) {
            reject(false)
        }
    })

    const templateChange = async (e: any) => {
        const result: any = await RequestUtil.get<any>(`/tower-work/template/${e?.split(',')[1]}`);
        setCustomList(result?.templateCustomVOList);
        setDealList(result?.templateNodeVOList?.map((res: any) => {
            return {
                ...res,
                agingSizeTemplate: res?.agingSize
            }
        }));
    }

    const resetFields = () => {
        form.resetFields()
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent key='WorkOrderTemplateNew' className={styles.workOrderTemplateNew}>
            <Form form={form} layout="horizontal" labelCol={{ span: 4 }} labelAlign="right">
                <Form.Item
                    name={'workTemplateId'}
                    label={'工单模板'}
                    rules={[
                        {
                            required: true,
                            message: `请选择工单模板`
                        }
                    ]}>
                    <Select placeholder={'请选择工单模板'} onChange={(e: any) => templateChange(e)}>
                        {
                            templateList?.map((res: any, ind: number) => {
                                return <Select.Option value={res?.templateName + ',' + res?.id} key={ind}>{res?.templateName}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <CommonTable
                    className={styles.table}
                    bordered={false}
                    showHeader={false}
                    columns={columns}
                    dataSource={dealList || []}
                    scroll={{ x: 800 }}
                    pagination={false}
                />

            </Form>
            <DetailTitle title="自定义项" key={0} />
            <CommonTable
                columns={customColumns}
                dataSource={customList || []}
                pagination={false}
            />
        </DetailContent>
    </Spin>
})

