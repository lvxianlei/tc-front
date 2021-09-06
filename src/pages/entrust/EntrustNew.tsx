/**
 * @author zyc
 * @copyright © 2021 
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import AbstractEntrustSetting, { IAbstractEntrustSettingState } from './AbstractEntrustSetting';
import RequestUtil from '../../utils/RequestUtil';
import { message } from 'antd';
import moment from 'moment';

export interface IEntrustNewProps {}
export interface IEntrustNewRouteProps extends RouteComponentProps<IEntrustNewProps>, WithTranslation {
    
}
export interface IEntrustNewState extends IAbstractEntrustSettingState {}

/**
 * Create a new entrust.
 */
class EntrustNew extends AbstractEntrustSetting<IEntrustNewRouteProps, IEntrustNewState> {

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
        if(values.attachInfoDtoList) {
            return await RequestUtil.post('/tp-task-dispatch/entrust', values)
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
            if(values.attachInfoDtoList) {
                return RequestUtil.post('/tp-task-dispatch/entrust/entrustSubmit', values);
            } else {
                message.error("请上传资料包！")
                return Promise.reject(false)
            }  
        })
        
    }
}

export default withRouter(withTranslation()(EntrustNew));
