/**
 * @author lxy
 * @copyright © 2021
 */
import React from 'react';
import { Button, FormItemProps, Input, Modal, Space } from 'antd';
import { ColumnType, TablePaginationConfig, TableProps } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import styles from '../../components/AbstractSelectableModal.module.less';
import { ButtonType } from 'antd/lib/button';
import { RowSelectionType } from 'antd/lib/table/interface';
import { DataType, IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from '../../components/AbstractSelectableModal';
import AbstractFilteredSelecableModal from '../../components/AbstractFilteredSelecableModal';
import RequestUtil from '../../utils/RequestUtil';
import moment from 'moment';

export interface IEmployeeUserSelectionComponentState extends IAbstractSelectableModalState {
    readonly tableDataSource: IUser[];
}
export interface IEmployeeUserSelectionComponentProps extends IAbstractSelectableModalProps {
    readonly saleOrderId?: string | number;
    readonly buttonType?: ButtonType;
    readonly buttonTitle?: string;
    readonly rowSelectionType?: RowSelectionType | undefined;
}

export interface IResponseDataMore extends IResponseData {
    readonly IUser: [];
}

export interface IUser {
    readonly age: string;
    readonly bankCardNumber: string;
    readonly bankName: string;
    readonly companyName: string;
    readonly departmentName: string;
    readonly education: string;
    readonly emergencyContact: string;
    readonly emergencyContactPhone: string;
    readonly employeeName: string;
    readonly employeeNature: string;
    readonly gender: string;
    readonly id: string;
    readonly idNumber: string;
    readonly inductionDate: string;
    readonly national: string;
    readonly nativePlace: string;
    readonly phoneNumber: string;
    readonly positiveDate: string;
    readonly postName: string;
    readonly postTypeName: string;
    readonly status: string;
    readonly workYear: string;
    readonly birthday: string;//出生日期未知
    readonly departureDate: string
    readonly departureType: string
    readonly departureReason: string
}

/**
 * Workshop User Selection Component
 */
export default class EmployeeUserSelectionComponent extends AbstractFilteredSelecableModal<IEmployeeUserSelectionComponentProps, IEmployeeUserSelectionComponentState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IEmployeeUserSelectionComponentState {
        return {
            ...super.getState(),
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择员工",
            selectedRows: [],
            selectedRowKeys: []
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
        let resData: IResponseData = await RequestUtil.get<IResponseData>(`/tower-hr/employee/archives`, {
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
            }
        });
    }

    //查询字段
    public getFilterFormItemProps(): FormItemProps[] {
        return [{
            name: 'keyword',
            children: <Input placeholder="请输入员工姓名/电话/身份证号进行查询" />
        }, ]
    }

    //查询
    public onFilterSubmit = async (values: Record<string, any>) => {
        this.getTable(values, {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: false
        });
    }
    //dataSource
    public getTableDataSource(): object[] {
        return this.state.tableDataSource;
    }

    //table-column
    public getTableColumns(): ColumnType<object>[] {
        return [{
            key: 'employeeName',
            title: '员工姓名',
            width: '5%',
            dataIndex: 'employeeName',
        }, {
            key: 'gender',
            title: '性别',
            width: '5%',
            dataIndex: 'gender'
        }, {
            key: 'national',
            title: '民族',
            width: '5%',
            dataIndex: 'national'
        }, {
            key: 'companyName',
            title: '公司',
            width: '5%',
            dataIndex: 'companyName'
        }, {
            key: 'departmentName',
            title: '部门/班组',
            width: '5%',
            dataIndex: 'departmentName', 
        }, {
            key: 'postName',
            title: '岗位',
            width: '5%',
            dataIndex: 'postName'
        }, {
            key: 'postTypeName',
            title: '员工分组',
            width: '5%',
            dataIndex: 'postTypeName',
            // render: (stationStatus: number): React.ReactNode => {
            //     switch (stationStatus) {
            //         case 0:
            //             return '不在职';
            //         case 1:
            //             return '在职';
            //     }
            // } 
        }, {
            key: 'nativePlace',
            title: '籍贯',
            width: '5%',
            dataIndex: 'nativePlace'
        }, {
            key: 'birthday',
            title: '出生日期',
            width: '5%',
            dataIndex: 'birthday',
            render:(birthday:string)=>{
                return moment(birthday).format('YYYY-MM-DD')
            }
        }, {
            key: 'age',
            title: '年龄',
            width: '5%',
            dataIndex: 'age'
        }, {
            key: 'idNumber',
            title: '身份证号',
            width: '5%',
            dataIndex: 'idNumber'
        }, {
            key: 'education',
            title: '学历',
            width: '5%',
            dataIndex: 'education',
            render: (stationStatus: number): React.ReactNode => {
                switch (stationStatus) {
                    case 1:
                        return '博士';
                    case 2:
                        return '本科';
                    case 3:
                        return '大专';
                    case 4:
                        return '高中';
                    case 5:
                        return '中专';
                    case 6:
                        return '中学';
                    case 7:
                        return '小学';
                    case 8:
                        return '其他';
                }
            } 
        }, {
            key: 'phoneNumber',
            title: '联系电话',
            width: '5%',
            dataIndex: 'phoneNumber'
        }, {
            key: 'inductionDate',
            title: '入职时间',
            width: '5%',
            dataIndex: 'inductionDate',
            render:(birthday:string)=>{
                return moment(birthday).format('YYYY-MM-DD')
            }
        }, {
            key: 'employeeNature',
            title: '员工性质',
            width: '5%',
            dataIndex: 'employeeNature',
            render: (stationStatus: number): React.ReactNode => {
                switch (stationStatus) {
                    case 1:
                        return '正式员工';
                    case 2:
                        return '短期派遣员工';
                    case 3:
                        return '超龄员工';
                    case 4:
                        return '实习员工';
                }
            } 
        }, {
            key: 'positiveDate',
            title: '转正日期',
            width: '5%',
            dataIndex: 'positiveDate',
            render:(birthday:string)=>{
                return moment(birthday).format('YYYY-MM-DD')
            }
        }, {
            key: 'workYear',
            title: '工龄',
            width: '5%',
            dataIndex: 'workYear'
        }, {
            key: 'bankCardNumber',
            title: '银行卡号',
            width: '5%',
            dataIndex: 'bankCardNumber'
        }, {
            key: 'bankName',
            title: '开户行',
            width: '5%',
            dataIndex: 'bankName'
        }, {
            key: 'emergencyContact',
            title: '紧急联系人',
            width: '5%',
            dataIndex: 'emergencyContact'
        }, {
            key: 'emergencyContactPhone',
            title: '紧急联系电话',
            width: '5%',
            dataIndex: 'emergencyContactPhone'
        }];
    }

    //row-key
    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }

    public render(): React.ReactNode {
        return (
            <>
                <Button type={this.props.buttonType || 'primary'} style={this.props.buttonType==='link'?{ paddingBottom: '0', paddingTop: '0', height: 'auto', lineHeight: 1 }:{}} onClick={()=>{
                    this.getTable({})
                    this.setState({
                        isModalVisible: true
                    })
                }}>{this.props.buttonTitle || '选择员工'}</Button>
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
                                this.getForm()?.resetFields();
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