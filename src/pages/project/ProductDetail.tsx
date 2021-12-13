import React, { useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable } from "../common"
import { newProductGroup, productAssist } from './managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"
export default function ProductGroupEdit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [select, setSelect] = useState<any[]>([])
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productGroup/${params.id}`)
            setSelect(result.productDetails)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const deleteThisRecode = ()=>{
         // 删除
    }
    return <DetailContent
        operation={[
            <Button key="goback" type="default" onClick={() => history.goBack()}>返回</Button>
        ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo  columns={newProductGroup} dataSource={data || {}} />
            <DetailTitle title="明细" />
            <CommonTable columns={[{
                title: "操作",
                dataIndex: "opration",
                render: (_: null, records: any) => <>
                 
                    <Button type="link" size="small" onClick = {deleteThisRecode} >删除</Button>
                </>
            }, ...productAssist]} dataSource={select} />
        </Spin>
    </DetailContent>
}