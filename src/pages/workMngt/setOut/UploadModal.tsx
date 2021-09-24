import React from 'react';
import { Button, Space, Modal, Upload } from 'antd';
import { DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import useRequest from '@ahooksjs/use-request';
import { CloudUploadOutlined } from '@ant-design/icons';

export interface UploadModalProps {}
export interface IUploadModalRouteProps extends RouteComponentProps<UploadModalProps>, WithTranslation {
    readonly id: number | string;
    readonly btnName: string;
}

export interface UploadModalState {
    readonly visible: boolean;
    readonly description?: string;
}

const tableColumns = [
    { 
        key: 'index', 
        title: '序号', 
        dataIndex: 'index', 
        width: 50, 
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>) },
    {
        key: 'partBidNumber',
        title: '操作部门',
        dataIndex: 'partBidNumber', 
    },
    {  
        key: 'goodsType', 
        title: '操作人', 
        dataIndex: 'goodsType' 
    },
    { 
        key: 'goodsType', 
        title: '操作时间', 
        dataIndex: 'packageNumber' 
    },
    {
        key: 'goodsType', 
        title: '操作动作', 
        dataIndex: 'amount' 
    },
    { 
        key: 'goodsType', 
        title: '对象', 
        dataIndex: 'unit' 
    }
]

class UploadModal extends React.Component<IUploadModalRouteProps, UploadModalState> {
    constructor(props: IUploadModalRouteProps) {
        super(props)
    }

    public state: UploadModalState = {
        visible: false
    }

    private modalCancel(): void {
        this.setState({
            visible: false
        })
    }

    private async modalShow(): Promise<void> {
        // const data = await RequestUtil.get(`/tower-market/bidInfo/${ this.props.id }`);
        this.setState({
            visible: true
        })
    }

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="primary" onClick={ () => this.modalShow() } ghost>{ this.props.btnName }</Button>
            <Modal
                visible={ this.state.visible } 
                width="40%" 
                title="评估信息" 
                footer={ <Button type="ghost" onClick={() => this.modalCancel() }>关闭</Button> } 
                onCancel={ () => this.modalCancel() }
            >
                <DetailContent>
                    <p>相关附件<Upload ><CloudUploadOutlined /></Upload></p>
                    <CommonTable columns={[
                        { 
                            key: 'name', 
                            title: '附件名称', 
                            dataIndex: 'name',
                            width: 150 
                        },
                        { 
                            key: 'operation', 
                            title: '操作', 
                            dataIndex: 'operation', 
                            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                                <Space direction="horizontal" size="small">
                                    <Button type="link">下载</Button>
                                    <Button type="link">删除</Button>
                                </Space>
                        ) }
                    ]}
                        dataSource={ [] }
                    />
                    <p className={ styles.topPadding }>操作信息</p>
                    <CommonTable columns={ tableColumns } dataSource={ [] } />
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(UploadModal))
