/**
 * @author zyc
 * @copyright © 2021 
 */
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 
 import RequestUtil from '../../../utils/RequestUtil';
 import AbstractTowerShapeSetting, { IAbstractTowerShapeSettingState } from './AbstractTowerShapeSetting';
import { ITowerShape } from './ITowerShape';
 
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
        console.log(towerShape)
        this.setState({
            towerShape: towerShape,
            isChange: true,
            isReference: true
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
 
 export default withRouter(withTranslation()(TowerShapeChange));