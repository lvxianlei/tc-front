/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, message, Table, TableColumnType } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import { IFormItemGroup } from '../../components/AbstractFillableComponent';
import RequestUtil from '../../utils/RequestUtil';
import { IRenderedSection } from '../../utils/SummaryRenderUtil';
import AbstractSaleOrderSetting, {
    IAbstractSaleOrderSettingState,
    IProductVo,
    ISaleOrder,
} from '../prom/order/AbstractSaleOrderSetting';

export interface IProductChangeApprovalProps {
    readonly businessId: any;
    readonly id: string;
}
export interface IProductChangeApprovalRouteProps extends RouteComponentProps<IProductChangeApprovalProps>, WithTranslation { }
export interface IProductChangeApprovalState extends IAbstractSaleOrderSettingState { }
//产品类型
enum ProductType {
    ANGLE_STEEL_TOWER = 0,  //"角钢塔" 
    TUBE_TOWER = 1,        //"管塔"
    BOLT = 2              //"螺栓"
}
//类型
enum StateType {
    UNCHANGED = 0,              //未变更
    NEWREFERENCE = 1,         //新增引用
    QUOTE = 2,                //删除引用
    MODIFYREFERENCE = 3     //修改引用内容         
}
//状态
enum ProductStatus {
    UTO_BEISSUED = 0,         // 待下发
    UNDER_APPROVAL = 1,      // 审批中
    ISSUED = 2             // 已下发
}
/**
 * Product change approval
 */
class ProductChangeApproval extends AbstractSaleOrderSetting<IProductChangeApprovalRouteProps, IProductChangeApprovalState> {


    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IProductChangeApprovalState {
        return {
            ...super.getState(),
            isChangeProduct: true
        };
    }

    /**
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return "/approval/task";
    }

    /**
     * @override
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const saleOrder: ISaleOrder = await RequestUtil.get<ISaleOrder>('/tower-market/saleOrder/getSaleOrderByAuditId', {
            auditId: this.props.match.params.id
        });
        this.setState({
            saleOrder: saleOrder,
            isChangeProduct: true
        });
        saleOrder.productDtos = saleOrder.productDtos?.map<IProductVo>((product: IProductVo, index: number): IProductVo => {
            return {
                ...product,
                index: index + 1
            };
        });
        this.setState({
            saleOrder: {
                ...saleOrder,
                contractInfoDto: saleOrder.contractInfoVo,
                productChangeRecordVos: saleOrder.productChangeRecordVos?.map<IProductVo>((product: IProductVo, index: number): IProductVo => {
                    return {
                        ...product,
                        index: index + 1
                    };
                })
            }
        })
        this.getForm()?.setFieldsValue({
            totalWeight: saleOrder.orderQuantity,
            totalPrice: saleOrder.taxPrice,
            totalAmount: saleOrder.taxAmount,
            orderQuantity: saleOrder.orderQuantity,
            chargeType: saleOrder.contractInfoVo?.chargeType,
            contractId: saleOrder.contractInfoVo?.contractId,
            currencyType: saleOrder.contractInfoVo?.currencyType,
            customerCompany: saleOrder.contractInfoVo?.customerCompany,
            deliveryTime: saleOrder.contractInfoVo?.deliveryTime,
            internalNumber: saleOrder.contractInfoVo?.internalNumber,
            projectName: saleOrder.contractInfoVo?.projectName,
            signContractTime: saleOrder.contractInfoVo?.signContractTime,
            signCustomerId: saleOrder.contractInfoVo?.signCustomerId,
            signCustomerName: saleOrder.contractInfoVo?.signCustomerName,
            productDtos: saleOrder.productVos,
        });
    }

    /**
     * @override
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        if (this.state.saleOrder) {
            return super.getFormItemGroups();
        }
        return [];
    }

    /**
     * @override
     * @description Determines whether submit on
     * @param _values 
     * @returns submit 
     */
    public onSubmit(_values: Record<string, any>): Promise<void> {
        return RequestUtil.post('/tower-market/audit/adopt', {
            auditId: this.props.match.params.id
        }).then((): void => {
            message.success('操作已成功！变更产品信息已通过审批。');
        });
    }

    /**
     * @description Determines whether reject on
     * @returns reject 
     */
    public onReject = (): Promise<void> => {
        return RequestUtil.post('/tower-market/audit/reject', {
            auditId: this.props.match.params.id
        }).then((): void => {
            message.warning('已驳回产品信息变更的申请！');
            this.props.history.push(this.getReturnPath());
        });
    }

    /**
     * @description Gets product table columns
     * @returns product table columns 
     */
    private getProductTableColumns(): TableColumnType<object>[] {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        return [{
            title: '类型',
            dataIndex: 'changeType',
            render: (changeType: number): React.ReactNode => {
                switch (changeType) {
                    case StateType.UNCHANGED:
                        return '未变更';
                    case StateType.MODIFYREFERENCE:
                        return '修改';
                    case StateType.NEWREFERENCE:
                        return '变更前'
                    case StateType.QUOTE:
                        return '变更后'
                }
            }
        }, {
            title: '序号',
            dataIndex: 'index'
        },
        {
            title: '线路名称',
            dataIndex: 'lineName'
        }, {
            title: '产品类型',
            dataIndex: 'productType',
            render: (productType: number): React.ReactNode => {
                switch (productType) {
                    case ProductType.ANGLE_STEEL_TOWER:
                        return "角钢塔"
                    case ProductType.TUBE_TOWER:
                        return "管塔"
                    case ProductType.BOLT:
                        return "螺栓"
                }
            }
        }, {
            title: '塔型',
            dataIndex: 'productShape'
        }, {
            title: '杆塔号',
            dataIndex: 'productNumber'
        }, {
            title: '电压等级',
            dataIndex: 'voltageGrade',
            render: (voltageGrade: number): React.ReactNode => {
                switch (voltageGrade) {
                    case 1:
                        return <span>220 KV</span>
                    case 2:
                        return <span>110 KV</span>
                }
            }
        }, {
            title: '呼高（米）',
            dataIndex: 'productHeight'
        }, {
            title: '单位',
            dataIndex: 'unit'
        }, {
            title: '重量（吨）',
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
     * @override
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        return [{
            title: '产品信息',
            render: (): React.ReactNode => {
                return <Table rowKey="index" bordered={true} pagination={false}
                    columns={this.getProductTableColumns()} dataSource={this.state.saleOrder?.productChangeRecordVos} />;
            }
        }];
    }

    /**
     * @override
     * @description Gets primary operation button label
     * @returns primary operation button label 
     */
    protected getPrimaryOperationButtonLabel(): string {
        return '通过';
    }

    /**
     * @override
     * @description Descriptions product change approval
     * @returns extra operation area 
     */
    protected renderExtraOperationArea(): React.ReactNode {
        return <Button type="default" onClick={this.onReject}>驳回</Button>;
    }
}

export default withRouter(withTranslation()(ProductChangeApproval));