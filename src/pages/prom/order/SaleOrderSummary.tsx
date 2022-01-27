/**
 * @author zyc
 * @copyright © 2021 
 */
import { Table, TableColumnType } from 'antd';
import React from 'react';
import isEqual from 'react-fast-compare';
import { RouteComponentProps, withRouter } from 'react-router';
import { IContract } from '../../IContract';

import RequestUtil from '../../../utils/RequestUtil';
import SummaryRenderUtil, { IRenderedGrid } from '../../../utils/SummaryRenderUtil';
import { ChargeType, IProductVo } from './AbstractSaleOrderSetting';
//  import styles from './SaleOrderSummary.module.less';

interface ISaleOrderSummaryParamsProps {
    readonly id: string;
}

interface ISaleOrderSummaryProps {
    readonly baseInfo?: ISaleOrderBaseInfo;
    readonly productData?: IProductVo[];
    readonly sysInfo?: ISaleOrderSysInfo;
}

interface ISaleOrderSummaryRouteProps extends RouteComponentProps<ISaleOrderSummaryParamsProps>, ISaleOrderSummaryProps { }
interface ISaleOrderSummaryState extends ISaleOrderSummaryProps { }

export interface ISaleOrderBaseInfo {
    readonly contractInfoVo?: IContractInfoVo;
    readonly purchaseOrderNumber?: string;
    readonly saleOrderNumber?: string;
    readonly orderDeliveryTime?: string;
    readonly amount?: number;
    readonly commissionCharge?: number;
    readonly creditInsurance?: number;
    readonly exchangeRate?: number;
    readonly foreignExchangeAmount?: number;
    readonly foreignPrice?: number;
    readonly guaranteeAmount?: number;
    readonly guaranteeType?: string;
    readonly insuranceCharge?: number;
    readonly orderQuantity?: number;
    readonly portCharge?: number;
    readonly price?: number;
    readonly orderProductVos?: IProductVo[];
    readonly taxAmount?: number;
    readonly taxPrice?: number;
    readonly taxRate?: number;
    readonly description?: string;
    readonly contractNumber?: string;
}

export interface IContractInfoVo extends IContract {
    readonly contractId?: number;
}

export interface ISaleOrderSysInfo {
    readonly updateUser?: string;
    readonly updateUserName?: string;
    readonly updateTime?: string;
    readonly createUser?: string;
    readonly createUserName?: string;
    readonly createTime?: string;
}

/**
 * The summary of the contract
 */
export class SaleOrderSummary extends React.Component<ISaleOrderSummaryRouteProps, ISaleOrderSummaryState> {

    /**
     * @description State  of contract summary
     */
    public state: ISaleOrderSummaryState = {
        baseInfo: {},
        productData: [],
        sysInfo: {}
    };

    /**
     * @implements
     * @description Gets derived state from props
     * @param props 
     * @param prevState 
     * @returns derived state from props 
     */
    static getDerivedStateFromProps(props: ISaleOrderSummaryRouteProps, prevState: ISaleOrderSummaryState): ISaleOrderSummaryState | null {
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
    protected getBaseInfoGrid(): IRenderedGrid {
        const baseInfo: ISaleOrderBaseInfo | undefined = this.state.baseInfo;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 6
            },
            rows: [[{
                label: '订单编号',
                value: baseInfo?.saleOrderNumber
            }, {
                label: '采购订单号',
                value: baseInfo?.purchaseOrderNumber
            }], [{
                label: '关联合同',
                value: baseInfo?.contractInfoVo?.internalNumber
            }, {
                label: '工程名称',
                value: baseInfo?.contractInfoVo?.projectName
            }], [{
                label: '工程简称',
                value: baseInfo?.contractInfoVo?.simpleProjectName
            }, {
                label: '业主单位',
                value: baseInfo?.contractInfoVo?.customerCompany
            }], [{
                label: '合同签订单位',
                value: baseInfo?.contractInfoVo?.signCustomerName
            }, {
                label: '合同签订日期',
                value: baseInfo?.contractInfoVo?.signContractTime
            }], [{
                label: '签订人',
                value: baseInfo?.contractInfoVo?.signUserName
            }, {
                label: '合同要求交货日期',
                value: baseInfo?.contractInfoVo?.deliveryTime
            }], [{
                label: '订单交货日期',
                value: baseInfo?.orderDeliveryTime
            }, {
                label: '备注',
                value: baseInfo?.description
            }]]
        };
    }

    /**
     * @description Gets base info grid
     * @returns base info grid 
     */
    protected getAmountInfoGrid(): IRenderedGrid {
        const baseInfo: ISaleOrderBaseInfo | undefined = this.state.baseInfo;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 8
            },
            rows: [[{
                label: '计价方式',
                value: baseInfo?.contractInfoVo?.chargeType === ChargeType.ORDER_TOTAL_WEIGHT ? '订单总价、总重计算单价' : '产品单价、基数计算总价'
            }, {
                label: '币种',
                value: baseInfo?.contractInfoVo?.currencyTypeName
            }], [{
                label: '订单总重',
                value: baseInfo?.orderQuantity
            }, {
                label: '含税金额',
                value: baseInfo?.taxAmount
            }], [{
                label: '含税单价',
                value: baseInfo?.taxPrice
            }, {
                label: '税率',
                value: baseInfo?.taxRate === -1 ? undefined : baseInfo?.taxRate
            }], [{
                label: '不含税金额',
                value: baseInfo?.amount
            }, {
                label: '不含税单价',
                value: baseInfo?.price
            }], [{
                label: '汇率',
                value: baseInfo?.exchangeRate === -1 ? undefined : baseInfo?.exchangeRate
            }, {
                label: '外汇金额',
                value: baseInfo?.foreignExchangeAmount === -1 ? undefined : baseInfo?.foreignExchangeAmount
            }], [{
                label: '外汇单价',
                value: baseInfo?.foreignPrice === -1 ? undefined : baseInfo?.foreignPrice
            }, 
            // {
            //     label: '保函类型',
            //     value: baseInfo?.guaranteeType === '-1' ? undefined : baseInfo?.guaranteeType
            // }
            ], [{
                label: '保函金额',
                value: baseInfo?.guaranteeAmount === -1 ? undefined : baseInfo?.guaranteeAmount
            }, 
            // {
            //     label: '港口费用',
            //     value: baseInfo?.portCharge === -1 ? undefined : baseInfo?.portCharge
            // }
            ], [
            //     {
                //     label: '海运及保险费',
                //     value: baseInfo?.insuranceCharge === -1 ? undefined : baseInfo?.insuranceCharge
            //     }, 
            // {
            //     label: '佣金',
            //     value: baseInfo?.commissionCharge === -1 ? undefined : baseInfo?.commissionCharge
            // }
            ], [
                // {
                //     label: '出口信用保险',
                //     value: baseInfo?.creditInsurance === -1 ? undefined : baseInfo?.creditInsurance
                // }
            ]]
        };
    }

    /**
     * @description Gets order columns
     * @returns order columns 
     */
    protected getOrderColumns(): TableColumnType<object>[] {
        const productStatus: any = {
            0: "未下发",
            1: "已下发"
        }
        return [{
            title: '序号',
            dataIndex: 'index'
        }, {
            title: '状态',
            dataIndex: 'productStatus',
            render: (status: number): React.ReactNode => {
                return productStatus[status]
            }
        }, {
            title: '线路名称',
            dataIndex: 'lineName'
        }, {
            title: '产品类型',
            dataIndex: 'productTypeName'
        }, {
            title: '塔型',
            dataIndex: 'productCategoryName'
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
     * @description Gets order columns
     * @returns order columns 
     */
    private getOrderColumnsTakeOutNum(): TableColumnType<object>[] {
        const list: TableColumnType<object>[] = this.getOrderColumns();
        list.splice(9, 1);
        return list;
    }

    /**
     * @description Gets sys info grid
     * @returns sys info grid 
     */
    private getSysInfoGrid(): IRenderedGrid {
        const sysInfo: ISaleOrderSysInfo | undefined = this.state.sysInfo;
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
    private renderBaseInfoSection = (): React.ReactNode => {
        return SummaryRenderUtil.renderGrid(this.getBaseInfoGrid());
    }

    /**
    * @description Renders amount info section
    * @returns base info section 
    */
    private renderAmountInfoSection = (): React.ReactNode => {
        return SummaryRenderUtil.renderGrid(this.getAmountInfoGrid());
    }

    /**
     * @description Renders sys info section
     * @returns sys info section 
     */
    private renderSysInfoSection = (): React.ReactNode => {
        return SummaryRenderUtil.renderGrid(this.getSysInfoGrid());
    }

    /**
     * @description Renders SaleOrderSummary
     * @returns render 
     */
    public render(): React.ReactNode {
        const baseInfo: ISaleOrderBaseInfo | undefined = this.state.baseInfo;
        if (baseInfo?.contractInfoVo?.chargeType === ChargeType.UNIT_PRICE) {
            this.getOrderColumnsTakeOutNum();
        }
        return SummaryRenderUtil.renderSections([{
            title: '基本信息',
            render: this.renderBaseInfoSection
        }, {
            title: '金额信息',
            render: this.renderAmountInfoSection
        }, {
            title: '产品信息',
            render: (): React.ReactNode => <Table rowKey="index" dataSource={this.state.baseInfo?.orderProductVos?.map<IProductVo>(
                (orderProductVos: IProductVo, index: number): IProductVo => (
                    {
                        ...orderProductVos,
                        index: index + 1
                    }
                )
            )} pagination={false} bordered={true} columns={
                baseInfo?.contractInfoVo?.chargeType === ChargeType.UNIT_PRICE ? this.getOrderColumnsTakeOutNum() : this.getOrderColumns()
            } />
        }, {
            title: '系统信息',
            render: this.renderSysInfoSection
        }]);
    }
}

export default withRouter(SaleOrderSummary);