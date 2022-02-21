import React, { useState } from "react"
import { Button, Input, Select, DatePicker, Modal, message } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { IntgSelect, Page } from '../../common'
import { SeeList } from "./differentListData.json"
import Edit from "./Edit"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

export default function Overview() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [generateIds, setGenerateIds] = useState<string[]>([])
    const [filterValue, setFilterValue] = useState({ diffId: params.id })
    const [visible, setVisible] = useState<boolean>(false)

    const { run: submitRun } = useRequest<boolean>(() => new Promise(async (resole, reject) => {
        try {
            await RequestUtil.put(`/tower-supply/componentDiff?diffId=${params.id}`)
            message.success("提交完成...")
            resole(true)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const { run: componentDiffRun } = useRequest<boolean>((data: any) => new Promise(async (resole, reject) => {
        try {
            await RequestUtil.post(`/tower-supply/initData/componentDiff`, { componentDiffId: params.id, ...data })
            message.success("提交完成...")
            resole(true)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })


    const onFilterSubmit = (value: any) => {
        if (value.startLaunchTime) {
            const formatDate = value.startLaunchTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLaunchTime = formatDate[0]
            value.endLaunchTime = formatDate[1]
        }
        if (value.materialLeader) {
            value.materialLeaderDept = value.materialLeader.first
            value.materialLeader = value.materialLeader.second
        }
        return value
    }

    const handleComponentDiff = () => {
        Modal.confirm({
            title: "提交/完成",
            content: "确认提交/完成？",
            okText: "提交/完成",
            onOk: () => submitRun()
        })
    }

    return <>
        <Modal title="缺料申请" visible={visible} width={1011} onCancel={() => setVisible(false)}>
            <Edit />
        </Modal>
        <Page
            path={`/tower-supply/componentDiff/diffDetail`}
            exportPath={`/tower-supply/componentDiff/diffDetail`}
            columns={[{ title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> }, ...SeeList]}
            extraOperation={<>
                <Button type="primary" ghost onClick={handleComponentDiff}>处理完成</Button>
                <Button type="primary" ghost onClick={async () => {
                    // setVisible(true)
                    if (generateIds.length <= 0) {
                        message.warning("请选择构件明细...")
                    } else {
                        await componentDiffRun({
                            componentDiffDetailIds: generateIds
                        })
                        message.warning("成功生成缺料记录...")
                        history.go(0)
                    }
                }}>缺料申请</Button>
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </>}
            filterValue={{ ...filterValue, diffId: params.id }}
            onFilterSubmit={onFilterSubmit}
            tableProps={{
                rowSelection: {
                    type: "checkbox",
                    selectedRowKeys: generateIds,
                    onChange: (selectedRowKeys: any[]) => {
                        setGenerateIds(selectedRowKeys)
                    },
                    getCheckboxProps: (record: any) => {
                        return ({
                            disabled: ![1].includes(record.diffComponentStatus)
                        })
                    }
                }
            }}
            searchFormItems={[
                {
                    name: 'diffComponentStatus',
                    label: '状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">未申请</Select.Option>
                        <Select.Option value="2">已申请</Select.Option>
                    </Select>
                },
                {
                    name: 'materialLeader',
                    label: '提料人',
                    children: <IntgSelect width={400} />
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="材质/规格/长度" style={{ width: 300 }} />
                }
            ]}
        />
    </>
}