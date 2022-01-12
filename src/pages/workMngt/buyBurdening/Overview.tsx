import React, { useState } from 'react'
import { Input, DatePicker, Select, Button, Modal, message } from 'antd'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import TaskTower from './TaskTower'
import { SeeList } from "./buyBurdening.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
export default function Overview(): React.ReactNode {
    const params = useParams<{ id: string }>()
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const [chooseId, setChooseId] = useState<string>("")
    const [filterValue, setFilterValue] = useState({ purchaseTaskId: params.id });
    const onFilterSubmit = (value: any) => {
        if (value.startBatcheStatusUpdateTime) {
            const formatDate = value.startBatcheStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBatcheStatusUpdateTime = formatDate[0] + ' 00:00:00';
            value.endBatcheStatusUpdateTime = formatDate[1] + ' 23:59:59';
        }
        setFilterValue(Object.assign({}, { ...value, purchaseTaskId: params.id }))
        return ({ ...value, purchaseTaskId: params.id })
    }

    const { run: createComponent } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/initData/materialWithdrawal?purchaseTaskTowerId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


    const handleCreateComponent = (id: string) => {
        Modal.confirm({
            title: "生成提料数据",
            content: "确定要生成提料数据吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await createComponent(id))
                    message.success("生成提料数据...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    return <>
        <Modal title="配料方案" visible={visible} width={1011}
            footer={<Button type="primary" onClick={() => setVisible(false)}>确认</Button>} onCancel={() => setVisible(false)}>
            <TaskTower id={chooseId} />
        </Modal>
        <Page
            path="/tower-supply/purchaseTaskTower"
            exportPath={`/tower-supply/purchaseTaskTower`}
            columns={[
                ...SeeList,
                {
                    title: '操作',
                    width: 250,
                    dataIndex: 'operation',
                    render: (_: any, records: any) => (<>
                        <Button type="link" disabled={![1, 3].includes(records.batcheTaskStatus)} >
                            <Link to={`/ingredients/buyBurdening/component/${records.id}/${records.batcheTaskStatus}`}>明细</Link>
                        </Button>
                        <Button type="link" style={{ marginLeft: 12 }} disabled={![3].includes(records.batcheTaskStatus)}
                            onClick={() => {
                                setChooseId(records.id)
                                setVisible(true)
                            }} >配料方案</Button>
                        {/* <Button type="link" onClick={() => handleCreateComponent(records.id)
                        } >临时造数据</Button> */}
                    </>)
                }
            ]}
            extraOperation={<>
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'startBatcheStatusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'batcheTaskStatus',
                    label: '塔型配料状态',
                    children: <Select style={{ width: "100px" }} defaultValue="请选择">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">待完成</Select.Option>
                        <Select.Option value="2">待接收</Select.Option>
                        <Select.Option value="3">已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="塔型/方案编号" maxLength={200} />
                }
            ]}
        />
    </>
}
