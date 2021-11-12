//收货单看板
import React, { useEffect, useState } from 'react'
import { Button, TableColumnProps, Select, DatePicker, Input, Descriptions, Modal } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { Attachment, CommonTable, DetailContent, DetailTitle, Page } from '../../common'
import { operatingInformation, ApprovalInformation, operatingInformation1, aa } from "./viewReceivingNote.json"
import RequestUtil from '../../../utils/RequestUtil'
var moment = require('moment');
moment().format();
//状态
const projectType = [
    {
        value: 0,
        label: "全部"
    },
    {
        value: 1,
        label: "待收票"
    },
    {
        value: 2,
        label: "已收票"
    },
    {
        value: 3,
        label: "待付款"
    },
    {
        value: 4,
        label: "已付款"
    }
]

export default function ViewReceivingNote(): React.ReactNode {
    // const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
    const { RangePicker } = DatePicker;
    const [columnsData, setColumnsData] = useState([]);
    const [columnsData1, setColumnsData1] = useState([]);
    const [columnsData2, setColumnsData2] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [obj, setObj] = useState<any>({})
    const [obj1, setObj1] = useState<any>({});
    const [receiptVos, setReceiptVos] = useState<any>([]);
    const [money2, setMoney2] = useState(0);
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
    const billNumber = async (invoiceId: number) => {
        setIsModalVisible1(true)
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/invoice/${invoiceId}`);
        setObj(result);
        setColumnsData(obj.operationRecordInfoVos);
        setReceiptVos(obj.receiptVos);
    }
    const pleasePayNumber = async (applyPaymentId: number) => {
        setIsModalVisible(true)
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/applyPayment/${applyPaymentId}`)
        console.log(result);
        setObj1(result);
        setColumnsData1(result.operationRecordInfoVos)
    }
    const bb = async () => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/list`)
        console.log(result.records);
        var money = result.records.map((item: any) => {
            if (item.billNumber === "") {
                // const money = Number(item.price)
                // console.log(money);
                return item.price++
            }
        })
        console.log(money,'aaa');
        
        const money1 = money.map(String);
        const aa = money1.splice(0, 9)
        const b = aa.map((item: number, i: any) => {
            return item++
        })
        const money2 = b.reduce((item: any, i: any) => item + i);
        setMoney2(money2);
    }
    useEffect(() => {
        bb();
    }, [])
    const buttons: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel() }}>关闭</Button>
        </div>
    ]
    const buttons1: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel1() }}>关闭</Button>
        </div>
    ]
    return (
        <div>
            <Page
                path="/tower-storage/receiveStock/list"
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    {
                        title: "供应商",
                        dataIndex: "supplierName"
                    },
                    {
                        title: "收货单编号",
                        dataIndex: "receiveNumber",
                        render: (text, record: any) => {
                            // console.log(record);
                            return <div>
                                <Button type="link" onClick={() => history.push(`/stock/viewReceivingNote/viewReceivingNoteDetail`)}>{record.receiveNumber}</Button>
                            </div>
                        }
                    },
                    ...aa,
                    {
                        title: "关联请款编号",
                        dataIndex: "pleasePayNumber",
                        render: (text, record: any) => {
                            return <div>
                                <Button type="link" onClick={() => { pleasePayNumber(record.pleasePayId) }}>{record.pleasePayNumber}</Button>
                            </div>
                        }
                    },
                    {
                        title: "关联票据编号",
                        dataIndex: "billNumber",
                        render: (text, record: any) => {
                            return <div>
                                <Button type="link" onClick={() => { billNumber(record.invoiceId) }}>{record.billNumber}</Button>
                            </div>
                        }
                    },
                    {
                        title: "付款状态",
                        dataIndex: "invoiceStatus"
                    }
                ]}
                filterValue={filterValue}
                extraOperation={<div><Link to=""><Button type="primary">导出</Button></Link><span style={{ fontSize: "20px", color: "orange", marginLeft: "40px" }}>累计欠票金额：{money2}      累计欠费金额：{money2}</span></div>}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'updateTime',
                        label: '收货完成时间',
                        children: <RangePicker />
                    },
                    {
                        name: 'rawMaterialType',
                        label: '状态',
                        children: <Select style={{ width: "150px" }} defaultValue={"全部"}>
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
            {/* 关联请款编号 */}
            <Modal width="700px" title="详情" visible={isModalVisible} footer={buttons} onCancel={handleCancel} >
                <DetailTitle title="申请信息" />
                <Descriptions bordered column={2} labelStyle={{ textAlign: 'center' }}>
                    <Descriptions.Item label="所属供应商">{obj1.supplierName}</Descriptions.Item>
                    <Descriptions.Item label="请款金额">{obj1.pleasePayAmount}</Descriptions.Item>
                    <Descriptions.Item label="关联票据">{obj1.billNumbers}</Descriptions.Item>
                    <Descriptions.Item label="关联收货单">{obj1.receiptNumbers}</Descriptions.Item>
                    <Descriptions.Item label="开户银行">{obj1.openBank}</Descriptions.Item>
                    <Descriptions.Item label="银行账号">{obj1.openBankNumber}</Descriptions.Item>
                    <Descriptions.Item label="付款方式">{obj1.paymentMethod}</Descriptions.Item>
                    <Descriptions.Item label="请款类别">{obj1.pleasePayType}</Descriptions.Item>
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
                        dataSource={columnsData2}
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
                        dataSource={columnsData1}
                    />
                </DetailContent>
            </Modal>
            {/* 关联票据编号 */}
            <Modal width="700px" title="详情" visible={isModalVisible1} footer={buttons1} onCancel={handleCancel1} >
                <DetailTitle title="票据信息" />
                <Descriptions bordered column={2} labelStyle={{ textAlign: 'right' }}>
                    <Descriptions.Item label="票据编号">{obj.billNumber}</Descriptions.Item>
                    <Descriptions.Item label="所属供应商">{obj.supplierName}</Descriptions.Item>
                    <Descriptions.Item label="开票单位">{obj.invoiceUnit}</Descriptions.Item>
                    <Descriptions.Item label="发票号">{obj.invoiceNumber}</Descriptions.Item>
                    <Descriptions.Item label="发票类型">{obj.invoiceType}</Descriptions.Item>
                    <Descriptions.Item label="发票金额">{obj.invoiceAmount}</Descriptions.Item>
                    <Descriptions.Item label="收货单">{obj.receiptNumbers}</Descriptions.Item>
                    <Descriptions.Item label="开票日">{moment(obj.collectInvoiceDate).format("YYYY-MM-DD")}</Descriptions.Item>
                </Descriptions>
                <Attachment dataSource={obj?.invoiceAttachInfoVos || []} />
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
        </div>
    )
}