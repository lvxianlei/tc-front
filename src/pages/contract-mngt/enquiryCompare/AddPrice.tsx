import React, { forwardRef, useState, useImperativeHandle } from "react"
import { Upload, Button, Form, Spin, InputNumber } from "antd"
import { addPriceHead } from "./enquiry.json"
import { BaseInfo, CommonTable, DetailTitle } from "../../common"
import AuthUtil from "../../../utils/AuthUtil"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface AddPriceProps {
    id: string,
    type: "new" | "edit"
    materialLists: any[]
}
export default forwardRef(function ({ id, type, materialLists }: AddPriceProps, ref): JSX.Element {
    const [attchs, setAttachs] = useState<any[]>([])
    const [materials, setMaterials] = useState<any[]>(materialLists || [])
    const [form] = Form.useForm()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryQuotation/${id}`)
            form.setFieldsValue({ supplier: result.supplierName })
            setMaterials(result?.inquiryQuotationOfferVos)
            setAttachs(result?.inquiryQuotationAttachInfoVos)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/inquiryQuotation`, { ...data })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

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
        setMaterials([])
    }

    const onSubmit = async () => {
        const formData = await form.validateFields()
        return saveRun({
            supplierId: formData.supplier?.id || data?.supplierId,
            supplierName: formData.supplier?.value || data?.supplierName,
            inquiryQuotationOfferDtos: materials,
            inquiryQuotationAttachInfoDtos: attchs
        })
    }

    const handleChange = (id: string, value: number, name: string) => {
        setMaterials(materials.map((item: any) => item.id === id ? ({ ...item, [name]: value }) : item))
    }

    return <Spin spinning={loading}>
        <DetailTitle title="询比价基本信息" />
        <BaseInfo form={form} col={1} columns={[{
            "title": "供应商",
            "dataIndex": "supplier",
            "type": "popTable",
            "path": "/tower-supply/supplier",
            "width": 1011,
            "value": "supplierName",
            "dependencies": true,
            "readOnly": true,
            "columns": [
                {
                    "title": "供应商编号",
                    "dataIndex": "supplierCode"
                },
                {
                    "title": "供应商名称",
                    "dataIndex": "supplierName"
                },
                {
                    "title": "联系人",
                    "dataIndex": "contactMan"
                },
                {
                    "title": "联系电话",
                    "dataIndex": "contactNumber"
                },
                {
                    "title": "供货产品",
                    "dataIndex": "supplyProducts"
                }
            ],
            "rules": [
                {
                    "required": true,
                    "message": "请选择供应商..."
                }
            ]
        }]} dataSource={{}} edit />
        <DetailTitle title="询价原材料" />
        <CommonTable columns={addPriceHead.map((item: any) => {
            if (item.dataIndex === "taxOffer") {
                return ({ ...item, render: (value: number, records: any) => <InputNumber value={[-1, "-1"].includes(value) ? 0 : value} key={records.id} onChange={(value: number) => handleChange(records.id, value, "taxOffer")} /> })
            }
            if (item.dataIndex === "offer") {
                return ({ ...item, render: (value: number, records: any) => <InputNumber value={[-1, "-1"].includes(value) ? 0 : value} key={records.id} onChange={(value: number) => handleChange(records.id, value, "offer")} /> })
            }
            return item
        })} dataSource={materials} />
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
    </Spin>
})