import React, { forwardRef, useState } from 'react';
import { Button, Space, Modal, Form, Input, Select } from 'antd';
import { DetailContent, Attachment, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import { FileProps } from '../../common/Attachment';
import styles from './SetOut.module.less';

export interface UploadModalProps { }
export interface IUploadModalRouteProps {
    readonly id: number | string;
    readonly updateList?: () => void;
    readonly path: string;
}

export interface UploadModalState {
    readonly visible: boolean;
    readonly loading: boolean;
    readonly description?: string;
    readonly data?: IData;
}

interface IFile extends FileProps {
    readonly name?: string;
    readonly segmentName?: string
    readonly type?: string
}

interface IData {
    readonly attachInfoVOList?: [];
    readonly productSegmentId?: string;
    readonly productSegmentRecordVOList?: [];
}

export default forwardRef(function ({
    id = '',
    path = '',
    updateList = () => { }
}: IUploadModalRouteProps, ref): JSX.Element {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [list, setList] = useState<IFile[]>([]);

    const modalCancel = (): void => {
        setVisible(false);
        setList([]);
        form.resetFields();
    }

    const modalShow = (): void => {
        setVisible(true);
    }

    const delRow = (index: number) => {
        const data = form.getFieldsValue(true).data;
        data.splice(index, 1);
        setList(data);
    }

    const save = () => {
        if (form) {
            setLoading(true)
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true).data;
                value = value.map((res: IFile) => {
                    return {
                        fileVo: res,
                        productCategoryId: id,
                        segmentName: res.segmentName,
                        type: res?.type
                    }
                })
                RequestUtil.post(path, [...value]).then(res => {
                    setLoading(false)
                    setVisible(false);
                    updateList();
                    setList([]);
                    form.resetFields();
                }).catch(e => {
                    setLoading(false)
                })
            }).catch(e => {
                setLoading(false)
                console.log(e)
            })
        }
    }

    return <>
        <Button type="primary" onClick={() => modalShow()} ghost>上传</Button>
        <Modal
            visible={visible}
            width="40%"
            title="上传"
            footer={<Space direction="horizontal" size="small">
                <Button type="ghost" onClick={() => modalCancel()}>关闭</Button>
                <Button type="primary" loading={loading} onClick={save} ghost>确定</Button>
            </Space>}
            onCancel={() => modalCancel()}
            className={styles.uploadModal}
        >
            <DetailContent>
                <Attachment maxCount={99} isTable={false} onDoneChange={(attachs: FileProps[]) => {
                    let data = form.getFieldsValue(true).data || [];
                    const newData = attachs.map((res: Record<string, any>) => {
                        const name = res.originalName;
                        const reg = /\((.+?)\)/g;
                        const codeList = (name.match(reg) || [])[0]?.replace(/\(|\)/g, '')?.split(',');
                        let segmentGroupName = '';
                        let partLabelRange = '';
                        codeList?.forEach((e: string) => {
                            if (RegExp(/#/).exec(e)) {
                                partLabelRange = partLabelRange + ',' + e?.replace(/#/g, '');
                            } else {
                                segmentGroupName = segmentGroupName + ',' + e
                            }
                        });
                        return {
                            segmentName: segmentGroupName?.slice(1) || '',
                            ...res
                        }
                    })
                    setList([...data, ...newData]);
                    form.setFieldsValue({ data: [...data, ...newData] });
                }} />
                <Form form={form} className={styles.uploadBtn}>
                    <CommonTable columns={[
                        {
                            key: 'originalName',
                            title: '附件名称',
                            dataIndex: 'originalName',
                            width: 300
                        },
                        {
                            key: 'type',
                            title: '类型',
                            dataIndex: 'type',
                            width: 150,
                            render: (_: undefined, record: Record<string, any>, index: number
                            ): React.ReactNode => (
                                <Form.Item name={['data', index, 'type']} rules={[{
                                    required: true,
                                    message: '请选择类型'
                                }]}>
                                    <Select placeholder="请选择类型" size='small'>
                                        <Select.Option value={1}>模型</Select.Option>
                                        <Select.Option value={2}>样图</Select.Option>
                                        <Select.Option value={3}>工艺卡</Select.Option>
                                    </Select>
                                </Form.Item>
                            )
                        },
                        {
                            key: 'segmentName',
                            title: '段信息',
                            dataIndex: 'segmentName',
                            width: 150,
                            render: (_: undefined, record: Record<string, any>, index: number
                            ): React.ReactNode => (
                                <Form.Item name={['data', index, 'segmentName']} rules={[{
                                    required: true,
                                    message: '请输入段信息 '
                                }]}>
                                    <Input placeholder="请输入段信息" size='small' maxLength={50} />
                                </Form.Item>
                            )
                        },
                        {
                            key: 'operation',
                            title: '操作',
                            dataIndex: 'operation',
                            width: 150,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Space direction="horizontal" size="small">
                                    <Button type="link" onClick={() => delRow(index)}>删除</Button>
                                </Space>
                            )
                        }
                    ]}
                        dataSource={list || []}
                        pagination={false}
                    />
                </Form>
            </DetailContent>
        </Modal>
    </>
})
