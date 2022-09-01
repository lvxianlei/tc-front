/**
 * @author lixy
 * @copyright © 2021 Cory. All rights reserved
 */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Col, FormItemProps, Input, Popconfirm, Row, Space, TableColumnType, TablePaginationConfig, TableProps, Tree } from 'antd';
import { GetRowKey } from 'antd/lib/table/interface';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { ITabItem } from '../../../components/ITabableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import { IMaterial, IMaterialTree } from './IMaterial';
import { DataNode } from 'antd/lib/tree';

interface IMaterialMngtProps { }
interface IMaterialRouteProps extends RouteComponentProps<IMaterialMngtProps>, WithTranslation { }
interface IMaterialMngtState extends IAbstractMngtComponentState, IFIlterValue {
    readonly materials: IMaterial[];
    readonly treeData: IMaterialTree[];
    readonly selectedMaterialKeys: React.Key[];
    readonly selectedMaterials: IMaterial[];
    readonly expandKeys: React.Key[];
    readonly autoExpandParent?: boolean;
    readonly selectedKey: React.Key[];
}

interface IResponseData {
    readonly current: number;
    readonly size: number;
    readonly total: number;
    readonly records: IMaterial[]
}

interface IFIlterValue {
    readonly bigCategory?: React.Key;
    readonly middleCategory?: React.Key;
    readonly smallCategory?: React.Key;
}

/**
 * Materials management
 */
class MaterialMngt extends AbstractMngtComponent<IMaterialRouteProps, IMaterialMngtState> {
    public getTableColumns(): TableColumnType<object>[] {
        return [{
            key: 'materialCode',
            title: '物料编号',
            dataIndex: 'materialCode',
            align: "center"
        }, {
            key: 'materialName',
            title: '品名',
            dataIndex: 'materialName',
            align: "center"
        }, {
            key: 'shortcutCode',
            title: '快捷码',
            dataIndex: 'shortcutCode',
            align: "center"
        }, {
            key: 'rowMaterial',
            title: '材料',
            dataIndex: 'rowMaterial',
            align: "center"
        }, {
            key: 'structureTexture',
            title: '材质',
            dataIndex: 'structureTexture',
            align: "center"
        }, {
            key: 'structureSpec',
            title: '规格',
            dataIndex: 'structureSpec',
            align: "center",
        }, {
            key: 'unitName',
            title: '计量单位',
            dataIndex: 'unitName',
            align: "center",
        }, {
            key: 'proportion',
            title: '比重',
            dataIndex: 'proportion',
            align: "center",
            render: (text) => {
                return text == -1 ? '' : text
            }
        }, {
            key: 'weightAlgorithm',
            title: '重量算法',
            dataIndex: 'weightAlgorithm',
            align: "center",
            render: (text, record, index) => {
                return text ? text === '0' ? <span>比重*体积（钢板类）</span> : <span>比重*长度（角钢类）</span> : <div></div>
            }
        }, {
            key: 'standardName',
            title: '标准',
            dataIndex: 'standardName',
            align: "center"
        }, {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            align: "center"
        }, {
            key: 'operation',
            title: '操作',
            fixed: "right",
            dataIndex: 'operation',
            align: "center",
            render: (_: undefined, record: IMaterial): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" href={`/sys/material/view/${(record as IMaterial).id}`}>
                        编辑
                    </Button>
                    <ConfirmableButton confirmTitle="要删除该数据吗？" type="link" placement="topRight" onConfirm={() => { this.onDelete([record]) }} >
                        <Button type="link">
                            删除
                        </Button>
                    </ConfirmableButton>

                </Space>
            )
        }]
    }

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IMaterialMngtState {
        return {
            ...super.getState(),
            materials: [],
            bigCategory: '',
            middleCategory: '',
            smallCategory: '',
            autoExpandParent: false
        };
    }

    /**
     * @description Fetchs materials
     * @param [filterValues] 
     */
    protected async fetchMaterials(filterValues: IFIlterValue = {}, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-system/material', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize || this.state.tablePagination?.pageSize,
        });
        if (resData?.records?.length === 0 && resData?.current > 1) {
            this.fetchMaterials({
                ...filterValues
            }, {
                current: resData.current - 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            });
            this.setState({
                selectedMaterials: []
            })
        }
        this.setState({
            ...filterValues,
            materials: resData.records,
            tablePagination: {
                ...this.state.tablePagination,
                current: resData.current,
                pageSize: resData.size,
                total: resData.total
            }
        });
    }


    /**
     * @description Fetchs materials
     * @param [filterValues] 
     */
    protected async fetchMaterialsTree(filterValues: IFIlterValue = {}, pagination: TablePaginationConfig = {}) {
        const resData: IMaterialTree[] = await RequestUtil.get<IMaterialTree[]>('/tower-system/materialCategory/tree');
        this.setState({
            treeData: resData,
            expandKeys: this.expandKeysByValue(resData),
            tablePagination: {
                ...this.state.tablePagination,
            }
        });
    }


    /**
      * 获取expandKeys
      */
    protected expandKeysByValue(materialTrees: IMaterialTree[]): number[] {
        let data: number[] = [];
        data = this.expandKeysId(materialTrees, data);
        return data;
    }

    //获取childrenID 
    protected expandKeysId(materialTrees: IMaterialTree[], data: number[]): number[] {
        materialTrees.forEach((item: IMaterialTree): void => {
            data.push(item.code)
            if (item.children && item.children.length) {
                this.expandKeysId(item.children as IMaterialTree[], data);
            }
        });
        return data;
    }

    /**
     * @description Components did mount
     */
    public componentDidMount() {
        super.componentDidMount();
        this.fetchMaterials();
        this.fetchMaterialsTree();
    }

    /**
     * @description Determines whether delete on
     * @param item 
     * @returns delete 
     */
    private onDelete = async (items: IMaterial[]) => {
        await RequestUtil.delete(`/tower-system/material?id=${items.map<string>((item: IMaterial): string => item?.id as string)}`);
        this.fetchMaterials();
    }
    /**
     * @description Determines whether delete on
     * @param item 
     * @returns delete 
     */
    private onDeleteAll = async (items: IMaterial[]) => {
        await RequestUtil.delete(`/tower-system/material?id=${items.map<string>((item: IMaterial): string => item?.id as string)}`);
        this.setState({
            selectedMaterials: []
        })
        this.fetchMaterials();
    }


    /**
     * @description Determines whether batch delete on
     * @returns batch delete 
     */
    private onBatchDelete = () => {
        return this.onDeleteAll(this.state.selectedMaterials);
    }

    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [{
            label: '原材料列表',
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
        return [{
            name: 'materialCode',
            children: <Input placeholder="物料编号关键字" maxLength={200} />
        }, {
            name: 'materialName',
            children: <Input placeholder="品名关键字" maxLength={200} />
        }, {
            name: 'shortcutCode',
            children: <Input placeholder="快捷码关键字" maxLength={200} />
        }, {
            name: 'rowMaterial',
            children: <Input placeholder="材料关键字" maxLength={200} />
        }, {
            name: 'materialTexture',
            children: <Input placeholder="材质关键字" maxLength={200} />
        }];
    }

    /**
     * @implements
     * @description Determines whether new click on
     * @param event 
     */
    public onNewClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        console.log('new')
    }

    /**
     * @implements
     * @description Determines whether filter submit on
     * @param values 
     */
    public onFilterSubmit(values: Record<string, any>): void {
        this.fetchMaterials(values);
    }

    /**
     * @implements
     * @description Determines whether table change on
     * @param pagination 
     */
    public onTableChange(pagination: TablePaginationConfig): void {
        const { bigCategory, middleCategory, smallCategory } = this.state;
        this.fetchMaterials({ bigCategory, middleCategory, smallCategory }, pagination);
    }

    /**
     * @description Select change of role mngt
     */
    private SelectChange = (selectedRowKeys: React.Key[], selectedRows: object[]): void => {
        this.setState({
            selectedMaterialKeys: selectedRowKeys,
            selectedMaterials: selectedRows as IMaterial[]
        });
    }

    /**
     * @implements
     * @description Gets table data source
     * @param item 
     * @returns table data source 
     */
    public getTableDataSource(item: ITabItem): object[] {
        return this.state.materials;
    }


    /**
         * @override
         * @description Gets table props
         * @param item 
         * @returns table props 
         */
    protected getTableProps(item: ITabItem): TableProps<object> {
        return {
            ...super.getTableProps(item),
            rowSelection: {
                selectedRowKeys: this.state.selectedMaterialKeys,
                onChange: this.SelectChange
            }
        };
    }



    //额外按钮
    protected renderExtraOperationContent(item: ITabItem): React.ReactNode {
        return (
            <Space direction="horizontal" size="middle">
                {/*暂时不要 <Button  type="primary">导入</Button>
                <Button>导入模板下载</Button>
                <Button>导出</Button> */}
                <Button href={`/sys/material/new`}>批量新增</Button>
                <Button
                    href={`/sys/material/view/${this.state.selectedMaterials && this.state.selectedMaterials.map<string>((item: IMaterial): string => item?.id as string)}`}
                    disabled={!this.state.selectedMaterials?.length}>编辑</Button>
                <Popconfirm
                    title="确定删除这条数据吗？"
                    placement="topRight"
                    onConfirm={() => this.onBatchDelete()}
                    disabled={!this.state.selectedMaterials?.length}
                >
                    <Button disabled={!this.state.selectedMaterials?.length} icon={<DeleteOutlined />} danger>
                        删除
                    </Button>
                </Popconfirm>
            </Space>
        );
    }



    public onSelect = (selectedKeys: React.Key[], info: any) => {
        if (info.node.level === 3) {
            this.setState({
                smallCategory: selectedKeys[0],
                selectedKey: selectedKeys
            })
        }
        if (info.node.level === 2) {
            this.setState({
                middleCategory: selectedKeys[0],
                selectedKey: selectedKeys
            })
        }
        if (info.node.level === 1) {
            this.setState({
                bigCategory: selectedKeys[0],
                selectedKey: selectedKeys
            })
        }
        let value: IFIlterValue = {
            smallCategory: info.node.level === 3 ? selectedKeys[0] : '',
            middleCategory: info.node.level === 2 ? selectedKeys[0] : '',
            bigCategory: info.node.level === 1 ? selectedKeys[0] : '',
        }
        this.fetchMaterials(value)
    };
    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }


    /**
     * @description Wraps authority to data node
     * @param [authorities] 
     * @returns authority to data node 
     */
    protected wrapMaterialTree2DataNode(materials: (IMaterialTree & DataNode)[] = []): DataNode[] {
        materials.forEach((material: (IMaterialTree & DataNode)): void => {
            material.title = material.treeName;
            material.key = material.code;
            if (material.children && material?.children.length) {
                this.wrapMaterialTree2DataNode(material.children as (IMaterialTree & DataNode)[]);
            }
        });
        return materials;
    }



    //展开控制
    protected onExpand = (expandKeys: React.Key[]) => {
        this.setState({
            expandKeys,
            autoExpandParent: false,
        })
    }

    /**
     * @protected
     * @description Renders tab content
     * @param item 
     * @returns tab content 
     */
    protected renderTabContent(item: ITabItem): React.ReactNode {
        const { treeData } = this.state;
        return (
            <Row style={{ background: '#fff' }}>
                <Col span={4}>
                    <Card bordered={false}>
                        <Button onClick={() => {
                            this.setState({
                                selectedKey: []
                            })
                            this.fetchMaterials({}, {
                                current: 1,
                                pageSize: 10,
                                total: 0,
                                showSizeChanger: false
                            });
                        }}>全部</Button>
                        <Tree
                            onSelect={this.onSelect}
                            treeData={this.wrapMaterialTree2DataNode(treeData as (IMaterialTree & DataNode)[])}
                            expandedKeys={this.state.expandKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            onExpand={this.onExpand}
                            selectedKeys={this.state.selectedKey}
                        />
                    </Card>
                </Col>
                <Col span={20}>
                    {super.renderTabContent(item)}
                </Col>
            </Row>

        );
    }
}

export default withRouter(withTranslation()(MaterialMngt));