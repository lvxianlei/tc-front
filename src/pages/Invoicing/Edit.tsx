import React, { useState } from "react"
import { Button, Upload, Form } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, EditTable } from '../common'
import { baseInfoHead, invoiceHead, billingHead } from "./InvoicingData.json"
import { enclosure } from '../project/managementDetailData.json'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import AuthUtil from "../../utils/AuthUtil"
import { downLoadFile } from "../../utils"
import ApplicationContext from "../../configuration/ApplicationContext"
export default function Edit() {
    const [attachVosData, setAttachVosData] = useState<any[]>([])
    const [baseInfo] = Form.useForm()
    const [invoicForm] = Form.useForm()
    const [billingForm] = Form.useForm()
    const productType: any = (ApplicationContext.get().dictionaryOption as any)["101"]
    const { loading: logicWeightLoading, data: logicWeightData, run: logicWeightRun } = useRequest<{ [key: string]: any }>((id) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice/getLogicWeightByContractId?contractId=${id}`)
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
                setAttachVosData([...attachVosData, {
                    id: "",
                    uid: attachVosData.length,
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

    const generateInitValues = (columns: any[]) => {
        const values: any = {}
        columns.forEach((columnItem: any) => {
            if (columnItem.type === "numbe") {
                values[columnItem.dataIndex] = 0
            }
        })
        return values
    }

    const deleteAttachData = (id: number) => {
        setAttachVosData(attachVosData.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    }

    const handleSave = async () => {
        const baseInfoData = await baseInfo.validateFields()
        const invoicData = await invoicForm.validateFields()
        const billingData = await billingForm.validateFields()
    }

    const handleBaseInfoChange = async (fields: any) => {
        if (fields.contractCode) {
            const contractValue = fields.contractCode.records[0]
            const logicWeight = await logicWeightRun(contractValue.id)
            baseInfo.setFieldsValue({
                contractCompany: contractValue.signCustomerName,
                projectCode: contractValue.contractNumber,
                contractSignTime: contractValue.signContractTime,
                ticketWeight: logicWeight.logicWeight,
                reasonWeight: logicWeight.logicWeight,
                planCode: logicWeight.taskNoticeNumbers,
                contractDevTime: contractValue.deliveryTime,
                business: contractValue.salesman
            })
        }
    }

    const handleEditTableChange = (fields: any, allFields: any) => {
        const currentRowData = fields.submit[fields.submit.length - 1]

    }

    return <DetailContent operation={[
        <Button
            type="primary" key="save"
            style={{ marginRight: 16 }}
            onClick={handleSave}>保存</Button>,
        <Button key="cancel">取消</Button>
    ]}>
        <DetailTitle title="基本信息" />
        <BaseInfo onChange={handleBaseInfoChange} form={baseInfo} columns={baseInfoHead.map((item: any) => item.dataIndex === "productTypeId" ? ({
            ...item,
            enum: productType.map((product: any) => ({ value: product.id, label: product.name }))
        }) : item)} dataSource={generateInitValues(baseInfoHead)} edit />

        <DetailTitle title="发票信息" />
        <BaseInfo form={invoicForm} columns={invoiceHead} dataSource={generateInitValues(invoiceHead)} edit />

        <DetailTitle title="开票明细" operation={[]} />

        <EditTable onChange={handleEditTableChange} form={billingForm} columns={billingHead} dataSource={[]} />

        <DetailTitle title="附件" operation={[<Upload
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
        <CommonTable columns={[{
            title: "操作", dataIndex: "opration",
            render: (_: any, record: any) => (<>
                <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>删除</Button>
                <Button type="link" onClick={() => downLoadFile(record.link || record.filePath)}>下载</Button>
            </>)
        }, ...enclosure]} dataSource={attachVosData} />
    </DetailContent>
}