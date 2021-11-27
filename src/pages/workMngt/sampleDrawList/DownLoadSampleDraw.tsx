import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Select, message } from 'antd';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common';
import { Popconfirm } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import { downloadTemplate } from '../setOut/downloadTemplate';

export default function SampleDrawList(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state: {} }>();
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<any[]>([]);
    const params = useParams<{ id: string, status: string }>()
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskNum',
            title: '大样图工艺卡名称',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'externalTaskNum',
            title: '段包信息',
            width: 100,
            dataIndex: 'externalTaskNum'
        },
        {
            key: 'saleOrderNumber',
            title: '上传时间',
            width: 100,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '上传人',
            width: 100,
            dataIndex: 'internalNumber'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 230,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="primary" onClick={ () => downloadTemplate('/tower-science/productSegment/segmentModelDownload', '小样图', {segmentRecordId: record.id}) } ghost>下载</Button>
                </Space>
            )
        }
    ]
    return (
        <Page
            path="/tower-science/productSegment/sampleList"
            columns={columns}
            filterValue={filterValue}
            refresh={refresh}
            requestData={ { smallSampleStatus: location.state } }
            tableProps={{
                pagination: false,
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            exportPath={`/tower-science/productSegment/exportSample/${params.id}`}
            extraOperation={
                <Space>
                {/* <Button type="primary">导出</Button> */}
                <Button type="primary" onClick={ () => downloadTemplate('/tower-science/productSegment/segmentModelDownload', '小样图', {segmentRecordId: selectedKeys}) } ghost>下载</Button>
                <Button type="primary" onClick={() => history.goBack()} ghost>返回上一级</Button>
                </Space>
            }
            searchFormItems={[]}
        />
    )
}