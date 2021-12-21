export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export interface TitleType {
    title: string;
    dataIndex: string;
}
export interface OverViewProps {
    title: TitleType[];
    visible?: boolean;
    userData?: object | undefined;
    contractList?: Contract[];
    onCancel: () => void
}

export interface EditProps {
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
}

export interface Contract {
    internalNumber?: string;
    contractName?: string;
    refundAmount?: number;
    salesman?: string;
}