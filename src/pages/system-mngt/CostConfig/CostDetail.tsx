import React from "react"
import { Spin, Button } from "antd"
import { useParams, useHistory } from "react-router-dom"
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from "../../common"
import { baseInfo } from "./headData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

export default function CostEdit() {
    const history = useHistory()
    const { id } = useParams<{ id: string }>()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const [productType, proport]: Promise<any>[] = await Promise.all([
                RequestUtil.get(`/tower-market/ProductType/getProductTypeInfo?productName=${id}`),
                RequestUtil.get(`/tower-market/ProductType/getProductParamProportion?productName=${id}`)
            ])
            resole({ productType, proport })
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent operation={[
        <Button key="save" type="primary"
            style={{ marginRight: 16 }}
            onClick={() => history.push(`/sys/costconfig/edit/${id}`)}
        >编辑</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="公共费用" />
            <BaseInfo columns={baseInfo} dataSource={data?.productType || {}} />
            <DetailTitle title="材质比例" />
            {data?.proport && <CommonTable columns={data?.proport?.head || []} dataSource={data?.proport?.data || []} />}
        </Spin>
    </DetailContent>
}