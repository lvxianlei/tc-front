import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Image } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle, Attachment } from '../../common';
import { baseInfoData } from './confirm.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

export default function ConfirmMessage(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>();
    const [pictureVisible, setPictureVisible] = useState<boolean>(false);
    const [pictureUrl, setPictureUrl] = useState('');
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawProductDetail/getDrawTaskById?drawTaskId=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const handlePictureModalCancel = () => {setPictureVisible(false)}
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="基本信息" />
                <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
                <Attachment dataSource={detailData?.fileVOList} />
            </DetailContent>
            <Modal visible={pictureVisible} onCancel={handlePictureModalCancel} footer={false}>
                <Image src={pictureUrl} preview={false}/>
            </Modal>
        </Spin>
    </>
}