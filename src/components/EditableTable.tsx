/**
 * @author zyc
 * @copyright © 2021 
 */
import { Button, ButtonProps, FormInstance, Popconfirm, Table } from 'antd';
import { RenderFunction, TooltipPlacement } from 'antd/lib/tooltip';
import React from 'react';

export interface IConfirmableButtonProps extends ButtonProps {
    readonly confirmTitle: React.ReactNode | RenderFunction;
    readonly okText?: string;
    readonly cancelText?: string;
    readonly onConfirm?: (e?: React.MouseEvent<HTMLElement>) => void;
    readonly onCancel?: (e?: React.MouseEvent<HTMLElement>) => void;
    readonly placement?: TooltipPlacement;
    readonly dataSource: IDataSource[];
}
export interface IConfirmableButtonState {}

export interface IDataSource {}

/**
 * @TODO Describe the class
 */
export default class EditableTable extends React.Component<IConfirmableButtonProps, IConfirmableButtonState> {
    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
     protected getForm(): FormInstance | null {
        return this.form?.current;
    }


    /**
     * @description Renders ConfirmableButton
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Table rowKey='index' dataSource={ this.props.dataSource } bordered pagination={ false }></Table>
        );
    }
}