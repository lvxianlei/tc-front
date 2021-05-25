/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Tabs, TabsProps, Button } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import styles from './AbstractTabableComponent.module.less';
import AbstractTitledRouteComponent from './AbstractTitledRouteComponent';
import ITabableComponent, { ITabItem } from './ITabableComponent';

/**
 * Abstract tabable component
 */
export default abstract class AbstractTabableComponent<P extends RouteComponentProps, S = {}> extends AbstractTitledRouteComponent<P, S> implements ITabableComponent {
 
    /**
     * @abstract
     * @description Gets tab items
     * @returns tab items 
     */
    abstract getTabItems(): ITabItem[];

    /**
     * @protected
     * @description Gets tabs props
     * @returns tabs props 
     */
    protected getTabsProps(): TabsProps {
        return {
            className: styles.tabs
        };
    }

    /**
     * @description Renders AbstractTabableComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Tabs { ...this.getTabsProps() }>
                {
                    this.getTabItems().map<React.ReactNode>((item: ITabItem): React.ReactNode => (
                        <Tabs.TabPane tab={ item.label } key={ item.key }>
                            { item.content }
                        </Tabs.TabPane>
                    ))
                }
            </Tabs>
        );
    }
}