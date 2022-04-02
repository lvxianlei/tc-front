/**
 * @author zyc
 * @copyright © 2022
 * @description 包装计划-包装计划列表-详情
*/

import React, { useState } from 'react';
import { Spin, Button, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable, Attachment } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './PackingPlan.module.less'

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
        "title": "角钢重量（KG）",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "镀锌班组",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "产品类型",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "工程名称",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "连板重量（KG）",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "角钢包装班组",
        "type": "string"
    },

    {
        "dataIndex": "materialStandard",
        "title": "连板包装班组",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "塔型",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "钢管重量（KG）",
        "type": "string"
    },

    {
        "dataIndex": "materialStandard",
        "title": "开始包装日期",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "钢管包装班组",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "电压等级",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "总重量（KG）",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "要求完成日期",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "基数",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "计划状态",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "备注",
        "type": "string"
    },
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

const packColumns = [
    {
        key: 'createDeptName',
        title: '包号',
        dataIndex: 'createDeptName',
    },
    {
        key: 'createUserName',
        title: '包件数',
        dataIndex: 'createUserName'
    },
    {
        key: 'createTime',
        title: '包重（KG）',
        dataIndex: 'createTime'
    },
    {
        key: 'createTime',
        title: '包类型',
        dataIndex: 'createTime'
    },
    {
        key: 'createTime',
        title: '包属性',
        dataIndex: 'createTime'
    },
    {
        key: 'description',
        title: '包装班组',
        dataIndex: 'description'
    },
    {
        key: 'description',
        title: '包类型',
        dataIndex: 'description'
    }
]

export default function SetOutInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [packData, setPackData] = useState([]);
    const { loading, data }: Record<string, any> = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<any>(``);
        getTableDataSource(data && data?.length > 0 &&data[0]?.id)
        resole(data)
    }), {})
    const detailData: ISetOut = data;

    const getTableDataSource = (id: string) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<[]>(``);
        setPackData(data);
    });

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
        <BaseInfo columns={baseColums} dataSource={detailData} col={4} />
        <DetailTitle title={'杆塔明细'} />
        <CommonTable
            haveIndex
            dataSource={[]}
            columns={tableColumns}
            onRow={(record: Record<string, any>, index: number) => ({
                onClick: async () => {
                    getTableDataSource(record.id)
                },
                className: styles.tableRow
            })}
        />
        <CommonTable dataSource={packData} columns={packColumns} />
    </DetailContent>
}