/**
 * b编辑采购计划
 */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Spin, Button, InputNumber } from 'antd';
import { CommonTable, DetailTitle } from '../../common';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil';
import { applicationdetails, ingredientsColumn } from './EditPurchasePlan.json';
import { materialStandardOptions } from "../../../configuration/DictionaryOptions";

interface EditProps {
    id?: string
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
    requiredReturnTime?: string
}
export default forwardRef(function EditPurchasePlan({ id }: EditProps, ref) {
    const [addCollectionForm] = Form.useForm();

    // 塔型
    const [towerType, setTowerType] = useState([]);
    // 配料
    const [ingredients, setIngredients] = useState([]);
    // 移除的id集合
    const [deleIds, setDeleIds] = useState([]);

    const resetFields = () => {
        addCollectionForm.resetFields();
    }

    // 获取编辑计划的数据
    const { run: getUser, data: purchasePlanInfo } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resolve, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/purchasePlanInfo/${id}`);
            setTowerType(result.purchaseTaskTowerVos || []);
            setIngredients(result.createPurchasePlanDetailVOS || []);
            resolve(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取编辑数据
    useEffect(() => {
        getUser(id);
    }, [id && id !== null])

    // 保存的时候
    const { loading, run } = useRequest((postData: { path: string, data: {} }) => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.post(postData.path, postData.data)
            resolve(result);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 删除
    const { run: delItem } = useRequest<{ [key: string]: any }>((delId: string) => new Promise(async (resolve, reject) => {
        try {
            const v = towerType.filter((item: any) => item.id !== delId);
            let ids = v.map<string>((item: any): string => item?.id || '').join(',');
            const result: any = await RequestUtil.get(`/tower-supply/materialPurchasePlan/purchasePlanInfo/detail?purchasePlanId=${id}&ids=${ids}`);
            resolve(result);
            // 删除成功后，把删除的id存储
            const deIdAll: any = [...deleIds, delId]
            setDeleIds(deIdAll);
            // 把页面的数据过滤处理
            setTowerType(v);
            // 更新配料列表
            setIngredients(result);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const v = {
                purchasePlanId: id,
                purchasePlanInfoDetailDTOS: ingredients,
                towerIds: deleIds.map<string>((item: any): string => item || '').join(',')
            }
            await run({ path: "/tower-supply/materialPurchasePlan/purchasePlanInfo/save", data: v })
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit])
    return (
        <Spin spinning={loading}>
            <DetailTitle title="塔型杆塔信息" />
            <CommonTable columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...applicationdetails,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => <Button type="link" onClick={() => delItem(record.id)}>移除</Button>
                }
            ]} dataSource={towerType} />
            <DetailTitle title="配料列表" />
            <CommonTable pagination={false} columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...ingredientsColumn.map((item: any) => {
                    if (item.dataIndex === "materialStandard") {
                        return ({
                            title: item.title,
                            dataIndex: item.dataIndex,
                            width: 50,
                            render: (_: any, record: any): React.ReactNode => {
                                const result = materialStandardOptions?.filter((v: any) => v.id === record.standard);
                                return <span>{result && result.length > 0 ? result[0].name : ""}</span>
                            }
                        })
                    }
                    return item;
                }),
                {
                    title: '计划采购（本次）',
                    dataIndex: 'purchasePlan',
                    width: 120,
                    render: (_: any, record: any, index: number): React.ReactNode => (
                        <InputNumber
                            stringMode={false}
                            min={0}
                            step={1}
                            defaultValue={record.purchasePlan ? record.purchasePlan : 0}
                            precision={0}
                            onBlur={(e) => {
                                const result: any = ingredients;
                                result[index]["purchasePlan"] = Number(e.target.value);
                                setIngredients(result);
                            }}
                        />
                    )
                }
            ]} dataSource={ingredients} />
        </Spin>
    )
})