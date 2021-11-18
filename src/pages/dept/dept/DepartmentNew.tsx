/**
 * @author zyc
 * @copyright © 2021 zyc
 */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFormItemGroup } from '../../../components/AbstractFillableComponent';
import RequestUtil from '../../../utils/RequestUtil';

import AbstractDepartmentSetting, { IAbstractDepartmentSettingState } from './AbstractDepartmentSetting';

export interface IDepartmentSettingProps {
    readonly id: string;
}
export interface IDepartmentSettingRouteProps extends RouteComponentProps<IDepartmentSettingProps> {}
export interface IDepartmentSettingState extends IAbstractDepartmentSettingState {}

class DepartmentNew extends AbstractDepartmentSetting<IDepartmentSettingRouteProps, IDepartmentSettingState> {

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        this.setState({
            deptDeatil: {
                parentId: this.props.match.params.id === '0' ? '' : this.props.match.params.id 
            },
            tip: this.props.match.params.id === '0' ? false : true
        });
        super.componentDidMount();
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
        await RequestUtil.post('/tower-system/department', { ...values });
    }
}

export default withRouter(withTranslation()(DepartmentNew));