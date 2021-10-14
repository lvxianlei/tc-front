import React from 'react';
import { Button, Space, Modal, Form, FormInstance, Input, Popconfirm } from 'antd';
import { DetailContent, CommonTable, BaseInfo } from '../../../common';
import RequestUtil from '../../../../utils/RequestUtil';
import styles from './SetOut.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import useRequest from '@ahooksjs/use-request';

export interface QuestionnaireModalProps {}
export interface IQuestionnaireModalRouteProps extends RouteComponentProps<QuestionnaireModalProps>, WithTranslation {
    readonly record: IRecord;
    readonly title: string;
    readonly modalCancel: () => void;
    readonly visible: boolean;
}

interface QuestionnaireModalState {
    readonly description?: string;
}

interface IRecord {
    readonly id?: string;
    readonly problemField?: string;
    readonly originalData?: string;
}

const tableColumns = [
    { 
        key: 'index', 
        title: '序号', 
        dataIndex: 'index', 
        width: 50, 
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>) },
    {
        key: 'partBidNumber',
        title: '操作部门',
        dataIndex: 'partBidNumber', 
    },
    {  
        key: 'goodsType', 
        title: '操作人', 
        dataIndex: 'goodsType' 
    },
    { 
        key: 'goodsType', 
        title: '操作时间', 
        dataIndex: 'packageNumber' 
    },
    {
        key: 'goodsType', 
        title: '问题单状态', 
        dataIndex: 'amount' 
    },
    { 
        key: 'goodsType', 
        title: '备注', 
        dataIndex: 'unit' 
    }
]

class QuestionnaireModal extends React.Component<IQuestionnaireModalRouteProps, QuestionnaireModalState> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    
    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
    }
    
    constructor(props: IQuestionnaireModalRouteProps) {
        super(props)
    }

    public state: QuestionnaireModalState = {
        
    }

    protected submitQuestion(): void {
        this.getForm()?.validateFields().then(() => {
            console.log( this.props.record,this.getForm()?.getFieldsValue(true) )
        })
    }

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Modal
                visible={ this.props.visible } 
                width="50%" 
                title={ this.props.title }
                footer={ 
                    <Space direction="horizontal" size="small">
                        <Button type="primary" onClick={ () => this.props.modalCancel() } ghost>关闭</Button>
                        {this.props.title==='提交问题'?<Popconfirm
                            title="确认提交问题?"
                            onConfirm={ () => {} }
                            okText="确认"
                            cancelText="取消"
                        >   
                             <Button type="primary" onClick={ () => this.submitQuestion() }>提交问题</Button>
                        </Popconfirm>:null}
                    </Space> } 
                onCancel={ () => this.props.modalCancel() }
            >
                <DetailContent>
                    <p>问题信息</p>
                    <BaseInfo col={ 2 } columns={ [
                        {
                            "dataIndex": "projectName",
                            "title": "问题字段"
                        },
                        {
                            "dataIndex": "projectNumber",
                            "title": "原字段信息"
                        }]
                    } dataSource={ {
                        projectName: this.props.record.problemField,
                        projectNumber: this.props.record.originalData
                    } } />
                    <Form ref={ this.form } labelCol={{ span: 4 }} className={ styles.topPadding }>
                        <Form.Item name="a" label="备注">
                            <Input.TextArea maxLength={ 300 } placeholder="请输入备注信息" rows={ 1 } showCount disabled={this.props.title!=='提交问题'}/>
                        </Form.Item>
                        <Form.Item name="a" label="校对后信息"
                            rules={[{
                                required: true,
                                message: '请输入校对后信息 '
                            }]}>
                            <Input maxLength={ 100 } placeholder="请输入" disabled={this.props.title!=='提交问题'}/>
                        </Form.Item>
                    </Form>
                    <p className={ styles.topPadding }>操作信息</p>
                    <CommonTable columns={ tableColumns } dataSource={ [] } />
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(QuestionnaireModal))
