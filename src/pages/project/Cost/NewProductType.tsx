import React, { useState } from "react"
import { Modal, Row, Col, Select, Spin, ModalFuncProps } from "antd"
// import ApplicationContext from "../../../configuration/ApplicationContext"

const productTypeEnum = [
    {
        "label": "角钢塔",
        "value": "角钢塔"
    },
    {
        "label": "钢管塔",
        "value": "钢管塔"
    },
    {
        "label": "四管塔",
        "value": "四管塔"
    },
    {
        "label": "架构",
        "value": "架构"
    }
]

export default function NewProductType(props: ModalFuncProps): JSX.Element {
    // const productTypeEnum = (ApplicationContext.get().dictionaryOption as any)["101"].map((item: { id: string, name: string }) => ({
    //     value: item.id,
    //     label: item.name
    // }))
    const [selectValue, setSelectValue] = useState("")

    return <Modal {...props} onOk={() => props.onOk && props.onOk(selectValue)} destroyOnClose>
        <Row>
            <Col span={6} style={{ lineHeight: "32px" }}>产品类型:</Col>
            <Col span={12}>
                <Select style={{ width: "100%" }} onChange={(value) => setSelectValue(value)} defaultValue={selectValue}>
                    {productTypeEnum.map((item: any) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                </Select>
            </Col>
        </Row>
    </Modal>
}