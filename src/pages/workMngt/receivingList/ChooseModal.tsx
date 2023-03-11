import React, { forwardRef, useImperativeHandle, useState } from "react"
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Spin } from "antd"
import { CommonTable, DetailTitle } from "../../common"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { SelectedArea, Selected } from "./receivingListData.json"
import { materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"

interface ChooseModalProps {
    id: string,
    initChooseList: any[],
    numberStatus: number
}

export default forwardRef(({ id, initChooseList }: ChooseModalProps, ref) => {
    const [chooseList, setChooseList] = useState<any[]>(initChooseList.map((item: any) => ({
        ...item,
        price: item.unTaxPrice,
        id: item.materialContractDetailId,
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
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialContract/supplier/${id}`, { ...params })
            setSelectList(result?.map((item: any) => ({
                ...item,
                num: item.surplusNum,
                id: item.id,
                materialContractDetailId: item.id
            })).filter((item: any) => item.num))
            setChooseList(initChooseList.length>0?initChooseList.map((item: any) => ({
                ...item, 
                price: item.unTaxPrice,
                id: item.materialContractDetailId,
                key: `${item.id}-${Math.random()}-${new Date().getTime()}`
            })):[])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const resetFields = () => {
        setCurrentId("")
        setChooseList(initChooseList.map((item: any) => ({
            ...item,
            price: item.unTaxPrice,
            id: item.materialContractDetailId,
            key: `${item.id}-${Math.random()}-${new Date().getTime()}`
        })))
        setSelectList(data?.map((item: any) => ({
            ...item,
            num: item.surplusNum,
            id: item.id
        })).filter((item: any) => item.num))
    }

    const handleRemove = async (id: string) => {
        const formData = await form.validateFields()
        const currentData = chooseList.find((item: any) => item.key === id)
        // const currentSelectData = selectList.find((item: any) => item.key === id)
        if ((currentData.num - formData.num) === 0) {
            setChooseList(chooseList.filter((item: any) => item.key !== id))
            // if (currentSelectData) {
            //     setSelectList(selectList.map((item: any) => item.key === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            //     // setWaitingArea(waitingArea.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            // } else {
            //     setSelectList([...selectList, { ...currentData, num: formData.num }])
            //     // setWaitingArea([...waitingArea, { ...currentData, num: formData.num }])
            // }
        } else if ((currentData.num - formData.num) < 0) {
            message.error("移除数量不能大于已选数量...")
            return
        } else {
            setChooseList(chooseList.map((item: any) => item.key === id ? ({ ...item, num: item.num - formData.num }) : item))
            // if (currentSelectData) {
            //     setSelectList(selectList.map((item: any) => item.key === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            //     // setWaitingArea(waitingArea.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            // } else {
            //     setSelectList([...selectList, { ...currentData, num: formData.num }])
            //     // setWaitingArea([...waitingArea, { ...currentData, num: formData.num }])
            // }
        }
        setVisible(false)
        form.resetFields()
    }

    const handleSelect = async (id: string) => {
        const formData = await form.validateFields()
        const currentData = selectList.find((item: any) => item.id === id)
        // const currentChooseData = chooseList.find((item: any) => item.id === id)
        // if ((currentData.num - formData.num) === 0) {
        //     setSelectList(selectList.filter((item: any) => item.id !== id))
        //     setWaitingArea(waitingArea.filter((item: any) => item.id !== id))
        //     if (currentChooseData) {
        //         setChooseList(chooseList.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
        //     } else {
        //         setChooseList([...chooseList, { ...currentData, num: formData.num }])
        //     }
        // } else if ((currentData.num - formData.num) < 0) {
        //     message.error("选择数量不能大于可选数量...")
        //     return
        // } else {
        // setSelectList(selectList.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) - parseFloat(formData.num) }) : item))
        // setWaitingArea(waitingArea.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) - parseFloat(formData.num) }) : item))
        // if (currentChooseData) {
        //     setChooseList(chooseList.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
        // } else {
        setChooseList([
            ...chooseList,
            {
                ...currentData,
                receiveDetailStatus: 0,
                num: formData.num,
                key: `${currentData.id}-${Math.random()}-${new Date().getTime()}`
            }])
        // }
        // }
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
                    <Col span={24}><Form.Item
                        rules={[
                            {
                                required: true,
                                message: "请输入数量..."
                            }
                        ]}
                        style={{ width: "100%" }}
                        name="num"
                        label="输入数量"><InputNumber min={1} step={1} /></Form.Item></Col>
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
                            name="materialName"
                            label="品名">
                            <Input placeholder="请输入品名" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="materialStandard"
                            label="标准">
                            <Select style={{ width: '100%' }} >
                                <Select.Option value={''} key={''}>全部</Select.Option>
                                {materialStandardOptions?.map((item: any, index: number) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="structureTexture"
                            label="材质">
                            <Select style={{ width: '100%' }} >
                                <Select.Option value={''} key={''}>全部</Select.Option>
                                {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.name} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="structureSpec"
                            label="规格">
                            <Input placeholder="请输入规格" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[4, 4]}>
                    <Col span={6}>
                        <Form.Item
                            name="length"
                            label="长度">
                            <InputNumber placeholder="请输入长度" style={{width:'100%'}}/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="width"
                            label="宽度">
                            <InputNumber placeholder="请输入宽度" style={{width:'100%'}}/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="fuzzyQuery"
                            label="模糊搜索">
                            <Input placeholder="品名/合同编号" />
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
                        setCurrentId(records.id)
                        setOprationType("select")
                        setVisible(true)
                    }}>选择</Button>
            }]} dataSource={selectList} />
    </Spin>
})