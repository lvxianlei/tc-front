import React from 'react';
import { Button, Modal } from 'antd';
import { DetailContent, CommonTable } from '../common';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

export interface DeliverablesListingProps {}
export interface IDeliverablesListingRouteProps extends RouteComponentProps<DeliverablesListingProps>, WithTranslation {
    readonly id: number | string;
}

export interface DeliverablesListingState {
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
        key: 'name',
        title: '交付物名称',
        dataIndex: 'name', 
    },
    {  
        key: 'use', 
        title: '用途', 
        dataIndex: 'use' 
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

class DeliverablesListing extends React.Component<IDeliverablesListingRouteProps, DeliverablesListingState> {
    
    public state: DeliverablesListingState = {
        visible: false
    }

    private modalCancel(): void {
        this.setState({
            visible: false
        })
    }

    private async modalShow(): Promise<void> {
        this.setState({
            visible: true
        })
    }

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        const data = [{
            name: '提料塔型构件明细汇总.zip',
            use: '提料塔型构件明细汇总'
        }, {
            name: '塔型图纸汇总.zip',
            use: '塔型图纸汇总'
        }]
        return <>
            <Button type="link" onClick={ () => this.modalShow() }>附件</Button>
            <Modal
                visible={ this.state.visible } 
                width="40%" 
                title="附件清单" 
                footer={ <Button type="ghost" onClick={() => this.modalCancel() }>关闭</Button> } 
                onCancel={ () => this.modalCancel() }
            >
                <DetailContent>
                    <p style={{ paddingBottom: "5px" }}>附件清单</p>
                    <CommonTable columns={ tableColumns } dataSource={ data } pagination={ false }/>
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(DeliverablesListing))
