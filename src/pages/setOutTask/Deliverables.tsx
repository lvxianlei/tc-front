import React from 'react';
import { Button, Modal } from 'antd';
import { DetailContent, CommonTable } from '../common';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { downloadTemplate } from '../workMngt/setOut/downloadTemplate';
import styles from './SetOutTask.module.less';

export interface DeliverablesProps { }
export interface IDeliverablesRouteProps extends RouteComponentProps<DeliverablesProps>, WithTranslation {
    readonly id: number | string;
}

export interface DeliverablesState {
    readonly visible: boolean;
    readonly description?: string;
}

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
                render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <Button style={{ padding: '0' }} type="link" onClick={() => {
                        if (record.requestType === 'zip') {
                            downloadTemplate(record.path + this.props.id, record.use, {}, true)
                        } else {
                            downloadTemplate(record.path + this.props.id, record.use)
                        }
                    }}>下载</Button>
                )
            }
        ]

        const data = [
            // {
            //     name: '提料塔型构件明细汇总.xls',
            //     use: '提料塔型构件明细汇总',
            //     path: '/tower-science/productCategory/material/productCategoryStructure/download?materialTaskId='
            // },
            // {
            //     name: '提料杆塔构件明细汇总.xls',
            //     use: '提料杆塔构件明细汇总',
            //     path: '/tower-science/productCategory/material/productStructure/download?materialTaskId='
            // },
            {
                name: '放样塔型构件明细汇总.xls',
                use: '放样塔型构件明细汇总',
                path: '/tower-science/productStructure/productCategory/exportByTaskId?loftingTaskId='
            },
            {
                name: '放样杆塔构件明细汇总.xls',
                use: '放样杆塔构件明细汇总',
                path: '/tower-science/productStructure/product/exportByTaskId?loftingTaskId='
            },
            {
                name: '包装清单汇总.xls',
                use: '包装清单汇总',
                path: '/tower-science/packageStructure/exportByTaskId?loftingTaskId='
            },
            {
                name: '塔型图纸汇总.zip',
                use: '塔型图纸汇总',
                requestType: 'zip',
                path: '/tower-science/productCategory/summaryByTaskId?loftingId=',
            },
            {
                name: '组焊清单汇总.xls',
                use: '组焊清单汇总',
                path: '/tower-science/welding/summaryByTaskId?loftingId=',
            },
            {
                name: '小样图汇总.zip',
                use: '小样图汇总',
                path: '/tower-science/smallSample/downloadTask/',
                requestType: 'zip'
            },
            {
                name: '螺栓清单汇总.xls',
                use: '螺栓清单汇总',
                path: '/tower-science/boltRecord/downloadSummaryTask?loftTasking=',

            },
            {
                name: 'NC程序汇总.zip',
                use: 'NC程序汇总',
                path: '/tower-science/productNc/summaryByTaskId?loftingId=',
                requestType: 'zip'
            }
        ]

        return <div>
            <Button type="link" onClick={() => this.modalShow()}>交付物</Button>
            <Modal
                visible={this.state.visible}
                width="40%"
                title="交付物"
                className={styles.deliverables}
                footer={<Button type="ghost" onClick={() => this.modalCancel()}>关闭</Button>}
                onCancel={() => this.modalCancel()}
            >
                <p className={styles.title}><span>交付物清单</span><Button type='link' onClick={() => {
                    data.map(res => {
                        if (res.requestType === 'zip') {
                            downloadTemplate(res.path + this.props.id, res.use, {}, true)
                        } else {
                            downloadTemplate(res.path + this.props.id, res.use)
                        }
                    })
                }}
                >全部打包下载</Button></p>
                <CommonTable columns={tableColumns} dataSource={data} pagination={false} />
            </Modal>
        </div>
    }
}

export default withRouter(withTranslation('translation')(Deliverables))
