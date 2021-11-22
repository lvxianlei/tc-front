import React, { useState, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react'
import { Button, Upload, Modal, Image, message } from 'antd'
import { DetailTitle, CommonTable } from "../common"
import AuthUtil from "../../utils/AuthUtil"
import RequestUtil from "../../utils/RequestUtil"
import useRequest from '@ahooksjs/use-request'
import { downLoadFile } from "../../utils"
export interface FileProps {
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

export interface AttachmentProps {
    isTable?: boolean // true 是列表 false title不生效 
    accept?: string
    title?: string | false // 列表
    dataSource?: FileProps[]
    multiple?: boolean
    edit?: boolean
    maxCount?: number
    children?: JSX.Element
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
    id?: string
    isAutoClear?: 1 | 2
    isDeleted?: number
    originalName?: string
    ossId?: string
    pushUrl: string
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

    const deleteAttachData = useCallback((id: number) => setAttachs(attchs.filter((item: any) => item.uid ? item.uid !== id : item.id !== id)), [setAttachs, attchs])

    const handleBeforeUpload = useCallback((event: File): Promise<boolean> => {
        return new Promise(async (resove, reject) => {
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
        })
    }, [])

    const uploadChange = useCallback((event: any) => {
        console.log(new URLSearchParams(uploadOSSUrlInfo?.pushUrl).get("Expires"))
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                const dataInfo = event.file.response.data
                const fileInfo = dataInfo.name.split(".")
                setAttachs([...attchs, {
                    uid: attchs.length,
                    link: dataInfo.link,
                    name: dataInfo.originalName,
                    description: "",
                    filePath: dataInfo.name,
                    fileSize: dataInfo.size,
                    fileSuffix: fileInfo[fileInfo.length - 1],
                    userName: dataInfo.userName,
                    fileUploadTime: dataInfo.fileUploadTime
                }])
                onDoneChange(attchs)
            }
        }
    }, [setAttachs, attchs])

    useImperativeHandle(ref, () => ({ getDataSource, dataSource: attchs, resetFields }), [JSON.stringify(attchs)])

    const getDataSource = useCallback(() => attchs, [attchs])

    const resetFields = useCallback(() => setAttachs([]), [attchs, setAttachs])

    const handleCat = useCallback((record: FileProps) => {
        if (["png", "jpeg", "jpg", "gif"].includes(record.fileSuffix)) {
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
        {isTable && <DetailTitle
            title={title}
            {...edit ? {
                operation: [
                    <Upload
                        key="sub"
                        name="binary"
                        multiple={multiple}
                        {...inputAccepts}
                        maxCount={maxCount}
                        action={`${uploadOSSUrlInfo?.pushUrl}`}
                        headers={{
                            "Content-Type": "application/octet-stream",
                            "x-oss-callback": "",
                            "x-oss-callback-var": "",
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
            name="binary"
            multiple={multiple}
            {...inputAccepts}
            maxCount={maxCount}
            action={`${uploadOSSUrlInfo?.pushUrl}`}
            headers={{
                "Content-Type": "application/octet-stream",
                "x-oss-callback": "",
                "x-oss-callback-var": "",
                expires: new URL(uploadOSSUrlInfo?.pushUrl).searchParams.get("Expires") || ""
            }}
            method="put"
            beforeUpload={handleBeforeUpload}
            showUploadList={false}
            onChange={uploadChange}
        >
            {children}
        </Upload>}
        {isTable && <CommonTable
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
            dataSource={attchs} />}
    </>
})