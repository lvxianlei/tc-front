import React, { useState, forwardRef, useImperativeHandle, useRef } from "react"
import { Button, Modal, Select, Input, Form, Row, Col, Spin, InputNumber, message, DatePicker } from "antd"
import { BaseInfo, CommonTable, DetailTitle, IntgSelect, PopTableContent } from "../../common"
import { editBaseInfo, materialColumnsSaveOrUpdate, addMaterial, choosePlanList } from "./enquiry.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"
import { calcFun } from "../Edit"
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
            const result: { [key: string]: any } = await RequestUtil.get( `/tower-supply/materialPurchasePlan/infoList`, {
                ...filterValue,
                // planStatus: 1,
                usePlanDetailIds: props?.usePlanDetailIds||'',
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
        <Form form={form} onFinish={(values) =>{ 
            if (values.date) {
                const formatDate = values.date.map((item: any) => item.format("YYYY-MM-DD"))
                values.startCreateTime = formatDate[0] + " 00:00:00"
                values.endCreateTime = formatDate[1] + " 23:59:59"
                delete values.date
            }
            run({
            ...values,
            purchaserId: values.purchaserId?.value
        })}}>
            <Row gutter={[8, 8]}>
                <Col><Form.Item label="采购类型" name="purchaseType">
                    <Select style={{ width: 200 }}>
                        <Select.Option value="1">配料采购</Select.Option>
                        <Select.Option value="2">库存采购</Select.Option>
                        <Select.Option value="3">缺料采购</Select.Option>
                    </Select>
                </Form.Item></Col>
                {/* <Col><Form.Item label="采购人" name="purchaserId">
                    <IntgSelect width={200} />
                </Form.Item></Col> */}
                <Col><Form.Item label="品名" name="materialName">
                    <Input />
                </Form.Item></Col>
                <Col><Form.Item label="标准" name="materialStandard">
                    <Select style={{ width: "160px" }} defaultValue={""}>
                        <Select.Option value='' key={'aa'}>全部</Select.Option>
                        {
                            materialStandardOptions?.map((item: { id: string, name: string }) => <Select.Option
                                value={item.id}
                                key={item.id}>{item.name}</Select.Option>)
                        }
                    </Select>
                </Form.Item></Col>
                <Col><Form.Item label="材质" name="structureTexture">
                    <Select style={{ width: "160px" }} defaultValue={""}>
                        <Select.Option value='' key={'aa'}>全部</Select.Option>
                        {
                            materialTextureOptions?.map((item: { id: string, name: string }) => <Select.Option
                                value={item.name}
                                key={item.id}>{item.name}</Select.Option>)
                        }
                    </Select>
                </Form.Item></Col>
                <Col><Form.Item label="规格" name="structureSpec">
                    <Input />
                </Form.Item></Col>
                <Col><Form.Item label="申购日期" name="date">
                    <DatePicker.RangePicker style={{ width: "200px" }} format="YYYY-MM-DD" />
                </Form.Item></Col>
                <Col><Form.Item label="模糊查询" name="fuzzyQuery">
                    <Input placeholder="输入采购计划编号/物料编码进行查询"/>
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
                type: "checkbox",
                onChange: (_: any, selectedRows: any[]) => {
                    setSelectRows(selectedRows)
                }
            }}
            rowKey='purchasePlanDetailId'
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
            
            form.setFieldsValue({
                ...result,
                supplyIdList: {
                    value: result.supplierVOS?.map((item: any) => item.supplierName).join(","),
                    records: result.supplierVOS?.map((item: any) => ({
                        id: item.id,
                        supplierName: item.supplierName
                    })) || []
                },
            })
            
            const comparisonPriceDetailVos = result?.comparisonPriceDetailVos.map((res: any) => {
                return {
                    ...res,
                    structureTexture: res.structureTexture,
                    structureTextureId: res.structureTextureId,
                    materialStandardName: res.materialStandardName,
                    materialStandard: res.materialStandard,
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



    const onSubmit = () => new Promise(async (resove, reject) => {
        try {
            const baseData = await form.validateFields()
            // 添加对长度以及数量的拦截
            let flag = false;
            for (let i = 0; i < materialList.length; i += 1) {
                if (!(materialList[i].length && materialList[i].num)) {
                    flag = true;
                }
            }
            if (flag) {
                message.error("请您填写长度或数量！");
                return false;
            }
            await saveRun({
                ...baseData,
                supplyIdList: baseData?.supplyIdList.records.map((item: any) => item.id).join(","),
                supplyNameList: baseData?.supplyIdList.records.map((item: any) => item.supplierName).join(","),
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
            console.log(error)
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
        setMaterialList([])
        setPopDataList([])
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }))

    const handleAddModalOk = () => {
        const newMaterialList: any[] = []
        setMaterialList([...materialList, ...newMaterialList.map((item: any) => ({
            ...item,
            num: item.num || "0",
            width: formatSpec(item.spec).width,
            thickness: formatSpec(item.spec).thickness,
            weight: calcFun.weight({
                weightAlgorithm: item.weightAlgorithm,
                proportion: item.proportion,
                length: item.length,
                width: item.width
            }),
            totalWeight: calcFun.totalWeight({
                weightAlgorithm: item.weightAlgorithm,
                proportion: item.proportion,
                length: item.length,
                width: item.width,
                num: item.num
            })
        }))])
        setPopDataList([...materialList, ...newMaterialList.map((item: any) => ({
            ...item,
            num: item.num || "0",
            width: formatSpec(item.spec).width,
            thickness: formatSpec(item.spec).thickness,
            weight: calcFun.weight({
                weightAlgorithm: item.weightAlgorithm,
                proportion: item.proportion,
                length: item.length,
                width: item.width
            }),
            totalWeight: calcFun.totalWeight({
                weightAlgorithm: item.weightAlgorithm,
                proportion: item.proportion,
                length: item.length,
                width: item.width,
                num: item.num
            })
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
        // setPurchasePlanId(chooseData[0].purchasePlanId);
        setMaterialList(chooseData?.map((item: any) => ({
            ...item,
            num: item.num || "0",
            structureSpec: item.structureSpec,
            thickness: formatSpec(item.spec).thickness,
            source:  1,
            weight: item.weight,
            length: item.length,
            totalWeight: item.totalWeight,
            structureTextureId: item.structureTextureId,
            structureTexture: item.structureTexture,
            materialStandard: item.materialStandard,
            materialStandardName: item.materialStandardName,
            materialCode: item.materialCode
        })))
        setPopDataList(chooseData?.map((item: any) => ({
            ...item,
            num: item.num || "0",
            structureSpec: item.structureSpec,
            thickness: formatSpec(item.spec).thickness,
            source:  1,
            weight: item.weight,
            length: item.length,
            totalWeight: item.totalWeight,
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
                    weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(5)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(5)
                            : (Number(item?.proportion || 1) / 1000).toFixed(5),
                    totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * Number(value) / 1000 / 1000).toFixed(5)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * Number(value) / 1000 / 1000 / 1000).toFixed(5)
                            : (Number(item?.proportion || 1) * Number(value) / 1000).toFixed(5)
                })
            }
            return item
        }))
        setPopDataList(materialList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    num: value,
                    weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(5)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(5)
                            : (Number(item?.proportion || 1) / 1000).toFixed(5),
                    totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * Number(value) / 1000 / 1000).toFixed(5)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * Number(value) / 1000 / 1000 / 1000).toFixed(5)
                            : (Number(item?.proportion || 1) * Number(value) / 1000).toFixed(5)
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
                    weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(value || 1)) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(value || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) / 1000).toFixed(3),
                    totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(value || 1)) * Number(item.num||0) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(value || 1) * Number(item.width || 0) * Number(item.num||0) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * Number(item.num||0) / 1000).toFixed(3)
                })
            }
            return item
        }));
        setPopDataList(materialList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    length: value,
                    weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(value || 1)) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(value || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) / 1000).toFixed(3),
                    totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(value || 1)) * Number(item.num||0) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(value || 1) * Number(item.width || 0) * Number(item.num||0) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * Number(item.num||0) / 1000).toFixed(3)
                })
            }
            return item
        }));
    }

    const handGuaranteChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        if (fields.supplyIdList) {
            if (fields.supplyIdList.records.length > 4) {
                message.error("询比价供应商最多选择四个，请您重新选择！");
                form.setFieldsValue({
                    supplyIdList: ""
                })
                return false;
            } else {
                form.setFieldsValue({
                    supplyIdList: {
                        value: fields.supplyIdList.records.map((item: any) => item.supplierName).join(","),
                        records: fields.supplyIdList.records.map((item: any) => ({ ...item, supplierName: item.supplierName }))
                    }
                })
            }
        }
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
            <ChoosePlan ref={choosePlanRef} usePlanDetailIds={popDataList&&popDataList.length>0&&popDataList.map(item=>item.purchasePlanDetailId)}/>
        </Modal>
        <DetailTitle title="询比价基本信息" />
        <BaseInfo form={form} col={2} columns={editBaseInfo} dataSource={{}} edit onChange={handGuaranteChange} />
        <DetailTitle title="询比价材料明细 *" operation={[
            <Button type="primary" ghost key="add" style={{ marginRight: 16 }}
                onClick={() => setVisible(true)}>添加询价原材料</Button>,
            <Button type="primary" ghost key="choose" onClick={() => setChooseVisible(true)}>选择计划</Button>
        ]} />
        <CommonTable
            haveIndex
            style={{ padding: "0" }}
            rowKey="key"
            pagination={false}
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
                                setMaterialList(newData.slice(0))
                                setPopDataList(newData.slice(0))
                            }}>
                                {materialStandardOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' + item.name} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        })
                    }
                    if (item.dataIndex === "structureTextureId") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => records.source === 1 ? records?.structureTexture : <Select style={{ width: '150px' }} value={records?.structureTextureId + ',' + records?.structureTexture} onChange={(e: string) => {
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
                                setMaterialList(newData.slice(0))
                                setPopDataList(newData.slice(0))
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
            dataSource={[...popDataList?.map((item: any, index: number) => ({ ...item, key: `${item.materialCode}-${index}` }))]} />
    </Spin>
})