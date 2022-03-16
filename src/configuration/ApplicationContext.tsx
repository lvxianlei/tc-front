/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import camelcaseKeys from 'camelcase-keys';
import { matchPath, RouteComponentProps } from 'react-router';

import routerConfigJson from '../app-router.config.jsonc';
import { IFilter } from '../filters/IFilter';
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
     * @description Menu item stack of application context
     */
    private static menuItemStack: any[] = [];

    /**
     * @description Statics application context
     * @param [config] 
     * @returns get 
     */
    public static get(config: IApplicationContext = {}): IApplicationContext {
        if (!this.ctxConfig) {
            this.ctxConfig = {
                ...ctxConfigJson,
                ...camelcaseKeys(routerConfigJson, { deep: true })
            };
        }
        if (config) {
            this.ctxConfig = {
                ...this.ctxConfig,
                ...config
            };
        }
        return this.ctxConfig;
    }

    /**
     * @static
     * @description Protected application context
     * @param menuItems 
     * @param pathname 
     * @returns menu item by path 
     */
    public static getMenuItemByPath(menuItems: any[], pathname: string): any | undefined {
        this.traverseRootMenuItemByPath(menuItems, pathname);
        return this.menuItemStack.pop(); 
    }

    /**
     * @private
     * @static
     * @description Privates application context
     * @param menuItems 
     * @param path 
     * @returns  
     */
    private static traverseRootMenuItemByPath(menuItems: any[], path: string) {
        for (let item of menuItems) {
            this.menuItemStack.push(item);
            if (new RegExp(item.path).test(path)) { // Hint the item
                return;
            } else if (item.items && item.items.length > 0) { // If the item has children, it will recurse
                this.traverseRootMenuItemByPath(item.items, path);
            }
            this.menuItemStack.pop();
        }
    }

    /**
     * @static
     * @description Gets router item by path
     * @param pathname 
     * @returns router item by path 
     */
    public static getRouterItemByPath(pathname: string): IRouterItem | null {
        const routers: IRouterItem[] = this.get().routers || [];
        const hintedRouters: IRouterItem[] = routers.filter<IRouterItem>((value: IRouterItem): value is IRouterItem => {
            return !!matchPath(pathname, value); // whether hint the item or not
            // return value.path === pathname; // whether hint the item or not
        });
        if (hintedRouters && hintedRouters.length > 0) { // hinted item is existed
            return hintedRouters[ hintedRouters.length - 1 ];
        }
        return null;
    }

    /**
     * @static
     * @description Do filters all
     * @param props 
     * @returns filters all 
     */
    public static async doFiltersAll(props: RouteComponentProps<{}>): Promise<boolean> {
        const filters: IFilter[] = this.get().filters || [];
        const doFilterHandlers: Promise<boolean>[] = filters.map<Promise<boolean>>((filter: IFilter): Promise<boolean> => { return filter.doFilter(props); });
        const permits: boolean[] = await Promise.all(doFilterHandlers);
        for (let permit of permits) {
            if (!permit) { // denied
                return false;
            }
        }
        return true;
    }
}