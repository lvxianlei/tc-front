/**
 * @author zyc
 * @copyright © 2021 zyc
 */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFormItemGroup } from '../../../components/AbstractFillableComponent';
import RequestUtil from '../../../utils/RequestUtil';

import AbstractDepartmentSetting, { IDeptDetail, IAbstractDepartmentSettingState } from './AbstractDepartmentSetting';

export interface IDepartmentSettingProps {
    readonly id: string;
}
export interface IDepartmentSettingRouteProps extends RouteComponentProps<IDepartmentSettingProps> {}
export interface IDepartmentSettingState extends IAbstractDepartmentSettingState {}

class DepartmentSetting extends AbstractDepartmentSetting<IDepartmentSettingRouteProps, IDepartmentSettingState> {

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const deptDeatil: IDeptDetail = await RequestUtil.get<IDeptDetail>(`/sinzetech-user/department/${ this.props.match.params.id }`);
        this.setState({
            deptDeatil: deptDeatil,
        });
    }

    /**
     * @override
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        if (this.state.deptDeatil) {
            return super.getFormItemGroups();
        }
        return [];
    }

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public async onSubmit(values: Record<string, any>): Promise<void> {
        await RequestUtil.put('/sinzetech-user/department', { ...values, id: this.state.deptDeatil?.id });
    }
}

export default withRouter(withTranslation()(DepartmentSetting));