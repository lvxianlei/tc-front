/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { Button, Card, Form, FormItemProps, Space, Pagination, Tabs, TabsProps, Row, Col, FormInstance } from 'antd';
import { ColumnType, TablePaginationConfig, TableProps } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import { RouteComponentProps } from 'react-router';
import layoutStyles from '../layout/Layout.module.less';
import styles from './AbstractMngtComponent.module.less';
// import './AbstractMngtComponent.module.less';
import AbstractTabableComponent from './AbstractTabableComponent';
import { ITabItem } from './ITabableComponent';
import CommonTable from "../pages/common/CommonTable"
export interface IAbstractMngtComponentState {
    loading: boolean,
    selectedTabKey: React.Key;
    tablePagination: TablePaginationConfig | undefined;
}

/**
 * The abstract management component
 */
export default abstract class AbstractMngtComponent<P extends RouteComponentProps, S extends IAbstractMngtComponentState> extends AbstractTabableComponent<P, S> /*AsyncComponent<P, S> implements ITabableComponent*/ {
    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();
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
            loading: false,
            selectedTabKey: this.getTabItems()[0].key,
            tablePagination: {
                current: 1,
                pageSize: 20,
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

    protected getForm(): FormInstance | null {
        return this.form?.current;
    }

    /**
     * @description Gets table props
     * @param item 
     * @returns table props 
     */
    protected getTableProps(item: ITabItem): TableProps<object> {
        return {
            rowKey: this.getTableRowKey(),
            bordered: false,
            pagination: {
                ...this.state.tablePagination || false,
                showSizeChanger: true,
                showTotal: (total) => `共${total} 条记录`,
            },
            onChange: this.onTableChange,
            dataSource: this.getTableDataSource(item),
            columns: this.getTableColumns(item),
        };
    }

    /**
     * @description Handle tab change of abstract mngt component
     * @param activeKey 
     */
    public handleTabChange = (activeKey: string): void => {
        if (this.state.selectedTabKey !== activeKey) {
            this.setState({
                selectedTabKey: activeKey,
                tablePagination: this.getState().tablePagination
            } as S)
        }
        this.onTabChange(activeKey)
    }

    /**
     * @protected
     * @description Gets tabs props
     * @returns tabs props 
     */
    protected getTabsProps(): TabsProps {
        const tabItems = this.getTabItems();
        const dontNeedHeader = tabItems.every(tab => !tab.label)
        return {
            tabBarStyle: {
                display: dontNeedHeader ? "none" : 'block'
            }
        };
    }

    /**
     * @description Renders AbstractMngtComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Tabs {...this.getTabsProps()} type="card" className={styles.tab} onChange={this.handleTabChange}>
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
            <Space direction="vertical" size="middle" className={layoutStyles.width100}>
                {
                    this.getFilterFormItemProps(item).length
                    ?
                    this.getFilterFormItemProps(item).length && <Card className={styles.filterCard} bordered={false}>
                        {this.renderFilterContent(item)}
                    </Card>
                    :
                    null
                }
                <Card bordered={false} style={{ padding: '0px' }}>
                    {this.renderExtraOperationContent(item)}
                    {this.renderTableContent(item)}
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
            <Form layout="inline" onFinish={this.onFilterSubmit} onValuesChange={this.onFilterSubmit} ref={this.form}>
                <Row gutter={[0, 16]}>
                    {
                        this.getFilterFormItemProps(item).map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
                            <Col key={`${props.name}_${index}`}><Form.Item {...props} /></Col>
                        ))
                    }
                    <Col>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item>
                            <Button onClick={async() => {
                                await (this.getForm() as any).resetFields();
                                this.onFilterSubmit({})
                            }}>重置</Button>
                        </Form.Item>
                    </Col>
                </Row>
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
            <CommonTable  {...(this.getTableProps(item) as any)} loading={this.state.loading} isPage={true} />
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