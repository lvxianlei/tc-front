/**
 * @author zyc
 * @copyright © 2021 
 */
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractContractSetting, { IAbstractContractSettingState, IPaymentPlanDto } from './AbstractContractSetting';
import moment from 'moment'

export interface IContractNewProps {}
export interface IContractNewRouteProps extends RouteComponentProps<IContractNewProps>, WithTranslation {}
export interface IContractNewState extends IAbstractContractSettingState {}

/**
 * Create a new client.
 */
class ContractNew extends AbstractContractSetting<IContractNewRouteProps, IContractNewState> {

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public async onSubmit(values: Record<string, any>): Promise<void> {
    values.signContractTime = moment(values.signContractTime).format('YYYY-MM-DD');
    values.deliveryTime = moment(values.deliveryTime).format('YYYY-MM-DD');
    values.reviewTime = moment(values.reviewTime).format('YYYY-MM-DD HH:mm');
    values.paymentPlanDtos = values.paymentPlanDtos?.map((plan: IPaymentPlanDto, index: number): IPaymentPlanDto => {
        return {
            ...plan,
            returnedTime: moment(plan.returnedTime).format('YYYY-MM-DD'),
            index: index + 1
        };
    });
    //  return Promise.resolve();
        return await RequestUtil.post('/tower-market/contract', values);
    }
}

export default withRouter(withTranslation()(ContractNew));