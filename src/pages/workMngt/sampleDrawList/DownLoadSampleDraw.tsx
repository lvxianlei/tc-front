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
            key: 'name',
            title: '大样图工艺卡名称',
            width: 300,
            dataIndex: 'name'
        },
        {
            key: 'segmentName',
            title: '段包信息',
            width: 300,
            dataIndex: 'segmentName'
        },
        {
            key: 'createTime',
            title: '上传时间',
            width: 300,
            dataIndex: 'createTime'
        },
        {
            key: 'createUserName',
            title: '上传人',
            width: 300,
            dataIndex: 'createUserName'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 50,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={ async () => {
                        const data: any = await RequestUtil.get(`/tower-science/productSegment/segmentModelDownload?segmentRecordId=${ record.id }`);
                        window.open(data?.downloadUrl)}
                    } >下载</Button>
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
            requestData={ { productCategoryId: params.id } }
            tableProps={{
                pagination: false,
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            exportPath={`/tower-science/productSegment/sampleList`}
            extraOperation={
                <Space>
                {/* <Button type="primary">导出</Button> */}
                    <Button type="primary" onClick={ () => downloadTemplate('/tower-science/productSegment/batchSegmentModelDownload', '大样图工艺卡', {segmentRecordIdList: selectedKeys} , true, "array") } ghost disabled={!(selectedKeys.length>0)}>下载</Button>
                    <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                </Space>
            }
            searchFormItems={[]}
        />
    )
}