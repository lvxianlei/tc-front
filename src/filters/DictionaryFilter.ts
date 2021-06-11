/**
 * @author zyc
 * @copyright © 2021 
 */

import { RouteComponentProps, StaticContext } from 'react-router';
import ApplicationContext from '../configuration/ApplicationContext';
import { IDict } from '../configuration/IApplicationContext';
import RequestUtil from '../utils/RequestUtil';
import { IFilter } from './IFilter';

export interface IAllDict {
    readonly name: string;
    readonly code: string;
    readonly dictionaryTypes?: IDict;
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
        const dicts: IAllDict[] = await RequestUtil.get(`/tower-system/dictionary/allDictionary`);
        const dictionaryOption: Record<string, IDict | undefined> = {};
        dicts.forEach((dict: IAllDict): void => {
            dictionaryOption[dict.code] = dict.dictionaryTypes;
        });
        ApplicationContext.get({ dictionaryOption: dictionaryOption });
        console.log(ApplicationContext.get().dictionaryOption);
        return true;
    }
}