/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-放样塔型绩效汇总-绩效条目设置
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Button, message } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { setColumns } from "./loftingpPerformanceSummary.json"

interface modalProps {

}

export default forwardRef(function CoefficientPerformance({ }: modalProps, ref) {
    const [itemData, setItemData] = useState<any[]>();

    const { loading, data, run } = useRequest<any[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
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
            console.log(itemData)
            await saveRun(itemData)
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit]);

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
                            RequestUtil.post(`/tower-science/performance`, {
                                id: record?.id,
                                isEnable: record?.isEnable === 0 ? 1 : 0
                            }).then(res => {
                                message.success('状态变更成功！');
                                run();
                            })
                        }}>{record?.isEnable === 1 ? '启用' : '停用'}</Button>
                    )
                }
            ]}
            pagination={false} />
    </DetailContent>
})