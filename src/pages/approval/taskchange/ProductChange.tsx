import { Button, DatePicker, FormProps, Input, message, Select, Table, TableColumnType } from 'antd';
import moment from 'moment';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFormItemGroup } from '../../../components/AbstractFillableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import AbstractTaxkchange, { IAbstractTaxkchangeState, IContract, IProductChangeInfoVOList } from './AbstractTaskchange';
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

class ProductChange extends AbstractTaxkchange<ITaxkChangeRouteProps, ITaxkchangeState> {

    /**
    * @description Components did mount
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
    onSubmit(values: Record<string, any>): Promise<void> {
        return RequestUtil.post('/tower-market/audit/adopt', {
            auditId: values.contractId
        }).then((): void => {
            message.success('操作已成功！任务单  已通过审批。');
            this.props.history.push(this.getReturnPath());
        })
    }
    /**
     * Determines whether reject on
     */
    public onReject = (): Promise<void> => {
        const contract: IContract | undefined = this.state.contract;
        return RequestUtil.post('/tower-market/audit/reject', {
            auditId: contract.id
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
     * Gets product table columns
     * @returns product table columns 
     */
    getProductTableColumns(): TableColumnType<object>[] {
        return [{
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

export default withRouter(withTranslation()(ProductChange));
