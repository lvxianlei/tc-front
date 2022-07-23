/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Table, TableColumnType } from 'antd';
import React from 'react';
import isEqual from 'react-fast-compare';
import { RouteComponentProps, withRouter } from 'react-router';
import { IContract } from '../../IContract';
import { IProduct } from '../../IProduct';

import RequestUtil from '../../../utils/RequestUtil';
import SummaryRenderUtil, { IRenderdSummariableItem, IRenderedGrid } from '../../../utils/SummaryRenderUtil';
import { ICustomerInfoDto } from './AbstractContractSetting';
import styles from './ContractSummary.module.less';

interface IContractSummaryParamsProps {
    readonly id: string;
}

interface IContractSummaryProps {
    readonly baseInfo?: IContractGeneral;
    readonly orderItems?: IOrderItem[];
    readonly sysInfo?: IContract;
    readonly region?: any[];
}

interface IContractSummaryRouteProps extends RouteComponentProps<IContractSummaryParamsProps>, IContractSummaryProps { }
interface IContractSummaryState extends IContractSummaryProps { }

export interface IContractGeneral extends IContract {
    readonly customerInfoVo?: ICustomerInfoDto;
    readonly regionName?: string;
}

export interface IOrderItem {
    readonly taxAmount?: number;
    readonly orderQuantity?: number;
    readonly internalNumber?: string;
    readonly productVos?: IProduct[];
    readonly purchaseOrderNumber?: string;
    readonly saleOrderNumber?: string;
}

/**
 * The summary of the contract
 */
export class ContractSummary extends React.Component<IContractSummaryRouteProps, IContractSummaryState> {
    requestPath = "/tower-market/saleOrder/getSaleOrderDetailsById";

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
        const orderItems: IOrderItem[] = await RequestUtil.get<IOrderItem[]>(this.requestPath, {
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
    public getBaseInfoGrid(): IRenderedGrid {
        const baseInfo: IContractGeneral | undefined = this.state.baseInfo;
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
            }, {
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
                value: baseInfo?.winBidTypeName
            }, {
                label: '销售类型',
                value: baseInfo?.saleTypeName
            }], [{
                label: '业主单位',
                value: baseInfo?.customerInfoVo?.customerCompany
            }, {
                label: '业主联系人',
                value: baseInfo?.customerInfoVo?.customerLinkman
            }], [{
                label: '业主联系电话',
                value: baseInfo?.customerInfoVo?.customerPhone
            }, {
                label: '合同签订单位',
                value: baseInfo?.signCustomerName
            }], [{
                label: '合同签订日期',
                value: baseInfo?.signContractTime
            }, {
                label: '签订人',
                value: baseInfo?.signUserName
            }], [{
                label: '要求交货日期',
                value: baseInfo?.deliveryTime
            }, {
                label: '评审时间',
                value: baseInfo?.reviewTime
            }], [{
                label: '所属国家',
                value: baseInfo?.countryCode === 0 ? '中国' : '海外'
            }, {
                label: '所属区域',
                value: baseInfo?.regionName
            }], [{
                label: '计价方式',
                // value: baseInfo?.chargeType === ChargeType.ORDER_TOTAL_WEIGHT ? '订单总价、总重计算单价' : '产品单价、基数计算总价'
            }, {
                label: '合同总价',
                value: baseInfo?.contractAmount
            }], [{
                label: '币种',
                value: baseInfo?.currencyTypeName
            }], [{
                label: '备注',
                value: baseInfo?.description
            }]]
        };
    }

    /**
     * @description Gets order columns
     * @returns order columns 
     */
    public getOrderColumns(): TableColumnType<object>[] {
        return [{
            title: '序号',
            dataIndex: 'index'
        }, {
            title: '状态',
            dataIndex: 'productStatus',
            render: (productStatus: number): React.ReactNode => {
                return productStatus === 1 ? '待下发' : productStatus === 2 ? '审批中' : '已下发'
            }
        }, {
            title: '线路名称',
            dataIndex: 'lineName'
        }, {
            title: '产品类型',
            dataIndex: 'productTypeName'
        }, {
            title: '塔型',
            dataIndex: 'productShape'
        }, {
            title: '杆塔号',
            dataIndex: 'productNumber'
        }, {
            title: '电压等级（KV）',
            dataIndex: 'voltageGradeName'
        }, {
            title: '呼高（米）',
            dataIndex: 'productHeight'
        }, {
            title: '单位',
            dataIndex: 'unit'
        }, {
            title: '数量',
            dataIndex: 'num',
            render: (num: number | string): React.ReactNode => {
                return num === -1 ? '' : num;
            }
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
    public getOrderSummariableItems(): IRenderdSummariableItem[] {
        const orderItems: IOrderItem[] = this.state.orderItems || [];
        return orderItems.map<IRenderdSummariableItem>((item: IOrderItem): IRenderdSummariableItem => {
            return {
                fieldItems: [{
                    label: '订单编号',
                    value: item.saleOrderNumber
                }, {
                    label: '采购订单号',
                    value: item.purchaseOrderNumber
                }, {
                    label: '订单数量',
                    value: item.orderQuantity
                }, {
                    label: '订单金额',
                    value: item.taxAmount
                }],
                render: (): React.ReactNode => (
                    <Table rowKey="index" dataSource={
                        item.productVos?.map<IProduct>(
                            (productVos: IProduct, index: number): IProduct => (
                                {
                                    ...productVos,
                                    index: index + 1
                                }
                            )
                        )
                    } pagination={false} bordered={true} columns={this.getOrderColumns()} />
                )
            }
        })
    }

    /**
     * @description Gets sys info grid
     * @returns sys info grid 
     */
    public getSysInfoGrid(): IRenderedGrid {
        const sysInfo: IContract | undefined = this.state.sysInfo;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 8
            },
            rows: [[{
                label: '最后编辑人',
                value: sysInfo?.updateUserName
            }, {
                label: '最后编辑时间',
                value: sysInfo?.updateTime
            }], [{
                label: '创建人',
                value: sysInfo?.createUserName
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
    public renderBaseInfoSection = (): React.ReactNode => {
        return SummaryRenderUtil.renderGrid(this.getBaseInfoGrid());
    }

    /**
     * @description Renders order section
     * @returns order section 
     */
    public renderOrderSection = (): React.ReactNode => {
        return SummaryRenderUtil.renderSummariableAreas(this.getOrderSummariableItems());
    }

    /**
     * @description Renders sys info section
     * @returns sys info section 
     */
    public renderSysInfoSection = (): React.ReactNode => {
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