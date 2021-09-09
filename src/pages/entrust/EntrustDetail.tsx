/**
 * @author lxy
 * @copyright © 2021 
 */
import { DeleteOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Form,
    FormProps,
    Input,
    Row,
    Space,
    Steps,
    Table,
    TableColumnType,
    Card,
    FormInstance,
    List,
    FormItemProps,
    ColProps,
    message,
    DatePicker,
    Progress,
    Select,
} from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { IRenderedSection, ISection } from '../../utils/SummaryRenderUtil';
import styles from '../../components/AbstractFillableComponent.module.less';
import layoutStyles from '../../layout/Layout.module.less';
import entrustStyles from './Entrust.module.less';
import RequestUtil from '../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { withTranslation, WithTranslation } from 'react-i18next';
import AbstractTitledRouteComponent from '../../components/AbstractTitledRouteComponent';
import moment from 'moment';
import DeliveryAcceptance from './DeliveryAcceptance';
const { Step } = Steps
  
export interface IAbstractEntrustSettingState {
    message: string;
    readonly entrust?: IEntrust;
}
interface IAuthoritableFormItemProps extends FormItemProps {
    readonly authority?: string;
}
export interface IFormItemGroup extends ISection {
    readonly itemProps: IAuthoritableFormItemProps[];
    readonly itemCol?: ColProps;
}

export interface IAbstractEntrustSettingProps {
    readonly id: string;
}
export interface IEntrustSettingRouteProps extends RouteComponentProps<IAbstractEntrustSettingProps>, WithTranslation {}
 
 
export interface IEntrust {
    readonly id?: number;
    readonly createUser?: number;	
    readonly confirmationTime?: string;
    readonly createTime?: string;
    readonly description?: string;	
    readonly endTime?:	string;	
    readonly projectApprovalTime?: string;		
    readonly projectEndTime?:string;	
    readonly projectName?: string;	
    readonly projectNum?: string;
    readonly projectStartTime?: string;	
    readonly splitTime?: string;
    readonly updateTime?: string;
    readonly attachVoList?: IAttachVo[];	
    readonly entrustMessageVoList?: IEntrustMessageVo[];
    readonly status?: number;
    readonly productOverallProgressVoList?: ITowerModelVO[];
}
 
export interface IEntrustMessageVo {
    readonly createTime?: string;	
    readonly message?:	string;
    readonly userName?:	string;
}
export interface ITowerModelVO{
    readonly productCategoryName: string;
    readonly sectionNum: number;
    readonly examineSectionNum: number;
    readonly status: number;
    readonly giveTime: string;
    readonly id: string;
}

export interface IAttachVo {
    readonly id?: number | string;
    readonly name?:	string;
    readonly fileUploadTime?: string;
    readonly fileSuffix?: string;
    readonly fileSize?: number;	
    readonly filePath?:	string;
    readonly description?: string;
}
 
enum EntrustStatus {
    TO_BE_RELEASED = 1, //待发布
    TO_BE_RECEIVED = 2, //待接收
    TO_BE_APPROVAL = 3, //待立项
    UNDER_REVIEW = 4, //审核中
    HAVE_IN_HAND = 5, //进行中
    COMPLETED = 6, //已完成
}



 /**
  * Abstract Entrust Setting
  */
 class AbstactEntrustDetail extends AbstractTitledRouteComponent<IEntrustSettingRouteProps, IAbstractEntrustSettingState>  {

    private formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    
    public state: IAbstractEntrustSettingState = {
        entrust: {},
        message: '',
    }  as IAbstractEntrustSettingState;

    constructor(props: IEntrustSettingRouteProps) {
        super(props)
    }
    /**
         * @description Components did mount
         */
    public async componentDidMount() {
        super.componentDidMount();
        const entrust: IEntrust = await RequestUtil.get<IEntrust>(`/tp-task-dispatch/entrust/${ this.props.match.params.id }`);
        this.setState({
            entrust
        });
        this.formRef?.current?.setFieldsValue(entrust)
    }
    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return '/outsource/entrust';
    }
 
    /**
     * @override
     * @description Gets form props
     * @returns form props 
     */
    protected getFormProps(): FormProps {
        return {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 16
            }
        };
    }
 
    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const entrust: IEntrust | undefined = this.state.entrust;
        return[
            [{
                title: '基础信息',
                itemCol: {
                    span: 8
                },
                itemProps: [
                    {
                        label: '工程名称',
                        name: 'projectName',
                        initialValue: entrust?.projectName,
                        rules: [
                            {
                                required: true,
                                message: '请输入工程名称'
                            }
                        ],
                        children: <Input disabled value={entrust?.projectName}/>
                    },  {
                        label: '工程周期',
                        name: 'projectTime',
                        initialValue: [moment(entrust?.projectStartTime), moment(entrust?.projectEndTime)],
                        rules: [{
                            required: true,
                            message: '请选择工程周期'
                        }],
                        children: <DatePicker.RangePicker disabled/>
                    }, {
                        label: '工程状态',
                        name: 'status',
                        initialValue: entrust?.status,
                        children: 
                                <Select disabled>
                                    <Select.Option value={ 1 }>待发布</Select.Option>
                                    <Select.Option value={ 2 }>待接收</Select.Option>
                                    <Select.Option value={ 3 }>待立项</Select.Option>
                                    <Select.Option value={ 4 }>审核中</Select.Option>
                                    <Select.Option value={ 5 }>进行中</Select.Option>
                                    <Select.Option value={ 6 }>已完成</Select.Option>
                                </Select>
                    }
                ]
            }]
        ];
    }

    /**
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        let extra = [{
            title:'附件',
            render:():React.ReactNode => {
                return (
                    <Table 
                        columns={this.columns()} 
                        dataSource={ this.state.entrust?.attachVoList } 
                        rowKey={( record: IAttachVo ) => record?.id? record?.id : ''}
                    />
                )
            }
        }];
        if(this.state.entrust?.status == EntrustStatus.HAVE_IN_HAND || this.state.entrust?.status == EntrustStatus.COMPLETED){
            extra.push({
                title:'塔进度信息',
                render:():React.ReactNode => {
                    return this.state.entrust && this.state.entrust.productOverallProgressVoList && this.state.entrust.productOverallProgressVoList.map((item:ITowerModelVO)=>{
                        return (
                            <div className={ entrustStyles.tower }>
                                <div className={ entrustStyles.tower_title }>
                                    <div>{item.productCategoryName}</div>
                                    <div>({ this.getStatus(item.status) })</div>
                                </div>
                                <Progress percent={Math.round((Number(item.examineSectionNum)/Number(item.sectionNum))*100)} status="active" />
                            </div>
                        )
                    })
                    
                }
            })
        }
        if(this.state.entrust?.status == EntrustStatus.COMPLETED){
            extra.push({
                title:'塔进度信息',
                render:():React.ReactNode => {
                    return this.state.entrust && this.state.entrust.productOverallProgressVoList && this.state.entrust.productOverallProgressVoList.map((item:ITowerModelVO)=>{
                        return (
                            <div className={ entrustStyles.tower }>
                                <div className={ entrustStyles.tower_title }>
                                    <Button type='link'>{``}</Button>
                                    <DeliveryAcceptance id={ ''} productCategoryId={ item.id } entrustId={ '' } getTable={ () => {} } btnName={`${ item.productCategoryName }(${ item.giveTime })`} type='detail' key={item.id}/>
                                </div>
                                <Progress percent={ Math.round((Number(item.examineSectionNum)/Number(item.sectionNum)))*100 } status="active" />
                            </div>
                        )
                    })
                    
                }
            })
        }
        return extra
    }
    
    //获取状态
    protected getStatus(item: number){
        let statusTitle = '进行中';
        switch(item){
            case EntrustStatus.TO_BE_RELEASED:
                statusTitle = '进行中';
                break
            case EntrustStatus.TO_BE_RECEIVED:
                statusTitle = '进行中'
                break
            case EntrustStatus.TO_BE_APPROVAL:
                statusTitle = '放样完成'
                break
            case EntrustStatus.UNDER_REVIEW:
                statusTitle = '无审核人'
                break
            case EntrustStatus.HAVE_IN_HAND:
                statusTitle = '审核中'
                break
            case EntrustStatus.COMPLETED:
                statusTitle = '待交付'
                break
            case 6:
                statusTitle = '已交付'
                break
            case 7:
                statusTitle = '待客户验收'
                break
            case 8:
                statusTitle = '客户已验收'
                break
        }
        return statusTitle
    }
    //table-column
    public columns(): TableColumnType<IAttachVo>[] {
        return [
            {
                title: '文件名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '文件格式',
                dataIndex: 'fileSuffix',
                key: 'fileSuffix',
            },
            { 
                title: '上传时间', 
                dataIndex: 'fileUploadTime', 
                key: 'fileUploadTime' 
            },
            {
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: ( record: IAttachVo ): React.ReactNode => 
                    <Button onClick={()=>{
                        window.open(record.filePath)
                    }}>
                        下载
                    </Button>
            },
        ];
    }

    /**
         * @protected
         * @description Renders form items
         * @param items 
         * @param itemIndex 
         * @returns form items 
         */
    protected renderFormItems(items: IFormItemGroup[], itemIndex: number): React.ReactNode {
        return (
            <div key={ itemIndex }>
                {
                    items.map<React.ReactNode>((group: IFormItemGroup): React.ReactNode => (
                        <React.Fragment key={ group.title }>
                            <div className={ styles.title }>{ group.title }</div>
                            {
                                group.itemCol
                                ?
                                <Row gutter={ 24 }>
                                {
                                    group.itemProps.map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
                                        <Col span={ group.itemCol?.span } key={ `${ props.name }_${ index }` }>
                                            <Form.Item { ...props }/>
                                        </Col>
                                    ))
                                }
                                </Row>
                                :
                                group.itemProps.map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
                                    <Form.Item key={ `${ props.name }_${ index }` } { ...props }/>
                                ))
                            }
                        </React.Fragment>
                    ))
                }
            </div>
        );
    }

    //留言
    public onChange = (e: { target: { value: string; }; }) => {
        this.setState({
            message: e.target.value
        })
    };


    public render() {
        const { entrust } = this.state;
        let current = 0;
        if(entrust?.createTime){
            current = 1;
        }
        if(entrust?.confirmationTime){
            current = 2;
        }
        if(entrust?.splitTime){
            current = 3;
        }
        if(entrust?.projectApprovalTime){
            current = 4;
        }
        if(entrust?.endTime){
            current = 5;
        }
        const formItemGroups: IFormItemGroup[][] = this.getFormItemGroups();
        return (
            <Row justify="space-around">
                 <Col span={17} >
                    <Card title='委托详情' id='card1' className={ entrustStyles.card_part_left }>
                        <Steps current={current} className={ entrustStyles.card_steps } >
                            <Step title="工程委托" description={ entrust?.createTime?.split(' ')[0] }/>
                            <Step title="委托确认" description={ entrust?.confirmationTime?.split(' ')[0] }/>
                            <Step title="委托拆分" description={ entrust?.splitTime?.split(' ')[0] }/>
                            <Step title="立项成功" description={ entrust?.projectApprovalTime?.split(' ')[0] }/>
                            <Step title="委托完成" description={ entrust?.endTime?.split(' ')[0] }/>
                        </Steps>
               
                        <Form { ...this.getFormProps() } ref={ this.formRef }>
                            <Space size="large" direction="vertical" className={ `${ layoutStyles.width100 } ${ styles.space }` }>
                                <Space size="middle" direction="horizontal" className={ `${ layoutStyles.width100 } ${ styles.hspace }` }>
                                    {
                                        formItemGroups.map<React.ReactNode>((items: IFormItemGroup[], itemIndex: number): React.ReactNode => this.renderFormItems(items, itemIndex))
                                    }
                                </Space>
                                    {
                                        this.renderExtraSections().map<React.ReactNode>((section: IRenderedSection): React.ReactNode => (
                                            <React.Fragment key={ section.title }>
                                                <div className={ styles.title }>{ section.title }</div>
                                                { section.render.call(this) }
                                            </React.Fragment>
                                        ))
                                    }
                            </Space>
                        </Form>
              
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className={entrustStyles.card_part_right} title="客户留言" id='card2' >
                       {this.state.entrust?.status!==6?
                       <> 
                            <Row id='row1'>
                                <TextArea rows={ 5 } onChange={this.onChange} className={ entrustStyles.text } value={this.state.message}/>
                            </Row>
                            <Row>
                                <Button 
                                    type="primary" 
                                    className={ entrustStyles.text_button } 
                                    onClick={async ()=>{
                                        if(this.state.message){
                                            let values = {
                                                message: this.state.message,
                                                entrustId: this.props.match.params.id
                                            }
                                            await RequestUtil.post('/tp-task-dispatch/entrustMessage', values).then(async ()=>{
                                                const entrust: IEntrust = await RequestUtil.get<IEntrust>(`/tp-task-dispatch/entrust/${ this.props.match.params.id }`);
                                                this.setState({
                                                    entrust,
                                                    message:''
                                                });
                                            });
                                        }
                                        else{
                                            message.error('请填写客户留言')
                                        }
                                    }}
                                >
                                    留言
                                </Button>
                            </Row>
                        </>:null}
                        <Row>
                            <List
                                size="large"
                                className={ this.state.entrust?.status !== EntrustStatus.COMPLETED ? entrustStyles.card_part_right_list : entrustStyles.card_part_right_list1 }
                                dataSource={ entrust?.entrustMessageVoList }
                                renderItem={ (item: IEntrustMessageVo) => 
                                    <List.Item>
                                        <List.Item.Meta
                                            title = { item.userName }
                                            description = { item.message }
                                        />
                                        <div>{ item.createTime }</div>
                                    </List.Item> 
                                }
                            />
                        </Row>
                    </Card>
                </Col>
            </Row>
        );
        
    }
 }   
 export default withRouter(withTranslation()(AbstactEntrustDetail));