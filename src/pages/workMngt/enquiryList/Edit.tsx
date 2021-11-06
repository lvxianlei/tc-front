import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Spin, Button, Upload, Form } from 'antd'
import { DetailTitle, CommonTable, BaseInfo } from '../../common'
import { CurrentPriceInformation } from "./enquiryList.json"
import AuthUtil from "../../../utils/AuthUtil"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { downLoadFile } from "../../../utils"
interface EditProps {
    detailId: string
}
export default forwardRef(function Edit({ detailId }: EditProps, ref): JSX.Element {
    const [attchs, setAttachs] = useState<any[]>([])
    const [form] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryTask/taskResult/${detailId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/inquiryTask/inquirer/finish`, { ...data, id: detailId })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref])

    const resetFields = () => {
        form.resetFields()
        setAttachs([])
    }

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const formData = await form.validateFields()
            const result = await saveRun({
                inquirerDescription: formData.inquirerDescription,
                inquirerAttachList: attchs
            })
            resolve(result)
        } catch (error) {
            reject(false)
        }
    })

    const uploadChange = (event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                const dataInfo = event.file.response.data
                const fileInfo = dataInfo.name.split(".")
                setAttachs([...attchs, {
                    id: "",
                    uid: attchs.length,
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
        setAttachs(attchs.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    }

    return <Spin spinning={loading}>
        <DetailTitle title="相关附件" />
        <CommonTable
            columns={[{
                title: "名称",
                dataIndex: "name",
                width: 300
            },
            {
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <>
                    <Button type="link">查看</Button>
                </>
            }]}
            dataSource={data?.inquirerAttachList || []}
            showHeader={false}
        />
        <DetailTitle title="相关附件" />
        <CommonTable columns={CurrentPriceInformation} dataSource={data?.materialDetails || []} />
        <DetailTitle title="补充信息" />
        <BaseInfo form={form} col={2} columns={[{
            title: "",
            dataIndex: "inquirerDescription",
            type: "textarea"
        }]} dataSource={{}} edit />
        <DetailTitle title="相关附件" operation={[<Upload
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
        ><Button key="enclosure" type="primary" ghost>上传附件</Button></Upload>]} />
        <CommonTable columns={[
            {
                title: "附件名称",
                dataIndex: "name"
            },
            {
                title: "操作",
                dataIndex: "opration",
                render: (_: any, record: any) => (<>
                    <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>删除</Button>
                    <Button type="link" onClick={() => downLoadFile(record.link || record.filePath)}>下载</Button>
                </>)
            }]} dataSource={attchs} />
    </Spin>
})