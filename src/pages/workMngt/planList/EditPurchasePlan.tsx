/**
 * b编辑采购计划
 */
 import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
 import { Form, Spin, Button, Input } from 'antd';
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
    const resetFields = () => {
        addCollectionForm.resetFields();
    }

    const { loading, run } = useRequest((postData: { path: string, data: {} }) => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.put(postData.path, postData.data)
            resolve(result);
            addCollectionForm.resetFields();
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await addCollectionForm.validateFields();
            // console.log(baseData, 'baseData');
            // console.log(attachVosData, "附件");
            // const fileIds = [];
            // if (attachVosData.length > 0) {
            //     for (let i = 0; i < attachVosData.length; i += 1) {
            //         fileIds.push(attachVosData[i].id);
            //     }
            // }
            // await run({path: "/tower-finance/guarantee", data: {...baseData, fileIds, id}})
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
                    render: (_: any, record: any) => {
                        return (
                            <>
                                <Button type="link">移除</Button>
                            </>
                        )
                    }
                }
            ]} dataSource={[]} />
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
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => <Input placeholder="请输入" />
                }
            ]} dataSource={[]} />
        </Spin>
    )
 })