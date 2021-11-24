/**
 * @author zyc
 * @copyright © 2021 
 * @description 详情
*/
import React, { useState } from 'react';
import { Spin, Button, Space, Modal, Image } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

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
        "dataIndex": "title",
        "title": "标题"
    },
    {
        "dataIndex": "content",
        "title": "内容"
    },
    {
        "dataIndex": "userNames",
        "title": "接收人"
    },
    {
        "dataIndex": "stateName",
        "title": "状态"
    },
    {
        "dataIndex": "releaseTime",
        "title": "发布时间"
    }
]

export default function AssemblyWeldingInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [pictureVisible, setPictureVisible] = useState(false);
    const [pictureUrl, setPictureUrl] = useState('');
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-system/notice/getNoticeById/${params.id}`)
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
            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseColums} dataSource={detailData} col={2} />
            <DetailTitle title="相关附件" />
            <CommonTable columns={[
                {
                    key: 'name',
                    title: '附件名称',
                    dataIndex: 'name',
                    width: 250
                },
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <Button type="link" onClick={() => window.open(record.filePath)}>下载</Button>
                            {
                                record.fileSuffix === 'pdf'
                                    ?
                                    <Button type="link" onClick={() => window.open(record.filePath)}>预览</Button>
                                    : ['jpg', 'jpeg', 'png', 'gif'].includes(record.fileSuffix)
                                        ?
                                        <Button type='link' onClick={() => { setPictureUrl(record.filePath); setPictureVisible(true) }}>预览</Button>
                                        : null
                            }
                        </Space>
                    )
                }
            ]}
                dataSource={detailData.attachVos}
                pagination={false}
            />
            <DetailTitle title="操作信息" />
            <CommonTable columns={tableColumns} dataSource={detailData.businessRecordVos} pagination={false} />
        </DetailContent>
        <Modal visible={pictureVisible} onCancel={() => setPictureVisible(false)} footer={false}>
            <Image src={pictureUrl} preview={false} />
        </Modal>
    </>
}