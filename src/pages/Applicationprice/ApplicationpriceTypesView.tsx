import React, { useState } from "react"
import { Modal, Spin, Upload, Button, Radio } from "antd"
import { CommonTable, BaseInfo, DetailContent, DetailTitle } from "../common"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import AuthUtil from "../../utils/AuthUtil"
import { baseInfo} from "./applicationpriceHeadData.json"
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



// export default ApplicationpriceTypesView