/***
 * 回款信息
 * 2021/11/22
 */
import React, { useState } from 'react';
import { Button, Input, DatePicker, Radio } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../common'
import { collectionListHead, approvalStatus } from "./collectionColumn.json"

import AddModal from './addModal'; // 新增
import OverView from './overView'; // 查看

export default function CollectionInfomation() {
    const history = useHistory()
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [confirmStatus, setConfirmStatus] = useState<number>(0);
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState<boolean>(false); // 用来确认查看时的状态
    const [ visibleOverView, setVisibleOverView ] = useState<boolean>(false);

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        console.log(value, '搜索的值')
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startRefundTime = formatDate[0]
            value.endRefundTime = formatDate[1]
        }
        return value
    }
    
    // tab切换
    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }

    // 新增
    const hanleAdd = () => {
        setVisible(true);
    }

    // 新增回调
    const handleOk = (result:object, callBack: any) => {
        console.log(result, '-------------11111111');
        setTimeout(() => {
            callBack();
            setVisible(false);
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
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...collectionListHead,
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 100,
                        render: (_: any, record: any) => {
                            if (record.confirmStatus === 0) {
                                return <Button type="link" onClick={(record) => hanleSee(record)}>查看</Button>
                            }
                            return <Button type="link">删除</Button>
                        }
                    }]}
                refresh={ refresh }
                extraOperation={
                    <div style={{display: 'flex', flexWrap: 'nowrap', justifyContent: 'spance-between'}}>
                        <div>
                            <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                                {approvalStatus.map((item: any) => <Radio.Button value={item.value}>{item.label}</Radio.Button>)}
                            </Radio.Group>
                        </div>
                        <div style={{marginLeft: '1200px'}}>
                            <Button type="primary" style={{marginRight: 20}} onClick={hanleAdd}>新增</Button>
                            <Button type="primary" style={{marginRight: 4}}>导入</Button>
                            <Button type="link">下载导入模板</Button>
                        </div>
                    </div>
                }
                onFilterSubmit={onFilterSubmit}
                filterValue={{ confirmStatus }}
                searchFormItems={[
                    {
                        name: 'fuzzyQuery',
                        children: <Input placeholder="请输入来款单位进行查询" style={{ width: 300 }} />
                    },
                    {
                        name: 'startRefundTime',
                        label: '来款日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    }
                ]}
            />
            {/* 新增 */}
            <AddModal
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={handleOk}
            />
            {/* 查看 */}
            <OverView
                title={status}
                visible={visibleOverView}
                onCancel={() => setVisibleOverView(false)}
            />
        </>
    )
}