/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-组焊列表-组焊信息
*/

import React from 'react';
import { Spin, Button, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable, Attachment } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

const tableColumns = [
    {
        key: 'createDeptName',
        title: '操作部门',
        dataIndex: 'createDeptName',
    },
    {
        key: 'createUserName',
        title: '操作人',
        dataIndex: 'createUserName'
    },
    {
        key: 'createTime',
        title: '操作时间',
        dataIndex: 'createTime'
    },
    {
        key: 'currentStatus',
        title: '任务状态',
        dataIndex: 'currentStatus',
        render: (status: number): React.ReactNode => {
            switch (status) {
                case 0:
                    return '已拒绝';
                case 2:
                    return '组焊中';
                case 3:
                    return '已完成';
            }
        }
    }
]

const specialColums = [
    {
        "dataIndex": "materialStandardName",
        "title": "原材料标准"
    },
    {
        "dataIndex": "materialDemand",
        "title": "原材料要求"
    },
    {
        "dataIndex": "weldingDemand",
        "title": "焊接要求"
    },
    {
        "dataIndex": "packDemand",
        "title": "包装要求"
    },
    {
        "dataIndex": "galvanizeDemand",
        "title": "镀锌要求"
    },
    {
        "dataIndex": "peculiarDescription",
        "title": "备注",
        "type": "textarea"
    }
]

const productColumns = [
    {
        "dataIndex": "productModelNum",
        "title": "塔型（个）"
    },
    {
        "dataIndex": "productNum",
        "title": "杆塔（基）"
    },
    {
        "dataIndex": "productTypeName",
        "title": "产品类型"
    },
    {
        "dataIndex": "totalWeight",
        "title": "总重量（kg）"
    }
]

export default function AssemblyWeldingInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/welding/getWeldingTaskById?weldingId=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" >
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
            </Space>
        ]}>
            <DetailTitle title="特殊要求" />
            <BaseInfo columns={specialColums} dataSource={detailData} col={2} />
            <DetailTitle title="产品信息" />
            <BaseInfo columns={productColumns} dataSource={detailData} col={2} />
            <Attachment dataSource={detailData.attachInfoList || []} />
            <DetailTitle title="操作信息" />
            <CommonTable haveIndex columns={tableColumns} dataSource={detailData.statusRecordList} pagination={false} />
        </DetailContent>
    </>
}