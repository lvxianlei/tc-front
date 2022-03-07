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
    }), {refreshDeps: [pagenation.current]})

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
    const [list, setList] = useState<any[]>([])
    const [form] = Form.useForm();
    const [purchasePlanId, setPurchasePlanId] = useState('');
    const { loading } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/comparisonPrice/${id}`)
            form.setFieldsValue(result)
            const comparisonPriceDetailVos = result?.comparisonPriceDetailVos.map((res: any) => {
                return {
                    ...res,
                    materialTextureId: res.source === 1 ? res.materialTexture : res.materialTextureId,
                    materialStandardName: res.source === 1 ? res.materialStandard : res.materialStandardName,
                    materialStandard: res.source === 1 ? res.materialStandardName : res.materialStandard
                }
            })
            // setMaterialList(comparisonPriceDetailVos || [])
            setList(comparisonPriceDetailVos || [])
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
                        materialTexture: item.source === 1 ? item.materialTextureId : item.materialTexture,
                        materialTextureId: item.source === 1 ? '' : item.materialTextureId,
                        materialStandard: item.source === 1 ? item.materialStandardName : item.materialStandard,
                        materialStandardName: item.source === 1 ? item.materialStandard : item.materialStandardName,
                    }
                    // delete item.id
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
    }

    useEffect(() => {
        const newMaterialList = list.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        setMaterialList([...list.map((item: any) => ({
            ...item,
            num: item.num || "0",
            width: formatSpec(item.spec).width,
            thickness: formatSpec(item.spec).thickness,
            totalWeight: (parseFloat(item.num || "0.00") * parseFloat(item.weight || "0.00")).toFixed(2)
        }))])
        setVisible(false)
    }, [JSON.stringify(list)])

    const handleAddModalOk = () => {
        setList(popDataList)
        // const newMaterialList = popDataList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        // setMaterialList([...materialList, ...newMaterialList.map((item: any) => ({
        //     ...item,
        //     num: item.num || "0",
        //     width: formatSpec(item.spec).width,
        //     thickness: formatSpec(item.spec).thickness,
        //     totalWeight: (parseFloat(item.num || "0.00") * parseFloat(item.weight || "0.00")).toFixed(2)
        // }))])
        // setVisible(false)
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
            spec: item.structureSpec,
            // width: formatSpec(item.spec).width,
            thickness: formatSpec(item.spec).thickness,
            weight: item.singleWeight || 0,
            source: 1,
            totalWeight: (parseFloat(item.planPurchaseNum || "0.00") * parseFloat(item.singleWeight || "0.00")).toFixed(2),
            materialTextureId: item.structureTexture,
            materialStandard: item.standardName,
            materialStandardName: item.standard,
            materialCode: item.code
        })))
        setChooseVisible(false)
    }
    const handleRemove = (id: string) => setMaterialList(materialList.filter((item: any) => item.materialCode !== id))

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
    }

    const lengthChange = (value: number, id: string) => {
        const list = materialList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    length: value,
                    weight: item.weightAlgorithm === '0' ? ((item.proportion * item.thickness * item.width * value)/1000).toFixed(3) : item.weightAlgorithm === '1' ? ((item.proportion * value)/1000).toFixed(3) : null,
                    totalWeight: (parseFloat(item.weight || "0.00") * item.num).toFixed(3)
                })
            }
            return item
        })
        setMaterialList(list);
    }

    return <Spin spinning={loading}>
        <Modal width={addMaterial.width || 520} title={`选择${addMaterial.title}`} destroyOnClose visible={visible}
            onOk={handleAddModalOk} onCancel={() => {
                const newMaterialList = popDataList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
                console.log("selec", materialList, newMaterialList, popDataList)
                setVisible(false)
                // setMaterialList([])
            }}>
            <PopTableContent data={{
                ...(addMaterial as any),
                columns: (addMaterial as any).columns.map((item: any) => {
                    if (item.dataIndex === "standard") {
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
                records: materialList,
                value: ""
            }}
                onChange={(fields: any[]) => {
                    console.log(fields, "fields")
                    setPopDataList(fields.map((item: any) => ({
                        ...item,
                        spec: item.structureSpec,
                        source: 2,
                        materialTexture: item.structureTexture,
                        standardName: item.standardName,
                        materialStandard: item.standard,
                        proportion: item.proportion == -1 ? 0 : item.proportion
                    })))
                    // setMaterialList(fields.map((item: any) => ({
                    //     ...item,
                    //     spec: item.structureSpec,
                    //     source: 2,
                    //     materialTexture: item.structureTexture,
                    //     standardName: item.standardName,
                    //     materialStandard: item.standard,
                    //     proportion: item.proportion == -1 ? 0 : item.proportion
                    // })))
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
            style={{padding: "0",}}
            columns={[
                ...materialColumnsSaveOrUpdate.map((item: any) => {
                    if (item.dataIndex === "num") {
                        return ({
                            ...item,
                            render: (value: number, records: any) => records.source === 1 ? value : <InputNumber
                                min={0}
                                value={value === -1 ? 0 : value}
                                onChange={(value: number) => handleInputChange(value, records.id)} />
                        })
                    }
                    if (item.dataIndex === "length") {
                        return ({
                            ...item,
                            render: (value: number, records: any) => records.source === 1 ? value : <InputNumber
                                min={0}
                                value={value === -1 ? 0 : value}
                                onChange={(value: number) => lengthChange(value, records.id)} />
                        })
                    }
                    if (item.dataIndex === "materialStandard") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => records.source === 1 ? value : <Select style={{ width: '150px' }} value={materialList[key].materialStandard && materialList[key].materialStandard + ',' + materialList[key].materialStandardName} onChange={(e: string) => {
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
                    if (item.dataIndex === "materialTextureId") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => records.source === 1 ? value : <Select style={{ width: '150px' }} value={materialList[key].materialTextureId && materialList[key].materialTextureId + ',' + materialList[key].materialTexture} onChange={(e: string) => {
                                const newData = materialList.map((item: any, index: number) => {
                                    if (index === key) {
                                        return {
                                            ...item,
                                            materialTextureId: e.split(',')[0],
                                            materialTexture: e.split(',')[1]
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
            dataSource={materialList} />
    </Spin>
})