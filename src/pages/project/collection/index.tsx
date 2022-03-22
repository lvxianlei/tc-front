import React, { useState } from "react"
import { Button, Input, DatePicker, Radio, Select } from 'antd'
import { useHistory } from 'react-router-dom'
import { SearchTable as Page } from '../../common'
import { collectionListHead } from "./collection.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { collectionTypeeOptions } from '../../../configuration/DictionaryOptions';
export default function Collection() {
    const [refresh, setRefresh] = useState<boolean>(false);
    const history = useHistory()
    const [confirmStatus, setConfirmStatus] = useState<number>(0)
    const [filterValue, setFilterValue] = useState<any>({ confirmStatus });
    const { loading, data, run } = useRequest<{ [key: string]: any }>((params: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/backMoney`, { ...params })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startRefundTime = formatDate[0]
            value.endRefundTime = formatDate[1]
        }
        value.confirmStatus = confirmStatus;
        setFilterValue(value);
        return value
    }

    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setFilterValue({ confirmStatus: event.target.value })
        setRefresh(!refresh);
    }

    return <Page
        path="/tower-market/backMoney"
        exportPath={"/tower-market/backMoney"}
        columns={[
            ...(collectionListHead as any),
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
        refresh={refresh}
        extraOperation={<>
            <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                <Radio.Button value={0}>未确认</Radio.Button>
                <Radio.Button value={1}>已确认</Radio.Button>
            </Radio.Group>
        </>}
        onFilterSubmit={onFilterSubmit}
        filterValue={filterValue}
        searchFormItems={[
            {
                name: 'startRefundTime',
                label: '来款日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'returnType',
                label: '回款类型',
                children: (
                    <Select placeholder="请选择回款类型" style={{ width: "140px" }}>
                        {collectionTypeeOptions && collectionTypeeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                )
            },
            {
                name: 'fuzzyQuery',
                label: "模糊查询项",
                children: <Input placeholder="编号/来款单位名称" style={{ width: 300 }} />
            }
        ]}
    />
}
