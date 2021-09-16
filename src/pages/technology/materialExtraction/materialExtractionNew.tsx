/**
 * @author lxy
 * @copyright © 2021 
 */
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractMaterialExtractionSetting, { IAbstractMaterialExtractionSettingState } from './AbstractMaterialExtractionSetting';
import moment from 'moment'
import { message } from 'antd';
import { IParagraph } from './IMaterialExtraction';

export interface IMaterialExtractionNewProps {}
export interface IMaterialExtractionNewRouteProps extends RouteComponentProps<IMaterialExtractionNewProps>, WithTranslation {}
export interface IMaterialExtractionNewState extends IAbstractMaterialExtractionSettingState {}

/**
 * Create a new client.
 */
class MaterialExtractionNew extends AbstractMaterialExtractionSetting<IMaterialExtractionNewRouteProps, IMaterialExtractionNewState> {

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public async onSubmit(values: Record<string, any>): Promise<void> {
        let value = {
            ...values,
            ...this.state.materialExtraction,
            extractionMaterialSectionDTOList: this.state.paragraphDataSource,
            extractionMaterialComponentDTOList: this.state.detailDataSource
        };
        if(this.state.paragraphDataSource && this.state.paragraphDataSource.length > 0) {
            const paragraphValue = this.state.paragraphDataSource.filter((item:IParagraph)=>{
                return item.sectionCount === 0
            })
            if(paragraphValue.length === this.state.paragraphDataSource.length){
                message.error("未提任何段，不可保存！")
                return Promise.reject(false);
            }
            else{
                return await RequestUtil.post('/tower-market/extractionMaterial', value);
            }
        } else {
            message.error("该塔型没有构建明细，请重新选择！");
            return Promise.reject(false);
        } 
    }
}

export default withRouter(withTranslation()(MaterialExtractionNew));
 