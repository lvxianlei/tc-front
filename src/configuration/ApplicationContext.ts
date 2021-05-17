/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import camelcaseKeys from 'camelcase-keys';
import { matchPath } from 'react-router';

import routerConfigJson from '../app-router.config.jsonc';
import IApplicationContext, { IRouterItem } from './IApplicationContext';


const ctxConfigJson: IApplicationContext = {};

/**
 * The abstract application context
 */
export default abstract class ApplicationContext {

    /**
     * @description Ctx config of application context
     */
    private static ctxConfig: IApplicationContext;

    /**
     * @static
     * @description Gets application context
     * @returns get 
     */
    public static get(): IApplicationContext {
        if (!this.ctxConfig) {
            this.ctxConfig = {
                ...ctxConfigJson,
                ...camelcaseKeys(routerConfigJson, { deep: true })
            };
        }
        return this.ctxConfig;
    }

    /**
     * @static
     * @description Gets router item by path
     * @param pathname 
     * @returns router item by path 
     */
    public static getRouterItemByPath(pathname: string): IRouterItem | null {
        const routers: IRouterItem[] = this.get().routers || [];
        const hitedRouters: IRouterItem[] = routers.filter<IRouterItem>((value: IRouterItem): value is IRouterItem => {
            return !!matchPath(pathname, value); // whether hint the item or not
            // return value.path === pathname; // whether hint the item or not
        });
        if (hitedRouters && hitedRouters.length > 0) { // hited item is existed
            return hitedRouters[ hitedRouters.length - 1 ];
        }
        return null;
    }
}