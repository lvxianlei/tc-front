import React from 'react';
import { Button, Modal } from 'antd';
import { DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import styles from './SetOutTask.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import useRequest from '@ahooksjs/use-request';

export interface DeliverablesProps {}
export interface IDeliverablesRouteProps extends RouteComponentProps<DeliverablesProps>, WithTranslation {
    readonly id: number | string;
}

export interface DeliverablesState {
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
        title: '交付物名称',
        dataIndex: 'partBidNumber', 
    },
    {  
        key: 'goodsType', 
        title: '用途', 
        dataIndex: 'goodsType' 
    }, 
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        width: 120,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Button type="link">下载</Button>
        )
    }
]

class Deliverables extends React.Component<IDeliverablesRouteProps, DeliverablesState> {
    constructor(props: IDeliverablesRouteProps) {
        super(props)
    }

    public state: DeliverablesState = {
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
            <Button type="link" onClick={ () => this.modalShow() }>交付物</Button>
            <Modal
                visible={ this.state.visible } 
                width="40%" 
                title="交付物" 
                footer={ <Button type="ghost" onClick={() => this.modalCancel() }>关闭</Button> } 
                onCancel={ () => this.modalCancel() }
            >
                <DetailContent>
                    <p>交付物清单</p>
                    <CommonTable columns={ tableColumns } dataSource={ [] } />
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(Deliverables))
