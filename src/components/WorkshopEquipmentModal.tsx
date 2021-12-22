/**
 * @author lxy
 * @copyright © 2021
 */
 import React from 'react';
 import { Button, FormItemProps, Input, Modal, Space } from 'antd';
 import { ColumnType, TablePaginationConfig, TableProps } from 'antd/lib/table';
 import { GetRowKey } from 'rc-table/lib/interface';
 import RequestUtil from '../utils/RequestUtil';
 import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';
 import styles from './AbstractSelectableModal.module.less';
 import AbstractFilteredSelecableModal from './AbstractFilteredSelecableModal';
 import { ButtonType } from 'antd/lib/button';
 import { RowSelectionType } from 'antd/lib/table/interface';
 
 export interface IWorkshopEquipmentSelectionComponentState extends IAbstractSelectableModalState {
     readonly tableDataSource: IUser[];
 }
 export interface IWorkshopEquipmentSelectionComponentProps extends IAbstractSelectableModalProps {
     readonly saleOrderId?: string | number;
     readonly buttonType?: ButtonType;
     readonly buttonTitle?: string;
     readonly disabled?: boolean;
     readonly rowSelectionType?: RowSelectionType | undefined;
 }
 
 export interface IResponseDataMore extends IResponseData {
     readonly IUser: [];
 }
 
 export interface IUser {
     readonly id: string;
     readonly account: string;
     readonly clientId: string;
     readonly createTime: string;
     readonly createUser: string;
     readonly departmentId: string;
     readonly departmentName: string;
     readonly email: string;
     readonly name: string;
     readonly openId: string;
     readonly phone: string;
     readonly tenantId: string;
     readonly tenantName: string;
     readonly userRoleNames: string;
     readonly stationName: string;
     readonly stationStatus: string;
     readonly userRoleList: string;
 }
 
 /**
  * Workshop User Selection Component
  */
 export default class WorkshopEquipmentSelectionComponent extends AbstractFilteredSelecableModal<IWorkshopEquipmentSelectionComponentProps, IWorkshopEquipmentSelectionComponentState> {
 
     /**
      * @override
      * @description Gets state
      * @returns state 
      */
     protected getState(): IWorkshopEquipmentSelectionComponentState {
         return {
             ...super.getState(),
             tablePagination: {
                 current: 1,
                 pageSize: 10,
                 total: 0,
                 showSizeChanger: false
             },
             confirmTitle: "选择工作中心"
         };
     }
 
     public getTableProps() {
         return {
             ...super.getTableProps(),
             rowSelection: {
                 type: this.props.rowSelectionType || 'radio',
                 selectedRowKeys: this.state.selectedRowKeys,
                 onChange: this.onSelectChange
             }
         }
     }
 
     /**
      * @description 取消操作 
      * @param event 
      */
      public handleCancel = (): void => {
         this.setState({
             isModalVisible: false,
             selectedRowKeys: []
         })
     };
 
     //componentDidMount
     public componentDidMount(): void {
         this.getTable({})
     }
 
     //接口、获值
     public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
         let resData: IResponseData = await RequestUtil.get<IResponseData>(`/sinzetech-user/user`, {
             ...filterValues,
             current: pagination.current || this.state.tablePagination?.current,
             size: pagination.pageSize || this.state.tablePagination?.pageSize
         });
         const selectKeys: [] = this.props.selectKey;
         let newData: IUser[] = resData.records;
         selectKeys?.forEach((item: IUser) => {
             newData = newData.filter(res => res.id !== item.id);
         })
         this.setState({
             ...filterValues,
             tableDataSource: newData,
             tablePagination: {
                 ...this.state.tablePagination,
                 current: resData.current,
                 pageSize: resData.size,
                 total: resData.total
             },
         });
     }
 
     //查询字段
     public getFilterFormItemProps(): FormItemProps[] {
         return [{
             name: 'name',
             children: <Input placeholder="请输入派工设备名称/车间名称/产线进行查询" />
         }, ]
     }
 
     //查询
     public onFilterSubmit = async (values: Record<string, any>) => {
         this.getTable(values);
     }
     //dataSource
     public getTableDataSource(): object[] {
         return this.state.tableDataSource;
     }
 
     //table-column
     public getTableColumns(): ColumnType<object>[] {
         return [{
             key: 'type',
             title: '班组名称',
             width: '50%',
             dataIndex: 'type',
         }, {
             key: 'name',
             title: '生产单元',
             width: '50%',
             dataIndex: 'name'
         }];
     }
 
     //row-key
     protected getTableRowKey(): string | GetRowKey<object> {
         return 'id';
     }
 
     public showModal = (): void => {
         if (this.props.saleOrderId) {
             this.setState({
                 isModalVisible: true
             })
             this.getTable({})
         }
 
     }
 
     public render(): React.ReactNode {
         return (
             <>
                 <Button type={this.props.buttonType || 'primary'} style={this.props.buttonType==='link'?{ paddingBottom: '0', paddingTop: '0', height: 'auto', lineHeight: 1 }:{}} onClick={()=>{
                     this.setState({
                         isModalVisible: true
                     })
                 }} disabled={this.props.disabled}>{this.props.buttonTitle || '选择设备'}</Button>
                 <Modal
                     title={this.state.confirmTitle}
                     visible={this.state.isModalVisible}
                     okText={this.state.okText}
                     cancelText={this.state.cancelText}
                     onOk={
                         () => {
                             this.setState({
                                 isModalVisible: false
                             })
                             if (this.state.tableDataSource.length > 0) {
                                 this.setState({
                                     selectedRowKeys: []
                                 })
                                 this.props.onSelect(this.state.selectedRows)
                             }
                         }
                     }
                     onCancel={this.handleCancel}
                     width="80%"
                 >
                     <Space direction="vertical" className={styles.modalTable}>
                         {this.renderTableContent()}
                     </Space>
                 </Modal>
             </>
         );
     }
 }