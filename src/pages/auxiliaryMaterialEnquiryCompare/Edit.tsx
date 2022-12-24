import React, {useState, forwardRef, useImperativeHandle, useRef} from "react"
import {Button, Modal, Select, Input, Form, Row, Col, Spin, InputNumber, message} from "antd"
import {BaseInfo, CommonTable, DetailTitle, IntgSelect, PopTableContent} from "../common"
import {editBaseInfo, materialColumnsSaveOrUpdate, addMaterial, choosePlanList} from "./enquiryCompare.json"
import {supplierTypeOptions} from "../../configuration/DictionaryOptions"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import {materialStandardOptions, materialTextureOptions} from "../../configuration/DictionaryOptions"
import {calcFun} from "../contract-mngt/Edit"

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
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/auxiliaryMaterialPurchasePlan/infoList`, {
                ...filterValue,
                planStatus: 1,
                collectType: 1,
                purchaseType: 2,
                current: pagenation.current,
                pageSize: pagenation.pageSize
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {refreshDeps: [pagenation.current]})

    useImperativeHandle(ref, () => ({selectRows}), [JSON.stringify(selectRows)])

    const paginationChange = (page: number, pageSize: number) => setPagenation({...pagenation, current: page, pageSize})

    return <>
        <Form form={form} onFinish={(values) => run({
            ...values,
            purchaserId: values.purchaserId?.value
        })}>
            <Row gutter={[8, 8]}>
                <Col><Form.Item label="品名" name="materialName">
                    <Input />
                </Form.Item></Col>
                <Col><Form.Item label="规格" name="structureSpec">
                    <Input />
                </Form.Item></Col>
                <Col><Form.Item label="查询" name="fuzzyQuery">
                    <Input placeholder="输入汇总计划编号查询"/>
                </Form.Item></Col>
                <Col><Form.Item>
                    <Button type="primary" htmlType="submit" style={{marginLeft: 12}}>查询</Button>
                    <Button type="default" onClick={() => form.resetFields()} htmlType="button"
                            style={{marginLeft: 12}}>重置</Button>
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

export default forwardRef(function ({id, type}: EditProps, ref): JSX.Element {
    const materialStandardEnum = materialStandardOptions?.map((item: {
        id: string,
        name: string
    }) => ({
        value: item.id,
        label: item.name
    }))
    const choosePlanRef = useRef<{ selectRows: any[] }>({selectRows: []})
    const [visible, setVisible] = useState<boolean>(false)
    const [chooseVisible, setChooseVisible] = useState<boolean>(false)
    const supplierTypeEnum = supplierTypeOptions?.map((item: { id: string, name: string | number }) => ({ value: item.id, label: item.name }))
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [form] = Form.useForm();
    const [purchasePlanId, setPurchasePlanId] = useState('');
    const {loading} = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/auxiliaryComparisonPrice/${id}`)

            form.setFieldsValue({
                ...result,
                supplyIdList: {
                    value: result.supplierVOS?.map((item: any) => item.supplierName).join(","),
                    records: result.supplierVOS?.map((item: any) => ({
                        id: item.id,
                        supplierName: item.supplierName,
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
                    planPurchaseNum:res.num
                }
            })
            setMaterialList(comparisonPriceDetailVos || [])
            setPopDataList(comparisonPriceDetailVos || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {manual: type === "new"})

    const {run: saveRun} = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const postData = type === "new" ? {...data, 
                // purchasePlanId: purchasePlanId
            } : ({
                ...data,
                id,
                // purchasePlanId: purchasePlanId
            })
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/auxiliaryComparisonPrice`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {manual: true})


    const onSubmit = () => new Promise(async (resove, reject) => {
        try {
            const baseData = await form.validateFields()
            // 添加对长度以及数量的拦截
            let flag = false;
            for (let i = 0; i < materialList.length; i += 1) {
                if (!materialList[i].planPurchaseNum) {
                    flag = true;
                }
            }
            if (flag) {
                message.error("请您填写数量！");
                return false;
            }
            await saveRun({
                ...baseData,
                supplyIdList: baseData?.supplyIdList.records.map((item: any) => item.id).join(","),
                // purchasePlanId: purchasePlanId,
                comparisonPriceDetailDtos: materialList.map((item: any) => {
                    return {
                        ...item,
                        // 新创建的使用 使用id  编辑后台返回的 使用purchaseListId
                        purchaseListId: item.source ==2 ?item.id:item.purchaseListId,
                        num: item.planPurchaseNum  || 1,
                        // id: '',
                        // structureTexture: item.structureTexture,
                        // structureTextureId: item.structureTextureId,
                        // materialStandard: item.materialStandard,
                        // materialStandardName: item.materialStandardName
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

    useImperativeHandle(ref, () => ({onSubmit, resetFields}))

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
    const {run: getDatailList} = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(
                `/tower-supply/auxiliaryMaterialPurchasePlan/list/${data}?size=1000`
            )
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {manual: true})

    const handleChoosePlanOk = async () => {
        const chooseData = choosePlanRef.current?.selectRows;
        console.log(chooseData)
        // 根据选择的汇总计划获取 辅材明细列表
        // let data = await getDatailList(chooseData[0].id)
        // console.log(data)
        // setPurchasePlanId(chooseData[0].id);
        let list =chooseData.map((item: any) => ({
            ...item,
            source: 2,
            num: item.planPurchaseNum,
        }))
        setMaterialList(list)
        setPopDataList(list)
        // setMaterialList(chooseData[0]?.materials?.map((item: any) => ({
        //     ...item,
        //     num: item.planPurchaseNum || "0",
        //     structureSpec: item.structureSpec,
        //     thickness: formatSpec(item.spec).thickness,
        //     source: item.source || 1,
        //     weight: item.weight,
        //     totalWeight: item.totalWeight,
        //     structureTextureId: item.structureTextureId,
        //     structureTexture: item.structureTexture,
        //     materialStandard: item.materialStandard,
        //     materialStandardName: item.materialStandardName,
        //     materialCode: item.materialCode
        // })))
        // setPopDataList(chooseData[0]?.materials?.map((item: any) => ({
        //     ...item,
        //     num: item.planPurchaseNum || "0",
        //     structureSpec: item.structureSpec,
        //     thickness: formatSpec(item.spec).thickness,
        //     source: item.source || 1,
        //     weight: item.weight,
        //     totalWeight: item.totalWeight,
        //     structureTextureId: item.structureTextureId,
        //     structureTexture: item.structureTexture,
        //     materialStandard: item.materialStandard,
        //     materialStandardName: item.materialStandardName,
        //     materialCode: item.materialCode
        // })))
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
                    planPurchaseNum: value,
                    // totalWeight: (parseFloat(item.weight || "0.00") * value).toFixed(2)
                })
            }
            return item
        }))
        setPopDataList(materialList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    planPurchaseNum: value,
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
                })
            }
            return item
        }));
    }

    const handGuaranteChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        if (fields.supplyIdList) {
            // if (fields.supplyIdList.records.length > 4) {
            //     message.error("询比价供应商最多选择四个，请您重新选择！");
            //     form.setFieldsValue({
            //         supplyIdList: ""
            //     })
            //     return false;
            // } else {
                form.setFieldsValue({
                    supplyIdList: {
                        value: fields.supplyIdList.records.map((item: any) => item.supplierName).join(","),
                        records: fields.supplyIdList.records.map((item: any) => ({
                            ...item,
                            supplierName: item.supplierName
                        }))
                    }
                })
            // }
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
        <Modal width={1011} title="选择汇总计划" visible={chooseVisible} onOk={handleChoosePlanOk}
               onCancel={() => setChooseVisible(false)}>
            <ChoosePlan ref={choosePlanRef}/>
        </Modal>
        <DetailTitle title="询比价基本信息"/>
        <BaseInfo form={form} col={2} columns={
            editBaseInfo.map(item=>{
                if (item.dataIndex === "supplyIdList"){
                return {
                    ...item,
                    search:[
                        {
                            title: "供应商类型",
                            dataIndex: "supplierType",
                            placeholder: "供应商类型",
                            type: "select",
                            enum:supplierTypeEnum
                        },
                        ...item.search
                    ],
                    columns:[
                    ...item.columns.map(item=>{
                            if(item.dataIndex == "supplierType"){
                                return {
                                    ...item,
                                    enum:supplierTypeEnum
                                }
                            }else{
                                return item
                            }
                        })
                    ]
                }
                }else{
                    return item
                }
            })
        }
                  dataSource={{}} edit onChange={handGuaranteChange}/>
        <DetailTitle title="询比价辅材明细 *" operation={[
            <Button type="primary" ghost key="choose" onClick={() => setChooseVisible(true)}>选择计划</Button>
        ]}/>

        <CommonTable
            pagination={
                false
            }
            haveIndex
            style={{padding: "0"}}
            rowKey="key"
            columns={[
                ...materialColumnsSaveOrUpdate.map((item: any) => {
                    if (item.dataIndex === "planPurchaseNum") {
                        return ({
                            ...item,
                            render: (value: number, records: any) => records.source === 1 ? value : <InputNumber
                                min={0}
                                value={value === -1 ? 1 : value}
                                onChange={(value: number) => handleInputChange(value, records.id)}/>
                        })
                    }

                    // if (item.dataIndex === "materialStandard") {
                    //     return ({
                    //         ...item,
                    //         render: (value: number, records: any, key: number) => records.source === 1 ? records.materialStandardName : <Select style={{ width: '150px' }} value={materialList[key]?.materialStandard && materialList[key]?.materialStandard + ',' + materialList[key]?.materialStandardName} onChange={(e: string) => {
                    //             const newData = materialList.map((item: any, index: number) => {
                    //                 if (index === key) {
                    //                     return {
                    //                         ...item,
                    //                         materialStandard: e.split(',')[0],
                    //                         materialStandardName: e.split(',')[1]
                    //                     }
                    //                 }
                    //                 return item
                    //             })
                    //             setMaterialList(newData)
                    //         }}>
                    //             {materialStandardOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' + item.name} key={index}>{item.name}</Select.Option>)}
                    //         </Select>
                    //     })
                    // }
                    // if (item.dataIndex === "structureTextureId") {
                    //     return ({
                    //         ...item,
                    //         render: (value: number, records: any, key: number) => records.source === 1 ? records?.structureTexture : <Select style={{ width: '150px' }} value={records?.structureTextureId + ',' + records?.structureTexture} onChange={(e: string) => {
                    //             const newData = materialList.map((item: any, index: number) => {
                    //                 if (index === key) {
                    //                     return {
                    //                         ...item,
                    //                         structureTextureId: e.split(',')[0],
                    //                         structureTexture: e.split(',')[1]
                    //                     }
                    //                 }
                    //                 return item
                    //             })
                    //             setMaterialList(newData)
                    //         }}>
                    //             {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' + item.name} key={index}>{item.name}</Select.Option>)}
                    //         </Select>
                    //     })
                    // }
                    return item
                }),
                // {
                //     title: "操作",
                //     dataIndex: "opration",
                //     render: (_: any, records: any) => <Button disabled={records.source === 1} type="link"
                //                                               onClick={() => handleRemove(records.materialCode)}>移除</Button>
                // }
                ]}
            dataSource={popDataList?.map((item: any, index: number) => ({
                ...item,
                key: `${item.materialCode}-${index}`
            }))}/>
    </Spin>
})