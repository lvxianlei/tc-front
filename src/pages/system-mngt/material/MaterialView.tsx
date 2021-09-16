/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
 import { message } from 'antd';
import React from 'react';
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 
 import RequestUtil from '../../../utils/RequestUtil';
 import AbstractMaterialSetting, { IAbstractMaterialSettingState } from './AbstractMaterialSetting';
import { IMaterial, IMaterialTree } from './IMaterial';
 
 export interface IMaterialViewProps {
     readonly id: string;
}
 export interface IMaterialViewRouteProps extends RouteComponentProps<IMaterialViewProps>, WithTranslation {}
 export interface IMaterialViewState extends IAbstractMaterialSettingState {}

 /**
  * Create a new client.
  */
 class MaterialView extends AbstractMaterialSetting<IMaterialViewRouteProps, IMaterialViewState> {

    /**
     * @description Components did mount
     */
     public async componentDidMount() {
        super.componentDidMount();
        const material: IMaterial[] = await RequestUtil.get<IMaterial[]>(`/tower-system/material/detail/${ this.props.match.params.id }`);
        const resData: IMaterialTree[] = await RequestUtil.get<IMaterialTree[]>('/tower-system/materialCategory/tree');
        const materialValue = material.map((item:IMaterial)=>{
            return {
                ...item,
                proportion: item.proportion === -1 ? undefined : item.proportion
            }
        })
        this.setState({
            materialData: [ ...materialValue ],
            treeData: resData,
        });
        this.getForm()?.setFieldsValue({
            materialData: materialValue
        });
    }
    protected getButton(){
        return null
    }

 
     /**
      * @implements
      * @description Determines whether submit on
      * @param values 
      * @returns submit 
      */
     public async onSubmit(values: Record<string, any>): Promise<void> {
        values = this.getForm()?.getFieldsValue(true).materialData;
        if(values){
            return await RequestUtil.post('/tower-system/material', values);
        }
        else{
            message.error('当前没有新增数据，不可保存！');
            return Promise.reject(false)
        }
     }
 }
 
 export default withRouter(withTranslation()(MaterialView));