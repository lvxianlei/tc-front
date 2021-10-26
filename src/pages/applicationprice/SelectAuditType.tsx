import React, { useState } from "react"
import { Modal, Row, Col, Select, Spin, ModalFuncProps } from "antd"
import RequestUtil from "../../utils/RequestUtil"
import useRequest from "@ahooksjs/use-request"

export default function SelectAuditType(props: ModalFuncProps): JSX.Element {
    const [selectValue, setSelectValue] = useState("")
    const { loading, data } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        const result = await RequestUtil.get("/tower-market/audit/getAuditType")
        resolve(result)
    }))

    return <Modal {...props} onOk={() => props.onOk && props.onOk(selectValue)} destroyOnClose>

        <Spin spinning={loading}>
            <Row>
                <Col span={6} style={{ lineHeight: "32px" }}>审批类型:</Col>
                <Col span={12}>
                    <Select style={{ width: "100%" }} onChange={(value) => setSelectValue(value)} defaultValue={selectValue}>
                        {data?.map((item: any) => <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>)}
                    </Select>
                </Col>
            </Row>
        </Spin>
    </Modal>
}