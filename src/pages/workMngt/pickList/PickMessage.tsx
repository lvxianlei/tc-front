import React, { useState } from 'react'
import { Button, Spin, Modal, Image } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle, Attachment } from '../../common';
import { specialInfoData, productInfoData } from './pick.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

const tableColumns = [
    { 
        title: '序号', 
        dataIndex: 'index', 
        key: 'index', 
        render: (_a: any, _b: any, index: number): React.ReactNode => (
            <span>{index + 1}</span>
        ) 
    },
    { 
        title: '操作部门', 
        dataIndex: 'createDeptName', 
        key: 'createDeptName', 
    },
    { 
        title: '操作人', 
        dataIndex: 'createUserName', 
        key: 'createUserName' 
    },
    { 
        title: '操作时间', 
        dataIndex: 'createTime', 
        key: 'createTime' 
    },
    { 
        title: '任务状态', 
        dataIndex: 'currentStatus', 
        key: 'currentStatus', 
        render: (status: number): React.ReactNode => {
            switch (status) {
                case 0:
                    return '已拒绝';
                case 1:
                    return '待指派';
                case 2:
                    return '提料中';
                case 3:
                    return '已完成';
            }
        } 
    },
    { 
        title: '备注', 
        dataIndex: 'description', 
        key: 'description' 
    }
]

export default function PickDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [pictureVisible, setPictureVisible] = useState<boolean>(false);
    const [pictureUrl, setPictureUrl] = useState('');
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/materialProductCategory/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const handlePictureModalCancel = () => {setPictureVisible(false)}
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                {/* <DetailTitle title="特殊要求" />
                <BaseInfo columns={specialInfoData} dataSource={detailData || {}} /> */}
                <DetailTitle title="产品信息" />
                <BaseInfo columns={productInfoData} dataSource={detailData || {}} />
                <Attachment dataSource={detailData?.attachVos} />
                <DetailTitle title="操作信息" />
                <CommonTable 
                    columns={tableColumns} 
                    dataSource={detailData?.stateRecordVOS} 
                    pagination={ false }
                />
            </DetailContent>
            <Modal 
                visible={pictureVisible} 
                onCancel={handlePictureModalCancel} 
                footer={false}
            >
                <Image src={pictureUrl} preview={false}/>
            </Modal>
        </Spin>
    </>
}