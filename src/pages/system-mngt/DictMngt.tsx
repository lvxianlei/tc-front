import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Table, Checkbox, Space, Tabs, Button, Modal, Form, Input, TabsProps } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import AbstractTabableComponent from '../../components/AbstractTabableComponent';
import { ITabItem } from '../../components/ITabableComponent';
import SummaryRenderUtil from '../../utils/SummaryRenderUtil';
import RequestUtil from '../../utils/RequestUtil';
import ConfirmableButton from '../../components/ConfirmableButton';
import styles from './DictMngt.module.less';
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = SortableElement((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />);
const SortableCon = SortableContainer((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableSectionElement> & React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />);


export interface IDictMngtProps {}
export interface IDictMngtWithRouteProps extends RouteComponentProps<IDictMngtProps>, WithTranslation {}
export interface IDictMngtState {
    readonly dictDataSource: IDictDataSourceData[];
    readonly visible: boolean;
    readonly editValue: string;
    readonly type: string;
    readonly tabs: IDictTabsData[];
}

interface IDictTabsData {
    readonly code: string;	
    readonly name: string,		
    readonly parentCode: string,	
    readonly sort: number,
}

interface IDictDataSourceData {
    readonly code: string;	
    readonly name: string;
    dictionaries: IDictDataSource[];
}

interface IDictDataSource {
    readonly category: string	
    readonly createTime: string	
    readonly createUser: number	
    readonly id: number	
    readonly isDeleted:	number	
    readonly name: string	
    readonly sort: number	
    readonly status: number	
    readonly tenantId: string	
    readonly type: string		
    readonly updateTime: string	
    readonly updateUser: number
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
        dictDataSource: [],
        visible: false,
        editValue: '',//弹框值
        tabs:[],    //tab页
        type: '',    //类型
    }


    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const dictTabsResponse: IDictTabsData[] = await RequestUtil.get<IDictTabsData[]>(`/tower-system/dictionary/types`);
        // const dictDataSourceResponse: IDictDataSourceData[] = await RequestUtil.get<IDictDataSourceData[]>(`/tower-system/dictionary/types/${dictTabsResponse[0].code}`);
        this.getDataSourceFromTab(dictTabsResponse[0].code);
        this.setState({
            tabs: dictTabsResponse,   //tab标签
        });
    }

    //根据tab获取内容
    public async getDataSourceFromTab(code:string){
        const dictDataSourceResponse: IDictDataSourceData[] = await RequestUtil.get<IDictDataSourceData[]>(`/tower-system/dictionary/types/${code}`);
        this.setState({
            dictDataSource:dictDataSourceResponse,   //内容
        })
    }
    /**
     * @description Gets charging record columns
     * @returns charging record columns 
     */
    public getChargingRecordColumns(res:IDictDataSourceData): ColumnsType<object> {
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
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => this.showModal(record,res.name)}>编辑</a>
                    <ConfirmableButton confirmTitle="要删除该数据吗？" type="link" placement="topRight" onConfirm={() => this.handleDelete(record)}>删除</ConfirmableButton>
                </Space>
              ),
        }];
    }
    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
     public getTabItems(): ITabItem[] {
        const {dictDataSource, tabs} = this.state;
        return tabs.map<ITabItem>((item:IDictTabsData)=>{
            return {
                label:item.name,
                key:item.code,
                content: SummaryRenderUtil.renderSections(
                    dictDataSource.map((res:IDictDataSourceData)=>{
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
                                    dataSource={res.dictionaries}
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
        
    };


    //delete-row
    public handleDelete = (record: Record<string,any>) => {
        //接口
        console.log(record)
    };


    //drag-after-dictDataSource
    public onSortEnd = (props: { oldIndex: number; newIndex: number; }) => {
        const {oldIndex,newIndex} = props;
        const { dictDataSource } = this.state;
        if (oldIndex !== newIndex) {
          const newDictDataSource = dictDataSource.map((item:IDictDataSourceData)=>{
              const newData = arrayMove(item.dictionaries,oldIndex, newIndex).filter(el => !!el);
              item.dictionaries = newData;
              return item
          })
          console.log('Sorted items: ', newDictDataSource);
          this.setState({ dictDataSource: newDictDataSource });
        }
    }

    //drag-container
    public DraggableContainer = (props:IDictMngtWithRouteProps) => (
        <SortableCon
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={this.onSortEnd}
            {...props}
        />
    );

    //drag-item
    public DraggableBodyRow = ({ ...restProps }) => {
        const { dictDataSource } = this.state;
        const index = dictDataSource.map(item=>{
              return item.dictionaries.findIndex(x => x.sort === restProps['data-row-key'])
        })
        return <SortableItem index={index[0]} {...restProps}  />;
    };


    //modal-show
    public showModal(record: Record<string,any> ,res:string): void {
        this.setState({
            visible: true,
            editValue: record.name,
            type:res
        })
    }
    //modal-close
    public closeModal(): void {
        this.setState({
            visible: false,
        })
    }
    
    //modal-value
    public onFinish = (values:string) =>{ 
        console.log(values, this.state.type)
        this.setState({
            visible: false,
        })
    }

    //tab-change-tableDataSource
    public onChange = async(activeKey:string)=>{
        this.getDataSourceFromTab(activeKey);
    }

    //tab--fun-change
    protected getTabsProps(): TabsProps {
        return {
            ...super.getTabsProps(),
            onChange: this.onChange
        };
    }
    

    public render(): React.ReactNode {
        const { editValue, visible } = this.state;
        return (
            <>
            { super.render() }
            {visible && <Modal 
                title={ editValue? '修改选项' : '新增选项' } 
                visible={ visible } 
                footer={ null } 
                onCancel={ this.closeModal }
            >
               <Form onFinish={ this.onFinish }>
                <Form.Item
                    name="name"
                    label="选项值名"
                    rules={[{ required: true, message: '请填写选项值名！' }]} 
                    initialValue={ editValue }
                >
                    <Input placeholder="请填写选项值名"/>
                </Form.Item>
                <Button type="primary" htmlType="submit">保存</Button>
                <Button onClick={this.closeModal}>取消</Button>
                </Form>
            </Modal>}
            </>
        );
        
    }



}
export default withRouter(withTranslation()(DictMngt));