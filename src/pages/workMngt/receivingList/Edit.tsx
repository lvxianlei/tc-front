import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button, Form, message, Spin, Modal, InputNumber, Row, Col, Input, Select } from 'antd'
import { DetailTitle, BaseInfo, CommonTable, formatData } from '../../common'
import { BasicInformation, editCargoDetails, SelectedArea, Selected, freightInfo, handlingChargesInfo } from "./receivingListData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
interface ChooseModalProps {
    id: string,
    initChooseList: any[]
}
/**
 * 纸质单号，原材料税款合计，车辆牌照
 */
const ChooseModal = forwardRef(({ id, initChooseList }: ChooseModalProps, ref) => {
    const [chooseList, setChooseList] = useState<any[]>(initChooseList)
    const [selectList, setSelectList] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [currentId, setCurrentId] = useState<string>("")
    const [oprationType, setOprationType] = useState<"select" | "remove">("select")
    const [form] = Form.useForm();
    const [serarchForm] = Form.useForm();

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialContract/${id}`)
            setSelectList(result?.materialContractDetailVos.map((item: any) => ({
                ...item,
                num: item.surplusNum,
                materialContractDetailId: item.id
            })).filter((item: any) => item.num))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {
        // refreshDeps: [id]
    })

    const resetFields = () => {
        setCurrentId("")
        setChooseList([])
        setSelectList([])
    }

    const handleRemove = async (materialContractDetailId: string) => {
        const formData = await form.validateFields()
        const currentData = chooseList.find((item: any) => item.materialContractDetailId === materialContractDetailId)
        const currentSelectData = selectList.find((item: any) => item.materialContractDetailId === materialContractDetailId)
        if ((currentData.num - formData.num) === 0) {
            setChooseList(chooseList.filter((item: any) => item.materialContractDetailId !== materialContractDetailId))
            if (currentSelectData) {
                setSelectList(selectList.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setSelectList([...selectList, { ...currentData, num: formData.num }])
            }
        } else if ((currentData.num - formData.num) < 0) {
            message.error("移除数量不能大于已选数量...")
            return
        } else {
            setChooseList(chooseList.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: item.num - formData.num }) : item))
            if (currentSelectData) {
                setSelectList(selectList.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setSelectList([...selectList, { ...currentData, num: formData.num }])
            }
        }
        setVisible(false)
        form.resetFields()
    }

    const handleSelect = async (materialContractDetailId: string) => {
        const formData = await form.validateFields()
        const currentData = selectList.find((item: any) => item.materialContractDetailId === materialContractDetailId)
        const currentChooseData = chooseList.find((item: any) => item.materialContractDetailId === materialContractDetailId)
        if ((currentData.num - formData.num) === 0) {
            setSelectList(selectList.filter((item: any) => item.materialContractDetailId !== materialContractDetailId))
            if (currentChooseData) {
                setChooseList(chooseList.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setChooseList([...chooseList, { ...currentData, num: formData.num }])
            }
        } else if ((currentData.num - formData.num) < 0) {
            message.error("选择数量不能大于可选数量...")
            return
        } else {
            setSelectList(selectList.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: parseFloat(item.num) - parseFloat(formData.num) }) : item))
            if (currentChooseData) {
                setChooseList(chooseList.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setChooseList([...chooseList, { ...currentData, num: formData.num }])
            }
        }
        setVisible(false)
        form.resetFields()
    }

    const handleModalOk = () => oprationType === "select" ? handleSelect(currentId) : handleRemove(currentId)
    useImperativeHandle(ref, () => ({ dataSource: chooseList, resetFields }), [ref, JSON.stringify(chooseList), resetFields])
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
                render: (_: any, records: any) => <a onClick={() => {
                    setCurrentId(records.materialContractDetailId)
                    setOprationType("remove")
                    setVisible(true)
                }}>移除</a>
            }]} dataSource={chooseList} />
        {/* <DetailTitle title="待选区" /> */}
        <div>
            <p style={{paddingLeft: "14px", boxSizing: "border-box", fontSize: "16px"}}>待选区</p>
            <Form form={serarchForm} style={{paddingLeft: "14px"}}>
                <Row>
                    <Col span={4}>
                        <Form.Item
                            name="num1"
                            label="标准">
                                <Select style={{ width: 120 }} placeholder="请选择">
                                    <Select.Option value="jack">Jack</Select.Option>
                                    <Select.Option value="lucy">Lucy</Select.Option>
                                    <Select.Option value="Yiminghe">yiminghe</Select.Option>
                                </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="num2"
                            label="材质">
                                <Select style={{ width: 120 }} placeholder="请选择">
                                    <Select.Option value="jack">Jack</Select.Option>
                                    <Select.Option value="lucy">Lucy</Select.Option>
                                    <Select.Option value="Yiminghe">yiminghe</Select.Option>
                                </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="num3"
                            label="长度">
                                <InputNumber min={1} step={1} />&nbsp;
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item
                            name="num4">
                                <InputNumber min={1} step={1} />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item
                            name="num5"
                            label="规格">
                                <Input placeholder="请输入规格" />
                        </Form.Item>
                    </Col>&nbsp;&nbsp;
                    <Col span={4}>
                        <Form.Item>
                            <Button type="primary">搜索</Button>&nbsp;&nbsp;
                            <Button>重置</Button>
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
                render: (_: any, records: any) => <a onClick={() => {
                    setCurrentId(records.materialContractDetailId)
                    setOprationType("select")
                    setVisible(true)
                }}>选择</a>
            }]} dataSource={selectList} />
    </Spin>
})
interface EditProps {
    id: string,
    type: "new" | "edit"
}
interface ModalRef {
    dataSource: any[]
    resetFields: () => void
}
export default forwardRef(function Edit({ id, type }: EditProps, ref): JSX.Element {
    const modalRef = useRef<ModalRef>({ dataSource: [], resetFields: () => { } })
    const [visible, setVisible] = useState<boolean>(false)
    const [cargoData, setCargoData] = useState<any[]>([])
    const [contractId, setContractId] = useState<string>("")
    const [columns, setColumns] = useState<object[]>(BasicInformation.map(item => {
        if (["contractNumber", "supplierName"].includes(item.dataIndex)) {
            return ({ ...item, disabled: type === "edit" })
        }
        return item
    }))
    const [form] = Form.useForm()

    const handleModalOk = () => {
        let num: string = "0.00"
        let weight: string = "0.00"
        const dataSource: any[] = modalRef.current?.dataSource.map((item: any) => {
            num = (parseFloat(num) + parseFloat(item.num || "0.00")).toFixed(2)
            weight = (parseFloat(weight) + parseFloat(item.weight || "0.00")).toFixed(2)
            const postData = {
                ...item,
                materialContractDetailId: item.id || item.materialContractDetailId,
                productName: item.materialName,
                standard: item.materialStandard,
                materialStandardName: item.materialStandardName,
                num: item.num,
                contractUnitPrice: item.price
            }
            delete postData.id
            return postData
        })
        setCargoData(dataSource)
        form.setFieldsValue({ num: parseFloat(num), weight })
        setVisible(false)
    }

    const { loading } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/${id}`)
            form.setFieldsValue({
                ...formatData(BasicInformation, result),
                supplierName: { id: result.supplierId, value: result.supplierName },
                contractNumber: { id: result.contractId, value: result.contractNumber }
            })
            setContractId(result?.contractId)
            setCargoData(result?.lists || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const path: string = type === "new" ? `/tower-storage/receiveStock/receiveStock` : `/tower-storage/receiveStock`
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](path, type === "new" ? data : ({ ...data, id }))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resole, reject) => {
        try {
            const baseFormData = await form.validateFields()
            await saveRun({
                ...baseFormData,
                supplierId: baseFormData.supplierName.id,
                supplierName: baseFormData.supplierName.value,
                contractId: baseFormData.contractNumber.id,
                contractNumber: baseFormData.contractNumber.value,
                lists: cargoData
            })
            resole(true)
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
        setCargoData([])
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, cargoData, onSubmit, resetFields])

    const handleBaseInfoChange = (fields: any) => {
        if (fields.contractNumber) {
            setContractId(fields.contractNumber.id)
        }
        if (fields.supplierName) {
            const supplierData = fields.supplierName.records[0]
            setColumns(columns.map((item: any) => {
                if (item.dataIndex === "contractNumber") {
                    return ({
                        ...item,
                        path:`${item.path}&supplierId=${fields.supplierName.id}`
                    })
                }
                return item
            }))
            form.setFieldsValue({
                contactsUser: supplierData.contactMan,
                contactsPhone: supplierData.contactManTel
            })
        }
    }

    return <Spin spinning={loading}>
        <Modal
            width={1011}
            visible={visible}
            title="选择货物明细"
            onCancel={() => {
                modalRef.current?.resetFields()
                setVisible(false)
            }}
            onOk={handleModalOk}>
            <ChooseModal id={contractId} ref={modalRef} initChooseList={cargoData} />
        </Modal>
        <DetailTitle title="收货单基础信息" />
        <BaseInfo form={form} onChange={handleBaseInfoChange} columns={columns} dataSource={{}} edit />
        <DetailTitle title="运费信息" />
        <BaseInfo form={form} columns={freightInfo} dataSource={{}} />
        <DetailTitle title="装卸费信息" />
        <BaseInfo form={form} columns={handlingChargesInfo} dataSource={{}} />
        <DetailTitle title="货物明细" operation={[<Button
            type="primary" key="choose" ghost
            onClick={() => {
                if (!contractId) {
                    message.warning("请先选择合同编号...")
                    return
                }
                setVisible(true)
            }}>选择</Button>]} />
        <CommonTable haveIndex rowKey="materialContractDetailId" columns={editCargoDetails} dataSource={cargoData} />
    </Spin>
})