/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { RouteComponentProps } from 'react-router';

import AbstractFillableComponent, {
    IAbstractFillableComponentState,
    IFormItemGroup,
} from '../../../components/AbstractFillableComponent';

export interface IAbstractRoleSettingState extends IAbstractFillableComponentState {}

/**
 * The abstract role setting
 */
export default abstract class AbstractRoleSetting<P extends RouteComponentProps, S extends IAbstractRoleSettingState> extends AbstractFillableComponent<P, S> {
    
    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
     protected getReturnPath(): string {
        return '/auth/roles';
    }
    
    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        return [];
    }
}