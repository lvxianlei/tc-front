import React, { useState } from "react"
import { Modal, Spin, Upload, Button, Radio } from "antd"
import { CommonTable, BaseInfo, DetailContent, DetailTitle } from "../common"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import AuthUtil from "../../utils/AuthUtil"
import { bondBaseInfo, enclosure, drawH, drawingCofirm, baseInfo, auditIdRecord } from "./approvalHeadData.json"
const paths: any = {
    "履约保证金申请": "/tower-market/performanceBond?auditId=",
    "图纸交接申请": "/tower-market/drawingHandover?drawingHandoverId=",
    "图纸交接确认申请": "/tower-market/drawingConfirmation",
    "招标评审申请": "/tower-market/biddingEvaluation?auditId="
}
interface ApprovalTypesViewProps {
    id: string
    [key: string]: any
}
type radioTypes = "base" | "records" | "attachVos"
const ViewDetail: React.FC<ApprovalTypesViewProps> = ({ id, path, title }) => {
    const [attachInfo, setAttachInfo] = useState<any[]>([])
    const [radioValue, setRadioValue] = useState<radioTypes>("base")
    const { loading, data } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.get(`${path}${id}`)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })
    const uploadChange = (event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                console.log(event.file.response)
                setAttachInfo([...attachInfo, event.file.response.data])
            }
        }
    }
    const radioOnchange = (value: radioTypes) => setRadioValue(value)
    const detailType: any = {
        "履约保证金申请": <DetailContent>
            <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="records">审批记录</Radio.Button>
            </Radio.Group>
            {radioValue === "base" && <BaseInfo columns={bondBaseInfo} dataSource={(data as any) || {}} />}
            {radioValue === "records" && <CommonTable columns={auditIdRecord} dataSource={data?.records} />}
        </DetailContent>,
        "图纸交接申请": <DetailContent>
            <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="records">审批记录</Radio.Button>
            </Radio.Group>
            {radioValue === "base" && <BaseInfo columns={drawH} dataSource={(data as any) || {}} />}
            {radioValue === "records" && <CommonTable columns={auditIdRecord} dataSource={data?.records} />}
        </DetailContent>,
        "图纸交接确认申请": <DetailContent>
            <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="records">审批记录</Radio.Button>
                <Radio.Button value="attachVos">附件信息</Radio.Button>
            </Radio.Group>
            {radioValue === "base" && <BaseInfo columns={drawingCofirm} dataSource={(data as any) || {}} />}
            {radioValue === "records" && <CommonTable columns={auditIdRecord} dataSource={data?.records} />}
            {radioValue === "attachVos" && <>
                <DetailTitle title="" operation={[<Upload
                    key="sub"
                    name="file"
                    multiple={true}
                    action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
                    headers={{
                        'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                        'Tenant-Id': AuthUtil.getTenantId(),
                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                    }}
                    onChange={uploadChange}
                    showUploadList={false}
                ><Button key="enclosure" type="default">上传附件</Button></Upload>]} />
                <CommonTable columns={enclosure} dataSource={attachInfo} />
            </>}
        </DetailContent>,
        "招标评审申请": <DetailContent>
            <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="records">审批记录</Radio.Button>
                <Radio.Button value="attachVos">附件信息</Radio.Button>
            </Radio.Group>
            {radioValue === "base" && <BaseInfo columns={baseInfo} dataSource={(data as any) || {}} />}
            {radioValue === "records" && <CommonTable columns={auditIdRecord} dataSource={data?.records} />}
            {radioValue === "attachVos" && <>
                <DetailTitle title="" operation={[<Upload
                    key="sub"
                    name="file"
                    multiple={true}
                    action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
                    headers={{
                        'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                        'Tenant-Id': AuthUtil.getTenantId(),
                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                    }}
                    onChange={uploadChange}
                    showUploadList={false}
                ><Button key="enclosure" type="default">上传附件</Button></Upload>]} />
                <CommonTable columns={enclosure} dataSource={attachInfo} />
            </>}
        </DetailContent>
    }
    return <Spin spinning={loading}>
        {detailType[title]}
    </Spin>
}
const ApprovalTypesView: React.FC<ApprovalTypesViewProps> = ({ id, ...props }) => {
    return <Modal width={1011} {...props} destroyOnClose>
        <ViewDetail id={id} path={paths[props.title]} title={props.title} />
    </Modal>
}

export default ApprovalTypesView