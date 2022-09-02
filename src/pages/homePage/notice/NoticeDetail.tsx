import React from 'react';
import { Spin, Button, Space, Descriptions } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, Attachment } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

const baseColums = [
    {
        "dataIndex": "title",
        "title": "标题"
    },
    // {
    //     "dataIndex": "content",
    //     "title": "内容"
    // },
    {
        "dataIndex": "userNames",
        "title": "接收人"
    },
    {
        "dataIndex": "releaseTime",
        "title": "发布时间"
    }
]

export default function NoticeDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<any>(`/tower-system/notice/getNoticeById/${params.id}`)
        resole({
            ...data,
            userNames: data?.staffList?.map((item: any) => { return item.userName }).join(',')
        })
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
            <Descriptions bordered>
                <Descriptions.Item label="内容">
                <BraftEditor
                    value={BraftEditor.createEditorState(detailData.content)}
                    readOnly
                /> 
                </Descriptions.Item>
            </Descriptions>
            <Attachment dataSource={ detailData.attachInfoVos }/>
        </DetailContent>
    </>
}