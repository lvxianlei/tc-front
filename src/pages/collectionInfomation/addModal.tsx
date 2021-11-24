/**
 * 新增回款信息
 */
import React, { useState } from 'react';
import { Modal, Form, Button, ModalFuncProps } from 'antd';
import { BaseInfo } from '../common';
import { baseColums } from './collectionColumn.json';
import ApplicationContext from "../../configuration/ApplicationContext"

export default function AddModal(props: ModalFuncProps): JSX.Element {
    const [ addCollectionForm ] = Form.useForm();
    const [ columns, setColumns ] = useState(baseColums);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ status, setStatus ] = useState<boolean>(true);

    // 币种
    const currencyEnum = (ApplicationContext.get().dictionaryOption as any)["111"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    // 来款方式
    const payTypeEnum = (ApplicationContext.get().dictionaryOption as any)["113"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    // 来款性质
    const payCategoryEnum = (ApplicationContext.get().dictionaryOption as any)["114"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    // 提交
    const handleSure = async () => {
        const postData = await addCollectionForm.validateFields();
        console.log(postData, 'post')
        setLoading(true);
        setStatus(true);
        props.onOk && props.onOk({data: 10}, () => {
            addCollectionForm.resetFields();
            setLoading(false);
            const result: any = handleDisbled();
            setColumns(result);
        });
    }

    // 取消
    const handleCancle = () => {
        addCollectionForm.resetFields();
        const result: any = handleDisbled();
        setColumns(result);
        setStatus(true);
        props.onCancel && props.onCancel();
    }

    // 定义取消以及确认的时候禁用取消
    const handleDisbled = () => {
        const result:any = [];
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

    const processingNumber = (arg: any) => {
        arg = arg.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        arg = arg.replace(/^\./g, ""); // 验证第一个字符是数字而不是
        arg = arg.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
        arg = arg.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        // arg = arg.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3'); // 只能输入一个小数
        arg = arg.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
        return arg
    }

    const handleBaseInfoChange = (fields: any) => {
        const standard = addCollectionForm.getFieldValue("currencyType"),
            results = currencyEnum.filter((items: any) => items.value === standard);
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
            const exchangeRate = addCollectionForm.getFieldValue("exchangeRate") ? processingNumber(addCollectionForm.getFieldValue("exchangeRate") + "") : 0,
            abroadMoney = addCollectionForm.getFieldValue("abroadMoney") ? processingNumber(addCollectionForm.getFieldValue("abroadMoney") + "") : 0,
            payMoney = processingNumber(exchangeRate * abroadMoney + "");
            addCollectionForm.setFieldsValue({payMoney: payMoney * 1 === 0 ? "" : payMoney, exchangeRate: exchangeRate * 1 === 0 ? "" : exchangeRate, abroadMoney: abroadMoney * 1 === 0 ? "" : abroadMoney})
        } else {
            const payMoney = addCollectionForm.getFieldValue("payMoney") ? processingNumber(addCollectionForm.getFieldValue("payMoney") + "") : 0;
            addCollectionForm.setFieldsValue({payMoney: payMoney * 1 === 0 ? "" : payMoney})
        }
        setColumns(result);
        setStatus(false);
    }

    return (
        <Modal
          title={'新增回款信息'}
          visible={props.visible}
          onOk={handleSure}
          onCancel={handleCancle}
          maskClosable={false}
          width={800}
          footer={[
            <Button key="submit" type="primary" onClick={handleSure} loading={loading}>
              提交
            </Button>,
            <Button key="back" onClick={handleCancle}>
              取消
            </Button>
          ]}
        >
            <BaseInfo form={addCollectionForm} dataSource={
                currencyEnum.map((item: any) => {
                    if (item.label === "RMB人民币" && status) {
                        addCollectionForm.setFieldsValue({
                            currencyType: item.value
                        })
                    }
                })
            } col={ 2 } edit
                columns={ columns.map((item: any) => {
                    if (item.dataIndex === 'currencyType') {
                        return ({...item, enum: currencyEnum})
                    }
                    if (item.dataIndex === 'payType') {
                        return ({...item, enum: payTypeEnum})
                    }
                    if (item.dataIndex === 'payCategory') {
                        return ({...item, enum: payCategoryEnum})
                    }
                    return item;
                })}
                onChange={handleBaseInfoChange}
            />
        </Modal>
    )
}