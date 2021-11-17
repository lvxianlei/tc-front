import React, { useState } from 'react'
import { Button, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { packageData } from './detail.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';



export default function PackageDetail(): React.ReactNode {
    const history = useHistory();
    const [tableDataSource,setTableDataSource] = useState<any>([]);
    const [userDataSource,setUserDataSource] = useState<any>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // let data = await RequestUtil.get(``,{})
        resole(data)
    }), {})
    const detailData: any = data;
    const tableColumns = [
        { title: '捆号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '件号', dataIndex: 'createDeptName', key: 'createDeptName', },
        { title: '材料规格', dataIndex: 'createUserName', key: 'createUserName' },
        { title: '长度', dataIndex: 'createTime', key: 'createTime' },
        { title: '数量', dataIndex: 'description', key: 'description' },
        { title: '备注', dataIndex: 'description', key: 'description' }
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="包装清单信息" />
                <BaseInfo columns={packageData} dataSource={detailData || {}}/>
                <DetailTitle title="件号明细" />
                <CommonTable 
                    columns={tableColumns}
                    dataSource={tableDataSource} 
                    pagination={false}
                />
            </DetailContent>
        </Spin>
    </>
}