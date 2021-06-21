/**
 * @author zyc
 * @copyright © 2021 
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import AbstractEntrustSetting, { IAbstractEntrustSettingState, IEntrust } from './AbstractEntrustSetting';
import RequestUtil from '../../utils/RequestUtil';
import { Button, message } from 'antd';
import moment from 'moment';

export interface IEntrustSettingProps {
    readonly id?: string;
}
export interface IEntrustSettingRouteProps extends RouteComponentProps<IEntrustSettingProps>, WithTranslation {
    readonly data: IEntrustSettingProps;
}
export interface IEntrustSettingState extends IAbstractEntrustSettingState {}

/**
 * entrust setting.
 */
class EntrustSetting extends AbstractEntrustSetting<IEntrustSettingRouteProps, IEntrustSettingState> {

    /**
     * @constructor
     * @description show modal
     * @param props 
     */
    public showModal = async() : Promise<void> => {
        this.setState({
            isVisible: true
        })
        const entrust: IEntrust = await RequestUtil.get<IEntrust>(`/tower-outsource/entrust/${ this.props.data.id }`);
        this.setState({
            entrust: entrust,
            attachList: entrust.attachVoList
        });
        this.getForm()?.setFieldsValue({
            ...entrust,
            projectTime: [moment(entrust?.projectStartTime), moment(entrust?.projectEndTime)]
        })
    } 

    public popModalButton(): React.ReactNode {
        return <Button type="primary" onClick={ this.showModal } id={ this.props.data.id }>编辑</Button>
    }

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns save 
     */
    public async onFinishSubmit(values: Record<string, any>): Promise<void> {
        if(values.projectTime) {
            values.projectStartTime = moment(values.projectTime[0]).format('YYYY-MM-DD');
            values.projectEndTime = moment(values.projectTime[1]).format('YYYY-MM-DD');
        }
        values.attachInfoDtoList = this.state.attachList;
        values.entrustSubmitType = this.state.entrustSubmitType;
        values.id = this.props.data.id;
        if(values.attachInfoDtoList) {
            return await RequestUtil.put('/tower-outsource/entrust', values).then(() => {
                this.setState({
                    isVisible: false
                })
            });
        } else {
            message.error("请上传资料包！")
            return Promise.reject(false)
        }
    }
}

export default withRouter(withTranslation()(EntrustSetting));
