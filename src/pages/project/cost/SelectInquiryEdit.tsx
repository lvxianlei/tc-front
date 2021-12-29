import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { Modal, Form, message } from "antd"
import { DetailTitle, BaseInfo, EditTable, Attachment, AttachmentRef } from "../../common"
import { supplyBaseInfo, logisticBaseInfo, workmanshipBaseInfo, askLogistics } from "./cost.json"
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
    const [baseForm] = Form.useForm()
    const [askForm] = Form.useForm()
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } });
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
            baseForm.setFieldsValue({ productType: productType?.map((ask: any) => `${ask.voltage}${ask.productName}`).join(",") })
            if (props.detailOptios) {
                props.detailOptios && props.detailOptios.startAttachVos && props.detailOptios.startAttachVos.forEach((item: any, index: number) => {
                    item['link'] = item.filePath;
                    item['uid'] = index;
                })
                setAttachInfo(props.detailOptios?.startAttachVos || []);
                baseForm.setFieldsValue({
                    ...props.detailOptios
                })
                const ask = props.detailOptios && props.detailOptios.askLogisticsVOS && props.detailOptios.askLogisticsVOS || [];
                ask.forEach((item: any) => item['productType'] = `${item.voltage}${item.productName}`)
                askForm.setFieldsValue({
                    submit: ask
                })
            }
            resole(productType)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => {
        ["selectA", "selectB", "selectC"].includes(props.type) && getAskProduct()
    }, [props.type, props.count])

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            const baseInfo = await baseForm.validateFields()
            const saveAskData = await askForm.validateFields()
            const saveResult = await run({
                ...baseInfo,
                fileIds: attchsRef.current?.getDataSource().map(item => item.id),
                startAskLogisticsDTOS: props.type === "selectB" ? askData?.map((item: any, index: number) => ({
                    ...item,
                    ...saveAskData.submit[index]
                })) : []
            })
            if (saveResult) {
                message.success("保存成功...")
                props.onOk && props.onOk(true)
                resove(true)
            } else {
                reject(false)
            }
        } catch (error) {
            if ((error as any).errorFields) {
                message.warning("请检查是否有必填项未填写...")
            } else {
                message.error("保存失败...")
            }
            reject(error)
        }
    })

    const handleCancel = () => {
        props.onCancel && props.onCancel()
        baseForm.resetFields()
        askForm.resetFields()
        setAttachInfo([])
    }

    return <Modal {...props} width={1011} title={auditEnum[props.type]} confirmLoading={loading} onCancel={handleCancel} onOk={handleOk} destroyOnClose>
        {props.type === "selectA" && <>
            <DetailTitle title="询价类型：供应询价" />
            <BaseInfo form={baseForm} columns={supplyBaseInfo} dataSource={data || {}} edit  col={2}/>
            <Attachment title="附件" maxCount={10} ref={attchsRef} edit dataSource={attachInfo} />
        </>}
        {props.type === "selectB" && <>
            <DetailTitle title="询价类型：物流询价" />
            <BaseInfo form={baseForm} columns={logisticBaseInfo} dataSource={data || {}} edit col={2}/>
            <EditTable form={askForm} haveNewButton={false} haveOpration={false} columns={askLogistics} dataSource={[]} />
            <Attachment title="附件" maxCount={10} ref={attchsRef} edit dataSource={attachInfo} />
        </>}
        {props.type === "selectC" && <>
            <DetailTitle title="询价类型：工艺询价" />
            <BaseInfo form={baseForm} columns={workmanshipBaseInfo} dataSource={data || {}} edit  col={2}/>
            <Attachment title="附件" maxCount={10} ref={attchsRef} edit dataSource={attachInfo} />
        </>}
    </Modal>
}