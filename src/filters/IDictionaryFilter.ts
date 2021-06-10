/**
 * @author zyc
 * @copyright © 2021 
 */
import { RouteComponentProps } from 'react-router';
import { IEnums } from '../configuration/IApplicationContext';

/**
 * @description 获取字典
 */
export interface IDictionaryFilter {

    getDictionary(props: RouteComponentProps<{}>): Promise<IEnums>;
}