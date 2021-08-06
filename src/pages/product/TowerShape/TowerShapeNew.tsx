/**
 * @author zyc
 * @copyright © 2021 
 */
import { message } from 'antd';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractTowerShapeSetting, { IAbstractTowerShapeSettingState } from './AbstractTowerShapeSetting';
import { IProductAdditionalDTOList, IProductDTOList } from './ITowerShape';

export interface ITowerShapeNewProps {}
export interface ITowerShapeNewRouteProps extends RouteComponentProps<ITowerShapeNewProps>, WithTranslation {}
export interface ITowerShapeNewState extends IAbstractTowerShapeSettingState {}

/**
 * Create a new client.
 */
class TowerShapeNew extends AbstractTowerShapeSetting<ITowerShapeNewRouteProps, ITowerShapeNewState> {

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public async onSubmit(values: Record<string, any>): Promise<void> {
        let productDTOList: IProductDTOList[] = this.getForm()?.getFieldsValue(true).productDTOList;
        productDTOList = productDTOList && productDTOList.map((items: IProductDTOList, index: number) => { 
            let productAdditionalDTOList: IProductAdditionalDTOList[] | undefined = items.productAdditionalDTOList;
            productAdditionalDTOList?.forEach((item: IProductAdditionalDTOList, index: number) => {
                if(item && item.additionalItem !== '' && item.weight) {
                    productAdditionalDTOList = productAdditionalDTOList;
                } else {
                    productAdditionalDTOList?.splice(index, 1);
                }
            })  
            return {
                ...items,
                productAdditionalDTOList: productAdditionalDTOList
            }
        })
        values.productDTOList = productDTOList;
        values.contractId = this.state.towerShape.contractId;
        if(values.productDTOList && values.productDTOList.length > 0) {
            return await RequestUtil.post('/tower-data-archive/productCategory', values);
        } else {
            message.warning('至少有一条杆塔信息！');
            return Promise.reject(false);
        }   
    }
}

export default withRouter(withTranslation()(TowerShapeNew));
