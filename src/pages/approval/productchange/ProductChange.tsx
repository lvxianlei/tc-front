import { Button, DatePicker, FormProps, Input, message, Select, Table, TableColumnType } from 'antd';
import moment from 'moment';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import RequestUtil from '../../../utils/RequestUtil';
import AbstractContractSetting, { IAbstractTaxkchangeState, IContract } from './AbstractProductchange';
export interface ITaxkChangeProps {
    readonly id: string;
}
export interface ITaxkChangeRouteProps extends RouteComponentProps<ITaxkChangeProps>, WithTranslation { }
export interface ITaxkchangeState extends IAbstractTaxkchangeState { }

class ProductChange extends AbstractContractSetting<ITaxkChangeRouteProps, ITaxkchangeState> {

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const contract: IContract = await RequestUtil.get<IContract>(`/tower-market/taskNotice/auditDetail`);
        this.setState({
            contract: contract,
            productChangeInfoVOList: contract.productChangeInfoVOList
        });
        this.getForm()?.setFieldsValue({
            id: contract.id,
            saleOrderNumber: contract.saleOrderNumber,
            contractId: contract.contractId,
            projectName: contract.projectName,
            signCustomerName: contract.signCustomerName,
            signContractTime: moment(contract.signContractTime),
            customerCompany: contract.customerCompany,
            planDeliveryTime: moment(contract.planDeliveryTime),
            deliveryTime: moment(contract.deliveryTime),
            description: contract.description,
            weldingDemand: contract.weldingDemand,
            packDemand: contract.packDemand,
            galvanizeDemand: contract.galvanizeDemand,
            materialDemand: contract.materialDemand,
            productChangeInfoVOList: contract.productChangeInfoVOList,
            productInfoVOList: contract?.productInfoVOList,
            peculiarDescription: contract?.peculiarDescription,
            auditStatus: contract?.auditStatus
        });
    }

}

export default withRouter(withTranslation()(ProductChange));
