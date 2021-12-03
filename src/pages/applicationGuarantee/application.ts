export interface EditRefProps {
    id?: string
    onSubmit: () => void
    resetFields: () => void
}

export interface EditProps {
    id?: string
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
}