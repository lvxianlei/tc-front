import { Button, Form, FormItemProps, Input, Modal, Popconfirm, Select, Space, Table, TableColumnType, TablePaginationConfig } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import styles from '../../../components/AbstractSelectableModal.module.less';
import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import { ITabItem } from '../../../components/ITabableComponent';
import { saleTypeOptions, winBidTypeOptions } from '../../../configuration/DictionaryOptions';
import { IContract } from '../../IContract';
import RequestUtil from '../../../utils/RequestUtil';

const { Option } = Select;

export interface ImaterialExtractionMngtProps {}
export interface ImaterialExtractionMngtWithRouteProps extends RouteComponentProps<ImaterialExtractionMngtProps>, WithTranslation {}
export interface ImaterialExtractionMngtState extends IAbstractMngtComponentState {
    readonly tableDataSource: IContract[];
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly customerCompany?: string;
    readonly signCustomerName?: string;
    readonly winBidType?: string;
    readonly paragraphVisible: boolean;
    readonly detailVisible: boolean;
}

export interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: IContract[];
}

 /**
  * 提料管理
  */
class materialExtractionMngt extends AbstractMngtComponent<ImaterialExtractionMngtWithRouteProps, ImaterialExtractionMngtState> {
    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): ImaterialExtractionMngtState {
        return {
            ...super.getState(),
            tableDataSource: [],
            paragraphVisible: false,
            detailVisible: false,
        };
    }
 
    /**
     * @description Fetchs table data
     * @param filterValues 
     */
    protected async fetchTableData(filterValues: Record<string, any>,pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/contract', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize ||this.state.tablePagination?.pageSize,
            saleType: this.state.selectedTabKey === 'item_0' ? '' : this.state.selectedTabKey
        });
        if(resData?.records?.length == 0 && resData?.current>1){
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

     /**
      * @implements
      * @description Gets table columns
      * @param item 
      * @returns table columns 
      */
    public getTableColumns(item: ITabItem): TableColumnType<object>[] {
        return [{
            key: 'contractNumber',
            title: '批次号',
            dataIndex: 'contractNumber',
            render: (_: undefined, record: object): React.ReactNode => {
                return <Link to={ `/prom/contract/detail/${ (record as IContract).id }` }>{ (record as IContract).contractNumber }</Link>
            }
        }, {
            key: 'internalNumber',
            title: '材料标准',
            dataIndex: 'internalNumber',
            render: (_: undefined, record: object): React.ReactNode => {
            return <Link to={ `/prom/contract/detail/${ (record as IContract).id }` }>{ (record as IContract).internalNumber }</Link>
        }
        }, {
            key: 'projectName',
            title: '塔型',
            dataIndex: 'projectName'
        }, {
            key: 'saleTypeName',
            title: '钢印塔型',
            dataIndex: 'saleTypeName'
        }, {
            key: 'winBidTypeName',
            title: '工程名称',
            dataIndex: 'winBidTypeName',
        }, {
            key: 'productTypeName',
            title: '创建人',
            dataIndex: 'productTypeName',
        },  {
            key: 'voltageGradeName',
            title: '创建时间',
            dataIndex: 'voltageGradeName',
        },  {
            key: 'customerCompany',
            title: '备注',
            dataIndex: 'customerCompany'
        },  {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link"  onClick={this.paragraphShow}>
                        提料段落
                    </Button>
                    <Button type="link"  onClick={this.detailShow}>
                        构件明细
                    </Button>
                </Space>
            )
        }];
    }

    //paragraphModalShow
    protected paragraphShow=()=>{
        this.setState({
            paragraphVisible: true
        })
    }
    protected onModalParagraphClose=()=>{
        this.setState({
            paragraphVisible: false
        })
    }
    //detailModalShow
    protected detailShow=()=>{
        this.setState({
            detailVisible: true
        })
    }
    protected onModalDetailClose=()=>{
        this.setState({
            detailVisible: false
        })
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
            customerCompany: this.state.customerCompany,
            signCustomerName: this.state.signCustomerName,
            winBidType: this.state.winBidType
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
            label: '提料列表',
            key: ''
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
     * @implements
     * @description Determines whether new click on
     * @param event 
     */
    public onNewClick(event: React.MouseEvent<HTMLButtonElement>): void {
        this.props.history.push('/technology/materialExtraction/new');
    }
 
     /**
      * @implements
      * @description Renders filter components
      * @param item 
      * @returns filter components 
      */
    public getFilterFormItemProps(item: ITabItem): FormItemProps[] {
        return [{
            name: 'internalNumber',
            children: <Input placeholder="批次号关键字" maxLength={ 200 } autoComplete="off"/>
        },
        {
            name: 'projectName',
            children: <Input placeholder="全部材料标准" maxLength={ 200 } autoComplete="off"/>
        },
        {
            name: 'customerCompany',
            children: <Input placeholder="塔型关键字" maxLength={ 200 } autoComplete="off"/>
        },
        {
            name: 'signCustomerName',
            children: <Input placeholder="钢印塔型关键字" maxLength={ 200 } autoComplete="off"/>
        },
        {
            name: 'winBidType',
            children: 
                <Select placeholder="工程名称关键字" className={ styles.select_width } getPopupContainer={ triggerNode => triggerNode.parentNode }>
                    { winBidTypeOptions && winBidTypeOptions.map(({ id, name }, index) => {
                        return <Option key={ index } value={ id }>
                            { name }
                        </Option>
                    }) }
                </Select>
            
        }];
    }
    public getComponentColumns(): TableColumnType<object>[] {
        return [{
           key: 'materialCode',
           title: '序号',
           dataIndex: 'materialCode',
           align: "center",
           width: 50,
        },{
           key: 'productName',
           title: '构件编号',
           dataIndex: 'productName',
           align: "center",
           width: 200,
        },{
           key: 'rowMaterial',
           title: '材料',
           dataIndex: 'rowMaterial',
           align: "center",
           width: 200,
        },{
           key: 'materialTexture',
           title: '材质',
           dataIndex: 'materialTexture',
           align: "center",
           width: 200,
        },{
           key: 'spec',
           title: '规格',
           dataIndex: 'spec',
           align: "center",
           width: 200,
        },{
           key: 'unitName',
           title: '宽度（mm）',
           dataIndex: 'unitName',
           align: "center",
           width: 200,
        },{
           key: 'proportion',
           title: '厚度（mm）',
           dataIndex: 'proportion',
           align: "center",
           width: 200,
        },{
           key: 'weightAlgorithm',
           title: '长度（mm）',
           dataIndex: 'weightAlgorithm',
           align: "center",
           width: 200,
        },{
           key: 'description',
           title: '单段数量',
           dataIndex: 'description',
           align: "center",
           width: 200,
        },{
            key: 'description',
            title: '合计数量',
            dataIndex: 'description',
            align: "center",
            width: 200,
        },{
            key: 'description',
            title: '理算重量（kg）',
            dataIndex: 'description',
            align: "center",
            width: 200,
        },{
            key: 'description',
            title: '单件重量（kg）',
            dataIndex: 'description',
            align: "center",
            width: 200,
        },{
            key: 'description',
            title: '单段小计重量（kg）',
            dataIndex: 'description',
            align: "center",
            width: 200,
        },{
            key: 'description',
            title: '合计重量（kg）',
            dataIndex: 'description',
            align: "center",
            width: 200,
        },{
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            align: "center",
            width: 500,
        }]
    };


    public getSegmentColumns(): TableColumnType<object>[] {
        return [{
           key: 'materialCode',
           title: '段号',
           dataIndex: 'materialCode',
           align: "center",
        },{
           key: 'productName',
           title: '本次提料段数',
           dataIndex: 'productName',
           align: "center",
        },{
           key: 'shortcutCode',
           title: '已提料段数',
           dataIndex: 'shortcutCode',
           align: "center",
        }]
    };
    /**
     * @description Renders AbstractMngtComponent
     * @returns render 
     */
     public render(): React.ReactNode {
        return (
            <>
            { super.render() }
            <Modal title="提料段落" visible={ this.state.paragraphVisible } onCancel={ this.onModalParagraphClose } footer={ null } width={1000}>
                <Table columns={this.getSegmentColumns()} dataSource={[{},{},{}]}/>
            </Modal>
            <Modal title="提料构件明细" visible={ this.state.detailVisible } onCancel={ this.onModalDetailClose } footer={ null }  width={1300}>
                <Table columns={this.getComponentColumns()} scroll={{ x:1200 }}/>
            </Modal>
        </>

        );
    }
 }
 
 
export default withRouter(withTranslation(['translation'])(materialExtractionMngt));
