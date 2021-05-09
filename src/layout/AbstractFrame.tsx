/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Layout } from 'antd';
import React from 'react';

import ApplicationContext from '../configuration/ApplicationContext';
import styles from './AbstractFrame.module.less';
import layoutStyles from './Layout.module.less';


export interface IAbstractFrameProps {}
export interface IAbstractFrameState {}

export default abstract class AbstractFrame<
    P extends IAbstractFrameProps = {},
    S extends IAbstractFrameState = {}
> extends React.Component<P, S> {
    
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

    /**
     * @protected
     * @description Gets menu container width
     * @returns menu container width 
     */
    protected getMenuContainerWidth(): number {
        return ApplicationContext.get().layout?.navigationPanel?.props?.width || 200;
    }

    /**
     * @description Renders abstract frame
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Layout className={ layoutStyles.height100 }>
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
            </Layout>
        );
    }
}