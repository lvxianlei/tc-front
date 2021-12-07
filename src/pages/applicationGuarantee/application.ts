export interface EditRefProps {
    id?: string
    onSubmit: () => void
    resetFields: () => void
}

export interface EditProps {
    id?: string
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
    requiredReturnTime?: string
}

export interface UserData {
    guaranteeInitVO?: object // 基本信息
    guaranteeVO?: object // 保函信息
    guaranteeRecoveryVO?: object // 保函回收信息
    attachInfoVOList?: [] // 附件信息
    approveRecordVO?: [] // 审批记录
}
export interface OverViewProps {
    visible?: boolean
    userData?: UserData | undefined
    acceptStatus?: number
    onCancel: () => void
    onOk: () => void
}