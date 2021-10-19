import React, { useState, useEffect } from "react"
import { Modal, Spin, Button, Radio, Row } from "antd"
import { DetailTitle, CommonTable, BaseInfo } from "../../common"
import { enclosure } from "../managementDetailData.json"
import {
    supplyBaseInfo,
    supplyAskInfo,
    logisticBaseInfo,
    logisticAskInfo,
    logisticProductReverdType,
    logisticProductType,
    workmanshipBaseInfo,
    workmanshipReverd,
    materialPriceHead
} from "./costData.json"
import { downLoadFile } from "../../../utils"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export type SelectType = "selectA" | "selectB" | "selectC"
type radioTypes = "base" | "records"
const auditEnum: any = {
    "selectA": "供应询价任务",
    "selectB": "物流询价任务",
    "selectC": "工艺询价任务"
}

export default function SelectInquiryDetail(props: any): JSX.Element {
    const [radioValue, setRadioValue] = useState<radioTypes>("base")
    const { loading, data, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const askPrice: any = await RequestUtil.get(`/tower-market/askPrice/${props.id}`)
            resole(askPrice)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => {
        !!props.id && run()
        setRadioValue("base")
    }, [props.id])

    const radioOnchange = (value: radioTypes) => setRadioValue(value)

    return <Modal {...props} width={1011} title={auditEnum[props.type]} onOk={() => props.onOk && props.onOk()} destroyOnClose>
        <Spin spinning={loading}>
            {props.type === "selectA" && <>
                <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)}>
                    <Radio.Button value="base">咨询结果</Radio.Button>
                    <Radio.Button value="records">咨询信息</Radio.Button>
                </Radio.Group>
                <DetailTitle title="询价类型：供应询价" />
                {radioValue === "base" && <>
                    <BaseInfo columns={supplyBaseInfo} dataSource={data || {}} />
                    <Row style={{ fontSize: 16, textAlign: "center", width: "100%" }}>国网批次招标投标原材料报价</Row>
                    <CommonTable columns={materialPriceHead} data={data?.askLogisticsVOS || []} />
                    <DetailTitle title="相关附件" />
                    <CommonTable columns={[{
                        title: "操作",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            <Button type="link" >预览</Button>
                            <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                        </>
                    }, ...enclosure]} dataSource={data?.replyAttachVos || []} />
                </>}
                {radioValue === "records" && <>
                    <BaseInfo columns={supplyAskInfo} dataSource={data || {}} />
                    <DetailTitle title="相关附件" />
                    <CommonTable columns={[{
                        title: "操作",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            <Button type="link" >预览</Button>
                            <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                        </>
                    }, ...enclosure]} dataSource={data?.startAttachVos || []} />
                </>}
            </>}

            {props.type === "selectB" && <>
                <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)}>
                    <Radio.Button value="base">咨询结果</Radio.Button>
                    <Radio.Button value="records">咨询信息</Radio.Button>
                </Radio.Group>
                <DetailTitle title="询价类型：物流询价" />
                {radioValue === "base" && <>
                    <BaseInfo columns={logisticAskInfo} dataSource={data || {}} />
                    <DetailTitle title="产品类型信息" />
                    <CommonTable columns={logisticProductType} dataSource={data?.materialPriceVOS || []} />
                    <DetailTitle title="咨询附件" />
                    <CommonTable columns={[{
                        title: "操作",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            <Button type="link" >预览</Button>
                            <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                        </>
                    }, ...enclosure]} dataSource={data?.replyAttachVos || []} />
                </>}
                {radioValue === "records" && <>
                    <BaseInfo columns={logisticBaseInfo} dataSource={data || {}} />
                    <DetailTitle title="产品类型信息" />
                    <CommonTable columns={logisticProductReverdType} dataSource={data?.askLogisticsVOS || {}} />
                    <DetailTitle title="附件" />
                    <CommonTable columns={[{
                        title: "操作",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            <Button type="link" >预览</Button>
                            <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                        </>
                    }, ...enclosure]} dataSource={data?.startAttachVos || []} />
                </>}
            </>}

            {props.type === "selectC" && <>
                <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)}>
                    <Radio.Button value="base">咨询结果</Radio.Button>
                    <Radio.Button value="records">咨询信息</Radio.Button>
                </Radio.Group>
                <DetailTitle title="询价类型：工艺询价" />
                {radioValue === "base" && <>
                    <BaseInfo columns={workmanshipReverd} dataSource={data || {}} />
                    <DetailTitle title="附件" />
                    <CommonTable columns={[{
                        title: "操作",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            <Button type="link" >预览</Button>
                            <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                        </>
                    }, ...enclosure]} dataSource={data?.replyAttachVos || []} />
                </>}
                {radioValue === "records" && <>
                    <BaseInfo columns={workmanshipBaseInfo} dataSource={data || {}} />
                    <DetailTitle title="附件" />
                    <CommonTable columns={[{
                        title: "操作",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            <Button type="link" >预览</Button>
                            <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                        </>
                    }, ...enclosure]} dataSource={data?.startAttachVos || []} />
                </>}
            </>}
        </Spin>
    </Modal>
}