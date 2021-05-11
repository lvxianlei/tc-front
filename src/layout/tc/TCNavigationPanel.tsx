/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Col, Menu, Row } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import AsyncComponent from '../../components/AsyncComponent';
import ApplicationContext from '../../configuration/ApplicationContext';
import layoutStyles from '../Layout.module.less';
import IMenuItem from './IMenuItem';

export interface ITCNavigationPanelProps {}
export interface ITCNavigationPanelRouteProps extends RouteComponentProps<ITCNavigationPanelProps>, WithTranslation {
    readonly menu: IMenuItem[]
}
export interface ITCNavigationPanelState {
    readonly selectedDarkMenuItem: IMenuItem | undefined;
}

/**
 * @TODO Describe the class
 */
class TCNavigationPanel extends AsyncComponent<ITCNavigationPanelRouteProps, ITCNavigationPanelState> {

    private menuItemStack: IMenuItem[] = [];

    /**
     * @constructor
     * Creates an instance of tcnavigation panel.
     * @param props 
     */
    constructor(props: ITCNavigationPanelRouteProps) {
        super(props);
        this.state = {
            selectedDarkMenuItem: this.getSelectedMenuItem(props.location.pathname)
        };
    }

    /**
     * @protected
     * @description Gets selected menu item
     * @param pathname 
     * @returns selected menu item 
     */
    protected getSelectedMenuItem(pathname: string): IMenuItem | undefined {
        this.getRootMenuItemByPath(ApplicationContext.get().layout?.navigationPanel?.props?.menu, pathname);
        return this.menuItemStack.pop(); 
    }

    /**
     * @private
     * @description Gets root menu item by path
     * @param menuItems 
     * @param path 
     * @returns  
     */
    private getRootMenuItemByPath(menuItems: IMenuItem[], path: string) {
        for (let item of menuItems) {
            this.menuItemStack.push(item);
            if (item.path === path) { // Hint the item
                return;
            } else if (item.items && item.items.length > 0) { // If the item has children, it will recurse
                this.getRootMenuItemByPath(item.items, path);
            }
            this.menuItemStack.pop();
        }
    }

    /**
     * @description Renders TCNavigationPanel
     * @returns render 
     */
    public render(): React.ReactNode {
        const { menu, location } = this.props;
        const selectedDarkMenuItem: IMenuItem | undefined = this.getSelectedMenuItem(location.pathname);
        return (
            <Row className={ layoutStyles.height100 }>
                <Col span={ 7 }>
                    <Menu mode="inline" theme="dark" className={ layoutStyles.height100 } selectedKeys={[ selectedDarkMenuItem?.path || '' ]}>
                        {
                            menu.map<React.ReactNode>((item: IMenuItem): React.ReactNode => (
                                <Menu.Item key={ item.path }>
                                    <Link to={ item.items ? item.items[0].path : item.path }>{ item.label }</Link>
                                </Menu.Item>
                            ))
                        }
                    </Menu>
                </Col>
                <Col span={ 17 }>
                    <Menu mode="inline" theme="light" className={ layoutStyles.height100 } selectedKeys={[ location.pathname ]}>
                        {
                            selectedDarkMenuItem?.items?.map<React.ReactNode>((item: IMenuItem): React.ReactNode => (
                                <Menu.Item key={ item.path }>
                                    <Link to={ item.items ? item.items[0].path : item.path }>{ item.label }</Link>
                                </Menu.Item>
                            ))
                        }
                    </Menu>
                </Col>
            </Row>
        );
    }
}

export default withRouter(withTranslation(['translation'])(TCNavigationPanel));