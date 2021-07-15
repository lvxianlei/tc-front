/**
 * @author zyc
 * @copyright © 2021
 */

import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Form, FormInstance, Input, InputNumber, Modal, Popconfirm, Space, Table, TableColumnType } from 'antd';
import { ColumnType, TableProps } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';
import RequestUtil from '../../../utils/RequestUtil';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import layoutStyles from '../../../layout/Layout.module.less';

import styles from './AbstractTowerShapeSetting.module.less';
import ConfirmableButton from '../../../components/ConfirmableButton';
import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';

export interface IComponentDetailsSettingProps {
    readonly id: string;
}
export interface IComponentDetailsSettingRouteProps extends RouteComponentProps<IComponentDetailsSettingProps>, WithTranslation {
    readonly id: string;
}

export interface IComponentDetailsSettingState extends IAbstractFillableComponentState {
    readonly isModalVisible: boolean;
    readonly towerSection: ITowerSection[];
    readonly editingKey?: number;
}

interface EditTableColumnType<RecordType> extends TableColumnType<object> {
    readonly editable?: boolean; 
    readonly type?: React.ReactNode;
    readonly title?: string;
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

class ComponentDetailsSetting<P extends IComponentDetailsSettingRouteProps, S extends IComponentDetailsSettingState> extends AbstractFillableComponent<P, S> {

    
    /**
     * @constructor
     * Creates an instance of ComponentDetailsSetting.
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

    public async componentDidMount() {
        super.componentDidMount();
        let towerSection: ITowerSection[] = await RequestUtil.get(`/tower-data-archive/drawingComponent/${ this.props.match.params.id }`);
        this.setState({
            isModalVisible: true,
            towerSection: towerSection,
        })
    }

    public getFormItemGroups(): IFormItemGroup[][] {
        return []
    }

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
     public async onSubmit(values: Record<string, any>): Promise<void> {
        console.log(values)
        this.setState ({
            editingKey: undefined,
            isModalVisible: false
        })
        return await RequestUtil.put('/tower-data-archive/drawingComponent', values.towerSectionFieldsValue);
        // return Promise.reject();
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
     * @description Edits row
     * @param record 
     * @param index 
     */
    private editRow(record: Record<string, any>, index: number): React.MouseEventHandler<HTMLButtonElement> {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();
            this.setState({
                editingKey: index,
            });
            this.getForm()?.setFieldsValue({ ...record })
        };
    }

    /**
     * @implements
     * @description Gets table columns
     * @param item 
     * @returns table columns 
     */
    public getTableColumns(): EditTableColumnType<object>[] {
        const index: number | undefined = this.state.editingKey;
        return [{
            key: 'partNum',
            title: '段号',
            width: 120,
            dataIndex: 'partNum',
            editable: true,
            type: (
                <Input maxLength={ 10 }/>
            ),
        }, {
            key: 'componentCode',
            title: '构件编号',
            width: 150,
            dataIndex: 'componentCode',
            editable: true,
            type: (
                <Input maxLength={ 10 }/>
            ),
        }, {
            key: 'rowMaterial',
            title: '材料',
            width: 150,
            dataIndex: 'rowMaterial',
            editable: true,
            type: (
                <Input maxLength={ 20 } onChange={(e) => {
                    const value: string = e.target.value;
                    const towerSection: ITowerSection | undefined = this.getForm()?.getFieldsValue(true);
                    console.log(value, towerSection?.spec, towerSection?.thickness, towerSection?.width, towerSection?.length)
                }}/>
            ),
        }, {
            key: 'materialTexture',
            title: '材质',
            width: 150,
            dataIndex: 'materialTexture',
            editable: true,
            type: (
                <Input maxLength={ 20 }/>
            ),
        }, {
            key: 'spec',
            title: '规格',
            width: 120,
            dataIndex: 'spec',
            editable: true,
            type: (
                <Input maxLength={ 20 }/>
            ),
        }, {
            key: 'width',
            title: '宽度（mm）',
            width: 120,
            dataIndex: 'width',
            editable: true,
            type: (
                <InputNumber 
                    stringMode={ false } 
                    min="0"
                    step="0.01"
                    precision={ 2 }
                    className={ layoutStyles.width100 }/>
            ),
        }, {
            key: 'thickness',
            title: '厚度（mm）',
            width: 150,
            dataIndex: 'thickness',
            editable: true,
            type: (
                <InputNumber 
                    stringMode={ false } 
                    min="0"
                    step="0.01"
                    precision={ 2 }
                    className={ layoutStyles.width100 }/>
            ),
        }, {
            key: 'length',
            title: '长度（mm）',
            width: 150,
            dataIndex: 'length',
            editable: true,
            type: (
                <InputNumber 
                    stringMode={ false } 
                    min="0"
                    step="0.01"
                    precision={ 2 }
                    className={ layoutStyles.width100 }/>
            ),
        }, {
            key: 'number',
            title: '数量',
            width: 150,
            dataIndex: 'number',
            editable: true,
            type: (
                <InputNumber 
                    stringMode={ false } 
                    min="0"
                    step="1"
                    precision={ 0 }
                    className={ layoutStyles.width100 }
                    onChange={(e) => {
                        let towerSection: ITowerSection | undefined = this.getForm()?.getFieldsValue(true);
                        if(index) {
                            const singleWeight: number = towerSection?.singleWeight || 0;
                            const subtotalWeight: number = Number(e) * singleWeight;
                            towerSection = {
                                ...towerSection,
                                subtotalWeight: subtotalWeight
                            }
                        }
                        this.getForm()?.setFieldsValue({ ...towerSection });
                    }}/>
            )
        }, {
            key: 'accurateWeight',
            title: '理算重量（kg）',
            width: 150,
            dataIndex: 'accurateWeight',
            editable: true,
            type: (
                <Input className={ Math.floor(this.getForm()?.getFieldsValue(true).accurateWeight || 0) === Math.floor(this.getForm()?.getFieldsValue(true).singleWeight || 0) ? undefined : styles.inputRed } onChange={ (e) => {
                    const towerSection: ITowerSection[] = this.state.towerSection;
                    if(index) {
                        towerSection[index] = {
                            ...towerSection[index],
                            accurateWeight: Number(e.target.value)
                        }
                    }
                    this.setState({
                        towerSection: towerSection
                    })
                } }/>
            )
        }, {
            key: 'singleWeight',
            title: '单件重量（kg）',
            width: 150,
            dataIndex: 'singleWeight',
            editable: true,
            type: (
                <InputNumber 
                    stringMode={ false } 
                    min="0"
                    step="0.01"
                    precision={ 2 }
                    className={ Math.floor(this.getForm()?.getFieldsValue(true)?.accurateWeight || 0) === Math.floor(this.getForm()?.getFieldsValue(true).singleWeight || 0) ? layoutStyles.width100 : `${layoutStyles.width100} ${styles.inputRed}` }
                    onChange={(e) => {
                        let towerSection: ITowerSection | undefined = this.getForm()?.getFieldsValue(true);
                        const number: number = towerSection?.number || 0;
                        const subtotalWeight: number = Number(e) * number;
                        towerSection = {
                            ...towerSection,
                            subtotalWeight: subtotalWeight,
                            singleWeight: Number(e)
                        }
                        if(index) {
                            this.state.towerSection[index] = towerSection;
                        }
                        
                        this.setState({
                            towerSection: this.state.towerSection
                        })
                        this.getForm()?.setFieldsValue({ ...towerSection });
                    }}/>
            )
        }, {
            key: 'subtotalWeight',
            title: '小计重量（kg）',
            width: 150,
            dataIndex: 'subtotalWeight',
            editable: true,
            type: (
                <Input disabled/>
            )
        }, {
            key: 'description',
            title: '备注',
            width: 150,
            dataIndex: 'description',
            editable: true,
            type: (
                <Input maxLength={ 300 }/>
            )
        }, {
            key: 'operation',
            title: '操作',
            width: 150,
            dataIndex: 'operation',
            fixed: 'right',
            render: (_: undefined, record: object, ind: number) => {
                const editing: boolean = this.isEditing(ind);
                return (
                    editing
                    ?
                    <Space direction="horizontal" size="small">
                        <Button type="link" htmlType="submit">保存</Button>
                        <ConfirmableButton 
                            confirmTitle="要取消编辑吗？"
                            type="link" 
                            placement="topRight"
                            onConfirm={ () => { 
                                this.setState({
                                    editingKey: undefined
                                })
                            } }>
                            取消
                        </ConfirmableButton>
                    </Space>
                    :
                    <Space direction="horizontal" size="small">
                        <Button type="link" htmlType="button" disabled={ this.state.editingKey !== undefined }onClick={ this.editRow(record, ind) }>编辑</Button>
                        <Popconfirm 
                            title="要删除该条回款计划吗？" 
                            placement="topRight" 
                            okText="确认"
                            cancelText="取消"
                            onConfirm={ () => this.onDelete(record, ind) }
                        >
                            <Button type="link">
                                删除
                            </Button>
                        </Popconfirm>
                    </Space>
                )
            }
        }];
    };

    private onDelete = async (record: Record<string, any>, index: number): Promise<void> => {
        const towerSection: ITowerSection[] | undefined = this.state.towerSection;
        if(record.id) {
            await RequestUtil.delete(`/tower-data-archive/drawingComponent?id=${ record.id }`);
        }
        towerSection && towerSection.splice(index, 1);
        this.setState({
            towerSection: [...towerSection]
        })
    } 
    
    protected addRow = (): void => {
        let towerSection: ITowerSection[] | undefined = this.state.towerSection;
        let item: ITowerSection = {
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
    }

    /**
     * @description Determines whether editing is
     * @param key 
     * @returns true if editing 
     */
    private isEditing(key: number): boolean {
        return key === this.state.editingKey;
    }

    /**
     * @description Gets merged columns
     * @returns merged columns 
     */
     private getMergedColumns(): EditTableColumnType<object>[] {
        return this.getTableColumns().map<EditTableColumnType<object>>((col: EditTableColumnType<object>): EditTableColumnType<object> => {
            if(!col.editable) {
                return col
            } else {
                return {
                    ...col,
                    onCell: (record: Record<string, any>, index?: number) => {
                        return {
                            record,
                            type: col.type,
                            dataIndex: col.dataIndex,
                            title: col.title,
                            index: index,
                            editing: this.isEditing(index || 0)
                        };
                    }
                }
            }
        })
    }

    /**
     * @description Get editable cell of contract refund record
     */
    private getEditableCell = (recordItem: Record<string, any>) => {
        const {
            editing,
            dataIndex,
            title,
            type,
            record,
            index,
            children,
            ...restProps
        } = recordItem;
        return ( 
            <td { ...restProps }>
                {
                    editing
                    ?
                    <>
                        { dataIndex === 'partNum'
                        ?
                        <>
                            <Form.Item
                                name="id"
                                initialValue={ record.id }
                                className={ styles.hidden }
                            >
                                <Input type="hidden"/>
                            </Form.Item>
                            <Form.Item
                                name={ dataIndex }
                                initialValue={ record[dataIndex] } 
                                rules={[
                                    {
                                      required: true,
                                      message: `请输入${ title }`,
                                    },
                                ]}
                            >
                                { type }
                            </Form.Item>
                        </>
                        :
                        <Form.Item
                            name={ dataIndex }
                            initialValue={ record[dataIndex] } 
                            rules={[
                                {
                                  required: dataIndex === 'partNum' || dataIndex === 'componentCode' ||  dataIndex === 'rowMaterial' || dataIndex ===  'materialTexture' || dataIndex ===  'spec' || dataIndex ===  'number' || dataIndex ===  'singleWeight',
                                  message: `请输入${ title }`,
                                },
                            ]}
                        >
                            { type }
                        </Form.Item>}
                    </>
                    :
                    children
                }
            </td>
        );
    }
    
    /**
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        return [{
            title: '构件明细',
            render: (): React.ReactNode => {
                return (<>
                    <Button type="primary" onClick={ this.addRow } disabled={ this.state.editingKey !== undefined }>添加行</Button>
                    <Table 
                        rowKey={ this.getTableRowKey() }
                        bordered={ true } 
                        dataSource={ this.getTableDataSource() } 
                        columns={ this.getMergedColumns() }
                        pagination={ false }
                        components={{
                            body: {
                                cell: this.getEditableCell
                            }
                        }}
                        scroll={{ x: true }}/>
                </>);
            }
        }]
    }

     /**
     * @description Renders extra operation area
     * @returns extra operation area 
     */
      protected renderExtraOperationArea(): React.ReactNode {
        return null;
    }

    /**
     * @description Gets primary operation button
     * @returns primary operation button
     */
    protected getPrimaryOperationButton(): React.ReactNode {
        return null;
    }

    /**
     * @description Renders extra operation area
     * @returns extra operation area 
     */
     protected cancelOperationButton(): React.ReactNode {
        return null;
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
    
}
export default withRouter(withTranslation()(ComponentDetailsSetting));

