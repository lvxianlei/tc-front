import React, { useState } from 'react'
import { Space, Button, Input, Modal, Form, message, Upload, Select, DatePicker } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page, BaseInfo, DetailTitle, CommonTable } from '../common'
import ApplicationpriceTypesView from "./applicationpriceHeadData.json"
// import SelectAuditType from './SelectAuditTypes'
import useRequest from '@ahooksjs/use-request'
import { baseInfo } from "./applicationpriceHeadData.json"
import RequestUtil from '../../utils/RequestUtil'
import AuthUtil from "../../utils/AuthUtil"
import { downLoadFile } from "../../utils"
import ApplicationContext from "../../configuration/ApplicationContext"
const auditEnum: any = {
    "performance_bond": "履约保证金申请",
    "drawing_handover": "图纸交接申请",
    "drawing_confirmation": "图纸交接确认申请",
    "bidding_evaluation": "招标评审申请"
}
export default function Information(): React.ReactNode {
    const currencyTypeEnum = (ApplicationContext.get().dictionaryOption as any)["111"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const paymentCategoryEnum = (ApplicationContext.get().dictionaryOption as any)["136"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    const history = useHistory()
    const [visible, setVisible] = useState(false)
    const [performanceBondVisible, setPerformanceBondVisible] = useState<boolean>(false)
    const [drawHVisible, setDrawHVisible] = useState<boolean>(false)
    const [drawingCofirmVisible, setDrawingCofirmVisible] = useState<boolean>(false)
    const [bidingVisible, setBidingVisible] = useState<boolean>(false)
    const [attachInfo, setAttachInfo] = useState<any[]>([])
    const [currentView, setCurrentView] = useState<string>("performance_bond")
    const [currentViewId, setCurrentViewId] = useState<string>("")
    const [viewVisible, setViewVisible] = useState<boolean>(false)
    const [performanceBondForm] = Form.useForm()
    const [drawHForm] = Form.useForm()
    const [drawingCofirmForm] = Form.useForm()
    const [bidingForm] = Form.useForm()
    const { loading, run } = useRequest((postData: { path: string, data: {} }) => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.post(postData.path, postData.data)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

 

    const handleNewAudit = () => setVisible(true)
    const handleOk = (value: string) => {
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
            default:
                break
        }
        setVisible(false)
    }
    const performanceBondOk = async () => {
        await performanceBondForm.validateFields()
        const postData = await performanceBondForm.getFieldsValue()
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
        await drawHForm.validateFields()
        const postData = await drawHForm.getFieldsValue()
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
        await drawingCofirmForm.validateFields()
        const postData = await drawingCofirmForm.getFieldsValue()
        postData.contractId = postData.contractId?.id || ""
        postData.attachInfoDtos = attachInfo
        const result = await run({ path: "/tower-market/drawingConfirmation", data: postData })
        if (result) {
            message.success("成功创建申请...")
            setDrawingCofirmVisible(false)
            history.go(0)
        } else {
            message.error(`创建申请失败！原因：${result}`)
        }
    }

    const bidingOk = async () => {
        await bidingForm.validateFields()
        const postData = await bidingForm.getFieldsValue()
        postData.attachInfoDtos = attachInfo
        postData.projectId = postData.projectName?.id || ""
        postData.projectName = postData.projectName?.value || ""
        const result = await run({ path: "/tower-market/biddingEvaluation/submitAudit", data: postData })
        if (result) {
            message.success("成功创建申请...")
            setBidingVisible(false)
            history.go(0)
        } else {
            message.error(`创建申请失败！原因：${result}`)
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

    const uploadChange = (event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                const dataInfo = event.file.response.data
                const fileInfo = dataInfo.name.split(".")
                setAttachInfo([...attachInfo, {
                    id: "",
                    uid: attachInfo.length,
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
    const handleCancel = () => {
        performanceBondForm.resetFields()
        drawHForm.resetFields()
        drawingCofirmForm.resetFields()
        bidingForm.resetFields()
        setAttachInfo([])
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
    const onFilterSubmit = (value: any) => {
        if (value.marketAuditTime) {
            const formatDate = value.marketAuditTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startMarketAuditTime = formatDate[0]
            value.endMarketAuditTime = formatDate[1]
            delete value.marketAuditTime
        }
        return value
    }

    const deleteAttachData = (id: number) => {
        setAttachInfo(attachInfo.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    }

    return <>
        <Modal
            title="履约保证金审批"
            width={1011}
            visible={performanceBondVisible}
            okText="审请"
            onCancel={() => {
                setPerformanceBondVisible(false)
                handleCancel()
            }}
            onOk={performanceBondOk}
            destroyOnClose
            confirmLoading={loading}
        >
            <DetailTitle title="基本信息" />
            
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
         
        </Modal>
       
      
        
        
    </>
}