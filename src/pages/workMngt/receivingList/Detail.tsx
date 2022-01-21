/**
 * 详情
 */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'antd';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil';
import { BaseInfo, DetailTitle, CommonTable } from '../../common';
import { baseInfo, freightInfo, handlingChargesInfo, goodsDetail } from './Detail.json';
interface OverViewProps {
    visible?: boolean
    acceptStatus?: number
    id?: string
    onCancel: () => void
    onOk: () => void
}
export default function Detail(props: OverViewProps): JSX.Element {
    const [addCollectionForm] = Form.useForm();

    // 收货单基础信息
    const [baseInfomation, setBaseInfomation] = useState({});

    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/${id}`);
            setBaseInfomation(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取详情数据
    useEffect(() => {
        getUser(props.id)
    }, [props.id])

    return (
        <Modal
            title={'详情'}
            visible={props.visible}
            onCancel={props?.onCancel}
            maskClosable={false}
            width={1011}
            destroyOnClose={true}
            footer={[
                <Button key="back" onClick={props?.onCancel}>
                    关闭
                </Button>
            ]}
        >
            <DetailTitle title="收货单基础信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={baseInfomation}
                col={2}
                columns={[...baseInfo]}
            />
            <DetailTitle title="运费信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={baseInfomation}
                col={2}
                columns={[...freightInfo]}
            />
            <DetailTitle title="装卸费信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={baseInfomation}
                col={2}
                columns={[...handlingChargesInfo]}
            />
            <DetailTitle title="货物明细" />
            <CommonTable columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...goodsDetail
            ]} dataSource={userData?.lists || []} />
        </Modal>
    )
}