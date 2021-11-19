import React, { useState, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react'
import { Button, Upload, Modal, Image, message } from 'antd'
import { DetailTitle, CommonTable } from "../common"
import AuthUtil from "../../utils/AuthUtil"
import { downLoadFile } from "../../utils"

interface FileProps {
    id?: string,
    uid?: number | string,
    link: string,
    name: string,
    description: string,
    filePath: string,
    fileSize: string | number,
    fileSuffix: string,
    userName: string,
    fileUploadTime: string
}

interface AttachmentProps {
    title?: string | false
    dataSource?: FileProps[]
    edit?: boolean
    columns?: any[]
    maxCount?: number
    showHeader?: boolean
}
export interface AttachmentRef {
    getDataSource: () => FileProps[]
    dataSource?: FileProps[]
    resetFields: () => void
}
export default forwardRef(function ({ dataSource = [], columns = [], showHeader = false, title = "相关附件", maxCount = 5, edit = false }: AttachmentProps, ref): JSX.Element {
    const [attchs, setAttachs] = useState<FileProps[]>(dataSource)
    const [visible, setVisible] = useState<boolean>(false)
    const [picUrl, setPicUrl] = useState<string>()

    useEffect(() => setAttachs(dataSource), [JSON.stringify(dataSource)])

    const deleteAttachData = useCallback((id: number) => setAttachs(attchs.filter((item: any) => item.uid ? item.uid !== id : item.id !== id)), [setAttachs, attchs])

    const uploadChange = useCallback((event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                const dataInfo = event.file.response.data
                const fileInfo = dataInfo.name.split(".")
                setAttachs([...attchs, {
                    uid: attchs.length,
                    link: dataInfo.link,
                    name: dataInfo.originalName.split(".")[0],
                    description: "",
                    filePath: dataInfo.name,
                    fileSize: dataInfo.size,
                    fileSuffix: fileInfo[fileInfo.length - 1],
                    userName: dataInfo.userName,
                    fileUploadTime: dataInfo.fileUploadTime
                }])
            }
        }
    }, [setAttachs, attchs])

    useImperativeHandle(ref, () => ({ getDataSource, dataSource: attchs, resetFields }), [JSON.stringify(attchs)])

    const getDataSource = useCallback(() => attchs, [attchs])

    const resetFields = useCallback(() => setAttachs([]), [attchs, setAttachs])

    const handleCat = useCallback((record: FileProps) => {
        if (["png", "jpeg", "jpg"].includes(record.fileSuffix)) {
            setPicUrl(record.filePath)
            setVisible(true)
        } else if (["pdf"].includes(record.fileSuffix)) {
            window.open(record.filePath)
        } else {
            message.warning("暂只支持*.png,*.jpeg,*.jpg,*.pdf预览...")
        }
    }, [setPicUrl, setVisible])

    const handleCancel = useCallback(() => setVisible(false), [setVisible])

    return <>
        <Modal width={1011} visible={visible} onCancel={handleCancel} footer={false}>
            <Image src={picUrl} preview={false} />
        </Modal>
        <DetailTitle
            title={title}
            {...edit ? {
                operation: [
                    <Upload
                        key="sub"
                        name="file"
                        multiple={false}
                        maxCount={maxCount}
                        action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
                        headers={{
                            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }}
                        showUploadList={false}
                        onChange={uploadChange}
                    >
                        <Button key="enclosure" type="primary" ghost>上传附件</Button>
                    </Upload>
                ]
            } : {}} />
        <CommonTable
            rowKey={(_: any, records: any) => records.name || records.id}
            columns={[
                {
                    title: "附件名称",
                    dataIndex: "name"
                },
                {
                    title: "操作",
                    dataIndex: "opration",
                    render: (_: any, record: any) => (<>
                        {!edit && <a onClick={() => handleCat(record)}>查看</a>}
                        <Button type="link" onClick={() => downLoadFile(record.link || record.filePath)}>下载</Button>
                        {edit && <a onClick={() => deleteAttachData(record.uid || record.id)}>删除</a>}
                    </>)
                }]}
            dataSource={attchs} />
    </>
})