/**
 * 查看保函申请
 */
import React, { useState } from 'react';
import { Modal, Form, Button, ModalFuncProps } from 'antd';
import { BaseInfo, DetailTitle, CommonTable } from '../common';
import { downLoadFile } from "../../utils"
import { seeBaseForm, guaranteeForm, recoveryForm, seeEnclosure, seeApprovalRecord } from './applicationColunm.json';

export default function SeeGuarantee(props: ModalFuncProps): JSX.Element {
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
            <DetailTitle title="基本信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={{content: 1}}
                col={ 2 }
                columns={ seeBaseForm}
            />
            <DetailTitle title="保函信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={{content: 1}}
                col={ 2 }
                columns={ guaranteeForm}
            />
            <DetailTitle title="保函回收信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={{content: 1}}
                col={ 2 }
                columns={ recoveryForm}
            />
            <DetailTitle title="附件" />
            <CommonTable columns={[{
                title: "操作", dataIndex: "opration",
                render: (_: any, record: any) => (<>
                    <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>预览</Button>
                    <Button type="link" onClick={() => downLoadFile(record.link || record.filePath)}>下载</Button>
                </>)
            }, ...seeEnclosure]} dataSource={attachVosData} />
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
            ]} dataSource={attachVosData} />
        </Modal>
    )
}