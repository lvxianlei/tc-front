/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFormItemGroup } from '../../../components/AbstractFillableComponent';
import RequestUtil from '../../../utils/RequestUtil';

import AbstractRoleSetting, { IRoleDetail, IAbstractRoleSettingState } from './AbstractRoleSetting';

export interface IRoleSettingProps {
    readonly id: string;
}
export interface IRoleSettingRouteProps extends RouteComponentProps<IRoleSettingProps> {}
export interface IRoleSettingState extends IAbstractRoleSettingState {}

/**
 * Sets an existed role
 */
class RoleSetting extends AbstractRoleSetting<IRoleSettingRouteProps, IRoleSettingState> {

    /**
     * @description Components did mount
     */
     public async componentDidMount() {
        super.componentDidMount();
        const roleDetail: IRoleDetail = await RequestUtil.get<IRoleDetail>(`/sinzetech-system/role/${ this.props.match.params.id }`);
        this.setState({
            roleDetail: roleDetail,
            checkedFunctionKeys: roleDetail.functionIdList
        });
    }

    /**
     * @override
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        if (this.state.roleDetail) {
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
        await RequestUtil.put('/sinzetech-system/role', values);
    }

    /**
     * @override
     * @description Descriptions product change approval
     * @returns extra operation area 
     */
    protected renderExtraOperationArea(): React.ReactNode {
        return null;
    }
}

export default withRouter(withTranslation()(RoleSetting));