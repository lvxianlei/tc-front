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
 
 export interface IMaterialNewProps {}
 export interface IMaterialNewRouteProps extends RouteComponentProps<IMaterialNewProps>, WithTranslation {}
 export interface IMaterialNewState extends IAbstractMaterialSettingState {}

 /**
  * Create a new client.
  */
 class MaterialNew extends AbstractMaterialSetting<IMaterialNewRouteProps, IMaterialNewState> {
     async componentDidMount(){
        const resData: IMaterialTree[] = await RequestUtil.get<IMaterialTree[]>('/tower-system/materialCategory/tree');
        this.setState({
            treeData: resData,
            // expandKeys: this.expandKeysByValue(resData),
            materialData:[]
        });
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
 
 export default withRouter(withTranslation()(MaterialNew));