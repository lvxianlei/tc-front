/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
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

export interface IClientConfig {
    readonly clientId?: string;
    readonly clientSecret?: string;
}

export default interface IApplicationContext extends IClientConfig {
    readonly home?: string;
    readonly layout?: ILayout;
    readonly filters?: IFilter[];
    readonly routers?: IRouterItem[];
    readonly globalRouters?: IRouterItem[];
    readonly dictionaryOption?: Record<string, IDict | undefined>;
}

export interface IDict {
    readonly name?: string;
    readonly code?: string;
}

export interface IBase {
    readonly id?: number | string;
    readonly lineName?: string;
    readonly num?: number;
    readonly price?: number;
    readonly productStatus?: number;
    readonly description?: string;	
    readonly productHeight?: number;
    readonly productNumber?: string;
    readonly productShape?: string;	
    readonly productType?: number;
    readonly saleOrderId?: number | string;
    readonly taskNoticeId?: number | string;
    readonly tender?: string;
    readonly totalAmount?: number;
    readonly winBidType?: number;
    readonly saleType?: number;
    readonly unit?: string;
    readonly voltageGrade?: number;
    readonly recordType?: number;
    readonly chargeType?: string | number;
    readonly contractNumber?: string;
    readonly createTime?: string;
    readonly createUser?: number;
    readonly currencyType?: number;
    readonly customerCompany?: string;
    readonly deliveryTime?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly simpleProjectName?: string;
    readonly signContractTime?: string;
    readonly signCustomerName?: string;
    readonly signCustomerId?: string | number;
    readonly galvanizeDemand?:string;	
    readonly materialDemand?: string;
    readonly materialStandard?:	number | string;
    readonly packDemand?: string;	
    readonly peculiarDescription?: string;
    readonly planDeliveryTime?:	string;
    readonly weldingDemand?: string;
    readonly saleOrderNumber?: string;	
}