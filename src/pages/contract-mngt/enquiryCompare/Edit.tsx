import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { Button, Modal, Select, Input, Form, Row, Col, Spin, InputNumber } from "antd"
import { BaseInfo, CommonTable, DetailTitle, IntgSelect } from "../../common"
import { editBaseInfo, materialColumnsSaveOrUpdate, addMaterial, choosePlanList } from "./enquiry.json"
import { PopTableContent } from "./ComparesModal"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"
interface EditProps {
    id: string
    type: "new" | "edit"
}
interface PagenationProps {
    current: number
    pageSize: number
}

const ChoosePlan: React.ForwardRefExoticComponent<any> = forwardRef((props, ref) => {
    const [form] = Form.useForm()
    const [selectRows, setSelectRows] = useState<any[]>([])
    const [pagenation, setPagenation] = useState<PagenationProps>({
        current: 1,
        pageSize: 10
    })
    const {
        loading,
        data,
        run
    } = useRequest<{ [key: string]: any }>((filterValue) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan`, {
                ...filterValue,
                planStatus: 1,
                current: pagenation.current,
                pageSize: pagenation.pageSize
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [pagenation.current] })

    useImperativeHandle(ref, () => ({ selectRows }), [JSON.stringify(selectRows)])

    const paginationChange = (page: number, pageSize: number) => setPagenation({ ...pagenation, current: page, pageSize })

    return <>
        <Form form={form} onFinish={(values) => run({
            ...values,
            purchaserId: values.purchaserId?.second,
            purchaserDeptId: values.purchaserId?.first
        })}>
            <Row gutter={[8, 8]}>
                <Col><Form.Item label="采购类型" name="purchaseType">
                    <Select style={{ width: 200 }}>
                        <Select.Option value="1">外部</Select.Option>
                        <Select.Option value="2">内部</Select.Option>
                        <Select.Option value="3">缺料</Select.Option>
                    </Select>
                </Form.Item></Col>
                <Col><Form.Item label="采购人" name="purchaserId">
                    <IntgSelect width={200} />
                </Form.Item></Col>
                <Col><Form.Item label="采购计划编号" name="purchasePlanCode">
                    <Input />
                </Form.Item></Col>
                <Col><Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>查询</Button>
                    <Button type="default" onClick={() => form.resetFields()} htmlType="button"
                        style={{ marginLeft: 12 }}>重置</Button>
                </Form.Item></Col>
            </Row>
        </Form>
        <CommonTable loading={loading} haveIndex columns={choosePlanList} dataSource={data?.records || []}
            rowSelection={{
                type: "radio",
                onChange: (_: any, selectedRows: any[]) => {
                    setSelectRows(selectedRows)
                }
            }}
            pagination={{
                size: "small",
                pageSize: data?.pageSize,
                onChange: paginationChange,
                current: data?.current,
                total: data?.total
            }}
        />
    </>
})

export default forwardRef(function ({ id, type }: EditProps, ref): JSX.Element {
    const materialStandardEnum = materialStandardOptions?.map((item: {
        id: string,
        name: string
    }) => ({
        value: item.id,
        label: item.name
    }))
    const choosePlanRef = useRef<{ selectRows: any[] }>({ selectRows: [] })
    const [visible, setVisible] = useState<boolean>(false)
    const [chooseVisible, setChooseVisible] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [form] = Form.useForm();
    const [purchasePlanId, setPurchasePlanId] = useState('');
    const { loading } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/comparisonPrice/${id}`)
            form.setFieldsValue(result)
            const comparisonPriceDetailVos = result?.comparisonPriceDetailVos.map((res: any) => {
                return {
                    ...res,
                    structureTexture: res.structureTexture,
                    structureTextureId: res.structureTextureId,
                    materialStandardName: res.materialStandardName,
                    materialStandard: res.materialStandard
                }
            })
            setMaterialList(comparisonPriceDetailVos || [])
            setPopDataList(comparisonPriceDetailVos || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const postData = type === "new" ? { ...data, purchasePlanId: purchasePlanId } : ({ ...data, id, purchasePlanId: purchasePlanId })
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/comparisonPrice`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }))

    const onSubmit = () => new Promise(async (resove, reject) => {
        try {
            const baseData = await form.validateFields()
            await saveRun({
                ...baseData,
                comparisonPriceDetailDtos: materialList.map((item: any) => {
                    return {
                        ...item,
                        id: '',
                        structureTexture: item.structureTexture,
                        structureTextureId: item.structureTextureId,
                        materialStandard: item.materialStandard,
                        materialStandardName: item.materialStandardName
                    }
                })
            })
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
        setMaterialList([])
        setPopDataList([])
    }

    const handleAddModalOk = () => {
        // const newMaterialList = popDataList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        const newMaterialList: any[] = []
        setMaterialList([...materialList, ...newMaterialList.map((item: any) => ({
            ...item,
            num: item.num || "0",
            width: formatSpec(item.spec).width,
            thickness: formatSpec(item.spec).thickness,
            totalWeight: (parseFloat(item.num || "0.00") * parseFloat(item.weight || "0.00")).toFixed(2)
        }))])
        setPopDataList([...materialList, ...newMaterialList.map((item: any) => ({
            ...item,
            num: item.num || "0",
            width: formatSpec(item.spec).width,
            thickness: formatSpec(item.spec).thickness,
            totalWeight: (parseFloat(item.num || "0.00") * parseFloat(item.weight || "0.00")).toFixed(2)
        }))])
        setVisible(false)
    }

    const formatSpec = (spec: any): { width: string, thickness: string } => {
        if (!spec) {
            return ({
                width: "0",
                thickness: "0"
            })
        }
        const splitArr = spec.replace("∠", "").split("*")
        return ({
            width: splitArr[0] || "0",
            thickness: splitArr[1] || "0"
        })
    }

    const handleChoosePlanOk = () => {
        const chooseData = choosePlanRef.current?.selectRows;
        setPurchasePlanId(chooseData[0].id);
        setMaterialList(chooseData[0]?.materials.map((item: any) => ({
            ...item,
            num: item.planPurchaseNum || "0",
            structureSpec: item.structureSpec,
            // width: formatSpec(item.spec).width,
            thickness: formatSpec(item.spec).thickness,
            // weight: item.singleWeight || 0,
            source: item.source || 1,
            // totalWeight: (parseFloat(item.planPurchaseNum || "0.00") * parseFloat(item.singleWeight || "0.00")).toFixed(3),
            structureTextureId: item.structureTextureId,
            structureTexture: item.structureTexture,
            materialStandard: item.materialStandard,
            materialStandardName: item.materialStandardName,
            materialCode: item.materialCode
        })))
        setPopDataList(chooseData[0]?.materials.map((item: any) => ({
            ...item,
            num: item.planPurchaseNum || "0",
            structureSpec: item.structureSpec,
            // width: formatSpec(item.spec).width,
            thickness: formatSpec(item.spec).thickness,
            // weight: item.singleWeight || 0,
            source: item.source || 1,
            // totalWeight: (parseFloat(item.planPurchaseNum || "0.00") * parseFloat(item.singleWeight || "0.00")).toFixed(3),
            structureTextureId: item.structureTextureId,
            structureTexture: item.structureTexture,
            materialStandard: item.materialStandard,
            materialStandardName: item.materialStandardName,
            materialCode: item.materialCode
        })))
        setChooseVisible(false)
    }

    const handleRemove = (id: string) => {
        setMaterialList(materialList.filter((item: any) => item.materialCode !== id))
        setPopDataList(materialList.filter((item: any) => item.materialCode !== id))
    }

    const handleInputChange = (value: number, id: string) => {
        setMaterialList(materialList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    num: value,
                    totalWeight: (parseFloat(item.weight || "0.00") * value).toFixed(2)
                })
            }
            return item
        }))
        setPopDataList(materialList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    num: value,
                    totalWeight: (parseFloat(item.weight || "0.00") * value).toFixed(2)
                })
            }
            return item
        }))
    }

    const lengthChange = (value: number, id: string) => {
        setMaterialList(materialList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    length: value,
                    weight: item.weightAlgorithm === '0' ? ((item.proportion * item.thickness * item.width * value) / 1000 / 1000).toFixed(3) : item.weightAlgorithm === '1' ? ((item.proportion * value) / 1000 / 1000).toFixed(3) : null,
                    totalWeight: (parseFloat(item.weight || "0.00") * (item.num || 0)).toFixed(3)
                })
            }
            return item
        }));
        setPopDataList(materialList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    length: value,
                    weight: item.weightAlgorithm === '0' ? ((item.proportion * item.thickness * item.width * value) / 1000 / 1000).toFixed(3) : item.weightAlgorithm === '1' ? ((item.proportion * value) / 1000 / 1000).toFixed(3) : null,
                    totalWeight: (parseFloat(item.weight || "0.00") * (item.num || 0)).toFixed(3)
                })
            }
            return item
        }));
    }

    return <Spin spinning={loading}>
        <Modal
            width={addMaterial.width || 520}
            title={`选择${addMaterial.title}`}
            destroyOnClose visible={visible}
            onOk={handleAddModalOk}
            onCancel={() => setVisible(false)}>
            <PopTableContent
                data={{
                    ...(addMaterial as any),
                    columns: (addMaterial as any).columns.map((item: any) => {
                        if (item.dataIndex === "materialStandard") {
                            return ({
                                ...item,
                                type: "select",
                                enum: materialStandardEnum
                            })
                        }
                        return item
                    })
                }}
                value={{
                    id: "",
                    records: popDataList,
                    value: ""
                }}
                onChange={(fields: any[]) => {
                    setMaterialList(fields.map((item: any) => ({
                        ...item,
                        structureSpec: item.structureSpec,
                        source: item.source || 2,
                        materialStandardName: item?.materialStandardName ? item?.materialStandardName : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.name : "",
                        materialStandard: item?.materialStandard ? item?.materialStandard : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.id : "",
                        structureTextureId: item?.structureTextureId ? item?.structureTextureId : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.id : "",
                        structureTexture: item?.structureTexture ? item?.structureTexture : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.name : "",
                        proportion: item.proportion == -1 ? 0 : item.proportion
                    })))
                }}
            />
        </Modal>
        <Modal width={1011} title="选择计划" visible={chooseVisible} onOk={handleChoosePlanOk}
            onCancel={() => setChooseVisible(false)}>
            <ChoosePlan ref={choosePlanRef} />
        </Modal>
        <DetailTitle title="询比价基本信息" />
        <BaseInfo form={form} col={2} columns={editBaseInfo} dataSource={{}} edit />
        <DetailTitle title="询价原材料 *" operation={[
            <Button type="primary" ghost key="add" style={{ marginRight: 16 }}
                onClick={() => setVisible(true)}>添加询价原材料</Button>,
            <Button type="primary" ghost key="choose" onClick={() => setChooseVisible(true)}>选择计划</Button>
        ]} />
        <CommonTable
            haveIndex
            style={{ padding: "0"}}
            rowKey="key"
            columns={[
                ...materialColumnsSaveOrUpdate.map((item: any) => {
                    if (item.dataIndex === "num") {
                        return ({
                            ...item,
                            render: (value: number, records: any) => records.source === 1 ? value : <InputNumber
                                min={0}
                                value={value === -1 ? 1 : value}
                                onChange={(value: number) => handleInputChange(value, records.id)} />
                        })
                    }
                    if (item.dataIndex === "length") {
                        return ({
                            ...item,
                            render: (value: number, records: any) => records.source === 1 ? value : <InputNumber
                                min={0}
                                value={value === -1 ? 1 : value}
                                onChange={(value: number) => lengthChange(value, records.id)} />
                        })
                    }
                    if (item.dataIndex === "materialStandard") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => records.source === 1 ? records.materialStandardName : <Select style={{ width: '150px' }} value={materialList[key]?.materialStandard && materialList[key]?.materialStandard + ',' + materialList[key]?.materialStandardName} onChange={(e: string) => {
                                const newData = materialList.map((item: any, index: number) => {
                                    if (index === key) {
                                        return {
                                            ...item,
                                            materialStandard: e.split(',')[0],
                                            materialStandardName: e.split(',')[1]
                                        }
                                    }
                                    return item
                                })
                                setMaterialList(newData)
                            }}>
                                {materialStandardOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' + item.name} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        })
                    }
                    if (item.dataIndex === "structureTextureId") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => records.source === 1 ? records?.structureTexture : <Select style={{ width: '150px' }} value={materialList[key]?.structureTextureId && materialList[key]?.structureTextureId + ',' + materialList[key]?.structureTexture} onChange={(e: string) => {
                                const newData = materialList.map((item: any, index: number) => {
                                    if (index === key) {
                                        return {
                                            ...item,
                                            structureTextureId: e.split(',')[0],
                                            structureTexture: e.split(',')[1]
                                        }
                                    }
                                    return item
                                })
                                setMaterialList(newData)
                            }}>
                                {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' + item.name} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        })
                    }
                    return item
                }),
                {
                    title: "操作",
                    dataIndex: "opration",
                    render: (_: any, records: any) => <Button disabled={records.source === 1} type="link" onClick={() => handleRemove(records.materialCode)}>移除</Button>
                }]}
            dataSource={popDataList.map((item: any, index: number) => ({ ...item, key: `${item.materialCode}-${index}` }))} />
    </Spin>
})