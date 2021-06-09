import { Button, DatePicker, FormProps, Input, message, Select, Table, TableColumnType, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import AbstractFillableComponent, {
    IAbstractFillableComponentState,
    IFormItemGroup
} from '../../../components/AbstractFillableComponent';
import styles from "../ApprovalList.module.less"
import RequestUtil from '../../../utils/RequestUtil';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';

/**
 * Iabstract contract setting state
 */
export interface IAbstractTaxkchangeState extends IAbstractFillableComponentState {
    readonly contract: IContract,
    readonly productInfoVOList?: IProductInfoVOList[],
    readonly productChangeInfoVOList?: IProductChangeInfoVOList[]
}
/**
 * Icontract
 */
export interface IContract {
    //原材料标准
    readonly materialStandard: number;
    readonly auditStatus: number;
    readonly id?: number;
    //任务编号
    readonly taskNumber: number;
    //关联订单
    readonly saleOrderNumber: number;
    //合同编号
    readonly contractId: number;
    //工程名称
    readonly projectName?: string;
    //业主单位
    readonly customerCompany?: string;
    //合同签订单位
    readonly signCustomerName?: string;
    //签订日期
    readonly signContractTime?: string;
    //客户交货日期
    readonly deliveryTime?: string;
    //订单交货日期
    readonly orderDeliveryTime?: string;
    //计划交货日期
    readonly planDeliveryTime: string;
    //计划备注
    readonly description?: string;
    //原材料标准
    readonly materialDemand?: string;
    //焊接要求
    readonly weldingDemand?: string;
    //包装要求
    readonly packDemand?: string;
    //镀锌要求
    readonly galvanizeDemand?: string;
    //特殊要求备注
    readonly peculiarDescription?: string;

    readonly productChangeInfoVOList?: IProductChangeInfoVOList[];
    readonly productInfoVOList: IProductInfoVOList[];
}
;


//变更明细
export interface IProductChangeInfoVOList {
    readonly index?: number;
    readonly productStatus?: number;
    //备注
    readonly description?: string;
    readonly id?: number;
    //线路名称
    readonly lineName?: string;
    readonly productTypeName: string;
    //数量
    readonly num: number;
    readonly price: number;
    //呼高
    readonly productHeight?: number;
    //塔杆号
    readonly productNumber?: string;
    //塔型
    readonly productShape?: string;
    readonly productType?: number;
    readonly saleOrderId?: number;
    //标段
    readonly tender?: string;
    readonly totalAmount: number;
    //单位
    readonly unit?: string;
    //电压等级名称
    readonly voltageGradeName?: string;
    //电压等级id
    readonly voltageGrade?: number;
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

/**
 * Abstract Contract Setting
 */
export default abstract class AbstractTaskChange<P extends RouteComponentProps, S extends IAbstractTaxkchangeState> extends AbstractFillableComponent<P, S> {
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
    getFormItemGroups(): IFormItemGroup[][] {
        const contract: IContract | undefined = this.state.contract;
        return [[{
            title: '基础信息',
            itemCol: {
                span: 8
            },
            itemProps: [{
                label: '任务编号',
                name: 'taskNumber',
                initialValue: contract?.taskNumber,
                children: <Input disabled />
            }, {
                label: '关联订单',
                name: 'saleOrderNumber',
                initialValue: contract?.saleOrderNumber,
                children: <Input disabled />
            }, {
                label: '合同编号',
                name: 'contractId',
                initialValue: contract?.contractId,
                children: <Input disabled />,
            }, {
                label: '工程名称',
                name: 'projectName',
                initialValue: contract?.projectName,
                children: <Input disabled />
            }, {
                label: '业主单位',
                name: 'customerCompany',
                initialValue: contract?.customerCompany,
                children: <Input disabled />

            }, {
                label: '合同签订单位',
                name: 'signCustomerName',
                initialValue: contract?.signCustomerName,
                children: <Input disabled />
            }, {
                label: '合同签订日期',
                name: 'signContractTime',
                initialValue: moment(contract?.signContractTime),
                rules: [{
                    required: true,
                    message: '请选择合同签订日期'
                }],
                children: <DatePicker format="YYYY-MM-DD" disabled />
            }, {
                label: '客户交货日期',
                name: 'deliveryTime',
                initialValue: moment(contract?.deliveryTime),
                children: <DatePicker format="YYYY-MM-DD" disabled />
            }, {
                label: '计划交货日期',
                name: 'planDeliveryTime',
                initialValue: moment(contract?.planDeliveryTime),
                children: <DatePicker format="YYYY-MM-DD" disabled />
            }, {
                label: '计划备注',
                name: 'description',
                initialValue: contract?.description,
                children: <Input.TextArea disabled />
            }]
        }, {
            title: '特殊要求',
            itemCol: {
                span: 8
            },
            itemProps: [{
                label: '原材料标准',
                name: 'materialStandard',
                initialValue: contract?.materialStandard || 1,
                children: (
                    <Select disabled>
                        <Select.Option value={1}>国家电网</Select.Option>
                        <Select.Option value={2}>南方电网</Select.Option>
                    </Select>
                )
            }, {
                label: '焊接要求',
                name: 'weldingDemand',
                initialValue: contract?.weldingDemand,
                children: <Input disabled />
            }, {
                label: '包装要求',
                name: 'packDemand',
                initialValue: contract?.packDemand,
                children: <Input disabled />
            }, {
                label: '镀锌要求',
                name: 'galvanizeDemand',
                initialValue: contract?.galvanizeDemand,
                children: <Input disabled />
            }, {
                label: '备注',
                name: 'peculiarDescription',
                initialValue: contract?.peculiarDescription,
                children: <Input.TextArea disabled />
            }]
        }]];
    }
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
        const contract: IContract | undefined = this.state.contract;
        return RequestUtil.post('/tower-market/audit/reject', {
            auditId: "1402131886490787842"
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
     * @override
     * @description Gets primary operation button label
     * @returns primary operation button label 
     */
    protected getPrimaryOperationButtonLabel(): string {
        return '通过'
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

