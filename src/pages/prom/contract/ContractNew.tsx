/**
 * @author zyc
 * @copyright © 2021 
 */
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractContractSetting, { IAbstractContractSettingState, IPaymentPlanDto, planType } from './AbstractContractSetting';
import moment from 'moment'
import { message } from 'antd';

export interface IContractNewProps { }
export interface IContractNewRouteProps extends RouteComponentProps<IContractNewProps>, WithTranslation { }
export interface IContractNewState extends IAbstractContractSettingState { }

/**
 * Create a new client.
 */
export class ContractNew extends AbstractContractSetting<IContractNewRouteProps, IContractNewState> {

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public async onSubmit(values: Record<string, any>): Promise<void> {
        const planValue: IPaymentPlanDto[] = this.getForm()?.getFieldsValue(true).paymentPlanDtos;
        let totalRate: number = 0;
        planValue.map<number>((item: IPaymentPlanDto): number => {
            return totalRate = parseFloat((Number(item.returnedRate) + Number(totalRate)).toFixed(2));
        })
        let totalAmount: number = 0;
        planValue.map<number>((item: IPaymentPlanDto): number => {
            return totalAmount = parseFloat((Number(item.returnedAmount) + Number(totalAmount)).toFixed(2));
        })
        values.signContractTime = values.signContractTime && moment(values.signContractTime).format('YYYY-MM-DD');
        /**
         * 要求交货日期修改为可以输入控制的
         */
        // values.deliveryTime = values.deliveryTime && moment(values.deliveryTime).format('YYYY-MM-DD');
        values.reviewTime = values.reviewTime && moment(values.reviewTime).format('YYYY-MM-DD HH:mm');
        values.paymentPlanDtos = values.paymentPlanDtos?.map((plan: IPaymentPlanDto, index: number): IPaymentPlanDto => {
            return {
                ...plan,
                returnedTime: moment(plan.returnedTime).format('YYYY-MM-DD'),
                period: index + 1
            };
        });
        values.customerInfoDto = {
            ...(this.state.contract?.customerInfoDto),
            customerLinkman: values.customerLinkman,
            customerPhone: values.customerPhone
        };
        values.signCustomerId = this.state.contract?.signCustomerId;
        values.payServiceManager = this.state.contract?.payServiceManager;
        values.ascriptionId = this.state.contract?.ascriptionId;
        if (planValue.length > 0) {
            if (totalRate < 100) {
                message.error('计划回款总占比必须等于100');
                return Promise.reject(false);
            } else if (totalRate > 100) {
                message.error('计划回款总占比必须等于100');
                return Promise.reject(false);
            } else if (totalAmount < values.contractAmount) {
                message.error('计划回款总金额必须等于合同总价');
                return Promise.reject(false);
            } else if (totalAmount > values.contractAmount) {
                message.error('计划回款总金额必须等于合同总价');
                return Promise.reject(false);
            } else {
                console.log(!values.contractPrice)
                if (!values.contractPrice) {
                    values.contractPrice = "0"
                }
                if (!values.contractAmount) {
                    values.contractAmount = "0"
                }
                if (!values.contractTotalWeight) {
                    values.contractTotalWeight = "0"
                }
                return await RequestUtil.post('/tower-market/contract', {
                    ...values,
                    projectId: (this.props.match.params as any).projectId,
                    fileIds: this.getAttchsRef()?.getDataSource().map(item=>item.id)
                });
            }
        } else {
            message.error('回款计划无数据，需新增！');
            return Promise.reject(false);
        }
    }
}

export default withRouter(withTranslation()(ContractNew));
