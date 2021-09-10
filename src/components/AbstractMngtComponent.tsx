/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, Card, Form, FormItemProps, Space, Table, Tabs } from 'antd';
import { ColumnType, TablePaginationConfig, TableProps } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import layoutStyles from '../layout/Layout.module.less';
import styles from './AbstractMngtComponent.module.less';
import './AbstractMngtComponent.module.less';
import AbstractTabableComponent from './AbstractTabableComponent';
import ITabableComponent, { ITabItem } from './ITabableComponent';

export interface IAbstractMngtComponentState {
    selectedTabKey: React.Key;
    tablePagination: TablePaginationConfig | undefined;
}

/**
 * The abstract management component
 */
export default abstract class AbstractMngtComponent<P extends RouteComponentProps, S extends IAbstractMngtComponentState> extends AbstractTabableComponent<P, S> /*AsyncComponent<P, S> implements ITabableComponent*/ {

    /**
     * @constructor
     * Creates an instance of AbstractMngtComponent.
     * @param props 
     */
    constructor(props: P) {
        super(props);
        this.state = this.getState();
        this.onFilterSubmit = this.onFilterSubmit.bind(this);
        this.onNewClick = this.onNewClick.bind(this);
        this.onTableChange = this.onTableChange.bind(this);
    }

    /**
     * @description Gets state, it can override.
     * @returns state 
     */
    protected getState(): S {
        return {
            selectedTabKey: this.getTabItems()[0].key,
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            }
        } as S;
    }

    /**
     * @abstract
     * @description Gets tab items
     * @returns tab items 
     */
    abstract getTabItems(): ITabItem[];

    /**
     * @abstract
     * @description Determines whether tab change on
     * @param activeKey 
     */
    abstract onTabChange(activeKey: string): void;

    /**
     * @abstract
     * @description Gets filter form item props
     * @param item 
     * @returns filter form item props 
     */
    abstract getFilterFormItemProps(item: ITabItem): FormItemProps[];

    /**
     * @abstract
     * @description Determines whether new click on
     * @param event 
     */
    abstract onNewClick(event: React.MouseEvent<HTMLButtonElement>): void;

    /**
     * @abstract
     * @description Determines whether filter submit on
     * @param values 
     */
    abstract onFilterSubmit(values: Record<string, any>): void;

    /**
     * @abstract
     * @description Determines whether table change on
     * @param pagination 
     */
    abstract onTableChange(pagination: TablePaginationConfig): void;

    /**
     * @abstract
     * @description Gets table data source
     * @param item 
     * @returns table data source 
     */
    abstract getTableDataSource(item: ITabItem): object[];

    /**
     * @implements
     * @description Gets table columns
     * @param item 
     * @returns table columns 
     */
    abstract getTableColumns(item: ITabItem): ColumnType<object>[];

    /**
     * @description Gets table props
     * @param item 
     * @returns table props 
     */
    protected getTableProps(item: ITabItem): TableProps<object> {
        return {
            rowKey: this.getTableRowKey(),
            bordered: false,
            pagination: this.state.tablePagination || false,
            onChange: this.onTableChange,
            dataSource: this.getTableDataSource(item),
            columns: this.getTableColumns(item).map(item => ({ ...item, ellipsis: true, onCell: () => ({ className: styles.tableCell }) })),
            size: "small",
            onRow: () => ({ className: styles.tableRow })
        };
    }

    /**
     * @description Handle tab change of abstract mngt component
     * @param activeKey 
     */
    public handleTabChange = (activeKey: string): void => {
        this.setState(pre => {
            if (pre.selectedTabKey === activeKey) {
                return pre;
            }

            this.onTabChange(activeKey);
            return {
                selectedTabKey: activeKey,
                tablePagination: this.getState().tablePagination
            } as S;
        })
    }

    /**
     * @description Renders AbstractMngtComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Tabs type="card" className={styles.tab} onChange={this.handleTabChange}>
                {
                    this.getTabItems().map<React.ReactNode>((item: ITabItem): React.ReactNode => (
                        <Tabs.TabPane key={item.key} tab={item.label}>{this.renderTabContent(item)}</Tabs.TabPane>
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
            <Space direction="vertical" size="small" className={layoutStyles.width100}>
                {
                    this.getFilterFormItemProps(item).length
                        ?
                        <Card className={styles.filterCard}>
                            {this.renderFilterContent(item)}
                        </Card>
                        :
                        null
                }
                <Card>
                    <Space className={layoutStyles.width100} direction="vertical" size="large">
                        {this.renderExtraOperationContent(item)}
                        {this.renderTableContent(item)}
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
            <Form layout="inline" onFinish={this.onFilterSubmit}>
                {
                    this.getFilterFormItemProps(item).map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
                        <Form.Item key={`${props.name}_${index}`} {...props} />
                    ))
                }
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
            <Button type="primary" onClick={this.onNewClick}>新增</Button>
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
            <Table {...this.getTableProps(item)} className={styles.table} scroll={{ x: 1200 }} />
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