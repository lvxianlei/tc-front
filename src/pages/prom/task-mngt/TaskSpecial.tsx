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
 
 export interface ITaskSpecialProps {
    readonly id: string;
}
 export interface ITaskSpecialRouteProps extends RouteComponentProps<ITaskSpecialProps>, WithTranslation {}
 export interface ITaskSpecialState extends IAbstractTaskSettingState {}
 
 /**
  * Create a new client.
  */
 class TaskSpecial extends AbstractTaskSetting<ITaskSpecialRouteProps, ITaskSpecialState> {
      /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const task: ITaskInfo = await RequestUtil.get<ITaskInfo>(`/tower-market/taskNotice/edit`,{id: this.props.match.params.id });
        this.setState({
            task,
            productDataSource: task?.productInfoVOList || [],
            checkStep: StepItem.COMPLETE_SPECIAL_OPTIONS
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
        values.signContractTime = moment(values.signContractTime).format('YYYY-MM-DD');
        values.productIds = this.state.selectedKeys.length > 0 ? this.state.selectedKeys : [];
        values.contractInfoDTO = this.state.contractInfoDTO;
        values.saleOrderId = this.state?.task?.saleOrderId;
        values.id = this.state?.task?.id;
        if(this.state.checkStep === StepItem.COMPLETE_PRODUCT_INFO && values.productIds == 0){
            message.error("未选择产品信息，不可提交审批！")
            return Promise.reject(false)
        }
        else {
            return this.state.checkStep === StepItem.COMPLETE_PRODUCT_INFO ? await RequestUtil.post('/tower-market/taskNotice/saveAndSubApprove', values):await RequestUtil.post('/tower-market/taskNotice', values)
        }
     }
 }
 
 export default withRouter(withTranslation()(TaskSpecial));