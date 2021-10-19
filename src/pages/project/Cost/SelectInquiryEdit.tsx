import React, { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import { Modal, Upload, Button, Form, message } from "antd"
import { DetailTitle, CommonTable, BaseInfo, EditTable } from "../../common"
import { enclosure } from "../managementDetailData.json"
import { supplyBaseInfo, logisticBaseInfo, workmanshipBaseInfo, askLogistics } from "./costData.json"
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

export default function SelectInquiryEdit(props: any): JSX.Element {
    const [attachInfo, setAttachInfo] = useState<any[]>([])
    const { id } = useParams<{ id: string }>()
    const history = useHistory()
    const [baseForm] = Form.useForm()
    const [askForm] = Form.useForm()
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

    const { data: askData, run: getAskProduct } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const productType: any = await RequestUtil.get(`/tower-market/askInfo/getAskProductByProId?projectId=${id}`)
            askForm.setFieldsValue({ submit: productType.map((item: any) => ({ productType: `${item.voltage}${item.productName}` })) })
            resole(productType)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => {
        ["selectB", "selectC"].includes(props.type) && getAskProduct()
    }, [props.type])

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
            const saveAskData = await askForm.validateFields()
            const saveResult = await run({
                ...baseInfo, attachInfoDTOS: attachInfo, startAskLogisticsDTOS: askData?.map((item: any, index: number) => ({
                    ...item,
                    ...saveAskData.submit[index]
                }))
            })
            message.success("保存成功...")
            props.onOk && props.onOk(true)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const handleCancel = () => {
        props.onCancel && props.onCancel()
        history.go(0)
    }

    return <Modal {...props} width={1011} title={auditEnum[props.type]} confirmLoading={loading} onCancel={handleCancel} onOk={handleOk} destroyOnClose>
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

            <EditTable form={askForm} haveNewButton={false} haveOpration={false} columns={askLogistics} dataSource={(askData as any) || []} />

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
            <BaseInfo form={baseForm} columns={workmanshipBaseInfo.map((item: any) => item.dataIndex === "productType" ? ({
                ...item,
                enum: askData?.map((ask: any) => ({ value: `${ask.voltage}-${ask.productName}`, label: `${ask.voltage}${ask.productName}` })) || []
            }) : item)} dataSource={data || {}} edit />
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