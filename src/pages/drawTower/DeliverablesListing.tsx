import React from 'react';
import { Button, Modal } from 'antd';
import { DetailContent, CommonTable } from '../common';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { downloadTemplate } from '../workMngt/setOut/downloadTemplate';
import styles from './DrawTower.module.less';

export interface DeliverablesListingProps { }
export interface IDeliverablesListingRouteProps extends RouteComponentProps<DeliverablesListingProps>, WithTranslation {
    readonly id: number | string;
}

export interface DeliverablesListingState {
    readonly visible: boolean;
    readonly description?: string;
}

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
        const tableColumns = [
            {
                key: 'index',
                title: '序号',
                dataIndex: 'index',
                width: 50,
                render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
            },
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
                    <Button type="link" onClick={() => {
                        if (record.requestType === 'zip') {
                            downloadTemplate(record.path + this.props.id, record.use, {}, true)
                        } else {
                            downloadTemplate(record.path + this.props.id, record.use)
                        }
                    }}>下载</Button>
                )
            }
        ]

        const data = [{
            name: '提料塔型构件明细汇总.xls',
            use: '提料塔型构件明细汇总',
            path: '/tower-science/productCategory/material/productCategoryStructure/download/excel?productCategoryId='
        }, {
            name: '塔型图纸汇总.zip',
            use: '塔型图纸汇总',
            requestType: 'zip',
            path: '/tower-science/productCategory/lofting/draw/summary?productCategoryId=',
        }]

        return <>
            <Button type="link" onClick={() => this.modalShow()}>附件</Button>
            <Modal
                visible={this.state.visible}
                width="40%"
                title="附件清单"
                className={styles.deliverables}
                footer={<Button type="ghost" onClick={() => this.modalCancel()}>关闭</Button>}
                onCancel={() => this.modalCancel()}
            >
                <CommonTable columns={tableColumns} dataSource={data} pagination={false} />
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(DeliverablesListing))
