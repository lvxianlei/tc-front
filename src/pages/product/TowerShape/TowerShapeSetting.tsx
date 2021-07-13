/**
 * @author zyc
 * @copyright © 2021 
 */
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 
 import RequestUtil from '../../../utils/RequestUtil';
 import AbstractTowerShapeSetting, { IAbstractTowerShapeSettingState, ITowerShape } from './AbstractTowerShapeSetting';
 
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
        const towerShape: ITowerShape = await RequestUtil.get<ITowerShape>(`/tower-data-archive/productCategory/${ this.props.match.params.id }`);
        console.log(towerShape)
        this.setState({
            towerShape: towerShape,
            // isReference: towerShape.state
        });
        this.getForm()?.setFieldsValue({
            ...towerShape
        });
    }

     /**
      * @implements
      * @description Determines whether submit on
      * @param values 
      * @returns submit 
      */
     public async onSubmit(values: Record<string, any>): Promise<void> {
         values.productDtos = this.getForm()?.getFieldsValue(true).productDtos;
         console.log(values)
         return Promise.reject();
         // return await RequestUtil.post('/tower-market/contract', values);
     }
 }
 
 export default withRouter(withTranslation()(TowerShapeSetting));