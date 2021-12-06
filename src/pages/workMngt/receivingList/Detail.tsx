/**
 * 详情
 */
import React, { useState, useRef } from 'react';
import { Modal, Form, Button } from 'antd';
import { BaseInfo, DetailTitle, CommonTable, Attachment, AttachmentRef } from '../../common';
import { baseInfo } from './Detail.json';
interface OverViewProps {
    visible?: boolean
    acceptStatus?: number
    onCancel: () => void
    onOk: () => void
}
export default function Detail(props: OverViewProps): JSX.Element {
    const [addCollectionForm] = Form.useForm(); 
    return (
        <Modal
            title={'详情'}
            visible={props.visible}
            onCancel={props?.onCancel}
            maskClosable={false}
            width={1100}
            footer={[
            <Button key="back" onClick={props?.onCancel}>
                关闭
            </Button>
            ]}
        >
            <DetailTitle title="收货单基础信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={{}}
                col={ 2 }
                columns={[...baseInfo]}
            />
            <DetailTitle title="审批记录" />
            <CommonTable columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...baseInfo
            ]} dataSource={[]} />
        </Modal>
    )
}