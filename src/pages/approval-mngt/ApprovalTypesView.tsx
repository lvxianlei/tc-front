import React, { useState } from "react"
import { Modal, Spin, Radio } from "antd"
import { CommonTable, BaseInfo, DetailContent, DetailTitle, Attachment, OperationRecord } from "../common"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import {
    bondBaseInfoView, drawH, drawingCofirm,
    baseInfo, auditIdRecord, outFactoryHead, applicationdetails
} from "./approval.json"
import "./wrapperChecked.less";
const paths: any = {
    "履约保证金申请": "/tower-market/performanceBond/",
    "图纸交接申请": "/tower-market/drawingHandover/",
    "图纸交接确认申请": "/tower-market/drawingConfirmation/",
    "招标评审申请": "/tower-market/biddingEvaluation/",
    "出厂价申请": "/tower-market/OutFactory/"
}
interface ApprovalTypesViewProps {
    id: string
    [key: string]: any
}
type radioTypes = "base" | "records" | "attachVos"
const ViewDetail: React.FC<ApprovalTypesViewProps> = ({ id, path, title }) => {
    const [radioValue, setRadioValue] = useState<radioTypes>("base")
    const { loading, data } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.get(`${path}${id}`)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })
    const radioOnchange = (value: radioTypes) => setRadioValue(value)
    const detailType: any = {
        "履约保证金申请": <DetailContent>
            <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)} style={{ marginBottom: 16 }}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="records">审批记录</Radio.Button>
            </Radio.Group>
            {radioValue === "base" && <BaseInfo columns={bondBaseInfoView} dataSource={data?.performanceBond || {}} col={2} />}
            {radioValue === "records" && <OperationRecord serviceName="tower-market" serviceId={id} operateTypeEnum="APPROVAL" title="" />}
        </DetailContent>,
        "图纸交接申请": <DetailContent>
            <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)} style={{ marginBottom: 16 }}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="records">审批记录</Radio.Button>
            </Radio.Group>
            {radioValue === "base" && <BaseInfo columns={drawH} dataSource={(data as any) || {}} col={2} />}
            {radioValue === "records" && <CommonTable columns={auditIdRecord} dataSource={data?.records} />}
        </DetailContent>,
        "图纸交接确认申请": <DetailContent>
            <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)} style={{ marginBottom: 16 }}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="records">审批记录</Radio.Button>
                <Radio.Button value="attachVos">附件信息</Radio.Button>
            </Radio.Group>
            {radioValue === "base" && <BaseInfo columns={drawingCofirm} dataSource={(data as any) || {}} col={2} />}
            {radioValue === "records" && <CommonTable columns={auditIdRecord} dataSource={data?.records} />}
            {radioValue === "attachVos" && <Attachment title={false} dataSource={data?.fileSources} />}
        </DetailContent>,
        "招标评审申请": <DetailContent>
            <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)} style={{ marginBottom: 16 }}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="records">审批记录</Radio.Button>
                <Radio.Button value="attachVos">附件信息</Radio.Button>
            </Radio.Group>
            {radioValue === "base" && <BaseInfo columns={baseInfo} dataSource={(data?.biddingEvaluation) || {}} col={2} />}
            {radioValue === "records" && <CommonTable columns={auditIdRecord} dataSource={data?.records || []} />}
            {radioValue === "attachVos" && <Attachment title={false} dataSource={data?.attachVos} />}
        </DetailContent>,
        "出厂价申请": <DetailContent>
            <Radio.Group defaultValue={radioValue} onChange={(event: any) => radioOnchange(event.target.value)} style={{ marginBottom: 16 }}>
                <Radio.Button value="base">基本信息</Radio.Button>
                <Radio.Button value="records">审批记录</Radio.Button>
            </Radio.Group>
            {radioValue === "base" && <>
                <BaseInfo columns={outFactoryHead} dataSource={data || {}} col={2} />
                <DetailTitle title="申请明细" />
                <CommonTable columns={applicationdetails} dataSource={data?.auditOutInfoVOList || []} />
            </>}
            {radioValue === "records" && <CommonTable columns={auditIdRecord} dataSource={data?.records || []} />}
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