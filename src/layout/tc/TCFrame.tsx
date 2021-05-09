/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import DefaultFrame, { IDefaultFrameProps } from '../DefaultFrame';
import layoutStyles from '../Layout.module.less';

export interface ITCFrameProps {}
export interface ITCFrameRouteProps extends RouteComponentProps<ITCFrameProps>, IDefaultFrameProps {}
export interface ITCFrameState {}

/**
 * @TODO Describe the class
 */
class TCFrame extends DefaultFrame<ITCFrameRouteProps, ITCFrameState> {

    public renderContentPanel(): React.ReactNode {
        return (
            <Space direction="vertical" size="small" className={ layoutStyles.width100 }>
                { this.renderBreadcrumb() }
                { super.renderContentPanel() }
            </Space>
        );
    }

    protected renderBreadcrumb(): React.ReactNode {
        return  (
            <Card>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="">Application Center</Breadcrumb.Item>
                    <Breadcrumb.Item href="">Application List</Breadcrumb.Item>
                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
            </Card>
        );
    }
}

export default withRouter(TCFrame);