/**
 * 查看保函申请
 */
import React, { useState, useRef } from 'react';
import { Modal, Form, Button, ModalFuncProps } from 'antd';
import { BaseInfo, DetailTitle, CommonTable, Attachment, AttachmentRef } from '../common';
import { downLoadFile } from "../../utils"
import { seeBaseForm, guaranteeForm, recoveryForm, seeEnclosure, seeApprovalRecord } from './applicationColunm.json';
interface UserData {
    guaranteeInitVO?: object // 基本信息
    guaranteeVO?: object // 保函信息
    guaranteeRecoveryVO?: object // 保函回收信息
    attachInfoVOList?: [] // 附件信息
    approveRecordVO?: [] // 审批记录
}
interface OverViewProps {
    visible?: boolean
    userData?: UserData | undefined
    acceptStatus?: number
    onCancel: () => void
    onOk: () => void
}
export default function SeeGuarantee(props: OverViewProps): JSX.Element {
    const [addCollectionForm] = Form.useForm(); 
    const [attachVosData, setAttachVosData] = useState<any[]>([])
    const fillGuarantee = useRef<AttachmentRef>();

    const deleteAttachData = (id: number) => {
        setAttachVosData(attachVosData.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    }

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
                            col={ 2 }
                            columns={
                                seeBaseForm.map((item: any) => {
                                    if (item.dataIndex === 'guaranteeType') {
                                        return ({
                                            ...item,
                                            type: "select",
                                            enum: [
                                                { value: '1', label: "履约保函" },
                                                { value: '2', label: "投标保函" },
                                                { value: '3', label: "质保金保函" },
                                                { value: '4', label: "预付款保函" }
                                            ]
                                        })
                                    }
                                    return item;
                                })
                            }
                        />
                    </>
                )
            }
            {
                (props.acceptStatus === 3 || props.acceptStatus === 2) && props?.userData?.guaranteeVO && (
                    <>
                        <DetailTitle title="保函信息" />
                        <BaseInfo
                            form={addCollectionForm}
                            dataSource={props?.userData?.guaranteeVO || {}}
                            col={ 2 }
                            columns={ guaranteeForm}
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
                        col={ 2 }
                        columns={[
                            ...recoveryForm.map((item: any) => {
                                if (item.dataIndex === "isOriginalScript") {
                                    const v = [
                                        { value: 1, label: "是" },
                                        { value: 0, label: "否" }
                                    ]
                                    return ({ ...item, type: "select", enum: v })
                                }
                                return item
                            })
                        ]}
                    />
                </>
            )}
            {
                (props.acceptStatus === 3 || props.acceptStatus === 2) && props?.userData?.attachInfoVOList && (
                    <>
                        <Attachment
                            dataSource={ props?.userData?.attachInfoVOList || [] }
                            ref={fillGuarantee}
                        />
                    </>
                )
            }
            {
                props?.userData?.approveRecordVO && (
                    <>
                        <DetailTitle title="审批记录" />
                        <CommonTable columns={[
                            {
                                key: 'index',
                                title: '序号',
                                dataIndex: 'index',
                                width: 50,
                                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                            },
                            ...seeApprovalRecord
                        ]} dataSource={props?.userData?.approveRecordVO  || []} />
                    </>
                )
            }
        </Modal>
    )
}