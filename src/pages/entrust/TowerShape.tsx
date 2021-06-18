import { Button, Col, FormItemProps, Input, Modal, Row, TableColumnType, TablePaginationConfig } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../components/AbstractMngtComponent';
import { ITabItem } from '../../components/ITabableComponent';
import RequestUtil from '../../utils/RequestUtil';

export interface ITowerShapeProps {}
export interface ITowerShapeWithRouteProps extends RouteComponentProps<ITowerShapeProps>, WithTranslation {}
export interface ITowerShapeState extends IAbstractMngtComponentState {
    readonly tableDataSource: ITableDataItem[];
    readonly isVisible?: boolean;
    readonly attachData?: IAttachData[];
}

interface ITableDataItem {

}

export interface IAttachData {
    readonly id?: string;
    readonly name?: string;
    readonly fileUploadTime?: string;
    readonly filePath?: string;
}

interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: ITableDataItem[];
}

 /**
  * 已完成塔型
  */
class TowerShape extends AbstractMngtComponent<ITowerShapeWithRouteProps, ITowerShapeState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): ITowerShapeState {
        return {
            ...super.getState(),
            tableDataSource: [],
            isVisible: false
        };
    }
    
    /**
     * @description Fetchs table data
     * @param filterValues 
     */
     protected async fetchTableData(filterValues: Record<string, any>,pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/towerModel', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize ||this.state.tablePagination?.pageSize,
            countryCode: this.state.selectedTabKey
        });
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
     * @description 弹窗关闭
     */
    public onModalClose = (): void => {
        this.setState({
            isVisible: false
        })
    }
    
    /**
     * @description 查看
     */
    public showTowerModal = async (record: Record<string, any>): Promise<void> => {
        const attachList: IAttachData[] = await RequestUtil.get<IAttachData[]>(`/towerModel/${ record.id }`);
        this.setState({
            isVisible: true,
            attachData: attachList
        })
    }

    public uploadAttach = (value: Record<string, any>): void => {
        window.open(value.filePath);
    }

    /**
     * @description 文件弹窗
     */
    public render() {
        return <>
            { super.render() }
            <Modal title="交付文件" visible={ this.state.isVisible } onCancel={ this.onModalClose } footer={ null } width={ "50%" }>
                { this.state.attachData && this.state.attachData.map<React.ReactNode>((items: IAttachData): React.ReactNode => {
                        return <Row justify="center" gutter={16}>
                            <Col span={6}>{ items.name }</Col>
                            <Col span={6}>{ items.fileUploadTime }</Col>
                            <Col span={6}>
                                <Button type="link" onClick={ () => this.uploadAttach(items) }>
                                    下载
                                </Button>
                            </Col>
                        </Row>
                    })
                }
            </Modal>
        </>
    }

     /**
      * @implements
      * @description Gets table data source
      * @param item 
      * @returns table data source 
    */
    public getTableDataSource(): object[] {
        return this.state.tableDataSource;
    }

     /**
      * @implements
      * @description Gets table columns
      * @param item 
      * @returns table columns 
      */
    public getTableColumns(): TableColumnType<object>[] {
        return [{
            key: 'towerName',
            title: '塔型名称',
            dataIndex: 'towerName'
        }, {
            key: 'projectNum',
            title: '所属工程编号',
            dataIndex: 'projectNum'
        }, {
            key: 'projectName',
            title: '所属项目名称',
            dataIndex: 'projectName'
        }, {
            key: 'examineNum',
            title: '审核件数',
            dataIndex: 'examineNum'
        }, {
            key: 'examineName',
            title: '审核人',
            dataIndex: 'examineName'
        }, {
            key: 'deliverTime',
            title: '交付日期',
            dataIndex: 'deliverTime'
        },  {
            key: 'passedTime',
            title: '验收通过日期',
            dataIndex: 'passedTime'
        }, {
            key: 'operation',
            title: '交付文件',
            dataIndex: 'operation',
            render: (_: undefined, record: IAttachData): React.ReactNode => (
                <>
                    <Button type="link" onClick={ () => this.showTowerModal(record) }>
                        查看
                    </Button>
                </>
            )
        }];
    }

     /**
     * @implements
     * @description Determines whether table change on
     * @param pagination 
     */
    public onTableChange(pagination: TablePaginationConfig): void {
        this.fetchTableData({}, pagination);
    }

    /**
     * @implements
     * @description Determines whether filter submit on
     * @param values 
     */
     public async onFilterSubmit(values: Record<string, any>) {
         console.log(values)
        this.fetchTableData(values);
    }

    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [{
            label: '已完成塔型列表',
            key: ""
        }];
    }

    /**
     * @implements
     * @description Determines whether tab change on
     * @param activeKey 
     */
    public onTabChange(activeKey: string): void {}

    /**
     * @implements
     * @description 不显示新增按钮
     * @param event 
     */
    public renderExtraOperationContent(): React.ReactNode {
        return null;
    }

    /**
     * @implements
     * @description Determines whether new click on
     * @param event 
     */
    public onNewClick(event: React.MouseEvent<HTMLButtonElement>): void {}

    public getFilterFormItemProps(): FormItemProps[] {
        return [{
            name: 'internalNumber',
            label: '塔型名称',
            children: <Input placeholder="请输入塔型名称"/>
        },
        {
            name: 'projectName',
            label: '工程名称',
            children: <Input placeholder="工程名称/工程编号关键词"/>
        }];
    }
}
 
export default withRouter(withTranslation(['translation'])(TowerShape));
