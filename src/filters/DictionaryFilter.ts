/**
 * @author zyc
 * @copyright © 2021 
 */

import { RouteComponentProps, StaticContext } from 'react-router';
import ApplicationContext from '../configuration/ApplicationContext';
import { IDict, IEnums } from '../configuration/IApplicationContext';
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
        let enums: IEnums =  {};
        dicts.map<IEnums>((item: IAllDict): IEnums => {
            const value: string = item.code;
            enums={...enums,[value]:  item.dictionaryTypes}
            return enums
        })
        ApplicationContext.get({ dictionaryOption: enums });
        return true;
    }
}