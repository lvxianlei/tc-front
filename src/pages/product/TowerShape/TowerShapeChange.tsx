/**
 * @author zyc
 * @copyright © 2021 
 */
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 
 import RequestUtil from '../../../utils/RequestUtil';
 import AbstractTowerShapeSetting, { IAbstractTowerShapeSettingState } from './AbstractTowerShapeSetting';
import { IProductAdditionalDTOList, IProductDTOList, ITowerShape } from './ITowerShape';
 
 export interface ITowerShapeChangeProps {
    readonly id: string;
 }
 export interface ITowerShapeChangeRouteProps extends RouteComponentProps<ITowerShapeChangeProps>, WithTranslation {}
 export interface ITowerShapeChangeState extends IAbstractTowerShapeSettingState {}
 
 /**
  * Create a towerShape change.
  */
 class TowerShapeChange extends AbstractTowerShapeSetting<ITowerShapeChangeRouteProps, ITowerShapeChangeState> {
 
    /**
     * @description Components did mount
     */
     public async componentDidMount() {
        super.componentDidMount();
        const towerShape: ITowerShape = await RequestUtil.get<ITowerShape>(`/tower-data-archive/productCategory/${ this.props.match.params.id }`);
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
            isChange: true,
            isReference: true
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
        values.productShapeNumber = this.state.towerShape.productShapeNumber;
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
        values.productDeleteList = this.state.productDeleteList;
        values.productAdditionalDeleteList = this.state.productAdditionalDeleteList;
        return await RequestUtil.post('/tower-data-archive/productCategory/submitProductChange', values);
     }
 }
 
 export default withRouter(withTranslation()(TowerShapeChange));