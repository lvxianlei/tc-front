/**
 * @author zyc
 * @copyright © 2022 
 * @description 包装计划-包装计划列表-派工
 */


import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Radio } from 'antd'
import { BaseInfo, CommonTable, DetailTitle } from '../common'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { IPackingPlan } from "./PackingPlanList"

interface EditProps {
    type?: "new" | "edit",
    detailData: IPackingPlan,
    title: string
}

export interface EditRefProps {
    onSubmit: () => void
}

export default forwardRef(function Edit({ type, detailData, title }: EditProps, ref) {
    const [selectedRowKeys,setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows,setSelectedRows] = useState([]);
    const [checked, setChecked] = useState<boolean>(false);

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(``);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [detailData] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-production/packageWorkshop/assign`, { ...postData })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
                await saveRun({
                    teamId: selectedRowKeys[0],
                    planId: detailData.id,
                    type: title === '角钢包装班组' ? 1: title === '连板包装班组' ? 2 :3
                })
                resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const baseColumns = [
        {
            "title": "电压等级",
            "dataIndex": "voltageGradeName",
            "type": "string"
        },
        {
            "title": "基数",
            "dataIndex": "number",
            "type": "select"
        },
        {
            "title": "开始包装日期",
            "dataIndex": "startTime",
            "type": "date"
        },
        {
            "title": "要求完成日期",
            "dataIndex": "endTime",
            "type": "date"
        }
    ]

    const columns = [
        {
            "title": "角钢重量（KG）",
            "dataIndex": "angleWeight",
            "type": "string"
        },
        {
            "title": "连板重量（KG）",
            "dataIndex": "boardWeight",
            "type": "select"
        },
        {
            "title": "钢管重量（KG）",
            "dataIndex": "pipeWeight",
            "type": "string"
        },
        {
            "title": "总重量（KG）",
            "dataIndex": "weight",
            "type": "string"
        }
    ]

    const tableColumns= [
        {
            key: 'name',
            title: '班组名称',
            dataIndex: 'name'
        },
        {
            key: 'recordType',
            title: '班长',
            dataIndex: 'recordType'
        }
    ]

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit]);

    return <Spin spinning={loading}>
        <DetailTitle title="计划信息"/>
        <BaseInfo columns={baseColumns} col={4} dataSource={detailData} />
        <DetailTitle title="重量信息"/>
        <BaseInfo columns={columns} col={4} dataSource={detailData} />
        <DetailTitle title="选择班组"/>
        <CommonTable 
        columns={tableColumns} 
        pagination={false} 
        dataSource={[]}
        rowSelection={{
                            selectedRowKeys: selectedRowKeys,
                            type:'radio',
                            onChange: (selectedRowKeys: React.Key[], selectedRows:any)=>{
                                
                                setChecked(false);
                                setSelectedRowKeys(selectedRowKeys)
                                setSelectedRows(selectedRows)
                            }
                        }}/>
                        <Radio checked={checked} onClick={() => {
                            setChecked(!checked);
                        }}
                        onChange={() => {

                            if(!checked) {
                                setSelectedRows([]);
                                setSelectedRowKeys([]);
                            }
                        }}>无需派工</Radio>
    </Spin>
})