/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Card, Col, ColProps, Row, Space, Tabs } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import styles from './AbstractDetailComponent.module.less';
import layoutStyles from '../layout/Layout.module.less';
import AbstractTitledRouteComponent from './AbstractTitledRouteComponent';
import { ITabItem } from './ITabableComponent';

// export interface IAbstractDetailComponentProps {}
// export interface IAbstractDetailComponentState {}

/**
 * The abstract detail component.
 * All detail page should extend from this abstract class.
 */
export default abstract class AbstractDetailComponent<P extends RouteComponentProps, S = {}> extends AbstractTitledRouteComponent<P, S> {

    /**
     * @constructor
     * Creates an instance of AbstractDetailComponent.
     * @param props 
     */
    constructor(props: P) {
        super(props);
    }

    /**
     * @abstract
     * @description Gets subinfo col props
     * @returns subinfo col props 
     */
    abstract getSubinfoColProps(): ColProps[];

    /**
     * @abstract
     * @description Renders operation area
     * @returns operation area 
     */
    abstract renderOperationArea(): React.ReactNode | React.ReactNode[];

    /**
     * @abstract
     * @description Gets tab items
     * @returns tab items 
     */
    abstract getTabItems(): ITabItem[];

    /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Space direction="vertical" size="middle" className={ layoutStyles.width100 }>
                <Card>
                    <Space direction="vertical" size="middle" className={ layoutStyles.width100 }>
                        <h1 className={ styles.title }>{ this.getTitle() }</h1>
                        <Row gutter={ 24 } className={ styles.subinfo }>
                            {
                                this.getSubinfoColProps().map<React.ReactNode>((props: ColProps, index: number): React.ReactNode => (
                                    <Col key={ index } { ...props }/>
                                ))
                            }
                        </Row>
                        <Space direction="horizontal" size="middle">
                            { this.renderOperationArea() }
                        </Space>
                    </Space>
                </Card>
                <Tabs className={ styles.tabs }>
                    {
                        this.getTabItems().map<React.ReactNode>((item: ITabItem): React.ReactNode => (
                            <Tabs.TabPane tab={ item.label } key={ item.key }>
                                { item.content }
                            </Tabs.TabPane>
                        ))
                    }
                </Tabs>
            </Space>
        );
    }
}