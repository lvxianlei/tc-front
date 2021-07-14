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
    readonly towerSectionFieldsValue?: ITowerSection[];
    readonly accurateWeight?: number;
    readonly componentCode?: string;
    readonly description?: string;
    readonly id?: string | number;
    readonly length?: number;
    readonly materialTexture?: string;
    readonly number?: number;
    readonly partNum?: string;
    readonly productCategoryId?: string | number;
    readonly rowMaterial?: string;
    readonly singleWeight?: number;
    readonly spec?: string;
    readonly subtotalWeight?: number;
    readonly thickness?: number;
    readonly width?: number;
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
        let towerSection: ITowerSection[] = await RequestUtil.get(`/tower-data-archive/drawingComponent/${ this.props.id }`);
        towerSection = towerSection.map((items: ITowerSection) => {
            return items = {...items, towerSectionFieldsValue: towerSection}
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
    public towerSectionSubmit = async (values: Record<string, any>): Promise<void> => {
        values.towerSectionFieldsValue = values.towerSectionFieldsValue.map((items: ITowerSection, index: number) => {
            return items =  {
                ...items,
                id: this.state.towerSection[index].id
            }
        })
        console.log(values.towerSectionFieldsValue)
        await RequestUtil.put('/tower-data-archive/drawingComponent', values.towerSectionFieldsValue);
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
            key: 'partNum',
            title: '* 段号',
            width: 120,
            dataIndex: 'partNum',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.partNum } name={['towerSectionFieldsValue', index, 'partNum']} rules= {[{
                    required: true,
                    message: '请输入段号'
                }]}>
                    <Input maxLength={ 10 }/>
                </Form.Item> 
            )
        }, {
            key: 'componentCode',
            title: '* 构件编号',
            width: 150,
            dataIndex: 'componentCode',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.componentCode } name={['towerSectionFieldsValue', index, 'componentCode']} rules= {[{
                    required: true,
                    message: '请输入构件编号'
                }]}>
                    <Input maxLength={ 10 }/>
                </Form.Item> 
            )
        }, {
            key: 'rowMaterial',
            title: '材料',
            width: 150,
            dataIndex: 'rowMaterial',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.rowMaterial } name={['towerSectionFieldsValue', index, 'rowMaterial']}>
                    <Input onChange={(e) => {
                        const value: string = e.target.value;
                        const towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true).towerSectionFieldsValue);
                        console.log(value, towerSection[index].spec, towerSection[index].thickness, towerSection[index].width, towerSection[index].length)
                    }}/>
                </Form.Item> 
            )
        }, {
            key: 'materialTexture',
            title: '材质',
            width: 150,
            dataIndex: 'materialTexture',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => ( 
                <Form.Item initialValue={ record.materialTexture } name={['towerSectionFieldsValue', index, 'materialTexture']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'spec',
            title: '* 规格',
            width: 120,
            dataIndex: 'spec',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.spec } name={['towerSectionFieldsValue', index, 'spec']} rules= {[{
                    required: true,
                    message: '请输入规格'
                }]}>
                    <Input maxLength={ 20 }/>
                </Form.Item> 
            )
        }, {
            key: 'width',
            title: '宽度（mm）',
            width: 120,
            dataIndex: 'width',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.width } name={['towerSectionFieldsValue', index, 'width']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'thickness',
            title: '厚度（mm）',
            width: 150,
            dataIndex: 'thickness',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.thickness } name={['towerSectionFieldsValue', index, 'thickness']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'length',
            title: '长度（mm）',
            width: 150,
            dataIndex: 'length',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.length } name={['towerSectionFieldsValue', index, 'length']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        }, {
            key: 'number',
            title: '数量',
            width: 150,
            dataIndex: 'number',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.number } name={['towerSectionFieldsValue', index, 'number']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="1"
                        precision={ 0 }
                        className={ layoutStyles.width100 }
                        onChange={(e) => {
                            const towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true).towerSectionFieldsValue);
                            const singleWeight: number = towerSection[index].singleWeight || 0;
                            const subtotalWeight: number = Number(e) * singleWeight;
                            towerSection[index] = {
                                ...towerSection[index],
                                subtotalWeight: subtotalWeight
                            }
                            this.getForm()?.setFieldsValue({ towerSectionFieldsValue: [...towerSection]});
                        }}/>
                </Form.Item> 
            )
        }, {
            key: 'accurateWeight',
            title: '理算重量（kg）',
            width: 150,
            dataIndex: 'accurateWeight',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.accurateWeight } name={['towerSectionFieldsValue', index, 'accurateWeight']}>
                    <Input className={ Math.floor(this.getForm()?.getFieldsValue(true).towerSectionFieldsValue[index]?.accurateWeight || 0) === Math.floor(this.getForm()?.getFieldsValue(true).towerSectionFieldsValue[index]?.singleWeight || 0) ? undefined : styles.inputRed } onChange={ (e) => {
                            const towerSection: ITowerSection[] = this.state.towerSection;
                            towerSection[index] = {
                                ...towerSection[index],
                                accurateWeight: Number(e.target.value)
                            }
                            this.setState({
                                towerSection: towerSection
                            })
                    } }/>
                </Form.Item> 
            )
        }, {
            key: 'singleWeight',
            title: '* 单件重量（kg）',
            width: 150,
            dataIndex: 'singleWeight',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.singleWeight } name={['towerSectionFieldsValue', index, 'singleWeight']} rules= {[{
                    required: true,
                    message: '请输入单件重量'
                }]}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ Math.floor(this.getForm()?.getFieldsValue(true).towerSectionFieldsValue[index]?.accurateWeight || 0) === Math.floor(this.getForm()?.getFieldsValue(true).towerSectionFieldsValue[index]?.singleWeight || 0) ? layoutStyles.width100 : `${layoutStyles.width100} ${styles.inputRed}` }
                        onChange={(e) => {
                            const towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true).towerSectionFieldsValue);
                            const number: number = towerSection[index].number || 0;
                            const subtotalWeight: number = Number(e) * number;
                            towerSection[index] = {
                                ...towerSection[index],
                                subtotalWeight: subtotalWeight,
                                singleWeight: Number(e)
                            }
                            this.setState({
                                towerSection: towerSection
                            })
                            this.getForm()?.setFieldsValue({ towerSectionFieldsValue: [...towerSection]});
                        }}/>
                </Form.Item> 
            )
        }, {
            key: 'subtotalWeight',
            title: '小计重量（kg）',
            width: 150,
            dataIndex: 'subtotalWeight',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.subtotalWeight } name={['towerSectionFieldsValue', index, 'subtotalWeight']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'description',
            title: '备注',
            width: 150,
            dataIndex: 'description',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.description } name={['towerSectionFieldsValue', index, 'description']}>
                    <Input maxLength={ 300 }/>
                </Form.Item> 
            )
        }, {
            key: 'operation',
            title: '操作',
            width: 150,
            dataIndex: 'operation',
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
        const towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true).towerSectionFieldsValue);
        towerSection && towerSection.splice(index, 1);
        this.setState({
            towerSection: [...towerSection]
        })
        this.getForm()?.setFieldsValue({ towerSectionFieldsValue:[...towerSection] });
    } 
    
    public addRow = (): void => {
        let towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true).towerSectionFieldsValue);
        let item: ITowerSection = {
            id: Math.random(),
            towerSectionFieldsValue: undefined,
            accurateWeight:  undefined,
            componentCode: '',
            description: '',
            length:  undefined,
            materialTexture: '',
            number:  undefined,
            partNum: '',
            productCategoryId: '',
            rowMaterial: '',
            singleWeight:  undefined,
            spec: '',
            subtotalWeight:  undefined,
            thickness:  undefined,
            width:  undefined
        }
        towerSection = [
            item,
            ...towerSection
        ];
        this.setState({
            towerSection: [...towerSection]
        })
        this.getForm()?.setFieldsValue({ towerSectionFieldsValue:[...towerSection] });
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
                <Button onClick={ this.showModal } type="link">编辑图纸构件明细</Button>
                    <Modal 
                        title="构件明细" 
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
