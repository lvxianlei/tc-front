/**
 * 请款申请详情
 */
import React, { useState } from 'react';
import { Modal, Form, Button } from 'antd';
import { DetailTitle,BaseInfo,CommonTable,Attachment } from '../common';
import { overViewBaseColunms,overViewBillColunms,overViewApplyColunms } from './fundListHead.json';

export default function OverView(props: any): JSX.Element {
    const [attachVosData, setAttachVosData] = useState<any[]>([])
    // 取消
    const handleCancle = () => {
        props.onCancel && props.onCancel();
    }
    return (
        <Modal
            title={'查看回款信息'}
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
            <DetailTitle title="基本信息" />
            <BaseInfo dataSource={{}} col={ 2 }
                columns={[
                    ...overViewBaseColunms,
                    ...props.title.map((item: any) => {
                        if (item.dataIndex === 'returnType') {
                            return ({
                                title: item.title,
                                dataIndex: 'returnType',
                                width: 50,
                                render: (_: any, record: any): React.ReactNode => (<span>{record.returnType === 0 ? '投标保证金' : '合同应收款'}</span>)
                            })
                        }
                        return item;
                    }),
                ]}
            />
            <DetailTitle title="票据信息" />
            <BaseInfo dataSource={{}} col={ 2 }
                columns={[
                    ...overViewBillColunms
                ]}
            />
            {/* <DetailTitle title="审批记录" /> */}
            <Attachment title="附件" dataSource={attachVosData || [] } />
            <DetailTitle title="审批记录" />
            <CommonTable columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...overViewApplyColunms
            ]} dataSource={attachVosData} />
        </Modal>
    )
}