import React from "react"
import { Form, Modal } from "antd"
import { BaseInfo } from "../../common"
import { setting } from "./data.json"
interface NewAddProps {
    visible: boolean
}
export default function NewAdd({ visible }: NewAddProps) {
    const [form] = Form.useForm()
    return <Modal visible={visible} title="新增周期计划">
        <BaseInfo form={form} columns={setting} dataSource={{}} edit col={1} />


        {/* columns={baseInfoHead.map((item: any) => {
                    switch (item.dataIndex) {
                        case "productTypeId":
                            return ({
                                ...item,
                                dataIndex: "productTypeId",
                                enum: productTypeOptions?.map((product: any) => ({
                                    value: product.id,
                                    label: product.name
                                }))
                            })
                        case "contractCode":
                            return ({
                                ...item,
                                columns: item.columns.map(((coItem: any) => coItem.dataIndex === "saleType" ? ({
                                    ...coItem,
                                    type: "select",
                                    enum: saleTypeOptions?.map(item => ({
                                        value: item.id,
                                        lable: item.name
                                    }))
                                }) : coItem))
                            })
                        case "contractType":
                            return ({
                                ...item,
                                enum: contractPlanStatusOptions?.map(item => ({
                                    value: item.id,
                                    label: item.name
                                }))
                            })
                        case "voltage":
                            return ({
                                ...item,
                                dataIndex: "voltageId",
                                enum: voltageGradeOptions?.map((product: any) => ({
                                    value: product.id,
                                    label: product.name
                                }))
                            })
                        default:
                            return item
                    }
                })} */}
    </Modal>
}