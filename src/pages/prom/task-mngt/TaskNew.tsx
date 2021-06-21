/**
 * @author lxy
 * @copyright © 2021 
 */
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 
 import RequestUtil from '../../../utils/RequestUtil';
 import AbstractTaskSetting, { IAbstractTaskSettingState, StepItem } from './AbstactTaskSetting';
 import moment from 'moment'
import { message } from 'antd';
 
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
            productDataSource: [],
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
        values.delproductIdsiveryTime = moment(values.deliveryTime).format('YYYY-MM-DD');
        values.signContractTime = moment(values.signContractTime).format('YYYY-MM-DD');
        values.productIds = this.state.selectedKeys.length > 0 ? this.state.selectedKeys : [];
        values.contractInfoDTO = this.state.contractInfoDTO;
        values.saleOrderId = this.state?.task?.saleOrderId;
        values.id = this.state?.task?.id;
        if(values.deliveryTime > values.signContractTime) {
            message.error("客户交货日期应小于订单交货日期！")
            return Promise.reject(false)
        } 
        else if(this.state.checkStep === StepItem.COMPLETE_PRODUCT_INFO && values.productIds == 0){
            message.error("未选择产品信息，不可提交审批！")
            return Promise.reject(false)
        }
        else {
            return this.state.checkStep === StepItem.COMPLETE_PRODUCT_INFO ? await RequestUtil.post('/tower-market/taskNotice/saveAndSubApprove', values):await RequestUtil.post('/tower-market/taskNotice', values)
        }
     }
 }
 
 export default withRouter(withTranslation()(TaskNew));