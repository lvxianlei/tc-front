import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button, Form, message, Spin, Modal, InputNumber, Row, Col, Input, Select } from 'antd'
import { DetailTitle, BaseInfo, CommonTable, formatData } from '../../common'
import { BasicInformation, editCargoDetails, SelectedArea, Selected, freightInfo, handlingChargesInfo } from "./receivingListData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { materialStandardTypeOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"
import { changeTwoDecimal_f } from "../../../utils/KeepDecimals";
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

    // 定义承接待选区的所有数据
    const [waitingArea, setWaitingArea] = useState<any[]>([])

    // 标准
    const standardEnum = materialStandardTypeOptions?.map((item: { id: string, name: string }) => ({
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
                materialContractDetailId: item.id
            })).filter((item: any) => item.num))
            setWaitingArea(result?.materialContractDetailVos.map((item: any) => ({
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
        setWaitingArea([])
    }

    const handleRemove = async (materialContractDetailId: string) => {
        const formData = await form.validateFields()
        const currentData = chooseList.find((item: any) => item.materialContractDetailId === materialContractDetailId)
        const currentSelectData = selectList.find((item: any) => item.materialContractDetailId === materialContractDetailId)
        if ((currentData.num - formData.num) === 0) {
            setChooseList(chooseList.filter((item: any) => item.materialContractDetailId !== materialContractDetailId))
            if (currentSelectData) {
                setSelectList(selectList.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
                setWaitingArea(waitingArea.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setSelectList([...selectList, { ...currentData, num: formData.num }])
                setWaitingArea([...waitingArea, { ...currentData, num: formData.num }])
            }
        } else if ((currentData.num - formData.num) < 0) {
            message.error("移除数量不能大于已选数量...")
            return
        } else {
            setChooseList(chooseList.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: item.num - formData.num }) : item))
            if (currentSelectData) {
                setSelectList(selectList.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
                setWaitingArea(waitingArea.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setSelectList([...selectList, { ...currentData, num: formData.num }])
                setWaitingArea([...waitingArea, { ...currentData, num: formData.num }])
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
            setWaitingArea(waitingArea.filter((item: any) => item.materialContractDetailId !== materialContractDetailId))
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
            setWaitingArea(waitingArea.map((item: any) => item.materialContractDetailId === materialContractDetailId ? ({ ...item, num: parseFloat(item.num) - parseFloat(formData.num) }) : item))
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
interface Freight {
    transportBear: string
    transportCompany: string
    transportTaxPrice: string
    transportPriceCount: string
}
interface HandLing {
    unloadBear: string
    unloadCompany: string
    unloadTaxPrice: string
    unloadPriceCount: string
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

    // 运费信息
    const [freightInformation, setFreightInformation] = useState<Freight>({
        transportBear: "",
        transportCompany: "",
        transportTaxPrice: "0",
        transportPriceCount: "0"
    });
    // 装卸费信息
    const [handlingCharges, setHandlingCharges] = useState<HandLing>({
        unloadBear: "",
        unloadCompany: "",
        unloadTaxPrice: "0",
        unloadPriceCount: "0"
    });

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
                contractUnitPrice: item.price,
                quantity: item.num ? item.num : 0
            }
            delete postData.id
            return postData
        })
        setCargoData(dataSource)
        form.setFieldsValue({ num: parseFloat(num), weight })
        setVisible(false);
        console.log(dataSource, 'dataSource')
        // 选择完货物明细，
        let transportPriceCount = "0",
                unloadPriceCount = "0",
                weightAll = 0,
                priceAll = 0;
        if (dataSource.length > 0) {
            for (let i = 0; i < dataSource.length; i += 1) {
                weightAll = weightAll += (((dataSource[i].weight) * 1 <= 0 ? 0 : dataSource[i].weight) * 1);
                priceAll = dataSource[i].price * 1 + priceAll;
            }
            // 运费价税合计 = 总重量 * 单价
            transportPriceCount = weightAll * ((freightInformation as any).transportTaxPrice * 1) + "";
            // 装卸费合计 = 总重量 * 单价
            unloadPriceCount = (weightAll * ((handlingCharges as any).unloadTaxPrice * 1) ) + "";
        }
        setFreightInformation({
            ...freightInformation,
            transportPriceCount: changeTwoDecimal_f(transportPriceCount) + "", // 运费价税合计（元）
        })
        setHandlingCharges({
            ...handlingCharges,
            unloadPriceCount: changeTwoDecimal_f(unloadPriceCount) + ""
        })
        form.setFieldsValue({ price: priceAll })
    }

    const { loading } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/${id}`)
            form.setFieldsValue({
                ...formatData(BasicInformation, result),
                supplierName: { id: result.supplierId, value: result.supplierName },
                contractNumber: { id: result.contractId, value: result.contractNumber }
            })
            let v = [];
            if (result.lists) {
                for (let i = 0; i < result.lists.length; i += 1) {
                    v.push({
                        ...result.lists[i],
                        quantity: result.lists[i].quantity ? result.lists[i].quantity : 0
                    })
                }
            }
            
            setContractId(result?.contractId)
            setCargoData(v || [])
            // 编辑回显
            setFreightInformation({
                transportBear:  result?.transportBear === 1 ? "需方" : '供方', // 运输承担
                transportCompany: result?.transportCompany, // 运输公司
                transportTaxPrice: result?.transportTaxPrice, // 合同单价
                transportPriceCount: result?.transportPriceCount, // 运费价税合计（元）
            })
            setHandlingCharges({
                unloadBear: result?.unloadBear === 1 ? "需方" : '供方',
                unloadCompany: result?.unloadCompany,
                unloadTaxPrice: result?.unloadTaxPrice,
                unloadPriceCount: result?.unloadPriceCount
            })
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
                ...freightInformation,
                ...handlingCharges,
                transportBear: freightInformation?.transportBear === "需方" ? 2 : 1,
                unloadBear: handlingCharges.unloadBear === "需方" ? 2 : 1,
                supplierId: baseFormData.supplierName.id,
                supplierName: baseFormData.supplierName.value,
                contractId: baseFormData.contractNumber.id,
                contractNumber: baseFormData.contractNumber.value,
                lists: cargoData,
                quantity: baseFormData.num
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
        console.log(fields, "带回来的数据")
        if (fields.contractNumber) {
            setContractId(fields.contractNumber.id);

            // 设置运费信息以及装卸费信息
            let transportPriceCount = "0",
                unloadPriceCount = "0",
                weightAll = 0;
            if (cargoData.length > 0) {
                for (let i = 0; i < cargoData.length; i += 1) {
                    weightAll = weightAll += (((cargoData[i].weight) * 1 <= 0 ? 0 : cargoData[i].weight) * 1);
                }
                // 运费价税合计 = 总重量 * 单价
                transportPriceCount = weightAll * (fields.contractNumber.records[0].transportTaxPrice ? fields.contractNumber.records[0].transportTaxPrice : "0") + "";
                // 装卸费合计 = 总重量 * 单价
                unloadPriceCount = (weightAll * (fields.contractNumber.records[0].unloadTaxPrice ? fields.contractNumber.records[0].unloadTaxPrice : "0")) + "";
            }
            setFreightInformation({
                transportBear:  fields.contractNumber.records[0].transportBear === 1 ? "需方" : '供方', // 运输承担
                transportCompany: fields.contractNumber.records[0].transportCompany ? fields.contractNumber.records[0].transportCompany : "", // 运输公司
                transportTaxPrice: fields.contractNumber.records[0].transportTaxPrice ? fields.contractNumber.records[0].transportTaxPrice : "0", // 合同单价
                transportPriceCount: changeTwoDecimal_f(transportPriceCount) + "", // 运费价税合计（元）
            })
            setHandlingCharges({
                unloadBear: fields.contractNumber.records[0].unloadBear === 1 ? "需方" : '供方',
                unloadCompany: fields.contractNumber.records[0].unloadCompany ? fields.contractNumber.records[0].unloadCompany : "",
                unloadTaxPrice: fields.contractNumber.records[0].unloadTaxPrice ? fields.contractNumber.records[0].unloadTaxPrice : "0",
                unloadPriceCount: changeTwoDecimal_f(unloadPriceCount) + ""
            })
        }
        if (fields.supplierName) {
            const supplierData = fields.supplierName.records[0]
            setColumns(columns.map((item: any) => {
                if (item.dataIndex === "contractNumber") {
                    console.log(item.path, "path")
                    return ({
                        ...item,
                        path:`/tower-supply/materialContract?contractStatus=1&supplierId=${fields.supplierName.id}`
                    })
                }
                return item
            }))
            form.setFieldsValue({
                contractNumber: "",
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
        <BaseInfo columns={freightInfo} dataSource={(freightInformation as any)} />
        <DetailTitle title="装卸费信息" />
        <BaseInfo columns={handlingChargesInfo} dataSource={(handlingCharges as any)} />
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