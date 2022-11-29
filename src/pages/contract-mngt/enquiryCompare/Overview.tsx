import React, { useState, useRef } from "react"
import { Col, message, Row, Select } from "antd"
import { useHistory, useParams, useRouteMatch, useLocation } from "react-router-dom"
import { Button, Modal, Spin } from "antd"
import { CommonTable, DetailTitle, DetailContent, Attachment, CommonAliTable } from "../../common"
import { materialColumns } from "./enquiry.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ExportList from '../../../components/export/list';
import AddPrice from "./AddPrice"
import AddBatchPrice from "./AddBatchPrice"

function AttchFiles({ id }: { id: string }): JSX.Element {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryQuotation/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })
    return <Spin spinning={loading}>
        <Attachment title={false} dataSource={data?.inquiryQuotationAttachInfoVos || []} />
    </Spin>
}

interface AddPriceRef {
    onSubmit: () => void
    resetFields: () => void
}
export default function Overview(): JSX.Element {
    const history = useHistory()
    const addPriceRef = useRef<AddPriceRef>({ onSubmit: () => { }, resetFields: () => { } })
    const addBatchPriceRef = useRef<AddPriceRef>({ onSubmit: () => { }, resetFields: () => { } })
    const params = useParams<{ id: string , approvalStatus: string}>()
    const [visible, setVisible] = useState<boolean>(false)
    const [batchVisible, setBatchVisible] = useState<boolean>(false)
    const [attchVisible, setAttchVisible] = useState<boolean>(false)
    const [supplierVisible, setSupplierVisible] = useState<boolean>(false)
    const [supplier, setSupplier] = useState('')
    const [oprationType, setOprationType] = useState<"new" | "edit" | "batch_new" | "batch_edit">("new")
    const [detailId, setDetailId] = useState<string>("")
    const [materialLists, setMaterialList] = useState<any[]>([])
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [isExport, setIsExportStoreList] = useState(false)
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

    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/inquiryQuotation?id=${id}`)
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
                        comparisonPriceDetailDtos: materialLists.map((item: any) => ({
                            ...item,
                            winBidSupplierId: item.winBidSupplierId === -1 ? null : item.winBidSupplierId,
                            winBidSupplierName: (item.supplierOptionsVos && item.supplierOptionsVos.length > 0 && item.winBidSupplierId) ? item.supplierOptionsVos[0].supplierName : ""
                        }))
                    })
                    resove(true)
                    message.success("您已完成询价...")
                    history.goBack()
                } catch (error) {
                    reject(false)
                }
            })
        })
    }

    const handleSelect = (id: string, value: string) => setMaterialList(materialLists.map((item: any) => item.id === id ? ({
        ...item,
        winBidSupplierId: value
    }) : item))

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
    const handleAddBatchPriceOk = () => new Promise(async (resolve, reject) => {
        try {
            await addBatchPriceRef.current?.onSubmit()
            await message.success("成功添加报价...")
            setBatchVisible(false)
            history.go(0)
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: []): void => {
        setSelectedKeys(selectedRowKeys);
    }

    return <Spin spinning={loading}>
        <Modal
            width={1011}
            destroyOnClose
            title={oprationType === "batch_new" ? "批量添加报价" : "批量编辑报价"}
            visible={batchVisible}
            onOk={handleAddBatchPriceOk}
            onCancel={() => {
                addBatchPriceRef.current?.resetFields()
                setBatchVisible(false)
            }}>
            <AddBatchPrice
                id={detailId}
                type={oprationType as any}
                ref={addBatchPriceRef}
                materialLists={selectedKeys.map((item: any) => materialLists.find((mItem: any) => mItem.id === item))}
                comparisonPriceId={params.id}
            />
        </Modal>
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
            <AddPrice
                id={detailId}
                type={oprationType as any}
                ref={addPriceRef}
                materialLists={materialLists}
                comparisonPriceId={params.id}
            />
        </Modal>
        <Modal
            width={1011}
            destroyOnClose
            title="附件信息"
            visible={attchVisible}
            footer={[<Button type="primary" key="confirm" onClick={() => {
                setDetailId("")
                setAttchVisible(false)
            }}>确定</Button>]}
            onCancel={() => {
                setDetailId("")
                setAttchVisible(false)
            }}>
            <AttchFiles id={detailId} />
        </Modal>
        <Modal
            destroyOnClose
            title="中标"
            visible={supplierVisible}
            footer={[<Button type="primary" key="confirm" onClick={() => {
                const list = materialLists.map(res => {
                    if (selectedKeys.indexOf(res.id) === -1) {
                        return res
                    } else {
                        return {
                            ...res,
                            winBidSupplierId: supplier
                        }
                    }
                })
                setSelectedKeys([]);
                setSupplierVisible(false)
                setSupplier("")
                setMaterialList(list);
            }}>确定</Button>]}
            onCancel={() => {
                setSupplier("")
                setSupplierVisible(false)
            }}>
            <Row>
                <Col offset={1} span={5}>中标供应商</Col>
                <Col offset={1} span={17}>
                    <Select
                        disabled={data?.comparisonStatus !== 1}
                        onChange={(value: string) => {
                            setSupplier(value)
                        }}
                        style={{ width: '100%' }}>
                        {data?.inquiryQuotationOfferActionVo?.inquiryQuotationOfferData.map((item: any) => <Select.Option
                            value={item.supplierId}
                            key={item.id}>{item.supplierName}</Select.Option>)}
                    </Select>
                </Col>
            </Row>
        </Modal>
        <DetailContent title={[
            <Button
                type="primary"
                ghost
                key="export"
                style={{ marginRight: 16 }}
                onClick={() => { setIsExportStoreList(true) }}
            >导出</Button>,
            <Button
                type="primary"
                ghost key="finish"
                style={{ marginRight: 16 }}
                loading={finishPriceLoading}
                onClick={handleFinishPrice}
                disabled={params.approvalStatus === '1'}
            >完成询价</Button>,
            <Button
                disabled={params.approvalStatus === '1'}
                type="primary"
                style={{ marginRight: 16 }}
                ghost key="add"
                onClick={() => {
                    setOprationType("new")
                    setVisible(true)
                }}>添加报价</Button>,
            <Button
                disabled={params.approvalStatus === '1'}
                type="primary"
                style={{ marginRight: 16 }}
                ghost key="addBatchPrice"
                onClick={() => {
                    setOprationType("batch_new")
                    setBatchVisible(true)
                }}>批量添加报价</Button>,
            <Button
                type="primary"
                style={{ marginRight: 16 }}
                ghost
                key="select"
                disabled={params.approvalStatus === '1'}
                onClick={() => {
                    if (selectedKeys.length > 0) {
                        setSupplierVisible(true)
                    } else {
                        message.warning('请选择要批量中标的数据');
                    }
                }}>批量中标选择</Button>,
            <Button
                type="primary"
                style={{ marginRight: 16 }}
                ghost
                key="select"
                disabled={params.approvalStatus === '1'}
                onClick={async () => {
                    if([undefined, 'undefined',0,'0',2,'2',3,'3',4,'4'].includes(params?.approvalStatus)){
                        await RequestUtil.get(`/tower-supply/comparisonPrice/workflow/start/${params.id}`)
                        message.success('审批发起成功！')
                        history.go(-1)
                    }else{
                        message.error("当前不可发起审批！")
                    }
                    
                }}>发起审批</Button>,
            <Button
                type="primary"
                style={{ marginRight: 16 }}
                ghost
                key="select"
                disabled={params.approvalStatus !== '1'}
                onClick={async () => {
                    if([1,'1'].includes(params?.approvalStatus)){
                        await RequestUtil.get(`/tower-supply/comparisonPrice/workflow/cancel/${params.id}`)
                        message.success('撤销成功！')
                        history.go(-1)
                    }else{
                        message.error("不可撤销！")
                    }
                }}>撤销审批</Button>
        ]}
            operation={[
                <Button key="back" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <DetailTitle title="询价产品信息" style={{ marginTop: "24px" }} />
            <CommonAliTable
                columns={[
                    ...materialColumns,
                    ...(data?.headerColumnVos.map((item: any) => ({
                        ...item,
                        width: 100,
                        render: (_value: any, records: any) => <div
                            style={records?.inquiryQuotationOfferData&&records?.inquiryQuotationOfferData?.minTaxOffer&&records?.inquiryQuotationOfferData?.[item.dataIndex]&&records?.inquiryQuotationOfferData?.minTaxOffer === records?.inquiryQuotationOfferData?.[item.dataIndex] ? {
                                background: "green",
                                color: "#fff",
                                fontWeight: 600,
                                width: "100%",
                                height: "100%",
                                lineHeight: "32px"
                            } : {}}
                        >{records?.inquiryQuotationOfferData?.[item.dataIndex]}</div>
                    })) || []),
                    {
                        title: "中标供应商",
                        dataIndex: "winBidSupplierId",
                        width: 140,
                        render: (value: any, records: any) => (<Select
                            // disabled={data?.comparisonStatus !== 1}
                            value={value === -1 ? "" : value}
                            onChange={(value: string) => handleSelect(records.id, value)}
                            style={{ width: "100%", height: "100%" }}>
                            {data?.inquiryQuotationOfferActionVo?.inquiryQuotationOfferData.map((item: any) => <Select.Option
                                value={item.supplierId}
                                key={item.id}>{item.supplierName}</Select.Option>)}
                        </Select>)
                    }]}
                rowSelection={{
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange,
                }}
                dataSource={materialLists}
            />
            <DetailTitle title="询价报价信息" />
            <CommonTable
                haveIndex
                columns={[
                    ...data?.inquiryQuotationOfferActionVo?.headerColumnVos.map((item: any) => {
                        if (item.dataIndex !== "supplierName") {
                            return ({
                                ...item,
                                render: (value: string, records: any) => {
                                    if (records.material.includes(item.dataIndex)) {
                                        return <span style={{ backgroundColor: "rgba(2, 89, 161, .48)" }}>{value}</span>
                                    }
                                    return <span>{value}</span>
                                }
                            })
                        }
                        return item
                    }) || [],
                    {
                        title: "操作",
                        fixed: "right",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            <Button
                                style={{
                                    padding: 0,
                                    marginRight: 12
                                }}
                                disabled={data?.comparisonStatus !== 1} type="link" onClick={() => {
                                    setDetailId(records.id)
                                    setOprationType("edit")
                                    setVisible(true)
                                }}>编辑</Button>
                            <Button
                                style={{
                                    padding: 0,
                                    marginRight: 12
                                }}
                                type="link" onClick={() => {
                                    setDetailId(records.id)
                                    setAttchVisible(true)
                                }}>附件</Button>
                            <Button
                                style={{
                                    padding: 0
                                }}
                                disabled={data?.comparisonStatus !== 1} type="link" onClick={() => {
                                    Modal.confirm({
                                        title: "删除",
                                        content: "确定删除吗？",
                                        onOk: async () => {
                                            await deleteRun(records.id);
                                            message.success("成功删除！");
                                            history.go(0);
                                        }
                                    })
                                }}>移除</Button>
                        </>
                    }]}
                dataSource={data?.inquiryQuotationOfferActionVo?.inquiryQuotationOfferData || []}
            />
        </DetailContent>
        {isExport ? <ExportList
            history={history}
            location={location}
            match={match}
            columnsKey={() => {
                let keys = [...materialColumns, {
                    title: "中标供应商",
                    dataIndex: "winBidSupplierName",
                }]
                return keys
            }}
            current={1}
            size={materialLists.length}
            total={materialLists.length}
            url={`/tower-supply/comparisonPrice/exportComparisonPriceDetails`}
            serchObj={{ comparisonPriceId: params.id }}
            closeExportList={() => { setIsExportStoreList(false) }}
        /> : null}
    </Spin>
}