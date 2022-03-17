import React, { useState, } from "react"
import { Input, DatePicker, Select, Form, Spin, Button, Space, message, Popconfirm, Modal, } from 'antd'
import { CommonTable, Page } from '../../common'
import { Link, useHistory, useLocation } from "react-router-dom"
import { FixedType } from 'rc-table/lib/interface';
import useRequest from "@ahooksjs/use-request"
import styles from './template.module.less';
import RequestUtil from "../../../utils/RequestUtil";
import TaskNew from "./taskNew";
import TaskEdit from "./taskEdit";
import TaskView from "./taskView";
export default function TemplateList() {
    const [filterValue, setFilterValue] = useState<any>({});
    const [refresh, setRefresh ] = useState<boolean>(false);
    const location = useLocation<{ state?: number, userId?: string }>();
    const history = useHistory();
   
    const columns: any[] = [
        {
            title: '序号',
            dataIndex: 'index',
            fixed: true,
            render: (text: any, item: any, index: number) => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '放样任务编号',
            dataIndex: 'taskNum',
        },
        {
            title: '工作类型',
            dataIndex: 'uploadDrawTypeName',
        },
        {
            title: '内部合同编号',
            dataIndex: 'internalNumber',
        },
        {
            title: '计划号',
            dataIndex: 'planNumber',
        },
        {
            title: '塔型',
            dataIndex: 'productCategoryName',
        },
        {
            title: '计划交付时间',
            dataIndex: 'deliverTime',
        },
        {
            title: '样板负责人',
            dataIndex: 'drawLeaderName',
        },
        {
            title: '页数/数量',
            dataIndex: 'structureNumber',
        },
        {
            title: '完成状态',
            dataIndex: 'uploadStatusName',
        },
        {
            title: '最新状态变更时间',
            dataIndex: 'updateStatusTime',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width:'100px',
            align:'left',
            render: (text: string, record: Record<string, any>): React.ReactNode => {
                return (
                   <Space direction="horizontal" size="small" className={styles.operationBtn}> {record?.uploadDrawTypeName!=='样板打印'?
                    <Button type='link' onClick={()=>{history.push(`/workMngt/templateList/detail/${record.id}/${record.productCategoryId}`)}}>查看</Button>
                    :<>
                    
                    <TaskView record={record} freshF= {setRefresh} fresh={refresh}/>
                    {record.uploadStatusName === '待完成' &&<Popconfirm
                        title="确认完成?"
                        onConfirm={() => {
                            RequestUtil.get(`/tower-science/loftingTemplate/complete/${record.id}`).then(res => {
                                setRefresh(!refresh);
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" >完成</Button>
                    </Popconfirm>}
                    {record.uploadStatusName === '待完成' &&<TaskEdit record={record} freshF= {setRefresh} fresh={refresh}/>}
                    {record.uploadStatusName === '待完成' &&<Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-science/loftingTemplate/${record.id}`).then(res => {
                                message.success('删除成功！')
                                setRefresh(!refresh);
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" >删除</Button>
                    </Popconfirm>}
                    </>}
                    </Space>
                   
                )
            }
        },
    ]
    const onFilterSubmit = (value: any) => {
        if (value.updateStatusTimeStart) {
            const formatDate = value.updateStatusTimeStart.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = `${formatDate[0]} 00:00:00`
            value.updateStatusTimeEnd = `${formatDate[1]} 23:59:59`
        }
        setFilterValue(value)
        return value
    }

    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data?.records);
    }), {})
    const checkUser: any = data || [];
    
    return (
        <Spin spinning={loading}>
            <Page
                path="/tower-science/loftingTemplate"
                filterValue={filterValue}
                columns={columns}
                refresh={refresh}
                extraOperation={ <TaskNew freshF= {setRefresh} fresh={refresh}/>}
                exportPath={`/tower-science/loftingTemplate`}
                onFilterSubmit={onFilterSubmit}
                requestData={{ status: location.state?.state, drawLeader: location.state?.userId }}
                searchFormItems={[
                    {
                        name: 'drawType',
                        label: '工作类型',
                        children: (
                            <Select style={{ width: 200 }} placeholder="请选择" defaultValue={""}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="1">组装图纸</Select.Option>
                                <Select.Option value="2">发货图纸</Select.Option>
                                <Select.Option value="3">样板打印</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'status',
                        label: '状态',
                        children: (<Form.Item name="status" initialValue={location.state?.state || ""}>
                            <Select style={{ width: 200 }} placeholder="请选择">
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value={1}>待完成</Select.Option>
                                <Select.Option value={2}>已完成</Select.Option>
                            </Select>
                        </Form.Item>
                        )
                    },
                    {
                        name: 'updateStatusTimeStart',
                        label: '日期选择',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'drawLeader',
                        label: '样板负责人',
                        children: <Form.Item name="drawLeader" initialValue={location.state?.userId || ""}>
                            <Select placeholder="请选择" style={{ width: "150px" }}>
                                <Select.Option value="" key="6">全部</Select.Option>
                                {checkUser && checkUser.map((item: any) => {
                                    return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: "模糊查询项",
                        children: <Input placeholder="放样任务编号/内部合同编号/计划号/塔型" style={{ width: 300 }} />
                    }
                ]}
            />
            
        </Spin>
    )
}
