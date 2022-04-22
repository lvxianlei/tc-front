// 接受参数类型
export interface EditRefProps {
    id?: string
    onSubmit: () => void
    resetFields: () => void
}

// 接受的参数类型
export interface EditProps {
    id?: string
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
    requiredReturnTime?: string
}

// 接口的返回类型
export interface UserData {
    guaranteeInitVO?: object // 基本信息
    guaranteeVO?: object // 保函信息
    guaranteeRecoveryVO?: object // 保函回收信息
    attachInfoVOList?: [] // 附件信息
    approveRecordVO?: [] // 审批记录
    applyAttachListVO?: [] // 保函申请相关附件
}

// 传递的类型
export interface OverViewProps {
    visible?: boolean
    userData?: UserData | undefined
    acceptStatus?: number
    id?: string
    onCancel: () => void
    onOk: () => void
}