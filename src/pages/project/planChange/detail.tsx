import React from "react"
import { Spin } from "antd"
import { BaseInfo, CommonTable, DetailContent, DetailTitle, EditableTable } from "../../common"
import { detail } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
interface EditProps {
    id: string
    type: 1 | 2 | 3 | 4
}

export default function Detail({ id, type }: EditProps) {
    const { loading, data: planData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/editNotice/detail?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: id === "create" })
    return <Spin spinning={loading}>
        <DetailContent>
            <DetailTitle title="基础信息" />
            <BaseInfo col={4} columns={detail.base} dataSource={planData || {}} />
            {type === 1 && <CommonTable
                columns={detail.content}
                dataSource={planData?.editNoticeInfoVOList || []}
            />}
            {[2, 3, 4].includes(type) && <>
                <CommonTable
                     columns={type === 4 ? detail.revertSuspend : detail.suspend}
                    dataSource={planData?.editNoticeProductVOList || []} />
            </>}
        </DetailContent>
    </Spin>
}