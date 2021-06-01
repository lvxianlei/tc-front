/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { ButtonProps } from 'antd';
import React from 'react';

export interface IattachPreviewProps {
    readonly pageUrl?: string;
}
export interface IattachPreviewState {}

/**
 * @TODO Describe the class
 */
export default class attachPreview extends React.Component<IattachPreviewProps, IattachPreviewState> {

    /**
     * @description Renders attachPreview
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <iframe src={ this.props.pageUrl }  frameBorder="0"></iframe>
        );
    }
}