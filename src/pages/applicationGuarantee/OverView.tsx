/**
 * 新增保函申请 --- 待处理
 * author: mschange
 * time: 2022-05-23
 */
 import React, { useEffect, useRef } from 'react';
 import { Modal, Form, Button } from 'antd';
 import { BaseInfo, DetailTitle, Attachment, AttachmentRef, OperationRecord } from '../common';
 import {
    baseInfo,
    guaranteInfo
 } from "./overView.json";
 import { OverViewProps } from './application';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
 
 export default function SeeGuarantee(props: OverViewProps): JSX.Element {
     const [addCollectionForm] = Form.useForm();
     const fillGuarantee = useRef<AttachmentRef>();

     useEffect(() => {
       if(props.id) {
            getUser();
       }
     }, [props.id])

     const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/guarantee/${props?.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
     
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
                dataSource={userData?.guaranteeInitVO || {}}
                col={2}
                columns={[...baseInfo]}
            />
            <DetailTitle title="保函信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={userData?.guaranteeVO || {}}
                col={2}
                columns={[...guaranteInfo]}
            />
            <Attachment
                title={"相关附件"}
                dataSource={userData?.applyAttachListVO || []}
                ref={fillGuarantee}
            />
         </Modal>
     )
 }