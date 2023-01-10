import React, { useState, useImperativeHandle, forwardRef, useCallback, useEffect, ReactNode } from 'react'
import { Button, Upload, Modal, Image, message, Row, Col, Spin, Empty, Checkbox, Space } from 'antd'
import { DetailTitle } from "../common"
import RequestUtil from "../../utils/RequestUtil"
import useRequest from '@ahooksjs/use-request'
import { downLoadFile } from "../../utils"
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
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
    [key: string]: any;
    isBatchDel?: boolean; //true 批量删除
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
    marginTop = true,
    onDoneChange = () => { },
    isBatchDel = false,
    ...props
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
                fileSize: event.size,
                isAutoClear: true
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
            window.open(record.downloadUrl)
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
            {!edit && <Button className='btn-operation-link' style={{ marginLeft: "8px" }} type="link" onClick={() => handlePreview(records)}>预览</Button>}
            <Button className='btn-operation-link' style={{ marginLeft: !edit ? "0px" : "8px" }} type="link" onClick={() => downLoadFile(records.downloadUrl, records.originalName)}>下载</Button>
            {edit && <Button className='btn-operation-link' type="link" onClick={() => deleteAttachData(records.uid)}>删除</Button>}
        </>
    }, [attchs])

    const [checkedList, setCheckedList] = useState<CheckboxValueType[]>();
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const plainOptions = attchs?.map(res => res.uid || '');

    const onChange = (list: CheckboxValueType[]) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < plainOptions.length);
        setCheckAll(list.length === plainOptions.length);
    };

    const onCheckAllChange = (e: CheckboxChangeEvent) => {
        setCheckedList(e.target.checked ? plainOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    const bitchDel = () => {
        let newList = attchs
        checkedList?.forEach((res: any) => {
            newList = newList.filter((item: any) => item.uid !== res)
        })
        setAttachs(newList);
        setCheckedList([]);
        setIndeterminate(false);
        setCheckAll(false);
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
        {isTable && title && <DetailTitle
            // style={{ marginTop: "24px" }}
            title={title}
            {...edit ? {
                operation: [
                    <Space direction="horizontal" key="space">
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
                        {isBatchDel ? <Button onClick={bitchDel} type="primary" ghost>批量删除</Button> : null}
                    </Space>
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

        {isTable && <div style={{ border: "1px solid #eee", margin: "0px 0px 24px 0px", ...props?.style }}>
            <Row style={{ backgroundColor: "#fafafa", padding: 8, }}>
                {isBatchDel ? <Col span={4}><Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} /></Col> : null}
                <Col span={10}>文件名称</Col>
                <Col span={10} style={{ paddingLeft: 16, boxSizing: "border-box" }}>操作</Col>
            </Row>
            {!attchs.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            {isBatchDel ?
                <Checkbox.Group style={{ width: '100%' }} value={checkedList} onChange={onChange}>
                    {attchs.map((item, index: number) => <Spin key={item.uid} spinning={item.loading} size="small">
                        <Row style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f8f8f8" }} >
                            <Col span={4}>
                                <Checkbox value={item.uid} style={{
                                    padding: "8px 8px"
                                }} />
                            </Col>
                            <Col span={10} style={{
                                padding: "8px 8px",
                                width: "100%",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden"
                            }}>{item.originalName}</Col>
                            <Col span={10} style={{ padding: "0px 8px" }}>{operationRender(item)}</Col>
                        </Row>
                    </Spin>)}
                </Checkbox.Group>
                :
                <>{
                    attchs.map((item, index: number) => <Spin key={item.uid} spinning={item.loading} size="small">
                        <Row style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f8f8f8" }} >
                            <Col span={10} style={{
                                padding: "8px 8px",
                                width: "100%",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden"
                            }}>{item.originalName}</Col>
                            <Col span={10} style={{ padding: "0px 8px" }}>{operationRender(item)}</Col>
                        </Row>
                    </Spin>)
                }
                </>
            }
        </div>}
    </>
})