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
import Item from "antd/lib/list/Item";
import { number } from "echarts";

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
                    ...res
                }
            }))
            form.setFieldsValue({
                data: result?.map((res: any) => {
                    return {
                        ...res,
                        planNumber: res?.planNumber?.split(',')
                    }
                })
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
                        {index === 0 ? null : <Select.Option key={'ditto'} value={0}>同上</Select.Option>}
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
                        {index === 0 ? null : <Select.Option key={'ditto'} value={0}>同上</Select.Option>}
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
                    <Select placeholder="请选择应用计划" mode="multiple" onChange={(e: any) => {
                        if (Array.from(e)?.findIndex(res => res === 'all') !== -1) {
                            form?.setFieldsValue({
                                data: form.getFieldsValue(true)?.data?.map((item: any, i: number) => {
                                    if (i === index) {
                                        return {
                                            ...item,
                                            planNumber: ['all', ...planNumbers?.map((e: any) => {
                                                return e
                                            }) || []]
                                        }
                                    } else {
                                        return item
                                    }

                                })
                            })
                        }
                        if (Array.from(e)?.findIndex(res => res === 0) !== -1) {
                            form?.setFieldsValue({
                                data: form.getFieldsValue(true)?.data?.map((item: any, i: number) => {
                                    if (i === index) {
                                        return {
                                            ...item,
                                            planNumber: [0]
                                        }
                                    } else {
                                        return item

                                    }
                                })
                            })
                        }
                    }}>
                        {index === 0 ? null : <Select.Option key={'ditto'} value={0}>同上</Select.Option>}
                        <Select.Option key={'all'} value={'all'}>全部</Select.Option>
                        {planNumbers && planNumbers.map((item: string, ind: number) => {
                            return <Select.Option key={ind} value={item}>
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
        if (index === 0) {
            const newValue = value.map((res: any, i: number) => {
                return {
                    ...res,
                    fileCategory: res?.fileCategory === 0 && i === 0 ? '' : res?.fileCategory,
                    fileType: res?.fileType === 0 && i === 0 ? '' : res?.fileType,
                    planNumber: res?.planNumber?.findIndex((res: any) => res === 0) === -1 && i === 0 ? res?.planNumber : []
                }
            })
            setUploadData([...newValue]);
            form.setFieldsValue({
                data: [...newValue]
            })
        } else {
            setUploadData([...value]);
            form.setFieldsValue({
                data: [...value]
            })
        }


    }

    const onSave = () => new Promise(async (resolve, reject) => {
        try {
            getLoading(true)
            form.validateFields().then(async res => {
                const value = await form.getFieldsValue(true)?.data || []
                await saveRun(value?.map((res: any) => {
                    return {
                        ...res,
                        planNumber: res?.planNumber?.findIndex((res: any) => res === 0) !== -1
                            ? value[value?.findIndex((item: any) => item?.planNumber?.findIndex((res: any) => res === 0) !== -1) - 1].planNumber?.filter((e: any) => e !== 'all')?.join(',')
                            : res?.planNumber?.filter((e: any) => e !== 'all')?.join(','),
                        fileCategory: res?.fileCategory === 0 ? value[value?.findIndex((item: any) => item?.fileCategory === 0) - 1].fileCategory : res?.fileCategory,
                        fileType: res?.fileType === 0 ? value[value?.findIndex((item: any) => item?.fileType === 0) - 1].fileType : res?.fileType,
                    }
                }))
                resolve(true);
            }).catch(e => {
                getLoading(false)
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
                getLoading(false)
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
                <Attachment multiple key={uploadData} ref={attachRef} isTable={false} dataSource={[]} onDoneChange={(dataInfo: FileProps[]) => {
                    const values = form.getFieldsValue(true).data || []
                    const data = [...dataInfo]?.map(res => {
                        return {
                            fileName: res?.originalName,
                            fileId: res?.id,
                            fileSuffix: res?.fileSuffix,
                            projectBackupId: projectBackupId
                        }
                    })
                    const newData = [
                        ...values || [],
                        ...data
                    ].map((item: any, index: number) => {
                        if (index === 0) {
                            return {
                                ...item,
                                fileCategory: item?.fileCategory ? item?.fileCategory : '',
                                fileType: item?.fileType ? item?.fileType : '',
                                planNumber: item?.planNumber?.length > 0 ? item?.planNumber : ['all', ...planNumbers?.map((e: any) => {
                                    return e
                                }) || []]
                            }
                        } else {
                            return {
                                ...item,
                                fileCategory: item?.fileCategory ? item?.fileCategory : 0,
                                fileType: item?.fileType ? item?.fileType : 0,
                                planNumber: item?.planNumber?.length > 0 ? item?.planNumber : [0]
                            }
                        }
                    })
                    setUploadData(newData);
                    form?.setFieldsValue({
                        data: newData
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
                dataSource={[...uploadData || []]}
            />
        </Form>
    </DetailContent>
})

