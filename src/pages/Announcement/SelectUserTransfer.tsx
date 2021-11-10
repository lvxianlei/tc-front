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

export interface SelectUserTransferProps {}
export interface ISelectUserTransferRouteProps extends RouteComponentProps<SelectUserTransferProps>, WithTranslation {
    readonly id: number | string;
    readonly updateList: () => void;
}

export interface SelectUserTransferState {
    readonly visible: boolean;
    readonly treeData?: ITreeData[];
    readonly targetKeys?: string[];
}

interface ITreeData {
    readonly key: string;
    readonly title: string;
    readonly children?: ITreeData[];
}

interface IDetailData {
    readonly productCategoryId?: string;
    readonly productCategoryName?: string;
    readonly productId?: string;
    readonly productNumber?: string;
    readonly loftingProductSegmentList?: IProductSegmentList[];
}

interface IProductSegmentList {
    readonly productCategoryId?: string;
    readonly segmentName?: string;
    readonly id?: string | number;
    readonly count?: string;
    readonly segmentId?: string;
}

class SelectUserTransfer extends React.Component<ISelectUserTransferRouteProps, SelectUserTransferState> {
   
    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    private getForm = (): FormInstance | null => {
        return this.form?.current;
    }

    
    public state: SelectUserTransferState = {
        visible: false,
        treeData: [
            { key: '0-0', title: '0-0' },
            {
              key: '0-1',
              title: '0-1',
              children: [
                { key: '0-1-0', title: '0-1-0' },
                { key: '0-1-1', title: '0-1-1' },
              ],
            },
            { key: '0-2', title: '0-3' }
        ]
    }

    private modalCancel(): void {
        this.setState({
            visible: false
        })
        this.getForm()?.resetFields();
    }

    private async modalShow(): Promise<void> {
        // const data = await RequestUtil.get<IDetailData>(`/tower-science/productSegment/distribution?productId=${ this.props.id }`);
        this.setState({
            visible: true,
            // treeData: data
        })
    }

    protected save = (path: string) => {
        // if(this.getForm()) {
        //     this.getForm()?.validateFields().then(res => {
        //         const value = this.getForm()?.getFieldsValue(true);
        //         const loftingProductSegmentList = this.state.detailData?.loftingProductSegmentList;
        //         value.productCategoryId = this.state.detailData?.productCategoryId;
        //         value.productId = this.state.detailData?.productId;
        //         if(value.productSegmentListDTOList) {
        //             value.productSegmentListDTOList = value.productSegmentListDTOList?.map((items: IProductSegmentList, index: number) => {
        //                 if(items) {
        //                     return {
        //                         id: loftingProductSegmentList && loftingProductSegmentList[index].id === -1 ? '' : loftingProductSegmentList && loftingProductSegmentList[index].id,
        //                         segmentName: loftingProductSegmentList && loftingProductSegmentList[index].segmentName,
        //                         count: items.count,
        //                         segmentId: loftingProductSegmentList && loftingProductSegmentList[index].segmentId,
        //                     }
        //                 } else {
        //                     return undefined
        //                 }
        //             });
        //             value.productSegmentListDTOList = value.productSegmentListDTOList.filter((item: IProductSegmentList)=>{ return item !== undefined });
        //             RequestUtil.post(path, { ...value }).then(res => {
        //                 this.props.updateList();
        //                 this.modalCancel();
        //             }); 
        //         } else {
        //             message.warning('暂无段名信息，无法保存')
        //         }
        //     })
        // }
    }

    // protected generateTree = (treeNodes: ITreeData[] = [], checkedKeys: string[] = []) =>
    //     treeNodes.map(({ children }) => ({
    //         // ...props,
    //         disabled: checkedKeys.includes(this.props.key),
    //         // children: this.generateTree(children, checkedKeys),
    //     }));
     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="link" key={this.props.id} onClick={ () => this.modalShow() }>选择员工</Button>
            <Modal
                visible={ this.state.visible } 
                width="40%" 
                title="选择员工"
                footer={ <Space>
                    <Button type="link" onClick={() => this.modalCancel() }>取消</Button>
                    <Button type="primary" onClick={() => {}} ghost>确定</Button>
                </Space> } 
                onCancel={ () => this.modalCancel() }
            >
                <Transfer
                    targetKeys={this.state.targetKeys}
                    dataSource={this.state.treeData}
                    className="tree-transfer"
                    render={item => item.title}
                    showSelectAll={false}
                    oneWay
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
                                    // treeData={this.generateTree(this.state?.treeData || [], this.state.targetKeys || [])}
                                    // onCheck={(_, { node: { key } }) => {
                                    //     onItemSelect(key, !isChecked(checkedKeys, key));
                                    // }}
                                    // onSelect={(_, { node: { key } }) => {
                                    //     onItemSelect(key, !isChecked(checkedKeys, key));
                                    // }}
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
