import React from 'react';
import { Button, Space, Modal, Form, FormInstance, Input, message } from 'antd';
import { DetailContent, CommonTable, BaseInfo } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './SetOut.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IRecord } from './ISetOut';

export interface QuestionnaireModalProps { }
export interface IQuestionnaireModalRouteProps extends RouteComponentProps<QuestionnaireModalProps>, WithTranslation {
    readonly record: IRecord;
    readonly title: string;
    readonly modalCancel: () => void;
    readonly visible: boolean;
    readonly update: () => void;
}

interface QuestionnaireModalState {
    readonly description?: string;
}

const tableColumns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    {
        key: 'createDeptName',
        title: '操作部门',
        dataIndex: 'createDeptName',
    },
    {
        key: 'createUserName',
        title: '操作人',
        dataIndex: 'createUserName'
    },
    {
        key: 'createTime',
        title: '操作时间',
        dataIndex: 'createTime'
    },
    {
        key: 'status',
        title: '问题单状态',
        dataIndex: 'status',
        render: (pattern: number): React.ReactNode => {
            switch (pattern) {
                case 1:
                    return '待修改';
                case 2:
                    return '已修改';
                case 0:
                    return '已拒绝';
                case 3:
                    return '已删除';
            }
        }
    },
    {
        key: 'description',
        title: '备注',
        dataIndex: 'description'
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

    protected submitQuestion(): void {
        this.getForm()?.validateFields().then(() => {
            const value = this.getForm()?.getFieldsValue(true);
            const record: IRecord = this.props.record;
            RequestUtil.post(`/tower-science/productStructure/issue`, {
                currentValue: record.currentValue,
                description: value.description,
                id: record.id,
                keyId: record.rowId,
                newValue: value.newValue,
                problemField: record.problemField,
                problemFieldName: record.problemFieldName
            }).then(res => {
                message.success('提交问题成功');
                this.props.modalCancel();
            });
        })
    }

    /**
    * @description Renders AbstractDetailComponent
    * @returns render 
    */
    public render(): React.ReactNode {
        const record: IRecord = this.props.record;
        this.getForm()?.setFieldsValue({ description: record.description, newValue: record.newValue });
        return <>
            <Modal
                visible={this.props.visible}
                width="50%"
                title={this.props.title}
                footer={
                    <Space direction="horizontal" size="small">
                        <Button type="primary" onClick={() => { this.props.modalCancel(); }} ghost>关闭</Button>
                        {record.status !== 1 ? <Button type="primary" onClick={() => this.submitQuestion()}>提交问题</Button> : null}
                    </Space>}
                onCancel={() => this.props.modalCancel()}
            >
                <DetailContent>
                    <p>问题信息</p>
                    <BaseInfo col={2} columns={[
                        {
                            "dataIndex": "problemFieldName",
                            "title": "问题字段"
                        },
                        {
                            "dataIndex": "currentValue",
                            "title": "原字段信息"
                        }]
                    } dataSource={{
                        problemFieldName: record.problemFieldName,
                        currentValue: record.currentValue
                    }} />
                    <Form ref={this.form} labelCol={{ span: 4 }} className={styles.topPadding}>
                        <Form.Item name="description" label="备注" initialValue={record.description}>
                            <Input.TextArea maxLength={300} placeholder="请输入备注信息" rows={1} showCount disabled={record.status === 1} />
                        </Form.Item>
                        {
                            ['apertureNumber','specialCode', 'electricWelding', 'bend', 'chamfer', 'shovelBack', 'rootClear', 'squash', 'openCloseAngle', 'perforate', 'groove', 'intersectingLine', 'slottedForm', 'grooveMeters', 'suppress', 'spellNumber', 'arcContaining', 'perforateNumber','withReaming','reamingNumber','gasCutting', 'gasCuttingNumber'].findIndex((value) => value === record.problemField) !== -1 ?
                            <Form.Item name="newValue" label="校对后信息"
                                    rules={[{
                                        pattern: /^[^\s]*$/,
                                        message: '禁止输入空格',
                                    }, ...record?.rules]}
                                    initialValue={record.newValue}>
                                    <Input maxLength={100} placeholder="请输入" disabled={record.status === 1} />
                                </Form.Item>
                                :
                                <Form.Item name="newValue" label="校对后信息"
                                    rules={[{
                                        required: true,
                                        message: '请输入校对后信息 '
                                    }, {
                                        pattern: /^[^\s]*$/,
                                        message: '禁止输入空格',
                                    }]}
                                    initialValue={record.newValue}>
                                    <Input maxLength={100} placeholder="请输入" disabled={record.status === 1} />
                                </Form.Item>
                        }

                    </Form>
                    <p className={styles.topPadding}>操作信息</p>
                    <CommonTable columns={tableColumns} dataSource={record.issueRecordList} padination={false} />
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(QuestionnaireModal))
