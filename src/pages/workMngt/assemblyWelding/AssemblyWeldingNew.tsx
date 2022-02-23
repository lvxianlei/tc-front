import React from 'react';
import { Button, Space, Modal, Input, Row, Col, FormInstance, Form, Popconfirm, InputNumber, Radio, message, Select } from 'antd';
import { DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './AssemblyWelding.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { FixedType } from 'rc-table/lib/interface';
import { ISegmentNameList } from './AssemblyWeldingListing';

export interface AssemblyWeldingNewProps { }
export interface IAssemblyWeldingNewRouteProps extends RouteComponentProps<AssemblyWeldingNewProps>, WithTranslation {
    readonly id: number | string;
    readonly name: string;
    readonly segmentId?: string | number;
    readonly record?: IBaseData;
    readonly productCategoryId: string;
    readonly updateList: () => void;
    readonly visible: boolean;
    readonly modalCancel: () => void;
    readonly segmentNameList: ISegmentNameList[]
}

export interface AssemblyWeldingNewState {
    readonly visible: boolean;
    readonly selectVisible: boolean;
    readonly componentList?: IComponentList[];
    readonly selectedRows?: [];
    readonly selectedRowKeys?: [];
    readonly weldingDetailedStructureList?: IComponentList[];
    readonly baseData?: IBaseData;
    readonly mainPartId?: string;
    readonly settingData?: IComponentList[];
}

export interface IComponentList {
    readonly basicsWeight?: number;
    readonly id?: string;
    readonly basicsPartNumNow?: number;
    readonly weldingLength?: number;
    readonly singleNum?: number;
    readonly isMainPart?: number;
    readonly structureId?: string;
    readonly surplusNum?: number;
}

export interface IBaseData {
    readonly segmentName?: string;
    readonly singleGroupWeight?: number;
    readonly componentId?: string;
    readonly electricWeldingMeters?: number;
    readonly mainPartId?: string;
    readonly id?: string;
}

class AssemblyWeldingNew extends React.Component<IAssemblyWeldingNewRouteProps, AssemblyWeldingNewState> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
    }

    public state: AssemblyWeldingNewState = {
        visible: false,
        selectVisible: false
    }

    private modalCancel(): void {
        this.props.modalCancel();
        this.getForm()?.resetFields();
    }

    public async componentDidMount() {
        if (this.props.name === '编辑') {
            const data: IComponentList[] = await RequestUtil.get(`/tower-science/welding/getStructureById`, { segmentId: this.props.segmentId });
            this.setState({
                weldingDetailedStructureList: [...data],
                baseData: this.props.record,
                mainPartId: this.props.record?.mainPartId,
                settingData: [...data]
            })
            this.getForm()?.setFieldsValue({ ...this.props.record })
        } else {
            this.setState({
                weldingDetailedStructureList: []
            })
        }
    }

    /**
     * @protected
     * @description 点击选择获取构件明细列表 
     */
    protected getComponentList = () => {
        if (this.getForm()) {
            this.getForm()?.validateFields(['segmentName']).then(async res => {
                const weldingDetailedStructureList = this.state.weldingDetailedStructureList || [];
                const settingData = this.state.settingData || [];
                let data: IComponentList[] = await RequestUtil.get(`/tower-science/welding/getStructure`, {
                    segmentName: this.getForm()?.getFieldsValue(true).segmentName,
                    productCategoryId: this.props.productCategoryId
                });
                if (this.props.name === '编辑') {
                    settingData.forEach((items: IComponentList) => {
                        data = data.map((item: IComponentList) => {
                            if (items.structureId === item.id) {
                                console.log(Number(item.basicsPartNumNow || 0) + Number(items.singleNum || 0))
                                return {
                                    ...item,
                                    basicsPartNumNow: Number(item.basicsPartNumNow || 0) + Number(items.singleNum || 0)
                                }
                            } else {
                                return {
                                    ...item,
                                    basicsPartNumNow: Number(item.basicsPartNumNow || 0)
                                }
                            }
                        })
                    })
                }
                let newData: IComponentList[] = data?.filter((item: IComponentList) => {
                    return weldingDetailedStructureList.every((items: IComponentList) => {
                        if (items.singleNum === item.basicsPartNumNow) {
                            return item.id !== items.structureId;
                        } else {
                            return item
                        }
                    })
                })
                weldingDetailedStructureList.forEach((items: IComponentList, index: number) => {
                    newData = newData.map((item: IComponentList) => {
                        console.log(item)
                        if (item.id === items.structureId) {
                            const num = (this.state.settingData && this.state.settingData[index]?.singleNum) || 0;
                            const now = !!(items.id && items.id?.length > 0) ? Number(item.basicsPartNumNow || 0) - Number(items.singleNum || 0) + num : Number(item.basicsPartNumNow || 0) - Number(items.singleNum || 0)
                            return {
                                ...item,
                                basicsPartNumNow: now,
                                totalWeight: Number(now || 0) * Number(item.basicsWeight || 0)
                            };
                        } else {
                            return {
                                ...item,
                                totalWeight: Number(item.basicsPartNumNow || 0) * Number(item.basicsWeight || 0)
                            }
                        }
                    })
                })
                this.setState({
                    componentList: [...newData],
                    selectVisible: true
                })
            })
        }
    }

    /**
     * @protected
     * @description 构件明细列表确认显示在构件信息
     */
    protected selectComponent = () => {
        let weldingDetailedStructureList: IComponentList[] = this.state.weldingDetailedStructureList || [];
        let componentList: IComponentList[] = this.state.selectedRows || [];
        let weight: number = this.getForm()?.getFieldsValue(true).singleGroupWeight;
        let weldingLength: number = 0;
        const selectedRows = this.state.selectedRows || [];
        componentList.forEach((item: IComponentList) => {
            weight = Number(weight || 0) + (Number(item.basicsWeight) || 0) * (Number(item.singleNum) || 1);
        })
        let newComponentList: IComponentList[] = componentList?.filter((item: IComponentList) => {
            return weldingDetailedStructureList.every((items: IComponentList) => {
                return item.id !== items.structureId;
            })
        })
        newComponentList = newComponentList.map((item: IComponentList) => {
            return {
                ...item,
                id: '',
                segmentId: this.props.segmentId,
                structureId: item.id,
                singleNum: 1,
                weldingLength: 0,
                isMainPart: 0
            }
        })
        selectedRows.forEach((items: IComponentList) => {
            weldingDetailedStructureList = weldingDetailedStructureList.map((item: IComponentList) => {
                if (item.structureId === items.id) {
                    return {
                        ...item,
                        singleNum: Number(item.singleNum) + 1,
                        basicsPartNumNow: Number(items.basicsPartNumNow || 0)
                    }
                } else {
                    return {
                        ...item,
                        basicsPartNumNow: Number(items.basicsPartNumNow || 0)
                    }
                }
            })
        })
        weldingDetailedStructureList.forEach((item: IComponentList) => {
            weldingLength = weldingLength + (Number(item.singleNum) || 1) * Number(item.weldingLength || 0);
        })
        this.getForm()?.setFieldsValue({ 'singleGroupWeight': weight, 'electricWeldingMeters': weldingLength });
        this.setState({
            selectVisible: false,
            weldingDetailedStructureList: [...weldingDetailedStructureList, ...newComponentList],
            selectedRowKeys: [],
            selectedRows: []
        })
    }

    /**
     * @protected
     * @description 构件信息移除行 
     */
    protected removeRow = (index: number) => {
        let weldingDetailedStructureList: IComponentList[] = this.state.weldingDetailedStructureList || [];
        weldingDetailedStructureList?.splice(index, 1);
        let weight: number = 0;
        let electricWeldingMeters: number = 0;
        weldingDetailedStructureList.forEach((item: IComponentList) => {
            weight = Number(weight || 0) + (Number(item.basicsWeight) || 0) * (Number(item.singleNum) || 1);
            electricWeldingMeters = Number(electricWeldingMeters || 0) + (Number(item.singleNum) || 0) * Number(item.weldingLength || 0);
        })
        this.getForm()?.setFieldsValue({ 'singleGroupWeight': weight, 'electricWeldingMeters': electricWeldingMeters });
        this.setState({
            weldingDetailedStructureList: [...weldingDetailedStructureList]
        })
    }

    protected save = () => {
        if (this.getForm()) {
            this.getForm()?.validateFields().then(res => {
                const weldingDetailedStructureList = this.state.weldingDetailedStructureList;
                const values = this.getForm()?.getFieldsValue(true);
                if (weldingDetailedStructureList && weldingDetailedStructureList?.filter(item => item && item['isMainPart'] === 1).length < 1) {
                    message.warning('请选择主件');
                } else {
                    const value = {
                        weldingId: this.props.id,
                        id: this.props.segmentId,
                        ...this.props.record,
                        ...values,
                        mainPartId: this.state.mainPartId,
                        weldingDetailedStructureList: [...(weldingDetailedStructureList || [])]
                    }
                    if (value.electricWeldingMeters > 0) {
                        RequestUtil.post(`/tower-science/welding`, { ...value }).then(res => {
                            message.success('添加成功');
                            this.setState({
                                visible: false
                            });
                            this.props.updateList();
                        })
                    } else {
                        message.warning('电焊米数需大于0');
                    }
                }
            })
        }
    }

    protected columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: '零件号',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: '材料',
            dataIndex: 'materialName',
            key: 'materialName'
        },
        {
            title: '材质',
            dataIndex: 'structureTexture',
            key: 'structureTexture'
        },
        {
            title: '规格',
            dataIndex: 'structureSpec',
            key: 'structureSpec'
        },
        {
            title: '长',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '宽',
            dataIndex: 'width',
            key: 'width'
        },
        {
            title: '单组件数',
            dataIndex: 'singleNum',
            key: 'singleNum',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <InputNumber
                    key={record.structureId + record.singleNum}
                    defaultValue={record.singleNum}
                    onChange={(e) => {
                        const weldingDetailedStructureList: IComponentList[] = this.state.weldingDetailedStructureList || [];
                        const singleGroupWeight = this.getForm()?.getFieldsValue(true).singleGroupWeight;
                        const electricWeldingMeters = this.getForm()?.getFieldsValue(true).electricWeldingMeters;
                        weldingDetailedStructureList[index] = {
                            ...weldingDetailedStructureList[index],
                            singleNum: Number(e)
                        }
                        this.setState({
                            weldingDetailedStructureList: [...weldingDetailedStructureList]
                        })
                        this.getForm()?.setFieldsValue({ 'singleGroupWeight': Number(singleGroupWeight) - Number(record.singleNum) * Number(record.basicsWeight) + Number(e) * Number(record.basicsWeight), 'electricWeldingMeters': Number(electricWeldingMeters) - Number(record.weldingLength) * Number(record.singleNum) + Number(record.weldingLength) * Number(e) });
                    }}
                    bordered={false}
                    max={record.id ? Number(record.surplusNum || 0) + Number((this.state.settingData && this.state.settingData[index]?.singleNum) || 0) : Number(record.basicsPartNumNow || 0)}
                    min={1}
                />
            )
        },
        {
            title: '电焊长度（mm）',
            dataIndex: 'weldingLength',
            key: 'weldingLength',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Input type="number" min={0} key={record.structureId} defaultValue={record.weldingLength} onChange={(e) => {
                    const weldingDetailedStructureList: IComponentList[] = this.state.weldingDetailedStructureList || [];
                    const electricWeldingMeters = this.getForm()?.getFieldsValue(true).electricWeldingMeters;
                    weldingDetailedStructureList[index] = {
                        ...weldingDetailedStructureList[index],
                        weldingLength: Number(e.target.value)
                    }
                    this.setState({
                        weldingDetailedStructureList: [...weldingDetailedStructureList]
                    })
                    this.getForm()?.setFieldsValue({ 'electricWeldingMeters': Number(electricWeldingMeters) - Number(record.weldingLength) * Number(record.singleNum) + Number(e.target.value) * Number(record.singleNum) });
                }} bordered={false} />
            )
        },
        {
            title: '备注',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: '是否主件',
            dataIndex: 'isMainPart',
            key: 'isMainPart',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Radio key={record.structureId} checked={this.state.weldingDetailedStructureList && this.state.weldingDetailedStructureList[index].isMainPart === 1} onChange={(e) => {
                    let weldingDetailedStructureList: IComponentList[] = this.state.weldingDetailedStructureList || [];
                    if (e.target.checked) {
                        this.setState({
                            mainPartId: record.code
                        })
                        weldingDetailedStructureList = weldingDetailedStructureList.map((item: IComponentList, ind: number) => {
                            if (index === ind) {
                                return {
                                    ...item,
                                    isMainPart: 1
                                }
                            } else {
                                return {
                                    ...item,
                                    isMainPart: 0
                                }
                            }
                        })
                    } else {
                        weldingDetailedStructureList[index] = {
                            ...weldingDetailedStructureList[index],
                            isMainPart: 0
                        }
                    }
                    this.setState({
                        weldingDetailedStructureList: [...weldingDetailedStructureList]
                    })
                }}></Radio>
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Popconfirm
                    title="确认移除?"
                    onConfirm={() => this.removeRow(index)}
                    okText="移除"
                    cancelText="取消"
                >
                    <Button type="link">移除</Button>
                </Popconfirm>
            )
        }
    ]

    protected componentColumns = [
        {
            title: '段名',
            dataIndex: 'segmentName',
            key: 'segmentName'
        },
        {
            title: '构件编号',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: '材料名称',
            dataIndex: 'materialName',
            key: 'materialName'
        },
        {
            title: '材质',
            dataIndex: 'structureTexture',
            key: 'structureTexture'
        },
        {
            title: '规格',
            dataIndex: 'structureSpec',
            key: 'structureSpec'
        },
        {
            title: '单段件数',
            dataIndex: 'basicsPartNumNow',
            key: 'basicsPartNumNow'
        },
        {
            title: '长度',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '宽度',
            dataIndex: 'width',
            key: 'width'
        },
        {
            title: '单件重量（kg）',
            dataIndex: 'basicsWeight',
            key: 'basicsWeight'
        },
        {
            title: '小计重量（kg）',
            dataIndex: 'totalWeight',
            key: 'totalWeight'
        },
        {
            title: '备注',
            dataIndex: 'description',
            key: 'description'
        }
    ]

    /**
    * @description Renders AbstractDetailComponent
    * @returns render 
    */
    public render(): React.ReactNode {
        return <>
            <Modal
                visible={this.props.visible}
                width="50%"
                title={this.props.name}
                footer={<Space direction="horizontal" size="small" className={styles.bottomBtn}>
                    <Button type="ghost" onClick={() => this.modalCancel()}>关闭</Button>
                    <Button type="primary" onClick={() => this.save()} ghost>确定</Button>
                </Space>}
                onCancel={() => this.modalCancel()}
            >
                <DetailContent>
                    <p>组焊信息</p>
                    <Form ref={this.form}>
                        <Row>
                            <Col span={10}>
                                <Form.Item name="segmentName" label="段号" rules={[{
                                    "required": true,
                                    "message": "请输入段号"
                                }]} initialValue={this.state.baseData?.segmentName}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} onChange={() => {
                                        this.setState({
                                            weldingDetailedStructureList: []
                                        })
                                    }} >
                                        {this.props.segmentNameList.map((item: any) => {
                                            return <Select.Option key={item.id} value={item.name}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12} offset={2}>
                                <Form.Item name="singleGroupWeight" label="单组重量（kg）" rules={[{
                                    "required": true,
                                    "message": "请输入单组重量"
                                }]} initialValue={this.state.baseData?.singleGroupWeight}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <Form.Item name="componentId" label="组件号" rules={[{
                                    "required": true,
                                    "message": "请输入组件号"
                                }, {
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]} initialValue={this.state.baseData?.componentId}>
                                    <Input placeholder="请输入" maxLength={10} />
                                </Form.Item>
                            </Col>
                            <Col span={12} offset={2}>
                                <Form.Item name="electricWeldingMeters" label="电焊米数（mm）" rules={[{
                                    "required": true,
                                    "message": "请输入电焊米数"
                                }]} initialValue={this.state.baseData?.electricWeldingMeters || 0}>
                                    <Input placeholder="请输入" disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <p className={styles.topPadding}>构件信息<Button type="primary" onClick={() => this.getComponentList()} className={styles.btnright} ghost>选择</Button></p>
                    <CommonTable
                        columns={this.columns}
                        dataSource={[...(this.state.weldingDetailedStructureList || [])]}
                        pagination={false}
                    />
                </DetailContent>
            </Modal>
            <Modal
                visible={this.state.selectVisible}
                width="60%"
                title="构件明细"
                footer={<Space direction="horizontal" size="small" className={styles.bottomBtn}>
                    <Button type="ghost" onClick={() => this.setState({ selectVisible: false })}>关闭</Button>
                    <Button type="primary" onClick={() => this.selectComponent()} ghost>确定</Button>
                </Space>}
                onCancel={() => this.setState({ selectVisible: false })}
            >
                <CommonTable
                    haveIndex
                    columns={this.componentColumns}
                    dataSource={this.state.componentList}
                    pagination={false}
                    rowSelection={{
                        selectedRowKeys: this.state.selectedRowKeys || [],
                        onChange: (selectedKeys: [], selectedRows: []) => {
                            this.setState({
                                selectedRows: selectedRows,
                                selectedRowKeys: selectedKeys
                            })
                        },
                        getCheckboxProps: (record: Record<string, any>) => ({
                            disabled: Number(record.basicsPartNumNow) === 0
                        })
                    }}
                />
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(AssemblyWeldingNew))
