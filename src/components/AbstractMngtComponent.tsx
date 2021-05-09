/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, Card, Form, Space, Table, Tabs } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import styles from './AbstractMngtComponent.module.less';
import layoutStyles from '../layout/Layout.module.less';
import AsyncComponent from './AsyncComponent';

export interface ITabItem {
    readonly label: string;
    readonly key: string | number;
}

/**
 * The abstract management component
 */
export default abstract class AbstractMngtComponent<P = {}, S = {}> extends AsyncComponent<P, S> {

    /**
     * @constructor
     * Creates an instance of AbstractMngtComponent.
     * @param props 
     */
    constructor(props: P) {
        super(props);
        this.onFilterSubmit = this.onFilterSubmit.bind(this);
    }

    /**
     * @abstract
     * @description Gets tab items
     * @returns tab items 
     */
    abstract getTabItems(): ITabItem[];

    /**
     * @abstract
     * @description Renders filter components
     * @param item 
     * @returns filter components 
     */
    abstract renderFilterComponents(item: ITabItem): React.ReactNode[];

    /**
     * @abstract
     * @description Determines whether filter submit on
     * @param values 
     */
    abstract onFilterSubmit(values: Record<string, any>): void;

    /**
     * @abstract
     * @description Gets table data source
     * @param item 
     * @returns table data source 
     */
    abstract getTableDataSource(item: ITabItem): object[];

    /**
     * @abstract
     * @description Gets table columns
     * @param item 
     * @returns table columns 
     */
    abstract getTableColumns(item: ITabItem): ColumnType<object>[];

    /**
     * @description Renders AbstractMngtComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Tabs type="card" className={ styles.tab }>
                {
                    this.getTabItems().map<React.ReactNode>((item: ITabItem): React.ReactNode => (
                        <Tabs.TabPane key={ item.key } tab={ item.label }>{ this.renderTabContent(item) }</Tabs.TabPane>
                    ))
                }
            </Tabs>
        );
    }

    /**
     * @protected
     * @description Renders tab content
     * @param item 
     * @returns tab content 
     */
    protected renderTabContent(item: ITabItem): React.ReactNode {
        return (
            <Space direction="vertical" size="small" className={ layoutStyles.width100 }>
                <Card>
                    { this.renderFilterContent(item) }
                </Card>
                <Card>
                    <Space className={ layoutStyles.width100 } direction="vertical" size="large">
                        { this.renderExtraOperationContent(item) }
                        { this.renderTableContent(item) }
                    </Space>
                </Card>
            </Space>
        );
    }

    /**
     * @protected
     * @description Renders filter content
     * @param item 
     * @returns filter content 
     */
    protected renderFilterContent(item: ITabItem): React.ReactNode {
        return (
            <Form layout="inline" onFinish={ this.onFilterSubmit }>
                { this.renderFilterComponents(item) }
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="reset">重置</Button>
                </Form.Item>
            </Form>
        );
    }

    protected renderExtraOperationContent(item: ITabItem): React.ReactNode {
        return (
            <Button type="primary">新增</Button>
        );
    }

    /**
     * @protected
     * @description Renders table content
     * @param item 
     * @returns table content 
     */
    protected renderTableContent(item: ITabItem): React.ReactNode {
        return (
            <Table rowKey={ this.getTableRowKey() } bordered={ true }
                dataSource={ this.getTableDataSource(item) } columns={ this.getTableColumns(item) }/>
        );
    }

    /**
     * @protected
     * @description Gets table row key
     * @returns table row key 
     */
    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}