import React, { useState, useImperativeHandle, forwardRef, useCallback, useEffect, ReactNode } from 'react'
import { Button, Upload, Modal, Image, message, List, Avatar } from 'antd'
import { DetailTitle, CommonTable } from "../common"
import AuthUtil from "../../utils/AuthUtil"
import RequestUtil from "../../utils/RequestUtil"
import useRequest from '@ahooksjs/use-request'
import { downLoadFile } from "../../utils"
import { UploadFile } from 'antd/lib/upload/interface'
export interface FileProps {
    id?: string,
    uid?: number | string,
    fileName: string,
    filePath: string,
    fileSuffix: string
    fileSize: string | number
    downloadUrl: string
}
export interface Actions {
    download: (path: string) => void
    preview: (records: FileProps) => void
    remove: (uid: string) => void
}
export interface AttachmentProps {
    isTable?: boolean // true 是列表 false title不生效 
    accept?: string
    title?: string | false // 列表
    dataSource?: FileProps[]
    multiple?: boolean
    edit?: boolean
    maxCount?: number
    children?: JSX.Element
    renderActions?: (records: FileProps, actions: Actions) => ReactNode[]
    onDoneChange?: (params: FileProps[]) => void  //同AttachmentRef 文件上传成功后的回调
}

export interface AttachmentRef {
    getDataSource: () => FileProps[]
    dataSource?: FileProps[]
    resetFields: () => void
}

interface URLProps {
    businessId?: string
    businessType?: string
    callbackTemplate?: string
    callbackVar?: string
    createTime?: string
    createUser?: string
    deleteTime?: string
    deleteUser?: string
    downloadUrl?: string
    expirationTime?: string
    fileName?: string
    fileSize?: string
    fileSuffix?: string
    id?: string
    isAutoClear?: 1 | 2
    isDeleted?: number
    originalName?: string
    ossId?: string
    pushUrl: string
    filePath?: string
    remark?: string
    status?: number
    tenantId?: string
    updateTime?: string
    updateUser?: string
    uploadTime?: string
    uploadUser?: string
}

export default forwardRef(function ({
    dataSource = [],
    multiple = false,
    isTable = true,
    title = "相关附件",
    accept = undefined,
    renderActions,
    children = <Button key="enclosure" type="primary" ghost>上传</Button>,
    maxCount = 5,
    edit = false,
    onDoneChange = () => { }
}: AttachmentProps, ref): JSX.Element {
    const inputAccepts = accept ? ({ accept }) : ({})
    const [attchs, setAttachs] = useState<FileProps[]>(dataSource)
    const [visible, setVisible] = useState<boolean>(false)
    const [uploadOSSUrlInfo, setUploadOSSUrlInfo] = useState<URLProps>({
        pushUrl: "http://www."
    })
    const [picUrl, setPicUrl] = useState<string>()
    const { run: saveFile, data: filesData } = useRequest<URLProps>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: URLProps = await RequestUtil.post(`/sinzetech-resource/oss/endpoint/get-upload-url`, data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => setAttachs(dataSource), [JSON.stringify(dataSource)])

    const deleteAttachData = useCallback((uid: string) => setAttachs(attchs.filter((item: any) => item.uid ? item.uid !== uid : item.id !== uid)), [setAttachs, attchs])

    const handleBeforeUpload = useCallback((event: File): Promise<boolean> => new Promise(async (resove, reject) => {
        try {
            const result: URLProps = await saveFile({
                fileName: event.name,
                fileSize: event.size
            })
            setUploadOSSUrlInfo(result)
            resove(true)
        } catch (error) {
            reject(false)
        }
    }), [])

    const uploadChange = useCallback((event: any) => {
        if (event.file.status === "done") {
            if (event.file.xhr.status === 200) {
                setAttachs([...attchs, {
                    id: uploadOSSUrlInfo?.id || "",
                    uid: event.file.uid,
                    filePath: uploadOSSUrlInfo?.filePath || "",
                    fileName: uploadOSSUrlInfo?.originalName || "",
                    fileSuffix: uploadOSSUrlInfo?.fileSuffix || "",
                    fileSize: uploadOSSUrlInfo?.fileSize || "",
                    downloadUrl: uploadOSSUrlInfo?.downloadUrl || ""
                }])
                onDoneChange(attchs)
            }
        }
    }, [setAttachs, attchs, setUploadOSSUrlInfo, onDoneChange])

    const getDataSource = useCallback(() => attchs, [attchs])

    const resetFields = useCallback(() => setAttachs([]), [attchs, setAttachs])

    useImperativeHandle(ref, () => ({ getDataSource, dataSource: attchs, resetFields }), [JSON.stringify(attchs), getDataSource, dataSource, resetFields])

    const handlePreview = useCallback((record: FileProps) => {
        if (["png", "jpeg", "jpg", "gif"].includes(record.fileSuffix)) {
            setPicUrl(record.filePath)
            setVisible(true)
        } else if (["pdf"].includes(record.fileSuffix)) {
            window.open(record.filePath)
        } else {
            message.warning("暂只支持*.png,*.jpeg,*.jpg,*.gif*.pdf预览...")
        }
    }, [setPicUrl, setVisible])

    const handleCancel = useCallback(() => setVisible(false), [setVisible])

    const operationRender = useCallback((value: any, records: any) => {
        if (renderActions) {
            return renderActions(records, {
                preview: handlePreview,
                remove: deleteAttachData,
                download: downLoadFile
            })
        }
        return <>
            {!edit && <Button type="link" onClick={() => handlePreview(records)}>预览</Button>}
            <Button type="link" onClick={() => downLoadFile(records.downloadUrl)}>下载</Button>
            <Button type="link" onClick={() => deleteAttachData(records.id)}>删除</Button>
        </>
    }, [])

    return <>
        <Modal width={1011} visible={visible} onCancel={handleCancel} footer={false}>
            <Image src={picUrl} preview={false} />
        </Modal>
        {isTable && <DetailTitle
            title={title}
            {...edit ? {
                operation: [
                    <Upload
                        key="sub"
                        name="file"
                        multiple={multiple}
                        {...inputAccepts}
                        maxCount={maxCount}
                        action={`${uploadOSSUrlInfo?.pushUrl}`}
                        headers={{
                            "Content-Type": "application/octet-stream",
                            expires: new URL(uploadOSSUrlInfo?.pushUrl).searchParams.get("Expires") || ""
                        }}
                        method="put"
                        showUploadList={false}
                        beforeUpload={handleBeforeUpload}
                        onChange={uploadChange}
                    >
                        <Button key="enclosure" type="primary" ghost>上传附件</Button>
                    </Upload>
                ]
            } : {}} />}
        {!isTable && <Upload
            key="sub"
            name="file"
            multiple={multiple}
            {...inputAccepts}
            maxCount={maxCount}
            action={`${uploadOSSUrlInfo?.pushUrl}`}
            headers={{
                "Content-Type": "application/octet-stream",
                expires: new URL(uploadOSSUrlInfo?.pushUrl).searchParams.get("Expires") || ""
            }}
            method="put"
            beforeUpload={handleBeforeUpload}
            showUploadList={false}
            onChange={uploadChange}
        >
            {children}
        </Upload>}
        {isTable && <CommonTable columns={[
            { title: "文件名称", dataIndex: "fileName" },
            {
                title: "操作",
                dataIndex: "operation",
                render: operationRender
            }
        ]} dataSource={attchs} />}
    </>
})