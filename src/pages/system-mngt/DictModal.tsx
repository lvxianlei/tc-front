/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
 import { ModalProps, Modal, Form, Input,Button } from 'antd';
 import { RenderFunction, TooltipPlacement } from 'antd/lib/tooltip';
 import React from 'react';
 
 export interface IDictModalProps extends ModalProps {
     readonly title?:string;
     readonly visible?: boolean; 
     readonly value?: string;
     readonly handleOk?:(e?: React.MouseEvent<HTMLElement>) => void;
     readonly handleCancel?: (e?: React.MouseEvent<HTMLElement>) => void;
     readonly saveValue?:(e?: React.MouseEvent<HTMLElement>) => void;
     readonly onFinish?:(e?: React.MouseEvent<HTMLElement>) => void;
 }
 export interface IDictModalState {}
 
 /**
  * @TODO Describe the class
  */
 export default class DictModal extends React.Component<IDictModalProps, IDictModalState> {
    //  /**
    //   * @override
    //   * @description Gets state
    //   * @returns state 
    //   */
    // public state: IDictModalState = {
    //     contract: [],
    //     visible: false,
    //     editValue: '',
    // }
 
    
     /**
      * @description Renders DictModal
      * @returns render 
      */
    public render(): React.ReactNode {
        
         return (
            <Modal title={this.props.title} visible={this.props.visible} footer={null} onCancel={this.props.handleCancel}>
                <Form onFinish={this.props.onFinish}>
                <Form.Item
                    name="name"
                    label="选项值名"
                    rules={[{ required: true, message: '请填写选项值名！' }]} 
                    initialValue={ this.props.value }
                >
                    <Input placeholder="请填写选项值名"/>
                </Form.Item>
                <Button type="primary" htmlType="submit">确认</Button>
                <Button onClick={this.props.handleCancel}>取消</Button>
                </Form>
            </Modal>
         );
    }
 }