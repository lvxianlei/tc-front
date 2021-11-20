import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Image } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle, Attachment } from '../../common';
import { specialInfoData, productInfoData } from './pick.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { downLoadFile } from '../../../utils';

const tableColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '操作部门', dataIndex: 'createDeptName', key: 'createDeptName', },
    { title: '操作人', dataIndex: 'createUserName', key: 'createUserName' },
    { title: '操作时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '任务状态', dataIndex: 'currentStatus', key: 'currentStatus', render: (value: number, record: object): React.ReactNode => {
        const renderEnum: any = [
            {
                value: 0,
                label: "已拒绝"
            },
            {
                value: 1,
                label: "待确认"
            },
            {
                value: 2,
                label: "待指派"
            },
            {
                value: 3,
                label: "待完成"
            },
            {
                value: 4,
                label: "已完成"
            },
            {
                value: 5,
                label: "已提交"
            }
        ]
             return <>{value!==-1?renderEnum.find((item: any) => item.value === value).label:''}</>
    }}
]

export default function PickDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [pictureVisible, setPictureVisible] = useState<boolean>(false);
    const [pictureUrl, setPictureUrl] = useState('');
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`tower-science/materialTask/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const handlePictureModalCancel = () => {setPictureVisible(false)}
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="特殊要求" />
                <BaseInfo columns={specialInfoData} dataSource={detailData || {}} />
                <DetailTitle title="产品信息" />
                <BaseInfo columns={productInfoData} dataSource={detailData || {}} />
                {/* <DetailTitle title="相关附件"/> */}
                {/* <CommonTable columns={[
                    {
                        title: '附件名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        render: (_: undefined, record: any): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Button type="link" onClick={() => downLoadFile(record.id?record.filePath:record.link)}>下载</Button>
                                {record.fileSuffix==='pdf'?<Button type='link' onClick={()=>{window.open(record.id?record.filePath:record.link)}}>预览</Button>:null}
                                {['jpg','jpeg', 'png', 'gif'].includes(record.fileSuffix)?<Button type='link' onClick={()=>{setPictureUrl(record.id?record.filePath:record.link);setPictureVisible(true);}}>预览</Button>:null}
                            </Space>
                        )
                    }
                ]} dataSource={detailData?.attachVos} pagination={ false }/> */}
                <Attachment dataSource={detailData?.attachVos} />
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={detailData?.stateRecordVOS} pagination={ false }/>
            </DetailContent>
            <Modal visible={pictureVisible} onCancel={handlePictureModalCancel} footer={false}>
                <Image src={pictureUrl} preview={false}/>
            </Modal>
        </Spin>
    </>
}