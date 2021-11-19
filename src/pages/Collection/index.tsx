/*
 * @Descripttion: 
 * @version: 
 * @Author: wangxindong
 * @email: wxd93917787@163.com
 * @Date: 2021-11-12 13:56:51
 * @LastEditors: wangxindong
 * @LastEditTime: 2021-11-19 16:52:32
 */
import React, { useState } from "react"
import { Button, Input, DatePicker, Radio } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../common'
import { collectionListHead } from "./CollectionData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
export default function Collection() {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const history = useHistory()
    const [confirmStatus, setConfirmStatus] = useState<number>(0)
    const { loading, data, run } = useRequest<{ [key: string]: any }>((params: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/backMoney`, { ...params })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startLaunchTime) {
            const formatDate = value.startLaunchTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLaunchTime = formatDate[0]
            value.endLaunchTime = formatDate[1]
        }
        return value
    }

    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }

    return <Page
        path="/tower-market/backMoney"
        columns={[
            ...collectionListHead,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 100,
                render: (_: any, record: any) => {
                    if (record.confirmStatus === 0) {
                        return <Button type="link" onClick={() => history.push(`/project/collection/edit/${record.id}`)}>确认信息</Button>
                    }
                    return <Button type="link" onClick={() => history.push(`/project/collection/detail/${record.id}`)}>查看</Button>
                }
            }]}
            refresh={ refresh }
        extraOperation={<>
            <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                <Radio.Button value={0}>未确认</Radio.Button>
                <Radio.Button value={1}>已确认</Radio.Button>
            </Radio.Group>
        </>}
        onFilterSubmit={onFilterSubmit}
        filterValue={{ confirmStatus }}
        searchFormItems={[
            {
                name: 'fuzzyQuery',
                children: <Input placeholder="编号/来款单位名称/来款银行" style={{ width: 300 }} />
            },
            {
                name: 'startLaunchTime',
                label: '来款日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            }
        ]}
    />
}
