/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFormItemGroup } from '../../components/AbstractFillableComponent';
import { IClient } from './IClient';

import RequestUtil from '../../utils/RequestUtil';
import AbstractClientSetting, { IAbstractClientSettingState } from './AbstractClientSetting';

export interface IClientSettingProps {
    readonly id: string;
}
export interface IClientSettingRouteProps extends RouteComponentProps<IClientSettingProps>, WithTranslation {}
export interface IClientSettingState extends IAbstractClientSettingState {}

/**
 * Client Setting
 */
class ClientSetting extends AbstractClientSetting<IClientSettingRouteProps, IClientSettingState> {

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const client: IClient = await RequestUtil.get<IClient>(`/tower-customer/customer/${ this.props.match.params.id }`);
        this.setState({
            client: client
        });
    }

    /**
     * @override
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        if (this.state.client) {
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
        return await RequestUtil.put('/tower-customer/customer', {
            ...values,
            id: this.props.match.params.id
        });
    }


    /**
     * @override
     * @description Descriptions product change approval
     * @returns extra operation area 
     */
    protected renderExtraOperationArea(): React.ReactNode {
        return null;
    }
}

export default withRouter(withTranslation()(ClientSetting));