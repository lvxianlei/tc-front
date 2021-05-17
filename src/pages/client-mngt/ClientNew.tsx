/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../utils/RequestUtil';
import AbstractClientSetting, { IAbstractClientSettingState } from './AbstractClientSetting';

export interface IClientNewProps {}
export interface IClientNewRouteProps extends RouteComponentProps<IClientNewProps>, WithTranslation {}
export interface IClientNewState extends IAbstractClientSettingState {}

/**
 * Create a new client.
 */
class ClientNew extends AbstractClientSetting<IClientNewRouteProps, IClientNewState> {

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public async onSubmit(values: Record<string, any>): Promise<void> {
        return await RequestUtil.post('/tower-customer/customer', values);
    }
}

export default withRouter(withTranslation()(ClientNew));