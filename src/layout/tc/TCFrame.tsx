/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import DefaultFrame, { IDefaultFrameProps } from '../DefaultFrame';
import layoutStyles from '../Layout.module.less';
import IMenuItem from './IMenuItem';

export interface ITCFrameProps {}
export interface ITCFrameRouteProps extends RouteComponentProps<ITCFrameProps>, IDefaultFrameProps {}
export interface ITCFrameState {
    readonly selectedMenuItem: IMenuItem | undefined;
}

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

    // private getRootMenuItemByPath(menuItems: IMenuItem[], path: string) {
    //     for (let item of menuItems) {
    //         this.menuItemStack.push(item);
    //         if (item.path === path) { // Hint the item
    //             return;
    //         } else if (item.items && item.items.length > 0) { // If the item has children, it will recurse
    //             this.getRootMenuItemByPath(item.items, path);
    //         }
    //         this.menuItemStack.pop();
    //     }
    // }

    // public render(): React.ReactNode {
    //     return (
    //         <TCLayoutContext.Provider value={ { selectedMenuItem: this.state.selectedMenuItem || {} } }>
    //             { super.render() }
    //         </TCLayoutContext.Provider>
    //     );
    // }
}

export default withRouter(TCFrame);