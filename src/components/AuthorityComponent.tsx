/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { Authorized, check } from 'react-authorize';

import ApplicationContext from '../configuration/ApplicationContext';

export type AuthorityBasic = string | number | symbol;
export type Authority = AuthorityBasic | AuthorityBasic[];
export type HasPermissionFC = (authority: Authority) => boolean | Promise<any>;
export type Permissions = Authority | Promise<any> | HasPermissionFC;

export interface IAuthorityComponentProps {
    children?: React.ReactNode | React.ReactElement<any> | null;
    permissions: Permissions;
}
export interface IAuthorityComponentState {}

/**
 * The wrapper of authority component
 * {@link https://github.com/StructureBuilder/react-authorize}
 */
export default class AuthorityComponent extends React.Component<IAuthorityComponentProps, IAuthorityComponentState> {

    /**
     * @description Renders AuthorityComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Authorized permissions={ this.props.permissions || '' }
                authority={ ApplicationContext.get().authorites || [] }
                unauthorized={ null } loading={ null }>
                { this.props.children as React.ReactElement }
            </Authorized>
        );
    }
}

export function hasAuthority(permissions?: Authority): boolean {
    if (!permissions) {
        return false;
    }
    if (!Array.isArray(permissions)) {
        permissions = [permissions];
    }
    const authority: AuthorityBasic[] = ApplicationContext.get().authorites || [];
    for (const value of authority) {
        if (permissions.indexOf(value) !== -1) {
          return true;
        }
    }
    return false;
}