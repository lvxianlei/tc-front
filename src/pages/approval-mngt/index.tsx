import React, { useRef, useState } from 'react'
import { Space, Button, Input, Modal, Form, message, Select, DatePicker } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page, BaseInfo, DetailTitle, EditTable, Attachment, AttachmentRef } from '../common'
import ApprovalTypesView from "./ApprovalTypesView"
import SelectAuditType from './SelectAuditType'
import useRequest from '@ahooksjs/use-request'
import { bondBaseInfo, drawH, drawingCofirm, baseInfo, outFactoryHead, addanewone, auditHead } from "./approval.json"
import RequestUtil from '../../utils/RequestUtil'
import { currencyTypeOptions, paymentCategoryOptions } from '../../configuration/DictionaryOptions'
const auditEnum: any = {
    "performance_bond": "履约保证金申请",
    "drawing_handover": "图纸交接申请",
    "drawing_confirmation": "图纸交接确认申请",
    "bidding_evaluation": "招标评审申请",
    "out_factory": "出厂价申请"
}
export default function Information(): React.ReactNode {
    const currencyTypeEnum = currencyTypeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const paymentCategoryEnum = paymentCategoryOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    const history = useHistory()
    const attachRef = useRef<AttachmentRef>()
    const [visible, setVisible] = useState(false)
    const [filterValue, setFilterValue] = useState({})
    const [performanceBondVisible, setPerformanceBondVisible] = useState<boolean>(false)
    const [drawHVisible, setDrawHVisible] = useState<boolean>(false)
    const [drawingCofirmVisible, setDrawingCofirmVisible] = useState<boolean>(false)
    const [bidingVisible, setBidingVisible] = useState<boolean>(false)
    const [outFactoryVisible, setOutFactoryVisible] = useState<boolean>(false)
    const [currentView, setCurrentView] = useState<string>("performance_bond")
    const [currentViewId, setCurrentViewId] = useState<string>("")
    const [viewVisible, setViewVisible] = useState<boolean>(false)
    const [performanceBondForm] = Form.useForm()
    const [drawHForm] = Form.useForm()
    const [drawingCofirmForm] = Form.useForm()
    const [bidingForm] = Form.useForm()
    const [outFactoryForm] = Form.useForm()
    const [outFactoryTableForm] = Form.useForm()
    const { loading, run } = useRequest((postData: { path: string, data: {} }) => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.post(postData.path, postData.data)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: getProductLoading, run: productRun } = useRequest((id: string) => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.get(`/tower-market/askInfo?projectId=${id}`)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { data: auditType } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        const result = await RequestUtil.get("/tower-market/audit/getAuditType")
        resolve(result)
    }))

    const handleNewAudit = () => setVisible(true)
    const handleOk = (value: string) => {
        if (!value) {
            message.error("请您先选择审批类型！")
            return;
        }
        switch (value) {
            case "performance_bond":
                setPerformanceBondVisible(true)
                break
            case "drawing_handover":
                setDrawHVisible(true)
                break
            case "drawing_confirmation":
                setDrawingCofirmVisible(true)
                break
            case "bidding_evaluation":
                setBidingVisible(true)
                break
            case "out_factory":
                setOutFactoryVisible(true)
                break
            default:
                break
        }
        setVisible(false)
    }

    const performanceBondOk = async () => {
        const postData = await performanceBondForm.validateFields()
        postData.projectId = postData.projectId?.id || ""
        const result = await run({ path: "/tower-market/performanceBond", data: postData })
        if (result) {
            message.success("成功创建申请...")
            setPerformanceBondVisible(false)
            history.go(0)
        } else {
            message.error(`创建申请失败！原因：${result}`)
        }
    }

    const drawHOk = async () => {
        const postData = await drawHForm.validateFields()
        postData.contractId = postData.contractId?.id || ""
        postData.signedUser = postData.signedUser?.value || ""
        const result = await run({ path: "/tower-market/drawingHandover", data: postData })
        if (result) {
            message.success("成功创建申请...")
            setDrawHVisible(false)
            history.go(0)
        } else {
            message.error(`创建申请失败！原因：${result}`)
        }
    }

    const drawingCofirmOk = async () => {
        const postData = await drawingCofirmForm.validateFields()
        postData.contractId = postData.contractId?.id || ""
        const result = await run({
            path: "/tower-market/drawingConfirmation", data: {
                ...postData,
                fileIds: attachRef.current?.getDataSource().map(item => item.id)
            }
        })
        if (result) {
            message.success("成功创建申请...")
            setDrawingCofirmVisible(false)
            history.go(0)
        } else {
            message.error(`创建申请失败！原因：${result}`)
        }
    }

    const bidingOk = async () => {
        const postData = await bidingForm.validateFields()
        postData.projectId = postData.projectName?.id || ""
        postData.projectName = postData.projectName?.value || ""
        const result = await run({
            path: "/tower-market/biddingEvaluation/submitAudit",
            data: {
                ...postData,
                fileIds: attachRef.current?.getDataSource().map(item => item.id)
            }
        })
        if (result) {
            message.success("成功创建申请...")
            setBidingVisible(false)
            history.go(0)
        } else {
            message.error(`创建申请失败！原因：${result}`)
        }
    }
    const outFactoryOk = async () => {
        const postData = await outFactoryForm.validateFields();
        const auditOutInfoDTOList = await outFactoryTableForm.validateFields();
        if (!auditOutInfoDTOList.submit.length) {
            message.warning("申请明细不可为空...")
            return;
        }
        const result = await run({
            path: "/tower-market/OutFactory/submitAudit", data: {
                ...postData,
                projectName: postData.projectName?.value || "",
                projectId: postData.projectName?.id || "",
                auditOutInfoDTOList: auditOutInfoDTOList.submit
            }
        })
        if (result) {
            message.success("成功创建申请...")
            setBidingVisible(false)
            history.go(0)
        } else {
            const result = await run({
                path: "/tower-market/OutFactory/submitAudit", data: {
                    ...postData,
                    projectName: postData.projectName?.value || "",
                    projectId: postData.projectName?.id || "",
                    auditOutInfoDTOList: auditOutInfoDTOList.submit
                }
            })
            if (result) {
                message.success("成功创建申请...")
                setBidingVisible(false)
                history.go(0)
            } else {
                message.error(`创建申请失败！原因：${result}`)
            }
            console.log(12224);
        }
    }

    const drawHChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        if (Object.keys(fields)[0] === "contractId") {
            drawHForm.setFieldsValue({ ...allFields, ...fields.contractId.records[0] })
        }
    }

    const drawingCofirmChange = (fields: { [key: string]: any }) => {
        if (Object.keys(fields)[0] === "contractId") {
            const {
                customerCompany,
                contractName,
                salesman,
            } = fields.contractId.records[0]
            drawingCofirmForm.setFieldsValue({
                customerCompany,
                contractName,
                serviceManager: salesman
            })
        }
    }

    const performanceBondChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        if (Object.keys(fields)[0] === "projectId") {
            const { projectName, projectNumber } = fields.projectId.records[0]
            performanceBondForm.setFieldsValue({ projectName, projectNumber })
        }
    }

    const handleCancel = () => {
        performanceBondForm.resetFields()
        drawHForm.resetFields()
        drawingCofirmForm.resetFields()
        bidingForm.resetFields()
        outFactoryForm.resetFields()
        outFactoryTableForm.resetFields()
        attachRef.current?.resetFields()
    }

    const handleSeeClick = (processName: string, id: string) => {
        setCurrentView(Object.keys(auditEnum).find(key => auditEnum[key] === processName) as string)
        setViewVisible(true)
        setCurrentViewId(id)
    }

    const handleBidingChange = (changedFields: any) => {
        if (Object.keys(changedFields).length > 0 && Object.keys(changedFields)[0] === "projectName") {
            const {
                biddingEndTime,
                biddingPerson,
                projectNumber
            } = changedFields.projectName?.records[0]

            bidingForm.setFieldsValue({
                bidDeadline: biddingEndTime,
                biddingPerson,
                projectNumber
            })
        }
    }

    const handleOutFactoryChange = async (changedFields: any) => {
        if (Object.keys(changedFields).length > 0 && Object.keys(changedFields)[0] === "projectName") {
            const { biddingEndTime, biddingPerson, projectNumber, projectLeader, biddingAgency, id } = changedFields.projectName?.records[0]
            const result: any = await productRun(id)
            outFactoryForm.setFieldsValue({ bidDeadline: biddingEndTime, biddingPerson, projectNumber, projectLeader, biddingAgency })
            outFactoryTableForm.setFieldsValue({
                submit: result.productArr?.map((item: any) => ({
                    ...item,
                    productType: item.productName,
                    price: item.data.cc || "0.00",
                    accountingPrice: item.data.bhls || "0.00",
                    logisticsPrice: item.data.logistics_price || "0.00",
                    applyPrice: item.data.applyPrice || "0.00",
                    outFactoryPrice: (parseFloat(item.data.bhls || "0.00") - parseFloat(item.data.logistics_price || "0.00")).toFixed(2),
                    offerDiff: (parseFloat(item.data.accountingPrice || "0.00") - parseFloat(item.data.applyPrice || "0.00")).toFixed(2)
                })) || []
            })
        }
    }

    const onFilterSubmit = (value: any) => {
        if (value.marketAuditTime) {
            const formatDate = value.marketAuditTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startMarketAuditTime = formatDate[0]
            value.endMarketAuditTime = formatDate[1]
            delete value.marketAuditTime
        }
        setFilterValue(value)
        return value
    }

    const calculate = (data: any) => {
        const logisticsPrice = parseFloat(data.logisticsPrice || "0")
        const applyPrice = parseFloat(data.applyPrice || "0")
        const outFactoryPrice = parseFloat(data.outFactoryPrice || "0")
        return ({
            accountingPrice: (outFactoryPrice + logisticsPrice).toFixed(2),
            offerDiff: (outFactoryPrice + logisticsPrice - applyPrice).toFixed(2)
        })
    }

    const outFactoryTableChange = (fields: any, allFields: any) => {
        if (fields.submit.length - 1 >= 0) {
            const newFields = allFields.submit.map((item: any, index: number) => index === fields.submit.length - 1 ? ({
                ...item,
                ...calculate(item)
            }) : item)

            outFactoryTableForm.setFieldsValue({ submit: newFields })
        }
    }

    return <>
        <Modal
            title="履约保证金审批"
            width={1011}
            visible={performanceBondVisible}
            okText="申请"
            onCancel={() => {
                setPerformanceBondVisible(false)
                handleCancel()
            }}
            onOk={performanceBondOk}
            destroyOnClose
            confirmLoading={loading}
        >
            <DetailTitle title="基本信息" />
            <BaseInfo form={performanceBondForm} onChange={performanceBondChange} columns={bondBaseInfo.map((item: any) => {
                if (item.dataIndex === "currencyType") {
                    return ({
                        ...item,
                        type: "select",
                        enum: currencyTypeEnum
                    })
                }
                if (item.dataIndex === "paymentCategory") {
                    return ({
                        ...item,
                        type: "select",
                        enum: paymentCategoryEnum
                    })
                }
                return item
            })} dataSource={{}} edit col={2} />
        </Modal>
        <Modal
            title="图纸交接申请"
            width={1011}
            visible={drawHVisible}
            okText="审请"
            onCancel={() => {
                setDrawHVisible(false)
                handleCancel()
            }}
            onOk={drawHOk}
            destroyOnClose
            confirmLoading={loading}
        >
            <DetailTitle title="基本信息" />
            <BaseInfo form={drawHForm} onChange={drawHChange} columns={drawH} dataSource={{}} edit col={2} />
        </Modal>
        <Modal
            title="图纸交接确认申请"
            width={1011}
            visible={drawingCofirmVisible}
            okText="审请"
            onCancel={() => {
                setDrawingCofirmVisible(false)
                handleCancel()
            }}
            onOk={drawingCofirmOk}
            destroyOnClose
            confirmLoading={loading}
        >
            <DetailTitle title="基本信息" />
            <BaseInfo form={drawingCofirmForm} onChange={drawingCofirmChange} columns={drawingCofirm} dataSource={{}} edit col={2} />
            <Attachment title="附件信息" edit ref={attachRef} />
        </Modal>
        <Modal
            title="招标评审申请"
            width={1011}
            visible={bidingVisible}
            okText={loading ? "审批已发起" : "审请"}
            onCancel={() => {
                setBidingVisible(false)
                handleCancel()
            }}
            onOk={bidingOk}
            destroyOnClose
            confirmLoading={loading}
        >
            <DetailTitle title="基本信息" />
            <BaseInfo form={bidingForm} onChange={handleBidingChange} columns={baseInfo} dataSource={{}} edit col={3} />
            <Attachment title="附件信息" edit ref={attachRef} />
        </Modal>
        <Modal
            title="出厂价申请"
            width={1011}
            visible={outFactoryVisible}
            okText="审请"
            onCancel={() => {
                setOutFactoryVisible(false)
                handleCancel()
            }}
            onOk={outFactoryOk}
            destroyOnClose
            confirmLoading={loading}
        >
            <DetailTitle title="基本信息" />
            <BaseInfo form={outFactoryForm} onChange={handleOutFactoryChange} columns={outFactoryHead} dataSource={{}} edit col={3} />
            <DetailTitle title="申请明细" />
            <EditTable haveNewButton={false} form={outFactoryTableForm} onChange={outFactoryTableChange} columns={addanewone} dataSource={[]} />
        </Modal>
        <SelectAuditType
            visible={visible}
            title="新建审批"
            okText="创建"
            onOk={handleOk}
            onCancel={() => setVisible(false)} />
        <ApprovalTypesView
            title={auditEnum[currentView]}
            visible={viewVisible}
            onCancel={() => setViewVisible(false)}
            footer={[
                <Button key="ok" type="primary" onClick={() => setViewVisible(false)}>
                    确认
                </Button>
            ]}
            id={currentViewId} />
        <Page
            path="/tower-market/audit"
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    fixed: "left",
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...auditHead,
                {
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: "right",
                    render: (_: undefined, record: any): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <span style={{ color: "#FF8C00", cursor: "pointer" }} onClick={() => handleSeeClick(record.processName, record.id)}>查看</span>
                        </Space>
                    )
                }]}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            extraOperation={<Button type="primary" onClick={handleNewAudit}>新增审批</Button>}
            searchFormItems={[
                {
                    name: 'processTypeId',
                    label: '审批类型',
                    children: <Select style={{ width: "200px" }}>
                        {auditType?.map((item: any) => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'marketAuditTime',
                    label: '发起时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'auditStatus',
                    label: '审批状态',
                    children: <Select style={{ width: "140px" }}>
                        <Select.Option value={0} key="audit-0">审批中</Select.Option>
                        <Select.Option value={1} key="audit-1">已通过</Select.Option>
                        <Select.Option value={2} key="audit-2">已驳回</Select.Option>
                    </Select>
                },
                {
                    name: 'omnipotentQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="项目名称/项目编码/审批编号/关联合同/制单人" style={{ width: "300px" }} maxLength={200} />
                },
            ]}
        />
    </>
}