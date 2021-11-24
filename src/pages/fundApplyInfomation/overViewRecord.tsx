/**
 * 请款申请详情
 */
import React, { useState } from 'react';
import { Modal, Form, Button } from 'antd';
import { DetailTitle,BaseInfo,CommonTable,Attachment } from '../common';
import { fundRecordColumns } from './fundRecord.json';

export default function OverView(props: any): JSX.Element {
    const [attachVosData, setAttachVosData] = useState<any[]>([])
    // 取消
    const handleCancle = () => {
        props.onCancel && props.onCancel();
    }
    return (
        <Modal
            title={'付款记录'}
            visible={props.visible}
            onCancel={handleCancle}
            maskClosable={false}
            width={800}
            footer={[
                <Button key="back" onClick={props?.onCancel}>
                取消
                </Button>
            ]}
        >
            <DetailTitle title="付款记录" />
            <BaseInfo dataSource={{}} col={ 2 }
                columns={[
                    ...fundRecordColumns
                ]}
            />
            <Attachment title="附件" dataSource={attachVosData || [] } />
        </Modal>
    )
}