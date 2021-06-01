/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AbstractRoleSetting, { IAbstractRoleSettingState } from './AbstractRoleSetting';

export interface IRoleSettingProps {
    readonly id: string;
}
export interface IRoleSettingRouteProps extends RouteComponentProps<IRoleSettingProps> {}
export interface IRoleSettingState extends IAbstractRoleSettingState {}

/**
 * Sets an existed role
 */
class RoleSetting extends AbstractRoleSetting<IRoleSettingRouteProps, IRoleSettingState> {
    
    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public onSubmit(values: Record<string, any>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    /**
     * @override
     * @description Renders save and continue
     * @returns save and continue 
     */
    protected renderSaveAndContinue(): React.ReactNode {
        return null;
    }
}

export default withRouter(withTranslation()(RoleSetting));