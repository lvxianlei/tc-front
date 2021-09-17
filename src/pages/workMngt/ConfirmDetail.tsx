// import React, { useState } from 'react'
// import { Space, Input, DatePicker, Select, Button, Modal, Form } from 'antd'
// import { Link } from 'react-router-dom'
// import { Page } from '../common'

// export default function Information(): React.ReactNode {
//     const [visible, setVisible] = useState<boolean>(false);
//     const [form] = Form.useForm();
//     const handleModalOk = async () => {
//         try {
//             const submitData = await form.validateFields()
//             console.log(submitData)
//             setVisible(false)
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     const columns = [
//         {
//             key: 'index',
//             title: '序号',
//             dataIndex: 'index',
//             width: 50,
//             render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
//         },
//         {
//             key: 'projectName',
//             title: '确认任务编号',
//             width: 100,
//             dataIndex: 'projectName'
//         },
//         {
//             key: 'projectNumber',
//             title: '合同名称',
//             dataIndex: 'projectNumber'
//         },
//         {
//             key: 'bidBuyEndTime',
//             title: '计划交付时间',
//             width: 200,
//             dataIndex: 'bidBuyEndTime'
//         },
//         {
//             key: 'biddingEndTime',
//             title: '确认人',
//             width: 200,
//             dataIndex: 'biddingEndTime'
//         },
//         {
//             key: 'biddingAgency',
//             title: '状态',
//             dataIndex: 'biddingAgency'
//         },
//         {
//             key: 'biddingAddress',
//             title: '状态时间',
//             dataIndex: 'biddingAddress'
//         },
//         {
//             key: 'operation',
//             title: '操作',
//             dataIndex: 'operation',
//             render: (_: undefined, record: any): React.ReactNode => (
//                 <Space direction="horizontal" size="small">
//                     <Link to={`/workMngt/confirmList/confirmMessage/${record.id}`}>确认信息</Link>
//                     <Link to={`/workMngt/confirmList/confirmDetail/${record.id}`}>确认明细</Link>
//                 </Space>
//             )
//         }
//     ]

//     const handleModalCancel = () => setVisible(false)
//     return (
//         <Page
//             path="/tower-market/bidInfo"
//             columns={columns}
//             extraOperation={
//                 <>

//                     <Button type="primary">导出</Button>
//                     <Button type="primary">模板下载</Button>
//                     <Button type="primary">保存并提交</Button>
//                     <Button type="primary">保存</Button>
//                     <Button type="primary">导入</Button>
//                     <Button type="primary">添加</Button>
//                     <Button type="primary">返回上一级</Button>
//                 </>
//             }
//             searchFormItems={[]}
//         />
//     )
// }

import React from 'react'
import { Button, Row, Col, Tabs, Radio, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../common';
import { baseInfoData } from './confirm.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';

const tableColumns = [
    { 
        title: '序号', 
        dataIndex: 'index', 
        key: 'index', 
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) 
    },
    { 
        title: '线路名称 *', 
        dataIndex: 'partBidNumber',
        key: 'partBidNumber', 
    },
    { 
        title: '杆塔号 *', 
        dataIndex: 'goodsType', 
        key: 'goodsType' 
    },
    { 
        title: '塔型 *', 
        dataIndex: 'packageNumber', 
        key: 'packgeNumber' 
    },
    { 
        title: '塔型钢印号 *', 
        dataIndex: 'amount', 
        key: 'amount' 
    },
    { 
        title: '产品类型 *', 
        dataIndex: 'unit', 
        key: 'unit' 
    },
    { 
        title: '电压等级（kv） *', 
        dataIndex: 'unit', 
        key: 'unit' 
    },
    { 
        title: '呼高（m） *', 
        dataIndex: 'unit', 
        key: 'unit' 
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        render: (_: undefined, record: any): React.ReactNode => (
            <Space direction="horizontal" size="small">
                <Button type='link'>编辑</Button>
                <Button type='link'>删除</Button>
            </Space>
        )
    }
];

export default function ManagementDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <CommonTable columns={ tableColumns } dataSource={ detailData?.attachVos } />
                <DetailTitle title="备注"/>
                <TextArea maxLength={ 200 }/>
                <DetailTitle title="附件"/>
                <CommonTable columns={[
                    {
                        title: '附件名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        render: (_: undefined, record: any): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Button type='link'>下载</Button>
                                <Button type='link'>预览</Button>
                                <Button type='link'>删除</Button>
                            </Space>
                        )
                    }
                ]} dataSource={detailData?.attachVos} />
            </DetailContent>
        </Spin>
    </>
}