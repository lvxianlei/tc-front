
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Table, Checkbox, Space, Popconfirm, Tabs, Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import AbstractTabableComponent from '../../components/AbstractTabableComponent';
import { ITabItem } from '../../components/ITabableComponent';
import SummaryRenderUtil, { IRenderdSummariableItem, IRenderedGrid } from '../../utils/SummaryRenderUtil';
import RequestUtil from '../../utils/RequestUtil';
import ConfirmableButton from '../../components/ConfirmableButton';
import DictModal from './DictModal';

export interface IDictMngtProps {}
export interface IDictMngtWithRouteProps extends RouteComponentProps<IDictMngtProps>, WithTranslation {}
export interface IDictMngtState {
    readonly dict: IDictValue[];
    readonly visible: boolean;
    readonly editValue: string;
    readonly tab:IDictValue[];
}
interface IDictValue {
    readonly id: number,
    readonly name: string;
    readonly disable: boolean;
    readonly sort: number;
    readonly amount: number;
}

interface dictValue{
    readonly current: number ,
    readonly records: IDictValue[],
    readonly size: number,
    readonly total: number,
}

/**
 * Client Management
 */
class DictMngt extends AbstractTabableComponent<IDictMngtWithRouteProps, IDictMngtState> {

    constructor(props: IDictMngtWithRouteProps) {
        super(props)
        this.showModal = this.showModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    /**
      * @override
      * @description Gets state
      * @returns state 
      */
     public state: IDictMngtState = {
            dict: [],
            visible: false,
            editValue: '',
            tab:[],
    }
    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const dict: dictValue = await RequestUtil.get<dictValue>(`/system/dict`);
        this.setState({
            dict:dict.records
        });
    }

     /**
     * @description Gets charging record columns
     * @returns charging record columns 
     */
    public getChargingRecordColumns(): ColumnsType<object> {
        return [{
            title: '选项值名',
            dataIndex: 'name'
        }, {
            title: '排序',
            dataIndex: 'sort'
        }, {
            title: '启用',
            width:'10%',
            dataIndex: 'disable',
            render: (text, record): React.ReactNode => {
                console.log(text)
                return  <Checkbox  onChange={(e)=>{console.log(e)}} defaultChecked={text}/>;
            }
        }, {
            title: '操作',
            dataIndex: '',
            width:'10%',
            key: 'x',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => this.showModal(record)}>编辑</a>
                    <ConfirmableButton confirmTitle="要删除该数据吗？" type="link" placement="topRight" onConfirm={() => this.handleDelete(record)}>删除</ConfirmableButton>
                </Space>
              ),
        }];
    }
    public handleDelete = (record: Record<string,any>) => {
        const dict = [...this.state.dict];
        this.setState({ dict: dict.filter(item => item.id !== record.id) });
    };
    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
     public getTabItems(): ITabItem[] {
        const {dict} = this.state;
        // console.log(this.state.dict)
        return [{
            label: '产品',
            key: 1,
            content: SummaryRenderUtil.renderSections([{
                title: '产品类型',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()} dataSource={dict}/>
            }, {
                title: '电压等级',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()} dataSource={dict}/>
            }, {
                title: '计量单位',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()} dataSource={dict}/>
            }, {
                title: '材料标准',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()} dataSource={dict}/>
            }])
        },{
            label: '财务',
            key: 2,
            content: SummaryRenderUtil.renderSections([{
                title: '币种',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()} dataSource={dict}/>
            }, {
                title: '税率',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()} dataSource={dict}/>
            }, {
                title: '计价方式',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()}/>
            }, {
                title: '来款方式',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()}/>
            }])
        },{
            label: '其他',
            key: 3,
            content: SummaryRenderUtil.renderSections([{
                title: '客户类型',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()}/>
            }, {
                title: '中标类型',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()}/>
            }, {
                title: '销售类型',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()}/>
            }, {
                title: '文件类型',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()}/>
            }, {
                title: '合同级别',
                render: (): React.ReactNode => <Table columns={this.getChargingRecordColumns()}/>
            }])
        }];
    }

    public showModal(record: Record<string,any> ): void {
        this.setState({
            visible: true,
            editValue: record.name
        })
    }

    public closeModal(): void {
        this.setState({
            visible: false,
        })
    }
    public handleOk(value:string): void {
        console.log(value)
        this.setState({
            visible: false,
        })
    }
    public onFinish = (values:any) =>{ 
        this.handleOk(values)
    }
    public render(): React.ReactNode {
        const { editValue } = this.state;
        return (
            <>
            <Tabs { ...this.getTabsProps() }>
                {
                    this.getTabItems().map<React.ReactNode>((item: ITabItem): React.ReactNode => (
                        <>
                        <Tabs.TabPane tab={ item.label } key={ item.key }>
                            { item.content }
                        </Tabs.TabPane>
                        </>
                    ))
                }
            </Tabs>
            <DictModal visible={this.state.visible} handleCancel={this.closeModal} value={editValue} title={editValue?'修改选项':'新增选项'} {...this.props} onFinish={this.onFinish}/>
            </>
        );
    }
}

export default withRouter(withTranslation()(DictMngt));