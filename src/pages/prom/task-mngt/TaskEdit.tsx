/**
 * @author lxy
 * @copyright © 2021 
 */
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 
 import RequestUtil from '../../../utils/RequestUtil';
 import AbstractTaskSetting, { IAbstractTaskSettingState, ITask } from './AbstactTaskSetting';
 import moment from 'moment'
import { IFormItemGroup } from '../../../components/AbstractFillableComponent';
 
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
        const task: ITask = await RequestUtil.get<ITask>(`/tower-market/taskNotice/${ this.props.match.params.id }`);
        this.setState({
            task,
            taskTable: task?.productInfoVOList,
        });
        // this.getForm()?.setFieldsValue({
        //     paymentPlanDtos: task.paymentPlanDtos
        // });
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
        values.signTaskTime = moment(values.signTaskTime).format('YYYY-MM-DD');
        values.deliveryTime = moment(values.deliveryTime).format('YYYY-MM-DD');
        values.reviewTime = moment(values.reviewTime).format('YYYY-MM-DD HH:mm');
        // values.paymentPlanDtos = values.paymentPlanDtos?.map((plan: IPaymentPlanDto, index: number): IPaymentPlanDto => {
        //     return {
        //         ...plan,
        //         returnedTime: moment(plan.returnedTime).format('YYYY-MM-DD'),
        //         index: index + 1
        //     };
        // });
         console.log(values )
         return Promise.resolve();
        //  return await RequestUtil.post('/tower-market/task', values);
     }
 }
 
 export default withRouter(withTranslation()(TaskEdit));