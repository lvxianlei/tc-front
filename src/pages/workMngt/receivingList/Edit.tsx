import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react"
import { Button, Form, message, Spin, Modal, InputNumber, Row, Col, Input, Select } from 'antd'
import { DetailTitle, BaseInfo, CommonTable, formatData, EditableTable } from '../../common'
import { BasicInformation, editCargoDetails, SelectedArea, Selected, freightInfo, handlingChargesInfo } from "./receivingListData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { materialStandardTypeOptions, materialTextureOptions, unloadModeOptions, settlementModeOptions } from "../../../configuration/DictionaryOptions"
import { changeTwoDecimal_f } from "../../../utils/KeepDecimals";
import moment from "moment"
interface ChooseModalProps {
    id: string,
    initChooseList: any[],
    numberStatus: number
}
/**
 * 纸质单号，原材料税款合计，车辆牌照
 */
const ChooseModal = forwardRef(({ id, initChooseList }: ChooseModalProps, ref) => {
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
    const [supplierId, setSupplierId] = useState<string>("")
    let [number, setNumber] = useState<number>(0);
    const [form] = Form.useForm()
    const [editForm] = Form.useForm()

    const { loading: materialLoading, data: materialData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/tax/taxMode/material`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: warehouseLoading, data: warehouseData } = useRequest<any[]>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get("/tower-storage/warehouse/getWarehouses")
            resole(result?.map((item: any) => ({ value: item.id, label: item.name })))
        } catch (error) {
            reject(error)
        }
    }))
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
        const meteringMode = form.getFieldValue("meteringMode")
        let num: string = "0.00"
        const dataSource: any[] = modalRef.current?.dataSource.map((item: any) => {
            num = (parseFloat(num) + parseFloat(item.num || "0.00")).toFixed(2)
            const totalTaxPrice = ((item.ponderationWeight || "0") * item.num) * item.taxPrice
            const totalPrice = ((item.weight || "0") * item.num) * item.taxPrice
            const postData = {
                ...item,
                id: item.id,
                materialName: item.materialName,
                materialStandard: item.materialStandard,
                materialStandardName: item.materialStandardName,
                num: item.num,
                contractUnitPrice: item.taxPrice,
                /** 理算重量 */
                weight: item.weight,
                /** 理算总重量 */
                totalWeight: (item.weight * item.num).toFixed(4),
                /***
                 * 计算价税合计 
                 *      总重 = 单个重量 * 数量
                 *      价税合计 = 总重 * 数量 * 合同单价
                 */
                // price: ((item.weight * item.num) * item.num * item.price).toFixed(2),
                taxPrice: item.taxPrice,
                totalTaxPrice: meteringMode === 1 ? totalPrice.toFixed(2) : totalTaxPrice.toFixed(2),
                totalUnTaxPrice: meteringMode === 1 ? (totalPrice - totalPrice * (materialData!.taxVal / 100)).toFixed(2)
                    : (totalTaxPrice - totalTaxPrice * (materialData!.taxVal / 100)).toFixed(2),
                unTaxPrice: item.price,
                appearance: item.appearance || 1
            }
            delete postData.id
            return postData
        })
        setCargoData(dataSource)
        setVisible(false);
        // 选择完货物明细，
        let transportPriceCount = "0",
            unloadPriceCount = "0",
            weightAll = 0,
            priceAll = 0;
        if (dataSource.length > 0) {
            for (let i = 0; i < dataSource.length; i += 1) {
                weightAll = weightAll + (((dataSource[i].weight) * 1 <= 0 ? 0 : dataSource[i].weight) * 1);
                priceAll = dataSource[i].price * 1 + priceAll;
            }
            // 运费价税合计 = 总重量 * 单价
            transportPriceCount = weightAll * ((freightInformation as any).transportTaxPrice * 1) + "";
            // 装卸费合计 = 总重量 * 单价
            unloadPriceCount = (weightAll * ((handlingCharges as any).unloadTaxPrice * 1)) + "";
        }
        setFreightInformation({
            ...freightInformation,
            transportPriceCount: changeTwoDecimal_f(transportPriceCount) + "", // 运费价税合计（元）
        })
        setHandlingCharges({
            ...handlingCharges,
            unloadPriceCount: changeTwoDecimal_f(unloadPriceCount) + ""
        })
    }

    const { run: getSupplier } = useRequest<any[]>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-supply/supplier/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/${id}`)
            form.setFieldsValue({
                ...formatData(BasicInformation, result),
                supplierName: result.supplierName,
                contractNumber: { id: result.contractId, value: result.contractNumber },
                unloadUsersName: {
                    value: result.unloadUsersName,
                    records: result.unloadUsers.split(",").map((userId: any) => ({ userId }))
                }
            })
            let v = [];
            if (result.lists) {
                for (let i = 0; i < result.lists.length; i += 1) {
                    v.push({
                        ...result.lists[i],
                        num: result.lists[i].num ? result.lists[i].num : 0
                    })
                }
            }

            setContractId(result?.contractId)
            setSupplierId(result?.supplierId)
            setCargoData(v || [])
            // 编辑回显
            setFreightInformation({
                transportBear: result?.transportBear, // 运输承担
                transportCompany: result?.transportCompany, // 运输公司
                transportTaxPrice: result?.transportTaxPrice, // 合同单价
                transportPriceCount: result?.transportPriceCount, // 运费价税合计（元）
            })
            setHandlingCharges({
                unloadBear: result?.unloadBear,
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
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](
                `/tower-storage/receiveStock`,
                type === "new" ? data : ({ ...data, id })
            )
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resole, reject) => {
        try {
            const baseFormData = await form.validateFields()
            const listsFormData = await editForm.validateFields()
            await saveRun({
                ...baseFormData,
                ...freightInformation,
                ...handlingCharges,
                transportBear: freightInformation?.transportBear,
                unloadBear: handlingCharges.unloadBear,
                supplierId,
                supplierName: baseFormData.supplierName,
                contractId: baseFormData.contractNumber.id,
                contractNumber: baseFormData.contractNumber.value,
                lists: listsFormData.submit?.map((item: any, index: number) => ({ ...cargoData[index], ...item })),
                num: baseFormData.num,
                unloadUsersName: baseFormData.unloadUsersName.value,
                unloadUsers: baseFormData.unloadUsersName.records.map((item: any) => item.userId).join(","),
            })
            resole(true)
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
        setCargoData([])
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, cargoData, onSubmit, resetFields])

    const handleBaseInfoChange = async (fields: any, allFields: any) => {
        if (fields.contractNumber) {
            setContractId(fields.contractNumber.id);
            setSupplierId(fields.contractNumber.records[0].supplierId)
            const supplierData: any = await getSupplier(fields.contractNumber.records[0].supplierId)
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
                transportBear: fields.contractNumber.records[0].transportBear, // 运输承担
                transportCompany: fields.contractNumber.records[0].transportCompany ? fields.contractNumber.records[0].transportCompany : "", // 运输公司
                transportTaxPrice: fields.contractNumber.records[0].transportTaxPrice ? fields.contractNumber.records[0].transportTaxPrice : "0", // 合同单价
                transportPriceCount: changeTwoDecimal_f(transportPriceCount) + "", // 运费价税合计（元）
            })
            setHandlingCharges({
                unloadBear: fields.contractNumber.records[0].unloadBear,
                unloadCompany: fields.contractNumber.records[0].unloadCompany ? fields.contractNumber.records[0].unloadCompany : "",
                unloadTaxPrice: fields.contractNumber.records[0].unloadTaxPrice ? fields.contractNumber.records[0].unloadTaxPrice : "0",
                unloadPriceCount: changeTwoDecimal_f(unloadPriceCount) + ""
            })
            setCargoData([])
            modalRef.current?.resetFields()
            form.setFieldsValue({
                supplierName: supplierData.supplierName,
                contactsUser: supplierData.contactMan,
                contactsPhone: supplierData.contactManTel
            })
        }
        if (fields.meteringMode) {
            const editData = editForm.getFieldsValue().submit
            const dataSource: any[] = cargoData.map((item: any, index: number) => {
                //过磅
                const totalTaxPrice = ((editData[index].ponderationWeight || "0") * item.num) * item.taxPrice
                //理算
                const totalPrice = ((item.weight || "0") * item.num) * item.taxPrice
                const postData = {
                    ...item,
                    ...editData[index],
                    totalTaxPrice: fields.meteringMode === 1 ? totalPrice.toFixed(2) : totalTaxPrice.toFixed(2),
                    totalUnTaxPrice: fields.meteringMode === 1 ? (totalPrice - totalPrice * (materialData!.taxVal / 100)).toFixed(2)
                        : (totalTaxPrice - totalTaxPrice * (materialData!.taxVal / 100)).toFixed(2),
                }
                return postData
            })
            setCargoData(dataSource)
        }
    }

    useEffect(() => {
        type === "new" && form.setFieldsValue({ meteringMode: 1, receiveTime: moment() })
    }, [type])

    const handleEditableChange = (data: any, allValues: any) => {
        if (data.submit[data.submit.length - 1].ponderationWeight) {
            const meteringMode = form.getFieldValue("meteringMode")
            const ponderationWeight = data.submit[data.submit.length - 1]?.ponderationWeight
            const newFields = allValues.submit.map((item: any, index: number) => {
                if ((index === data.submit.length - 1) && meteringMode === 2) {
                    const totalTaxPrice = (ponderationWeight * item.num) * item.taxPrice
                    return ({
                        ...item,
                        totalTaxPrice: totalTaxPrice.toFixed(2),
                        totalUnTaxPrice: (totalTaxPrice - totalTaxPrice * (materialData!.taxVal / 100)).toFixed(2)
                    })
                }
                return item
            })
            const weightAll = newFields.reduce((count: string, item: any) => (parseFloat(count) + parseFloat(`${item.ponderationWeight}`)).toFixed(2), "0")
            editForm.setFieldsValue({ submit: newFields })
            // 运费价税合计 = 过磅重量 * 单价
            const transportPriceCount = weightAll * ((freightInformation as any).transportTaxPrice * 1) + "";
            // 装卸费合计 = 过磅重量 * 单价
            const unloadPriceCount = (weightAll * ((handlingCharges as any).unloadTaxPrice * 1)) + "";
            setFreightInformation({
                ...freightInformation,
                transportPriceCount: changeTwoDecimal_f(transportPriceCount) + "", // 运费价税合计（元）
            })
            setHandlingCharges({
                ...handlingCharges,
                unloadPriceCount: changeTwoDecimal_f(unloadPriceCount) + ""
            })
        }
    }

    return <Spin spinning={loading && warehouseLoading && materialLoading}>
        <Modal
            width={1011}
            visible={visible}
            title="选择货物明细"
            onCancel={() => {
                modalRef.current?.resetFields()
                setVisible(false)
                setNumber(++number)
            }}
            onOk={handleModalOk}>
            <ChooseModal id={contractId} ref={modalRef} initChooseList={cargoData} numberStatus={number} />
        </Modal>
        <DetailTitle title="收货单基础信息" />
        <BaseInfo
            col={2}
            form={form}
            edit
            onChange={handleBaseInfoChange}
            columns={BasicInformation.map(item => {
                switch (item.dataIndex) {
                    case "paperNumber":
                        return ({
                            ...item,
                            maxLength: 20,
                            rules: [
                                {
                                    pattern: new RegExp(/^[a-zA-Z0-9]*$/g, 'g'),
                                    message: "请输入正确的纸质单号"
                                }
                            ]
                        })
                    case "contractNumber":
                        return ({
                            ...item,
                            disabled: type === "edit"
                        })
                    case "unloadMode":
                        return ({
                            ...item,
                            enum: unloadModeOptions?.map((item: any) => ({ value: item.id, label: item.name }))
                        })
                    case "settlementMode":
                        return ({
                            ...item,
                            enum: settlementModeOptions?.map((item: any) => ({ value: item.id, label: item.name }))
                        })
                    case "warehouseId":
                        return ({
                            ...item,
                            enum: warehouseData || []
                        })
                    default:
                        return item
                }
            })}
            dataSource={{}} />
        <DetailTitle title="运费信息" />
        <BaseInfo col={2} columns={freightInfo} dataSource={(freightInformation as any)} />
        <DetailTitle title="装卸费信息" />
        <BaseInfo col={2} columns={handlingChargesInfo} dataSource={(handlingCharges as any)} />
        <DetailTitle title="货物明细" operation={[<Button type="primary" key="choose" ghost
            onClick={() => {
                if (!contractId) {
                    message.warning("请先选择合同编号...")
                    return
                }
                setVisible(true)
            }}>选择</Button>]} />
        <EditableTable
            haveIndex
            form={editForm}
            haveOpration={false}
            onChange={handleEditableChange}
            haveNewButton={false}
            columns={editCargoDetails}
            dataSource={cargoData} />
    </Spin>
})