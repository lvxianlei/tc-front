import { Button, ColProps, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AbstractDetailComponent from '../../../components/AbstractDetailComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { ITabItem } from '../../../components/ITabableComponent';
import SummaryRenderUtil, { IRenderdSummariableItem, IRenderedGrid } from '../../../utils/SummaryRenderUtil';
import RequestUtil from '../../../utils/RequestUtil';
import { IProduct } from '../../IProduct';
import { ITask } from '../../ITask';

export interface ITaskDetailProps {
    readonly id: string;
    readonly status: string;
    readonly taskReviewStatus: string;
}
export interface ITaskDetailRouteProps extends RouteComponentProps<ITaskDetailProps> { }
export interface ITaskDetailState {
    readonly task?: ITaskInfo,

}

export interface ITaskInfo extends ITask {
    readonly createTime?: string;
    readonly createUserName?: string;
    readonly customerCompany?: string;
    readonly productChangeInfoVOList?: IProduct[];
    readonly productInfoVOList?: IProduct[];
    readonly orderDeliveryTime?: string;
    readonly signCustomerName?: string;
    readonly simpleProjectName?: string;
    readonly updateUserName?: string;
    readonly updateTime?: string;
}
/**
 * Contract detail page component.
 */
class TaskDetail extends AbstractDetailComponent<ITaskDetailRouteProps, ITaskDetailState> {

    public state: ITaskDetailState = {
        task: {}
    }

    //title
    protected getTitle(): string {
        return `${super.getTitle()}（${this.state?.task?.taskNumber}）`;
    }

    /**
     * @description Components did mount
     */
    public async fetchTableData() {
        const task: ITaskInfo = await RequestUtil.get<ITaskInfo>(`/tower-market/taskNotice/${this.props.match.params.id}`);
        this.setState({
            task,
        });
    }
    // componentDidMount
    public async componentDidMount() {
        this.fetchTableData();
    }

    /**
     * @implements
     * @description Gets subinfo col props
     * @returns subinfo col props 
     */
    public getSubinfoColProps(): ColProps[] {
        const { task } = this.state;
        return [{
            span: 8,
            children: (
                <span>内部合同编号：{task?.internalNumber}</span>
            )
        }, {
            span: 8,
            children: (
                <span>交货日期：{task?.planDeliveryTime}</span>
            )
        }];
    }

    //delete-row
    public handleDelete = async (id: string) => {
        //接口
        await RequestUtil.delete(`/tower-market/taskNotice?id=${id}`);
        this.props.history.push('/prom/task');
    };
    /**
     * @implements
     * @description Renders operation area
     * @returns operation area 
     */
    public renderOperationArea(): React.ReactNode | React.ReactNode[] {
        const { status, taskReviewStatus } = this.props?.match?.params || {};
        return [
            <Button key="new" href="/prom/task/new">新增</Button>,
            <Button key="edit" href={`/prom/task/edit/${this.props.match?.params.id}`} disabled={status !== '1'}>编辑</Button>,
            <ConfirmableButton confirmTitle="要删除该数据吗？" type="link" placement="topRight" onConfirm={() => this.handleDelete(this.props.match.params.id)} >
                <Button disabled={status !== '1'}>
                    删除
                </Button>
            </ConfirmableButton>,
            <Button key="special" href={`/prom/task/special/${this.props.match?.params.id}`} disabled={status !== '2'}>完善特殊要求</Button>,
            status !== '4' ? <Button key="product" href={`/prom/task/product/${this.props.match?.params.id}`} disabled={status !== '3' || taskReviewStatus === '0'}>完善产品信息</Button> : <Button key="change" href={`/prom/task/product/${this.props.match.params.id}`} disabled={taskReviewStatus === '0'}>变更产品信息</Button>,

        ];
    }

    /**
     * @description Gets base info grid
     * @returns base info grid 
     */
    private getBaseInfoGrid(): IRenderedGrid {
        const task: ITaskInfo | undefined = this.state?.task;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 8
            },
            rows: [[{
                label: '任务编号',
                value: task?.taskNumber
            }, {
                label: '关联订单',
                value: task?.saleOrderNumber
            }], [{
                label: '关联合同',
                value: task?.internalNumber
            }, {
                label: '工程名称',
                value: task?.projectName
            }], [{
                label: '工程简称',
                value: task?.simpleProjectName
            }, {
                label: '业主单位',
                value: task?.customerCompany
            }], [{
                label: '合同签订单位',
                value: task?.signCustomerName
            }, {
                label: '订单交货日期',
                value: task?.orderDeliveryTime
            }], [{
                label: '客户交货日期',
                value: task?.deliveryTime
            }, {
                label: '计划交货日期',
                value: task?.planDeliveryTime
            }]]
        };
    }

    /**
     * @description Gets special info grid
     * @returns special info grid 
     */
    private getSpecialInfoGrid(): IRenderedGrid {
        const task: ITaskInfo | undefined = this.state?.task;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 20
            },
            rows: [[{
                label: '原材料标准',
                value: task?.materialStandardName === '-1' ? '' : task?.materialStandardName
            }, {
                label: '原材料要求',
                value: task?.materialDemand
            }], [{
                label: '焊接要求',
                value: task?.weldingDemand
            }, {
                label: '包装要求',
                value: task?.packDemand
            }], [{
                label: '镀锌要求',
                value: task?.galvanizeDemand
            }, {
                label: '备注',
                value: task?.peculiarDescription
            }]]
        };
    }


    /**
     * @description Gets sys info grid
     * @returns sys info grid 
     */
    private getSysInfoGrid(): IRenderedGrid {
        const task: ITaskInfo | undefined = this.state?.task;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 8
            },
            rows: [[{
                label: '最后编辑人',
                value: task?.updateUserName
            }, {
                label: '最后编辑时间',
                value: task?.updateTime
            }], [{
                label: '创建人',
                value: task?.createUserName
            }, {
                label: '创建时间',
                value: task?.createTime
            }]]
        };
    }



    public getProductColumns = () => {
        return [
            {
                title: '状态',
                width: 100,
                dataIndex: 'productStatus',
                key: 'productStatus',
                render: (productStatus: number) => {
                    return productStatus === 1 ? '待下发' : productStatus === 2 ? '审批中' : '已下发'
                }
            },
            {
                title: '线路名称',
                width: 150,
                dataIndex: 'lineName',
                key: 'lineName',
            },
            {
                title: '产品类型',
                dataIndex: 'productTypeName',
                key: 'productTypeName'
            },
            {
                title: '塔型',
                dataIndex: 'productCategoryName',
                key: 'productCategoryName'
            },
            {
                title: '杆塔号',
                dataIndex: 'productNumber',
                key: 'productNumber'
            },
            {
                title: '电压等级',
                dataIndex: 'voltageGradeName',
                key: 'voltageGradeName'
            },
            {
                title: '呼高（米）',
                dataIndex: 'productHeight',
                key: 'productHeight'
            },
            {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit'
            },
            {
                title: '数量',
                dataIndex: 'num',
                key: 'num'
            },
            {
                title: '标段',
                dataIndex: 'tender',
                key: 'tender'
            },
            {
                title: '备注',
                dataIndex: 'description',
                key: 'description'
            }
        ];
    }

    public getProductChangeColumns = () => {
        return [{
            title: '序号',
            render: (text: string, record: any, index: number) => `${index + 1}`,
        }, {
            title: '操作',
            dataIndex: 'changeType',
            key: 'changeType'
        }, {
            title: '操作时间',
            dataIndex: 'createTime',
            key: 'createTime'
        }, {
            title: '状态',
            width: 100,
            dataIndex: 'productStatus',
            key: 'productStatus',
        }, {
            title: '线路名称',
            width: 150,
            dataIndex: 'lineName',
            key: 'lineName',
        }, {
            title: '产品类型',
            dataIndex: 'productTypeName',
            key: 'productTypeName'
        }, {
            title: '塔型',
            dataIndex: 'productCategoryName',
            key: 'productCategoryName'
        }, {
            title: '杆塔号',
            dataIndex: 'productNumber',
            key: 'productNumber'
        }, {
            title: '电压等级',
            dataIndex: 'voltageGradeName',
            key: 'voltageGradeName'
        }, {
            title: '呼高（米）',
            dataIndex: 'productHeight',
            key: 'productHeight'
        }, {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit'
        }, {
            title: '数量',
            dataIndex: 'num',
            key: 'num'
        }, {
            title: '标段',
            dataIndex: 'tender',
            key: 'tender'
        }, {
            title: '备注',
            dataIndex: 'description',
            key: 'description'
        }];
    }
    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [{
            label: '概况信息',
            key: 1,
            content: SummaryRenderUtil.renderSections([{
                title: '基本信息',
                render: (): React.ReactNode => SummaryRenderUtil.renderGrid(this.getBaseInfoGrid())
            }, {
                title: '特殊要求',
                render: (): React.ReactNode => SummaryRenderUtil.renderGrid(this.getSpecialInfoGrid())
            }, {
                title: '产品信息',
                render: (): React.ReactNode => <Table dataSource={this.state?.task?.productInfoVOList} columns={this.getProductColumns()} scroll={{ x: 1300 }} />
            }, {
                title: '系统信息',
                render: (): React.ReactNode => SummaryRenderUtil.renderGrid(this.getSysInfoGrid())
            }])
        }, {
            label: '变更产品信息',
            key: 2,
            content: SummaryRenderUtil.renderSections([{
                title: '变更产品信息',
                render: (): React.ReactNode => <Table dataSource={this.state?.task?.productChangeInfoVOList} columns={this.getProductChangeColumns()} scroll={{ x: 1300 }} />
            }])
        }];
    }
}

export default withRouter(withTranslation()(TaskDetail));