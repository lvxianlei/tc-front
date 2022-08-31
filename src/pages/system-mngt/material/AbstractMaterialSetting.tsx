/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber, Popconfirm, Select, Table, TableColumnType, TreeSelect } from 'antd';
import Form, { FormProps, RuleObject } from 'antd/lib/form';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { RouteComponentProps } from 'react-router';
import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
import { IMaterial, IMaterialTree } from './IMaterial';
import { unitOptions, materialStandardOptions } from '../../../configuration/DictionaryOptions';
import RequestUtil from '../../../utils/RequestUtil';

export interface IAbstractMaterialSettingState extends IAbstractFillableComponentState {
    readonly materialData?: any;
    readonly repeat?: boolean;
    readonly treeData?: IMaterialTree[];
}



/**
 * Abstract Mateiral Setting
 */
export default abstract class AbstractMaterialSetting<P extends RouteComponentProps, S extends IAbstractMaterialSettingState> extends AbstractFillableComponent<P, S> {
    // columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[];
    constructor(props: P) {
        super(props);

    }


    public state: S = {
        materialData: [],
        treeData: undefined,
    } as S;
    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return '/sys/material';
    }

    /**
     * @description Wraps role to data node
     * @param [roles] 
     * @returns role to data node 
     */
    protected wrapRole2DataNode(materials: (IMaterialTree & SelectDataNode)[] = []): SelectDataNode[] {
        materials.forEach((material: IMaterialTree & SelectDataNode): void => {
            material.title = material.treeName;
            material.value = material.id;
            if (material.children && material.children.length) {
                material.disabled = true;
                this.wrapRole2DataNode(material.children);
            }
        });
        return materials;
    }
    protected getColumn(): TableColumnType<IMaterial>[] {
        return [{
            key: 'materialCategory',
            title: `* 类型`,
            dataIndex: 'materialCategory',
            align: "center",
            width: 300,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'materialCategory']} rules={[{
                    required: true,
                    message: '请选择类型'
                }]}>
                    <TreeSelect
                        treeData={this.wrapRole2DataNode(this.state.treeData)}
                        showSearch={true}
                        onChange={(value: any, labelList: React.ReactNode[], extra: any) => this.materialTreeChange(value, labelList, extra, index)}
                    />
                </Form.Item>
            )

        }, {
            key: 'materialCode',
            title: `* 物料编号`,
            dataIndex: 'materialCode',
            align: "center",
            width: 300,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'materialCode']} rules={[{
                    required: true,
                    validator: (rule: RuleObject, value: string, callback: (error?: string) => void) => {
                        if (value && value != '') {
                            this.checkBatchSn(value, record).then(res => {
                                if (res) {
                                    callback()
                                } else {
                                    callback('物料编号重复')
                                }
                            })
                        } else {
                            callback('请输入物料编号')
                        }
                    }
                }, {
                    pattern: /^[^(\u4e00-\u9fa5)|(\s)]*$/,
                    message: '禁止输入中文或空格',
                }, {
                    validator: (rule: RuleObject, value: IMaterial, callback: (error?: string) => void) => {
                        this.checkMaterialCode(value, index).then(res => {
                            if (res === -1) {
                                callback()
                            } else {
                                callback('物料编号重复');
                            }
                        })
                    }
                }]}
                >
                    {(record as IMaterial).id ? <div>{text}</div> : <Input defaultValue={text} maxLength={20} />}
                </Form.Item>
            )

        }, {
            key: 'materialName',
            title: '* 品名',
            dataIndex: 'materialName',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'materialName']} rules={[{
                    required: true,
                    message: '请输入品名'
                }, ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue(['materialData', index, 'spec']) === value) {
                            return Promise.reject(new Error('不可与规格相同!'));
                        }
                        return Promise.resolve();
                    },
                }), {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                },]}>
                    <Input maxLength={20} />
                </Form.Item>
            )
        }, {
            key: 'shortcutCode',
            title: '快捷码',
            dataIndex: 'shortcutCode',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'shortcutCode']} >
                    <Input maxLength={10} />
                </Form.Item>
            )
        }, {
            key: 'rowMaterial',
            title: '* 材料',
            dataIndex: 'rowMaterial',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'rowMaterial']} rules={[{
                    required: true,
                    message: '请输入材料'
                }, {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                }]}>
                    <Input maxLength={20} />
                </Form.Item>
            )
        }, {
            key: 'structureTexture',
            title: '* 材质',
            dataIndex: 'structureTexture',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'structureTexture']} rules={[{
                    required: true,
                    message: '请输入材质'
                }, {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                }]}>
                    <Input maxLength={20} />
                </Form.Item>
            )
        }, {
            key: 'structureSpec',
            title: '* 规格',
            dataIndex: 'structureSpec',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'structureSpec']} rules={[{
                    required: true,
                    message: '请输入规格'
                }, ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue(['materialData', index, 'materialName']) === value) {
                            return Promise.reject(new Error('不可与品名相同!'));
                        }
                        return Promise.resolve();
                    },
                }), {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                }]}>
                    <Input maxLength={20} />
                </Form.Item>
            )
        }, {
            key: 'unit',
            title: '* 计量单位',
            dataIndex: 'unit',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'unit']} rules={[{
                    required: true,
                    message: '请输入计量单位'
                }]}>
                    <Select style={{ width: '100%' }}  >
                        {unitOptions && unitOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={`${id}`}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        }, {
            key: 'proportion',
            title: '比重',
            dataIndex: 'proportion',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'proportion']} >
                    <InputNumber precision={4} min='0.0001' value={text} />
                </Form.Item>
            )
        }, {
            key: 'weightAlgorithm',
            title: '重量算法',
            dataIndex: 'weightAlgorithm',
            align: "center",
            width: 300,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'weightAlgorithm']}>
                    <Select style={{ width: '100%' }} value={text}>
                        <Select.Option value={'0'} id='0'>
                            比重*体积（钢板类）
                        </Select.Option>
                        <Select.Option value={'1'} id='1' >
                            比重*长度（角钢类）
                        </Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'standard',
            title: '标准',
            dataIndex: 'standard',
            align: "center",
            width: 300,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'standard']}>
                    <Select style={{ width: '100%' }} value={text}>
                        {materialStandardOptions?.map((item: any, index: number) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)}
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            align: "center",
            width: 400,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'description']}>
                    <Input.TextArea rows={1} maxLength={300} />
                </Form.Item>
            )
        }, {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            align: "center",
            width: 100,
            render: (_, record, index) => {
                return <Popconfirm
                    title="确定删除这条数据吗？"
                    placement="topRight"
                    onConfirm={() => this.onDelete(record, index)}
                    disabled={(record as IMaterial).id ? true : false}
                >
                    <Button disabled={(record as IMaterial).id ? true : false} icon={<DeleteOutlined />} type="primary" ghost>
                        删除
                    </Button>
                </Popconfirm>

            }
        }]
    }
    /**
         * @description 验证物料编号是否重复
         */
    public checkBatchSn = (value: string, values: IMaterial): Promise<void | any> => {
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            const resData = await RequestUtil.get('/tower-system/material/checkMaterialCode', {
                materialCode: value,
                id: values.id,
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



    private onDelete(item: IMaterial, index: number) {
        const materialValue = this.getForm()?.getFieldsValue(true).materialData;
        materialValue && materialValue.splice(index, 1);
        this.getForm()?.setFieldsValue({ materialData: [...materialValue] });
        this.setState({
            materialData: [...materialValue],
        })
    }


    /**
     * @description 验证杆塔号
     */
    public checkMaterialCode = (value: IMaterial, index: number): Promise<void | any> => {
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            const materialDataList: IMaterial[] = this.getForm()?.getFieldsValue(true).materialData || [];
            if (value) {
                resolve(materialDataList.map((items: IMaterial, ind: number) => {
                    if (index !== ind && items.materialCode && items.materialCode === value) {
                        return false
                    } else {
                        return true
                    }
                }).findIndex(item => item === false))
            } else {
                resolve(false)
            }
        }).catch(error => {
            Promise.reject(error)
        })
    }

    /**
     * 遍历treeArray
     */
    protected expandKeysByValue(materialTrees: IMaterialTree[]) {
        let data: IMaterialTree[] = [];
        data = this.expandKeysId(materialTrees, data);
        return data;
    }

    //获取每一条tree
    protected expandKeysId(materialTrees: IMaterialTree[], data: IMaterialTree[]) {
        materialTrees.forEach((item: IMaterialTree): void => {
            data.push(item)
            if (item.children && item.children.length) {
                this.expandKeysId(item.children as IMaterialTree[], data);
            }
        });
        return data;
    }

    //treeSelect
    protected materialTreeChange(values: string, label: React.ReactNode[], extra: { triggerNode: { props: { parentId?: number; level: number } } }, index: number) {
        let checkedTree = [extra.triggerNode.props.parentId, values]
        let data = this.state?.materialData;
        const treeArray = this.state.treeData && this.expandKeysByValue(this.state.treeData)
        let tree: IMaterialTree[] | undefined = treeArray && treeArray.filter((item: IMaterialTree) => {
            return checkedTree && checkedTree.indexOf(item.id) > -1
        });
        checkedTree = [tree && tree[0]?.parentId, extra.triggerNode.props.parentId, values];
        checkedTree = checkedTree.filter(item => item !== '0')
        if (data) {
            let row = data[index];
            row['materialCategory'] = values;
            row['bigCategory'] = checkedTree[0] || "";
            row['middleCategory'] = checkedTree[1] || "";
            row['smallCategory'] = checkedTree[2] || "";
            this.setState({
                materialData: data
            })
        };
    }
    /**
     * @override
     * @description Gets form props
     * @returns form props 
     */
    protected getFormProps(): FormProps {
        return {
            ...super.getFormProps(),
            labelCol: {
                span: 6
            },
            wrapperCol: {
                offset: 1
            }
        };
    }


    /**
    * @description Renders extra operation area
    * @returns extra operation area 
    */
    protected renderExtraOperationArea(): React.ReactNode {
        return null;
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        return []
    }



    public handleAddRow = () => {
        const materialValue = this.getForm()?.getFieldsValue(true).materialData || [];
        let nRow: IMaterial = {
            description: "",
            materialCode: "",
            materialTexture: "",
            materialName: "",
            proportion: undefined,
            rowMaterial: "",
            shortcutCode: "",
            spec: "",
            unit: "",
            weightAlgorithm: "",
        };
        const data = [...materialValue, nRow];
        this.setState({
            materialData: data
        })
        this.getForm()?.setFieldsValue({
            materialData: data
        });
    };




    /**
    * @description Renders extra sections
    * @returns extra sections 
    */
    public renderExtraSections(): IRenderedSection[] {
        const tableData = this.state.materialData || [];
        return [{
            title: '原材料信息',
            render: (): React.ReactNode => {
                return (
                    <>
                        {this.getButton()}
                        <Table
                            bordered
                            rowKey={(record) => record.id}
                            dataSource={[...tableData]}
                            columns={this.getColumn()}
                            scroll={{ x: 1300 }}
                            pagination={false}
                        />
                    </>
                );
            }
        }];
    }

    protected getButton(): React.ReactNode {
        return <Button type='primary' onClick={this.handleAddRow}>新增</Button>
    }

}




