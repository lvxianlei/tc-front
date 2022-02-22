/**
 * 请款申请详情
 */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Button, ModalFuncProps } from 'antd';
import { DetailTitle, BaseInfo, CommonTable, Attachment, OperationRecord } from '../common';
import {
    overViewBaseColunms, overViewBillColunms,
    payStatuOptions
} from './fundListHead.json';

import RequestUtil from '../../utils/RequestUtil';
interface AddModalProps extends ModalFuncProps {
    payApplyId: string;
    ref?: { getDetail: () => Promise<any> }
}
export default forwardRef(function OverView({ payApplyId, ...props }: AddModalProps, ref): JSX.Element {
    const [baseInfo, setBaseInfo] = useState<any>({});//基本信息
    const [payApplyBillVOList, setBillVOList] = useState<any>([]);//票据信息
    const [attachInfoVOList, setInfoVOList] = useState<any>([]);//附件信息
    //请求详情
    const getDetail = async () => {
        const detail: any = await RequestUtil.get(`/tower-finance/payApply/${payApplyId}`);
        detail.payStatus = payStatuOptions[detail.payStatus]
        setBaseInfo(detail);
        setBillVOList(detail.payApplyBillVOList);
        setInfoVOList(detail.attachInfoVOList);
    };
    //取消
    const handleCancle = () => {
        props.onCancel && props.onCancel();
    }
    useImperativeHandle(ref, () => ({ getDetail }), [ref, getDetail]);
    return (
        <Modal
            title={'详情'}
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
            <BaseInfo dataSource={baseInfo} col={2}
                columns={[
                    ...overViewBaseColunms
                ]}
            />
            <DetailTitle title="票据信息" />
            <CommonTable
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...overViewBillColunms
                ]}
                dataSource={payApplyBillVOList}
            />
            {/* <DetailTitle title="附件" /> */}
            <Attachment title="附件" dataSource={attachInfoVOList || []} />
            {/* <DetailTitle title="审批记录" /> */}
            {/* <DetailTitle title="审批记录" /> */}
            <OperationRecord title="审批记录" serviceId={baseInfo.sourceId} serviceName="tower-finance" operateTypeEnum="APPROVAL" />
            {/* <CommonTable columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...overViewApplyColunms
            ]} dataSource={approveRecordVOList} /> */}
        </Modal>
    )
}
)