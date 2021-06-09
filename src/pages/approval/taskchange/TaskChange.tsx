import { DatePicker, Input, message, Select, TableColumnType, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFormItemGroup } from '../../../components/AbstractFillableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import AbstractProductchange, { IAbstractTaxkchangeState, IContract } from './AbstractTaskchange';


export interface ITaxkChangeProps {
    readonly businessId: string;
    readonly id: string;
}
//产品类型
enum ProductType {
    ANGLE_STEEL_TOWER = 0,  //"角钢塔" 
    TUBE_TOWER = 1,        //"管塔"
    BOLT = 2              //"螺栓"
}
export interface ITaxkChangeRouteProps extends RouteComponentProps<ITaxkChangeProps>, WithTranslation { }
export interface ITaxkchangeState extends IAbstractTaxkchangeState { }

class TaskChange extends AbstractProductchange<ITaxkChangeRouteProps, ITaxkchangeState> {
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
     * Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const contract: IContract = await RequestUtil.get<IContract>(
            `/tower-market/taskNotice/auditDetail`,
            {
                auditId: this.props.match.params.id,
                taskNoticeId: this.props.match.params.businessId
            });
        this.setState({
            contract: contract,
            productChangeInfoVOList: contract.productChangeInfoVOList,
            productInfoVOList: contract.productInfoVOList
        });
        this.getForm()?.setFieldsValue({
            ...contract,
            signContractTime: moment(contract.signContractTime),
            planDeliveryTime: moment(contract.planDeliveryTime),
            deliveryTime: moment(contract.deliveryTime),
        });
    }


    /**
     * Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public onSubmit(values: Record<string, any>): Promise<void> {
        return RequestUtil.post('/tower-market/audit/adopt', {
            auditId: values.contractId,
            description: "通过"
        }).then((): void => {
            message.success('操作已成功！任务单 产品变更审批 已通过审批。');
            this.props.history.push(this.getReturnPath());

        })
    }
    /**
     * Determines whether reject on
     */
    public onReject = (): Promise<void> => {
        const contract: IContract | undefined = this.state.contract;
        return RequestUtil.post('/tower-market/audit/reject', {
            auditId: contract.id,
            description: "驳回"
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
        return "/approval/task";
    }



    /**
     * Gets product table columns
     * @returns product table columns 
     */
    getProductTableColumns(): TableColumnType<object>[] {
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

export default withRouter(withTranslation()(TaskChange));
