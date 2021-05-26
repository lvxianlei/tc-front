import React from 'react'
import {Button} from 'antd'

import { PlusOutlined } from '@ant-design/icons';

export interface IAbstractShowModalComponentProps {
    
}

export interface IAbstractShowModalComponentState {
    readonly isModalVisible: boolean,
    readonly confirmTitle: string,
    readonly okText?: string,
    readonly cancelText?: string;
    readonly name?:string
}

export interface DataType{}

export default abstract class AbstractShowModalComponent<P extends IAbstractShowModalComponentProps, S extends IAbstractShowModalComponentState> extends React.Component<P,S> {

    abstract showModal  (): void 

    public render(): React.ReactNode {
        return (
            <>
                <Button type="text" target="customerCompany" onClick={ this.showModal }>
                    <PlusOutlined />
                </Button> 
            </>
           
                
            
        );
    }
}