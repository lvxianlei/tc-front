import React, { useState, forwardRef, useImperativeHandle, useRef } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Modal, Spin } from "antd"
import { CommonTable, DetailTitle, DetailContent } from "../../common"
import { materialColumns } from "./enquiry.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import AddPrice from "./AddPrice"
interface AddPriceRef {
    onSubmit: () => void
    resetFields: () => void
}
export default function Overview(): JSX.Element {
    const history = useHistory()
    const addPriceRef = useRef<AddPriceRef>({ onSubmit: () => { }, resetFields: () => { } })
    const params = useParams<{ id: string }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [oprationType, setOprationType] = useState<"new" | "edit">("new")
    const [detailId, setDetailId] = useState<string>("")
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/comparisonPrice/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [params.id] })

    const { loading: finishPriceLoading, run: finishPriceRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/comparisonPrice/completeComparisonPrice`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleFinishPrice = async () => {
        Modal.confirm({
            title: "提交/完成",
            content: "确认提交/完成？",
            okText: "提交/完成",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await finishPriceRun()
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            })
        })
    }

    return <Spin spinning={loading}>
        <Modal
            width={1011}
            title={oprationType === "new" ? "添加报价" : "编辑报价"}
            visible={visible}
            onCancel={() => {
                addPriceRef.current?.resetFields()
                setVisible(false)
            }}>
            <AddPrice id={detailId} type={oprationType} ref={addPriceRef} />
        </Modal>
        <DetailContent title={[
            <Button type="primary" ghost key="export" style={{ marginRight: 16 }}>导出</Button>,
            <Button type="primary" ghost key="finish" style={{ marginRight: 16 }} loading={finishPriceLoading} onClick={handleFinishPrice}>完成询价</Button>,
            <Button type="primary" style={{ marginRight: 16 }} ghost key="add" onClick={() => {
                setOprationType("new")
                setVisible(true)
            }}>添加报价</Button>
        ]} operation={[
            <Button type="primary" ghost key="goback" onClick={() => history.goBack()}>返回</Button>
        ]}>
            <DetailTitle title="询价产品信息" />
            <CommonTable columns={materialColumns} dataSource={data?.comparisonPriceDetailVos || []} />
            <DetailTitle title="询价报价信息" />
            <CommonTable
                columns={[
                    ...data?.inquiryQuotationOfferActionVo?.headerColumnVos || [],
                    {
                        title: "操作",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            <Button type="link" onClick={() => {
                                setDetailId(records.id)
                                setOprationType("edit")
                                setVisible(true)
                            }}>编辑</Button>
                            <Button type="link">附件</Button>
                        </>
                    }]}
                dataSource={data?.inquiryQuotationOfferActionVo?.inquiryQuotationOfferData || []}
            />
        </DetailContent>
    </Spin>
}