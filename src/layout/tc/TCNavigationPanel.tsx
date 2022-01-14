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
import AuthUtil from '../../utils/AuthUtil';
import EventBus from '../../utils/EventBus';
import IMenuItem from './IMenuItem';
import styles from './TCNavigationPanel.module.less';

export interface ITCNavigationPanelProps { }
export interface ITCNavigationPanelRouteProps extends RouteComponentProps<ITCNavigationPanelProps>, WithTranslation {
    readonly menu: IMenuItem[]
}
export interface ITCNavigationPanelState {
    readonly selectedDarkMenuItem: any | undefined;
    readonly selectedSubMenuItem: any | undefined;
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
        const selectedDarkMenuItem: IMenuItem | undefined = ApplicationContext.getMenuItemByPath(ApplicationContext.get().layout?.navigationPanel?.props?.menu, props?.location.pathname);
        // const selectedSubMenuItem: IMenuItem | undefined = ApplicationContext.getMenuItemByPath(selectedDarkMenuItem?.items || [], props?.location.pathname);
        this.state = {
            selectedDarkMenuItem: [props.location.pathname] || [],
            selectedSubMenuItem: selectedDarkMenuItem?.path ? [selectedDarkMenuItem.path] : []
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
     * @protected
     * @description Gets menu theme
     * @returns menu theme 
     */
    protected getMenuItemForAppName(): IMenuItem[] {
        const currentApp = AuthUtil.getCurrentAppName()
        return this.props.menu.filter((item: any) => [currentApp, ""].includes(item.appName))
    }

    /**
     * @description Renders TCNavigationPanel
     * @returns render 
     */
    componentWillReceiveProps(props: any) {
        const { location } = props;
        const selectedDarkMenuItem: IMenuItem | undefined = ApplicationContext.getMenuItemByPath(ApplicationContext.get().layout?.navigationPanel?.props?.menu, location.pathname);
        const selectedSubMenuItem: IMenuItem | undefined = ApplicationContext.getMenuItemByPath(this.state.selectedDarkMenuItem?.items || [], location.pathname);
        this.setState({
            selectedDarkMenuItem: location?.pathname ? [location?.pathname] : [],
            selectedSubMenuItem: selectedDarkMenuItem?.path ? [selectedDarkMenuItem.path] : [],
        })
    }
    hanleLink(options: any) {
        this.setState({
            selectedDarkMenuItem: [options.path],
        })
    }
    public render(): React.ReactNode {
        return (
            <Menu mode="inline" theme={this.getMenuTheme()} className={styles.menu}
                // defaultSelectedKeys={[this.state.selectedDarkMenuItem?.path || '']}
                // defaultOpenKeys={[this.state.selectedSubMenuItem?.path || this.state.selectedDarkMenuItem?.path || '']}
                openKeys={this.state.selectedSubMenuItem}
                selectedKeys={this.state.selectedDarkMenuItem}
                onOpenChange={(openKeys: React.Key[]) => {
                    this.setState({
                        selectedSubMenuItem: (openKeys as any)
                    })
                }} 
            >
                {
                    this.getMenuItemForAppName().map<React.ReactNode>((item: IMenuItem): React.ReactNode => (
                        hasAuthority(item.authority)
                            ?
                            (
                                (item.items && item.items.length)
                                    ?
                                    <Menu.SubMenu className={styles.subMenu} key={item.path} title={item.label} icon={<i className={`font_family iconfont icon-${item.icon} ${styles.icon}`}></i>}>
                                        {
                                            item.items.map<React.ReactNode>((subItem: IMenuItem): React.ReactNode => (
                                                hasAuthority(subItem.authority)
                                                    ?
                                                    <Menu.Item key={subItem.path} style={{ paddingLeft: "58px", fontWeight: 500 }} onClick={() => this.hanleLink(subItem)}>
                                                        <Link to={subItem.path}>{subItem.label}</Link>
                                                    </Menu.Item>
                                                    :
                                                    null
                                            ))
                                        }
                                    </Menu.SubMenu>
                                    :
                                    <Menu.Item  onClick={() => this.hanleLink(item)} className={styles.subMenu} key={item.path} icon={<i className={`iconfont icon-${item.icon}`}></i>}>
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