/**
 * @author zyc
 * @copyright © 2021 
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import AbstractEntrustSetting, { IAbstractEntrustSettingState } from './AbstractEntrustSetting';
import RequestUtil from '../../utils/RequestUtil';
import { Button, message } from 'antd';
import moment from 'moment';

export interface IEntrustNewProps {}
export interface IEntrustNewRouteProps extends RouteComponentProps<IEntrustNewProps>, WithTranslation {
    readonly getTable:() => void;
}
export interface IEntrustNewState extends IAbstractEntrustSettingState {}

/**
 * Create a new entrust.
 */
class EntrustNew extends AbstractEntrustSetting<IEntrustNewRouteProps, IEntrustNewState> {

    public popModalButton(): React.ReactNode {
        return <Button type="primary" htmlType="button" onClick={ this.showModal }>新增</Button>
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
        if(values.attachInfoDtoList) {
            return await RequestUtil.post('/tower-outsource/entrust', values).then(() => {
                this.setState({
                    isVisible: false,
                })
                this.props.getTable();
            })
        } else {
            message.error("请上传资料包！")
            return Promise.reject(false)
        }
    }

    /**
     * @description Renders extra operation area
     * @returns 不显示删除按钮
     */
     public renderExtraDeleteButton(): React.ReactNode {
        return null
    }

}

export default withRouter(withTranslation()(EntrustNew));
