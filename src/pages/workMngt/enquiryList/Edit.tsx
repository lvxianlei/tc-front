import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Spin, Input, Form, message } from 'antd'
import { DetailTitle, CommonTable, BaseInfo, Attachment, AttachmentRef } from '../../common'
import { CurrentPriceInformation } from "./enquiryList.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface EditProps {
    detailId: string
}
export default forwardRef(function Edit({ detailId }: EditProps, ref): JSX.Element {
    const attchRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const [form] = Form.useForm()
    const [inquirerDescription, setInquirerDescription] = useState<string>()
    const { loading, data } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryTask/inquirer/${detailId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [detailId] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/inquiryTask/inquirer/finish`, { ...data, id: detailId })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const resetFields = () => {
        form.resetFields()
        attchRef.current?.resetFields()
    }

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            if (!inquirerDescription) {
                message.warning("请输入补充信息")
                return
            }
            const result = await saveRun({
                inquirerDescription: inquirerDescription,
                inquirerAttachList: attchRef.current?.getDataSource()
            })
            resolve(result)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields])

    return <Spin spinning={loading}>
        <Attachment dataSource={data?.projectAttachList} />
        <DetailTitle title="当前价格信息" />
        <CommonTable haveIndex columns={CurrentPriceInformation} dataSource={data?.materialDetails || []} />
        <DetailTitle title="补充信息" />
        <Input.TextArea name="inquirerDescription" value={inquirerDescription} onChange={(event: any) => setInquirerDescription(event.target.value)} />
        <Attachment title="上传附件" edit ref={attchRef} />
    </Spin>
})