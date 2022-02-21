import React, { useState, useEffect } from "react"
import { Modal, Spin, Button, Radio, Row } from "antd"
import { DetailTitle, CommonTable, BaseInfo, Attachment } from "../../common"
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
} from "./cost.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import SelectInquiryEdit from "./SelectInquiryEdit"
import { useHistory } from 'react-router-dom'
export type SelectType = "selectA" | "selectB" | "selectC"
type radioTypes = "base" | "records"
const auditEnum: any = {
    "selectA": "供应询价任务",
    "selectB": "物流询价任务",
    "selectC": "工艺询价任务"
}

export default function SelectInquiryDetail(props: any): JSX.Element {
    const [radioValue, setRadioValue] = useState<radioTypes>("base")
    const [selectType, setSelectType] = useState<SelectType | "">("")
    const [count, setCount] = useState<number>(1); // 定义自增器
    const history = useHistory();
    const { loading, data, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const askPrice: any = await RequestUtil.get(`/tower-market/askPrice/${props.id}`)
            /**
             * 对于地面交货价格以及物流价格为-1情况处理
             */
            if (askPrice?.askLogisticsVOS) {
                askPrice?.askLogisticsVOS.forEach((item: any) => {
                    item.logisticsPrice = item.logisticsPrice < 0 ? "" : item.logisticsPrice;
                    item.groundReceivingPrice = item.groundReceivingPrice < 0 ? "" : item.groundReceivingPrice;
                })
            }
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
    const handleCancel = () => {
        setRadioValue("base")
        props.onCancel && props.onCancel()
    }

    // 点击重新申请
    const handleSelectInquiryTypeOk = () => {
        setSelectType(data?.askType === 0 ? 'selectA' : data?.askType === 1 ? 'selectB' : 'selectC');
        setCount(count + 1)
    }

    return <Modal {...props} width={1011} title={auditEnum[props.type]} onOk={() => props.onOk && props.onOk()} onCancel={handleCancel} destroyOnClose>
        <Spin spinning={loading}>
            {props.type === "selectA" && <>
                <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)}>
                    <Radio.Button value="base">咨询结果</Radio.Button>
                    <Radio.Button value="records">咨询信息</Radio.Button>
                </Radio.Group>
                <DetailTitle title="询价类型：供应询价" style={{ padding: "0 0 8px 0" }} />
                {radioValue === "base" && <>
                    <BaseInfo columns={supplyAskInfo} dataSource={data || {}} col={2} />
                    <DetailTitle title="国网批次招标投标原材料报价" />
                    <CommonTable columns={materialPriceHead} dataSource={data?.materialPriceVOS || []} />
                    <DetailTitle title="补充信息" />
                    <Row>{data?.replyMessage || ""}</Row>
                    <Attachment dataSource={data?.replyAttachVos || []} />
                </>}
                {radioValue === "records" && <>
                    <BaseInfo columns={supplyBaseInfo} dataSource={data || {}} col={2} />
                    <Attachment dataSource={data?.startAttachVos || []} />
                </>}
            </>}

            {props.type === "selectB" && <>
                <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)}>
                    <Radio.Button value="base">咨询结果</Radio.Button>
                    <Radio.Button value="records">咨询信息</Radio.Button>
                </Radio.Group>
                <DetailTitle title="询价类型：物流询价" style={{ padding: "0 0 8px 0" }} />
                {radioValue === "base" && <>
                    <BaseInfo columns={logisticAskInfo} dataSource={data || {}} col={2} />
                    <DetailTitle title="产品类型信息" />
                    <CommonTable columns={logisticProductType.map((item: any) => item.dataIndex === "productType" ? ({
                        ...item,
                        render: (_a: any, record: any) => `${record.voltage}kv${record.productName}`
                    }) : item)} dataSource={data?.askLogisticsVOS || []} />
                    <Attachment title="咨询附件" dataSource={data?.replyAttachVos || []} />
                </>}
                {radioValue === "records" && <>
                    <BaseInfo columns={logisticBaseInfo} dataSource={data || {}} col={2} />
                    <DetailTitle title="产品类型信息" />
                    <CommonTable columns={logisticProductReverdType.map((item: any) => item.dataIndex === "productType" ? ({
                        ...item,
                        render: (_a: any, record: any) => `${record.voltage}${record.productName}`
                    }) : item)} dataSource={data?.askLogisticsVOS || {}} />

                    <Attachment title="附件" dataSource={data?.startAttachVos || []} />
                </>}
            </>}

            {props.type === "selectC" && <>
                <Radio.Group defaultValue={radioValue} style={{ marginBottom: 12 }} onChange={(event: any) => radioOnchange(event.target.value)}>
                    <Radio.Button value="base">咨询结果</Radio.Button>
                    <Radio.Button value="records">咨询信息</Radio.Button>
                </Radio.Group>
                {radioValue === "base" && <>
                    <BaseInfo columns={workmanshipReverd} dataSource={data || {}} col={2} />
                    <Attachment title="附件" dataSource={data?.replyAttachVos || []} />
                </>}
                {radioValue === "records" && <>
                    <BaseInfo columns={workmanshipBaseInfo} dataSource={data || {}} col={2} />
                    <Attachment title="附件" dataSource={data?.startAttachVos || []} />
                </>}
            </>}
            {radioValue === "records" && data?.askStatus === 1 && <Button type="primary" style={{ marginTop: 10 }} onClick={() => handleSelectInquiryTypeOk()}>重新申请</Button>}
            {/* 申请弹框 */}
            <SelectInquiryEdit type={selectType} visible={!!selectType} onOk={() => {
                setSelectType("")
                history.go(0)
            }} onCancel={() => setSelectType("")} destroyOnClose detailOptios={data || {}} count={count} />
        </Spin>
    </Modal>
}