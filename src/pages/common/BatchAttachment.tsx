import React, { useState, useImperativeHandle, forwardRef, useCallback, useEffect, ReactNode } from 'react'
import { Button, Upload, Modal, Image, message, Row, Col, Spin, Empty, Checkbox, Space } from 'antd'
import { DetailTitle } from "../common"
import RequestUtil from "../../utils/RequestUtil"
import useRequest from '@ahooksjs/use-request'
import { downLoadFile } from "../../utils"
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

export interface AttachmentProps {
    [key: string]: any;
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
    title = "相关附件",
    ...props
}: AttachmentProps, ref): JSX.Element {

    const { run: saveFile } = useRequest<URLProps>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: URLProps = await RequestUtil.post(`/sinzetech-resource/oss/endpoint/get-batch-upload-url`, [data])
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
    const handleChange = (event: any) => {
        console.log(event)
    }
    return <>
        <DetailTitle operation={[
            <Space direction="horizontal" key="space">
                <Upload
                    key="sub"
                    name="file"
                    multiple={multiple}
                    method="put"
                    showUploadList={false}
                    onChange={handleChange}
                    customRequest={async (options: any) => {
                        const file: any = options.file
                        const result: any = await uploadRun(options.action, options.file)
                        file.status = "done"
                        file.xhr = { status: 200, response: result }
                    }}
                >
                    <Button key="enclosure" type="primary" ghost>上传附件</Button>
                </Upload>
            </Space>
        ]} title="附件" />
    </>
})