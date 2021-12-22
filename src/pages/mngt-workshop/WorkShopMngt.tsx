import React, { useState } from 'react';
import { Input, DatePicker, Button, Radio, Select } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { useHistory } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';

export default function DailySchedule(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const history = useHistory()
    const [ confirmStatus, setConfirmStatus] = useState<number>(1);
    const [ work, setWork ] = useState<any[]>([]);
    const [ unit, setUnit ] = useState<any[]>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const work = await RequestUtil.get(`/tower-system/notice/getNoticeById`)
        // const unit = await RequestUtil.get(`/tower-system/notice/getNoticeById`)
        // setWork(work)
        // setUnit(unit)
        resole(data)
    }), {})
    const columns=[
        {
            title: "工作中心",
            width: 150,
            dataIndex: "workCenterName"
        },
        {
            title: "开始时间",
            width: 150,
            dataIndex: "startTime"
        },
        {
            title: "完成时间",
            width: 150,
            dataIndex: "endTime"
        },
        {
            title: "状态",
            width: 150,
            dataIndex: "status",
            render:(status:number)=>{
                switch(status){
                    case 0: return '未派工'
                    case 1: return '未采集'
                    case 2: return '已完成'
                }
            }
        },
        {
            title: "加工计划编号",
            width: 150,
            dataIndex: "workPlanNumber"
        },
        {
            title: "计划号",
            width: 150,
            dataIndex: "planNumber"
        },
        {
            title: "塔型",
            width: 150,
            dataIndex: "productCategoryName"
        },
        {
            title: "零件号",
            width: 150,
            dataIndex: "code"
        },
        {
            title: "加工数量",
            width: 100,
            dataIndex: "processingNum"
        },
        {
            title: "总重（kg）",
            width: 200,
            dataIndex: "totalWeight"
        }
    ]


    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }


    return <>
        <Page
            path="/tower-aps/machining"
            // sourceKey="galvanizedDailyPlanVOS.records"
            columns={
                confirmStatus === 1 || confirmStatus === 2 || confirmStatus === 3 ? 
                [ ...columns, {
                    "key": "operation",
                    "title": "操作",
                    "dataIndex": "operation",
                    fixed: "right" as FixedType,
                    "width": 150,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        confirmStatus === 1 ? <Button type="link" onClick={() => {
                            history.push(`/workshopManagement/processingTask/dispatch/${record.id}`)
                        }}>派工</Button> : confirmStatus === 2 ? <Button type="link" onClick={() => {
                            history.push(`/workshopManagement/processingTask/detail/${record.id}/${record.status}`)
                        }}>详情</Button>: confirmStatus === 3 ? <Button type="link" onClick={() => {
                            history.push(`/workshopManagement/processingTask/detail/${record.id}/3`)
                        }}>详情</Button>: null
                    )
                }] : [ ...columns]}
            headTabs={[]}
            requestData={{ status: confirmStatus }}
            extraOperation={(data: any) =><>
                <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                    <Radio.Button value={1}>未派工</Radio.Button>
                    <Radio.Button value={2}>未采集</Radio.Button>
                    <Radio.Button value={3}>已完成</Radio.Button>
                </Radio.Group>
                {confirmStatus === 1 ? <Button type="primary"  onClick={() => {
                    history.push(`/workshopManagement/processingTask/dispatch/new`)
                }}>派工</Button> : null}
                </>}
            refresh={refresh}
            // tableProps={{
            //     rowSelection: {
            //         selectedRowKeys: selectedKeys,
            //         onChange: SelectChange
            //     }
            // }}
            searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '',
                    children: <Input style={{ width: '300px' }} placeholder="请输入塔型/构件号进行查询" />
                },
                {
                    name: 'productionLinesName',
                    label: '生产单元',
                    children: <Select placeholder="请选择" style={{ width: "150px" }}>  
                        <Select.Option value="" key="">全部</Select.Option>
                        { unit && unit.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                        }) }
                    </Select>
                },
                {
                    name: 'workCenterName',
                    label: '工作中心',
                    children: <Select placeholder="请选择" style={{ width: "150px" }}>  
                        <Select.Option value="" key="">全部</Select.Option>
                        { work && work.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                        }) }
                    </Select>
                },
                {
                    name: 'time',
                    label: '时间范围',
                    children: <DatePicker.RangePicker />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.time) {
                    const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                    values.startTime = formatDate[0]+' 00:00:00';
                    values.endTime = formatDate[1]+' 23:59:59';
                }
                setFilterValue(values);
                return values;
            }}
        />
    </>
}