/**
 * @author zyc
 * @copyright © 2022
 * @description 包装计划-包装计划列表-详情
*/

import React, { useState } from 'react';
import { Spin, Button, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './PackingPlan.module.less'

interface IPackagePlan {
    readonly packagePlanProductVOS?: IPackagePlanProduct[];
    readonly planProgress?: string;
}

interface IPackagePlanProduct {
    readonly id?: string;
    readonly packageProgress?: string;
    readonly productHeight?: string;
    readonly productNumber?: string;
    readonly productPackageStatus?: string;
    readonly productPackageStatusName?: string;
    readonly receiveProgress?: string;
    readonly totalWeight?: string;
}

const baseColums = [
    {
        "dataIndex": "planNumber",
        "title": "计划号",
        "type": "string"
    },
    {
        "dataIndex": "angleWeight",
        "title": "角钢重量（KG）",
        "type": "string"
    },
    {
        "dataIndex": "galvanizedTeamName",
        "title": "镀锌班组",
        "type": "string"
    },
    {
        "dataIndex": "productTypeName",
        "title": "产品类型",
        "type": "string"
    },
    {
        "dataIndex": "orderProjectName",
        "title": "工程名称",
        "type": "string"
    },
    {
        "dataIndex": "boardWeight",
        "title": "连板重量（KG）",
        "type": "string"
    },
    {
        "dataIndex": "angleTeamName",
        "title": "角钢包装班组",
        "type": "string"
    },

    {
        "dataIndex": "boardTeamName",
        "title": "连板包装班组",
        "type": "string"
    },
    {
        "dataIndex": "productCategoryName",
        "title": "塔型",
        "type": "string"
    },
    {
        "dataIndex": "pipeWeight",
        "title": "钢管重量（KG）",
        "type": "string"
    },

    {
        "dataIndex": "startTime",
        "title": "开始包装日期",
        "type": "string"
    },
    {
        "dataIndex": "pipeTeamName",
        "title": "钢管包装班组",
        "type": "string"
    },
    {
        "dataIndex": "voltageGradeName",
        "title": "电压等级",
        "type": "string"
    },
    {
        "dataIndex": "materialStandard",
        "title": "总重量（KG）",
        "type": "string"
    },
    {
        "dataIndex": "endTime",
        "title": "要求完成日期",
        "type": "string"
    },
    {
        "dataIndex": "weight",
        "title": "基数",
        "type": "string"
    },
    {
        "dataIndex": "statusName",
        "title": "计划状态",
        "type": "string"
    },
    {
        "dataIndex": "description",
        "title": "备注",
        "type": "string"
    },
]


const tableColumns = [
    {
        key: 'productNumber',
        title: '杆塔号',
        dataIndex: 'productNumber'
    },
    {
        key: 'productHeight',
        title: '呼高（M）',
        dataIndex: 'productHeight'
    },
    {
        key: 'totalWeight',
        title: '总重（KG）',
        dataIndex: 'totalWeight'
    },
    {
        key: 'productPackageStatus',
        title: '杆塔状态',
        dataIndex: 'productPackageStatus'
    },
    {
        key: 'packageProgress',
        title: '打包进度',
        dataIndex: 'packageProgress'
    },
    {
        key: 'receiveProgress',
        title: '入库进度',
        dataIndex: 'receiveProgress'
    }
]

const packColumns = [
    {
        key: 'packageCode',
        title: '包号',
        dataIndex: 'packageCode'
    },
    {
        key: 'packageComponentCount',
        title: '包件数',
        dataIndex: 'packageComponentCount'
    },
    {
        key: 'packageWeight',
        title: '包重（KG）',
        dataIndex: 'packageWeight'
    },
    {
        key: 'packageTypeName',
        title: '包类型',
        dataIndex: 'packageTypeName'
    },
    {
        key: 'packageAttributeName',
        title: '包属性',
        dataIndex: 'packageAttributeName'
    },
    {
        key: 'teamName',
        title: '包装班组',
        dataIndex: 'teamName'
    },
    {
        key: 'packageStatusName',
        title: '包状态',
        dataIndex: 'packageStatusName'
    }
]

export default function SetOutInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [packData, setPackData] = useState([]);
    const { loading, data }: Record<string, any> = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IPackagePlan>(`/tower-production/packageWorkshop/detail/${params.id}`);
        if (data?.packagePlanProductVOS && data?.packagePlanProductVOS[0] && data?.packagePlanProductVOS[0].id) {
            getTableDataSource(data?.packagePlanProductVOS[0].id)
        }
        resole(data)
    }), {})
    const detailData: IPackagePlan = data;

    const getTableDataSource = (id: string) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<[]>(`/tower-production/packageWorkshop/detail/package/${id}`);
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
        <p className={styles.detailtitle}>
            <span>杆塔明细</span>
            <span className={styles.content}>计划进度：<span className={styles.num}>{detailData?.planProgress}</span></span>
        </p>
        <CommonTable
            haveIndex
            dataSource={detailData?.packagePlanProductVOS}
            columns={tableColumns}
            style={{ position: 'absolute', width: '48%' }}
            onRow={(record: Record<string, any>, index: number) => ({
                onClick: async () => {
                    getTableDataSource(record.id)
                },
                className: styles.tableRow
            })}
        />
        <CommonTable dataSource={packData} columns={packColumns} style={{ position: 'absolute', width: '48%', left: '50%' }} />
    </DetailContent>
}