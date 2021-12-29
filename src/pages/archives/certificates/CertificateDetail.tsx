/**
 * @author zyc
 * @copyright © 2021 
 * @description 详情
*/

import React from 'react';
import { Spin, Button, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { ICertificate } from './CertificateMngt';

const tableColumns = [
    {
        key: 'recordType',
        title: '操作类型',
        dataIndex: 'recordType'
    },
    {
        key: 'stateFront',
        title: '操作前状态',
        dataIndex: 'stateFront'
    },
    {
        key: 'stateAfter',
        title: '操作后状态',
        dataIndex: 'stateAfter'
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
    }
]

const baseColums = [
    {
        "dataIndex": "certificateNumber",
        "title": "证书编号："
    },
    {
        "dataIndex": "certificateName",
        "title": "证书名称："
    },
    {
        "dataIndex": "certificateTypeName",
        "title": "证书类型："
    },
    {
        "dataIndex": "effective",
        "title": "有效："
    },
    {
        "dataIndex": "certificateLevel",
        "title": "证书等级："
    },
    {
        "dataIndex": "certificateIntroduce",
        "title": "资质简介："
    },
    {
        "dataIndex": "startDate",
        "title": "生效日期："
    },
    {
        "dataIndex": "endDate",
        "title": "失效日期："
    },
    {
        "dataIndex": "certificateDepartment",
        "title": "发证部门："
    },
    {
        "dataIndex": "designation",
        "title": "备注："
    }
]

const UserColums = [
    {
        "dataIndex": "number",
        "title": "工号："
    },
    {
        "dataIndex": "staffName",
        "title": "姓名："
    },
    {
        "dataIndex": "phone",
        "title": "手机号："
    },
    {
        "dataIndex": "categoryName",
        "title": "员工类型："
    },
    {
        "dataIndex": "deptName",
        "title": "部门："
    },
    {
        "dataIndex": "stationName",
        "title": "职位："
    }
]

export default function CertificateDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest<ICertificate>(() => new Promise(async (resole, reject) => {
        const data: ICertificate = await RequestUtil.get<ICertificate>(`/tower-system/certificateRecord/${params.id}`)
        resole(data)
    }), {})
    const now = new Date();
    const time =  new Date(data?.endDate && data?.endDate.toString().replace("-","/") || '');
    const detailData: ICertificate = {
        ...data,
        effective: now > time ? '失效' : '有效'
    };
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
            <DetailTitle title="证书信息" />
            <BaseInfo columns={baseColums} dataSource={detailData} col={2} />
            <DetailTitle title="所属员工信息" />
            <BaseInfo columns={UserColums} dataSource={detailData} col={2} />
            <DetailTitle title="操作信息" />
            <CommonTable columns={tableColumns} dataSource={detailData.businessRecordVOList} pagination={false} />
        </DetailContent>
    </>
}