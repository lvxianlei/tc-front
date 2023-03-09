/**
 * @author zyc
 * @copyright © 2021 
 */

import { RouteComponentProps, StaticContext } from 'react-router';
import ApplicationContext from '../configuration/ApplicationContext';
import { IDict } from '../configuration/IApplicationContext';
import AuthUtil from '../utils/AuthUtil';
import RequestUtil from '../utils/RequestUtil';
import { IFilter } from './IFilter';
import { setDictionary } from "../hooks"
export interface IAllDict {
    readonly name: string;
    readonly id: string;
    readonly dictionaries?: IDict[];
}

/**
 * Dictionary Filter
 */
export default class DictionaryFilter implements IFilter {

    /**
     * @description Descriptions dictionary filter
     * @param props 
     * @returns filter 
     */
    public async doFilter(props: RouteComponentProps<{}, StaticContext, unknown>): Promise<boolean> {
        let accessable: boolean = true;
        if (props.location.pathname !== '/login') {
            accessable = !!(AuthUtil.getAuthorization() && AuthUtil.getSinzetechAuth() && AuthUtil.getTenantId());
            if (accessable) {
                const dicts: IAllDict[] = await RequestUtil.get(`/tower-system/dictionary/allDictionary`);
                const dictionaryOption: Record<string, IDict[] | undefined> = {};
                dicts.forEach((dict: IAllDict): void => {
                    dictionaryOption[dict.id] = dict.dictionaries;
                });
                ApplicationContext.get({ dictionaryOption: dictionaryOption });
               AuthUtil.setDictionary(dictionaryOption as any)
            }
        }
        return true;
    }
}