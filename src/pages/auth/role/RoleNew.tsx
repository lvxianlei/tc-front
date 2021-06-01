/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AbstractRoleSetting, { IAbstractRoleSettingState } from './AbstractRoleSetting';

export interface IRoleNewProps {}
export interface IRoleNewRouteProps extends RouteComponentProps<IRoleNewProps> {}
export interface IRoleNewState extends IAbstractRoleSettingState {}

/**
 * Creates a new role
 */
class RoleNew extends AbstractRoleSetting<IRoleNewRouteProps, IRoleNewState> {
    
    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public onSubmit(values: Record<string, any>): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export default withRouter(withTranslation()(RoleNew));