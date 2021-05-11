import React from 'react';

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
    readonly module?: string;
    readonly exact?: boolean;
    readonly children?: IRouterItem[];
}

export default interface IApplicationContext {
    readonly layout?: ILayout;
    readonly filters?: IFilter[];
    readonly routers?: IRouterItem[];
}