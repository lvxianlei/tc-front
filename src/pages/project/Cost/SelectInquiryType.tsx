import React, { useState } from "react"
import { Modal, Row, Col, Select, Spin, ModalFuncProps } from "antd"
export default function SelectAuditType(props: ModalFuncProps): JSX.Element {
    const [selectValue, setSelectValue] = useState("")

    return <Modal {...props} onOk={() => props.onOk && props.onOk(selectValue)} destroyOnClose>
        <Row>
            <Col span={6} style={{ lineHeight: "32px" }}>任务类型:</Col>
            <Col span={12}>
                <Select style={{ width: "100%" }} onChange={(value) => setSelectValue(value)} defaultValue={selectValue}>
                    <Select.Option key="selectA" value="selectA">供应询价任务</Select.Option>
                    <Select.Option key="selectB" value="selectB">物流询价任务</Select.Option>
                    <Select.Option key="selectC" value="selectC">工艺询价任务</Select.Option>
                </Select>
            </Col>
        </Row>
    </Modal>
}