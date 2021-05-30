/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Table, TableColumnType } from 'antd';
import React from 'react';
import isEqual from 'react-fast-compare';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import SummaryRenderUtil, { IRenderdSummariableItem, IRenderedGrid } from '../../../utils/SummaryRenderUtil';
import styles from './ContractSummary.module.less';

interface IContractSummaryParamsProps {
    readonly id: string;
}

interface IContractSummaryProps {
    readonly baseInfo?: IContractBaseInfo;
    readonly orderItems?: IOrderItem[];
    readonly sysInfo?: IContractSysInfo;
}

interface IContractSummaryRouteProps extends RouteComponentProps<IContractSummaryParamsProps>, IContractSummaryProps {}
interface IContractSummaryState extends IContractSummaryProps {}

export interface IContractBaseInfo {
    readonly contractNumber?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly simpleProjectName?: string;
    readonly winBidType?: number;
}

export interface IOrderItem {
    readonly taxAmount?: number;
    readonly orderQuantity?: number;
    readonly internalNumber?: string;
    readonly products?: IProduct[];
}

export interface IProduct {
    readonly index?: number;
    readonly saleOrderId: number;
}

export interface IContractSysInfo {
    readonly updateUser?: string;
    readonly updateTime?: string;
    readonly createUser?: string;
    readonly createTime?: string;
}

/**
 * The summary of the contract
 */
class ContractSummary extends React.Component<IContractSummaryRouteProps, IContractSummaryState> {

    /**
     * @description State  of contract summary
     */
    public state: IContractSummaryState = {
        baseInfo: {},
        orderItems: [],
        sysInfo: {}
    };

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        const orderItems: IOrderItem[] = await RequestUtil.get<IOrderItem[]>(`/saleOrder/getSaleOrderDetailsById`, {
            contractId: this.props.match.params.id
        });
        this.setState({
            orderItems: orderItems
        });
    }

    /**
     * @implements
     * @description Gets derived state from props
     * @param props 
     * @param prevState 
     * @returns derived state from props 
     */
    static getDerivedStateFromProps(props: IContractSummaryRouteProps, prevState: IContractSummaryState): IContractSummaryState | null {
        if (!isEqual(props.baseInfo, prevState.baseInfo)
            || !isEqual(props.sysInfo, prevState.sysInfo)) {
            return {
                baseInfo: { ...props.baseInfo },
                sysInfo: { ...props.sysInfo }
            }
        }
        return null;
    }

    /**
     * @description Gets base info grid
     * @returns base info grid 
     */
    private getBaseInfoGrid(): IRenderedGrid {
        const baseInfo: IContractBaseInfo | undefined = this.state.baseInfo;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 8
            },
            rows: [[{
                label: '合同编号',
                value: baseInfo?.contractNumber
            },{
                label: '内部合同编号',
                value: baseInfo?.internalNumber
            }], [{
                label: '工程名称',
                value: baseInfo?.projectName
            }, {
                label: '工程简称',
                value: baseInfo?.simpleProjectName
            }], [{
                label: '中标类型',
                value: baseInfo?.winBidType == 1 ? '国家电网': '南方电网'
            }]]
        };
    }

    /**
     * @description Gets order columns
     * @returns order columns 
     */
    private getOrderColumns(): TableColumnType<object>[] {
        return [{
            title: '序号',
            dataIndex: 'index'
        }, {
            title: '状态',
            dataIndex: 'productStatus'
        }, {
            title: '线路名称',
            dataIndex: 'lineName'
        }, {
            title: '产品类型',
            dataIndex: 'productType'
        }, {
            title: '塔型',
            dataIndex: 'productShape'
        }, {
            title: '杆塔号',
            dataIndex: 'productNumber'
        }, {
            title: '电压等级（KV）',
            dataIndex: 'voltageGrade'
        }, {
            title: '呼高（米）',
            dataIndex: 'productHeight'
        }, {
            title: '单位',
            dataIndex: 'price'
        }, {
            title: '数量',
            dataIndex: 'num'
        }, {
            title: '单价',
            dataIndex: 'price'
        }, {
            title: '金额',
            dataIndex: 'totalAmount'
        }, {
            title: '标段',
            dataIndex: 'tender'
        }, {
            title: '备注',
            dataIndex: 'description'
        }];
    }

    /**
     * @description Gets order summariable items
     * @returns order summariable items 
     */
    private getOrderSummariableItems(): IRenderdSummariableItem[] {
        const orderItems: IOrderItem[] = this.state.orderItems || [];
        return orderItems.map<IRenderdSummariableItem>((item: IOrderItem): IRenderdSummariableItem => {
            return {
                fieldItems: [{
                    label: '订单编号',
                    value: item.internalNumber
                }, {
                    label: '采购订单号',
                    value: item.internalNumber
                }, {
                    label: '订单数量',
                    value: item.orderQuantity
                }, {
                    label: '订单金额',
                    value:  item.taxAmount
                }],
                render: (): React.ReactNode => (
                    <Table rowKey="index"  dataSource={
                        item.products?.map<IProduct>(
                            (product: IProduct, index: number): IProduct => (
                                {
                                    ...product,
                                    index: index + 1
                                }
                            )
                        )
                    } pagination={ false } bordered={ true } columns={ this.getOrderColumns() }/>
                )
            }  
        })  
    }

    /**
     * @description Gets sys info grid
     * @returns sys info grid 
     */
    private getSysInfoGrid(): IRenderedGrid {
        const sysInfo: IContractSysInfo | undefined = this.state.sysInfo;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 8
            },
            rows: [[{
                label: '最后编辑人',
                value: sysInfo?.updateUser
            },{
                label: '最后编辑时间',
                value: sysInfo?.updateTime
            }], [{
                label: '创建人',
                value: sysInfo?.createUser
            }, {
                label: '创建时间',
                value: sysInfo?.createTime
            }]]
        };
    }

    /**
     * @description Renders base info section
     * @returns base info section 
     */
    private renderBaseInfoSection = (): React.ReactNode => {
        return SummaryRenderUtil.renderGrid(this.getBaseInfoGrid());
    }

    /**
     * @description Renders order section
     * @returns order section 
     */
    private renderOrderSection = (): React.ReactNode => {
        return SummaryRenderUtil.renderSummariableAreas(this.getOrderSummariableItems());
    }

    /**
     * @description Renders sys info section
     * @returns sys info section 
     */
    private renderSysInfoSection = (): React.ReactNode => {
        return SummaryRenderUtil.renderGrid(this.getSysInfoGrid());
    }

    /**
     * @description Renders ContractSummary
     * @returns render 
     */
    public render(): React.ReactNode {
        return SummaryRenderUtil.renderSections([{
            title: '基本信息',
            render: this.renderBaseInfoSection
        }, {
            title: '订单信息',
            className: styles.orderSection,
            render: this.renderOrderSection
        }, {
            title: '系统信息',
            render: this.renderSysInfoSection
        }]);
    }
}

export default withRouter(ContractSummary);