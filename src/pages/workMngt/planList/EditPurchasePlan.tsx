/**
 * b编辑采购计划
 */
 import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
 import { Form, Spin, Button, InputNumber } from 'antd';
 import { CommonTable, DetailTitle } from '../../common';
 import useRequest from '@ahooksjs/use-request'
 import RequestUtil from '../../../utils/RequestUtil';
 import { applicationdetails, ingredientsColumn } from './EditPurchasePlan.json';

 interface EditProps {
    id?: string
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
    requiredReturnTime?: string
}
 export default forwardRef(function EditPurchasePlan({id}: EditProps, ref) {
    const [addCollectionForm] = Form.useForm();

    // 塔型
    const [towerType, setTowerType] = useState([]);
    // 配料
    const [ingredients, setIngredients] = useState([]);

    const resetFields = () => {
        addCollectionForm.resetFields();
    }

    // 获取编辑计划的数据
    const { run: getUser, data: purchasePlanInfo } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/purchasePlanInfo/${id}`);
            setTowerType(result.purchaseTaskTowerVos || []);
            setIngredients(result.createPurchasePlanDetailVOS || []);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取编辑数据
    useEffect(() => {
        getUser(id);
    }, [id && id !== null])

    const { loading, run } = useRequest((postData: { path: string, data: {} }) => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.post(postData.path, postData.data)
            resolve(result);
            addCollectionForm.resetFields();
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            console.log(ingredients, "提交的数据")
            // const baseData = await addCollectionForm.validateFields();
            // console.log(baseData, 'baseData');
            // console.log(attachVosData, "附件");
            // const fileIds = [];
            // if (attachVosData.length > 0) {
            //     for (let i = 0; i < attachVosData.length; i += 1) {
            //         fileIds.push(attachVosData[i].id);
            //     }
            // }
            const v = {
                purchasePlanId: id,
                purchasePlanInfoDetailDTOS: ingredients,
                towerIds: ""
            }
            await run({path: "/tower-supply/materialPurchasePlan/purchasePlanInfo/save", data: v})
            // resolve(true)
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
                    render: (_: any, record: any) => {
                        return (
                            <>
                                <Button type="link">移除</Button>
                            </>
                        )
                    }
                }
            ]} dataSource={towerType } />
            <DetailTitle title="配料列表" />
            <CommonTable columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...ingredientsColumn,
                {
                    title: '计划采购（本次）',
                    dataIndex: 'purchasePlan',
                    width: 120,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (
                        <InputNumber 
                            stringMode={ false }
                            min="1"
                            max="10"
                            step="1"
                            precision={ 0 }
                            onBlur={(e) => {
                                const result: any = ingredients;
                                result[index]["purchasePlan"] = e.target.value;
                                console.log(e.target.value, 'ee')
                                setIngredients(result);
                            }}
                        />
                    )
                }
            ]} dataSource={ingredients} />
        </Spin>
    )
 })