/***
 * 请款申请列表
 * 2021/11/22
 */
import React, { useState } from 'react';
import { Button, Input, DatePicker, Radio,Select ,Form} from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../common'
import { fundListColumns, approvalStatus } from "./fundListHead.json"

import AddModal from './addModal'; // 新增付款记录
import OverView from './overView'; // 查看付款记录详情
const test = [{label:"1",code:1}, {label:"2",code:2}, {label:"3",code:3}];
export default function FaundInfomation() {
    const history = useHistory()
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [AddVisible, setAddVisible] = useState(false);
    const [ visibleOverView, setVisibleOverView ] = useState<boolean>(false);
    const confirmed = [{ "title": "备注", "dataIndex": "description"}]
    // 查询按钮
    const onFilterSubmit = (value: any) => {
        console.log(value, '搜索的值')
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startPayTime = formatDate[0]
            value.endPayTime = formatDate[1]
        }
        return value
    }
    
    // tab切换
    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }

    // 新增回调
    const handleOk = (result:object, callBack: any) => {
        console.log(result, '-------------11111111');
        setTimeout(() => {
            callBack();
            setAddVisible(false);
        }, 1000);
    }

    // 查看
    const hanleSee = (record: any) => {
        console.log(record, 'record');
        setVisibleOverView(true);
    }
    return (
        <>
            <Page
                path="/tower-market/backMoney"
                onFilterSubmit={onFilterSubmit}
                filterValue={{ confirmStatus }}
                searchFormItems={[
                    {
                        name: 'payCompany',
                        children: <Input placeholder="请输入请款单号/收款方进行查询" style={{ width: 200 }} />
                    },
                    {
                        name: 'dataStatus',
                        label: '请款类别',
                        children: <Form.Item name="dataStatus">
                            <Select placeholder="请款类别" style={{ width: "100px" }}>
                                {test.map(({label,code},index)=>{
                                    return <Select.Option value={code} key={code}>{label}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    },
                    {
                        name: 'dataStatus',
                        label: '请款部门',
                        children: <Form.Item name="dataStatus">
                            <Select placeholder="请款部门" style={{ width: "100px" }}>
                                {test.map(({label,code},index)=>{
                                    return <Select.Option value={code} key={index}>{label}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    },
                    {
                        name: 'startRefundTime',
                        label: '请款日期：',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: "200px" }} />
                    }
                ]}
                extraOperation={
                    <div style={{}}>
                        <div>
                            <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                                {approvalStatus.map((item: any) => <Radio.Button value={item.value}>{item.label}</Radio.Button>)}
                            </Radio.Group>
                            { confirmStatus == 1 ? 
                                <span style={{marginLeft:"20px"}}>请款金额总计：1100000.00元   
                                已付金额合计：20000.00元    应付款余额合计：1080000.00元</span>
                                :
                                <span style={{marginLeft:"20px"}}>请款金额总计：1100000.00元</span>
                            }
                        </div>
                    </div>
                }
                refresh={ refresh }
                columns={[
                    ...fundListColumns.map((item: any) => {
                        if (item.dataIndex === 'confirmStatus') {
                            return ({
                                title: item.title,
                                dataIndex: 'confirmStatus',
                                width: 50,
                                render: (_: any, record: any): React.ReactNode => (<span>{record.confirmStatus === 1 ? '待确认' : '已确认'}</span>)
                            })
                        }
                        return item;
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 100,
                        render: (_: any, record: any) => {
                            if (confirmStatus === 1) {
                                return (
                                    <>
                                    <Button type="link" onClick={() => setAddVisible(true)}>新增付款记录</Button>
                                    <Button type="link"  onClick={() => setVisibleOverView(true)}>详情</Button>
                                    </>
                                )
                            }
                            return <Button type="link"onClick={() => setVisibleOverView(true)}>详情</Button>
                        }
                    }]}
            />
            {/* 新增 */}
            <AddModal
                visible={AddVisible}
                onCancel={() => setAddVisible(false)}
                onOk={handleOk}
            />
            {/* 查看 */}
            <OverView
                title={confirmed}
                visible={visibleOverView}
                onCancel={() => setVisibleOverView(false)}
            />
        </>
    )
}