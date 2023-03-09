/**
 * 新增订单/编辑订单
 */
import React, { useState } from 'react';
import { Form, Button, message, Spin, Radio } from 'antd';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { BaseInfo, DetailContent, DetailTitle, EditableTable } from '../../common';
import { baseInfo, payment } from "./sale_order.json";
import { doNumber } from "../../../utils/KeepDecimals";
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil';
import { currencyTypeOptions, planNameOptions, productTypeOptions, saleTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
const planNameEnum = planNameOptions?.map((item: any) => ({ label: item.name, value: item.id }))
const initData = {
    orderWeight: "0",
    taxAmount: "0",
    amount: "0",
    taxPrice: "0",
    price: "0",
    taxRate: 13,
    foreignExchangeAmount: "0",
    exchangeRate: "0",
    foreignPrice: "0",
    guaranteeAmount: "0"
}

export default function SeeGuarantee(): JSX.Element {
    const history = useHistory();
    const routerMatch = useRouteMatch<{ type: "new" | "edit" }>("/project/:entry/:type/order")
    const [when, setWhen] = useState<boolean>(true)
    const [contratId, setContratId] = useState<string>()
    const [planType, setPlanType] = useState<0 | 1>(0)
    const [editFormData, setEditFormData] = useState<any[]>([])
    const [addCollectionForm] = Form.useForm();
    const [editform] = Form.useForm();
    const params = useParams<{ projectId: string, id: string }>();
    const type = routerMatch?.params?.type
    // 新增保存
    const { loading: saveLoaing, run } = useRequest((postData: { data: {} }) => new Promise(async (resolve, reject) => {
        try {
            const result: any = await RequestUtil[type === "new" ? "post" : "put"]("/tower-market/saleOrder", postData.data)
            resolve(result);
            if (result) {
                setWhen(false)
                message.success(`${type === "new" ? "新增订单成功" : "修改订单成功"}`);
                history.goBack()
            }
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 编辑回显
    const { loading, data: orderData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/saleOrder/${params.id}`)
            setEditFormData(result?.paymentPlanOrderVOS || [])
            resole({
                ...initData,
                ...result?.contractInfoVo,
                ...result,
                internalNumber: {
                    id: result?.contractInfoVo.contractId,
                    value: result?.contractInfoVo.internalNumber,
                    records: result?.contractInfoVo ? [result?.contractInfoVo] : []
                }
            });
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" || !params.id })

    const { loading: contratLoading } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/contract/${contratId}`)
            setEditFormData(result?.paymentPlanVos || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { ready: !!contratId })

    const processingNumber = (arg: any, num: number) => {
        arg = arg.replace(/[^\d.]/g, "");
        arg = arg.replace(/^\./g, "");
        arg = arg.replace(/\.{2,}/g, ".");
        arg = arg.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        arg = arg.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3');
        return arg
    }

    const performanceBondChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        if (fields.internalNumber) {
            // 关联合同
            const taxRate = addCollectionForm.getFieldValue("taxRate") * 1; // 税率
            const result = fields.internalNumber.records[0];
            const taxPrice = processingNumber(result.contractAmount / result.contractTotalWeight + "", 6)
            const price = taxPrice / (1 + taxRate / 100)
            const amount = (+result.contractTotalWeight || 0) * price; // 含税金额
            addCollectionForm.setFieldsValue({
                purchaseOrderNumber: result.purchaseOrderNumber, // 采购订单号
                // internalNumber: result.internalNumber, // 内部合同编号
                orderWeight: result.contractTotalWeight,// 订单重量=== 合同总重
                taxAmount: result.contractAmount,// 含税金额=== 合同总价
                taxPrice,
                amount: doNumber(amount, 4),
                price: doNumber(price, 4), // 含税单价
                customerCompany: result.customerCompany, // 业主单位
                signCustomerName: result.signCustomerName, // 合同签订单位
                signContractTime: result.signContractTime, // 合同签订日期
                deliveryTime: result.deliveryTime, // 合同要求交货日期
                orderDeliveryTime: result.deliveryTime, // 合同要求交货日期
                currencyType: result.currencyType, // 币种
                saleType: result.saleType, // 销售类型
                orderProjectName: result.contractName, // 订单工程名称
                contractName: result.contractName, // 合同名称
                deliveryAddress: result.deliveryAddress, // 交货地点
                salesman: result.salesman // 销售业务员
            })
            return;
        }
        if (fields.orderWeight) {
            // 订单重量改变
            // 影响含税单价，不含税单价，不含税金额
            // 不含税金额 = 不含税单价 * 订单重量
            const taxRate = addCollectionForm.getFieldValue("taxRate") * 1; // 税率
            const taxPrice = (addCollectionForm.getFieldValue("orderWeight") > 0 && addCollectionForm.getFieldValue("taxAmount")) ? addCollectionForm.getFieldValue("taxAmount") / addCollectionForm.getFieldValue("orderWeight") : 0; // 含税单价
            const price = taxPrice / (1 + taxRate / 100);
            const result = (+addCollectionForm.getFieldValue("orderWeight") || 0) * price; // 含税金额
            addCollectionForm.setFieldsValue({
                amount: doNumber(result, 4),
                taxPrice: processingNumber(taxPrice + "", 6), // 含税单价
                price: doNumber(price, 4), // 不含税单价
                orderWeight: processingNumber(fields.orderWeight, 8)
            })
            return;
        }
        if (fields.taxAmount) {
            const editFormData = editform.getFieldsValue()
            // 含税金额改变
            // 会影响含税单价，不含税单价，不含税金额
            // 含税单价 = 含税金额/订单重量
            // 不含税单价 = 含税单价 / （1+税率/100），保留4位小数
            if (addCollectionForm.getFieldValue("orderWeight") > 0) {
                const result = addCollectionForm.getFieldValue("taxAmount") / addCollectionForm.getFieldValue("orderWeight"); // 含税单价
                const taxRate = addCollectionForm.getFieldValue("taxRate") * 1; // 税率
                const price = result / (1 + taxRate / 100);
                const amount = (+addCollectionForm.getFieldValue("orderWeight") || 0) * price; // 含税金额
                addCollectionForm.setFieldsValue({
                    taxPrice: processingNumber(result + "", 6),
                    price: doNumber(price, 4),
                    amount: doNumber(amount, 4),
                    taxAmount: processingNumber(fields.taxAmount, 4),
                })
            }
            addCollectionForm.setFieldsValue({
                taxAmount: processingNumber(fields.taxAmount, 4),
            })
            editform.setFieldsValue({
                submit: editFormData.submit.map((item: any) => {
                    if (planType === 0) {
                        return ({
                            ...item,
                            returnedAmount: (item.returnedRate * processingNumber(fields.taxAmount, 4) / 100).toFixed(2)
                        })
                    }
                    if (planType === 1) {
                        return ({
                            ...item,
                            returnedRate: (item.returnedAmount / processingNumber(fields.taxAmount, 4) * 100).toFixed(2)
                        })
                    }
                    return item
                })
            })
            return;
        }
        if (fields.taxRate) {
            // 税率改变
            // 会影响不含单价以及不含税金额
            const result = (+addCollectionForm.getFieldValue("taxPrice") || 0);
            const taxRate = addCollectionForm.getFieldValue("taxRate") * 1; // 税率
            const price = result / (1 + taxRate / 100);
            const amount = (+addCollectionForm.getFieldValue("orderWeight") || 0) * price; // 含税金额
            addCollectionForm.setFieldsValue({
                amount: doNumber(amount, 4),
                price: doNumber(price, 4),
            })
            return;
        }
    }

    const handleSave = async () => {
        const baseData: any = await addCollectionForm.validateFields();
        const editformData: any = await editform.validateFields()
        if (!editformData.submit || editformData.submit.length <= 0) {
            message.warning("至少新增一条回款计划")
            return
        }
        const {
            totalReturnedRate,
            totalReturnedAmount
        } = editformData.submit.reduce((
            { totalReturnedRate, totalReturnedAmount }: any,
            item: any
        ) => ({
            totalReturnedRate: parseFloat(
                (Number(item.returnedRate || 0) + Number(totalReturnedRate || 0)).toString()
            ).toFixed(2),
            totalReturnedAmount: parseFloat(
                (Number(item.returnedAmount || 0) + Number(totalReturnedAmount || 0)).toString()
            ).toFixed(2)
        }), { totalReturnedRate: 0, totalReturnedAmount: 0 })
        if (editformData.submit.length <= 0) {
            message.error('回款计划无数据，需新增！');
            return
        }
        // if (totalReturnedRate !== "100.00") {
        //     message.error('计划回款总占比必须等于100');
        //     return
        // }
        // if (totalReturnedAmount !== parseFloat(baseData.taxAmount).toFixed(2)) {
        //     message.error('计划回款总金额必须等于含税金额');
        //     return
        // }

        const result = {
            projectId: params.projectId && params.projectId !== "undefined" ? params.projectId : undefined,
            ...baseData,
            contractInfoDto: {
                ...baseData?.internalNumber.records[0],
                contractId: baseData?.internalNumber?.records[0]?.id || baseData?.internalNumber?.records[0]?.contractId
            },
            planType,
            contractNumber: baseData?.internalNumber?.records[0]?.contractNumber,
            paymentPlanOrderDTOS: editformData.submit
        }
        await run({
            data: type === "new" ? result : {
                ...result,
                id: params.id
            }
        })
    }

    const handleEditableChange = (fields: any, allFields: any) => {
        if (fields.submit.length - 1 >= 0) {
            const baseInfo = addCollectionForm.getFieldsValue()
            const result = allFields.submit[fields.submit.length - 1];
            if (planType === 0) {
                editform.setFieldsValue({
                    submit: allFields.submit.map((item: any) => {
                        if (item.id === result.id) {
                            return ({
                                ...item,
                                returnedAmount: (Number(baseInfo.taxAmount || 0) * Number(result.returnedRate || 0) / 100).toFixed(2)
                            })
                        }
                        return item
                    })
                })
            }
            if (planType === 1) {
                editform.setFieldsValue({
                    submit: allFields.submit.map((item: any) => {
                        if (item.id === result.id) {
                            return ({
                                ...item,
                                returnedRate: (Number(baseInfo.taxAmount || 0) / Number(result.returnedAmount || 0) * 100).toFixed(2)
                            })
                        }
                        return item
                    })
                })
            }
        }
    }

    return (
        <DetailContent when={when} operation={[
            <Button loading={saveLoaing} key="save" type="primary" style={{ marginRight: "16px" }} onClick={handleSave}>保存</Button>,
            <Button key="goback" type="default" onClick={() => history.goBack()}>返回</Button>
        ]}>
            <Spin spinning={loading}>
                <DetailTitle title="基本信息" />
                <BaseInfo
                    form={addCollectionForm}
                    onChange={performanceBondChange}
                    dataSource={{ ...initData, ...orderData } || initData}
                    col={4}
                    columns={[
                        ...baseInfo.map((item: any) => {
                            if (item.dataIndex === "internalNumber") {
                                return ({
                                    ...item,
                                    path: `/tower-market/contract${params.projectId && params.projectId !== "undefined" ? `?projectId=${params.projectId}` : ""}`,
                                    disabled: orderData && orderData?.taskStatus !== 0,
                                    columns: item.columns.map((v: any) => {
                                        if (v.dataIndex === "saleTypeName") {
                                            return {
                                                ...v,
                                                enum: saleTypeOptions?.map(item => ({
                                                    value: item.id,
                                                    label: item.name
                                                }))
                                            }
                                        }
                                        return v
                                    })
                                })
                            }
                            if (item.dataIndex === "currencyType") {
                                return {
                                    ...item,
                                    enum: currencyTypeOptions?.map(item => ({
                                        value: item.id,
                                        label: item.name
                                    }))
                                }
                            }
                            if (item.dataIndex === "productType") {
                                return {
                                    ...item,
                                    enum: productTypeOptions?.map(item => ({
                                        value: item.id,
                                        label: item.name
                                    }))
                                }
                            }
                            if (item.dataIndex === "voltageGrade") {
                                return {
                                    ...item,
                                    enum: voltageGradeOptions?.map(item => ({
                                        value: item.id,
                                        label: item.name
                                    }))
                                }
                            }
                            if (item.dataIndex === "saleType") {
                                return {
                                    ...item,
                                    enum: saleTypeOptions?.map(item => ({
                                        value: item.id,
                                        label: item.name
                                    }))
                                }
                            }
                            return item;
                        })
                    ]}
                    edit
                />
                <DetailTitle
                    title="回款计划"
                    operation={[<Button
                        key="add"
                        type="primary"
                        ghost
                        loading={contratLoading}
                        onClick={() => {
                            const isClick = addCollectionForm.getFieldValue("internalNumber")?.id
                            if (!isClick) {
                                message.error("请先选择内部合同编号...")
                                return
                            }
                            setContratId(isClick)
                        }}
                    >引用合同回款计划</Button>]} />
                <EditableTable
                    haveIndex={false}
                    addData={(data: any) => ({
                        period: (data?.[0]?.period || 0) + 1,
                        returnedAmount: 0.00,
                        returnedRate: 0.00
                    })}
                    opration={[
                        <Radio.Group
                            value={planType}
                            key="type"
                            onChange={(event: any) => setPlanType(event.target.value)}
                            options={[
                                { label: "按占比", value: 0 },
                                { label: "按金额", value: 1 }
                            ]} />
                    ]}
                    form={editform}
                    onChange={handleEditableChange}
                    columns={[...payment.map(item => {
                        if (item.dataIndex === "returnedAmount") {
                            return ({
                                ...item,
                                disabled: planType === 0
                            })
                        }
                        if (item.dataIndex === "returnedRate") {
                            return ({
                                ...item,
                                disabled: planType === 1
                            })
                        }
                        if (item.dataIndex === "name") {
                            return ({
                                ...item,
                                enum: planNameEnum
                            })
                        }
                        return item
                    })]}
                    dataSource={editFormData} />
            </Spin>
        </DetailContent>
    )
}