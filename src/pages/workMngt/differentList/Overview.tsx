import React, {useState} from "react"
import {Button, Input, Select, DatePicker, Modal, message} from 'antd'
import {useHistory, useParams} from 'react-router-dom'
import {Page} from '../../common'
import {SeeList} from "./differentListData.json"
import Edit from "./Edit"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

export default function Overview() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [filterValue, setFilterValue] = useState({diffId: params.id})
    const [visible, setVisible] = useState<boolean>(false)

    const {run: submitRun} = useRequest<boolean>(() => new Promise(async (resole, reject) => {
        try {
            await RequestUtil.put(`/tower-supply/componentDiff?diffId=${params.id}`)
            message.success("提交完成...")
            resole(true)
        } catch (error) {
            reject(false)
        }
    }), {manual: true})


    const onFilterSubmit = (value: any) => {
        if (value.startLaunchTime) {
            const formatDate = value.startLaunchTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLaunchTime = formatDate[0]
            value.endLaunchTime = formatDate[1]
        }
        setFilterValue({...filterValue, ...value})
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
            <Edit/>
        </Modal>
        <Page
            path={`/tower-supply/componentDiff/diffDetail`}
            columns={SeeList}
            extraOperation={<>
                <Button type="primary" ghost>导出</Button>
                <Button type="primary" ghost onClick={handleComponentDiff}>处理完成</Button>
                <Button type="primary" ghost onClick={() => setVisible(true)}>缺料申请</Button>
                <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
            </>}
            filterValue={{...filterValue, diffId: params.id}}
            onFilterSubmit={onFilterSubmit}
            tableProps={{
                rowSelection: {
                    type: "checkbox"
                }
            }}
            searchFormItems={[
                {
                    name: 'isOpen',
                    label: '状态',
                    children: <Select style={{width: 200}}>
                        <Select.Option value="1">未申请</Select.Option>
                        <Select.Option value="2">已申请</Select.Option>
                    </Select>
                },
                {
                    name: 'materialLeader',
                    label: '提料人',
                    children: <Select style={{width: 200}}>
                        <Select.Option value="1">待审批</Select.Option>
                        <Select.Option value="2">已拒绝</Select.Option>
                        <Select.Option value="3">已撤回</Select.Option>
                        <Select.Option value="4">已通过</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    children: <Input placeholder="材质/规格/长度" style={{width: 300}}/>
                },

            ]}
        />
    </>
}