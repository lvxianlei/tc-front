import { Button, Col, FormItemProps, Input, Modal, Row, TableColumnType, TablePaginationConfig } from 'antd';
import { stringify } from 'query-string';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../components/AbstractMngtComponent';
import { ITabItem } from '../../components/ITabableComponent';
import AuthUtil from '../../utils/AuthUtil';
import RequestUtil from '../../utils/RequestUtil';
import { IAttachVo, IDeliveryFiles, IDetailData } from './DeliveryAcceptance';
import styles from './AbstractEntrustSetting.module.less';

export interface ITowerShapeProps {}
export interface ITowerShapeWithRouteProps extends RouteComponentProps<ITowerShapeProps>, WithTranslation {}
export interface ITowerShapeState extends IAbstractMngtComponentState {
    readonly tableDataSource: ITableDataItem[];
    readonly isVisible?: boolean;
    readonly deliveryFiles?: IDeliveryFiles;
    readonly productCategoryName?: string;
    readonly projectName?: string;
    readonly detailData?: IDetailData
    readonly productCategoryId?: string;
}

interface ITableDataItem {

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
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tp-task-dispatch/productCategory/complete', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize ||this.state.tablePagination?.pageSize,
            countryCode: this.state.selectedTabKey
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
        const [deliveryFiles, detailData] = await Promise.all<IDeliveryFiles, IDetailData>([
            RequestUtil.get(`/tp-task-dispatch/productCategory/getDeliveryFiles/${ record.productCategoryId }`),
            RequestUtil.get<IDetailData>(`/tower-data-archive/productCategory/${ record.productCategoryId }`)
        ]);
        this.setState({
            isVisible: true,
            deliveryFiles: deliveryFiles,
            detailData: detailData,
            productCategoryId: record.productCategoryId
        })
    }
    
    public uploadAttach = (value: string): void => {
        window.open(value);
    }

    public download = async (code: number): Promise<void> => {
        return fetch(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${`/tower-data-archive/componentDetail/downloadCompAttach`.replace(/^\/*/, '')}`, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
              'Tenant-Id': AuthUtil.getTenantId(),
              'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
            },
            body: stringify({ productCategoryId: this.state.productCategoryId,
                fileType: code })
        }).then((res) => {
            return res.blob();
        }).then((data) => {
            let blob = new Blob([data], {type: 'application/zip'})
            let blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = code === 2 ? '工艺卡' : code === 3 ? '大样图' :  code === 6 ? '角钢nc数据' : '钢板nc数据' ;
            a.href = blobUrl;
            a.click();
            if(document.body.contains(a)) {
                document.body.removeChild(a);
            }
        })
    }

    public downloadTMA = async (): Promise<void> => {
        return fetch(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${`/tower-vcs/fileVersion/downloadCompFile`.replace(/^\/*/, '')}`, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
              'Tenant-Id': AuthUtil.getTenantId(),
              'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
            },
            body: stringify({ productCategoryId: this.state.productCategoryId })
        }).then((res) => {
            return res.blob();
        }).then((data) => {
            let blob = new Blob([data], {type: 'application/zip'})
            let blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = 'TMA文件' ;
            a.href = blobUrl;
            a.click();
            if(document.body.contains(a)) {
                document.body.removeChild(a);
            }
        })
    }

    public exportBoltStatistics = async (): Promise<void> => {
        return fetch(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${`/tower-data-archive/boltStatistics/exportBoltStatistics`.replace(/^\/*/, '')}`, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
              'Tenant-Id': AuthUtil.getTenantId(),
              'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
            },
            body: stringify({ productCategoryId: this.state.productCategoryId })
        }).then((res) => {
            return res.blob();
        }).then((data) => {
            let blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = '螺栓清单';
            a.href = blobUrl;
            a.click();
            if(document.body.contains(a)) {
                document.body.removeChild(a);
            }
        })
    }

    public exportAssemblyWeld = async (): Promise<void> => {
        return fetch(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${`/tower-data-archive/assemblyWeld/exportAssemblyWeld`.replace(/^\/*/, '')}`, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
              'Tenant-Id': AuthUtil.getTenantId(),
              'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
            },
            body: stringify({ productCategoryId: this.state.productCategoryId })
        }).then((res) => {
            return res.blob();
        }).then((data) => {
            let blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = '组焊清单';
            a.href = blobUrl;
            a.click();
            if(document.body.contains(a)) {
                document.body.removeChild(a);
            }
        })
    }


    /**
     * @description 文件弹窗
     */
    public render() {
        const deliveryFiles: IDeliveryFiles | undefined = this.state.deliveryFiles;
        const deliveryList: number[] | undefined = deliveryFiles?.deliveryList;
        return <>
            { super.render() }
            <Modal title="交付文件" visible={ this.state.isVisible } onCancel={ this.onModalClose } footer={ null } width={ "50%" }>
                <div className={ styles.files }>
                    <Row>
                    { deliveryList?.includes(1) ?
                        <Col span={ 8 }>
                            <span key="1">
                                <Button type="link" onClick={ () => this.downloadTMA() }>TMA文件</Button>
                            </span>
                        </Col>
                        : null
                    }
                    { deliveryList?.includes(2) ?
                        <Col span={ 8 }>
                            <span key="2">
                                <Button type="link" onClick={ () => this.download(2) }>工艺卡</Button>
                            </span>
                        </Col>
                        : null
                    }
                    { deliveryList?.includes(3) ? 
                        <Col span={ 8 }>
                            <span key="3">
                                <Button type="link" onClick={ () => this.download(3) }>大样图</Button>
                            </span>
                        </Col>
                        : null
                    }
                    { deliveryList?.includes(4) ?
                        <Col span={ 8 }>
                            <span key="4">
                                构建明细
                            </span>
                        </Col>
                        : null
                    }
                    { deliveryList?.includes(5) ? 
                        <Col span={ 8 }>
                            <span key="5">
                                <Button type="link" onClick={ () => this.exportBoltStatistics() }>螺栓清单</Button>
                            </span>
                        </Col>
                        : null
                    }
                    { deliveryList?.includes(6) ? 
                        <Col span={ 8 }>
                            <span key="6">
                                <Button type="link" onClick={ () => this.download(6) }>角钢NC数据</Button>  
                            </span>
                        </Col>
                        : null
                    }   
                    { deliveryList?.includes(7) ?
                        <Col span={ 8 }>
                            <span key="7">
                                <Button type="link" onClick={ () => this.download(7) }>钢板NC数据</Button>  
                            </span>
                        </Col>
                        : null
                    }
                    { deliveryList?.includes(8) ?
                        <Col span={ 8 }>
                            <span key="8">
                                <Button type="link" onClick={ () => this.exportAssemblyWeld() }>组焊清单</Button>
                            </span>
                        </Col>
                        : null
                    }
                    { deliveryList?.includes(9) ?
                        <Col span={ 8 }>
                            <span key="9">
                                <Button type="link" onClick={ () => this.uploadAttach(this.state.detailData?.buildChart || '') }>结构图</Button>
                            </span>
                        </Col>
                        : null
                    }
                    </Row>
                </div>
                { deliveryList?.includes(10) ?
                    <div>
                        <p>其他文件</p>
                        <div className={ styles.content }> 
                            { this.state.deliveryFiles?.attachList?.map<React.ReactNode>((items: IAttachVo, index: number): React.ReactNode => {
                                return <Row justify="center" gutter={16} className={ styles.row } key={ index }>
                                    <Col span={6} className={ styles.col }>{ items.name }</Col>
                                    <Col span={6} className={ styles.col }>{ items.fileUploadTime }</Col>
                                    <Col span={6}>
                                    <Button type="link" onClick={ () => this.uploadAttach(items.filePath || '') } danger>
                                        下载
                                    </Button>
                                    </Col>
                                </Row>
                            }) }
                        </div>
                    </div>
                    : null
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
            key: 'productCategoryName',
            title: '塔型名称',
            dataIndex: 'productCategoryName'
        }, {
            key: 'programCode',
            title: '所属工程编号',
            dataIndex: 'programCode'
        }, {
            key: 'programName',
            title: '所属项目名称',
            dataIndex: 'programName'
        }, {
            key: 'approveNum',
            title: '审核件数',
            dataIndex: 'approveNum'
        }, {
            key: 'productCategoryReviewerName',
            title: '审核人',
            dataIndex: 'productCategoryReviewerName'
        }, {
            key: 'giveTime',
            title: '交付日期',
            dataIndex: 'giveTime'
        },  {
            key: 'receptionTime',
            title: '验收通过日期',
            dataIndex: 'receptionTime'
        }, {
            key: 'operation',
            title: '交付文件',
            dataIndex: 'operation',
            render: (_: undefined, record: IDeliveryFiles): React.ReactNode => (
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
        this.fetchTableData({
            projectName: this.state.projectName,
            productCategoryName: this.state.productCategoryName
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
        console.log(values)
        this.fetchTableData(values, tablePagination);
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
            name: 'productCategoryName',
            label: '塔型名称',
            children: <Input placeholder="请输入塔型名称" maxLength={ 200 }/>
        },
        {
            name: 'projectName',
            label: '工程名称',
            children: <Input placeholder="工程名称/工程编号关键词" maxLength={ 200 }/>
        }];
    }
}
 
export default withRouter(withTranslation(['translation'])(TowerShape));
