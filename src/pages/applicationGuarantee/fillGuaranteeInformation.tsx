/**
 * 填写保函信息
 */
 import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
 import { Form, message, Spin } from 'antd';
 import { BaseInfo,  Attachment, AttachmentRef } from '../common';
 import useRequest from '@ahooksjs/use-request'
 import RequestUtil from '../../utils/RequestUtil';
 import { baseColums } from './applicationColunm.json';
 import { FileProps } from '../common/Attachment';
 import { EditPropsGurance } from './application';
import moment from 'moment';
 
 export default forwardRef(function FillGuaranteeInformation({id, guaranteePrice, effectiveTime}: EditPropsGurance, ref) {
    const [addCollectionForm] = Form.useForm();
    const [attachVosData, setAttachVosData] = useState<any[]>([])
    const fillGuarantee = useRef<AttachmentRef>();
    console.log(effectiveTime, "effectiveTime", moment("2022-05-26").diff(moment(moment("2022-05-25").format("YYYY-MM-DD")), 'days'))
    if (guaranteePrice) {
        addCollectionForm.setFieldsValue({
            guaranteePrice
        })
    }
    if (effectiveTime) {
        addCollectionForm.setFieldsValue({
            effectiveTime
        })
    }
    // 关闭
    const resetFields = () => {
        addCollectionForm.resetFields();
        setAttachVosData([]);
    }

    // 提交
    const { loading, run } = useRequest((postData: { path: string, data: {} }) => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.put(postData.path, postData.data)
            resolve(result);
            addCollectionForm.resetFields();
            setAttachVosData([]);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await addCollectionForm.validateFields();
            const fileIds = [];
            if (attachVosData.length > 0) {
                for (let i = 0; i < attachVosData.length; i += 1) {
                    fileIds.push(attachVosData[i].id);
                }
            }
            await run({path: "/tower-finance/guarantee", data: {...baseData, fileIds, id}})
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit])

    const handGuaranteChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        console.log(fields, "====", allFields)
        if (fields.bondProportion) {
            addCollectionForm.setFieldsValue({
                bondProportionMoney: ((allFields.guaranteePrice * fields.bondProportion) / 100).toFixed(2),
                bondServiceCharge: ((allFields.guaranteePrice * fields.bondProportion) / 100).toFixed(2) + (allFields.serviceCharge || 0)
            })
            // 出具日期存在
            if (allFields.issuanceTime) {
                const time = moment(effectiveTime).diff(moment(moment(allFields.issuanceTime).format("YYYY-MM-DD")), 'days');
                console.log(time, "time")
                if (time < 0) {
                    message.error("出具日期不能大于保函有效截止日期！");
                    addCollectionForm.setFieldsValue({
                        issuanceTime: ""
                    })
                    return false;
                }
                if (allFields.seasonProportionMoney) {
                    const result = +((+time / 90) * (+allFields.seasonProportionMoney)).toFixed(2);
                    addCollectionForm.setFieldsValue({
                        serviceCharge: result,
                        bondServiceCharge: (result + (+allFields.bondProportionMoney || 0)).toFixed(2)
                    })
                }
            } 
        }
        if (fields.seasonProportion) {
            // 手续费占比
            addCollectionForm.setFieldsValue({
                seasonProportionMoney: +((allFields.guaranteePrice * fields.seasonProportion) / 100).toFixed(2) >= 500 ? ((allFields.guaranteePrice * fields.seasonProportion) / 100).toFixed(2) : 500
            })
            // 出具日期存在
            if (allFields.issuanceTime) {
                const time = moment(effectiveTime).diff(moment(moment(allFields.issuanceTime).format("YYYY-MM-DD")), 'days');
                if (time < 0) {
                    message.error("出具日期不能大于保函有效截止日期！");
                    addCollectionForm.setFieldsValue({
                        issuanceTime: ""
                    })
                    return false;
                }
                const v = +((allFields.guaranteePrice * fields.seasonProportion) / 100).toFixed(2) >= 500 ? ((allFields.guaranteePrice * fields.seasonProportion) / 100).toFixed(2) : 500;
                const result = +((+time / 90) * (+v)).toFixed(2);
                addCollectionForm.setFieldsValue({
                    serviceCharge: result,
                    bondServiceCharge: (result + (+allFields.bondProportionMoney || 0)).toFixed(2)
                })
            }
        }
        if (fields.issuanceTime) {
            // 出具日期
            const time = moment(effectiveTime).diff(moment(moment(fields.issuanceTime).format("YYYY-MM-DD")), 'days');
            if (time < 0) {
                message.error("出具日期不能大于保函有效截止日期！");
                addCollectionForm.setFieldsValue({
                    issuanceTime: ""
                })
                return false;
            }
            if (allFields.seasonProportionMoney) {
                const result = +((time / 90) * allFields.seasonProportionMoney).toFixed(2);
                addCollectionForm.setFieldsValue({
                    serviceCharge: result,
                    bondServiceCharge: (result + (+allFields.bondProportionMoney || 0)).toFixed(2)
                })
            }
            
        }
    }

    return (
        <Spin spinning={loading}>
            <BaseInfo
                onChange={handGuaranteChange}
                form={addCollectionForm}
                dataSource={{}}
                col={ 2 }
                edit
                columns={ baseColums}
             />
            <Attachment
                dataSource={ attachVosData }
                onDoneChange={
                    (attachs: FileProps[]) => {
                        setAttachVosData([
                            ...attachVosData,
                            ...attachs
                        ]);
                    }
                }
                ref={fillGuarantee}
                edit
            />
        </Spin>
    )
 })