/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';

import { AuthorityBasic } from '../components/AuthorityComponent';
import { IFilter } from '../filters/IFilter';

export type ComponentClazzProps = Record<string, any>;

export type ComponentClazz = {
    readonly componentClass: React.ComponentClass;
    readonly props?: ComponentClazzProps;
};

export interface ILayout extends Record<string, ComponentClazz | undefined> {
    readonly frame?: ComponentClazz;
    readonly navigationPanel?: ComponentClazz;
    readonly contentPanel?: ComponentClazz;
    readonly headerPanel?: ComponentClazz;
    readonly footerPanel?: ComponentClazz;
}

export interface IRouterItem {
    readonly name: string;
    readonly path: string;
    readonly authority: AuthorityBasic;
    readonly module?: string;
    readonly exact?: boolean;
    readonly children?: IRouterItem[];
}

export interface IClientConfig {
    readonly clientId?: string;
    readonly clientSecret?: string;
}

export default interface IApplicationContext extends IClientConfig {
    readonly logo?: string;
    readonly home?: string;
    readonly layout?: ILayout;
    readonly filters?: IFilter[];
    readonly routers?: IRouterItem[];
    readonly globalRouters?: IRouterItem[];
    readonly dictionaryOption?: Record<string, IDict[] | undefined>;
    readonly authorites?: AuthorityBasic[];
}

export interface IDict {
    readonly name: string;
    readonly id: string;
}
