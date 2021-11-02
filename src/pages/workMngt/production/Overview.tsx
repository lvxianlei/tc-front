import React from "react"
import { Button, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, CommonTable } from '../../common'
import { ConstructionDetails, ProductionIngredients } from "./productionData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/invoicing/getInvoicingInfo/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent operation={[
        <Button key="cancel" onClick={() => history.go(-1)}>完成</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="" operation={[<Button type="primary" ghost>配料</Button>]} />
            <CommonTable columns={ConstructionDetails} dataSource={[]} />
            <DetailTitle title="生产配料方案" />
            <CommonTable columns={ProductionIngredients} dataSource={[]} />
        </Spin>
    </DetailContent>
}