import { Button, Form, FormItemProps, Input, Modal, Popconfirm, Select, Space, Table, TableColumnType, TablePaginationConfig } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import styles from '../../../components/AbstractSelectableModal.module.less';
import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import { ITabItem } from '../../../components/ITabableComponent';
import { materialStandardOptions } from '../../../configuration/DictionaryOptions';
import { IMaterialExtraction, IParagraph, IDetail } from './IMaterialExtraction'
import RequestUtil from '../../../utils/RequestUtil';

const { Option } = Select;

export interface ImaterialExtractionMngtProps {}
export interface ImaterialExtractionMngtWithRouteProps extends RouteComponentProps<ImaterialExtractionMngtProps>, WithTranslation {}
export interface ImaterialExtractionMngtState extends IAbstractMngtComponentState {
    readonly tableDataSource: IMaterialExtraction[];
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly customerCompany?: string;
    readonly signCustomerName?: string;
    readonly winBidType?: string;
    readonly paragraphVisible: boolean;
    readonly paragraphDataSource: IParagraph[];
    readonly detailVisible: boolean;
    readonly detailDataSource: IDetail[];
}

export interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: IMaterialExtraction[];
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
            paragraphDataSource: [],
            detailVisible: false,
            detailDataSource: []
        };
    }
 
    /**
     * @description Fetchs table data
     * @param filterValues 
     */
    protected async fetchTableData(filterValues: Record<string, any>,pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/extractionMaterial',  {
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
            key: 'batchSn',
            title: '批次号',
            dataIndex: 'batchSn',
        }, {
            key: 'materialStandardName',
            title: '材料标准',
            dataIndex: 'materialStandardName',
        }, {
            key: 'productCategoryName',
            title: '塔型',
            dataIndex: 'productCategoryName',
        }, {
            key: 'embossedStamp',
            title: '钢印塔型',
            dataIndex: 'embossedStamp',
        }, {
            key: 'projectName',
            title: '工程名称',
            dataIndex: 'projectName',
        }, {
            key: 'createUser',
            title: '创建人',
            dataIndex: 'createUser',
        },  {
            key: 'createTime',
            title: '创建时间',
            dataIndex: 'createTime',
        },  {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
        },  {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link"  onClick={()=>this.paragraphShow((record as IMaterialExtraction).id)}>
                        提料段落
                    </Button>
                    <Button type="link"  onClick={()=>this.detailShow((record as IMaterialExtraction).id)}>
                        构件明细
                    </Button>
                </Space>
            )
        }];
    }

    //paragraphModalShow
    protected paragraphShow = async(id: string | number)=>{
        const resData: IParagraph[] = await RequestUtil.get<IParagraph[]>(`/tower-market/extractionMaterial/getExtractionMaterialSection?extractionMaterialId=${id}`);
        this.setState({
            paragraphVisible: true,
            paragraphDataSource: resData || []
        })
    }
    protected onModalParagraphClose=()=>{
        this.setState({
            paragraphVisible: false
        })
    }
    //detailModalShow
    protected detailShow = async(id: string | number)=>{
        const resData: IDetail[] = await RequestUtil.get<IDetail[]>(`/tower-market/extractionMaterial/getExtractionMaterialComponent?extractionMaterialId=${id}`);
        this.setState({
            detailVisible: true,
            detailDataSource: resData || []
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
            name: 'batchSn',
            children: <Input placeholder="批次号关键字" maxLength={ 200 } autoComplete="off"/>
        },
        {
            name: 'materialStandard',
            children: 
                <Select placeholder="全部材料标准" className={ styles.select_width } getPopupContainer={ triggerNode => triggerNode.parentNode }>
                    { materialStandardOptions && materialStandardOptions.map(({ id, name }, index) => {
                        return <Option key={ index } value={ id }>
                            { name }
                        </Option>
                    }) }
                </Select>
            
        },
        {
            name: 'productShape',
            children: <Input placeholder="塔型关键字" maxLength={ 200 } autoComplete="off"/>
        },
        {
            name: 'embossedStamp',
            children: <Input placeholder="钢印塔型关键字" maxLength={ 200 } autoComplete="off"/>
        },
        {
            name: 'projectName',
            children: <Input placeholder="工程名称关键字" maxLength={ 200 } autoComplete="off"/>
            
        }];
    }
    public getComponentColumns(): TableColumnType<object>[] {
        return [{
           key: 'partNum',
           title: '段号',
           dataIndex: 'partNum',
           align: "center",
           width: 50,
        },{
           key: 'componentCode',
           title: '构件编号',
           dataIndex: 'componentCode',
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
           key: 'width',
           title: '宽度（mm）',
           dataIndex: 'width',
           align: "center",
           width: 200,
        },{
           key: 'thickness',
           title: '厚度（mm）',
           dataIndex: 'thickness',
           align: "center",
           width: 200,
        },{
           key: 'length',
           title: '长度（mm）',
           dataIndex: 'length',
           align: "center",
           width: 200,
        },{
           key: 'number',
           title: '单段数量',
           dataIndex: 'number',
           align: "center",
           width: 200,
        },{
            key: 'totalQuantity',
            title: '合计数量',
            dataIndex: 'totalQuantity',
            align: "center",
            width: 200,
        },{
            key: 'accurateWeight',
            title: '理算重量（kg）',
            dataIndex: 'accurateWeight',
            align: "center",
            width: 200,
        },{
            key: 'singleWeight',
            title: '单件重量（kg）',
            dataIndex: 'singleWeight',
            align: "center",
            width: 200,
        },{
            key: 'subtotalWeight',
            title: '单段小计重量（kg）',
            dataIndex: 'subtotalWeight',
            align: "center",
            width: 200,
        },{
            key: 'totalWeight',
            title: '合计重量（kg）',
            dataIndex: 'totalWeight',
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
           key: 'sectionSn',
           title: '段号',
           dataIndex: 'sectionSn',
           align: "center",
        },{
           key: 'sectionCount',
           title: '本次提料段数',
           dataIndex: 'sectionCount',
           align: "center",
        },{
           key: 'sectionTotalCount',
           title: '已提料段数',
           dataIndex: 'sectionTotalCount',
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
                <Table columns={this.getSegmentColumns()} dataSource={ this.state.paragraphDataSource }/>
            </Modal>
            <Modal title="提料构件明细" visible={ this.state.detailVisible } onCancel={ this.onModalDetailClose } footer={ null }  width={1300}>
                <Table columns={this.getComponentColumns()} scroll={{ x:1200 }} dataSource={ this.state.detailDataSource }/>
            </Modal>
        </>

        );
    }
 }
 
 
export default withRouter(withTranslation(['translation'])(materialExtractionMngt));
