/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-NC程序
*/

import React, { useRef, useState } from 'react';
import { Space, Input, DatePicker, Button, Popconfirm, message, Spin, Select } from 'antd';
import { BatchAttachment, SearchTable } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { downloadTemplate } from './downloadTemplate';
import { AttachmentRef, FileProps } from '../../common/Attachment';
import { IData } from './ISetOut';


export default function NCProgram(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'partName',
            title: '段名',
            width: 150,
            dataIndex: 'partName'
        },
        {
            key: 'componentCode',
            title: '构件编号',
            dataIndex: 'componentCode',
            width: 120
        },
        {
            key: 'ncName',
            title: 'NC程序名称',
            width: 200,
            dataIndex: 'ncName'
        },
        {
            key: 'createTime',
            title: '上传时间',
            width: 150,
            dataIndex: 'createTime',
        },
        {
            key: 'createUserName',
            title: '上传人',
            dataIndex: 'createUserName',
            width: 200,
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Popconfirm
                    title="确认删除?"
                    onConfirm={() => RequestUtil.delete(`/tower-science/productNc?fileId=${record.fileId}`).then(res => {
                        message.success('删除成功');
                        history.go(0);
                    })}
                    okText="确认"
                    cancelText="取消"
                    disabled={!record.ncName}
                >
                    <Button type="link" disabled={!record.ncName}>删除</Button>
                </Popconfirm>
            )
        }
    ]
    const history = useHistory();
    const params = useParams<{ id: string, productSegmentId: string }>();
    const [refresh, setRefresh] = useState(false);
    const [detailData, setDetailData] = useState<IData>();
    const attachRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })

    const getData = async () => {
        const data = await RequestUtil.get<IData>(`/tower-science/productNc/count?productCategoryId=${params.id}`);
        setDetailData(data)
    }
    const { loading, data }: Record<string, any> = useRequest(() => new Promise(async (resole, reject) => {
        getData();
        const data: [] = await RequestUtil.get<[]>(`/tower-science/productSegment/reuse/productCategory?productCategoryId=${params.id}`);
        resole(data);
    }), {})

    const userList: any = data || [];

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <SearchTable
        path="/tower-science/productNc"
        requestData={{ id: params.productSegmentId, productCategoryId: params.id }}
        columns={columns}
        headTabs={[]}
        refresh={refresh}
        extraOperation={<Space direction="horizontal" size="small">
            <Button type="primary" ghost onClick={() => downloadTemplate(`/tower-science/productNc/downloadSummary?productCategoryId=${params.id}`, "NC文件汇总", {}, true)}>下载</Button>
            <p>NC程序数 {detailData?.ncCount || 0}/{detailData?.structureCount || 0}</p>
            <BatchAttachment
                ref={attachRef}
                isTable={false}
                dataSource={[]}
                onDoneChange={(dataInfo: FileProps[]) => {
                    RequestUtil.post(`/tower-science/productNc/importProductNc`, {
                        fileVOList: [...dataInfo],
                        productCategoryId: params.id
                    }).then(res => {
                        if (res) {
                            message.success('上传成功');
                            history.go(0);
                            getData();
                        }
                    }).catch(error => {
                        setTimeout(() => {
                            history.go(0);
                        }, 1500)

                    })
                }}><Button type="primary" ghost>批量上传</Button></BatchAttachment>
            <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
        </Space>}
        searchFormItems={[
            {
                name: 'createTime',
                label: '上传时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'segmentId',
                label: '段名',
                children: <Select placeholder="请选择" style={{ width: '120px' }}>
                    {userList && userList.map((item: any) => {
                        return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })}
                </Select>
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="NC程序名/构件编号" />
            }
        ]}
        onFilterSubmit={(values: any) => {
            if (values.createTime) {
                const formatDate = values.createTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.createTimeStart = formatDate[0] + ' 00:00:00';
                values.createTimeEnd = formatDate[1] + ' 23:59:59';
            }
            return values;
        }}
    />
}