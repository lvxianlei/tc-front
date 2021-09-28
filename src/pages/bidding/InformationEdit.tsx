import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom"
import { Button, Spin, Form, message, Upload, Modal } from 'antd'
import { EditTable, DetailTitle, BaseInfo, DetailContent, CommonTable } from '../common'
import { baseInfoData } from './biddingHeadData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"
import AuthUtil from "../../utils/AuthUtil"
const columns = [
    { title: '分标编号', dataIndex: 'partBidNumber' },
    { title: '货物类别', dataIndex: 'goodsType' },
    { title: '包号', dataIndex: 'packageNumber' },
    { title: '数量', dataIndex: 'amount', type: "number" },
    { title: '单位', dataIndex: 'unit' },
    { title: '交货日期', dataIndex: 'deliveryDate', type: "date", format: "YYYY-MM-DD" },
    { title: '交货地点', dataIndex: 'deliveryPlace' }
]

export default function InfomationNew(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [attachVosData, setAttachVosData] = useState<any[]>([])
    const [reasonStatus, setReasonStatus] = useState<boolean>(false)
    const [baseInfoForm] = Form.useForm()
    const [bidForm] = Form.useForm()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        try {
            const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
            bidForm.setFieldsValue({ submit: data.bidPackageInfoVOS })
            setReasonStatus(data.biddingStatus !== 2)
            setAttachVosData(data.attachVos)
            resole(data)
        } catch (error) {
            reject(error)
        }
    }))
    const { loading: saveStatus, data: saveResult, run } = useRequest((postData: {}) => new Promise(async (resove, reject) => {
        try {
            const data: any = await RequestUtil.put(`/tower-market/bidInfo`, postData)
            resove(data)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    const detailData: any = data
    const handleSave = async () => {
        const baseInfoResult = await baseInfoForm.getFieldsValue()
        const bidPackageInfoDTOList = await bidForm.getFieldsValue()
        const postData = {
            ...detailData,
            ...baseInfoResult,
            bidPackageInfoDTOList: bidPackageInfoDTOList.submit,
            attachInfoDtos: attachVosData
        }
        delete postData.bidPackageInfoVOS
        delete postData.attachVos
        const result = await run(postData)
        if (result) {
            message.success('保存成功...')
            history.goBack()
        }
    }
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }
    const uploadChange = (event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                const dataInfo = event.file.response.data
                const fileInfo = dataInfo.name.split(".")
                setAttachVosData([...attachVosData, {
                    id: "",
                    uid: attachVosData.length,
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
        setAttachVosData(attachVosData.filter((item: any) => item.id !== id))
    }

    const handleBaseInfoChange = (changeFiled: any) => {
        const { biddingStatus } = changeFiled
        if (biddingStatus && detailData.biddingStatus === 1 && biddingStatus !== 1) {
            Modal.confirm({
                title: "应标状态修改",
                content: "当前标的已被应标，是否取消应标？确定后，该招标信息的项目将被删除，请再三确认！",
                onOk: () => {
                    setReasonStatus(biddingStatus !== 2)
                },
                onCancel: () => {
                    baseInfoForm.setFieldsValue({ biddingStatus: 1 })
                }
            })
        }
    }

    return <DetailContent
        operation={[
            <Button
                key="save"
                type="primary"
                onClick={handleSave}
                loading={saveStatus}
                style={{ marginRight: 16 }}
            >保存</Button>,
            <Button key="cancel" onClick={() => history.goBack()}>取消</Button>
        ]}
    >
        <DetailTitle title="基础信息" />
        <BaseInfo form={baseInfoForm} onChange={handleBaseInfoChange} columns={!reasonStatus ? baseInfoData : baseInfoData.filter((item: any) => item.dataIndex !== "reason")} dataSource={detailData} edit />
        <DetailTitle title="货物清单" />
        <EditTable form={bidForm} columns={columns} dataSource={detailData.bidPackageInfoVOS} />
        <DetailTitle title="附件" operation={[<Upload
            key="sub"
            name="file"
            accept=".doc,.docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,.txt,.xls,.xlsx"
            multiple={true}
            action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
            headers={{
                'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                'Tenant-Id': AuthUtil.getTenantId(),
                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
            }}
            showUploadList={false}
            onChange={uploadChange}
        ><Button key="su" type="primary" >上传附件</Button></Upload>]} />
        <CommonTable columns={[{
            title: "操作", dataIndex: "opration",
            render: (_: any, record: any) => (<>
                <Button type="link" onClick={() => deleteAttachData(record.id)}>删除</Button>
                {/* <Button type="link">下载</Button> */}
            </>)
        },
        { title: '文件名', dataIndex: 'name' },
        { title: '大小', dataIndex: 'fileSize' },
        { title: '上传人', dataIndex: 'userName' },
        { title: '上传时间', dataIndex: 'fileUploadTime' }
        ]} dataSource={attachVosData} />
    </DetailContent>
}