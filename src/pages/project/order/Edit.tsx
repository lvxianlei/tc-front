/**
 * 新增订单/编辑订单
 */
import React from 'react';
import { Form, Button, message, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, DetailTitle } from '../../common';
import { baseInfo } from "./Edit.json";
import { doNumber } from "../../../utils/KeepDecimals";
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil';
import { currencyTypeOptions, productTypeOptions, saleTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';

export default function SeeGuarantee(): JSX.Element {
    const history = useHistory();
    const [addCollectionForm] = Form.useForm();
    const params = useParams<{ projectId: string, id: string }>();

    const processingNumber = (arg: any, num: number) => {
        let v = new RegExp(`^(\\-)*(\\d+)\.(\\d{${num}}).*$`);
        arg = arg.replace(/[^\d.]/g, "");
        arg = arg.replace(/^\./g, "");
        arg = arg.replace(/\.{2,}/g, ".");
        arg = arg.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        arg = arg.replace(v, '$1$2.$3');
        return arg
    }

    const performanceBondChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        if (fields.internalNumber) {
            // 关联合同
            const result = fields.internalNumber.records[0];
            console.log(result, "reslut")
            addCollectionForm.setFieldsValue({
                purchaseOrderNumber: result.purchaseOrderNumber, // 采购订单号
                // internalNumber: result.internalNumber, // 内部合同编号
                customerCompany: result.customerCompany, // 业主单位
                signCustomerName: result.signCustomerName, // 合同签订单位
                signContractTime: result.signContractTime, // 合同签订日期
                deliveryTime: result.deliveryTime, // 合同要求交货日期
                currencyType: result.currencyType, // 币种
                saleType: result.saleType, // 销售类型
                orderProjectName: result.contractName, // 订单工程名称
                contractName: result.contractName, // 合同名称
            })
            return;
        }
        if (fields.orderWeight) {
            // 订单重量改变
            // 影响含税单价，不含税单价，不含税金额
            // 不含税金额 = 不含税单价 * 订单重量
            const taxRate = addCollectionForm.getFieldValue("taxRate") * 1; // 税率
            const taxPrice = addCollectionForm.getFieldValue("orderWeight") > 0 ? addCollectionForm.getFieldValue("taxAmount") / addCollectionForm.getFieldValue("orderWeight") : 0; // 含税单价
            const price = taxPrice / (1 + taxRate  / 100);
            const result =  (+addCollectionForm.getFieldValue("orderWeight") || 0) * price; // 含税金额
            addCollectionForm.setFieldsValue({
                amount: doNumber(result, 4),
                taxPrice: processingNumber(taxPrice + "", 6), // 含税单价
                price: doNumber(price, 4), // 不含税单价
                orderWeight: processingNumber(fields.orderWeight, 8)
            })
            return;
        }
        if (fields.taxAmount) {
            // 含税金额改变
                // 会影响含税单价，不含税单价，不含税金额
            // 含税单价 = 含税金额/订单重量
            // 不含税单价 = 含税单价 / （1+税率/100），保留4位小数
            if (addCollectionForm.getFieldValue("orderWeight") > 0) {
                const result = addCollectionForm.getFieldValue("taxAmount") / addCollectionForm.getFieldValue("orderWeight"); // 含税单价
                const taxRate = addCollectionForm.getFieldValue("taxRate") * 1; // 税率
                const price = result / (1 + taxRate  / 100);
                const amount =  (+addCollectionForm.getFieldValue("orderWeight") || 0) * price; // 含税金额
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
            return;
        }
        if (fields.taxRate) {
            // 税率改变
            // 会影响不含单价以及不含税金额
            const result =  (+addCollectionForm.getFieldValue("taxPrice") || 0);
            const taxRate = addCollectionForm.getFieldValue("taxRate") * 1; // 税率
            const price = result / (1 + taxRate  / 100);
            const amount =  (+addCollectionForm.getFieldValue("orderWeight") || 0) * price; // 含税金额
            addCollectionForm.setFieldsValue({
                amount: doNumber(amount, 4),
                price: doNumber(price, 4),
            })
            return;
        }
    }
    const handleSave = async() => {
        const baseData: any = await addCollectionForm.validateFields();
        const result = {
            projectId: params.projectId,
            ...baseData,
            contractInfoDto: {
                ...baseData?.internalNumber.records[0],
                contractId: baseData?.internalNumber?.records[0]?.id || baseData?.internalNumber?.records[0]?.contractId
            },
            contractNumber: baseData?.internalNumber?.records[0]?.contractNumber,
        }
        await run({data: params.id === "new" ? result : {...result, id: params.id}})
    }

    // 新增保存
    const { loading: saveLoaing, run } = useRequest((postData: { data: {} }) => new Promise(async (resolve, reject) => {
        try {
            const result: any = await RequestUtil[params.id === "new" ? "post": "put"]("/tower-market/saleOrder", postData.data)
            resolve(result);
            if (result) {
                message.success(`${params.id === "new" ? "新增订单成功" : "修改订单成功"}`);
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
            addCollectionForm.setFieldsValue({
                ...result?.contractInfoVo,
                ...result,
                internalNumber: {
                    id: result?.contractInfoVo.contractId,
                    value: result?.contractInfoVo.internalNumber,
                    records: result?.contractInfoVo ? [result?.contractInfoVo] : []
                }
            })
            resole(result);
        } catch (error) {
            reject(error)
        }
    }), { manual: params.id === "new" })
    return (
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button loading={saveLoaing} key="save" type="primary" style={{ marginRight: "16px" }} onClick={handleSave}>保存</Button>,
                <Button key="goback" type="default" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="基本信息" />
                <BaseInfo
                    form={addCollectionForm}
                    onChange={performanceBondChange}
                    dataSource={{
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
                    }}
                    col={4}
                    columns={[
                        ...baseInfo.map((item: any) => {
                            if (item.dataIndex === "internalNumber") {
                                return ({
                                    ...item,
                                    path: "/tower-market/contract?projectId=" + params.projectId,
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
            </DetailContent>
        </Spin>
    )
}