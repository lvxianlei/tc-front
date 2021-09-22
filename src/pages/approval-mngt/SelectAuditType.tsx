import React, { useState } from "react"
import { Modal, Row, Col, Select, Spin, ModalFuncProps, Tabs, Radio } from "antd"
import { DetailContent, BaseInfo, CommonTable } from "../common"
import RequestUtil from "../../utils/RequestUtil"
import useRequest from "@ahooksjs/use-request"
import { bondBaseInfo, auditIdRecord, drawH } from "./approvalHeadData.json"
export default function SelectAuditType(props: ModalFuncProps): JSX.Element {
    const [selectValue, setSelectValue] = useState("")
    const [bondView, setBondView] = useState<"base" | "audit">("base")
    const [performanceBondVisible, setPerformanceBondVisible] = useState<boolean>(false)
    const [drawHVisible, setDrawHVisible] = useState<boolean>(false)
    const [drawingCofirmVisible, setDrawingCofirmVisible] = useState<boolean>(false)
    const [bidingVisible, setBidingVisible] = useState<boolean>(false)
    const { loading, data } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        const result = await RequestUtil.get("/tower-market/audit/getAuditType")
        resolve(result)
    }))

    const handleSelect = (value: string) => {
        console.log(value)
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
        setSelectValue(value)
    }

    return <Modal {...props} onOk={() => props.onOk && props.onOk(selectValue)}>
        <Modal
            title="履约保证金审批"
            width={1011}
            visible={performanceBondVisible}
            okText="审请"
            onCancel={() => setPerformanceBondVisible(false)}
        >
            <Radio.Group value={bondView} onChange={(event: any) => setBondView(event.target.value)}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="audit">审批记录</Radio.Button>
            </Radio.Group>
            {bondView === "base" ? <>
                <BaseInfo columns={bondBaseInfo} dataSource={{}} edit />
            </> : <><CommonTable columns={auditIdRecord} dataSource={[]} /></>}
        </Modal>
        <Modal
            title="图纸交接申请"
            width={1011}
            visible={drawHVisible}
            okText="审请"
            onCancel={() => setDrawHVisible(false)}
        >
            <Radio.Group value={bondView} onChange={(event: any) => setBondView(event.target.value)}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="audit">审批记录</Radio.Button>
            </Radio.Group>
            {bondView === "base" ? <>
                <BaseInfo columns={drawH} dataSource={{}} edit />
            </> : <><CommonTable columns={auditIdRecord} dataSource={[]} /></>}
        </Modal>
        <Modal
            title="图纸交接确认申请"
            width={1011}
            visible={drawingCofirmVisible}
            okText="审请"
            onCancel={() => setDrawingCofirmVisible(false)}
        >
            <Radio.Group value={bondView} onChange={(event: any) => setBondView(event.target.value)}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="audit">审批记录</Radio.Button>
            </Radio.Group>
            {bondView === "base" ? <>
                <BaseInfo columns={bondBaseInfo} dataSource={{}} edit />
            </> : <><CommonTable columns={auditIdRecord} dataSource={[]} /></>}
        </Modal>
        <Modal
            title="招标评审申请"
            width={1011}
            visible={bidingVisible}
            okText="审请"
            onCancel={() => setBidingVisible(false)}
        >
            <Radio.Group value={bondView} onChange={(event: any) => setBondView(event.target.value)}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="audit">审批记录</Radio.Button>
            </Radio.Group>
            {bondView === "base" ? <>
                <BaseInfo columns={bondBaseInfo} dataSource={{}} edit />
            </> : <><CommonTable columns={auditIdRecord} dataSource={[]} /></>}
        </Modal>
        <Spin spinning={loading}>
            <Row>
                <Col span={6} style={{ lineHeight: "32px" }}>审批类型:</Col>
                <Col span={12}>
                    <Select style={{ width: "100%" }} onChange={handleSelect} defaultValue={selectValue}>
                        {data?.map((item: any) => <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>)}
                    </Select>
                </Col>
            </Row>
        </Spin>
    </Modal>
}