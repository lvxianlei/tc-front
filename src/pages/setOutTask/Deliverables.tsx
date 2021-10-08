import React from 'react';
import { Button, Modal } from 'antd';
import { DetailContent, CommonTable } from '../common';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

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
        const data = [{
            name: '提料塔型构件明细汇总.zip',
            use: '提料塔型构件明细汇总'
        }, {
            name: '提料杆塔构件明细汇总.zip',
            use: '提料杆塔构件明细汇总'
        }, {
            name: '放样塔型构件明细汇总.zip',
            use: '放样塔型构件明细汇总'
        }, {
            name: '放样杆塔构件明细汇总.zip',
            use: '放样杆塔构件明细汇总'
        }, {
            name: '包装图纸汇总.zip',
            use: '包装图纸汇总'
        }, {
            name: '塔型图纸汇总.zip',
            use: '塔型图纸汇总'
        }, {
            name: '组焊清单汇总.zip',
            use: '组焊清单汇总'
        }, {
            name: '小样图汇总.zip',
            use: '小样图汇总'
        }, {
            name: '螺栓清单汇总.zip',
            use: '螺栓清单汇总'
        }, {
            name: 'NC程序汇总.zip',
            use: 'NC程序汇总'
        }, ]
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
                    <CommonTable columns={ tableColumns } dataSource={ data } />
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(Deliverables))
