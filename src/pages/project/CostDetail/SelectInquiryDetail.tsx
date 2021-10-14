import React, { useState } from "react"
import { Modal, Upload, Button } from "antd"
import { DetailTitle, CommonTable, BaseInfo } from "../../common"
import { enclosure } from "../../project/managementDetailData.json"
import AuthUtil from "../../../utils/AuthUtil"
import { downLoadFile } from "../../../utils"
export type SelectType = "selectA" | "selectB" | "selectC"

const auditEnum: any = {
    "selectA": "供应询价任务",
    "selectB": "物流询价任务",
    "selectC": "工艺询价任务"
}

export default function SelectInquiryDetail(props: any): JSX.Element {
    const [selectValue, setSelectValue] = useState("")
    const [attachInfo, setAttachInfo] = useState<any[]>([])

    return <Modal {...props} width={1011} title={auditEnum[props.type]} onOk={() => props.onOk && props.onOk(selectValue)} destroyOnClose>
        {props.type === "selectA" && <>
            <DetailTitle title="询价类型：供应询价" />
            <BaseInfo columns={[]} dataSource={{}} />
            <DetailTitle title="相关附件" />
            <CommonTable columns={[{
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <>
                    <Button type="link" >预览</Button>
                    <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                </>
            }, ...enclosure]} dataSource={attachInfo} />
        </>}
        {props.type === "selectB" && <>
            <DetailTitle title="询价类型：物流询价" />
            <BaseInfo columns={[]} dataSource={{}} />
            <DetailTitle title="相关附件" />
            <CommonTable columns={[{
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <>
                    <Button type="link" >预览</Button>
                    <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                </>
            }, ...enclosure]} dataSource={attachInfo} />
        </>}
        {props.type === "selectC" && <>
            <DetailTitle title="询价类型：工艺询价" />
            <BaseInfo columns={[]} dataSource={{}} />
            <DetailTitle title="相关附件" />
            <CommonTable columns={[{
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <>
                    <Button type="link" >预览</Button>
                    <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                </>
            }, ...enclosure]} dataSource={attachInfo} />
        </>}
    </Modal>
}