
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
import styles from './DictMngt.module.less';
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = SortableElement((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />);
const SortableCon = SortableContainer((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableSectionElement> & React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />);


export interface IDictMngtProps {}
export interface IDictMngtWithRouteProps extends RouteComponentProps<IDictMngtProps>, WithTranslation {}
export interface IDictMngtState {
    readonly dict: IDictValue[];
    readonly visible: boolean;
    readonly editValue: string;
    readonly type: string;
    readonly tab: IDictValue[];
}
interface IDictValue {
    readonly id: number;
    readonly name: string;
    readonly disable: boolean;
    readonly sort: number;
    readonly amount: number;
    readonly type: number;
}

interface IDictResponseData {
    readonly current: number ;
    readonly records: IDictValue[];
    readonly size: number;
    readonly total: number;
    readonly id: number;
    readonly name: string;
    readonly disable: boolean;
    readonly sort: number;
    readonly amount: number;
    readonly type: number;
}

/**
 * Dict Management
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
            editValue: '',//弹框值
            tab:[],    //tab页
            type: '',    //类型
    }
    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const dict: IDictResponseData = await RequestUtil.get<IDictResponseData>(`/system/dict`);
        this.setState({
            dict:dict.records,   //内容
            tab: dict.records,   //tab标签
        });
    }

     /**
     * @description Gets charging record columns
     * @returns charging record columns 
     */
    public getChargingRecordColumns(res:IDictValue): ColumnsType<object> {
        return [{
            title: '选项值名',
            dataIndex: 'name'
        }, {
            title: '排序',
            dataIndex: 'sort',
            width:'10%',
            className: 'drag-visible',
            render: () => <DragHandle />,
        }, {
            title: '启用',
            width:'10%',
            dataIndex: 'disable',
            render: (text, record): React.ReactNode => {
                return  <Checkbox  onChange={(e)=>{console.log(e)}} defaultChecked={text}/>;
            }
        }, {
            title: '操作',
            dataIndex: '',
            width:'10%',
            key: 'x',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => this.showModal(record,res.name)}>编辑</a>
                    <ConfirmableButton confirmTitle="要删除该数据吗？" type="link" placement="topRight" onConfirm={() => this.handleDelete(record)}>删除</ConfirmableButton>
                </Space>
              ),
        }];
    }

    //delete-row
    public handleDelete = (record: Record<string,any>) => {
        //接口
        console.log(record)
    };
    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
     public getTabItems(): ITabItem[] {
        const {dict,tab} = this.state;
        // console.log(this.state.dict)
        return tab.map<ITabItem>((item:IDictValue)=>{
            return {
                label:item.name,
                key:item.id,
                content: SummaryRenderUtil.renderSections(
                     dict.map((res:IDictValue)=>{
                        return {
                            title:'',
                            render:(): React.ReactNode => 
                            <div>
                                <div className={styles.title}>
                                <span>{res.name}</span>
                                <Button type='primary'onClick={()=>this.showModal({name:''},res.name)}>新增</Button>
                                </div>
                                <Table 
                                    columns={this.getChargingRecordColumns(res)} 
                                    dataSource={dict}
                                    rowKey="sort"
                                    components={{
                                        body: {
                                          wrapper: this.DraggableContainer,
                                          row: this.DraggableBodyRow,
                                        },
                                    }}
                                />
                            </div>
                        }
                     }
                ))
            }
        })
        
    }

    public onSortEnd = (props:any) => {
        const {oldIndex,newIndex} = props;
        const { dict } = this.state;
        if (oldIndex !== newIndex) {
          const newData = arrayMove(dict, oldIndex, newIndex).filter(el => !!el);
          console.log('Sorted items: ', newData);
          this.setState({ dict: newData });
        }
    }

    public DraggableContainer = (props:IDictMngtWithRouteProps) => (
        <SortableCon
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={this.onSortEnd}
            {...props}
        />
    );
    
    public DraggableBodyRow = ({ ...restProps }) => {
        const { dict } = this.state;
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = dict.findIndex(x => x.sort === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps}  />;
    };





    public showModal(record: Record<string,any> ,res:string): void {
        this.setState({
            visible: true,
            editValue: record.name,
            type:res
        })
    }
    //closeModal
    public closeModal(): void {
        this.setState({
            visible: false,
        })
    }
    //ok
    public handleOk(value:string): void {
        console.log(value, this.state.type)
        this.setState({
            visible: false,
        })
    }
    //Modal-Value
    public onFinish = (values:any) =>{ 
        this.handleOk(values)
    }


    public onChange = async(activeKey:string)=>{
        console.log(activeKey)
        const dict: IDictResponseData = await RequestUtil.get<IDictResponseData>(`/system/dict`);
        this.setState({
            dict:dict.records
        })
        
    }
    public render(): React.ReactNode {
        const { editValue } = this.state;
        return (
            <>
             <Tabs { ...this.getTabsProps() } onChange={this.onChange}>
                {
                    this.getTabItems().map<React.ReactNode>((item: ITabItem): React.ReactNode => (
                        <Tabs.TabPane tab={ item.label } key={ item.key }>
                            { item.content }
                        </Tabs.TabPane>
                    ))
                }
            </Tabs>
            <DictModal visible={this.state.visible} handleCancel={this.closeModal} value={editValue} title={editValue?'修改选项':'新增选项'} {...this.props} onFinish={this.onFinish}/>
            </>
        );
        
    }
}

export default withRouter(withTranslation()(DictMngt));