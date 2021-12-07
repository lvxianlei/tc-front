/**
 * 详情
 */
import React, { useState, useRef } from 'react';
import { Modal, Form, Button } from 'antd';
import { BaseInfo, DetailTitle, CommonTable, Attachment, AttachmentRef } from '../../common';
import { baseInfo, freightInfo, handlingChargesInfo, goodsDetail } from './Detail.json';
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
            width={1300}
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
                col={ 4 }
                columns={[...baseInfo]}
            />
            <DetailTitle title="运费信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={{}}
                col={ 4 }
                columns={[...freightInfo]}
            />
            <DetailTitle title="装卸费信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={{}}
                col={ 4 }
                columns={[...handlingChargesInfo]}
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
                ...goodsDetail
            ]} dataSource={[]} />
        </Modal>
    )
}