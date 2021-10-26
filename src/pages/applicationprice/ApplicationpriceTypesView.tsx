import React, { useState } from "react"
import { Modal, Spin, Upload, Button, Radio } from "antd"
import { CommonTable, BaseInfo, DetailContent, DetailTitle } from "../common"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import AuthUtil from "../../utils/AuthUtil"
import {baseInfo} from "./applicationpriceHeadData.json"
const paths: any = {
    "履约保证金申请": "/tower-market/performanceBond/",
    "图纸交接申请": "/tower-market/drawingHandover/",
    "图纸交接确认申请": "/tower-market/drawingConfirmation/",
    "招标评审申请": "/tower-market/biddingEvaluation/"
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
    
    return <Spin spinning={loading}>
      
    </Spin>
}
const ApprovalTypesView: React.FC<ApprovalTypesViewProps> = ({ id, ...props }) => {
    return <Modal width={1011} {...props} destroyOnClose>
        <ViewDetail id={id} path={paths[props.title]} title={props.title} />
    </Modal>
}

export default ApprovalTypesView