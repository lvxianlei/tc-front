import React, { useState } from "react"
import { Button, Descriptions, Spin } from 'antd'
import { DetailTitle, BaseInfo, CommonTable } from '../../common'
import { ApplicationList, operationInfo } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ApplicationContext from "../../../configuration/ApplicationContext"
import { downLoadFile } from "../../../utils"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps): JSX.Element {
    const [receipt, setReceipt] = useState<any>({});
    const [name, setName] = useState("");
    const [downLoad, setDownLoad] = useState("");
    const pleasePayTypeEnum = (ApplicationContext.get().dictionaryOption as any)["1212"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const paymentMethodEnum = (ApplicationContext.get().dictionaryOption as any)["1211"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/applyPayment/${id}`)
            setReceipt(result);
            setName(receipt.applyPaymentAttachInfoVos[0].name + "." + receipt.applyPaymentAttachInfoVos[0].fileSuffix);
            setDownLoad(receipt.applyPaymentAttachInfoVos[0].filePath);
            resole(result);
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return <Spin spinning={loading}>
        <DetailTitle title="申请信息" />
        <BaseInfo columns={ApplicationList.map((item: any) => {
            if (item.dataIndex === "pleasePayType") {
                return ({ ...item, type: "select", enum: pleasePayTypeEnum });
            }
            if (item.dataIndex === "paymentMethod") {
                return ({ ...item, type: "select", enum: paymentMethodEnum });
            }
            return item;
        })} dataSource={data || {}} />
        <DetailTitle title="回执单" />
        <Descriptions bordered column={1}>
            <Descriptions.Item label={name}>
                <Button type="link">查看</Button>
                <Button type="link" onClick={() => { downLoadFile(downLoad) }}>下载</Button>
            </Descriptions.Item>
        </Descriptions>
        <DetailTitle title="审批信息" />
        <CommonTable columns={operationInfo} dataSource={[]} />
        <DetailTitle title="操作信息" />
        <CommonTable columns={operationInfo} dataSource={[]} />
    </Spin>
}