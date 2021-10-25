import React, { useState } from 'react'
import { Button, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Page } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';

export default function AssemblyWeldInfo(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '段号', dataIndex: 'segmentName', key: 'segmentName', },
        { title: '组件号', dataIndex: 'componentId', key: 'componentId' },
        { title: '主件号', dataIndex: 'mainPartId', key: 'mainPartId' },
        { title: '单段组数', dataIndex: 'singleNum', key: 'singleNum' },
        { title: '单组重量（kg）', dataIndex: 'singleGroupWeight', key: 'singleGroupWeight' },
        { title: '电焊米数（mm）', dataIndex: 'electricWeldingMeters', key: 'electricWeldingMeters' },
        { title: '件号信息', dataIndex: 'numInformation', key: 'numInformation' },
        { title: '备注', dataIndex: 'description', key: 'description' },
    ]
    return <>
        <DetailContent operation={[
            <Button key="goback" onClick={() => history.goBack()}>返回</Button>
        ]}>
            <DetailTitle title="组焊清单" />
            <Page
                path="/tower-science/welding/getWeldingByProductSegmentId"
                columns={columns}
                requestData={{productSegmentId: params.id}}
                searchFormItems={[]}
            />
        </DetailContent>
    </>
}