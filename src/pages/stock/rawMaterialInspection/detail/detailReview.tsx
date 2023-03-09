/**
 * 新修改的原材料入库详情
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/06
 */
import React, { forwardRef, useRef, useState, useImperativeHandle } from 'react';
import { Button, message, Modal, Spin } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { Attachment, AttachmentRef, SearchTable as Page } from '../../../common';
import RequestUtil from '../../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { useParams, useHistory } from 'react-router-dom';
import { reviewColumn } from "./detail.json";
import '../../StockPublicStyle.less';
import './detail.less';
interface ReceiveStrokAttachProps {
    id: string
}
const ReceiveStrokAttach = forwardRef(({ id }: ReceiveStrokAttachProps, ref): JSX.Element => {
    const attachRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/attach?attachType=2&id=${id}`)
            resole(result?.attachInfoDtos || [])
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const { run: saveRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            // 对上传数据进行处理
            const fieldIds: any = [],
                source = attachRef.current.getDataSource();
            if (source.length < 1) {
                message.error("请您先上传附件！");
                throw new Error( `请您先上传附件！`)
                // resole(false as any)
                // return false;
            }
            source.map((item: any) => fieldIds.push(item.id));
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/attach`, {
                ids: id,
                fieldIds,
                attachType:2
            })
            resole(true as any)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit: saveRun }), [saveRun, attachRef.current.getDataSource])

    return <Spin spinning={loading}>
        <Attachment dataSource={data} edit title="附件" ref={attachRef} style={{ margin: "0px" }} marginTop={false} />
    </Spin>
})
export default function RawMaterialWarehousing(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory();
    const receiveRef = useRef<{ onSubmit: () => void }>({ onSubmit: () => { } })
    const [detailId, setDetailId] = useState<string>("")
    const [visible, setVisible] = useState<boolean>(false)
    const [saveLoding, setSaveLoading] = useState<boolean>(false)

    const handleAttachOk = async () => {
        setSaveLoading(true)
        const res = await receiveRef.current.onSubmit()
        if (!(res as any)) {
            setSaveLoading(false)
            return;
        }
        setSaveLoading(false)
        message.success("保存成功...")
        setVisible(false)
    }

    return (
        <>
            <Modal
                destroyOnClose
                visible={visible}
                title={'附件'}
                confirmLoading={saveLoding}
                onOk={handleAttachOk}
                okText="保存"
                onCancel={() => {
                    setDetailId("")
                    setVisible(false)
                }}>
                <ReceiveStrokAttach id={detailId} ref={receiveRef}  />
            </Modal>
            <Page
                path={`/tower-storage/qualityInspection/${params.id}`}
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...reviewColumn,
                    {
                        title: '操作',
                        dataIndex: 'key',
                        width: 100,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <>
                                <a style={{ marginRight: 12 }} onClick={() => {
                                    setDetailId(record.id)
                                    setVisible(true)
                                }}>附件</a>
                            </>
                        )
                    }
                ]}
                extraOperation={() =>
                    <><Button type="ghost" onClick={() => history.go(-1)}>返回</Button></>
                }
                searchFormItems={[]}
                pagination={false}
            />
        </>
    )
}