/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */

import IApplicationContext, { ComponentClazz, ComponentClazzProps } from "./IApplicationContext";
import camelcaseKeys from 'camelcase-keys';
import routerConfigJson from '../app-router.config.jsonc';

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

    private static getClassConfig(key: string): ComponentClazz | undefined {
        let obj: any | undefined = this.get();
        key.split('.').forEach((item: string) => {
            obj = obj[item];
            if (!obj) {
                return;
            }
        });
        return obj;
    }

    /**
     * @description Gets class props
     * @param key 
     * @returns class props 
     */
    public static getClassProps(key: string): ComponentClazzProps {
        let clazz: ComponentClazz | undefined = this.getClassConfig(key);
        let props: ComponentClazzProps = {};
        if (typeof clazz === 'object') {
            props = clazz.props || {};
        }
        return props;
    }
}