/**
 * @author lxy
 * @copyright © 2021  All rights reserved
 */
import { Button, Form, FormItemProps, Input, Modal, Space, TableColumnType, TablePaginationConfig, TableProps } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { ITabItem } from '../../../components/ITabableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import { IMaterialType } from './IMaterial';

interface IMaterialTypeTypeMngtProps { }
interface IMaterialTypeTypeMngtWithRouteProps extends RouteComponentProps<IMaterialTypeTypeMngtProps>, WithTranslation { }
interface IMaterialTypeTypeMngtState extends IAbstractMngtComponentState, IFIlterValue {
    readonly material: IMaterialType[];
    readonly visible: boolean;
    readonly editValue: boolean;
    readonly defaultName: string;
    readonly defaultCode: string;
    readonly selectedValue: IMaterialType;
    readonly type: number; //0新增 1编辑 2二级新增 3二级编辑
    readonly defaultData: IMaterialType;
}

interface IFIlterValue {
    readonly account?: string;
    readonly name?: string;
}

/**
 * Users management
 */
class MaterialTypeMngt extends AbstractMngtComponent<IMaterialTypeTypeMngtWithRouteProps, IMaterialTypeTypeMngtState> {

    constructor(props: IMaterialTypeTypeMngtWithRouteProps) {
        super(props)
        this.showModal = this.showModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    protected renderExtraOperationContent(item: ITabItem): React.ReactNode {
        return ( <Space direction="horizontal" size="small">
                {/* <Button type="primary">导入</Button> */}
                <Button type="primary" onClick={this.onNewClick}>新增一级类目</Button>
                <Button type="primary" onClick={() => this.props.history.push('/config')} ghost>返回上一级</Button>
            </Space>
        );
    }

    //modal-show
    public showModal(record: Record<string, any>, type: number): void {
        this.setState({
            visible: true,
            defaultData: record,
            type: type,
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
    public onFinish = async (values: any) => {
        // let dataSource: IMaterialType = {};
        // const { selectedValue, type } = this.state;
        // if (selectedValue.id && type === 1) {
        //     dataSource.level = selectedValue?.level && selectedValue.level + 1;
        //     dataSource.parentId = selectedValue?.id && selectedValue.id;
        // } else if (type === 2) {
        //     dataSource.id = selectedValue?.id && selectedValue.id;
        // }
        // dataSource.name = values.name;
        // dataSource.code = values.code;

        // this.setState({
        //     visible: false,
        // })
        // selectedValue.id && type === 2 ? await RequestUtil.put('/tower-system/materialCategory', dataSource) : await RequestUtil.post('/tower-system/materialCategory', dataSource);
        // this.fetchMaterialType();
        console.log(values)
        if(this.state.type === 0) {
            RequestUtil.post('/tower-system/materialCategory', values).then(res => {
                this.setState({
                    visible: false
                })
                this.fetchMaterialType();
            })
        } else if(this.state.type === 1) {
            RequestUtil.put('/tower-system/materialCategory', { ...this.state.defaultData, ...values }).then(res => {
                this.setState({
                    visible: false
                })
                this.fetchMaterialType();
            })
        }


    }

    public getTableColumns(item: ITabItem): TableColumnType<object>[] {
        return [{
            key: 'code',
            title: '编号',
            dataIndex: 'code',
            align: "center",
            width: 120,
        }, {
            key: 'name',
            title: '一级类目名称',
            dataIndex: 'name',
            align: "center",
            width: 200,
        }, {
            key: 'sonName',
            title: '二级类目名称',
            dataIndex: 'sonName',
            align: "center",
            width: 200,
        }, {
            key: 'ruleFront',
            title: '规格前置符',
            dataIndex: 'ruleFront',
            align: "center",
            width: 150,
        }, {
            key: 'unit',
            title: '单位',
            dataIndex: 'unit',
            align: "center",
            width: 150,
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            align: "center",
            render: (_: undefined, record: IMaterialType): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    { record.level === 1 ? <Button type="link" onClick={() => this.showModal({ firstCode: record.code }, 2)}>
                        添加二级类目
                    </Button> : null}
                    <Button type="link" onClick={() => this.showModal(record, record.level === 1 ? 1 : 2)}>
                        编辑
                    </Button>
                    <ConfirmableButton confirmTitle="要删除该数据吗？" type="link" placement="topRight" onConfirm={() => { this.handleDelete(record) }} >
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
        let resData: IMaterialType[] = await RequestUtil.get<IMaterialType[]>('/tower-system/materialCategory', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize || this.state.tablePagination?.pageSize,
        });
        resData = resData.map((item: IMaterialType) => {
            if(item.level === 2) {
                return {
                    ...item,
                    sonName: item.name,
                    name: ''
                }
            } else {
                return item
            }
        })
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
    public handleDelete = async (record: Record<string, any>) => {
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
    public onTabChange(activeKey: string): void { }

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
        // this.setState({
        //     visible: true,
        //     defaultName: '',
        //     defaultCode: '',
        //     editValue: false,
        //     type: 0,
        //     selectedValue: {}
        // })
        this.setState({
            visible: true,
            type: 0
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
        const { defaultData, visible, type } = this.state;
        return (
            <>
                {super.render()}
                {visible && <Modal
                    title={type === 1 ? '修改' : '新增'}
                    visible={visible}
                    footer={null}
                    onCancel={this.closeModal}
                >
                    <Form onFinish={this.onFinish}>
                        <Form.Item
                            name="code"
                            label="原材料编号"
                            rules={[{
                                required: true,
                                message: '请输入原材料编号！'
                            },
                            {
                                pattern: /^[^(\s)|(\u4e00-\u9fa5)]*$/,
                                message: '禁止输入中文或空格',
                            }]}
                            initialValue={defaultData.code}
                        >
                            { this.state.type === 2 || this.state.type === 3 ?<Input placeholder="请输入"  addonBefore={defaultData.firstCode} style={{ width: "100%" }} maxLength={20} /> : <Input placeholder="请输入" style={{ width: "100%" }} maxLength={20} />}
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="类目名称"
                            rules={[{
                                required: true,
                                message: '请输入类目名称！'
                            },
                            {
                                pattern: /^[^\s]*$/,
                                message: '禁止输入空格',
                            }]}
                            initialValue={defaultData.name}
                        >
                            <Input placeholder="请输入名称" maxLength={20} />
                        </Form.Item>
                        { this.state.type === 2 || this.state.type === 3 ?
                            <><Form.Item
                                name="ruleFront"
                                label="规格前置符"
                                initialValue={defaultData.ruleFront}
                            >
                                <Input placeholder="请输入规格前置符" maxLength={20} />
                            </Form.Item>
                            <Form.Item
                                name="unit"
                                label="单位"
                                initialValue={defaultData.unit}
                            >
                                <Input placeholder="请输入单位称" maxLength={20} />
                            </Form.Item></>
                            : null
                        }
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button onClick={this.closeModal}>取消</Button>
                    </Form>
                </Modal>}
            </>
        );
    }
}

export default withRouter(withTranslation()(MaterialTypeMngt));


