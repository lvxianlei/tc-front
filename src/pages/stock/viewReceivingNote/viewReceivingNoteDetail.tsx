import React, { useState } from 'react'
import { Button, TableColumnProps, Select, DatePicker, Input, Modal, Descriptions } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { Page } from '../../common'
import { viewReceivingNoteDetail } from "./viewReceivingNote.json"
//状态
const projectType = [
    {
        value: 0,
        label: "待收货"
    },
    {
        value: 1,
        label: "已收货"
    },
    {
        value: 2,
        label: "已拒绝"
    }
]

export default function ViewReceivingNoteDetail(): React.ReactNode {
    // const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
    const { RangePicker } = DatePicker;
    const history = useHistory();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            fixed: "left",
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        ...viewReceivingNoteDetail,
        {
            title: "操作",
            dataIndex: "opration",
            fixed: "right",
            render: (_: any, records: any) => <>
                <Button type="link" onClick={() => { }}>质保单</Button>
                <Button type="link" onClick={() => { }}>质检单</Button>
            </>
        }
    ]


    const onFilterSubmit = (value: any) => {
        if (value.startBidBuyEndTime) {
            const formatDate = value.startBidBuyEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBidBuyEndTime = formatDate[0]
            value.endBidBuyEndTime = formatDate[1]
        }

        if (value.startBiddingEndTime) {
            const formatDate = value.startBiddingEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBiddingEndTime = formatDate[0]
            value.endBiddingEndTime = formatDate[1]
        }
        setFilterValue(value)
        return value
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const buttons: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel() }}>关闭</Button>
            <Button>保存</Button>
        </div>
    ]
    return (
        <div>
            <Page
                // path="/tower-market/projectInfo"
                path=""
                columns={columns}
                filterValue={filterValue}
                extraOperation={<div><Link to="/project/management/new"><Button type="primary">导出</Button></Link><span style={{ fontSize: "18px", color: "orange", }}>已收货：重量(支)合计：2209.090 价税合计(元)合计：51425.00 待收货：重量(支)合计：2209.900 价税合计(元)合计：51425.00</span><Button>申请质检</Button><Button onClick={() => { history.goBack() }}>返回上一级</Button></div>}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'updateTime',
                        label: '最新状态变更时间',
                        children: <RangePicker />
                    },
                    {
                        name: 'rawMaterialType',
                        label: '采购状态',
                        children: <Select style={{ width: "150px" }}>
                            {projectType.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    },
                    {
                        name: 'inquire',
                        label: '查询',
                        children: <Input style={{ width: "113px" }} placeholder="名称/材质/规格" />
                    },
                ]}
            />
            <Modal width="700px" title="质保单" visible={isModalVisible} footer={buttons} onCancel={handleCancel}>
                <Descriptions title="质保单" column={1} bordered>
                    <Descriptions.Item label="质保单质保单质保单质保单质保单"><span style={{color:"orange"}}>下载</span><span style={{color:"orange"}}>删除</span><span style={{color:"orange"}}>查看</span></Descriptions.Item>
                    <Descriptions.Item label="质保单质保单质保单质保单质保单"><span style={{color:"orange"}}>下载</span><span style={{color:"orange"}}>删除</span><span style={{color:"orange"}}>查看</span></Descriptions.Item>
                </Descriptions>
            </Modal>
            <Button onClick={() => { setIsModalVisible(true) }}>质保单</Button>
            <Button onClick={() => { }}>质检单</Button>
        </div>
    )
}