import React, { forwardRef, useState, useImperativeHandle } from "react"
import { Upload, Button, Form } from "antd"
import { BaseInfo, CommonTable, DetailTitle } from "../../common"
import AuthUtil from "../../../utils/AuthUtil"
interface AddPriceProps {
    id: string,
    type: "new" | "edit"
}
export default forwardRef(function ({ id, type }: AddPriceProps, ref): JSX.Element {
    const [attchs, setAttachs] = useState<any[]>([])
    const [form] = Form.useForm()
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
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref])

    const resetFields = () => {
        form.resetFields()
        setAttachs([])
    }

    const onSubmit = async () => {
        const formData = await form.validateFields()

    }

    return <>
        <DetailTitle title="询比价基本信息" />
        <BaseInfo form={form} columns={[]} dataSource={{}} />
        <DetailTitle title="询价原材料" />
        <CommonTable columns={[]} dataSource={[]} />
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
            dataSource={attchs}
            showHeader={false}
        />
    </>
})