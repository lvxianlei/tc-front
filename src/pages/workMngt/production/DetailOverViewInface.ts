export interface OverViewProps {
    visible?: boolean;
    id?: string;
    loftingState: number;
    onCancel: () => void;
    onOk: () => void;
}