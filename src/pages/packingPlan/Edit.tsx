/**
 * @author zyc
 * @copyright © 2022 
 * @description 包装计划-包装计划列表-派工
 */

import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Radio, message } from 'antd'
import { BaseInfo, CommonTable, DetailTitle } from '../common'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { IPackingPlan, IResponseData } from "./PackingPlanList"

interface EditProps {
    detailData: IPackingPlan,
    title: string,
    teamId: string;
}

export interface EditRefProps {
    onSubmit: () => void
}

export default forwardRef(function Edit({ detailData, title, teamId }: EditProps, ref) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [checked, setChecked] = useState<boolean>(false);

    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: IResponseData = await RequestUtil.get(`/tower-production/workshopTeam?size=1000`);
            setChecked(teamId && teamId === '0' ? true : false);
            setSelectedRowKeys([teamId])
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [detailData, title, teamId] })

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
                teamId: checked ? 0 : selectedRowKeys[0],
                planId: detailData.id,
                type: title === '角钢包装班组' ? 1 : title === '连板包装班组' ? 2 : 3
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
            "type": "string"
        },
        {
            "title": "开始包装日期",
            "dataIndex": "startTime",
            "type": "date",
            "format": 'YYYY-MM-DD'
        },
        {
            "title": "要求完成日期",
            "dataIndex": "endTime",
            "type": "date",
            "format": 'YYYY-MM-DD'
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
            "type": "string"
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

    const tableColumns = [
        {
            key: 'teamName',
            title: '班组名称',
            dataIndex: 'teamName'
        },
        {
            key: 'classPresidentName',
            title: '班长',
            dataIndex: 'classPresidentName'
        }
    ]

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit]);

    return <Spin spinning={loading}>
        <DetailTitle title="计划信息" />
        <BaseInfo columns={baseColumns} col={4} dataSource={detailData} />
        <DetailTitle title="重量信息" />
        <BaseInfo columns={columns} col={4} dataSource={detailData} />
        <DetailTitle title="选择班组" />
        <CommonTable
            columns={tableColumns}
            pagination={false}
            dataSource={data}
            rowSelection={{
                selectedRowKeys: selectedRowKeys,
                type: 'radio',
                onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
                    setChecked(false);
                    setSelectedRowKeys(selectedRowKeys)
                    setSelectedRows(selectedRows)
                }
            }} />
        <Radio
            checked={checked}
            onClick={() => {
                if (selectedRowKeys.length <= 0) {
                    message.warning('请选择班组')
                } else {
                    setChecked(!checked);
                }
            }}
            onChange={() => {
                if (!checked) {
                    setSelectedRows([]);
                    setSelectedRowKeys([]);
                }
            }}
            disabled={[!detailData.angleTeamName, !detailData.boardTeamName, !detailData.pipeTeamName].findIndex(res => res === false) === -1}
        >
            无需派工
        </Radio>
        <span>当前未指派任何班组，无法选择，其他班组派工后可选此项</span>
    </Spin>
})