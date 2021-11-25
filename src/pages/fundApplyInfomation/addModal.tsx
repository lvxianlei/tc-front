/**
 * 新增请款申请
 */
import React, { useState,useRef } from 'react';
import { Modal, Form, Button, ModalFuncProps } from 'antd';
import { BaseInfo,Attachment,AttachmentRef,EditTable } from '../common';
import { addColums } from './fundListHead.json';
import { payTypeOptions } from '../../configuration/DictionaryOptions';
import RequestUtil from '../../utils/RequestUtil';
interface AddModalProps extends ModalFuncProps {
  payApplyId?: string;
}
export default function AddModal(props: AddModalProps): JSX.Element {
  //处理是addColums enum
    if(props.visible){
        const enums:any = payTypeOptions?.map(item=>{
          return {
            label:item.name,
            value:item.id
          }
        })
        addColums.map((item)=>{
          if(item.dataIndex == "payType"){
            item.enum = enums
          }
        })
    }
    const [addFund] = Form.useForm();
    const [ loading, setLoading ] = useState<boolean>(false);
    const [attachVosData, setAttachVosData] = useState<any[]>([]);
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } });
    // 提交
    const handleSure = async () => {
        setLoading(true);
        const postData = await addFund.validateFields();
      try{
        const result: { [key: string]: any } = await RequestUtil.post('/tower-finance/payApply', {
            ...postData,
            payApplyId:props.payApplyId || 0,
            attachInfoDTOList:attchsRef.current?.getDataSource()
        });
        setLoading(false)
        props.onOk && props.onOk()
      }catch{
        setLoading(false)
      }
    }

    // 取消
    const handleCancle = () => {
        addFund.resetFields();
        props.onCancel && props.onCancel();
    }
    return (
        <Modal
          title={'付款'}
          visible={props.visible}
          onOk={handleSure}
          onCancel={handleCancle}
          maskClosable={false}
          width={800}
          footer={[
            <Button key="submit" type="primary" onClick={handleSure} loading={loading}>
              确认付款
            </Button>,
            <Button key="back" onClick={props?.onCancel}>
              取消
            </Button>
          ]}
        >
            <BaseInfo 
                form={addFund} 
                dataSource={{content: 1}}
                col={ 2 }
                edit
                columns={ addColums}
            />
             <Attachment title="附件" maxCount={10} ref={attchsRef} edit dataSource={attachVosData || [] } />
        </Modal>
    )
}