import React, { useState, useImperativeHandle, forwardRef, useCallback, useEffect, ReactNode } from 'react'
import { Button, Upload, Modal, Image, message, Row, Col, Spin, Empty } from 'antd'
import { DetailTitle } from "../common"
import RequestUtil from "../../utils/RequestUtil"
import useRequest from '@ahooksjs/use-request'
import { downLoadFile } from "../../utils"
import moment from 'moment'
export interface FileProps {
    id?: string,
    uid?: number | string,
    originalName?: string,
    fileName?: string,
    filePath?: string,
    fileSuffix?: string
    fileSize?: string | number
    downloadUrl?: string
    loading?: boolean
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
    uploadUser?: string,
    uid?: string
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
    const [attchs, setAttachs] = useState<FileProps[]>(dataSource?.map(item => ({ ...item, uid: item.id, loading: false })) || [])
    const [visible, setVisible] = useState<boolean>(false)
    const [uploadOSSUrlInfo, setUploadOSSUrlInfo] = useState<URLProps>({
        pushUrl: "http://www."
    })
    const [uploadOSSUrlList, setUploadOSSUrlList] = useState<any>([])
    const [picInfo, setPicInfo] = useState<{ [key: string]: any }>({ url: "", title: "" })
    const { run: saveFile } = useRequest<URLProps>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: URLProps = await RequestUtil.post(`/sinzetech-resource/oss/endpoint/get-upload-url`, data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: uploadRun } = useRequest<URLProps>((action: string, data: any) => new Promise(async (resole, reject) => {
        try {
            const result: URLProps = await RequestUtil.putFile(action, data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => setAttachs(dataSource?.map(item => ({ ...item, uid: item.id, loading: false })) || []), [JSON.stringify(dataSource)])

    useEffect(() => setUploadOSSUrlList([...uploadOSSUrlList]), [JSON.stringify([...uploadOSSUrlList])])

    const deleteAttachData = useCallback((uid: string) => setAttachs(attchs.filter((item: any) => item.uid ? item.uid !== uid : item.id !== uid)), [setAttachs, attchs])

    const handleBeforeUpload = useCallback((event: File): Promise<boolean> => new Promise(async (resove, reject) => {
        try {
            if (attchs.length === maxCount) {
                message.warn(`最多可上传${maxCount}个文件...`)
                return
            }
            setAttachs([...attchs, {
                uid: (event as any).uid,
                originalName: event.name || "",
                loading: true
            }])
            const result: URLProps = await saveFile({
                fileName: event.name,
                fileSize: event.size
            })
            setUploadOSSUrlInfo(result)
            if (multiple) {
                uploadOSSUrlList.push(result)
                setUploadOSSUrlList([...uploadOSSUrlList])
            }
            resove(true)
        } catch (error) {
            reject(false)
        }
        return false
    }), [attchs, setAttachs, setUploadOSSUrlInfo])

    const uploadChange = useCallback((event: any) => {
        console.log(event)
        if (event.file.status === "done") {
            if (event.file.xhr.status === 200) {
                setAttachs(attchs.map(item => {
                    if (item.uid === event.file.uid) {
                        return ({
                            ...item,
                            loading: false,
                            filePath: uploadOSSUrlInfo?.downloadUrl || "",
                            originalName: uploadOSSUrlInfo?.originalName || "",
                            fileSuffix: uploadOSSUrlInfo?.fileSuffix || "",
                            fileSize: uploadOSSUrlInfo?.fileSize || "",
                            downloadUrl: uploadOSSUrlInfo?.downloadUrl || "",
                            id: uploadOSSUrlInfo?.id || "",
                        })
                    }
                    return item
                }))
                if (multiple) {
                    const list = uploadOSSUrlList.map((res: any) => {
                        return {
                            id: res?.id || "",
                            uid: event.file.uid,
                            filePath: res?.downloadUrl || "",
                            originalName: res?.originalName || "",
                            fileSuffix: res?.fileSuffix || "",
                            fileSize: res?.fileSize || "",
                            downloadUrl: res?.downloadUrl || ""
                        }
                    })
                    onDoneChange([...list])
                } else {
                    onDoneChange([{
                        id: uploadOSSUrlInfo?.id || "",
                        uid: event.file.uid,
                        filePath: uploadOSSUrlInfo?.downloadUrl || "",
                        originalName: uploadOSSUrlInfo?.originalName || "",
                        fileSuffix: uploadOSSUrlInfo?.fileSuffix || "",
                        fileSize: uploadOSSUrlInfo?.fileSize || "",
                        downloadUrl: uploadOSSUrlInfo?.downloadUrl || ""
                    }])
                }
            }
        }
    }, [setAttachs, attchs, setUploadOSSUrlInfo, onDoneChange, uploadOSSUrlInfo, uploadOSSUrlList])

    const getDataSource = useCallback(() => attchs, [attchs])

    const resetFields = useCallback(() => setAttachs([]), [attchs, setAttachs])

    useImperativeHandle(ref, () => ({ getDataSource, dataSource: attchs, resetFields }), [JSON.stringify(attchs), getDataSource, dataSource, resetFields])

    const handlePreview = useCallback((record: FileProps) => {
        if (["png", "jpeg", "jpg", "gif"].includes(record?.fileSuffix || "")) {
            setPicInfo({
                url: record.downloadUrl,
                title: record.originalName
            })
            setVisible(true)
        } else if (["pdf"].includes(record?.fileSuffix || "")) {
            // window.open(record.downloadUrl)
            fileLinkToStreamDownload(record?.downloadUrl, record?.originalName, 'pdf')
        } else {
            message.warning("暂只支持*.png,*.jpeg,*.jpg,*.gif*.pdf预览...")
        }
    }, [setPicInfo, setVisible])

    const handleCancel = useCallback(() => setVisible(false), [setVisible])

    const operationRender = useCallback((records: any) => {
        if (renderActions) {
            return renderActions(records, {
                preview: handlePreview,
                remove: deleteAttachData,
                download: downLoadFile
            })
        }
        return <>
            {!edit && <Button size="small" type="link" onClick={() => handlePreview(records)}>预览</Button>}
            <Button size="small" type="link" onClick={() => downLoadFile(records.downloadUrl)}>下载</Button>
            {edit && <Button size="small" type="link" onClick={() => deleteAttachData(records.uid)}>删除</Button>}
        </>
    }, [attchs])
    const fileLinkToStreamDownload=(url: any, fileName: any, type: string)=> {
        let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
        if (!reg.test(url)) {
            throw new Error("传入参数不合法,不是标准的文件链接");
        } else {
            let xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.setRequestHeader('Content-Type', `application/${type}`);
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (this.status == 200) {
                //接受二进制文件流
                    var blob = this.response;
                    downloadExportFile(blob, fileName, type)
                }
            }
            xhr.send();
        }
    }

    const downloadExportFile=(blob: any, tagFileName: any, fileType: any)=>{
        let downloadElement = document.createElement('a');
        let href = blob;
        if (typeof blob == 'string') {
            downloadElement.target = '_blank';
        } else {
            href = window.URL.createObjectURL(blob); //创建下载的链接
        }
        downloadElement.href = href;
        downloadElement.download = tagFileName + moment(new Date().getTime()).format('YYYYMMDDhhmmss') + '.' + fileType; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        if (typeof blob != 'string') {
            window.URL.revokeObjectURL(href); //释放掉blob对象
        }
        
    }
    return <>
        <Modal
            title={`${picInfo.title}`}
            width={1011}
            visible={visible}
            onCancel={handleCancel}
            footer={false}>
            <Image src={picInfo.url} preview={false} />
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
                        customRequest={async (options: any) => {
                            const file: any = options.file
                            const result: any = await uploadRun(options.action, options.file)
                            file.status = "done"
                            file.xhr = { status: 200, response: result }
                            uploadChange({ file })
                        }}
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
            showUploadList={false}
            customRequest={async (options: any) => {
                const file: any = options.file
                const result: any = await uploadRun(options.action, options.file)
                file.status = "done"
                file.xhr = { status: 200, response: result }
                uploadChange({ file })
            }}
            beforeUpload={handleBeforeUpload}
            onChange={uploadChange}
        >
            {children}
        </Upload>
        }
        {isTable && <div>
            <Row style={{ backgroundColor: "#fafafa", padding: 8, }}>
                <Col span={12}>文件名称</Col>
                <Col span={12}>操作</Col>
            </Row>
            {!attchs.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            {attchs.map((item, index: number) => <Spin key={item.uid} spinning={item.loading} size="small">
                <Row style={{ height: 28, lineHeight: "28px", backgroundColor: index % 2 === 0 ? "#fff" : "#f8f8f8" }} >
                    <Col span={12} style={{ padding: "0 8px" }}>{item.originalName}</Col>
                    <Col span={12} style={{ padding: "0 8px" }}>{operationRender(item)}</Col>
                </Row>
            </Spin>)}
        </div>}
    </>
})