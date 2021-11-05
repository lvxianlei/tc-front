import React, { useState, forwardRef, useImperativeHandle } from "react"
import { Button, Upload } from "antd"
import { CommonTable, DetailTitle } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { downLoadFile } from "../../../utils"
import AuthUtil from "../../../utils/AuthUtil"
interface OverviewProps {
    id: string
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
}
export default forwardRef(function AttchFile({ id }: OverviewProps, ref): JSX.Element {
    const [attchs, setAttachs] = useState<any[]>([])
    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/applyPayment/completeApplyPayment`, { ...data, id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const deleteAttachData = (id: number) => {
        setAttachs(attchs.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    }

    const uploadChange = (event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                const dataInfo = event.file.response.data
                const fileInfo = dataInfo.name.split(".")
                setAttachs([...attchs, {
                    id: "",
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
    }
    
    const onSubmit = async () => {
        const result = await saveRun({ applyPaymentAttachInfoDtos: attchs })
    }

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit])

    return <>
        <DetailTitle title="相关附件" operation={[<Upload
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
        <CommonTable columns={[
            {
                title: "附件名称",
                dataIndex: "name",
                width: 200
            },
            {
                title: "操作",
                dataIndex: "opration",
                render: (_: any, record: any) => (<>
                    <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>删除</Button>
                    <Button type="link" onClick={() => downLoadFile(record.link || record.filePath)}>下载</Button>
                </>)
            }]} dataSource={attchs} />
    </>
})