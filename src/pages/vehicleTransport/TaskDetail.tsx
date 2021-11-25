import React from 'react';
import { Spin } from 'antd';
import { BaseInfo, CommonTable, DetailContent, DetailTitle } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
const tableColumns = [
    {
        key: 'createUserName',
        title: '条码',
        dataIndex: 'createUserName'
    },
    {
        key: 'createTime',
        title: '件号',
        dataIndex: 'createTime'
    },
    {
        key: 'createTime',
        title: '材料',
        dataIndex: 'createTime'
    },
    {
        key: 'recordType',
        title: '材质',
        dataIndex: 'recordType'
    },
    {
        key: 'stateFront',
        title: '规格',
        dataIndex: 'stateFront'
    },
    {
        key: 'stateAfter',
        title: '长度（mm）',
        dataIndex: 'stateAfter'
    },
    {
        key: 'createTime',
        title: '类型',
        dataIndex: 'createTime'
    },
    {
        key: 'recordType',
        title: '单件孔数',
        dataIndex: 'recordType'
    },
    {
        key: 'stateFront',
        title: '单段数',
        dataIndex: 'stateFront'
    },
    {
        key: 'stateAfter',
        title: '加工数',
        dataIndex: 'stateAfter'
    },
    {
        key: 'recordType',
        title: '试装数',
        dataIndex: 'recordType'
    },
    {
        key: 'stateFront',
        title: '总重（kg）',
        dataIndex: 'stateFront'
    },
    {
        key: 'stateAfter',
        title: '工艺流程',
        dataIndex: 'stateAfter'
    },
    {
        key: 'createTime',
        title: '所在车间',
        dataIndex: 'createTime'
    },
    {
        key: 'createTime',
        title: '所在工序',
        dataIndex: 'createTime'
    }
]

const baseColums = [
    {
        "dataIndex": "title",
        "title": "任务编号"
    },
    {
        "dataIndex": "title",
        "title": "计划号"
    },
    {
        "dataIndex": "title",
        "title": "塔型"
    },
    {
        "dataIndex": "content",
        "title": "加工车间"
    },
    {
        "dataIndex": "userNames",
        "title": "转运车间"
    },
    {
        "dataIndex": "stateName",
        "title": "转运日期"
    },
    {
        "dataIndex": "title",
        "title": "接收日期"
    },
    {
        "dataIndex": "title",
        "title": "运输车辆"
    }
]

export default function TaskDetail(): React.ReactNode {
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(``)
        resole(data)
    }), {})
    const detailData: any = data;


    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <DetailContent>
        <BaseInfo columns={baseColums} dataSource={detailData} col={3} />
        <DetailTitle title="构件明细列表" />
        <CommonTable columns={tableColumns} dataSource={detailData.stateRecordVOS} pagination={false} />
    </DetailContent>
}