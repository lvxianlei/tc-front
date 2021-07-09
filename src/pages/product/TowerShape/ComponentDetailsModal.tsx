/**
 * @author zyc
 * @copyright © 2021
 */

import { Button, Form, FormInstance, Input, InputNumber, Modal, Popconfirm, Space, Table, TableColumnType } from 'antd';
import { ColumnType, TableProps } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';
import RequestUtil from '../../../utils/RequestUtil';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import layoutStyles from '../../../layout/Layout.module.less';

import styles from './AbstractTowerShapeSetting.module.less';

export interface IComponentDetailsModalProps {
    readonly id?: number | string;
}

export interface IComponentDetailsModalState {
    readonly isModalVisible: boolean;
    readonly towerSection: ITowerSection[];
}

interface ITowerSection {
    readonly a?: ITowerSection[];
    readonly id?: number | string;
    readonly name?: string;
    readonly phone?: string;
    readonly guige?: string;
    readonly num?: number;
    readonly unitWeight?: number;
    readonly subtotalWeight?: number;
}

export default abstract class ComponentDetailsModal<P extends IComponentDetailsModalProps, S extends IComponentDetailsModalState> extends React.Component<P,S> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
    }
    
    /**
     * @constructor
     * Creates an instance of ComponentDetailsModal.
     * @param props 
     */
    constructor(props: P) {
        super(props);
        this.state = this.getState();
    }

    /**
     * @description Gets state, it can override.
     */
    protected getState(): S {
        return {
            isModalVisible: false
        } as S;
    }

    /**
     * @description 显示弹窗 
     * @param event 
     */
    public showModal = async (): Promise<void> => {
        let towerSection: ITowerSection[] = await RequestUtil.get(`/tower-market/${ this.props.id }`);
        towerSection = towerSection.map((items: ITowerSection) => {
            return items = {...items, a: towerSection}
        })
        this.setState({
            isModalVisible: true,
            towerSection: towerSection,
        })
    }

    /**
     * @description Gets table data source
     * @param item 
     * @returns table data source 
     */
    public getTableDataSource(): object[] {
        return this.state.towerSection;
    };

    /**
     * @description 杆塔配段确定
     * @param event 
     */
    public towerSectionSubmit = (values: Record<string, any>): void => {
        console.log(values.a)
        this.setState ({
            isModalVisible: false
        })
        this.getForm()?.resetFields();
    }

    /**
     * @implements
     * @description Gets table columns
     * @param item 
     * @returns table columns 
     */
    public getTableColumns(): ColumnType<object>[] {
        return [{
            key: 'name',
            title: '* 段号',
            width: 120,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={['a',index,'name']} rules= {[{
                    required: true,
                    message: '请输入段号'
                }]}>
                    <Input maxLength={ 10 }/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '* 构件编号',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={['a',index,'name']} rules= {[{
                    required: true,
                    message: '请输入构件编号'
                }]}>
                    <Input maxLength={ 10 }/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '材料',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={['a',index,'name']}>
                    <Input onChange={(e) => {
                        const value: string = e.target.value;
                        const towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true).a);
                        const unitWeight: number = towerSection[index].unitWeight || 0;
                    }}/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '材质',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={['a',index,'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'guige',
            title: '* 规格',
            width: 120,
            dataIndex: 'guige',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.guige } name={['a',index,'guige']} rules= {[{
                    required: true,
                    message: '请输入规格'
                }]}>
                    <Input maxLength={ 20 }/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '宽度（mm）',
            width: 120,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={['a',index,'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '厚度（mm）',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={['a',index,'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '长度（mm）',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={['a',index,'name']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        }, {
            key: 'num',
            title: '数量',
            width: 150,
            dataIndex: 'num',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.num } name={['a',index,'num']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="1"
                        precision={ 0 }
                        className={ layoutStyles.width100 }
                        onChange={(e) => {
                            const towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true).a);
                            const unitWeight: number = towerSection[index].unitWeight || 0;
                            const subtotalWeight: number = Number(e)*unitWeight;
                            towerSection[index] = {
                                ...towerSection[index],
                                subtotalWeight: subtotalWeight
                            }
                            this.getForm()?.setFieldsValue({ a: [...towerSection]});
                        }}/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '理算重量（kg）',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={['a',index,'name']}>
                    <Input className={ styles.inputRed }/>
                </Form.Item> 
            )
        }, {
            key: 'unitWeight',
            title: '* 单件重量（kg）',
            width: 150,
            dataIndex: 'unitWeight',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.unitWeight } name={['a',index,'unitWeight']} rules= {[{
                    required: true,
                    message: '请输入单件重量'
                }]}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ `${layoutStyles.width100} ${styles.inputRed}` }
                        onChange={(e) => {
                            const towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true).a);
                            const num: number = towerSection[index].num || 0;
                            const subtotalWeight: number = Number(e)*num;
                            towerSection[index] = {
                                ...towerSection[index],
                                subtotalWeight: subtotalWeight
                            }
                            this.getForm()?.setFieldsValue({ a: [...towerSection]});
                        }}/>
                </Form.Item> 
            )
        }, {
            key: 'subtotalWeight',
            title: '小计重量（kg）',
            width: 150,
            dataIndex: 'subtotalWeight',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.subtotalWeight } name={['a',index,'subtotalWeight']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'phone',
            title: '备注',
            width: 150,
            dataIndex: 'phone',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.phone } name={['a',index, 'phone']}>
                    <Input maxLength={ 300 }/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '操作',
            width: 150,
            dataIndex: 'name',
            fixed: 'right',
            render: (_: undefined, record: object, ind: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm 
                        title="要删除该身部配段吗？" 
                        placement="topRight" 
                        okText="确认"
                        cancelText="取消"
                        onConfirm={ () => { this.onDelete(ind) } }
                    >
                        <DeleteOutlined/>
                    </Popconfirm>
                </Space>
            )
        }];
    };

    private onDelete = (index: number): void => {
        const towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true).a);
        towerSection && towerSection.splice(index, 1);
        this.setState({
            towerSection: [...towerSection]
        })
        this.getForm()?.setFieldsValue({a:[...towerSection]});
    } 
    
    public addRow = (): void => {
        let towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true).a);
        let item: ITowerSection = {
            id: Math.random(),
            name: '',
            phone: ''
        }
        towerSection = [
            ...towerSection,
            item
        ];
        this.setState({
            towerSection: [...towerSection]
        })
        this.getForm()?.setFieldsValue({a:[...towerSection]});
    }
    
    /**
     * @description modal内表格 
     */
     protected renderTableContent(): React.ReactNode {
        return (
            <Form ref={ this.form } onFinish={ this.towerSectionSubmit }>
                <Button type="primary" onClick={ this.addRow }>添加行</Button>
                <Table 
                    rowKey={ this.getTableRowKey() }
                    bordered={ true } 
                    dataSource={ this.getTableDataSource() } 
                    columns={ this.getTableColumns() }
                    pagination={ false }
                    scroll={{ x: true }}/>
                <Space direction="horizontal" size="small">
                    <Button type="primary" htmlType="submit">确定</Button>
                    <Button type="ghost" onClick={ this.handleCancel }>取消</Button>
                </Space>
            </Form>
        );
    }

    /**
     * @description 取消操作 
     * @param event 
     */
     public handleCancel = (): void => {
        this.setState ({
            isModalVisible: false
        })
        this.getForm()?.resetFields();
    };

    public render(): React.ReactNode {
        return (
            <>
                <Button onClick={ this.showModal } type="link">编辑图纸构建明细</Button>
                    <Modal 
                        title="构建明细" 
                        visible={ this.state.isModalVisible } 
                        footer={ false }
                        onCancel={ this.handleCancel }
                        width="80%"
                    >
                    {this.renderTableContent()}
                </Modal> 
            </>
        );
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}
