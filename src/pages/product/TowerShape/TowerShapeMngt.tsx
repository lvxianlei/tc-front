/**
 * @author zyc
 * @copyright © 2021
 */

import { Button, Dropdown, FormItemProps, Input, Menu, Popconfirm, Space, TableColumnType, TablePaginationConfig, TableProps, Upload } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import { ITabItem } from '../../../components/ITabableComponent';
import AuthUtil from '../../../utils/AuthUtil';
import RequestUtil from '../../../utils/RequestUtil';
import ImportTemplateModal from './ImportTemplateModal';
import TowerSectionModal from './TowerSectionModal';

export interface ITowerShapeMngtProps {}
export interface ITowerShapeMngtWithRouteProps extends RouteComponentProps<ITowerShapeMngtProps>, WithTranslation {}
export interface ITowerShapeMngtState extends IAbstractMngtComponentState {
    readonly tableDataSource: ITowerShape[];
    readonly selectedTowerKeys: React.Key[];
    readonly selectedTower: ITowerShape[];
    readonly internalNumber?: string | number;
    readonly projectName?: string;
    readonly steelProductShape?: string;
    readonly productCategoryName?: string;
}

export interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: ITowerShape[];
}

interface ITowerShape {
    readonly id?: number | string;
    readonly description?: string;
    readonly internalNumber?: string | number;
    readonly label?: string;
    readonly materialTexture?: string;
    readonly operateStatus?: number;
    readonly partNumber?: number;
    readonly productCategoryName?: string;
    readonly productShapeName?: string;
    readonly productType?: number | string;
    readonly projectName?: string;
    readonly steelProductShape?: string;
    readonly voltageGrade?: string | number;
    readonly weight?: number;
}

 /**
  * 销售合同管理
  */
class TowerShapeMngt extends AbstractMngtComponent<ITowerShapeMngtWithRouteProps, ITowerShapeMngtState> {
    
    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): ITowerShapeMngtState {
        return {
            ...super.getState(),
            tableDataSource: []
        };
    }
 
    /**
     * @description Fetchs table data
     * @param filterValues 
     */
    protected async fetchTableData(filterValues: Record<string, any>,pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-data-archive/productCategory', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize ||this.state.tablePagination?.pageSize,
        });
        if(resData?.records?.length == 0 && resData?.current > 1){
            this.fetchTableData({},{
                current: resData.current - 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            });
        }
        this.setState({
            ...filterValues,
            tableDataSource: resData.records,
            tablePagination: {
                ...this.state.tablePagination,
                current: resData.current,
                pageSize: resData.size,
                total: resData.total
            }
        });
    }
 
     /**
      * @override
      * @description Components did mount
      */
    public async componentDidMount() {
        super.componentDidMount();
        this.fetchTableData({});
    }

     /**
      * @implements
      * @description Gets table data source
      * @param item 
      * @returns table data source 
    */
    public getTableDataSource(item: ITabItem): object[] {
        return this.state.tableDataSource;
    }
    
    public menu(record: object) :React.ReactElement<any, string> {
        return <Menu>
            <Menu.Item>
                <Button type="link"  href={ `/product/towershape/setting/${ (record as ITowerShape).id }` }>编辑</Button>
            </Menu.Item>
            <Menu.Item>
                <Popconfirm 
                    title="要删除该客户吗？" 
                    placement="topRight" 
                    okText="确认"
                    cancelText="取消"
                    onConfirm={ this.onDelete([record as ITowerShape]) }
                >
                    <Button type="link">
                        删除
                    </Button>
                </Popconfirm>
            </Menu.Item>
            <Menu.Item>
                <Button type="link" href={ `/product/towershape/change/${ (record as ITowerShape).id }` }>变更</Button>
            </Menu.Item>
        </Menu>
    }

     /**
      * @implements
      * @description Gets table columns
      * @param item 
      * @returns table columns 
      */
    public getTableColumns(item: ITabItem): TableColumnType<object>[] {
        return [{
            key: 'name',
            title: '塔型',
            dataIndex: 'name'
        }, {
            key: 'steelProductShape',
            title: '钢印塔型',
            dataIndex: 'steelProductShape'
        }, {
            key: 'internalNumber',
            title: '内部合同编号',
            dataIndex: 'internalNumber'
        }, {
            key: 'projectName',
            title: '工程名称',
            dataIndex: 'projectName'
        }, {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <TowerSectionModal id={ (record as ITowerShape).id }/>
                    <Upload 
                        action={ () => {
                            const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                            return baseUrl+'/tower-data-archive/productCategory/drawComponent/import'
                        } } 
                        headers={
                            {
                                'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                                'Tenant-Id': AuthUtil.getTenantId(),
                                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                            }
                        }
                        data={ { productCategoryId: (record as ITowerShape).id } }>
                        <Button type="link">导入图纸构件明细</Button>
                    </Upload>
                    <Button type="link" href={ `/product/towershape/componentDetails/${ (record as ITowerShape).id }` }>编辑图纸构件明细</Button>
                    <Dropdown overlay={ this.menu(record) } trigger={['click']}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            ···
                        </a>
                    </Dropdown>
                </Space>
            )
        }];
    }

     /**
     * @implements
     * @description Determines whether table change on
     * @param pagination 
     */
    public onTableChange(pagination: TablePaginationConfig): void {
        this.fetchTableData({
            internalNumber: this.state.internalNumber,
            projectName: this.state.projectName,
            steelProductShape: this.state.steelProductShape,
            productCategoryName: this.state.productCategoryName,
        }, pagination);
    }
     
    /**
     * @implements
     * @description Determines whether filter submit on
     * @param values 
     */
    public async onFilterSubmit(values: Record<string, any>) {
        const tablePagination:TablePaginationConfig = {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: false
        }
        this.fetchTableData(values, tablePagination);
    }

    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [{
            label: '塔型列表',
            key: ""
        }];
    }

    /**
     * @implements
     * @description Determines whether tab change on
     * @param activeKey 
     */
    public onTabChange(activeKey: string): void {
        this.fetchTableData({});
    }

    /**
     * @override
     * @description Gets table props
     * @param item 
     * @returns table props 
     */
     protected getTableProps(item: ITabItem): TableProps<object> {
        return {
            ...super.getTableProps(item),
            rowSelection: {
                selectedRowKeys: this.state.selectedTowerKeys,
                onChange: this.SelectChange
            }
        };
    }

    /**
     * @description Select change of role mngt
     */
     private SelectChange = (selectedRowKeys: React.Key[], selectedRows: object[]): void => {
        this.setState({
            selectedTowerKeys: selectedRowKeys,
            selectedTower: selectedRows as ITowerShape[]
        });
    }
    
    /**
     * @implements
     * @description Determines whether new click on
     * @param event 
     */
    public onNewClick(event: React.MouseEvent<HTMLButtonElement>): void {
        this.props.history.push('/product/towershape/new');
    }

    protected renderExtraOperationContent(item: ITabItem): React.ReactNode {
        return (
            <Space direction="horizontal" size="small">
                <Button type="primary">导入</Button>
                <ImportTemplateModal/>
                <Button type="ghost">导出</Button>
                <Button type="ghost" onClick={ this.onNewClick }>新增</Button>
            </Space>
        );
    }

    /**
     * @description Determines whether delete on
     * @param item 
     * @returns delete 
     */
    private onDelete(items: ITowerShape[]): () => void {
        return async () => {
            await RequestUtil.delete(`/tower-data-archive/productCategory/${items.map<number>((item: ITowerShape): number => item?.id as number) }`);
            this.setState({
                selectedTower: [],
                selectedTowerKeys: []
            }, () => {
                this.fetchTableData({
                    internalNumber: this.state.internalNumber,
                    projectName: this.state.projectName,
                    steelProductShape: this.state.steelProductShape,
                    productCategoryName: this.state.productCategoryName,
                });
            });
        };
    }
 
     /**
      * @implements
      * @description Renders filter components
      * @param item 
      * @returns filter components 
      */
    public getFilterFormItemProps(): FormItemProps[] {
        return [{
            name: 'internalNumber',
            children: <Input placeholder="内部合同编号关键字" maxLength={ 200 }/>
        },
        {
            name: 'projectName',
            children: <Input placeholder="工程名称关键字" maxLength={ 200 }/>
        },
        {
            name: 'productCategoryName',
            children: <Input placeholder="塔型关键字" maxLength={ 200 }/>
        },
        {
            name: 'steelProductShape',
            children: <Input placeholder="钢印号关键字" maxLength={ 200 }/>
        }];
    }
 }
 
export default withRouter(withTranslation(['translation'])(TowerShapeMngt));
