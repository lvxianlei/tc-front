/**
 * @author zyc
 * @copyright © 2021
 */

import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Form, Input, InputNumber, Popconfirm, Space, Table, TableColumnType } from 'antd';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';
import RequestUtil from '../../../utils/RequestUtil';
import layoutStyles from '../../../layout/Layout.module.less';

import styles from './AbstractTowerShapeSetting.module.less';
import ConfirmableButton from '../../../components/ConfirmableButton';
import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
import { RuleObject } from 'antd/lib/form';
import { StoreValue } from 'antd/lib/form/interface';
import { IProductDeployVOList } from './ITowerShape';

export interface IComponentDetailsSettingProps {
    readonly id: string;
}
export interface IComponentDetailsSettingRouteProps extends RouteComponentProps<IComponentDetailsSettingProps>, WithTranslation {
    readonly id: string;
}

export interface IComponentDetailsSettingState extends IAbstractFillableComponentState {
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

        } as S;
    }

    public componentDidMount() {
        super.componentDidMount();
        this.getData();
    }

    public getData = async () => {
        let towerSection: ITowerSection[] = await RequestUtil.get(`/tower-data-archive/drawComponent/${ this.props.match.params.id }`);
        towerSection = towerSection.map((items: ITowerSection) => {
            return {
                ...items,
                width: items.width == -1 ? undefined : items.width,
                thickness: items.thickness == -1 ? undefined : items.thickness,
                length: items.length == -1 ? undefined : items.length,
                accurateWeight: items.accurateWeight == -1 ? undefined : items.accurateWeight,
                subtotalWeight: (items.number || 0) * (items.singleWeight || 0)
            }
        })
        this.setState({
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
        values.productCategoryId = this.props.match.params.id;
        this.setState ({
            editingKey: undefined
        })
        values = {
            ...values,
            width: values.width == null ? 0 : values.width,
            thickness: values.thickness == null ? 0 : values.thickness,
            length: values.length == null ? 0 : values.length,
        }
        await RequestUtil.put('/tower-data-archive/drawComponent', values).then(res => {
            if(res) {
                this.getData();
            }
        });
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

    public async getAccurateWeight(): Promise<void> {
        const towerSection: ITowerSection | undefined = this.getForm()?.getFieldsValue(true);
        const resData = await RequestUtil.get(`/tower-data-archive/drawComponent/getAccurateWeight`, {
            ...towerSection
        });
        this.getForm()?.setFieldsValue({
            ...towerSection,
            accurateWeight: resData
        })
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
                <Input maxLength={ 20 } onBlur={(e) => {
                    const towerSection: ITowerSection | undefined = this.getForm()?.getFieldsValue(true);
                    if(towerSection?.spec && towerSection?.length) {
                        this.getAccurateWeight();
                    }
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
                <Input maxLength={ 20 } onBlur={(e) => {
                    const towerSection: ITowerSection | undefined = this.getForm()?.getFieldsValue(true);
                    if(towerSection?.rowMaterial && towerSection?.length) {
                        this.getAccurateWeight();
                    }
                }}/>
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
                    min="0.01"
                    step="0.01"
                    precision={ 2 }
                    className={ layoutStyles.width100 } 
                    onBlur={ (e) => {
                        const towerSection: ITowerSection | undefined = this.getForm()?.getFieldsValue(true);
                        if(towerSection?.rowMaterial && towerSection?.spec && towerSection?.length) {
                            this.getAccurateWeight();
                        }
                    } }/>
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
                    min="0.01"
                    step="0.01"
                    precision={ 2 }
                    className={ layoutStyles.width100 }
                    onBlur={ (e) => {
                        const towerSection: ITowerSection | undefined = this.getForm()?.getFieldsValue(true);
                        if(towerSection?.rowMaterial && towerSection?.spec && towerSection?.length) {
                            this.getAccurateWeight();
                        }
                    } }/>
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
                    min="0.01"
                    step="0.01"
                    precision={ 2 }
                    className={ layoutStyles.width100 }
                    onBlur={ (e) => {
                        const towerSection: ITowerSection | undefined = this.getForm()?.getFieldsValue(true);
                        if(towerSection?.rowMaterial && towerSection?.thickness && towerSection?.spec) {
                            this.getAccurateWeight();
                        }
                    } }/>
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
                    min="1"
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
                        <Button type="link" htmlType="button" disabled={ this.state.editingKey !== undefined } onClick={ this.editRow(record, ind) }>编辑</Button>
                        <Popconfirm 
                            title="要删除该条回款计划吗？" 
                            placement="topRight" 
                            okText="确认"
                            cancelText="取消"
                            onConfirm={ () => this.onDelete(record, ind) }
                            disabled={ this.state.editingKey !== undefined } 
                        >
                            <Button type="link"  disabled={ this.state.editingKey !== undefined } >
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
            await RequestUtil.delete(`/tower-data-archive/drawComponent/${ record.id }`).then(res => {
                if(res) {
                    this.getData();
                }
            });
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
     * @description 验证是否存在段号
     */
    public checkNum = (value: StoreValue, index: number): number =>{
        return this.state.towerSection.map((items: IProductDeployVOList, itemInd: number) => {
            if(index !== itemInd && items.partNum === value) {
                return false
            } else {
                return true
            }
        }).findIndex((item: boolean) => item === false)
    }
    /**
     * @description 验证是否配段
     */
    public checkPartNum = (value: StoreValue): Promise<void | any> =>{
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            const resData = await RequestUtil.get('/tower-data-archive/drawComponent/checkPartNum', {
                partNum: value,
                productCategoryId: this.props.match.params.id
            });
            if (resData) {
                resolve(resData)
            } else {
                resolve(false)
            }
        }).catch(error => {
            Promise.reject(error)
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
                                      validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                                        if(value && value != '') {
                                            if (this.checkNum(value, index)===-1) {
                                                this.checkPartNum(value).then(res => {
                                                    if (res) {
                                                        callback()
                                                    } else {
                                                        callback('未配段无法编辑构件明细')
                                                    }
                                                })
                                            } else {
                                                callback('段号已存在')
                                            }
                                        } else {
                                            callback('请输入段号')
                                        }
                                    }
                                }]}
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
                                  required: dataIndex === 'componentCode' ||  dataIndex === 'rowMaterial' || dataIndex ===  'materialTexture' || dataIndex ===  'spec' || dataIndex ===  'number' || dataIndex ===  'singleWeight',
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

