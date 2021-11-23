/**
 * 回收保函
 */
 import React, { useState } from 'react';
 import { Modal, Form, Button, ModalFuncProps } from 'antd';
 import { BaseInfo } from '../common';
 import { recoveryGuarantee } from './applicationColunm.json';
 
 export default function RecoveryGuaranteeLayer(props: ModalFuncProps): JSX.Element {
    const [addCollectionForm] = Form.useForm();
 
     // 提交
     const handleSure = async () => {
         const postData = await addCollectionForm.validateFields();
         console.log(postData, 'post')
         props.onOk && props.onOk();
     }
 
     return (
         <Modal
           title={'填写保函信息'}
           visible={props.visible}
           onOk={handleSure}
           onCancel={props?.onCancel}
           maskClosable={false}
           width={1100}
           footer={[
            <Button key="submit" type="primary" onClick={handleSure}>
              保存
            </Button>,
            <Button key="back" onClick={props?.onCancel}>
              取消
            </Button>
          ]}
         >
             <BaseInfo
                form={addCollectionForm}
                dataSource={{content: 1}}
                col={ 2 }
                edit
                columns={ recoveryGuarantee}
             />
         </Modal>
     )
 }