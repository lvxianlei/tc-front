import React, { useState, forwardRef, useImperativeHandle, useRef } from "react"
import { message, Select } from "antd"
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
    const [materialLists, setMaterialList] = useState<any[]>([])
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/comparisonPrice/${params.id}`)
            setMaterialList(result?.comparisonPriceDetailVos)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [params.id] })

    const { loading: finishPriceLoading, run: finishPriceRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/comparisonPrice/completeComparisonPrice`, { ...data, id: params.id })
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
                    await finishPriceRun({
                        comparisonPriceDetailDtos: data?.comparisonPriceDetailVos
                    })
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            })
        })
    }

    const handleSelect = (id: string, value: string) => setMaterialList(materialLists.map((item: any) => item.id === id ? ({ ...item, winBidSupplierId: value }) : item))


    const handleAddPriceOk = () => new Promise(async (resolve, reject) => {
        try {
            await addPriceRef.current?.onSubmit()
            await message.success("成功添加报价...")
            setVisible(false)
            history.go(0)
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    return <Spin spinning={loading}>
        <Modal
            width={1011}
            destroyOnClose
            title={oprationType === "new" ? "添加报价" : "编辑报价"}
            visible={visible}
            onOk={handleAddPriceOk}
            onCancel={() => {
                addPriceRef.current?.resetFields()
                setVisible(false)
            }}>
            <AddPrice id={detailId} type={oprationType} ref={addPriceRef} materialLists={materialLists} />
        </Modal>
        <DetailContent title={[
            <Button type="primary" ghost key="export" style={{ marginRight: 16 }}>导出</Button>,
            <Button
                type="primary"
                ghost key="finish"
                style={{ marginRight: 16 }}
                loading={finishPriceLoading}
                onClick={handleFinishPrice}
                disabled={data?.comparisonStatus !== 1}
            >完成询价</Button>,
            <Button type="primary" style={{ marginRight: 16 }} ghost key="add" onClick={() => {
                setOprationType("new")
                setVisible(true)
            }}>添加报价</Button>
        ]} operation={[
            <Button type="primary" ghost key="goback" onClick={() => history.goBack()}>返回</Button>
        ]}>
            <DetailTitle title="询价产品信息" />
            <CommonTable columns={[...materialColumns, {
                title: "中标供应商",
                dataIndex: "winBidSupplierId",
                render: (value: any, records: any) => <Select
                    value={value}
                    onChange={(value: string) => handleSelect(records.id, value)}
                    style={{ width: 150, height: 32 }}>
                    {data?.inquiryQuotationOfferActionVo?.inquiryQuotationOfferData.map((item: any) => <Select.Option
                        value={item.id}
                        key={item.id}>{item.supplierName}</Select.Option>)}
                </Select>
            }]} dataSource={materialLists} />
            <DetailTitle title="询价报价信息" />
            <CommonTable
                columns={[
                    ...data?.inquiryQuotationOfferActionVo?.headerColumnVos || [],
                    {
                        title: "操作",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            <a onClick={() => {
                                setDetailId(records.id)
                                setOprationType("edit")
                                setVisible(true)
                            }}>编辑</a>
                            <Button type="link" onClick={() => message.warning("功能开发中...")}>附件</Button>
                            <a type="link" onClick={() => message.warning("功能开发中...")}>移除</a>
                        </>
                    }]}
                dataSource={data?.inquiryQuotationOfferActionVo?.inquiryQuotationOfferData || []}
            />
        </DetailContent>
    </Spin>
}