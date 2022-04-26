import React from 'react'
import { Button, Spin, Space, Popconfirm, message} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';


export default function CyclePlanDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-science/drawTask/getList?drawTaskId=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const columns : any =[
        {
            key: 'lineName',
            title: '优先级',
            width: 100,
            fixed: "left",
            dataIndex: 'lineName'
        },
        {
            key: 'name',
            title: '计划号',
            width: 100,
            fixed: "left",
            dataIndex: 'name'
        },
        {
            key: 'productCategory',
            title: '塔型',
            width: 100,
            fixed: "left",
            dataIndex: 'productCategory'
        },
        {
            key: 'steelProductShape',
            title: '下达单号',
            width: 100,
            dataIndex: 'steelProductShape'
        },
        
        {
            key: 'basicHeight',
            title: '批次',
            width: 100,
            dataIndex: 'basicHeight'
        },
        {
            key: 'otherWeight',
            title: '线路名称',
            width: 100,
            dataIndex: 'otherWeight'
        },
        {
            key: 'totalWeight',
            title: '客户经理',
            width: 100,
            dataIndex: 'totalWeight'
        },
        {
            key: 'description',
            title: '产品类型',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '试装类型',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '电压等级（kV）',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '总孔数',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '总件数',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '总重量（t）',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '角钢重量（t）',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '钢板重量（t）',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '库存备料',
            width: 100,
            fixed: "right",
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '生产备料',
            width: 100,
            fixed: "right",
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '周期计划备注',
            width: 100,
            fixed: "right",
            dataIndex: 'description'
        },
        {
            title: "操作",
            dataIndex: "opration",
            fixed: "right",
            render: (record: any) => 
                <Popconfirm
                    title="确认删除?"
                    onConfirm={async () => {
                        RequestUtil.delete(`/tower-system/notice?ids=${record.id}`)
                        message.success("删除成功...")
                        await run()
                    }}
                    okText="确认"
                    cancelText="取消"
                    disabled={record.state === 1}
                >
                    <Button type="link" disabled={record.state === 1}>删除</Button>
                </Popconfirm>
        }
    ]
    
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                // <Space>
                //     <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                //     <Button type="primary" ghost onClick={() => history.goBack()}>保存</Button>
                //     <Button type="primary" ghost onClick={() => history.goBack()}>备料确认</Button>
                //     <Popconfirm
                //         title="下发后不可取消，是否下发周期计划？"
                //         onConfirm={async () => {
                //             // RequestUtil.delete(`/tower-system/notice?ids=${record.id}`)
                //             message.success("下发成功")
                //             history.push(``)
                //         }}
                //         okText="确认"
                //         cancelText="取消"
                //     >
                //         <Button type="primary" ghost >周期计划下发</Button>
                //     </Popconfirm>
                // </Space>
            ]}>
                <DetailTitle title="基础信息"/>
                
                
                <DetailTitle title="周期计划下达单"/>
                <Space>
                    <Button type="primary" ghost onClick={() => history.goBack()}>添加下达单</Button>
                    <Button type="primary" ghost onClick={() => history.goBack()}>周期计划备注</Button>
                </Space>
                <div>
                    <Space>
                        <span>合计：{}</span>
                        <span>总件数：{}</span>
                        <span>总孔数：{}</span>
                        <span>总重量（t）：{}</span>
                    </Space>
                </div>
                {/* <CommonTable columns={columns} dataSource={[{}]} pagination={false}/> */}
            </DetailContent>
        </Spin>
    </>
}