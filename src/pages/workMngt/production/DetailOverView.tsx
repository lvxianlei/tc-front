import React, { useEffect } from 'react';
import { Modal, Form, Button, message } from 'antd';
import useRequest from '@ahooksjs/use-request'
import { BaseInfo, DetailTitle, OperationRecord } from '../../common';
import { baseInfo } from './DetailOverView.json';
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
        props.id ?
            runProduceIngredients(props.id)
            : (
                message.error("该条数据有误，请联系管理员！")
            )
    }
    // 获取详情数据
    const { run: getDetail, data: detailData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/task/produce/detail?produceId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 接受
    const { run: runProduceIngredients, data: produceIngredientsData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/produceIngredients/receive?produceId=${id}`)
            resole(result);
            if (result) {
                props.onOk();
            }
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => {
        if (props.id) {
            getDetail(props.id);
        }
    }, [props.id])
    return (
        <Modal
            title={'详情'}
            visible={props.visible}
            onCancel={handleCancle}
            maskClosable={false}
            width={800}
            footer={
                [1].includes(props.loftingState) ? 
                [
                    <Button key="back" onClick={props?.onCancel}>关闭</Button>,
                    <Button type="primary" onClick={hanlePromise}>接受</Button>
                ] : [
                    <Button key="back" onClick={props?.onCancel}>关闭</Button>
                ]
            }
        >
            <DetailTitle title="基础信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={detailData || {}}
                col={2}
                columns={baseInfo}
            />
            <OperationRecord title="操作信息" serviceId={props.id as string} serviceName="tower-supply" />
        </Modal>
    )
}