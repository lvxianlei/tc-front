export interface Details {
    visible: boolean
    chooseId: string
    totalNum: number
    totalWeight: number
    handleCallBack: () => void
}

export interface Detail {
    visible: boolean
    batcherId: string
    code: string
    handleCallBack: () => void
}