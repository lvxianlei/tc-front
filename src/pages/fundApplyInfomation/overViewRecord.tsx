/**
 * 请款申请详情
 */
import React, { useState,forwardRef,useImperativeHandle } from 'react';
import { Modal, Form, Button,ModalFuncProps } from 'antd';
import { DetailTitle,BaseInfo,CommonTable,Attachment } from '../common';
import { fundRecordColumns } from './fundRecord.json';
import { payTypeOptions } from '../../configuration/DictionaryOptions';
import RequestUtil from '../../utils/RequestUtil';
interface ViewModalProps extends ModalFuncProps {
    payApplyId?: string;
    ref?: React.RefObject<{ getDetail: () => Promise<any> }>
  }
export default forwardRef(function OverView(props: ViewModalProps,ref): JSX.Element {
    const [baseInfo, setBaseInfo] = useState<any>({});//基本信息
    const [attachInfoVOList, setInfoVOList] = useState<any>([]);//附件信息
    //请求详情
    const getDetail = async () =>  {
        const detail: any = await RequestUtil.get(`/tower-finance/payApply/payment/${props.payApplyId}`);
        detail.payType = (payTypeOptions as Array<any>)?.find((item:any)=>item.id == detail.payType)['name']
        setBaseInfo(detail);
        setInfoVOList(detail.attachInfoVos);
    };
    // 取消
    const handleCancle = () => {
        props.onCancel && props.onCancel();
    }
    useImperativeHandle(ref, () => ({ getDetail}), [ref,getDetail])
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
            <BaseInfo dataSource={baseInfo} col={ 2 }
                columns={[
                    ...fundRecordColumns
                ]}
            />
            <Attachment title="附件" dataSource={attachInfoVOList || [] } />
        </Modal>
    )
}
)