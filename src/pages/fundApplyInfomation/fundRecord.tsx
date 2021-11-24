/***
 * 请款申请列表
 * 2021/11/22
 */
import React, { useState } from 'react';
import { Button, Input, DatePicker, Radio,Select ,Form} from 'antd'
import { Page } from '../common'
import { fundRecordColumns } from "./fundRecord.json"

import OverViewRecord from './overViewRecord'; // 查看付款记录详情
const test = [{label:"1",code:1}, {label:"2",code:2}, {label:"3",code:3}];
const testDp = [{label:"1",code:1}, {label:"2",code:2}, {label:"3",code:3}];
export default function FaundInfomation() {
    const [ visibleOverView, setVisibleOverView ] = useState<boolean>(true);
    const confirmed = [{ "title": "备注", "dataIndex": "description"}]
    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.endPayApplyTime) {
            const formatDate = value.endPayApplyTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.endPayApplyTime = formatDate[0]
            value.startPayApplyTime = formatDate[1]
        }
        return value
    }
    // 新增回调
    const handleOk = (result:object, callBack: any) => {
        console.log(result, '-------------11111111');
        setTimeout(() => {
            callBack();
            // setAddVisible(false);
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
                path="/tower-finance/payApply/payment"
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'fuzzyQuery',
                        children: <Input placeholder="请输入请款单号/收款方进行查询" style={{ width: 200 }} />
                    },
                    {
                        name: 'costType',
                        label: '付款方式',
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
                        金额合计：100000.00元
                    </div>
                }
                columns={[
                    ...fundRecordColumns,
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 100,
                        render: (_: any, record: any) => {
                            return <Button type="link"onClick={() => setVisibleOverView(true)}>详情</Button>
                        }
                    }]}
            />
            {/* 查看 */}
            <OverViewRecord
                title={confirmed}
                visible={visibleOverView}
                onCancel={() => setVisibleOverView(false)}
            />
        </>
    )
}