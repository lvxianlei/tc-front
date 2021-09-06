import { ColProps } from 'antd'
import React from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import { RouteComponentProps, withRouter } from 'react-router'
import AbstractDetailComponent, { } from '../../components/AbstractDetailComponent'
import { ITabItem } from '../../components/ITabableComponent'
export interface DetailProps extends RouteComponentProps, WithTranslation {
    operation?: React.ReactNode
    tabItems?: ITabItem[]
    colProps?: ColProps[]
}

export interface DetailState {
    detail: {
        paymentPlanVos: any[]
    }
}

class Detail extends AbstractDetailComponent<DetailProps, DetailState> {

    public getSubinfoColProps(): ColProps[] {
        return this.props.colProps || [];
    }

    public renderOperationArea(): React.ReactNode | React.ReactNode[] {
        return this.props.operation || []
    }

    public getTabItems(): ITabItem[] {
        return this.props.tabItems || []
    }
}

export default withRouter(withTranslation()(Detail));