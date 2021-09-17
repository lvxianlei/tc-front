/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Layout } from 'antd';
import { SiderTheme } from 'antd/lib/layout/Sider';
import React from 'react';

import ApplicationContext from '../configuration/ApplicationContext';
import EventBus from '../utils/EventBus';
import styles from './AbstractFrame.module.less';
import layoutStyles from './Layout.module.less';


export interface IAbstractFrameProps { }
export interface IAbstractFrameState {
    readonly collapsed: boolean;
}

export default abstract class AbstractFrame<
    P extends IAbstractFrameProps = {},
    S extends IAbstractFrameState = IAbstractFrameState
    > extends React.Component<P, S> {

    constructor(props: P) {
        super(props);
        this.state = this.getState();
    }

    protected getState(): S {
        return {
            collapsed: false
        } as S;
    }

    /**
     * @description Renders logo
     * @returns logo 
     */
    abstract renderLogo(): React.ReactNode;

    /**
     * @description Renders navigation panel
     * @returns navigation panel 
     */
    abstract renderNavigationPanel(): React.ReactNode;

    /**
     * @description Renders content panel
     * @returns content panel 
     */
    abstract renderContentPanel(): React.ReactNode;

    /**
     * @description Renders header panel
     * @returns header panel 
     */
    abstract renderHeaderPanel(): React.ReactNode;

    /**
     * @description Renders footer panel
     * @returns footer panel 
     */
    abstract renderFooterPanel(): React.ReactNode;

    public componentDidMount(): void {
        super.componentDidMount && super.componentDidMount();
        EventBus.addListener('menu/collapsed', this.onCollapsed, this);
    }

    public componentWillUnmount() {
        EventBus.removeListener('menu/collapsed', this.onCollapsed, this);
    }

    protected onCollapsed(collapsed: boolean): void {
        this.setState({
            collapsed: collapsed
        });
    }

    /**
     * @protected
     * @description Gets menu container width
     * @returns menu container width 
     */
    protected getMenuContainerWidth(): number {
        return ApplicationContext.get().layout?.navigationPanel?.props?.width || 200;
    }

    /**
     * @protected
     * @description Gets menu theme
     * @returns menu theme 
     */
    protected getMenuTheme(): SiderTheme {
        return ApplicationContext.get().layout?.navigationPanel?.props?.theme || 'light';
    }

    /**
     * @description Renders abstract frame
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Layout className={layoutStyles.height100}>
                <Layout.Header className={styles.header}>
                    <Layout>
                        <Layout.Sider className={styles.logo} theme={this.getMenuTheme()} collapsedWidth={48} width={this.getMenuContainerWidth()}>
                            {this.renderLogo()}
                        </Layout.Sider>
                        <Layout.Content className={styles.headerContent}>
                            {this.renderHeaderPanel()}
                        </Layout.Content>
                    </Layout>
                </Layout.Header>
                <Layout>
                    <Layout.Sider theme={this.getMenuTheme()} collapsed={this.state.collapsed}
                        collapsedWidth={48}
                        style={{ backgroundColor: "#F8F8F8" }}
                        width={this.getMenuContainerWidth()}>
                        <div className={styles.navigation}>
                            {this.renderNavigationPanel()}
                        </div>
                        {/* <Layout.Footer>
                        { this.renderFooterPanel() }
                    </Layout.Footer> */}
                    </Layout.Sider>
                    <Layout.Content className={styles.content}>
                        {this.renderContentPanel()}
                    </Layout.Content>
                </Layout>
                {/**
                <Layout.Header>
                    { this.renderHeaderPanel() }
                </Layout.Header>
                <Layout>
                    <Layout.Sider theme="light" width={ this.getMenuContainerWidth() }>
                        { this.renderNavigationPanel() }
                    </Layout.Sider>
                    <Layout>
                        <Layout.Content className={ styles.content }>
                            { this.renderContentPanel() }
                        </Layout.Content>
                        <Layout.Footer>
                            { this.renderFooterPanel() }
                        </Layout.Footer>
                    </Layout>
                </Layout>
                */}
            </Layout>
        );
    }
}