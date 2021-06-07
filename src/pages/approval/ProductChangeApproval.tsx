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
    readonly id: string;
}
export interface IProductChangeApprovalRouteProps extends RouteComponentProps<IProductChangeApprovalProps>, WithTranslation {}
export interface IProductChangeApprovalState extends IAbstractSaleOrderSettingState {}

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
        return "/approval/list";
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
            saleOrder: {
                ...saleOrder,
                productChangeRecordVos: saleOrder.productChangeRecordVos?.map<IProductVo>((product: IProductVo, index: number): IProductVo => {
                    return {
                        ...product,
                        index: index + 1
                    };
                })
            }
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
     * @param values 
     * @returns submit 
     */
    public onSubmit(values: Record<string, any>): Promise<void> {
        return RequestUtil.post('/tower-market/audit/adopt', {
            auditId: values.id
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
        return [{
            title: '类型',
            dataIndex: 'changeType',
            render: (changeType: number): React.ReactNode => {
                switch (changeType) {
                    case 0:
                        return '未变更';
                    case 3:
                        return '修改内容';
                }
                return changeType === 1 ? '变更前' : '变更后';
            }
        }, {
            title: '版本',
            dataIndex: 'recordType',
            render: (recordType: number): React.ReactNode => {
                return recordType === 1 ? '变更前' : '变更后';
            }
        }, {
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
            title: '电压等级',
            dataIndex: 'voltageGrade'
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
                return <Table rowKey="index" bordered={ true } pagination={ false }
                    columns={ this.getProductTableColumns() } dataSource={ this.state.saleOrder?.productChangeRecordVos }/>;
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
        return <Button type="default" onClick={ this.onReject }>驳回</Button>;
    }
}

export default withRouter(withTranslation()(ProductChangeApproval));