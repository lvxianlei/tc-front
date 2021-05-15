/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, ButtonProps, Popconfirm } from 'antd';
import { RenderFunction, TooltipPlacement } from 'antd/lib/tooltip';
import React from 'react';

export interface IConfirmableButtonProps extends ButtonProps {
    readonly confirmTitle: React.ReactNode | RenderFunction;
    readonly okText?: string;
    readonly cancelText?: string;
    readonly onConfirm?: (e?: React.MouseEvent<HTMLElement>) => void;
    readonly onCancel?: (e?: React.MouseEvent<HTMLElement>) => void;
    readonly placement?: TooltipPlacement;
}
export interface IConfirmableButtonState {}

/**
 * @TODO Describe the class
 */
export default class ConfirmableButton extends React.Component<IConfirmableButtonProps, IConfirmableButtonState> {

    /**
     * @description Renders ConfirmableButton
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Popconfirm title={ this.props.confirmTitle }
                placement={ this.props.placement }
                okText={ this.props.okText || '确认' } cancelText={ this.props.cancelText || '取消' }
                onConfirm={ this.props.onConfirm } onCancel={ this.props.onCancel }>
                {
                    this.props.type === 'link'
                    ?
                    <a className={ this.props.className }>{ this.props.children }</a>
                    :
                    <Button { ...this.props }>{ this.props.children }</Button>
                }
            </Popconfirm>
        );
    }
}