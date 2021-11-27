/**
 * 查看保函申请
 */
import React, { useState } from 'react';
import { Modal, Form, Button, ModalFuncProps } from 'antd';
import { BaseInfo, DetailTitle, CommonTable } from '../common';
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
    onCancel: () => void
    onOk: () => void
}
export default function SeeGuarantee(props: OverViewProps): JSX.Element {
    const [addCollectionForm] = Form.useForm(); 
    const [attachVosData, setAttachVosData] = useState<any[]>([])

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
                            columns={ seeBaseForm}
                        />
                    </>
                )
            }
            {
                props?.userData?.guaranteeVO && (
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
            {props?.userData?.guaranteeRecoveryVO && (
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
                props?.userData?.attachInfoVOList && (
                    <>
                        <DetailTitle title="附件" />
                        <CommonTable columns={[{
                            title: "操作", dataIndex: "opration",
                            render: (_: any, record: any) => (<>
                                <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>预览</Button>
                                <Button type="link" onClick={() => downLoadFile(record.link || record.filePath)}>下载</Button>
                            </>)
                        }, ...seeEnclosure]} dataSource={props?.userData?.attachInfoVOList || []} />
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