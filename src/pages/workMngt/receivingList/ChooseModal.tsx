import React, { forwardRef, useImperativeHandle, useState } from "react"
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Spin } from "antd"
import { CommonTable, DetailTitle } from "../../common"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"
import { SelectedArea, Selected } from "./receivingListData.json"

interface ChooseModalProps {
    id: string,
    initChooseList: any[],
    numberStatus: number
}

export default forwardRef(({ id, initChooseList }: ChooseModalProps, ref) => {
    const [chooseList, setChooseList] = useState<any[]>(initChooseList.map((item: any) => ({
        ...item,
        materialStandardName: item.materialStandardName,
        price: item.unTaxPrice
    })))
    const [selectList, setSelectList] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [currentId, setCurrentId] = useState<string>("")
    const [oprationType, setOprationType] = useState<"select" | "remove">("select")
    const [form] = Form.useForm();
    const [serarchForm] = Form.useForm();
    // 定义承接待选区的所有数据
    const [waitingArea, setWaitingArea] = useState<any[]>([])

    // 标准
    const standardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    // 材质 
    const materialEnum = materialTextureOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialContract/${id}`)
            setSelectList(result?.materialContractDetailVos.map((item: any) => ({
                ...item,
                num: item.surplusNum,
                id: item.id
            })).filter((item: any) => item.num))
            setWaitingArea(result?.materialContractDetailVos.map((item: any) => ({
                ...item,
                num: item.surplusNum,
                id: item.id
            })).filter((item: any) => item.num))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const resetFields = () => {
        setCurrentId("")
        setChooseList(initChooseList)
        setSelectList(data?.materialContractDetailVos.map((item: any) => ({
            ...item,
            num: item.surplusNum,
            id: item.id
        })).filter((item: any) => item.num))
        setWaitingArea(data?.materialContractDetailVos.map((item: any) => ({
            ...item,
            num: item.surplusNum,
            id: item.id
        })).filter((item: any) => item.num))
    }

    const handleRemove = async (id: string) => {
        const formData = await form.validateFields()
        const currentData = chooseList.find((item: any) => item.id === id)
        const currentSelectData = selectList.find((item: any) => item.id === id)
        if ((currentData.num - formData.num) === 0) {
            setChooseList(chooseList.filter((item: any) => item.id !== id))
            if (currentSelectData) {
                setSelectList(selectList.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
                setWaitingArea(waitingArea.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setSelectList([...selectList, { ...currentData, num: formData.num }])
                setWaitingArea([...waitingArea, { ...currentData, num: formData.num }])
            }
        } else if ((currentData.num - formData.num) < 0) {
            message.error("移除数量不能大于已选数量...")
            return
        } else {
            setChooseList(chooseList.map((item: any) => item.id === id ? ({ ...item, num: item.num - formData.num }) : item))
            if (currentSelectData) {
                setSelectList(selectList.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
                setWaitingArea(waitingArea.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setSelectList([...selectList, { ...currentData, num: formData.num }])
                setWaitingArea([...waitingArea, { ...currentData, num: formData.num }])
            }
        }
        setVisible(false)
        form.resetFields()
    }

    const handleSelect = async (id: string) => {
        const formData = await form.validateFields()
        const currentData = selectList.find((item: any) => item.id === id)
        const currentChooseData = chooseList.find((item: any) => item.id === id)
        if ((currentData.num - formData.num) === 0) {
            setSelectList(selectList.filter((item: any) => item.id !== id))
            setWaitingArea(waitingArea.filter((item: any) => item.id !== id))
            if (currentChooseData) {
                setChooseList(chooseList.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setChooseList([...chooseList, { ...currentData, num: formData.num }])
            }
        } else if ((currentData.num - formData.num) < 0) {
            message.error("选择数量不能大于可选数量...")
            return
        } else {
            setSelectList(selectList.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) - parseFloat(formData.num) }) : item))
            setWaitingArea(waitingArea.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) - parseFloat(formData.num) }) : item))
            if (currentChooseData) {
                setChooseList(chooseList.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setChooseList([...chooseList, { ...currentData, num: formData.num }])
            }
        }
        setVisible(false)
        form.resetFields()
    }

    const handleModalOk = () => oprationType === "select" ? handleSelect(currentId) : handleRemove(currentId)

    useImperativeHandle(ref, () => ({ dataSource: chooseList, resetFields }), [ref, JSON.stringify(chooseList), resetFields])

    // 模糊搜索
    const handleSearch = () => {
        let result = [];
        // 标准存在
        if (serarchForm.getFieldValue("materialStandardName")) {
            result = waitingArea.filter((item: any) => item.materialStandardName === serarchForm.getFieldValue("materialStandardName"));
        }
        // 材质存在
        if (serarchForm.getFieldValue("materialTexture")) {
            if (result.length > 0) {
                result = result.filter((item: any) => item.materialTexture === serarchForm.getFieldValue("materialTexture"));
            } else {
                result = waitingArea.filter((item: any) => item.materialTexture === serarchForm.getFieldValue("materialTexture"));
            }
        }
        // 规格
        if (serarchForm.getFieldValue("spec")) {
            let v = []
            if (result.length > 0) {
                for (let i = 0; i < result.length; i += 1) {
                    if (result[i].spec.indexOf(serarchForm.getFieldValue("spec")) !== -1) {
                        v.push(result[i]);
                    }
                }
            } else {
                for (let i = 0; i < waitingArea.length; i += 1) {
                    if (waitingArea[i].spec.indexOf(serarchForm.getFieldValue("spec")) !== -1) {
                        v.push(waitingArea[i]);
                    }
                }
            }
            result = v;
        }
        // 长度
        if (serarchForm.getFieldValue("length1") && serarchForm.getFieldValue("length2")) {
            if (serarchForm.getFieldValue("length1") > serarchForm.getFieldValue("length2")) {
                // 前者比后者大
                let v = [];
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i += 1) {
                        if (result[i].length >= serarchForm.getFieldValue("length2") && result[i].length <= serarchForm.getFieldValue("length1")) {
                            v.push(result[i]);
                        }
                    }
                } else {
                    for (let i = 0; i < waitingArea.length; i += 1) {
                        if (waitingArea[i].length >= serarchForm.getFieldValue("length2") && waitingArea[i].length <= serarchForm.getFieldValue("length1")) {
                            v.push(waitingArea[i]);
                        }
                    }
                }
                result = v;
            } else {
                // 后者比前者大
                let v = [];
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i += 1) {
                        if (result[i].length <= serarchForm.getFieldValue("length2") && result[i].length >= serarchForm.getFieldValue("length1")) {
                            v.push(result[i]);
                        }
                    }
                } else {
                    for (let i = 0; i < waitingArea.length; i += 1) {
                        if (waitingArea[i].length <= serarchForm.getFieldValue("length2") && waitingArea[i].length >= serarchForm.getFieldValue("length1")) {
                            v.push(waitingArea[i]);
                        }
                    }
                }
                result = v;
            }
        }
        if (serarchForm.getFieldValue("materialStandardName")
            || serarchForm.getFieldValue("materialTexture")
            || serarchForm.getFieldValue("num2")
            || serarchForm.getFieldValue("spec")
            || serarchForm.getFieldValue("length1")
            || serarchForm.getFieldValue("length2")
        ) {
            setSelectList(result.slice(0));
        } else {
            setSelectList(waitingArea.slice(0));
        }
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
        <CommonTable columns={[
            ...SelectedArea, {
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <Button
                    size="small"
                    type="link"
                    disabled={records.receiveDetailStatus === 1}
                    onClick={() => {
                        setCurrentId(records.id)
                        setOprationType("remove")
                        setVisible(true)
                    }}>移除</Button>
            }]} dataSource={chooseList} />
        <DetailTitle title="待选区" />
        <div>
            <Form form={serarchForm} style={{ paddingLeft: "14px" }}>
                <Row>
                    <Col span={4}>
                        <Form.Item
                            name="materialStandardName"
                            label="标准">
                            <Select style={{ width: 120 }} placeholder="请选择">
                                {
                                    standardEnum && standardEnum.length > 0 && standardEnum.map((item: any, index: number) => {
                                        return <Select.Option value={item.label} key={index}>{item.label}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="materialTexture"
                            label="材质">
                            <Select style={{ width: 120 }} placeholder="请选择">
                                {
                                    materialEnum && materialEnum.length > 0 && materialEnum.map((item: any, index: number) => {
                                        return <Select.Option value={item.label} key={index}>{item.label}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="length1"
                            label="长度">
                            <InputNumber min={1} step={1} />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item
                            name="length2">
                            <InputNumber min={1} step={1} />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item
                            name="spec"
                            label="规格">
                            <Input placeholder="请输入规格" />
                        </Form.Item>
                    </Col>&nbsp;&nbsp;

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