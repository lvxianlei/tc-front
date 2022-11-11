import React from "react"
import { Spin } from "antd"
import { DetailTitle } from "../../../common"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { signIn, opration, examine } from "./data.json"
const recordEnum: { [key: string]: any } = {
    signIn: "签收日志",
    opration: "操作日志",
    examine: "审核日志"
}
interface EditProps {
    id: "create" | string
    type: "signIn" | "opration" | "examine"
}

export default function Records({ id, type }: EditProps) {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const data: { [key: string]: any } = await RequestUtil.get(`/tower-system/doc/detail`, { id })
            resole(data)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: id === "create" })

    return <Spin spinning={loading}>
        <DetailTitle title={recordEnum[type]} />

    </Spin>
}