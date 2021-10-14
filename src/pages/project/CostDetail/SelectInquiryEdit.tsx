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

export default function SelectInquiryEdit(props: any): JSX.Element {
    const [selectValue, setSelectValue] = useState("")
    const [attachInfo, setAttachInfo] = useState<any[]>([])
    const uploadChange = (event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                const dataInfo = event.file.response.data
                const fileInfo = dataInfo.name.split(".")
                setAttachInfo([...attachInfo, {
                    id: "",
                    uid: attachInfo.length,
                    link: dataInfo.link,
                    name: dataInfo.originalName.split(".")[0],
                    description: "",
                    filePath: dataInfo.name,
                    fileSize: dataInfo.size,
                    fileSuffix: fileInfo[fileInfo.length - 1],
                    userName: dataInfo.userName,
                    fileUploadTime: dataInfo.fileUploadTime
                }])
            }
        }
    }
    const deleteAttachData = (id: number) => {
        setAttachInfo(attachInfo.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    }
    return <Modal {...props} width={1011} title={auditEnum[props.type]} onOk={() => props.onOk && props.onOk(selectValue)} destroyOnClose>
        {props.type === "selectA" && <>
            <DetailTitle title="询价类型：供应询价" />
            <BaseInfo columns={[]} dataSource={{}} />
            <DetailTitle title="附件" operation={[
                <Upload
                    key="sub"
                    name="file"
                    multiple={true}
                    action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
                    headers={{
                        'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                        'Tenant-Id': AuthUtil.getTenantId(),
                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                    }}
                    onChange={uploadChange}
                    showUploadList={false}
                ><Button type="primary" ghost>上传附件</Button></Upload>
            ]} />
            <CommonTable columns={[{
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <>
                    <Button type="link" onClick={() => deleteAttachData(records.uid || records.id)}>删除</Button>
                    <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                </>
            }, ...enclosure]} dataSource={attachInfo} />
        </>}
        {props.type === "selectB" && <>
            <DetailTitle title="询价类型：物流询价" />
            <BaseInfo columns={[]} dataSource={{}} />
            <DetailTitle title="附件" operation={[
                <Upload
                    key="sub"
                    name="file"
                    multiple={true}
                    action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
                    headers={{
                        'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                        'Tenant-Id': AuthUtil.getTenantId(),
                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                    }}
                    showUploadList={false}
                    onChange={uploadChange}
                ><Button type="primary" ghost>上传附件</Button></Upload>
            ]} />
            < CommonTable columns={[{
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <>
                    <Button type="link" onClick={() => deleteAttachData(records.uid || records.id)}>删除</Button>
                    <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                </>
            }, ...enclosure]} dataSource={attachInfo} />
        </>}
        {props.type === "selectC" && <>
            <DetailTitle title="询价类型：工艺询价" />
            <BaseInfo columns={[]} dataSource={{}} />
            <DetailTitle title="附件" operation={[
                <Upload
                    key="sub"
                    name="file"
                    multiple={true}
                    action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
                    headers={{
                        'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                        'Tenant-Id': AuthUtil.getTenantId(),
                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                    }}
                    showUploadList={false}
                    onChange={uploadChange}
                ><Button type="primary" ghost>上传附件</Button></Upload>
            ]} />
            <CommonTable columns={[{
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <>
                    <Button type="link" onClick={() => deleteAttachData(records.uid || records.id)}>删除</Button>
                    <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                </>
            }, ...enclosure]} dataSource={attachInfo} />
        </>}
    </Modal>
}