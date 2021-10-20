import React from 'react';
import { Button, Modal } from 'antd';
import { DetailContent, CommonTable } from '../../common';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

export interface DeliverablesProps {}
export interface IDeliverablesRouteProps extends RouteComponentProps<DeliverablesProps>, WithTranslation {
    readonly id: number | string;
    readonly name: string;
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
    
    public state: DeliverablesState = {
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
            name: '塔型图纸.pdf',
            use: '塔型交付图纸'
        }, {
            name: '塔型构件明细.pdf',
            use: '塔型构件明细'
        }, {
            name: '塔型螺栓清单.pdf',
            use: '塔型螺栓清单'
        }, {
            name: '塔型组焊清单.pdf',
            use: '塔型组焊清单'
        }, {
            name: '塔型NC程序.zip',
            use: '塔型NC程序'
        }, {
            name: '塔型小样图.zip',
            use: '塔型小样图'
        }, {
            name: '杆塔构件明细汇总.zip',
            use: '杆塔构件明细汇总'
        }, {
            name: '杆塔螺栓清单汇总.zip',
            use: '杆塔螺栓清单汇总'
        }, {
            name: '杆塔组焊清单汇总.zip',
            use: '杆塔组焊清单汇总'
        }, {
            name: '杆塔NC程序汇总.zip',
            use: '杆塔NC程序'
        }, {
            name: '杆塔小样图汇总.zip',
            use: '杆塔小样图汇总'
        }, {
            name: '杆塔包装图纸汇总.zip',
            use: '杆塔包装图纸汇总'
        }]
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
                    <p style={{ paddingBottom: "5px" }}>交付物清单-{ this.props.name }</p>
                    <CommonTable columns={ tableColumns } dataSource={ data } pagination={ false }/>
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(Deliverables))
