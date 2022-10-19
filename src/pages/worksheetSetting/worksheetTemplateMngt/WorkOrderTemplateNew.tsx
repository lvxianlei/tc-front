/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-放样计件-绩效配置
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Button, Col, Form, Input, InputNumber, Row, Select, Space, TreeSelect } from 'antd';
 import { CommonTable, DetailContent, DetailTitle } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import { FixedType } from 'rc-table/lib/interface';
 import styles from './WorksheetTemplateMngt.module.less'
import SelectColor from "../../common/SelectColor";
import { RuleObject } from "antd/lib/form";
import { StoreValue } from "antd/lib/form/interface";
 
 interface modalProps {
    type: 'new' | 'edit' | 'detail';
 }

 export default forwardRef(function WorkOrderTemplateNew({ type }: modalProps, ref) {
    const [form] = Form.useForm();
    const [customForm] = Form.useForm();
    const [upstreamNodes, setUpstreamNode] = useState<any[]>([]);
    const [dealList, setDealList] = useState<any[]>([]);
    const [customList, setCustomList] = useState<any[]>([]);
    
    const columns = [
        {
            key: 'hierarchy',
            title: '层级',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'model',
            title: '模式',
            dataIndex: 'model',
            width: 100,
            render: (_: string, record: Record<string, any> , index: number): React.ReactNode => (
                <Form.Item name={['node', index, '']} rules={[{
                    required: true,
                    message: '请选择模式'
                }]}>
                    <Select size="small" placeholder={'请选择模式'}>
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
            render: (_: string, record: Record<string, any> , index: number): React.ReactNode => (
                <Form.Item name={['node', index, '']} rules={[{
                    required: true,
                    message: '请选择上游节点'
                }]}>
                    {index === 0 ? 
                    <Input size="small" defaultValue="任务开始" disabled/>
            :
                    <Select size="small" placeholder={'请选择上游节点'}>
                        {
                        upstreamNodes?.map((res: any, ind: number) => {
                            return <Select.Option disabled={ind >= index} value={res?.hierarchy} key={ind}>{res?.hierarchy}</Select.Option>
                        })
                        }
                    </Select>
            }
                </Form.Item>
            )
        },
        {
            key: 'agingType',
            title: '时效类型',
            dataIndex: 'agingType',
            width: 100,
            render: (_: string, record: Record<string, any> , index: number): React.ReactNode => (
                <Form.Item name={['node', index, '']} rules={[{
                    required: true,
                    message: '请选择时效类型'
                }]}>
                    <Select size="small" placeholder={'请选择时效类型'}>
                        <Select.Option value={'小时'} key={0}>小时</Select.Option>
                        <Select.Option value={'工作日'} key={1}>工作日</Select.Option>
                        <Select.Option value={'自然日'} key={2}>自然日</Select.Option>
                        <Select.Option value={'周'} key={3}>周</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'aging',
            title: '时效',
            dataIndex: 'aging',
            width: 100,
            render: (_: string, record: Record<string, any> , index: number): React.ReactNode => (
                <Form.Item name={['node', index, '']} rules={[{
                    required: true,
                    message: '请输入时效要求'
                }]}>
                    <InputNumber size="small" placeholder="请输入时效要求" style={{width: '100%'}} min={1} max={99} precision={0}/>
                </Form.Item>
            )
        },
        {
            key: 'handleName',
            title: '处理名称',
            dataIndex: 'handleName',
            width: 100,
            render: (_: string, record: Record<string, any> , index: number): React.ReactNode => (
                <Form.Item name={['node', index, '']} rules={[{
                    required: true,
                    message: '请输入处理名称'
                }]}>
                    <Input size="small" placeholder="请输入处理名称" maxLength={30}/>
                </Form.Item>
            )
        },
        {
            key: 'jobs',
            title: '岗位',
            dataIndex: 'jobs',
            width: 100,
            render: (_: string, record: Record<string, any> , index: number): React.ReactNode => (
                <Form.Item name={['node', index, '']} rules={[{
                    required: true,
                    message: '请选择岗位'
                }]}>
                    <Input size="small" placeholder="请选择岗位" maxLength={30}/>
                </Form.Item>
            )
        },
        {
            key: 'color',
            title: '颜色',
            dataIndex: 'color',
            width: 100,
            render: (_: string, record: Record<string, any> , index: number): React.ReactNode => (
                <Form.Item name={['node', index, 'color']} rules={[{
                    required: true,
                    message: '请选择颜色'
                }]}>
                    <SelectColor defaultColor={record?.color} onChange={(color: string) => {
                        console.log(color)
                    }}/>
                </Form.Item>
            )
        }
    ]

    const customColumns= [
        {
            key: 'index',
            title: '排序',
            dataIndex: 'index',
            editable: true,
            render: (_: string, record: Record<string, any> , index: number): React.ReactNode => (
                <Form.Item name={['items', index, 'index']} rules={[{
                    required: true,
                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                        if (value) {
                                const values: any[] = JSON.parse(JSON.stringify(customForm.getFieldsValue(true).items));
                                values.splice(index, 1);
                                var same = values.some((item: any) => item.index === value);
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
                    <InputNumber size="small" placeholder="请输入排序" max={999} min={1} precision={0}/>
                </Form.Item>
            )
        },
        {
            key: 'name',
            title: '字段名称',
            dataIndex: 'name',
            editable: true,
            render: (_: string, record: Record<string, any> , index: number): React.ReactNode => (
                <Form.Item name={['items', index, '']} rules={[{
                    required: true,
                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                        if (value) {
                                const values: any[] = JSON.parse(JSON.stringify(customForm.getFieldsValue(true).items));
                                values.splice(index, 1);
                                var same = values.some((item: any) => item.name === value);
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
                    <Input size="small" placeholder="请输入字段名称" maxLength={20}/>
                </Form.Item>
            )
        },
        {
            key: 'is',
            title: '是否必填',
            dataIndex: 'is',
            render: (_: string, record: Record<string, any> , index: number): React.ReactNode => (
                <Form.Item name={['items', index, '']} rules={[{
                    required: true,
                    message: '请选择是否必填'
                }]}>
                    <Select size="small" placeholder={'请选择是否必填'}>
                        <Select.Option value={'0'} key={0}>是</Select.Option>
                        <Select.Option value={'1'} key={1}>否</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'node',
            title: '所属节点',
            dataIndex: 'node',
            render: (_: string, record: Record<string, any> , index: number): React.ReactNode => (
                <Form.Item name={['items', index, '']} rules={[{
                    required: true,
                    message: '请选择所属节点'
                }]}>
                    <Select size="small" placeholder={'请选择所属节点'}>
                    {
                        upstreamNodes?.map((res: any, ind: number) => {
                            return <Select.Option value={res?.hierarchy} key={ind}>{res?.hierarchy}</Select.Option>
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
                    <Button type="link"  onClick={() => delRow(index)}>删除</Button>
                </Space>
            )
        }
    ]
 
     const { data } = useRequest<any>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
         const result: any = await RequestUtil.get<any>(`/tower-science/performance/config`);
         form.setFieldsValue({ ...result });
         resole(result);
     }), {manual: type === 'new'})
 
     const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        nodeNumberBlur('1');
        form.setFieldsValue({
            nodeNumber: 1
        })
        resole(true);
    }), {})
     
     const { data: templateTypes } = useRequest<any>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(``);
        resole([]);
    }), {})
 
     const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
         try {
             const result: { [key: string]: any } = await RequestUtil.post(`/tower-science/performance/config`, data)
             resove(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onSubmit = () => new Promise(async (resolve, reject) => {
         try {
            form.validateFields().then(res=> {
                customForm.validateFields().then(res=> {
             const value = form.getFieldsValue(true);
             const customValue = customForm.getFieldsValue(true);
             console.log(value,customValue)
            //  await saveRun(value)
             resolve(true);
                
                })
            })
         } catch (error) {
             reject(false)
         }
     })
 
     const resetFields = () => {
         form.resetFields()
     }

    const delRow = (index: number) =>{
        customList.splice(index, 1);
        setCustomList([...customList])
    }

    const nodeNumberBlur =(e: string)=> {
        let num: number = Number(e);
        const nodeList: any[] = []
do {
    nodeList.push({
        hierarchy: numTOnum(num) + '级处理',
        color: '#FF8C00'
    })
    num--;
}
while (num > 0)
setUpstreamNode(nodeList.reverse())
     console.log(nodeList.reverse())
     setDealList(nodeList.reverse())
     form.setFieldsValue({
        node: nodeList.reverse()
     })
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
 
     return <DetailContent key='WorkOrderTemplateNew' className={styles.workOrderTemplateNew}>
         <Form form={form} layout="horizontal" labelCol={{span: 4}} labelAlign="right">
            <Row justify="start" gutter={24}>
                <Col span={12}>
         <Form.Item
                 name={'userPenaltyRatio'}
                 label={'工单模板名称'}
                 rules={[
                     {
                         required: true,
                         message: `请输入工单模板名称`
                     }
                 ]}>
                    <Input maxLength={20}/>
             </Form.Item>
                
                </Col>
                <Col span={12}>
         <Form.Item
                 name={'userPenaltyRatio'}
                 label={'模板类型'}
                 rules={[
                     {
                         required: true,
                         message: `请选择模板类型`
                     }
                 ]}>
                    <TreeSelect
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
                 name={'userPenaltyRatio'}
                 label={'备注'}>
                    <Input.TextArea maxLength={800}/>
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
                    <InputNumber min={1} max={99} onBlur={(e) => nodeNumberBlur(e.target.value)} precision={0}/>
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
             <DetailTitle title="自定义项" operation={[<Button type="primary" onClick={() => {
setCustomList([
    ...customList,
    {
        index: Number(customList.length) + 1,
        id: customList.length
    }
])
customForm.setFieldsValue({
    items: [
        ...customForm.getFieldsValue(true).items || [],
    {
        index: Number(customList.length) + 1,
        id: customList.length
    }
    ]
})
             }} ghost>新增</Button>]} key={0} />
             <Form form={customForm}>  
             <CommonTable
                        columns={customColumns}
                        dataSource={customList}
                        scroll={{ x: 800 }}
                        pagination={false}
                    />
             </Form>
     </DetailContent>
 })
 
 