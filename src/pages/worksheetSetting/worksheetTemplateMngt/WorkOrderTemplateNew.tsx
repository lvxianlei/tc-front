/**
 * @author zyc
 * @copyright © 2022 
 * @description 工单设置-工单模板管理
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Button, Col, Form, Input, InputNumber, message, Row, Select, Space, Spin, TreeSelect } from 'antd';
import { CommonTable, DetailContent, DetailTitle, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { FixedType } from 'rc-table/lib/interface';
import styles from './WorksheetTemplateMngt.module.less'
import SelectColor from "../../common/SelectColor";
import { RuleObject } from "antd/lib/form";
import { StoreValue } from "antd/lib/form/interface";

interface modalProps {
    type: 'new' | 'edit' | 'detail';
    rowId: string;
    getLoading: (loading: boolean) => void
}

export default forwardRef(function WorkOrderTemplateNew({ type, rowId, getLoading }: modalProps, ref) {
    const [form] = Form.useForm();
    const [customForm] = Form.useForm();
    const [upstreamNodes, setUpstreamNode] = useState<any[]>([]);
    const [dealList, setDealList] = useState<any[]>([]);
    const [customList, setCustomList] = useState<any[]>([]);


    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(`/tower-work/template/${rowId}`);
        form.setFieldsValue({
            ...result,
            nodeNumber: result?.templateNodeVOList?.length,
            node: result?.templateNodeVOList.map((res: any) => {
                return {
                    ...res,
                    post: res?.post?.split(',')
                }
            }) || []
        });
        customForm.setFieldsValue({
            items: result?.templateCustomVOList || []
        })
        setDealList(result?.templateNodeVOList?.map((res: any) => {
            return {
                ...res,
                post: res?.post?.split(',')
            }
        }) || [])
        setCustomList(result?.templateCustomVOList || [])
        resole(result);
        setUpstreamNode(result?.templateNodeVOList)
    }), { manual: type === 'new', refreshDeps: [rowId, type] })

    const { run } = useRequest<any>(() => new Promise(async (resole, reject) => {
        nodeNumberBlur('1');
        form.setFieldsValue({
            nodeNumber: 1
        })
        resole(true);
    }), { manual: type !== 'new', refreshDeps: [rowId, type] })

    const { data: stations } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(`/tower-system/station?size=1000`);
        resole(result?.records || []);
    }), {})

    const { data: templateTypes } = useRequest<any>(() => new Promise(async (resole, reject) => {
        let result: any = await RequestUtil.get<any>(`/tower-work/template/type`);
        resole(treeNode(result))
    }), {})

    const { data: urlList } = useRequest<any>(() => new Promise(async (resole, reject) => {
        let result: any = await RequestUtil.get<any>(`/tower-work/template/api/url`);
        resole(result)
    }), {})

    const treeNode = (nodes: any) => {
        nodes?.forEach((res: any) => {
            res.title = res?.name;
            res.value = res?.id;
            res.children = res?.children;
            if (res?.children?.length > 0) {
                treeNode(res?.children)
            }
        })
        return nodes
    }

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
            width: 100,
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['node', index, 'pattern']} rules={[{
                    required: true,
                    message: '请选择模式'
                }]}>
                    <Select disabled={type === 'detail'} placeholder={'请选择模式'}>
                        <Select.Option value={'FS'} key={0}>FS</Select.Option>
                        <Select.Option value={'FF'} key={1}>FF</Select.Option>
                        <Select.Option value={'SF'} key={2}>SF</Select.Option>
                        <Select.Option value={'SS'} key={3}>SS</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'upstreamNode',
            title: '上游节点',
            dataIndex: 'upstreamNode',
            width: 100,
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <>
                    {index === 0 ?
                        <Form.Item name={['node', index, 'upstreamNode']} initialValue={"任务开始"}>
                            <Input disabled />
                        </Form.Item>
                        :
                        <Form.Item name={['node', index, 'upstreamNode']} rules={[{
                            required: true,
                            message: '请选择上游节点'
                        }]}>
                            <Select disabled={type === 'detail'} placeholder={'请选择上游节点'}>
                                {
                                    upstreamNodes?.map((res: any, ind: number) => {
                                        return <Select.Option disabled={ind >= index} value={res?.node} key={ind}>{res?.node}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    }
                </>
            )
        },
        {
            key: 'agingType',
            title: '时效类型',
            dataIndex: 'agingType',
            width: 100,
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['node', index, 'agingType']} rules={[{
                    required: true,
                    message: '请选择时效类型'
                }]}>
                    <Select disabled={type === 'detail'} placeholder={'请选择时效类型'}>
                        <Select.Option value={'小时'} key={0}>小时</Select.Option>
                        <Select.Option value={'工作日'} key={1}>工作日</Select.Option>
                        <Select.Option value={'自然日'} key={2}>自然日</Select.Option>
                        <Select.Option value={'周'} key={3}>周</Select.Option>
                    </Select>
                </Form.Item>
            )
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
                }]}>
                    <InputNumber disabled={type === 'detail'} placeholder="请输入时效要求" style={{ width: '100%' }} min={1} max={99} precision={0} />
                </Form.Item>
            )
        },
        {
            key: 'processingName',
            title: '处理名称',
            dataIndex: 'processingName',
            width: 100,
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['node', index, 'processingName']} rules={[{
                    required: true,
                    message: '请输入处理名称'
                }]}>
                    <Input disabled={type === 'detail'} placeholder="请输入处理名称" maxLength={30} />
                </Form.Item>
            )
        },
        {
            key: 'post',
            title: '岗位',
            dataIndex: 'post',
            width: 100,
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['node', index, 'post']} rules={[{
                    required: true,
                    message: '请选择岗位'
                }]}>
                    <Select disabled={type === 'detail'} mode="multiple" placeholder={'请选择岗位'}>
                        {
                            stations && stations?.map((res: any, ind: number) => {
                                return <Select.Option value={res?.id} key={ind}>{res?.stationName}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'parentUrl',
            title: '跳转API',
            dataIndex: 'parentUrl',
            width: 100,
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['node', index, 'parentUrl']}>
                    <Select disabled={type === 'detail'} placeholder={'请选择'}>
                        {
                            urlList && urlList?.map((res: any, ind: number) => {
                                return <Select.Option value={res?.apiUrl} key={ind}>{res?.apiName}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
            )
        }
        // {
        //     key: 'colour',
        //     title: '颜色',
        //     dataIndex: 'colour',
        //     width: 100,
        //     render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
        //         <Form.Item name={['node', index, 'colour']} rules={[{
        //             required: true,
        //             message: '请选择颜色'
        //         }]}>
        //             <SelectColor disabled={type === 'detail'} defaultColor={record?.colour} onChange={(color: string) => {
        //                 console.log(color)
        //             }} />
        //         </Form.Item>
        //     )
        // }
    ]

    const customColumns = [
        {
            key: 'sort',
            title: '排序',
            dataIndex: 'sort',
            editable: true,
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['items', index, 'sort']} rules={[{
                    required: true,
                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                        if (value) {
                            const values: any[] = JSON.parse(JSON.stringify(customForm.getFieldsValue(true).items));
                            values.splice(index, 1);
                            var same = values.some((item: any) => item.sort === value);
                            if (same) {
                                callback('排序重复')
                            } else {
                                callback()
                            }
                        } else {
                            callback('请输入排序')
                        }
                    }
                }]}>
                    <InputNumber disabled={type === 'detail'} placeholder="请输入排序" max={999} min={1} precision={0} />
                </Form.Item>
            )
        },
        {
            key: 'fieldKey',
            title: '字段名称',
            dataIndex: 'fieldKey',
            editable: true,
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['items', index, 'fieldKey']} rules={[{
                    required: true,
                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                        if (value) {
                            const values: any[] = JSON.parse(JSON.stringify(customForm.getFieldsValue(true).items));
                            values.splice(index, 1);
                            var same = values.some((item: any) => item.fieldKey === value);
                            if (same) {
                                callback('字段名称重复')
                            } else {
                                callback()
                            }
                        } else {
                            callback('请输入字段名称')
                        }
                    }
                }]}>
                    <Input disabled={type === 'detail'} placeholder="请输入字段名称" maxLength={20} />
                </Form.Item>
            )
        },
        {
            key: 'required',
            title: '是否必填',
            dataIndex: 'required',
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['items', index, 'required']} rules={[{
                    required: true,
                    message: '请选择是否必填'
                }]} initialValue={0}>
                    <Select disabled={type === 'detail'} placeholder={'请选择是否必填'}>
                        <Select.Option value={1} key={0}>是</Select.Option>
                        <Select.Option value={0} key={1}>否</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'workOrderNode',
            title: '所属节点',
            dataIndex: 'workOrderNode',
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['items', index, 'workOrderNode']} rules={[{
                    required: true,
                    message: '请选择所属节点'
                }]}>
                    <Select disabled={type === 'detail'} placeholder={'请选择所属节点'}>
                        {
                            upstreamNodes?.map((res: any, ind: number) => {
                                return <Select.Option value={res?.node} key={ind}>{res?.node}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space size='small'>
                    <Button type="link" disabled={type === 'detail'} onClick={() => delRow(index)}>删除</Button>
                </Space>
            )
        }
    ]

    const { run: saveRun } = useRequest((data: any) => new Promise(async (resove, reject) => {
        try {
            await RequestUtil.post(`/tower-work/template`, data).then(res => {
                resove(true)
            }).catch(e => {
                reject(e)
                getLoading(false)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(res => {
                if (customList.length > 0) {
                    customForm.validateFields().then(async res => {
                        const value = form.getFieldsValue(true);
                        const customValue = customForm.getFieldsValue(true);
                        getLoading(true)
                        await saveRun({
                            id: data?.id,
                            templateName: value?.templateName,
                            templateTypeId: value?.templateTypeId,
                            description: value?.description,
                            templateNodeSaveDTOList: value?.node?.map((res: any) => {
                                return {
                                    ...res,
                                    post: res?.post?.join(',')
                                }
                            }),
                            templateCustomSaveDTOList: customValue?.items
                        })
                        resolve(true);

                    })
                } else {
                    message.warning('请增加自定义项！')
                }
            })
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
    }

    const delRow = (index: number) => {
        const value = customForm?.getFieldsValue(true)?.items;
        value.splice(index, 1);
        setCustomList([...value]);
        customForm?.setFieldsValue({
            items: [...value]
        })
    }

    const nodeNumberBlur = (e: string) => {
        const nodeNumber = Number(e) > 99 ? 99 : e
        let num: number = 1;
        const nodeList: any[] = []
        do {
            nodeList.push({
                node: numTOnum(num) + '级处理',
                upstreamNode: num === 1 ? '任务开始' : '',
                colour: '#FF8C00',
                level: num
            })
            num++;
        }
        while (num <= Number(nodeNumber))
        setUpstreamNode(nodeList)
        setDealList(nodeList)
        form.setFieldsValue({
            node: nodeList
        })
        customForm.setFieldsValue({
            items: []
        })
        setCustomList([])
    }

    const numTOnum = (num: number) => {
        if (num > 999999999999) {
            console.error('数字单位过大, 暂不支持');
            return
        }
        const cnNumArr = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        const cnArr = ['', '', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万'];
        let arr: any[] = (num + '').split('');
        let str = ''
        for (let i = 0; i < arr.length; i++) {
            str += cnNumArr[arr[i]] + cnArr[arr.length - i]
        }
        return str;
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent key='WorkOrderTemplateNew' className={styles.workOrderTemplateNew}>
            <Form form={form} layout="horizontal" labelCol={{ span: 4 }} labelAlign="right">
                <Row justify="start" gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name={'templateName'}
                            label={'工单模板名称'}
                            rules={[
                                {
                                    required: true,
                                    message: `请输入工单模板名称`
                                }
                            ]}>
                            <Input disabled={type === 'detail'} maxLength={20} />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={'templateTypeId'}
                            label={'模板类型'}
                            rules={[
                                {
                                    required: true,
                                    message: `请选择模板类型`
                                }
                            ]}>
                            <TreeSelect
                                disabled={type === 'detail'}
                                style={{ width: '400px' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={templateTypes}
                                placeholder="请选择"
                                treeDefaultExpandAll
                            />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={'description'}
                            label={'备注'}>
                            <Input.TextArea disabled={type === 'detail'} maxLength={800} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={4} justify="start">
                    <Col span={4}>
                        <Row>
                            <span>节点数量：</span>
                            <Form.Item
                                name={'nodeNumber'}
                                rules={[
                                    {
                                        required: true,
                                        message: `请输入节点数量`
                                    }
                                ]}>
                                <InputNumber disabled={type === 'detail'} min={1} max={99} onBlur={(e) => nodeNumberBlur(e?.target.value)} precision={0} />
                            </Form.Item>
                        </Row>
                    </Col>
                    <Col span={20}>
                        <CommonTable
                            className={styles.table}
                            bordered={false}
                            showHeader={false}
                            columns={columns}
                            dataSource={dealList || []}
                            scroll={{ x: 800 }}
                            pagination={false}
                        />
                    </Col>
                </Row>

            </Form>
            <DetailTitle title="自定义项" operation={[<Button type="primary" disabled={type === 'detail'} onClick={() => {
                setCustomList([
                    ...customList,
                    {
                        sort: Number(customList.length) + 1
                    }
                ])
                customForm.setFieldsValue({
                    items: [
                        ...customForm.getFieldsValue(true).items || [],
                        {
                            sort: Number(customList.length) + 1,
                        }
                    ]
                })
            }} ghost>新增</Button>]} key={0} />
            <Form form={customForm} className={styles.customForm}>
                <CommonTable
                    columns={customColumns}
                    dataSource={customList}
                    scroll={{ x: 800 }}
                    pagination={false}
                />
            </Form>
            {
                type === 'detail' ?
                    <OperationRecord title="操作信息" serviceId={rowId} serviceName="tower-work" />
                    :
                    null
            }
        </DetailContent>
    </Spin>
})

