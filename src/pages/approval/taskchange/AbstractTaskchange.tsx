import { Button, FormProps, message, Table, TableColumnType } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import AbstractFillableComponent, {
    IAbstractFillableComponentState,
    IFormItemGroup
} from '../../../components/AbstractFillableComponent';
import { IProduct } from '../../IProduct';
import { ITask } from '../../ITask';
import RequestUtil from '../../../utils/RequestUtil';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
import { WithTranslation } from 'react-i18next';

/**
 * Iabstract contract setting state
 */
export interface IAbstractTaxkchangeState extends IAbstractFillableComponentState {
    readonly contract: ITaskChange,
    readonly productInfoVOList?: IProductInfoVOList[],
    readonly productChangeInfoVOList?: IProduct[];
}
/**
 * ITaskChange
 */
export interface ITaskChange extends ITask {
    readonly auditStatus: number;
    //业主单位
    readonly customerCompany?: string;
    //合同签订单位
    readonly signCustomerName?: string;
    //签订日期
    readonly signContractTime?: string;
    //订单交货日期
    readonly orderDeliveryTime?: string;
    readonly productChangeInfoVOList?: IProduct[];
    readonly productInfoVOList: IProductInfoVOList[];
}

export interface IProductInfoVOList {
    readonly contractNumber?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly customerCompany?: string;
    readonly signCustomerName?: string;
    readonly signContractTime?: string;
    readonly deliveryTime?: string;
    readonly currencyType?: number;
    readonly chargeType?: number;
    readonly orderDeliveryTime?: object;
    readonly contractId?: number;
    readonly signCustomerId?: number;
}
export interface ITaskChangeApprovalProps {
    readonly businessId: any;
    readonly id: string;
}
export interface ITaskChangeApprovalRouteProps extends RouteComponentProps<ITaskChangeApprovalProps>, WithTranslation {}
/**
 * Abstract Contract Setting
 */
export default abstract class AbstractTaskChange<P extends ITaskChangeApprovalRouteProps, S extends IAbstractTaxkchangeState> extends AbstractFillableComponent<P, S> {
    /**
     * State  of abstract taxkchange
     */
    public state: S = {
        contract: {},
        productInfoVOList: {},
        productChangeInfoVOList: {}
    } as S;
    /**
     * @override
     * @description Gets form props
     * @returns form props 
     */
    //form间隙
    protected getFormProps(): FormProps {
        return {
            ...super.getFormProps(),
            labelCol: {
                span: 10
            },
            wrapperCol: {
                span: 16
            }
        };
    }
    /**
     * Gets form item groups
     * @returns form item groups 
     */
    abstract getFormItemGroups(): IFormItemGroup[][]
    /**
     * Returns abstract taxkchange
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        return [{
            title: '产品信息',
            render: (): React.ReactNode => {
                return <Table rowKey="changeType" bordered={true} pagination={false}
                    columns={this.getProductTableColumns()}
                    dataSource={this.state.contract?.productChangeInfoVOList}
                />;
            }
        }];
    }
    /**
     * Determines whether submit on
     * @param values 
     * @returns submit 
     */
    abstract onSubmit(values: Record<string, any>): Promise<void>
    /**
     * Determines whether reject on
     */
    abstract onReject = (): Promise<void> => {
        const contract: ITaskChange | undefined = this.state.contract;
        return RequestUtil.post('/tower-market/audit/reject', {
            auditId: this.props.match.params.id,
            description: "驳回"
        }).then((): void => {
            message.warning('已驳回任务单  审批的申请！');
            this.props.history.push(this.getReturnPath());
        });
    }
    /**
     * Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return "/approval/task";
    }
     /**
     * @description Gets primary operation button
     * @returns primary operation button
     */
    protected getPrimaryOperationButton(): React.ReactNode {
        return <Button type="primary" htmlType="submit">通过</Button>;
    }
    protected renderExtraOperationArea(): React.ReactNode {
        return <Button type="primary" htmlType="button" onClick={this.onReject}>驳回</Button>
    }
    /**
    * Gets product table columns
    * @returns product table columns 
    */
    abstract getProductTableColumns(): TableColumnType<object>[]


}

