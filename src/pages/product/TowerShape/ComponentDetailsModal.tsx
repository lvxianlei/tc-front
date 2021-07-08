/**
 * @author zyc
 * @copyright © 2021
 */

import { Button, Form, FormInstance, Input, Modal, Popconfirm, Space, Table, TableColumnType } from 'antd';
import { ColumnType, TableProps } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';
import RequestUtil from '../../../utils/RequestUtil';
import { IProduct } from '../../IProduct';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';

// import styles from './ComponentDetailsModal.module.less';

export interface IComponentDetailsModalProps {
    readonly id?: number | string;
}

export interface IComponentDetailsModalState {
    readonly isModalVisible: boolean;
    readonly towerSection: ITowerSection[];
}

interface ITowerSection {
    readonly id?: number | string;
    readonly name?: string;
    readonly phone?: string;
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
        console.log(towerSection)
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
        const towerSection: ITowerSection[] = this.getForm()?.getFieldsValue(true);
        values = Object.values(values);
        console.log(values)
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
            title: '段号',
            width: 120,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '构件编号',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '材料',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '材质',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '规格',
            width: 120,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '宽度（mm）',
            width: 120,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '厚度（mm）',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '长度（mm）',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '数量',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '理算重量（kg）',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '单件重量（kg）',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'name',
            title: '小计重量（kg）',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'phone',
            title: '备注',
            width: 150,
            dataIndex: 'phone',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.phone } name={[index, 'phone']}>
                    <Input/>
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

    private onDelete = (ind: number): void => {
        const towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true));
        towerSection && towerSection.splice(ind, 1);
        this.setState({
            towerSection: [...towerSection]
        })
        this.getForm()?.setFieldsValue([...towerSection])
    } 
    
    public addRow = (): void => {
        let towerSection: ITowerSection[] | undefined = this.state.towerSection;
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
