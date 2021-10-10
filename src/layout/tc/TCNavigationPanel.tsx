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
import { hasAuthority } from '../../components/AuthorityComponent';
import ApplicationContext from '../../configuration/ApplicationContext';
import EventBus from '../../utils/EventBus';
import IMenuItem from './IMenuItem';
import styles from './TCNavigationPanel.module.less';

export interface ITCNavigationPanelProps { }
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
        setTimeout(() => {
            EventBus.addListener('get/authorities', this.flushRender, this);
        }, 0);
    }

    private flushRender(): void {
        this.forceUpdate();
    }

    public componentWillUnmount() {
        EventBus.removeListener('get/authorities', this.flushRender, this);
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
        const selectedSubMenuItem: IMenuItem | undefined = ApplicationContext.getMenuItemByPath(selectedDarkMenuItem?.items || [], location.pathname);
        return (
            <Menu mode="inline" theme={this.getMenuTheme()} className={styles.menu}
                defaultSelectedKeys={[selectedSubMenuItem?.path || selectedDarkMenuItem?.path || '']}
                defaultOpenKeys={[selectedDarkMenuItem?.path || '']}>
                {
                    menu.map<React.ReactNode>((item: IMenuItem): React.ReactNode => (
                        hasAuthority(item.authority)
                            ?
                            (
                                (item.items && item.items.length)
                                    ?
                                    <Menu.SubMenu className={styles.subMenu} key={item.path} title={item.label} icon={<i className={`font_family icon-${item.icon} ${styles.icon}`}></i>}>
                                        {
                                            item.items.map<React.ReactNode>((subItem: IMenuItem): React.ReactNode => (
                                                hasAuthority(subItem.authority)
                                                    ?
                                                    <Menu.Item key={subItem.path} style={{ paddingLeft: "58px", fontWeight: 500 }}>
                                                        <Link to={subItem.path}>{subItem.label}</Link>
                                                    </Menu.Item>
                                                    :
                                                    null
                                            ))
                                        }
                                    </Menu.SubMenu>
                                    :
                                    <Menu.Item className={styles.subMenu} key={item.path} icon={<i className={`iconfont icon-${item.icon}`}></i>}>
                                        <Link to={item.path}>{item.label}</Link>
                                    </Menu.Item>
                            )
                            :
                            null
                    ))
                }
            </Menu>
        );
    }
}

export default withRouter(withTranslation(['translation'])(TCNavigationPanel));