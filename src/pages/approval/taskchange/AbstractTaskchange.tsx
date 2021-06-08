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
    public getFormItemGroups(): IFormItemGroup[][] {
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
                children: <Input value={contract?.taskNumber} disabled />
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
    public onSubmit(values: Record<string, any>): Promise<void> {
        return RequestUtil.post('/tower-market/audit/adopt', {
            auditId: values.contractId
        }).then((): void => {
            message.success('操作已成功！任务单 产品变更审批 已通过审批。');
            this.props.history.push(this.getReturnPath());

        })
    }
    /**
     * Determines whether reject on
     */
    public onReject = (): Promise<void> => {
        return RequestUtil.post('/tower-market/audit/reject', {
            auditId: this.props.match.params
        }).then((): void => {
            message.warning('已驳回任务单 产品 变更 审批的申请！');
            this.props.history.push(this.getReturnPath());
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
        return '通过'
    }
    protected renderExtraOperationArea(): React.ReactNode {
        return <Button type="primary" htmlType="button" onClick={this.onReject}>驳回</Button>
    }
    /**
    * Gets product table columns
    * @returns product table columns 
    */
    private getProductTableColumns(): TableColumnType<object>[] {
        // const contract: IContract | undefined = this.state.contract;
        return [{
            title: '类型',
            dataIndex: 'changeType',
            align: "center",
            render: (changeType: number): React.ReactNode => {
                switch (changeType) {
                    case 0:
                        return <Tag color="default">未变更</Tag>
                    case 1:
                        return <Tag color="success">新增引用</Tag>
                    case 2:
                        return <Tag color="error">删除引用</Tag>
                    case 3:
                        return <Tag color="warning">修改内容</Tag>
                }
            }
        }, {
            title: '线路名称',
            align: "center",
            dataIndex: 'lineName'
        }, {
            title: '产品类型',
            align: "center",
            dataIndex: 'productType',
            render: (productType: number): React.ReactNode => {
                switch (productType) {
                    case 0:
                        return "角钢塔"
                    case 1:
                        return "管塔"
                    case 2:
                        return "螺栓"
                }
            }
        }, {
            title: '塔型',
            align: "center",
            dataIndex: 'productShape'
        }, {
            title: '杆塔号',
            align: "center",
            dataIndex: 'productNumber'
        }, {
            title: '电压等级',
            align: "center",
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
            align: "center",
            dataIndex: 'productHeight'
        }, {
            title: '单位',
            align: "center",
            dataIndex: 'unit'
        }, {
            title: '数量',
            align: "center",
            dataIndex: 'num'
        }, {
            title: '标段',
            align: "center",
            dataIndex: 'tender'
        }, {
            title: '备注',
            dataIndex: 'description'
        }];
    }


}

