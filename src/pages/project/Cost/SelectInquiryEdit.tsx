import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { Modal, Upload, Button, Form, message } from "antd"
import { DetailTitle, CommonTable, BaseInfo } from "../../common"
import { enclosure } from "../managementDetailData.json"
import AuthUtil from "../../../utils/AuthUtil"
import { downLoadFile } from "../../../utils"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export type SelectType = "selectA" | "selectB" | "selectC"

const auditEnum: any = {
    "selectA": "供应询价任务",
    "selectB": "物流询价任务",
    "selectC": "工艺询价任务"
}

const auditCode: any = {
    "selectA": 0,
    "selectB": 1,
    "selectC": 2
}

const supplyBaseInfo = [
    {
        title: "项目名称",
        dataIndex: "projectName",
        disabled: true
    },
    {
        title: "客户名称",
        dataIndex: "biddingPerson",
        disabled: true
    },
    {
        title: "投标截止日期",
        dataIndex: "biddingEndTime",
        disabled: true
    },
    {
        title: "项目负责人",
        dataIndex: "projectLeader",
        disabled: true
    },
    {
        title: "备注",
        dataIndex: "remark",
        type: "textarea"
    }
]

const logisticBaseInfo = [
    {
        title: "项目名称",
        dataIndex: "projectName",
        disabled: true
    },
    {
        title: "客户名称",
        dataIndex: "biddingPerson",
        disabled: true
    },
    {
        title: "投标截止日期",
        dataIndex: "biddingEndTime",
        disabled: true
    },
    {
        title: "项目负责人",
        dataIndex: "projectLeader",
        disabled: true
    },
    {
        title: "备注",
        dataIndex: "remark",
        type: "textarea"
    }
]

const workmanshipBaseInfo = [
    {
        title: "项目名称",
        dataIndex: "projectName",
        disabled: true
    },
    {
        title: "客户名称",
        dataIndex: "biddingPerson",
        disabled: true
    },
    {
        title: "投标截止日期",
        dataIndex: "biddingEndTime",
        disabled: true
    },
    {
        title: "项目负责人",
        dataIndex: "projectLeader",
        disabled: true
    },
    {
        title: "产品类型",
        dataIndex: "productType"
    },
    {
        title: "备注",
        dataIndex: "remark",
        type: "textarea"
    }
]

export default function SelectInquiryEdit(props: any): JSX.Element {
    const [attachInfo, setAttachInfo] = useState<any[]>([])
    const { id } = useParams<{ id: string }>()
    const [baseForm] = Form.useForm()
    const { loading, run } = useRequest<{ [key: string]: any }>((saveData: any) => new Promise(async (resole, reject) => {
        try {
            const productType: any = await RequestUtil.post(`/tower-market/askPrice`, { ...saveData, projectId: id, askType: auditCode[props.type] })
            resole(productType)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const productType: any = await RequestUtil.get(`/tower-market/projectInfo/${id}`)
            resole(productType)
        } catch (error) {
            reject(error)
        }
    }))

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

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            const baseInfo = await baseForm.validateFields()
            const saveResult = await run({ ...baseInfo, attachInfoDTOS: attachInfo })
            message.success("保存成功...")
            resove(true)
        } catch (error) {
            reject(false)
        }
    })
    // {
    // props.onOk && props.onOk(selectValue)
    // }

    return <Modal {...props} width={1011} title={auditEnum[props.type]} confirmLoading={loading} onOk={handleOk} destroyOnClose>
        {props.type === "selectA" && <>
            <DetailTitle title="询价类型：供应询价" />
            <BaseInfo form={baseForm} columns={supplyBaseInfo} dataSource={data || {}} edit />
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
            <BaseInfo form={baseForm} columns={logisticBaseInfo} dataSource={data || {}} edit />
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
            <BaseInfo form={baseForm} columns={workmanshipBaseInfo} dataSource={data || {}} edit />
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