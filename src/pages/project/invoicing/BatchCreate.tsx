import React, { forwardRef, useImperativeHandle } from "react"
import { Form } from "antd"
import { EditTable } from "../../common"
import { batchCreateColumns } from "./InvoicingData.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"

export default forwardRef(function BatchCreate(props, ref): JSX.Element {
    const [form] = Form.useForm()

    const { loading, run: saveRun } = useRequest<{ [key: string]: any }>((saveData) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/invoicing/saveInvoicingBatch`, saveData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleChange = (fields: any, allFields: any) => {
        if (fields.submit.length - 1 >= 0) {
            const currentRowData = fields.submit[fields.submit.length - 1]
            if (currentRowData.contractCode) {
                const newFields = allFields.submit.map((item: any, index: number) => index === fields.submit.length - 1 ? ({
                    ...item,
                    contractName: currentRowData.contractCode?.records?.[0]?.contractName,
                    contractCompany: currentRowData.contractCode?.records?.[0]?.customerCompany,
                    business: currentRowData.contractCode?.records?.[0]?.salesman,
                }) : item)
                form.setFieldsValue({
                    submit: newFields
                })
            }
        }
    }

    const onSubmit = async () => {
        try {
            const postData = await form.validateFields()
            await saveRun(postData.submit.map((item: any) => ({
                ...item,
                contractSignTime: item.contractCode?.records?.[0]?.signContractTime,
                contractCode: item.contractCode?.id
            })))
        } catch (error) {
            console.log("Error:", error)
        }
    }

    useImperativeHandle(ref, () => ({ onSubmit, loading }), [handleChange, loading])
    return <EditTable form={form} columns={batchCreateColumns} dataSource={[]} onChange={handleChange} />
})