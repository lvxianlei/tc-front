/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-放样塔型绩效汇总-绩效条目设置
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Button, Form } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { setColumns } from "./loftingpPerformanceSummary.json"

interface modalProps {

}

export default forwardRef(function CoefficientPerformance({ }: modalProps, ref) {
   const [itemData, setItemData] = useState<any[]>();

    const { loading, data } = useRequest<any[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
       const result: any = await RequestUtil.get(`/tower-science/performance`)
       setItemData(result)
        resole([]);
    }), {})


    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-science/performance/config`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            await saveRun(value)
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    const [form] = Form.useForm();

    return <DetailContent key='CoefficientPerformance'>
        <CommonTable
         dataSource={itemData || []} 
         columns={[
           ...setColumns,
           {
               title: '操作',
               dataIndex: 'operation',
               fixed: "right",
               render: (_: undefined, record: any, index: number): React.ReactNode => (
                   <Button type="link" onClick={() => {
                       const newData = itemData?.map((res: any, ind: number) => {
                           if(ind === index) {
                               return {
                                   ...res,
                                   isEnable: res?.isEnable === 0 ? 1 : 0
                               }
                           }else {
                               return res
                           }
                       })
                       console.log(newData)
                       setItemData(newData)
                   }}>{ record?.isEnable === 1 ? '启用' : '停用'}</Button>
               )
           }
           ]}
           pagination={false}/>
    </DetailContent>
})