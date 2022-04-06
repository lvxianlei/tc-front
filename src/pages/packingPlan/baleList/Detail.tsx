/**
 * @author zyc
 * @copyright © 2022
 * @description 包装计划-包装计划列表-详情
*/

import React, { useState } from 'react';
import { Spin, Button, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from '../PackingPlan.module.less';

interface ISetOut {
    readonly stateRecordVOS?: ITaskDataVOList[];
}

interface ITaskDataVOList {
    readonly createTime?: string;
    readonly status?: string;
    readonly createUser?: string;
    readonly createDepartment?: string;
    readonly description?: string;
}

const baseColums = [
    {
        "dataIndex": "materialStandard",
        "title": "计划号",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "包号",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "工程名称",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "包件数",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "包装班组",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "塔型",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "包重量（KG）",
        "type": "string"
    },

    {
        "dataIndex": "materialStandard",
        "title": "开始包装日期",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "电压等级",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "包类型",
        "type": "string"
    },

    {
        "dataIndex": "materialStandard",
        "title": "要求完成日期",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "杆塔号",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "包属性",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "包状态",
        "type": "string"
    }
]


const tableColumns = [
    {
        key: 'createDeptName',
        title: '杆塔号',
        dataIndex: 'createDeptName',
    },
    {
        key: 'createUserName',
        title: '呼高（M）',
        dataIndex: 'createUserName'
    },
    {
        key: 'createTime',
        title: '总重（KG）',
        dataIndex: 'createTime'
    },
    {
        key: 'createTime',
        title: '杆塔状态',
        dataIndex: 'createTime'
    },
    {
        key: 'createTime',
        title: '打包进度',
        dataIndex: 'createTime'
    },
    {
        key: 'description',
        title: '入库进度',
        dataIndex: 'description'
    }
]

export default function SetOutInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [packData, setPackData] = useState([]);
    const { loading, data }: Record<string, any> = useRequest(() => new Promise(async (resole, reject) => {
        // const data = await RequestUtil.get<any>(``);
        resole([])
    }), {})
    const detailData: ISetOut = data;

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <DetailContent operation={[
        <Space direction="horizontal" size="small" >
            <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
        </Space>
    ]}>
        <DetailTitle title="基本信息" />
        <BaseInfo columns={baseColums} dataSource={detailData} col={3} />
        <p className={styles.detailtitle}><span>杆塔明细</span><span>包捆进度{0/9}</span></p>
        <CommonTable
            haveIndex
            dataSource={[]}
            columns={tableColumns}
        />
    </DetailContent>
}