import React, { forwardRef, useImperativeHandle, useState } from "react"
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Spin } from "antd"
import { CommonTable, DetailTitle } from "../../common"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { SelectedArea, Selected } from "./receivingListData.json"

interface ChooseModalProps {
    id: string,
    initChooseList: any[],
    numberStatus: number
}

export default forwardRef(({ id, initChooseList }: ChooseModalProps, ref) => {
    const [chooseList, setChooseList] = useState<any[]>(initChooseList.map((item: any) => ({
        ...item,
        key: `${item.id}-${Math.random()}-${new Date().getTime()}`
    })))
    const [selectList, setSelectList] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [currentId, setCurrentId] = useState<string>("")
    const [oprationType, setOprationType] = useState<"select" | "remove">("select")
    const [form] = Form.useForm();
    const [serarchForm] = Form.useForm();

    const { loading, data, run } = useRequest<{ [key: string]: any }>((params: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(
                `/tower-supply/materialAuxiliaryContract/details`,
                { supplierId: id, ...params })
            setSelectList(result?.map((item: any, index: number) => ({
                ...item,
                num: item.surplusNum,
                key: `${item.materialContractDetailId}-${index}`
            })).filter((item: any) => item.num))
            resole(result?.map((item: any, index: number) => ({
                ...item,
                num: item.surplusNum,
                key: `${item.materialContractDetailId}-${index}`
            })).filter((item: any) => item.num))
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const resetFields = () => {
        setCurrentId("")
        setChooseList(initChooseList.map((item: any) => ({
            ...item,
            key: `${item.id}-${Math.random()}-${new Date().getTime()}`
        })))
        setSelectList(data?.map((item: any) => ({
            ...item,
            num: item.surplusNum
        })).filter((item: any) => item.num))
    }

    const handleRemove = async (id: string) => {
        const formData = await form.validateFields()
        const currentData = chooseList.find((item: any) => item.key === id)
        if ((currentData.num - formData.num) === 0) {
            setChooseList(chooseList.filter((item: any) => item.key !== id))
        } else if ((currentData.num - formData.num) < 0) {
            message.error("移除数量不能大于已选数量...")
            return
        } else {
            setChooseList(chooseList.map((item: any) => item.key === id ? ({ ...item, num: item.num - formData.num }) : item))
        }
        setVisible(false)
        form.resetFields()
    }

    const handleSelect = async (id: string) => {
        const formData = await form.validateFields()
        const currentData = selectList.find((item: any) => item.key === id)
        setChooseList([
            ...chooseList,
            {
                ...currentData,
                receiveDetailStatus: 0,
                num: formData.num,
                key: `${currentData.key}-${Math.random()}-${new Date().getTime()}`
            }])
        setVisible(false)
        form.resetFields()
    }

    const handleModalOk = () => oprationType === "select" ? handleSelect(currentId) : handleRemove(currentId)

    useImperativeHandle(ref, () => ({ dataSource: chooseList, resetFields }), [ref, JSON.stringify(chooseList), resetFields])

    // 模糊搜索
    const handleSearch = () => {
        const params = serarchForm.getFieldsValue()
        run(params)
    }

    return <Spin spinning={loading}>
        <Modal title="选定数量"
            visible={visible}
            onOk={handleModalOk}
            onCancel={() => {
                setVisible(false)
                form.resetFields()
            }}>
            <Form form={form}>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "请输入数量..."
                                }
                            ]}
                            style={{ width: "100%" }}
                            name="num"
                            label="输入数量"><InputNumber
                                min={1} step={1}
                                precision={5}
                            /></Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
        <DetailTitle title="选定区" />
        <CommonTable
            rowKey="key"
            columns={[
                ...SelectedArea, {
                    title: "操作",
                    dataIndex: "opration",
                    render: (_: any, records: any) => <Button
                        size="small"
                        type="link"
                        disabled={records.receiveDetailStatus !== 0}
                        onClick={() => {
                            setCurrentId(records.key)
                            setOprationType("remove")
                            setVisible(true)
                        }}>移除</Button>
                }]} dataSource={chooseList} />
        <DetailTitle title="待选区" />
        <div>
            <Form form={serarchForm} style={{ paddingLeft: "14px" }}>
                <Row gutter={[4, 4]}>
                    <Col span={6}>
                        <Form.Item
                            name="structureSpec"
                            label="规格">
                            <Input placeholder="请输入规格" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="materialName"
                            label="品名">
                            <Input placeholder="请输入品名" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="contractNumber"
                            label="合同编号">
                            <Input placeholder="请输入合同编号" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item>
                            <Button type="primary" onClick={handleSearch}>搜索</Button>&nbsp;&nbsp;
                            <Button onClick={() => {
                                serarchForm.resetFields();
                            }}>重置</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
        <CommonTable columns={[
            ...Selected,
            {
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <Button
                    type="link"
                    size="small"
                    disabled={records.receiveDetailStatus === 1}
                    onClick={() => {
                        setCurrentId(records.key)
                        setOprationType("select")
                        setVisible(true)
                    }}>选择</Button>
            }]} dataSource={selectList} />
    </Spin>
})