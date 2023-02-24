import React, { useState, useImperativeHandle, forwardRef, useCallback, useEffect, ReactNode } from 'react'
import { Button, Upload, Modal, Image, message, Row, Col, Spin, Empty, Checkbox, Space, Progress } from 'antd'
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

async function putFilePromise(urls: any[], fileList: any[], progressCallback: Function): Promise<any> {
    let successCount: number = 0
    let failCount: number = 0
    async function putFile(urls: any[], fileList: any[], progressCallback: Function): Promise<any> {
        return new Promise(async (resove, reject) => {
            try {
                const result = await Promise.all(urls.slice(0, 500).map((item: any) => new Promise(async (resolve, reject) => {
                    try {
                        const file: any = fileList.find((fileItem: any) => fileItem.name === item.originalName)
                        const result: URLProps = await RequestUtil.putFile(item.pushUrl, file)
                        successCount++
                        progressCallback(successCount, failCount)
                        resolve(result)
                    } catch (error) {
                        failCount++
                        reject(false)
                    }
                })))
                if (urls.length <= 500) {
                    resove(result)
                } else {
                    const saveUrls = urls.slice(500)
                    resove([...result, ...await putFile(saveUrls, fileList.slice(500), progressCallback)])
                }
            } catch (error) {
                reject(error)
            }
        })
    }
    return putFile(urls, fileList, progressCallback)
}

export default forwardRef(function ({
    dataSource = [],
    isTable = true,
    title = "相关附件",
    accept = undefined,
    renderActions,
    children = <Button key="enclosure" type="primary" ghost>上传</Button>,
    edit = false,
    marginTop = true,
    onDoneChange = () => { },
    isBatchDel = false,
    ...props
}: AttachmentProps, ref): JSX.Element {
    const inputAccepts = accept ? ({ accept }) : ({})
    const [attchs, setAttachs] = useState<FileProps[]>(dataSource?.map(item => ({ ...item, uid: item.id, loading: false })) || [])
    const [visible, setVisible] = useState<boolean>(false)
    const [batchStart, setBatchStart] = useState<boolean>(false)
    const [batchProgress, setBatchProgress] = useState<number>(0)
    const [picInfo, setPicInfo] = useState<{ [key: string]: any }>({
        url: "",
        title: "",
        fileSuffix: ""
    })
    let currentFile: any = { uid: "" }
    const { run: saveFile } = useRequest<URLProps[]>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: URLProps[] = await RequestUtil.post(`/sinzetech-resource/oss/endpoint/get-batch-upload-url`, data)
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

    const deleteAttachData = useCallback((uid: string) => setAttachs(attchs.filter((item: any) => item.uid ? item.uid !== uid : item.id !== uid)), [setAttachs, attchs])

    const handleBeforeUpload = useCallback((file, fileList): Promise<boolean> => {
        const isExists: boolean = !fileList.some((item: any) => item.uid === currentFile.uid)
        currentFile = file
        return new Promise(async (resove, reject) => {
            if (isExists) {
                setAttachs([...attchs, ...fileList.map((item: any) => ({
                    fileName: item.name,
                    fileSize: item.size,
                    isAutoClear: true,
                    loading: true
                }))])
                setBatchStart(true)
                setBatchProgress(0)
                if (!isTable) {
                    message.warning({
                        content: <div>
                            <div>文件已开始上传，请勿进行任何操作等待上传完成!!!</div>
                            <Progress size="small" percent={batchProgress} />
                        </div>,
                        duration: 0,
                        key: "batchProgress"
                    })
                }
                const saveUrls = await saveFile(fileList.map((item: any) => ({
                    fileName: item.name,
                    fileSize: item.size,
                    isAutoClear: true
                })))
                await putFilePromise(saveUrls, fileList, (successCount: number, failCount: number) => {
                    setBatchProgress(parseFloat((successCount / saveUrls.length).toFixed(2)) * 100)
                    message.open({
                        type: "warning",
                        content: <div>
                            <div>文件已开始上传，请勿进行任何操作等待上传完成!!!</div>
                            <Progress size="small" percent={Number((parseFloat((successCount / saveUrls.length).toFixed(2)) * 100).toFixed(0))} />
                        </div>,
                        duration: 0,
                        key: "batchProgress"
                    })
                })
                setAttachs([...attchs, ...saveUrls.map((item: any) => ({
                    ...item,
                    loading: false
                }))])
                message.destroy("batchProgress")
                setBatchStart(false)
                onDoneChange(saveUrls)
            }
            reject(false)
        })
    }, [attchs, setAttachs])

    const getDataSource = useCallback(() => attchs, [attchs])

    const resetFields = useCallback(() => setAttachs([]), [attchs, setAttachs])

    useImperativeHandle(ref, () => ({ getDataSource, dataSource: attchs, resetFields }), [JSON.stringify(attchs), getDataSource, dataSource, resetFields])

    const handlePreview = useCallback((record: FileProps) => {
        if (["png", "jpeg", "jpg", "gif", "dxf"].includes(record?.fileSuffix || "")) {
            setPicInfo({
                url: record.downloadUrl,
                fileSuffix: record.fileSuffix,
                title: record.originalName
            })
            setVisible(true)
        } else if (record?.fileSuffix === "pdf") {
            window.open(`${process.env.PDF_PREVIEW}?fileName=${encodeURIComponent(record.originalName as string)}&url=${encodeURIComponent(record?.downloadUrl as string)}`)
        } else {
            message.warning("暂只支持*.png,*.jpeg,*.jpg,*.gif*.pdf,*.dxf预览...")
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
            destroyOnClose
            footer={false}>
            {picInfo.fileSuffix === "dxf" ? <iframe
                src={`${process.env.DXF_PREVIEW}?url=${encodeURIComponent(picInfo?.url)}`}
                style={{
                    border: "none",
                    width: "100%",
                    minHeight: 400,
                    padding: 10
                }}
            /> :
                <Image src={picInfo.url} preview={false} />}
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
                            multiple
                            {...inputAccepts}
                            beforeUpload={handleBeforeUpload}
                            showUploadList={false}
                        >
                            <Button key="enclosure" type="primary" ghost>上传附件</Button>
                        </Upload>
                        {isBatchDel ? <Button onClick={bitchDel} type="primary" ghost>批量删除</Button> : null}
                    </Space>
                ]
            } : {}} />}
        {!isTable && <Spin spinning={batchStart}>
            <Upload
                key="sub"
                name="file"
                multiple
                {...inputAccepts}
                showUploadList={false}
                beforeUpload={handleBeforeUpload}
            >
                {children}
            </Upload>
        </Spin>

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