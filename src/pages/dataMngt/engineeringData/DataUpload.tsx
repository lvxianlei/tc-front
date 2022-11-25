/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-资料管理-工程资料管理-上传/编辑
 */

import React, { useImperativeHandle, forwardRef, useState, useRef } from "react";
import { Button, Form, Input, Select } from 'antd';
import { Attachment, CommonTable, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './EngineeringData.module.less';
import { AttachmentRef, FileProps } from "../../common/Attachment";
import { FixedType } from 'rc-table/lib/interface';
import { documentTypeOptions, fileTypeOptions } from "../../../configuration/DictionaryOptions";

interface modalProps {
    readonly projectBackupId?: string;
    readonly id?: string;
    readonly type?: 'new' | 'detail' | 'edit';
    getLoading: (loading: boolean) => void
}

export default forwardRef(function DataUpload({ type, getLoading, projectBackupId, id }: modalProps, ref) {
    const [form] = Form.useForm();
    const [uploadData, setUploadData] = useState<any>();
    const attachRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })

    const { data: planNumbers } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/projectData/planNumber/list/${projectBackupId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [projectBackupId, type] })


    const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/projectData/file?id=${id}`)
            setUploadData(result.map((res: any) => {
                return {
                    ...res,
                }
            }))
            form.setFieldsValue({
                data: result
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === 'new', refreshDeps: [projectBackupId, type] })

    const tableColumns = [
        {
            "key": "fileName",
            "title": "文件名",
            "dataIndex": "fileName"
        },
        {
            "key": "fileCategory",
            "title": "文件类别",
            "dataIndex": "fileCategory",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, 'fileCategory']} rules={[{
                    required: true,
                    message: '请选择文件类别'
                }]}>
                    <Select placeholder="请选择文件类别">
                        {documentTypeOptions && documentTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "fileType",
            "title": "文件类型",
            "dataIndex": "fileType",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, 'fileType']} rules={[{
                    required: true,
                    message: '请选择文件类型'
                }]}>
                    <Select placeholder="请选择文件类型">
                        {fileTypeOptions && fileTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "planNumber",
            "title": "应用计划",
            "dataIndex": "planNumber",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, 'planNumber']} rules={[{
                    required: true,
                    message: '请选择应用计划'
                }]}>
                    <Select placeholder="请选择应用计划">
                        {planNumbers && planNumbers.map((item: string, index: number) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "description",
            "title": "备注",
            "dataIndex": "description",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, 'description']}>
                    <Input.TextArea placeholder="请输入备注" size='small' maxLength={800} />
                </Form.Item>
            )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Button type="link" disabled={type !== 'new'} onClick={() => delRow(index)}>删除</Button>
            )
        }
    ]

    const delRow = (index: number) => {
        const value = form.getFieldsValue(true)?.data;
        value?.splice(index, 1);
        setUploadData([...value]);
        form.setFieldsValue({
            data: [...value]
        })
    }

    const onSave = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(async res => {

                const value = await form.getFieldsValue(true)?.data
                getLoading(true)
                console.log(value)
                resolve(true);
                await saveRun(value)
            }).catch(e => {
                reject(e)
            })

        } catch (error) {
            reject(false)
        }
    })

    const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            await RequestUtil.post(`/tower-science/projectData`, data).then(res => {
                resove(true)
            }).catch(e => {
                getLoading(false)
                reject(e)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const resetFields = () => {
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSave, resetFields }), [ref, onSave, resetFields]);


    return <DetailContent>
        {
            type === 'new' ?
                <Attachment ref={attachRef} isTable={false} dataSource={[]} onDoneChange={(dataInfo: FileProps[]) => {
                    console.log(dataInfo)
                    const values = form.getFieldsValue(true).data || []
                    const data = [...dataInfo]?.map(res => {
                        return {
                            fileName: res?.originalName,
                            fileId: res?.id,
                            fileSuffix: res?.fileSuffix,
                            projectBackupId: projectBackupId
                        }
                    })
                    setUploadData([
                        ...values || [],
                        ...data
                    ]);
                    form?.setFieldsValue({
                        data: [
                            ...values || [],
                            ...data
                        ]
                    })
                }}>
                    <Button type="primary" style={{ marginBottom: '16px' }} ghost>上传</Button>
                </Attachment>
                :
                null
        }
        <Form form={form} className={styles.upload_form}>
            <CommonTable
                pagination={false}
                columns={tableColumns}
                dataSource={uploadData || []}
            />
        </Form>
    </DetailContent>
})

