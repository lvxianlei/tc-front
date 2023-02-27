/**
 * 新增回款信息
 */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Spin } from 'antd';
import { BaseInfo } from '../common';
import { baseColums } from './collectionColumn.json';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil';
import { EditProps } from './collection';
import { currencyTypeOptions, payCategoryOptions, refundModeOptions } from '../../configuration/DictionaryOptions';

export default forwardRef(function AddModal({ editId }: EditProps, ref) {
    const [addCollectionForm] = Form.useForm();
    const [columns, setColumns] = useState(baseColums);
    const [status, setStatus] = useState<boolean>(true);
    const { loading: getting, data } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/backMoney/${editId}`)
            resole({
                ...result,
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: editId === "new" })
    // 币种
    const currencyEnum = (currencyTypeOptions || []).map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    // 来款方式
    const payTypeEnum = refundModeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    // 来款性质
    const payCategoryEnum = payCategoryOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    // 定义取消以及确认的时候禁用取消
    const handleDisbled = () => {
        const result: any = [];
        baseColums.map((item: any) => {
            if (item.dataIndex === "exchangeRate" || item.dataIndex === "abroadMoney") {
                const list = {
                    ...item,
                    disabled: true
                }
                result.push(list)
            } else {
                const list = {
                    ...item,
                    disabled: false
                }
                result.push(list)
            }
        })
        return result;
    }

    const processingNumber = (arg: any, num: number) => {
        arg = arg.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        arg = arg.replace(/^\./g, ""); // 验证第一个字符是数字而不是
        arg = arg.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
        arg = arg.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        arg = num === 2 ?
            arg.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
            : arg.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3');
        return arg
    }

    const handleBaseInfoChange = (fields: any) => {
        const standard = addCollectionForm.getFieldValue("currencyType"),
            results = currencyEnum?.filter((items: any) => items.value === standard);
        // 币种改变对应的禁用处理
        const result = columns.map((item: any) => {
            if (fields.currencyType && item.dataIndex === 'currencyType') {
                if (results && results[0].label === 'RMB人民币') {
                    // 清空并且禁用
                    addCollectionForm.setFieldsValue({
                        exchangeRate: "", // 汇率
                        abroadMoney: "", // 外币
                    })
                    columns.map((v: any) => {
                        if (v.dataIndex === "exchangeRate" || v.dataIndex === "abroadMoney") {
                            v['disabled'] = true;
                        }
                        if (v.dataIndex === "payMoney") {
                            v["disabled"] = false;
                        }
                        if (v.dataIndex === "exchangeRate" || v.dataIndex === "abroadMoney") {
                            delete v["rules"];
                        }
                    })
                } else {
                    addCollectionForm.setFieldsValue({
                        currencyType: fields.currencyType,
                    })
                    columns.map((v: any) => {
                        if (v.dataIndex === "exchangeRate" || v.dataIndex === "abroadMoney") {
                            v['disabled'] = false;
                        }
                        if (v.dataIndex === "payMoney") {
                            v["disabled"] = true;
                        }
                        // 必填处理
                        if (v.dataIndex === "exchangeRate" || v.dataIndex === "abroadMoney") {
                            v["rules"] = [
                                {
                                    "required": true,
                                    "message": `请输入${v.dataIndex === "exchangeRate" ? '汇率' : "外币金额"}`
                                }
                            ]
                        }
                    })
                }
            }
            return item;
        });
        // 输入对来款金额的处理
        if (results && results[0].label !== 'RMB人民币') {
            const exchangeRate = addCollectionForm.getFieldValue("exchangeRate") ?
                processingNumber(addCollectionForm.getFieldValue("exchangeRate") + "", 4)
                : 0,
                abroadMoney = addCollectionForm.getFieldValue("abroadMoney") ?
                    processingNumber(addCollectionForm.getFieldValue("abroadMoney") + "", 2)
                    : 0,
                payMoney = (exchangeRate * abroadMoney + '').indexOf(".") === -1 ? (exchangeRate * abroadMoney) : ((exchangeRate * abroadMoney * 1).toFixed(2));
            addCollectionForm.setFieldsValue({ payMoney: payMoney == 0 ? "" : payMoney, exchangeRate: exchangeRate * 1 === 0 ? "" : exchangeRate, abroadMoney: abroadMoney * 1 === 0 ? "" : abroadMoney })
        } else {
            const payMoney = addCollectionForm.getFieldValue("payMoney") ?
                processingNumber(addCollectionForm.getFieldValue("payMoney") + "", 2)
                : 0;
            addCollectionForm.setFieldsValue({ payMoney: payMoney * 1 === 0 ? "" : payMoney })
        }
        setColumns(result);
        setStatus(false);
    }

    const resetFields = () => {
        addCollectionForm.resetFields()
        const result: any = handleDisbled();
        setColumns(result);
        setStatus(true);
    }

    const { loading, run } = useRequest((postData: { path: string, data: {} }) => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil[editId === "new" ? "post" : "put"](postData.path, postData.data)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await addCollectionForm.validateFields()
            await run({
                path: "/tower-finance/backMoney", data: editId === "new" ? baseData : {
                    ...baseData,
                    id: editId
                }
            })
            addCollectionForm.resetFields();
            const result: any = handleDisbled();
            setColumns(result);
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit])
    return (
        <Spin spinning={loading}>
            <BaseInfo
                form={addCollectionForm}
                dataSource={
                    {
                        currencyType: currencyEnum.find((item: any) => item.label === "RMB人民币")?.value,
                        ...data
                    }
                } col={2} edit
                columns={columns.map((item: any) => {
                    if (item.dataIndex === 'currencyType') {
                        return ({ ...item, enum: currencyEnum })
                    }
                    if (item.dataIndex === 'payType') {
                        return ({ ...item, enum: payTypeEnum })
                    }
                    if (item.dataIndex === 'payCategory') {
                        return ({ ...item, enum: payCategoryEnum })
                    }
                    return item;
                })}
                onChange={handleBaseInfoChange}
            />
        </Spin>
    )
})