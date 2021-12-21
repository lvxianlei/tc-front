import React from 'react';
import { Modal, Form, Button, message } from 'antd';
import useRequest from '@ahooksjs/use-request'
import { BaseInfo, DetailTitle, CommonTable } from '../../common';
import { baseInfo, operationInformation } from './DetailOverView.json';
import { OverViewProps } from './DetailOverViewInface';
import RequestUtil from '../../../utils/RequestUtil';
export default function DetailOverView(props: OverViewProps): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    // 取消
    const handleCancle = () => {
        props.onCancel && props.onCancel();
    }
    // 接受
    const hanlePromise = () => {
    message.success("接受了啊")
    }
    // 获取详情数据
    const { run: getDetail, data: detailData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/backMoney/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    return (
        <Modal
            title={'详情'}
            visible={props.visible}
            onCancel={handleCancle}
            maskClosable={false}
            width={800}
            footer={[
            <Button key="back" onClick={props?.onCancel}>关闭</Button>,
            <Button type="primary" onClick={hanlePromise}>接受</Button>
            ]}
        >
            <DetailTitle title="基础信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={{}}
                col={ 2 }
                columns={baseInfo}
            />
            <DetailTitle title="操作信息" />
            <CommonTable haveIndex columns={operationInformation} dataSource={[]} pagination={ false }/>
        </Modal>
    )
}