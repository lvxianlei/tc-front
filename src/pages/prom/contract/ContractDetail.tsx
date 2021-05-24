/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, ColProps, Input, Table, TableColumnType } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AbstractDetailComponent from '../../../components/AbstractDetailComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { ITabItem } from '../../../components/ITabableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import SummaryRenderUtil, { IRenderdSummariableItem, IRenderedGrid } from '../../../utils/SummaryRenderUtil';

export interface IContractDetailProps {
    readonly id: string;
}
export interface IContractDetailRouteProps extends RouteComponentProps<IContractDetailProps> {}
export interface IContractDetailState {
    readonly detail?: IDetail;
    readonly orderData?: IOrderData;
}

interface IDetail {
    readonly id?: number;
    readonly internalNumber?: string;
    readonly deliveryTime?: string;
    readonly contractNumber?: string;
    readonly projectName?: string;
    readonly simpleProjectName?: string;
    readonly winBidType?: number;
    readonly updateUser?: string;
    readonly updateTime?: string;
    readonly createUser?: string;
    readonly createTime?: string;
    readonly attachVos?: IAttachVos[];
}

interface IOrderData {
    readonly taxAmount?: number;
    readonly orderQuantity?: number;
    readonly internalNumber?: string;
}

interface IResponseData {
    readonly id: number;
    readonly records: IDetail;
}

interface IAttachVos {
    readonly name?: string;
    readonly username?: string;
    readonly fileSize?: string;
    readonly description?: string;
    readonly filePath?: string;
    readonly fileSuffix?: string;
    readonly id?: number;
}

/**
 * Contract detail page component.
 */
class ContractDetail extends AbstractDetailComponent<IContractDetailRouteProps, IContractDetailState> {

    public state: IContractDetailState = {
        detail: undefined,
        orderData: undefined
    }

    protected getTitle(): string {
        return `${ super.getTitle() }`;
    }

    /**
      * @description Fetchs table data
      * @param filterValues 
      */
    protected async fetchTableData() {
        const resData: IResponseData = await RequestUtil.get<IResponseData>(`/contract/${ this.props.match.params.id }`);
        const orderData: IOrderData = await RequestUtil.get<IOrderData>(`/saleOrder/getSaleOrderDetailsById`, {
            contractId: this.props.match.params.id 
        });
        console.log(resData,orderData)
        this.setState({
            detail: resData.records,
            orderData: orderData
        });
    }

    public async componentWillMount() {
        this.fetchTableData();
    }
    
    /**
     * @implements
     * @description Gets subinfo col props
     * @returns subinfo col props 
     */
    public getSubinfoColProps (): ColProps[] {
        const detail: IDetail | undefined = this.state?.detail;
        return [{
            span: 8,
            children: (
                <span>内部合同编号：{ detail?.internalNumber }</span>
            )
        }, {
            span: 8,
            children: (
                <span>交货日期：{ detail?.deliveryTime }</span>
            )
        }];
    }

    /**
     * @implements
     * @description Renders operation area
     * @returns operation area 
     */
    public renderOperationArea(): React.ReactNode | React.ReactNode[] {
        return [
            <Button key="new" href="/prom/contract/new">新增</Button>,
            <Button key="setting" href={ `/prom/contract/setting/${ this.props.match.params.id }`}>编辑</Button>,
            <ConfirmableButton key="delete" confirmTitle="要删除该合同吗？">删除</ConfirmableButton>
        ];
    }

    /**
     * @description Gets base info grid
     * @returns base info grid 
     */
    private getBaseInfoGrid(): IRenderedGrid {
        const detail: IDetail | undefined = this.state?.detail;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 8
            },
            rows: [[{
                label: '合同编号',
                value: detail?.contractNumber
            },{
                label: '内部合同编号',
                value: detail?.internalNumber
            }], [{
                label: '工程名称',
                value: detail?.projectName
            }, {
                label: '工程简称',
                value: detail?.simpleProjectName
            }], [{
                label: '中标类型',
                value: detail?.winBidType == 1 ? "国家电网": "南方电网"
            }]]
        };
    }

    /**
     * @description Gets order columns
     * @returns order columns 
     */
    private getOrderColumns(): ColumnsType<object> {
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
     * @description Gets sys info grid
     * @returns sys info grid 
     */
    private getSysInfoGrid(): IRenderedGrid {
        const detail: IDetail | undefined = this.state?.detail;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 8
            },
            rows: [[{
                label: '最后编辑人',
                value: detail?.updateUser
            },{
                label: '最后编辑时间',
                value: detail?.updateTime
            }], [{
                label: '创建人',
                value: detail?.createUser
            }, {
                label: '创建时间',
                value: detail?.createTime
            }]]
        };
    }

    /**
     * @description Gets order summariable items
     * @returns order summariable items 
     */
    private getOrderSummariableItems(): IRenderdSummariableItem[] {
        const orderData: IOrderData | undefined = this.state.orderData;
        // orderData.map<React.ReactNode>((res: any) => {
        //     console.log(res)
        // })
        return [{
            fieldItems: [{
                label: '订单编号',
                value: orderData?.internalNumber
            }, {
                label: '采购订单号',
                value: orderData?.internalNumber
            }, {
                label: '订单数量',
                value: orderData?.orderQuantity?.toString()
            }, {
                label: '订单金额',
                value: orderData?.taxAmount?.toString()
            }],
            render: (): React.ReactNode => (
                <Table pagination={ false } bordered={ true } columns={ this.getOrderColumns() }/>
            )
        }];
    }


    public getColumns(): TableColumnType<object>[] {
        return [ {
            key: 'name',
            title: '附件名称',
            dataIndex: 'name'
        }, {
            key: 'fileSize',
            title: '文件大小',
            dataIndex: 'fileSize',
        }, {
            key: 'winBidType',
            title: '上传时间',
            dataIndex: 'winBidType',
            render: (productType: number): React.ReactNode => {
                return  productType === 1 ? '国家电网' : '南方电网';
            }
        }, {
            key: 'userName',
            title: '上传人员',
            dataIndex: 'userName'
        },  {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }];
    }

    /**
     * @description Gets charging record columns
     * @returns charging record columns 
     */
    private getChargingRecordColumns(): ColumnsType<object> {
        return [{
            title: '来款时间',
            dataIndex: 'chargingTime'
        }, {
            title: '来款单位',
            dataIndex: 'chargerOrg'
        }, {
            title: '来款方式',
            dataIndex: 'chargingType'
        }, {
            title: '来款金额（￥）',
            dataIndex: 'amount'
        }, {
            title: '币种',
            dataIndex: 'currency'
        }, {
            title: '汇率',
            dataIndex: 'exchangeRate'
        }, {
            title: '外币金额',
            dataIndex: 'foreignCurrencyExchange'
        }, {
            title: '收款银行',
            dataIndex: 'bank'
        }, {
            title: '备注',
            dataIndex: 'description'
        }];
    }

    /**
     * @description Gets charging record summariable items
     * @returns charging record summariable items 
     */
    private getChargingRecordSummariableItems(): IRenderdSummariableItem[] {
        return [{
            fieldItems: [{
                label: '第1期回款计划',
                value: '2019-04-01'
            }, {
                label: '计划回款占比',
                value: '33.33%'
            }, {
                label: '计划回款金额',
                value: '¥ 15,000.00'
            }, {
                label: '已回款金额',
                value: '¥ 5,000.00'
            }, {
                label: '未回款金额',
                value: '¥ 10,000.00'
            }],
            renderExtraInBar: (): React.ReactNode => (
                <Button type="primary">添加</Button>
            ),
            render: (): React.ReactNode => (
                <>
                    <Table pagination={ false } bordered={ true } columns={ this.getChargingRecordColumns() }/>
                    可以换成动态添加表单Form.List
                </>
            )
        }, {
            fieldItems: [{
                label: '第2期回款计划',
                value: '2019-04-01'
            }, {
                label: '计划回款占比',
                value: '33.33%'
            }, {
                label: '计划回款金额',
                value: '¥ 15,000.00'
            }, {
                label: '已回款金额',
                value: '¥ 5,000.00'
            }, {
                label: '未回款金额',
                value: '¥ 10,000.00'
            }],
            renderExtraInBar: (): React.ReactNode => (
                <Button type="primary">添加</Button>
            ),
            render: (): React.ReactNode => (
                <>
                    <Table pagination={ false } bordered={ true } columns={ this.getChargingRecordColumns() }/>
                    可以换成动态添加表单Form.List
                </>
            )
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
                title: '订单信息',
                render: (): React.ReactNode => SummaryRenderUtil.renderSummariableAreas(this.getOrderSummariableItems())
            }, {
                title: '系统信息',
                render: (): React.ReactNode => SummaryRenderUtil.renderGrid(this.getSysInfoGrid())
            }])
        }, {
            label: '相关附件',
            key: 2,
            content: SummaryRenderUtil.renderSections([{
                title: '相关附件',
                render: (): React.ReactNode => {
                    const detail = this.state?.detail;
                    const dataSource = detail?.attachVos
                    return (
                        <>
                            <Table dataSource={ dataSource } columns={ this.getColumns() } />
                        </>
                    )
                }
            }])
        }, {
            label: '回款记录',
            key: 3,
            content: SummaryRenderUtil.renderSections([{
                title: '回款记录',
                render: (): React.ReactNode => SummaryRenderUtil.renderSummariableAreas(this.getChargingRecordSummariableItems())
            }])
        }];
    }
}

export default withRouter(withTranslation()(ContractDetail));