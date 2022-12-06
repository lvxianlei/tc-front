import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Spin } from "antd";
import { BaseInfo, DetailContent, DetailTitle, CommonAliTable, CommonTable } from "../../common";
import useRequest from "@ahooksjs/use-request";
import RequestUtil from "../../../utils/RequestUtil";
import { detaiBaseInfo, productInfo, system } from "./sale_order.json"
export default function Detail() {
    const history = useHistory()
    const params = useParams<{ projectId: string, id: string }>();
    const { loading, data: orderData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/saleOrder/${params.id}`)
            resole({
                ...result?.contractInfoVo,
                ...result
            });
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent operation={[
        <Button
            key="edit"
            style={{ marginRight: '16px' }}
            type="primary"
            onClick={() => history.push(`/project/management/edit/order/${params.projectId}/${params.id}`)}>编辑</Button>,
        <Button
            key="goback"
            onClick={() => history.goBack()}
        >返回</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={detaiBaseInfo} dataSource={orderData || {}} />
            <DetailTitle title="产品信息" />
            <CommonAliTable columns={productInfo} dataSource={orderData?.orderProductVos || []} />
            <DetailTitle title="系统信息" />
            <BaseInfo col={2} columns={system} dataSource={orderData || {}} />
            <DetailTitle title="操作记录" />
            <CommonAliTable rowKey="createTime" columns={[
                { title: '序号', dataIndex: 'index', width: 30, render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                { title: '部门', dataIndex: 'branch' },
                { title: '填写人', dataIndex: 'createUserName' },
                { title: '职位', dataIndex: 'position' },
                { title: '填写时间', dataIndex: 'createTime' },
                { title: '说明', dataIndex: 'description' }
            ]} dataSource={orderData?.bidBizRecordVos} />
        </Spin>
    </DetailContent>
}