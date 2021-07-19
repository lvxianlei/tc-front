/**
 * @author zyc
 * @copyright © 2021 
*/
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractTowerShapeSetting, { IAbstractTowerShapeSettingState } from './AbstractTowerShapeSetting';
import { IProductAdditionalDTOList, IProductDTOList, ITowerShape } from './ITowerShape';

export interface ITowerShapeSettingProps {
    readonly id: string;
}
export interface ITowerShapeSettingRouteProps extends RouteComponentProps<ITowerShapeSettingProps>, WithTranslation {}
export interface ITowerShapeSettingState extends IAbstractTowerShapeSettingState {}

/**
 * Create a client setting.
 */
class TowerShapeSetting extends AbstractTowerShapeSetting<ITowerShapeSettingRouteProps, ITowerShapeSettingState> {

/**
 * @description Components did mount
 */
    public async componentDidMount() {
        super.componentDidMount();
        let towerShape: ITowerShape = await RequestUtil.get<ITowerShape>(`/tower-data-archive/productCategory/${ this.props.match.params.id }`);   
        const isReference: boolean | undefined = towerShape.productVOList?.some((item: IProductDTOList): boolean => {
            if(item.status === 0) {
                return false
            } else {
                return true
            }
        })
        let productVOList: IProductDTOList[] | undefined = towerShape.productVOList?.map((items: IProductDTOList) => {
            return {
                ...items,
                productAdditionalDTOList: items.productAdditionalVOList,
                towerLeg1Length: items.towerLeg1Length === -1 ? undefined : items.towerLeg1Length,
                towerLeg1Weight: items.towerLeg1Weight === -1 ? undefined : items.towerLeg1Weight,
                towerLeg2Length: items.towerLeg2Length === -1 ? undefined : items.towerLeg2Length,
                towerLeg2Weight: items.towerLeg2Weight === -1 ? undefined : items.towerLeg2Weight,
                towerLeg3Length: items.towerLeg3Length === -1 ? undefined : items.towerLeg3Length,
                towerLeg3Weight: items.towerLeg3Weight === -1 ? undefined : items.towerLeg3Weight,
                towerLeg4Length: items.towerLeg4Length === -1 ? undefined : items.towerLeg4Length,
                towerLeg4Weight: items.towerLeg4Weight === -1 ? undefined : items.towerLeg4Weight,
                towerFootWeight: items.towerFootWeight === -1 ? undefined : items.towerFootWeight,
            }
        })
        this.setState({
            towerShape: {
                ...towerShape,
                productDTOList: [...productVOList || []]
            },
            isReference: isReference
        });
        this.getForm()?.setFieldsValue({
            ...towerShape,
            productDTOList: [...productVOList || []]
        });
    }

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public async onSubmit(values: Record<string, any>): Promise<void> {
        const productDTOList: IProductDTOList[] = this.getForm()?.getFieldsValue(true).productDTOList;
        const towerShape: ITowerShape = this.state.towerShape;
        values.productDTOList = productDTOList;
        values.contractId = this.state.towerShape.contractId;
        productDTOList.map((items: IProductDTOList) => {
            items.productAdditionalDTOList?.map((item: IProductAdditionalDTOList) => {
                return {
                    ...item,
                    productId: items.id
                }
            })
            return {
                ...items,
                productShapeId: towerShape.id
            }
        })
        values.id = this.getForm()?.getFieldsValue(true).id;
        values.productIdList = this.state.productIdList;
        values.productAdditionalIdList = this.state.productAdditionalIdList;
        return await RequestUtil.post('/tower-data-archive/productCategory', values);
    }
}

export default withRouter(withTranslation()(TowerShapeSetting));