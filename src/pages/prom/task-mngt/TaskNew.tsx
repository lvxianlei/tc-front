/**
 * @author lxy
 * @copyright © 2021 
 */
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 
 import RequestUtil from '../../../utils/RequestUtil';
 import AbstractTaskSetting, { IAbstractTaskSettingState } from './AbstactTaskSetting';
 import moment from 'moment'
 
 export interface ITaskNewProps {}
 export interface ITaskNewRouteProps extends RouteComponentProps<ITaskNewProps>, WithTranslation {}
 export interface ITaskNewState extends IAbstractTaskSettingState {}
 
 /**
  * Create a new client.
  */
 class TaskNew extends AbstractTaskSetting<ITaskNewRouteProps, ITaskNewState> {

    /**
     * @description Components did mount
     */
       public async componentDidMount() {
        super.componentDidMount();
        this.setState({
            taskTable: [],
        });
    }
 
     /**
      * @implements
      * @description Determines whether submit on
      * @param values 
      * @returns submit 
      */
     public async onSubmit(values: Record<string, any>): Promise<void> {
        values.planDeliveryTime = moment(values.planDeliveryTime).format('YYYY-MM-DD');
        values.deliveryTime = moment(values.deliveryTime).format('YYYY-MM-DD');
        values.signContractTime = moment(values.signContractTime).format('YYYY-MM-DD');
        values.productIds = this.state.selectedKeys;
        console.log(values)
        return Promise.resolve();
        //  return await RequestUtil.post('/tower-market/taskNotice', values);
     }
 }
 
 export default withRouter(withTranslation()(TaskNew));