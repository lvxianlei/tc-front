/**
 * @author lxy
 * @copyright © 2021  All rights reserved
 */
import { Button, Form, FormItemProps, Input, InputNumber, Modal, Space, TableColumnType, TablePaginationConfig, TableProps, Tree } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { ITabItem } from '../../../components/ITabableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import { IMaterialType } from './IMaterial';

interface IMaterialTypeTypeMngtProps {}
interface IMaterialTypeTypeMngtWithRouteProps extends RouteComponentProps<IMaterialTypeTypeMngtProps>, WithTranslation {}
interface IMaterialTypeTypeMngtState extends IAbstractMngtComponentState, IFIlterValue {
    readonly material: IMaterialType[];
    readonly visible: boolean;
    readonly editValue: boolean;
    readonly defaultName: string;
    readonly defaultCode: string;
    readonly selectedValue: IMaterialType;
    readonly type: number;
}


interface IFIlterValue {
    readonly account?: string;
    readonly name?: string;
}

/**
 * Users management
 */
class MaterialTypeMngt extends AbstractMngtComponent<IMaterialTypeTypeMngtWithRouteProps, IMaterialTypeTypeMngtState> {

    constructor(props: IMaterialTypeTypeMngtWithRouteProps){
        super(props)
        this.showModal = this.showModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    //modal-show
    public showModal(record: Record<string,any> ,res:any, edit: number): void {
        this.setState({
            visible: true,
            defaultName: edit === 1 ? '' : record.name,
            defaultCode: edit === 1 ? '' : record.code,
            editValue: edit === 1 ? false : true,
            type: edit,
            selectedValue:  record,
        })
    }
    //modal-close
    public closeModal(): void {
        this.setState({
            visible: false,
        })
    }



    /**
     * @description Gets table props
     * @param item 
     * @returns table props 
     */
     protected getTableProps(item: ITabItem): TableProps<object> {
        return {
            rowKey: this.getTableRowKey(),
            bordered: true,
            pagination: false,
            onChange: this.onTableChange,
            dataSource: this.getTableDataSource(item),
            columns: this.getTableColumns(item),
        };
    }
    //modal-value
    public onFinish = async ( values: any ) =>{
        let dataSource: IMaterialType = {};
        const { selectedValue, type } = this.state; 
        if(selectedValue.id && type === 1){
        dataSource.level =  selectedValue?.level && selectedValue.level+1;
        dataSource.parentId =  selectedValue?.id && selectedValue.id;
        }else if(type === 2){
        dataSource.id =  selectedValue?.id && selectedValue.id;
        }
        dataSource.name = values.name;
        dataSource.code = values.code;
        
        this.setState({
            visible: false,
        })
        selectedValue.id && type===2?await RequestUtil.put('/tower-system/materialCategory', dataSource):await RequestUtil.post('/tower-system/materialCategory', dataSource);
        this.fetchMaterialType();
    }

    public getTableColumns(item: ITabItem): TableColumnType<object>[] {
        return [{
            key: 'code',
            title: '编号',
            dataIndex: 'code',
            align: "center",
            width:500,
        },  {
            key: 'name',
            title: '名称',
            dataIndex: 'name',
            align: "center",
            width:500,
        },  {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            align: "center",
            render: (_: undefined, record: IMaterialType): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={() => this.showModal(record, item, 1)}>
                        新增
                    </Button>
                    <Button type="link"  onClick={() => this.showModal(record, item, 2)}>
                        编辑
                    </Button>
                    <ConfirmableButton confirmTitle="要删除该数据吗？" type="link" placement="topRight" onConfirm={() => {this.handleDelete(record)}} >
                        <Button type="link">
                            删除
                        </Button>
                    </ConfirmableButton>
                    
                </Space>
            )
        }];
    }

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IMaterialTypeTypeMngtState {
        return {
            ...super.getState(),
            material: [],
            account: '',
            name: ''
        };
    }


    /**
     * @description Fetchs material
     * @param [filterValues] 
     */
    protected async fetchMaterialType(filterValues: IFIlterValue = {}, pagination: TablePaginationConfig = {}) {
        const resData: IMaterialType[] = await RequestUtil.get<IMaterialType[]>('/tower-system/materialCategory', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize ||this.state.tablePagination?.pageSize,
        });
        this.setState({
            ...filterValues,
            material: resData,
            tablePagination: {
                ...this.state.tablePagination,
            }
        });
    }

    /**
     * @description Components did mount
     */
    public componentDidMount() {
        super.componentDidMount();
        this.fetchMaterialType();
    }


    //delete-row
    public handleDelete = async(record: Record<string,any>) => {
        //接口
        await RequestUtil.delete(`/tower-system/materialCategory/${record.id}`)
        this.fetchMaterialType()
    };


    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [{
            label: '原材料',
            key: 0
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
     * @description Gets filter form item props
     * @param item 
     * @returns filter form item props 
     */
    public getFilterFormItemProps(item: ITabItem): FormItemProps<any>[] {
        return [];
    }

    /**
     * @implements
     * @description Determines whether new click on
     * @param event 
     */
    public onNewClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        this.setState({
            visible: true,
            defaultName: '',
            defaultCode: '',
            editValue: false,
            type: 0,
            selectedValue: {}
        })
    }
    /**
     * @implements
     * @description Determines whether filter submit on
     * @param values 
     */
    public onFilterSubmit(values: Record<string, any>): void {
        this.fetchMaterialType(values);
    }
    
    /**
     * @implements
     * @description Determines whether table change on
     * @param pagination 
     */
    public onTableChange(pagination: TablePaginationConfig): void {
        this.fetchMaterialType({
            account: this.state.account,
            name: this.state.name
        }, pagination);
    }
    


    /**
     * @implements
     * @description Gets table data source
     * @param item 
     * @returns table data source 
     */
    public getTableDataSource(item: ITabItem): object[] {
        return this.state.material;
    }



    



    /**
     * @protected
     * @description Renders filter content
     * @param item 
     * @returns filter content 
     */
    protected renderFilterContent(item: ITabItem): React.ReactNode {
        return null;
    }

    public render(): React.ReactNode {
        const { editValue, visible, defaultName, defaultCode } = this.state;
        return (
            <>
            { super.render() }
            {visible && <Modal 
                title={ editValue? '修改' : '新增' } 
                visible={ visible } 
                footer={ null } 
                onCancel={ this.closeModal }
            >
                <Form onFinish={ this.onFinish }>
                    <Form.Item
                        name="code"
                        label="编号"
                        rules={[{ 
                            required: true, 
                            message: '请填写编号！' 
                        },
                        {
                            pattern: /^[^(\s)|(\u4e00-\u9fa5)]*$/,
                            message: '禁止输入中文或空格',
                        }]} 
                        initialValue={ defaultCode }
                    >
                        <Input placeholder="请填写编号" style={{ width:"100%" }} maxLength={ 20 }/>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[{ 
                            required: true, 
                            message: '请填写名称！' 
                        },
                        {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]} 
                        initialValue={ defaultName }
                    >
                        <Input placeholder="请填写名称" maxLength={ 20 }/>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button onClick={this.closeModal}>取消</Button>
                </Form>
            </Modal>}
            </>
        );
    
    }
}

export default withRouter(withTranslation()(MaterialTypeMngt));


