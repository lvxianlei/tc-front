import React, { useState } from 'react'
import { Button, TableColumnProps, Select, DatePicker, Input, Descriptions, Modal } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { CommonTable, DetailContent, DetailTitle, Page } from '../../common'
import { viewReceivingNote, operatingInformation, ApprovalInformation, operatingInformation1 } from "./viewReceivingNote.json"
//状态
const projectType = [
    {
        value: 0,
        label: "待收票"
    },
    {
        value: 1,
        label: "已收票"
    },
    {
        value: 2,
        label: "待付款"
    },
    {
        value: 3,
        label: "已付款"
    }
]

export default function ViewReceivingNote(): React.ReactNode {
    // const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
    const { RangePicker } = DatePicker;
    const [columnsData, setColumnsData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);

    const history = useHistory();

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
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };

    const buttons: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel() }}>关闭</Button>
        </div>
    ]
    const buttons1: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel1() }}>关闭</Button>
            <Button>保存</Button>
        </div>
    ]
    return (
        <div>
            <Page
                // path="/tower-market/projectInfo"
                path=""
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...viewReceivingNote,
                    {
                        title: "操作",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            <Button onClick={() => history.push(`/stock/viewReceivingNote/viewReceivingNoteDetail`)}>HT202101-010</Button>
                            <Button onClick={() => { }}>QK-20210924-001</Button>
                            <Button>PJ-20210924-001</Button>
                        </>
                    }
                ]}
                filterValue={filterValue}
                extraOperation={<div><Link to="/project/management/new"><Button type="primary">导出</Button></Link><span style={{ fontSize: "20px", color: "orange", marginLeft: "40px" }}>累计欠票金额：300,000,00      累计欠费金额：200,000,00</span></div>}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'updateTime',
                        label: '最新状态变更时间',
                        children: <RangePicker />
                    },
                    {
                        name: 'rawMaterialType',
                        label: '状态',
                        children: <Select style={{ width: "150px" }}>
                            {projectType.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    },
                    {
                        name: 'inquire',
                        label: '查询',
                        children: <Input style={{ width: "113px" }} placeholder="供应商/收货单编号/关联申请编号/关联票据编号" />
                    },
                ]}
            />
            <Modal width="700px" title="详情" visible={isModalVisible} footer={buttons} onCancel={handleCancel} >
                <Descriptions title="申请信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                    <Descriptions.Item label="所属供应商">1</Descriptions.Item>
                    <Descriptions.Item label="请款金额">2</Descriptions.Item>
                    <Descriptions.Item label="关联票据">3</Descriptions.Item>
                    <Descriptions.Item label="关联收货单">4</Descriptions.Item>
                    <Descriptions.Item label="开户银行">5</Descriptions.Item>
                    <Descriptions.Item label="银行账号">6</Descriptions.Item>
                    <Descriptions.Item label="付款方式">7</Descriptions.Item>
                    <Descriptions.Item label="请款类别">8</Descriptions.Item>
                </Descriptions>
                <DetailContent>
                    <DetailTitle title="审批信息" />
                    <CommonTable
                        columns={[
                            {
                                key: 'index',
                                title: '序号',
                                dataIndex: 'index',
                                width: 50,
                                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                            },
                            ...ApprovalInformation,
                        ]}
                        dataSource={columnsData}
                    />
                </DetailContent>
                <DetailContent>
                    <DetailTitle title="操作信息" />
                    <CommonTable
                        columns={[
                            {
                                key: 'index',
                                title: '序号',
                                dataIndex: 'index',
                                width: 50,
                                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                            },
                            ...operatingInformation,
                        ]}
                        dataSource={columnsData}
                    />
                </DetailContent>
            </Modal>
            <Modal width="700px" title="创建" visible={isModalVisible1} footer={buttons1} onCancel={handleCancel1} >
                <Descriptions title="票据信息" bordered column={2} labelStyle={{ textAlign: 'right' }}>
                    <Descriptions.Item label="票据编号">1</Descriptions.Item>
                    <Descriptions.Item label="所属供应商">2</Descriptions.Item>
                    <Descriptions.Item label="开票单位">3</Descriptions.Item>
                    <Descriptions.Item label="发票号">4</Descriptions.Item>
                    <Descriptions.Item label="发票类型">5</Descriptions.Item>
                    <Descriptions.Item label="发票金额">6</Descriptions.Item>
                    <Descriptions.Item label="收货单">7</Descriptions.Item>
                    <Descriptions.Item label="收票日">8</Descriptions.Item>
                </Descriptions>
                <Descriptions title="相关附件" bordered column={1} labelStyle={{ textAlign: 'center' }}>
                    <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称">
                        <span style={{ color: "#FF8C00" }}>查看</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称">
                        <span style={{ color: "#FF8C00" }}>查看</span>
                    </Descriptions.Item>
                </Descriptions>
                <DetailContent>
                    <DetailTitle title="操作信息" />
                    <CommonTable
                        columns={[
                            {
                                key: 'index',
                                title: '序号',
                                dataIndex: 'index',
                                width: 50,
                                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                            },
                            ...operatingInformation1,
                        ]}
                        dataSource={columnsData}
                    />
                </DetailContent>
            </Modal>
            <Button onClick={() => history.push(`/stock/viewReceivingNote/viewReceivingNoteDetail`)}>HT202101-010</Button>
            <Button onClick={() => { setIsModalVisible(true) }}>QK-20210924-001</Button>
            <Button onClick={() => { setIsModalVisible1(true) }}>PJ-20210924-001</Button>
        </div>
    )
}