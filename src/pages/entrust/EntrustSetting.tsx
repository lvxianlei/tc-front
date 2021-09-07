/**
 * @author zyc
 * @copyright © 2021 
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import AbstractEntrustSetting, { IAbstractEntrustSettingState, IEntrust } from './AbstractEntrustSetting';
import RequestUtil from '../../utils/RequestUtil';
import { message } from 'antd';
import moment from 'moment';
import { IFormItemGroup } from './EntrustDetail';

export interface IEntrustSettingProps {
    readonly id?: string;
}
export interface IEntrustSettingRouteProps extends RouteComponentProps<IEntrustSettingProps>, WithTranslation {

}
export interface IEntrustSettingState extends IAbstractEntrustSettingState {}

/**
 * entrust setting.
 */
class EntrustSetting extends AbstractEntrustSetting<IEntrustSettingRouteProps, IEntrustSettingState> {

    /**
     * @description Components did mount
     */
     public async componentDidMount() {
        super.componentDidMount();
        const entrust: IEntrust = await RequestUtil.get<IEntrust>(`/tp-task-dispatch/entrust/${ this.props.match.params.id }`);
        this.setState({
            entrust: entrust,
            attachList: entrust.attachVoList
        });
        this.getForm()?.setFieldsValue({
            ...entrust,
            projectTime: [moment(entrust?.projectStartTime), moment(entrust?.projectEndTime)]
        })
        
    }
 
    /**
     * @override
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        if (this.state.entrust) {
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
        if(values.projectTime) {
            values.projectStartTime = moment(values.projectTime[0]).format('YYYY-MM-DD');
            values.projectEndTime = moment(values.projectTime[1]).format('YYYY-MM-DD');
        }
        values.attachInfoDtoList = this.state.attachList;
        values.id = this.props.match.params.id;
        if(values.attachInfoDtoList) {
            return await RequestUtil.put('/tp-task-dispatch/entrust', values);
        } else {
            message.error("请上传资料包！")
            return Promise.reject(false)
        }
    }

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns save 
     */
    public onFinishSubmit(): void {
        this.getForm()?.validateFields().then( (): Promise<void> => {
            const values: Record<string, any> = this.getForm()?.getFieldsValue(true);
            if(values.projectTime) {
                values.projectStartTime = moment(values.projectTime[0]).format('YYYY-MM-DD');
                values.projectEndTime = moment(values.projectTime[1]).format('YYYY-MM-DD');
            }
            values.attachInfoDtoList = this.state.attachList;
            values.id = this.props.match.params.id;
            if(values.attachInfoDtoList) {
                return RequestUtil.post('/tp-task-dispatch/entrust/entrustSubmit', values).then((res) => {
                    if(res) {
                        this.props.history.push('/outsource/entrust')
                    }
                });;
            } else {
                message.error("请上传资料包！")
                return Promise.reject(false)
            }
        })
    }
}

export default withRouter(withTranslation()(EntrustSetting));
