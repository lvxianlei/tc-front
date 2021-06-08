import { Button, DatePicker, FormProps, Input, message, Select, Table, TableColumnType } from 'antd';
import moment from 'moment';
import React from 'react';
// import {AxiosResponse} from   "axios"
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
    readonly auditStatus: number;
    readonly id?: number;
    //任务编号
    readonly taskNoticeId: number;
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
    readonly productInfoVOList?: IProductInfoVOList[];
};

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
 * Iresponse
 * @template T 
 */
interface IResponse<T = any> {
    readonly code: number;
    readonly msg: string;
    readonly data: T;
}
/**
 * Abstract Contract Setting
 */
export default abstract class AbstractTaxkchange<P extends RouteComponentProps, S extends IAbstractTaxkchangeState> extends AbstractFillableComponent<P, S> {
    /**
     * State  of abstract taxkchange
     */
    public state: S = {
        contract: {},
        productInfoVOList: {},
        productChangeInfoVOList: {}
    } as S;
    /**
     * Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
    }



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
    public getFormItemGroups(): IFormItemGroup[][] {
        const contract: IContract | undefined = this.state.contract;
        return [[{
            title: '基础信息',
            itemCol: {
                span: 8
            },
            itemProps: [{
                label: '任务编号',
                name: 'taskNoticeId',
                initialValue: contract?.taskNoticeId,
                children: <Input value={contract?.taskNoticeId} disabled />
            }, {
                label: '关联订单',
                name: 'saleOrderNumber',
                initialValue: contract?.saleOrderNumber,
                children: <Input value={contract?.saleOrderNumber} disabled />
            }, {
                label: '合同编号',
                name: 'contractId',
                initialValue: contract?.contractId,
                children: <Input value={contract?.contractId} disabled />,
            }, {
                label: '工程名称',
                name: 'projectName',
                initialValue: contract?.projectName,
                children: <Input value={contract?.projectName} disabled />
            }, {
                label: '业主单位',
                name: 'customerCompany',
                initialValue: contract?.customerCompany,
                children: <Input value={contract?.customerCompany} disabled />

            }, {
                label: '合同签订单位',
                name: 'signCustomerName',
                initialValue: contract?.signCustomerName,
                children: <Input value={contract?.customerCompany} disabled />
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
                children: <Input.TextArea value={contract?.description} disabled />
            }]
        }, {
            title: '特殊要求',
            itemCol: {
                span: 8
            },
            itemProps: [{
                label: '原材料标准',
                name: 'materialDemand',
                initialValue: contract?.materialDemand,
                children: (
                    <Select className={styles.materialStandards} disabled>
                        <Select.Option value="over">未定义</Select.Option>
                    </Select>
                )
            }, {
                label: '焊接要求',
                name: 'weldingDemand',
                initialValue: contract?.weldingDemand,
                children: <Input value={contract?.weldingDemand} disabled />
            }, {
                label: '包装要求',
                name: 'packDemand',
                initialValue: contract?.packDemand,
                children: <Input value={contract?.packDemand} disabled />
            }, {
                label: '镀锌要求',
                name: 'galvanizeDemand',
                initialValue: contract?.galvanizeDemand,
                children: <Input value={contract?.galvanizeDemand} disabled />
            }, {
                label: '备注',
                name: 'peculiarDescription',
                initialValue: contract?.peculiarDescription,
                children: <Input.TextArea value={contract?.peculiarDescription} disabled />
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
                    dataSource={this.state.contract?.productInfoVOList}
                />;
            }
        }];
    }
    /**
     * Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public onSubmit(values: Record<string, any>): Promise<void> {
        return RequestUtil.post('/tower-market/audit/adopt', {
            auditId: values.contractId
        }).then((res: IResponse | any): void => {
            if (!res.data) {
                message.warning("操作失败,请稍后再试!")
            } else {
                message.success('操作已成功！任务单信息已通过审批。');
                this.props.history.push(this.getReturnPath());
            }

        });
    }
    /**
     * Determines whether reject on
     */
    public onReject = (): Promise<void> => {
        return RequestUtil.post('/tower-market/audit/reject', {
            auditId: this.props.match.params
        }).then((res: IResponse | any): void => {
            if (!res.data) {
                message.warning("操作失败,请稍后再试!")
            } else {
                message.warning('已驳回任务单审批的申请！');
                this.props.history.push(this.getReturnPath());
            }


        });
    }
    /**
     * Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return "/approval/list";
    }
    /**
     * @override
     * @description Gets primary operation button label
     * @returns primary operation button label 
     */
    protected getPrimaryOperationButtonLabel(): string {
        return '通过';
    }

    protected renderExtraOperationArea(): React.ReactNode {
        return <Button type="primary" htmlType="button" onClick={this.onReject}>驳回</Button>;
    }
    /**
    * Gets product table columns
    * @returns product table columns 
    */
    private getProductTableColumns(): TableColumnType<object>[] {
        return [{
            title: '线路名称',
            dataIndex: 'lineName'
        }, {
            title: '产品类型',
            dataIndex: 'productTypeName'
        }, {
            title: '塔型',
            dataIndex: 'productShape	'
        }, {
            title: '杆塔号',
            dataIndex: 'productNumber'
        }, {
            title: '电压等级',
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
            title: '标段',
            dataIndex: 'tender'
        }, {
            title: '备注',
            dataIndex: 'description'
        }];
    }


}

