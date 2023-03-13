import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button, Form, message, Spin, Modal, Space } from 'antd'
import { DetailTitle, BaseInfo, formatData, EditableTable } from '../../common'
import ChooseModal from "./ChooseModal"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import {
    unloadModeOptions, settlementModeOptions, materialTextureOptions,
    materialStandardOptions, supplierTypeOptions
} from "../../../configuration/DictionaryOptions"
import { BasicInformation, editCargoDetails } from "./receivingListData.json"
import * as calcObj from '@utils/calcUtil'
/**
 * 纸质单号，原材料税款合计，车辆牌照
 */
interface EditProps {
    id: string,
    type: "new" | "edit"
}
interface ModalRef {
    dataSource: any[]
    resetFields: () => void
}

interface TotalState {
    count?: string
    weight?: string
    taxPrice?: string
    unTaxPrice?: string
}

const supplierTypeEnum = supplierTypeOptions?.map((item: { id: string, name: string | number }) => ({
    value: item.id,
    label: item.name
}))

export default forwardRef(function Edit({ id, type }: EditProps, ref): JSX.Element {
    const modalRef = useRef<ModalRef>({ dataSource: [], resetFields: () => { } })
    const [visible, setVisible] = useState<boolean>(false)
    const [cargoData, setCargoData] = useState<any[]>([])
    const [supplierId, setSupplierId] = useState<string>("")
    let [number, setNumber] = useState<number>(0);
    const [form] = Form.useForm()
    const [editForm] = Form.useForm()

    const { loading: materialLoading, data: taxData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/tax`)
            resole({
                material: result.find((item: any) => item.modeName === "材料税率").taxVal,
                transport: result.find((item: any) => item.modeName === "运费税率").taxVal,
                unload: result.find((item: any) => item.modeName === "装卸税率").taxVal
            })
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

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/auxiliaryReceiveStock/detail/${id}`)
            setSupplierId(result?.supplierId)
            setCargoData(result?.auxiliaryReceiveStockDetails.map((item: any) => ({
                ...item,
                uuId: item.id,
                num: item.num ? item.num : 0
            })) || [])
            resole({
                ...formatData(BasicInformation, result),
                supplierId: {
                    id: result.supplierId,
                    value: result.supplierName,
                },
                unloadUsersName: {
                    value: result.unloadUsersName,
                    records: result.unloadUsers?.split(",").map((userId: any) => ({ userId }))
                }
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](
                `/tower-storage/auxiliaryReceiveStock`,
                type === "new" ? data : ({ ...data, id })
            )
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleModalOk = () => {
        const dataSource: any[] = modalRef.current?.dataSource.map((item: any) => {
            // 含税金额
            const totalTaxAmount = calcObj.totalTaxPrice(item.taxPrice, item.num)
            // 不含税金额
            const totalAmount = calcObj.totalTaxPrice(item.price, item.num)
            // 含税运费
            const totalTransportTaxPrice = calcObj.totalTaxPrice(item.transportTaxPrice, item.num)
            // 不含税运费
            const totalTransportPrice = calcObj.totalTaxPrice(item.transportPrice, item.num)
            // 含税装卸费
            const totalUnloadTaxPrice = calcObj.totalTaxPrice(item.unloadTaxPrice, item.num)
            // 不含税装卸费
            const totalUnloadPrice = calcObj.totalTaxPrice(item.unloadPrice, item.num)

            const postData = {
                ...item,
                materialContractDetailId: item.materialContractDetailId,
                materialName: item.materialName,
                materialStandard: item.materialStandard,
                // materialStandardName: item.materialStandardName,
                num: item.num,
                contractUnitPrice: item.taxPrice,
                taxPrice: item.taxPrice,
                /** 不含税单价 */
                price: item.price,
                totalTaxAmount,
                totalAmount,
                appearance: item.appearance || 1,
                totalTransportTaxPrice,
                totalTransportPrice,
                totalUnloadTaxPrice,
                totalUnloadPrice
            }
            return postData
        })

        setCargoData(dataSource)
        setVisible(false);
    }

    const onSubmit = () => new Promise(async (resole, reject) => {
        try {
            const baseFormData = await form.validateFields()
            await editForm.validateFields()
            let editData = editForm.getFieldsValue(true).submit
            editData.forEach((item: any) => {
                delete item.id
                delete item.key
            })
            const result = {
                ...baseFormData,
                supplierId,
                supplierName: baseFormData.supplierId.value,
                auxiliaryReceiveStockDetails: editData.map((item: any) => ({
                    ...item,
                    id: item.uuId || null
                })),
                num: baseFormData.num,
                unloadUsersName: baseFormData.unloadUsersName?.value,
                unloadUsers: baseFormData.unloadUsersName?.records.map((item: any) => item.userId).join(","),
            }
            await saveRun(result)
            resole(true)
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
        editForm.resetFields()
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, cargoData, onSubmit, resetFields])

    const handleBaseInfoChange = async (fields: any) => {
        if (fields.supplierId) {
            setSupplierId(fields.supplierId.id)
            modalRef.current?.resetFields()
            const supplierData: any = fields.supplierId.records[0]
            form.setFieldsValue({
                contactsUser: supplierData.contactMan,
                contactsPhone: supplierData.contactManTel
            })
            setCargoData([])
        }
    }

    const handleEditableChange = (data: any) => {
        const changeIndex = data.submit.length - 1
        const changeFiled = data.submit[changeIndex]
        if (changeFiled.num) {
            const result = editForm.getFieldsValue(true).submit[changeIndex];
            const dataSource: any[] = editForm.getFieldsValue(true).submit
            // 含税金额
            const totalTaxAmount = calcObj.totalTaxPrice(result.taxPrice, result.num)
            // 不含税金额
            const totalAmount = calcObj.totalTaxPrice(result.price, result.num)
            // 含税运费
            const totalTransportTaxPrice = calcObj.totalTaxPrice(result.transportTaxPrice, result.num)
            // 不含税运费
            const totalTransportPrice = calcObj.totalTaxPrice(result.transportPrice, result.num)
            // 含税装卸费
            const totalUnloadTaxPrice = calcObj.totalTaxPrice(result.unloadTaxPrice, result.num)
            // 不含税装卸费
            const totalUnloadPrice = calcObj.totalTaxPrice(result.unloadPrice, result.num)

            dataSource[changeIndex] = {
                ...dataSource[changeIndex],
                totalTaxAmount,
                totalAmount,
                unTaxPrice: calcObj.unTaxPrice(result.taxPrice, taxData?.material),
                totalTransportTaxPrice,
                totalTransportPrice,
                totalUnloadTaxPrice,
                totalUnloadPrice
            }
            setCargoData(dataSource || [])
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
            <ChooseModal id={supplierId} ref={modalRef} initChooseList={cargoData} numberStatus={number} />
        </Modal>
        <DetailTitle title="收货单基础信息" />
        <BaseInfo
            col={2}
            form={form}
            edit
            onChange={handleBaseInfoChange}
            columns={BasicInformation.map(item => {
                switch (item.dataIndex) {
                    case "supplierId":
                        return ({
                            ...item,
                            disabled: type === "edit",
                            search: item.search?.map((searchItem: any) => {
                                if (searchItem.dataIndex == 'supplierType') {
                                    return {
                                        ...searchItem,
                                        enum: supplierTypeEnum
                                    }
                                } else {
                                    return searchItem
                                }
                            }) || []
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
            dataSource={{
                meteringMode: 1,
                settlementMode: settlementModeOptions?.[0]?.id,
                ...data
            }} />
        <DetailTitle
            title="货物明细"
            operation={[
                <Button
                    type="primary"
                    key="choose"
                    ghost
                    onClick={() => {
                        if (!supplierId) {
                            message.warning("请先选择供应商...")
                            return
                        }
                        setVisible(true)
                    }}
                >选择</Button>
            ]}
        />
        <EditableTable
            haveIndex={false}
            form={editForm}
            rowKey="key"
            haveOpration={false}
            onChange={handleEditableChange}
            haveNewButton={false}
            columns={[
                ...editCargoDetails.map((item: any) => {
                    if (item.dataIndex === "materialStandard") {
                        return ({
                            ...item,
                            enum: materialStandardOptions?.map(item => ({
                                value: item.id,
                                label: item.name
                            }))
                        })
                    }
                    if (item.dataIndex === "structureTexture") {
                        return ({
                            ...item,
                            enum: materialTextureOptions?.map(item => ({
                                value: item.name,
                                label: item.name
                            }))
                        })
                    }
                    return item;
                })
            ]}
            dataSource={cargoData.map((item: any, index: number) => ({
                ...item,
                key: item.id || `item-${index}`
            })) || []}
        // rowSelection={{
        //     selectedRowKeys: select,
        //     type: "checkbox",
        //     onChange: onSelectChange,
        //     // onSelect: onSelectChange,
        //     // onSelectAll,
        //     getCheckboxProps: data?.getCheckboxProps
        // }}
        />
    </Spin>
})