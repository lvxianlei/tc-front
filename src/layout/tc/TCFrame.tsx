/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import ApplicationContext from '../../configuration/ApplicationContext';
import { IRouterItem } from '../../configuration/IApplicationContext';
import DefaultFrame, { IDefaultFrameProps, IDefaultFrameState } from '../DefaultFrame';
import layoutStyles from '../Layout.module.less';

export interface ITCFrameProps {}
export interface ITCFrameRouteProps extends RouteComponentProps<ITCFrameProps>, IDefaultFrameProps {}
export interface ITCFrameState extends IDefaultFrameState {}

/**
 * @TODO Describe the class
 */
class TCFrame extends DefaultFrame<ITCFrameRouteProps, ITCFrameState> {

    // /**
    //  * @implements
    //  * @description Renders content panel
    //  * @returns content panel 
    //  */
    // public renderContentPanel(): React.ReactNode {
    //     return (
    //         <Space direction="vertical" size="small" className={ layoutStyles.width100 }>
    //             { this.renderBreadcrumb() }
    //             { super.renderContentPanel() }
    //         </Space>
    //     );
    // }

    // /**
    //  * @protected
    //  * @description Renders breadcrumb
    //  * @returns breadcrumb 
    //  */
    // protected renderBreadcrumb(): React.ReactNode {
    //     const { location } = this.props;
    //     const pathSnippets: string[] = location.pathname.split('/').filter((i: string) => i);
    //     return  (
    //         <Card>
    //             <Breadcrumb separator=">">
    //                 {
    //                     pathSnippets.map<React.ReactNode>((item: string, index: number): React.ReactNode => {
    //                         const path: string = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    //                         const routerItem: IRouterItem | null = ApplicationContext.getRouterItemByPath(path);
    //                         return (
    //                             routerItem
    //                             ?
    //                             <Breadcrumb.Item key={ path }>
    //                                 {
    //                                     path === location.pathname
    //                                     ?
    //                                     routerItem.name
    //                                     :
    //                                     <Link to={ path }>{ routerItem.name }</Link>

    //                                 }
    //                             </Breadcrumb.Item>
    //                             :
    //                             null
    //                         );
    //                     })
    //                 }
    //             </Breadcrumb>
    //         </Card>
    //     );
    // }
}

export default withRouter(TCFrame);