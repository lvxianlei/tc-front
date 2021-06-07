import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import styles from './PopModalButton.module.less';

export interface IPopModalButtonProps { 
    readonly showModal: () => void; 
}

export interface IPopModalButtonState {}

export interface DataType{}

export default abstract class PopModalButton<P extends IPopModalButtonProps, S extends IPopModalButtonState> extends React.Component<P,S> {

    public render(): React.ReactNode {
        return (
            <Button type="text" target="customerCompany" onClick={ this.props.showModal } className={ styles.btn }>
                <PlusOutlined />
            </Button>
        );
    }
}