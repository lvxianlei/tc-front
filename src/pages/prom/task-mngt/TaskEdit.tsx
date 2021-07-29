/**
 * @author lxy
 * @copyright © 2021 
 */
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 
 import RequestUtil from '../../../utils/RequestUtil';
 import AbstractTaskSetting, { IAbstractTaskSettingState, ITaskInfo, StepItem } from './AbstactTaskSetting';
 import moment from 'moment'
 import { IFormItemGroup } from '../../../components/AbstractFillableComponent';
import { message } from 'antd';
 
 export interface ITaskEditProps {
    readonly id: string;
 }
 export interface ITaskEditRouteProps extends RouteComponentProps<ITaskEditProps>, WithTranslation {}
 export interface ITaskEditState extends IAbstractTaskSettingState {}
 
 /**
  * Create a new client.
  */
 class TaskEdit extends AbstractTaskSetting<ITaskEditRouteProps, ITaskEditState> {
      /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const task: ITaskInfo = await RequestUtil.get<ITaskInfo>(`/tower-market/taskNotice/edit`,{id: this.props.match.params.id });
        this.setState({
            task,
            productDataSource: task?.productInfoVOList || [],
        });
    }
    /**
     * @override
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        if (this.state.task) {
            return super.getFormItemGroups();
        }
        return [];
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
        values.orderDeliveryTime = moment(values.orderDeliveryTime).format('YYYY-MM-DD');
        values.productIds = this.state.productDataSource.map(item=>{
            return item.id
        });
        values.contractInfoDTO = this.state?.taskInfoDTO;
        values.saleOrderId = this.state?.task?.saleOrderId;
        values.id =  this.props.match.params.id;
        if(values.deliveryTime > values.orderDeliveryTime) {
            message.error("客户交货日期应小于订单交货日期！")
            return Promise.reject(false)
        } 
        // else if(this.state.checkStep === StepItem.COMPLETE_PRODUCT_INFO && values.productIds == 0){
        //     message.error("未选择产品信息，不可提交审批！")
        //     return Promise.reject(false)
        // }
        else {
            return this.state.checkStep === StepItem.COMPLETE_PRODUCT_INFO ? await RequestUtil.post('/tower-market/taskNotice/saveAndSubApprove', values):await RequestUtil.post('/tower-market/taskNotice', values)
        }
     }
 }
 
 export default withRouter(withTranslation()(TaskEdit));