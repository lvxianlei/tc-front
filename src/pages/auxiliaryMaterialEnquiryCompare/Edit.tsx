import React, {useState, forwardRef, useImperativeHandle} from "react"
import {Button, Modal, Form, Spin, InputNumber, message} from "antd"
import {BaseInfo, CommonTable, DetailTitle, PopTableContent} from "../common"
import {editBaseInfo, materialColumnsSaveOrUpdate, addMaterial} from "./enquiryCompare.json"
import {supplierTypeOptions} from "../../configuration/DictionaryOptions"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'

interface EditProps {
    id: string
    type: "new" | "edit"
}

export default forwardRef(function ({id, type}: EditProps, ref): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const supplierTypeEnum = supplierTypeOptions?.map((item: { id: string, name: string | number }) => ({ value: item.id, label: item.name }))
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [form] = Form.useForm();
    const {loading, data:any} = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
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
                    ids: res.id,
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
                comparisonPriceDetailDtos: materialList.map((item: any,index:number) => {
                    return {
                        ...item,
                        // 新创建的使用 使用id  编辑后台返回的 使用purchaseListId
                        purchaseListId: item.purchaseListId,
                        num: item.planPurchaseNum  || 1,
                        id: type === "new"? '' : item.ids,
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
        }))])
        setPopDataList([...materialList, ...newMaterialList.map((item: any) => ({
            ...item,
            num: item.num || "0"
        }))])
        setVisible(false)
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
            destroyOnClose 
            visible={visible}
            onOk={handleAddModalOk}
            onCancel={() => setVisible(false)}>
            <PopTableContent
                data={{
                    ...(addMaterial as any),
                    path:`${(addMaterial as any).path}?planStatus=1&collectType=1&purchaseType=2`,
                }}
                value={{
                    id: "",
                    records: popDataList.map((item:any)=>{return {
                        ...item,
                        id: item.purchaseListId
                    }}),
                    value: ""
                }}
                onChange={(fields: any[]) => {
                    console.log(fields)
                    setMaterialList(fields.map((item: any) => ({
                        ...item,
                        source:  2,
                        num: item.planPurchaseNum,
                        purchaseListId: item.id
                    })))
                }}
            />
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
            <Button type="primary" ghost key="choose" onClick={() => setVisible(true)}>选择计划</Button>
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
                    return item
                }),
                ]}
            dataSource={popDataList?.map((item: any, index: number) => ({
                ...item,
                key: `${item.materialCode}-${index}`
            }))}/>
    </Spin>
})