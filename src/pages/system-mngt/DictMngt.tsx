import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Table, Checkbox, Space, Tabs, Button, Modal, Form, Input, TabsProps, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import AbstractTabableComponent from '../../components/AbstractTabableComponent';
import { ITabItem } from '../../components/ITabableComponent';
import SummaryRenderUtil from '../../utils/SummaryRenderUtil';
import RequestUtil from '../../utils/RequestUtil';
import ConfirmableButton from '../../components/ConfirmableButton';
import styles from './DictMngt.module.less';
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { CustomizeComponent } from 'rc-table/es/interface';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

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
    readonly selectedTab: string;
    readonly selectedValue: IDictDataSource;
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
    category?: string
    type?: string
    name?: string		
    readonly createTime?: string	
    readonly createUser?: number	
    readonly id?: number	
    readonly isDeleted?: number	
    readonly sort?: number	
    readonly status?: number	
    readonly tenantId?: string
    readonly updateTime?: string	
    readonly updateUser?: number
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
        editValue: '', //弹框值
        tabs:[], //tab页
        type: '', //类型
        selectedTab:'',
        selectedValue: {}, //当前行
    }


    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const dictTabsResponse: IDictTabsData[] = await RequestUtil.get<IDictTabsData[]>(`/tower-system/dictionary/types`);
        this.getDataSourceFromTab(dictTabsResponse[0].code);
        this.setState({
            tabs: dictTabsResponse,   //tab标签
            selectedTab: dictTabsResponse[0].code, //当前tab
        });
    }

    //根据tab获取内容
    public async getDataSourceFromTab(code:string){
        const dictDataSourceResponse: IDictDataSourceData[] = await RequestUtil.get<IDictDataSourceData[]>(`/tower-system/dictionary/types/${code}`);
        this.setState({
            dictDataSource:dictDataSourceResponse,   //内容
        })
    }
   
    //刷新
    public async updateTab(code:string){
        const dictTabsResponse: IDictTabsData[] = await RequestUtil.get<IDictTabsData[]>(`/tower-system/dictionary/types`);
        this.getDataSourceFromTab(code);
        this.setState({
            tabs: dictTabsResponse,   //tab标签
        });
    }

    /**
     * @description Gets charging record columns
     * @returns charging record columns 
     *     record.status === 3 的时候控制排序/启用/操作不展示
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
            render: (text, record:Record<string,any>) => {
                return record.status !== 3 && <DragHandle />
            },
        }, {
            title: '启用',
            width:'10%',
            dataIndex: 'status',
            render: (text, record:Record<string,any>): React.ReactNode => {
                return record.status !== 3 && <Checkbox  
                            onChange={async (e)=>{
                                let values = {
                                    id:record.id,
                                    sort: record.sort,
                                    status: e.target.checked ? 1 : 2
                                }
                                if(e.target.checked!==e.target.defaultChecked){
                                    await RequestUtil.put(`/tower-system/dictionary/updateSortOrEnable`,[values]);
                                    this.getDataSourceFromTab(this.state.selectedTab);
                                }
                            }} 
                            defaultChecked={ text === 1 }
                        />;
            }
        }, {
            title: '操作',
            dataIndex: '',
            width:'10%',
            render: (text, record:Record<string,any>) => {
                return record.status !== 3 && <Space size="middle">
                    <a onClick={() => this.showModal(record,res)}>编辑</a>
                    <ConfirmableButton confirmTitle="要删除该数据吗？" type="link" placement="topRight" onConfirm={() => this.handleDelete(record)}>删除</ConfirmableButton>
                </Space>
            }   
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
                    dictDataSource.map((res: IDictDataSourceData, index: number) => {
                        return {
                            title:'',
                            render:(): React.ReactNode => 
                            <div style={{margin:'-20px 0px'}}>
                                <div className={styles.title}>
                                    <span style={{fontSize:'16px', fontWeight:'bold'}}>{res.name}</span>
                                    <Button type='primary' onClick={()=>this.showModal({name:''},res)} style={{marginBottom:'8px'}}>新增</Button>
                                </div>
                                <Table 
                                    columns={this.getChargingRecordColumns(res)} 
                                    dataSource={res.dictionaries}
                                    rowKey="id"
                                    components={{
                                        body: {
                                          wrapper: this.draggableContainer(index),
                                          row: this.draggableBodyRow(index),
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
    public handleDelete = async(record: Record<string,any>) => {
        //接口
        await RequestUtil.delete(`/tower-system/dictionary?dictionaryId=${record.id}`)
        this.updateTab(this.state.selectedTab)
    };


    //drag-after-dictDataSource
    public onSortEnd = (index: number) =>{
        return async (props: { oldIndex: number; newIndex: number; }) => {
            const { oldIndex, newIndex } = props;
            const { dictDataSource } = this.state;
            if (oldIndex !== newIndex) {
                const newDictDataSource = dictDataSource.map((item:IDictDataSourceData)=>{
                    const newData = arrayMove(item.dictionaries,oldIndex, newIndex).filter(el => !!el);
                    item.dictionaries = newData;
                    return item
                })
                await RequestUtil.put(`/tower-system/dictionary/updateSortOrEnable`,newDictDataSource[index].dictionaries);
                this.setState({ dictDataSource: newDictDataSource });
            }
        }
    }   



    //drag-container
    public draggableContainer = (index: number):CustomizeComponent =>{
        return  (props:IDictMngtWithRouteProps) => (
            <SortableCon
                useDragHandle
                disableAutoscroll
                helperClass="row-dragging"
                onSortEnd={this.onSortEnd(index)}
                {...props}
            />
        );
    } 


    //drag-item
    public draggableBodyRow = (index: number):CustomizeComponent => {
        return ({ ...restProps }) => {
            const { dictDataSource } = this.state;
            const num = dictDataSource.map(item=>{
                return item.dictionaries.findIndex(x => x.id === restProps['data-row-key'])
            })
            return <SortableItem index={num[index]} {...restProps}  />;
        };
    }


    //modal-show
    public showModal(record: Record<string,any> ,res:IDictDataSourceData): void {
        this.setState({
            visible: true,
            editValue: record.name,
            type:res.code,
            selectedValue: record,
        })
    }
    //modal-close
    public closeModal(): void {
        this.setState({
            visible: false,
        })
    }
    
    //modal-value
    public onFinish = async ( values: IDictDataSource ) =>{
        const { selectedValue } = this.state; 
        // 控制状态
        this.setState({
            visible: false,
        })
        // 定义状态
        let flag = false;
        selectedValue.id?await RequestUtil.put('/tower-system/dictionary', {
            ...selectedValue,
            name: values.name
        }).then(()=>{
            message.warn('刷新或退出重新登录，即可生效！')
        }).catch((error) => {
            console.log(error, "================>>>")
            flag = true
        }):await RequestUtil.post('/tower-system/dictionary', {
            type: this.state.selectedTab,
            category: this.state.type,
            name: values.name
        }).then(()=>{
            message.warn('刷新或退出重新登录，即可生效！')
        });
        // 更新数据
        flag && this.updateTab(this.state.selectedTab);
    }

    //tab-change-tableDataSource
    public onChange = async(activeKey:string)=>{
        this.setState({
            selectedTab: activeKey
        })
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
                    rules={[{required: true, message: '请填写选项值名！',whitespace: true}]} 
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