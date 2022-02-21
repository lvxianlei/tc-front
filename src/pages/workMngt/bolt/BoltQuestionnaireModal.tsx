import React from 'react';
import { Button, Space, Modal, Form, FormInstance, Input, message, Select, InputNumber } from 'antd';
import { DetailContent, CommonTable, BaseInfo } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './BoltList.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { boltTypeOptions } from '../../../configuration/DictionaryOptions';

export interface BoltQuestionnaireModalProps { }
export interface IBoltQuestionnaireModalRouteProps extends RouteComponentProps<BoltQuestionnaireModalProps>, WithTranslation {
    readonly record: IRecord;
    readonly title: string;
    readonly modalCancel: () => void;
    readonly visible: boolean;
    readonly update: () => void;
    readonly productCategory: string;
}

interface BoltQuestionnaireModalState {
    readonly description?: string;
}

export interface IRecord {
    readonly id?: string;
    readonly problemField?: string;
    readonly originalData?: string;
    readonly description?: string;
    readonly newValue?: string;
    readonly issueRecordList?: [];
    readonly status?: number;
    readonly dataIndex?: string;
    readonly rowId?: string;
    readonly currentValue?: string;
    readonly problemFieldName?: string;
    readonly dataSource?: [];
}

const columns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 100,
        editable: false,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => {
            return <span>{index + 1}</span>
        }
    },
    {
        key: 'type',
        title: '类型',
        width: 150,
        dataIndex: 'type',
        editable: true,
    },
    {
        key: 'name',
        title: '名称',
        width: 150,
        dataIndex: 'name',
        editable: true
    },
    {
        key: 'level',
        title: '等级',
        width: 150,
        dataIndex: 'level',
        editable: true
    },
    {
        key: 'specs',
        title: '规格',
        width: 150,
        dataIndex: 'specs',
        editable: true
    },
    {
        key: 'unbuckleLength',
        title: '无扣长（mm）',
        dataIndex: 'unbuckleLength',
        width: 120,
        editable: true
    },
    {
        key: 'subtotal',
        title: '小计',
        width: 120,
        dataIndex: 'subtotal',
        editable: true
    },
    {
        key: 'total',
        title: '合计',
        width: 120,
        dataIndex: 'total',
        editable: true
    },
    {
        key: 'singleWeight',
        title: '单重（kg）',
        dataIndex: 'singleWeight',
        width: 120,
        editable: true
    },
    {
        key: 'totalWeight',
        title: '合计重（kg）',
        width: 120,
        dataIndex: 'totalWeight',
        editable: false
    }
]

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
                case 3:
                    return '已拒绝';
                case 4:
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

const columnsSetting = columns.map(col => {
    return {
        ...col,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            col.dataIndex === 'index' ? index + 1
                : !col.editable ? _
                    : <p className={checkColor(record, col.dataIndex) === 'red' ? styles.red : checkColor(record, col.dataIndex) === 'green' ? styles.green : checkColor(record, col.dataIndex) === 'yellow' ? styles.yellow : ''}>{_ === -1 ? "" : _}</p>
        )
    }
})

const checkColor = (record: Record<string, any>, dataIndex: string) => {
    const red: number = record.redColumn.indexOf(dataIndex);
    const green: number = record.greenColumn.indexOf(dataIndex);
    const yellow: number = record.yellowColumn.indexOf(dataIndex);
    if (red !== -1) {
        return 'red';
    } else if (green !== -1) {
        return 'green';
    } else if (yellow !== -1) {
        return 'yellow';
    } else {
        return 'normal'
    }
}

class BoltQuestionnaireModal extends React.Component<IBoltQuestionnaireModalRouteProps, BoltQuestionnaireModalState> {

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
            RequestUtil.post(`/tower-science/boltRecord/saveIssue`, {
                currentValue: record.currentValue,
                description: value.description,
                id: record.id,
                keyId: record.rowId,
                newValue: value.newValue,
                problemField: record.problemField,
                problemFieldName: record.problemFieldName,
                productCategory: this.props.productCategory
            }).then(res => {
                message.success('提交问题成功');
                this.props.modalCancel();
                this.props.update();
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
                className={styles.boltModal}
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
                            ['wealth'].findIndex((value) => value === record.problemField) !== -1 ?
                                <Form.Item name="newValue" label="校对后信息"
                                    rules={[{
                                        required: true,
                                        message: '请输入校对后信息'
                                    }]}
                                    initialValue={record.newValue}>
                                    <InputNumber max={9999} style={{ width: '100%' }} placeholder="请输入" disabled={record.status === 1} />
                                </Form.Item>
                                :
                                <Form.Item name="newValue" label="校对后信息"
                                    rules={[{
                                        required: true,
                                        message: '请输入校对后信息'
                                    }]}
                                    initialValue={record.newValue}>
                                    {record.problemFieldName === '类型' ? <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                                        {boltTypeOptions && boltTypeOptions.map(({ id, name }, index) => {
                                            return <Select.Option key={index} value={name}>
                                                {name}
                                            </Select.Option>
                                        })}
                                    </Select> : <Input maxLength={100} placeholder="请输入" disabled={record.status === 1} />}
                                </Form.Item>
                        }

                    </Form>
                    {record.status === 1 ? <CommonTable columns={columnsSetting} dataSource={this.props.record.dataSource} pagination={false} /> : null}
                    <p className={styles.topPadding}>操作信息</p>
                    <CommonTable columns={tableColumns} dataSource={record.issueRecordList} />
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(BoltQuestionnaireModal))
