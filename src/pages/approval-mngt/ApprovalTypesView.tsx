import React, { useState } from "react"
import { Modal, ModalFuncProps } from "antd"
const auditEnum: any = {
    "performance_bond": "履约保证金审批",
    "drawing_handover": "图纸交接申请",
    "drawing_confirmation": "图纸交接确认申请",
    "bidding_evaluation": "招标评审申请"
}
const ApprovalTypesView: React.FC<any> = ({ type, ...props }) => {
    const title = Object.keys(auditEnum).find(key => auditEnum[key] === type) as string
    return <Modal title={title} {...props}>

    </Modal>
}

export default ApprovalTypesView