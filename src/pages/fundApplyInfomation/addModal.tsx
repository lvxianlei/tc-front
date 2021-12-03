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
      const postData = await addFund.validateFields();
      try{
        setLoading(true);
        const v = [];
        for (let i = 0; i < attchsRef.current?.getDataSource().length; i+= 1) {
          v.push(attchsRef.current?.getDataSource()[i].id);
        }
        const result: { [key: string]: any } = await RequestUtil.post('/tower-finance/payApply', {
            ...postData,
            payApplyId:props.payApplyId || 0,
            fileIds: v
        });
        setLoading(false);
        addFund.resetFields();
        setAttachVosData([]);
        attchsRef.current.resetFields();
        props.onOk && props.onOk()
      }catch{
        setLoading(false)
      }
    }
    // 取消
    const handleCancle = () => {
        addFund.resetFields();
        setLoading(false);
        setAttachVosData([]);
        attchsRef.current.resetFields();
        props.onCancel && props.onCancel();
    }
    const processingNumber = (arg: any, num: number) => {
      arg = arg.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
      arg = arg.replace(/^\./g, ""); // 验证第一个字符是数字而不是
      arg = arg.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
      arg = arg.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      arg = num === 2 ?
        arg.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        : arg.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3');
      return arg
  }

  const handleBaseInfoChange = (fields: any) => {
      if (fields.payMoney) {
        const payMoney = processingNumber(addFund.getFieldValue("payMoney") + "", 2);
        addFund.setFieldsValue({
          payMoney
        })
      }
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
            <Button key="back" onClick={handleCancle}>
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
                onChange={handleBaseInfoChange}
            />
             <Attachment title="附件" maxCount={10} ref={attchsRef} edit dataSource={attachVosData || [] } />
        </Modal>
    )
}