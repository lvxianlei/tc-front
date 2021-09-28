/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined
  } from '@ant-design/icons';

import styles from './TCHeader.module.less';

import AsyncComponent from '../../components/AsyncComponent';
import EventBus from '../../utils/EventBus';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { IRouterItem } from '../../configuration/IApplicationContext';
import ApplicationContext from '../../configuration/ApplicationContext';
import IMenuItem from './IMenuItem';

export interface ITCHeaderProps {}
export interface ITCHeaderRouteProps extends RouteComponentProps<ITCHeaderProps> {}
export interface ITCHeaderState {
    readonly collapsed: boolean;
}

/**
 * @TODO Describe the class
 */
class TCHeader extends AsyncComponent<ITCHeaderRouteProps, ITCHeaderState> {

    public state: ITCHeaderState = {
        collapsed: false
    };

    constructor(props: ITCHeaderRouteProps) {
        super(props);
        this.toggle = this.toggle.bind(this);
    }

    public toggle(): void {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    public componentDidUpdate(prevProps: ITCHeaderRouteProps, prevState: ITCHeaderState): void {
        super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState);
        if (prevState.collapsed !== this.state.collapsed) { // collapsed changed
            EventBus.emit('menu/collapsed', this.state.collapsed);
        }
    }

    /**
     * @protected
     * @description Renders breadcrumb
     * @returns breadcrumb 
     */
    protected renderBreadcrumb(): React.ReactNode {
        const { location } = this.props;
        const pathSnippets: string[] = location.pathname.split('/').filter((i: string) => i);
        const selectedMenuItem: IMenuItem | undefined =  ApplicationContext.getMenuItemByPath(ApplicationContext.get().layout?.navigationPanel?.props?.menu, `/${ pathSnippets[0] }`)
       console.log(pathSnippets)
        return  (
            <Breadcrumb separator="/" className={ styles.breadcrumb }>
                {
                    selectedMenuItem
                    ?
                    <Breadcrumb.Item key={ selectedMenuItem.path }>
                        { selectedMenuItem.label }
                    </Breadcrumb.Item>
                    :
                    null
                }
                {
                    pathSnippets.map<React.ReactNode>((item: string, index: number): React.ReactNode => {
                        const path: string = `/${pathSnippets.slice(0, index + 1).join('/')}`;
                        const routerItem: IRouterItem | null = ApplicationContext.getRouterItemByPath(path);
                        return (
                            routerItem
                            ?
                            <Breadcrumb.Item key={ path }>
                                {
                                    path === location.pathname
                                    ?
                                    routerItem.name
                                    :
                                    <Link to={ path }>{ routerItem.name }</Link>

                                }
                            </Breadcrumb.Item>
                            :
                            null
                        );
                    })
                }
            </Breadcrumb>
        );
    }

    /**
     * @description Renders TCHeader
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <div className={ styles.header }>
                {
                    this.state.collapsed
                    ?
                    <MenuUnfoldOutlined className={ styles.trigger } onClick={ this.toggle }/>
                    :
                    <MenuFoldOutlined className={ styles.trigger } onClick={ this.toggle }/>
                }
                { this.renderBreadcrumb() }
            </div>
        );
    }
}

export default withRouter(TCHeader);