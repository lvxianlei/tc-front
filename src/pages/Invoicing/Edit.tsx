import React, { useState } from "react"
import { Button, Upload } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, EditTable } from '../common'
import { baseInfoHead, invoiceHead } from "./InvoicingData.json"
import { enclosure } from '../project/managementDetailData.json'
import RequestUtil from '../../utils/RequestUtil'
import AuthUtil from "../../utils/AuthUtil"
import { downLoadFile } from "../../utils"
export default function Edit() {
    const [attachVosData, setAttachVosData] = useState<any[]>([])
    const uploadChange = (event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                const dataInfo = event.file.response.data
                const fileInfo = dataInfo.name.split(".")
                setAttachVosData([...attachVosData, {
                    id: "",
                    uid: attachVosData.length,
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
    }

    const deleteAttachData = (id: number) => {
        setAttachVosData(attachVosData.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    }

    return <DetailContent operation={[
        <Button type="primary" key="save">保存</Button>,
        <Button key="cancel">取消</Button>
    ]}>
        <DetailTitle title="基本信息" />
        <BaseInfo columns={baseInfoHead} dataSource={{}} edit />

        <DetailTitle title="发票信息" />
        <BaseInfo columns={invoiceHead} dataSource={{}} edit />

        <DetailTitle title="开票明细" operation={[]} />

        <EditTable columns={[]} dataSource={[]} />

        <DetailTitle title="附件" operation={[<Upload
            key="sub"
            name="file"
            multiple={true}
            action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
            headers={{
                'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                'Tenant-Id': AuthUtil.getTenantId(),
                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
            }}
            showUploadList={false}
            onChange={uploadChange}
        ><Button key="enclosure" type="primary" ghost>上传附件</Button></Upload>]} />
        <CommonTable columns={[{
            title: "操作", dataIndex: "opration",
            render: (_: any, record: any) => (<>
                <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>删除</Button>
                <Button type="link" onClick={() => downLoadFile(record.link || record.filePath)}>下载</Button>
            </>)
        }, ...enclosure]} dataSource={attachVosData} />
    </DetailContent>
}