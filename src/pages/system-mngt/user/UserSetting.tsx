/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import { IFormItemGroup } from '../../../components/AbstractFillableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import AbstractUserSetting, { IAbstractUserSettingState } from './AbstractUserSetting';
import { IUser } from './IUser';

export interface IUserSettingProps {
    readonly id: string;
}
export interface IUserSettingRouteProps extends RouteComponentProps<IUserSettingProps> {}
export interface IUserSettingState extends IAbstractUserSettingState {}

/**
 * Sets an existed user
 */
class UserSetting extends AbstractUserSetting<IUserSettingRouteProps, IUserSettingState> {

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const user: IUser = await RequestUtil.get<IUser>(`/sinzetech-user/user/${ this.props.match.params.id }`);
        this.setState({
            user: user
        });
    }

    /**
     * @override
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        if (this.state.user) {
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
        await RequestUtil.put('/sinzetech-user/user', values);
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

export default withRouter(withTranslation()(UserSetting));