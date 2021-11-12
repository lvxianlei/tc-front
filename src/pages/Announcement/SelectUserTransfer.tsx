/**
 * @author zyc
 * @copyright © 2021 
 * @description 选择用户穿梭框
*/
import React from 'react';
import { Button, Space, Modal, Form, Input, FormInstance, Descriptions, message, Transfer, Tree } from 'antd';
import RequestUtil from '../../utils/RequestUtil';
import styles from './AnnouncementMngt.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { ITreeData } from './AnnouncementNew';

export interface SelectUserTransferProps {}
export interface ISelectUserTransferRouteProps extends RouteComponentProps<SelectUserTransferProps>, WithTranslation {
    readonly transferDataSource?: ITreeData[];
    readonly treeData?: ITreeData[];
}

export interface SelectUserTransferState {
    readonly visible: boolean;
    readonly targetKeys?: string[];
}

class SelectUserTransfer extends React.Component<ISelectUserTransferRouteProps, SelectUserTransferState> {
    
    public state: SelectUserTransferState = {
        visible: false
    }

    private modalCancel(): void {
        this.setState({
            visible: false,
            targetKeys: []
        })
    }

    private async modalShow(): Promise<void> {
        this.setState({
            visible: true,
        })
    }

    protected save = () => {
        console.log(this.state.targetKeys)
    }

    protected generateTree = (treeNodes: ITreeData[] = [], checkedKeys: string[] = []): ITreeData[] =>
        treeNodes.map(({ children, ...props }) => ({
        ...props,
        disabled: checkedKeys.includes(props.key),
        children: this.generateTree(children, checkedKeys),
    }))

    protected isChecked = (selectedKeys: string[], eventKey: string) => selectedKeys.indexOf(eventKey) !== -1;

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="link" onClick={ () => this.modalShow() }>选择员工</Button>
            <Modal
                visible={ this.state.visible } 
                width="40%" 
                title="选择员工"
                footer={ <Space>
                    <Button type="link" onClick={() => this.modalCancel() }>取消</Button>
                    <Button type="primary" onClick={() => this.save()} ghost>确定</Button>
                </Space> } 
                onCancel={ () => this.modalCancel() }
            >
                <Transfer
                    rowKey={record => record.key}
                    targetKeys={[...this.state.targetKeys||[]]}
                    dataSource={this.props.transferDataSource}
                    className="tree-transfer"
                    render={item => item.title}
                    showSelectAll={false}
                    onChange={(keys: string[])=> {
                        this.setState({
                            targetKeys: keys
                        })
                    }}
                >
                    {({ direction, onItemSelect, selectedKeys }) => {
                        if (direction === 'left') {
                            const checkedKeys = [...selectedKeys, ...(this.state?.targetKeys || [])];
                            return (
                                <Tree
                                    blockNode
                                    checkable
                                    checkStrictly
                                    defaultExpandAll
                                    checkedKeys={checkedKeys}
                                    treeData={this.generateTree(this.props?.treeData || [], this.state.targetKeys || [])}
                                    onCheck={(_, { node: { key } }) => {
                                        onItemSelect(key.toString(), !this.isChecked(checkedKeys, key.toString()));
                                    }}
                                    onSelect={(_, { node: { key } }) => {
                                        onItemSelect(key.toString(), !this.isChecked(checkedKeys, key.toString()));
                                    }}
                                />
                            );
                        }
                    }}
                </Transfer>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(SelectUserTransfer))
