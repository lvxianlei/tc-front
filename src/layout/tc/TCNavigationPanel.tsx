/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Menu, MenuTheme } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import AsyncComponent from '../../components/AsyncComponent';
import ApplicationContext from '../../configuration/ApplicationContext';
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

    /**
     * @constructor
     * Creates an instance of tcnavigation panel.
     * @param props 
     */
    constructor(props: ITCNavigationPanelRouteProps) {
        super(props);
        this.state = {
            selectedDarkMenuItem: ApplicationContext.getMenuItemByPath(ApplicationContext.get().layout?.navigationPanel?.props?.menu, props.location.pathname)
        };
    }

    /**
     * @protected
     * @description Gets menu theme
     * @returns menu theme 
     */
     protected getMenuTheme(): MenuTheme {
        return ApplicationContext.get().layout?.navigationPanel?.props?.theme || 'light';
    }

    /**
     * @description Renders TCNavigationPanel
     * @returns render 
     */
    public render(): React.ReactNode {
        const { menu, location } = this.props;
        const selectedDarkMenuItem: IMenuItem | undefined = ApplicationContext.getMenuItemByPath(ApplicationContext.get().layout?.navigationPanel?.props?.menu, location.pathname);
        const selectedSubMenuItem: IMenuItem | undefined =  ApplicationContext.getMenuItemByPath(selectedDarkMenuItem?.items || [], location.pathname);
        return (
            <Menu mode="inline" theme={ this.getMenuTheme() }
                defaultSelectedKeys={[ selectedSubMenuItem?.path || selectedDarkMenuItem?.path || '' ]}
                defaultOpenKeys={[ selectedDarkMenuItem?.path || '' ]}>
                {
                    menu.map<React.ReactNode>((item: IMenuItem): React.ReactNode => (
                        (item.items && item.items.length)
                        ?
                        <Menu.SubMenu key={ item.path } title={ item.label }>
                            {
                                item.items.map<React.ReactNode>((subItem: IMenuItem): React.ReactNode => (
                                    <Menu.Item key={ subItem.path }>
                                        <Link to={ subItem.path }>{ subItem.label }</Link>
                                    </Menu.Item>
                                ))
                            }
                        </Menu.SubMenu>
                        :
                        <Menu.Item key={ item.path }>
                            <Link to={ item.path }>{ item.label }</Link>
                        </Menu.Item>
                    ))
                }
            </Menu>
        );
    }
}

export default withRouter(withTranslation(['translation'])(TCNavigationPanel));