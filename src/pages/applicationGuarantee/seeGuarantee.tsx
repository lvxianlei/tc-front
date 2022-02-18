/**
 * 查看保函申请
 */
import React, { useRef } from 'react';
import { Modal, Form, Button } from 'antd';
import { BaseInfo, DetailTitle, Attachment, AttachmentRef, OperationRecord } from '../common';
import { seeBaseForm, guaranteeForm, recoveryForm } from './applicationColunm.json';
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
            {
                props?.userData?.guaranteeInitVO && (
                    <>
                        <DetailTitle title="基本信息" />
                        <BaseInfo
                            form={addCollectionForm}
                            dataSource={props?.userData?.guaranteeInitVO || {}}
                            col={2}
                            columns={[...seeBaseForm]}
                        />
                    </>
                )
            }
            <Attachment
                title={"保函申请相关附件"}
                dataSource={props?.userData?.applyAttachListVO || []}
                ref={fillGuarantee}
            />
            {
                (props.acceptStatus === 3 || props.acceptStatus === 2) && props?.userData?.guaranteeVO && (
                    <>
                        <DetailTitle title="保函信息" />
                        <BaseInfo
                            form={addCollectionForm}
                            dataSource={props?.userData?.guaranteeVO || {}}
                            col={2}
                            columns={guaranteeForm}
                        />
                    </>
                )
            }
            {props.acceptStatus === 3 && props?.userData?.guaranteeRecoveryVO && (
                <>
                    <DetailTitle title="保函回收信息" />
                    <BaseInfo
                        form={addCollectionForm}
                        dataSource={props?.userData?.guaranteeRecoveryVO || {}}
                        col={2}
                        columns={[...recoveryForm]}
                    />
                </>
            )}
            {
                (props.acceptStatus === 3 || props.acceptStatus === 2) && props?.userData?.attachInfoVOList && (
                    <>
                        <Attachment
                            title={"保函相关附件"}
                            dataSource={props?.userData?.attachInfoVOList || []}
                            ref={fillGuarantee}
                        />
                    </>
                )
            }
            {
                props?.userData?.approveRecordVO && (<OperationRecord serviceId={props.id as string} serviceName={"tower-finance"} title="审批记录" />)
            }
        </Modal>
    )
}