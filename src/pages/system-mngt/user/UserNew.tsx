/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractUserSetting, { IAbstractUserSettingState } from './AbstractUserSetting';

export interface IUserNewProps {}
export interface IUserNewRouteProps extends RouteComponentProps<IUserNewProps> {}
export interface IUserNewState extends IAbstractUserSettingState {}

/**
 * Creates a new user
 */
class UserNew extends AbstractUserSetting<IUserNewRouteProps, IUserNewState> {
    
    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public async onSubmit(values: Record<string, any>): Promise<void> {
        values.roleIds = values?.roleIds?.join(',');
        return RequestUtil.post('/sinzetech-user/user', values);
    }
}

export default withRouter(withTranslation()(UserNew));