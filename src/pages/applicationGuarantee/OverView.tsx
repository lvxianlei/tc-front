/**
 * 新增保函申请 --- 待处理
 * author: mschange
 * time: 2022-05-23
 */
 import React, { useRef } from 'react';
 import { Modal, Form, Button } from 'antd';
 import { BaseInfo, DetailTitle, Attachment, AttachmentRef, OperationRecord } from '../common';
 import {
    baseInfo,
    guaranteInfo
 } from "./overView.json";
 import { OverViewProps } from './application';
 
 export default function SeeGuarantee(props: OverViewProps): JSX.Element {
     const [addCollectionForm] = Form.useForm();
     const fillGuarantee = useRef<AttachmentRef>();
     
     return (
         <Modal
             title={'保函申请'}
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
            <DetailTitle title="基本信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={{}}
                col={2}
                columns={[...baseInfo]}
            />
            <DetailTitle title="保函信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={{}}
                col={2}
                columns={[...guaranteInfo]}
            />
            <Attachment
                title={"相关附件"}
                dataSource={[]}
                ref={fillGuarantee}
            />
         </Modal>
     )
 }