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
const testDp = [{label:"1",code:1}, {label:"2",code:2}, {label:"3",code:3}];
export default function FaundInfomation() {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [payStatus, setPayStatus] = useState<number>(1);
    // const [filterValue, setFilterValue] = useState({});
    const [AddVisible, setAddVisible] = useState(true);
    const [ visibleOverView, setVisibleOverView ] = useState<boolean>(false);
    const confirmed = [{ "title": "备注", "dataIndex": "description"}]
    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.endPayApplyTime) {
            const formatDate = value.endPayApplyTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.endPayApplyTime = formatDate[0]
            value.startPayApplyTime = formatDate[1]
        }
        // setFilterValue(value)
        return value
    }
    
    // tab切换
    const operationChange = (event: any) => {
        setPayStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }
    // 新增回调
    const handleOk = (result:object, callBack: any) => {
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
                path="/tower-finance/payApply"
                onFilterSubmit={onFilterSubmit}
                filterValue={{ payStatus}}
                refresh={ refresh }
                searchFormItems={[
                    {
                        name: 'fuzzyQuery',
                        children: <Input placeholder="请输入请款单号/收款方进行查询" style={{ width: 200 }} />
                    },
                    {
                        name: 'costType',
                        label: '请款类别',
                        children: <Form.Item name="costType">
                            <Select placeholder="请款类别" style={{ width: "100px" }}>
                                {test.map(({label,code},index)=>{
                                    return <Select.Option value={code} key={code}>{label}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    },
                    {
                        name: 'payerDeptId',
                        label: '请款部门',
                        children: <Form.Item name="payerDeptId">
                            <Select placeholder="请款部门" style={{ width: "100px" }}>
                                {testDp.map(({label,code},index)=>{
                                    return <Select.Option value={code} key={index}>{label}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    },
                    {
                        name: 'endPayApplyTime',
                        label: '请款日期：',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: "200px" }} />
                    }
                ]}
                extraOperation={
                    <div style={{}}>
                        <div>
                            <Radio.Group defaultValue={payStatus} onChange={operationChange}>
                                {approvalStatus.map((item: any) => 
                                    <Radio.Button value={item.value} key={item.value}>{item.label}</Radio.Button>
                                )}
                            </Radio.Group>
                            { payStatus == 1 ? 
                                <span style={{marginLeft:"20px"}}>请款金额总计：1100000.00元   
                                已付金额合计：20000.00元    应付款余额合计：1080000.00元</span>
                                :
                                <span style={{marginLeft:"20px"}}>请款金额总计：1100000.00元</span>
                            }
                        </div>
                    </div>
                }
                columns={[
                    ...fundListColumns.map((item: any) => {
                        if (item.dataIndex === 'payStatus') {
                            return ({
                                title: item.title,
                                dataIndex: 'payStatus',
                                width: 50,
                                render: (_: any, record: any): React.ReactNode => (<span>{record.payStatus === 1 ? '待确认' : '已确认'}</span>)
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
                            if (payStatus === 1) {
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