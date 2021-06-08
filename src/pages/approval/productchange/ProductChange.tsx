import { Button, DatePicker, FormProps, Input, message, Select, Table, TableColumnType } from 'antd';
import moment from 'moment';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import RequestUtil from '../../../utils/RequestUtil';
import AbstractTaxkchange, { IAbstractTaxkchangeState, IContract } from './AbstractProductchange';
export interface ITaxkChangeProps {
    readonly id: string;
}
export interface ITaxkChangeRouteProps extends RouteComponentProps<ITaxkChangeProps>, WithTranslation { }
export interface ITaxkchangeState extends IAbstractTaxkchangeState { }

class ProductChange extends AbstractTaxkchange<ITaxkChangeRouteProps, ITaxkchangeState> {

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const contract: IContract = await RequestUtil.get<IContract>(`/tower-market/taskNotice/auditDetail`);
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

}

export default withRouter(withTranslation()(ProductChange));
