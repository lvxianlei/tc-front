/**
 * 请款申请详情
 */
import React, { useState,useEffect } from 'react';
import { Modal, Button,ModalFuncProps } from 'antd';
import { DetailTitle,BaseInfo,CommonTable,Attachment } from '../common';
import { overViewBaseColunms,overViewBillColunms,overViewApplyColunms } from './fundListHead.json';
import useRequest from '@ahooksjs/use-request';
 import RequestUtil from '../../utils/RequestUtil';
interface AddModalProps extends ModalFuncProps {
    payApplyId?: string;
  }
export default function OverView(props: AddModalProps): JSX.Element {
    const [loadig, setloadig] = useState<boolean>(false);
    const [baseInfo, setBaseInfo] = useState<any>({});//基本信息
    const [payApplyBillVOList, setBillVOList] = useState<any>([]);//票据信息
    const [attachInfoVOList, setInfoVOList] = useState<any>([]);//附件信息
    const [approveRecordVOList, setRecordVOList] = useState<any>([]);//审批记录
    //请求详情
    const getDetail = async () =>  {
        const detail: any = await RequestUtil.get(`/tower-finance/payApply/${props.payApplyId}`);
        setBaseInfo(detail);
        setBillVOList(detail.payApplyBillVOList);
        setInfoVOList(detail.attachInfoVOList);
        setRecordVOList(detail.approveRecordVOList);

    };
    if(props.visible && !loadig){
        setloadig(true)
        getDetail()
    }
    const handleCancle = () => {
        setloadig(false)
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
            <BaseInfo dataSource={baseInfo} col={ 2 }
                columns={[
                    ...overViewBaseColunms
                ]}
            />
            <DetailTitle title="票据信息" />
            <BaseInfo dataSource={payApplyBillVOList} col={ 2 }
                columns={[
                    ...overViewBillColunms
                ]}
            />
            {/* <DetailTitle title="附件" /> */}
            <Attachment title="附件" dataSource={attachInfoVOList || [] } />
            {/* <DetailTitle title="审批记录" /> */}
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
            ]} dataSource={approveRecordVOList} />
        </Modal>
    )
}