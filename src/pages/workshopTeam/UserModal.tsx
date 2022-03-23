/**
 * @author lxy
 * @copyright © 2021
 */
 import React from 'react';
 import { Button, FormItemProps, Input, Modal, Space, TreeSelect } from 'antd';
 import { ColumnType, TablePaginationConfig, TableProps } from 'antd/lib/table';
 import { GetRowKey } from 'rc-table/lib/interface';
 import RequestUtil from '../../utils/RequestUtil';
 import { DataType, IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from '../../components/AbstractSelectableModal';
 import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
 import AbstractFilteredSelecableModal from '../../components/AbstractFilteredSelecableModal';
 import { ButtonType } from 'antd/lib/button';
 import { RowSelectionType } from 'antd/lib/table/interface';
import { TreeNode } from 'antd/lib/tree-select';
 
 export interface IWorkshopUserSelectionComponentState extends IAbstractSelectableModalState {
     readonly tableDataSource: any[];
     departmentData?: any[];
 }
 export interface IWorkshopUserSelectionComponentProps extends IAbstractSelectableModalProps {
     readonly saleOrderId?: string | number;
     readonly buttonType?: ButtonType;
     readonly buttonTitle?: string;
     readonly rowSelectionType?: RowSelectionType | undefined;
 }
 
 export interface IResponseDataMore extends IResponseData {
     readonly any: [];
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
 export default class WorkshopUserSelectionComponent extends AbstractFilteredSelecableModal<IWorkshopUserSelectionComponentProps, IWorkshopUserSelectionComponentState> {
 
     /**
      * @override
      * @description Gets state
      * @returns state 
      */
     protected getState():IWorkshopUserSelectionComponentState {
         return {
             ...super.getState(),
             tablePagination: {
                 current: 1,
                 pageSize: 10,
                 total: 0,
                 showSizeChanger: false
             },
             departmentData: [],
             confirmTitle: "选择人员",
             selectedRows: [],
             selectedRowKeys: []
         };
     }
 
     public getTableProps(): TableProps<object> {
         return {
            rowKey: this.getTableRowKey(),
            bordered: true,
            dataSource: this.getTableDataSource(),
            columns: this.getTableColumns(),
            size: "small",
            rowSelection: {
                type: this.props.rowSelectionType || 'radio',
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.onSelectChange
            },

         }
     }
 
     public onSelectChange = (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
         this.setState({
             selectedRowKeys,
             selectedRows
         });
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
         this.getForm()?.resetFields();
     };
 
     //componentDidMount
     public componentDidMount(): void {
         
     }
 
     //接口、获值
     public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
         let resData: IResponseData = await RequestUtil.get<IResponseData>(`/tower-system/employee`, {
            //  teamId: this.props.saleOrderId,
             ...filterValues,
             current: pagination.current || this.state.tablePagination?.current,
             size: pagination.pageSize || this.state.tablePagination?.pageSize
         });
        //  const selectKeys: [] = this.props.selectKey;
         let newData: any = resData?.records&&resData?.records.length>0?resData?.records:[];
        //  selectKeys?.forEach((item: any) => {
        //      newData = newData.filter((res:any) => res.userId !== item.userId);
        //  })
         this.setState({
             ...filterValues,
             tableDataSource: newData||[{}],
             selectedRowKeys: this.props.selectKey||[],
             tablePagination: {
                 ...this.state.tablePagination,
                 current: resData.current,
                 pageSize: resData.size,
                 total: resData.total
             }
         });
     }
     public renderTreeNodes = (data:any) =>
     data.map((item:any) => {
     if (item.children) {
         return (
         <TreeNode key={item.id} title={item.name} value={item.id}>
             {this.renderTreeNodes(item.children)}
         </TreeNode>
         );
     }
     return <TreeNode {...item} key={item.id} title={item.name} value={item.id} />;
     });
     public wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                this.wrapRole2DataNode(role.children);
            } else {
                role.children = []
            }
        });
        return roles;
    }
     //查询字段
     public getFilterFormItemProps(): FormItemProps[] {
         return [{
             name: 'fuzzyQuery',
             children: <Input placeholder="请输入姓名进行查询" />
         }, {
            name: 'dept',
            children: <TreeSelect style={{width:'150px'}} placeholder="请输入所属部门查询">
                {this.renderTreeNodes(this.wrapRole2DataNode( this.state.departmentData ))}
            </TreeSelect>
         },]
     }
 
     //查询
     public onFilterSubmit = async (values: Record<string, any>) => {
         console.log(values)
         this.getTable(values, {
             current: 1,
             pageSize: 10,
             total: 0,
             showSizeChanger: false
         });
     }
     //dataSource
     public getTableDataSource(): object[] {
         return this.state.tableDataSource||[];
     }
 
     //table-column
     public getTableColumns(): ColumnType<object>[] {
         return [
         // {
         //     key: 'type',
         //     title: '员工编号',
         //     width: '15%',
         //     dataIndex: 'type',
         // }, 
         {
             key: 'name',
             title: '姓名',
             dataIndex: 'name'
         }, {
             key: 'deptName',
             title: '所属部门',
             dataIndex: 'deptName'
         },
         //  {
         //     key: 'stationName',
         //     title: '岗位',
         //     width: '15%',
         //     dataIndex: 'stationName'
         // }, {
         //     key: 'stationStatus',
         //     title: '在职状态',
         //     width: '15%',
         //     dataIndex: 'stationStatus',
         //     render: (stationStatus: number): React.ReactNode => {
         //         switch (stationStatus) {
         //             case 0:
         //                 return '不在职';
         //             case 1:
         //                 return '在职';
         //         }
         //     }  
         // }, 
         // {
         //     key: 'phone',
         //     title: '联系电话',
         //     width: '50%',
         //     dataIndex: 'phone'
         // }
         ];
     }
 
     //row-key
     protected getTableRowKey(): string | GetRowKey<object> {
         return 'userId';
     }
 
     public render(): React.ReactNode {
         return (
             <>
                 <Button type={this.props.buttonType || 'primary'} style={this.props.buttonType==='link'?{ paddingBottom: '0', paddingTop: '0', height: 'auto', lineHeight: 1 }:{}} onClick={async ()=>{
                     this.getTable({})
                     const departmentData: any = await RequestUtil.get(`/tower-system/department`);
                     this.setState({
                         isModalVisible: true,
                         departmentData
                     })
                 }}>{this.props.buttonTitle || '添加人员'}</Button>
                 <Modal
                     title={this.state.confirmTitle}
                     visible={this.state.isModalVisible}
                     okText={this.state.okText}
                     cancelText={this.state.cancelText}
                     onOk={
                         () => {
                             this.setState({
                                 isModalVisible: false,
                             })
                             if (this.state.tableDataSource.length > 0) {
                                
                                 this.getForm()?.resetFields();
                                 this.props.onSelect(this.state.selectedRows)
                                 this.setState({
                                     selectedRowKeys: [],
                                     selectedRows:[],
                                 })
                             }
                         }
                     }
                     onCancel={this.handleCancel}
                     width="33%"
                 >
                     <Space direction="vertical" >
                         {this.renderTableContent()}
                     </Space>
                 </Modal>
             </>
         );
     }
 }