/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-资料管理-工程资料管理-上传/编辑
 */

 import React, { useImperativeHandle, forwardRef, useState, useRef } from "react";
 import { Button, Descriptions, Form, Input, Select } from 'antd';
 import { Attachment, BaseInfo, CommonTable, DetailContent } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './EngineeringData.module.less';
import { AttachmentRef, FileProps } from "../../common/Attachment";
import { FixedType } from 'rc-table/lib/interface';
import { productTypeOptions } from "../../../configuration/DictionaryOptions";
 
 interface modalProps {
     readonly record?: any;
     readonly type?: 'new' | 'detail' | 'edit';
     getLoading: (loading:boolean) => void
 }
 
 export default forwardRef(function DataUpload({ record, type, getLoading }: modalProps, ref) {
     const [form] = Form.useForm();
     const [uploadData, setUploadData] = useState<any>([{
        id: '444'
     }]);
     const attachRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
 
     const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         try {
             const result: any = await RequestUtil.get(``)
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: type === 'new', refreshDeps: [record, type] })
  
     const tableColumns= [
        {
            "key": "repairNumber",
            "title": "文件名",
            "dataIndex": "repairNumber"
        },
        {
            "key": "status",
            "title": "文件类别",
            "dataIndex": "status",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, 'segmentName']} rules={[{
                    required: true,
                    message: '请选择文件类别'
                }]}>
                <Select placeholder="请选择文件类别">
                {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                    return <Select.Option key={index} value={id}>
                        {name}
                    </Select.Option>
                })}
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "repairTime",
            "title": "文件类型",
            "dataIndex": "repairTime",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, 'segmentName']} rules={[{
                    required: true,
                    message: '请选择文件类型'
                }]}>
                <Select placeholder="请选择产品类型">
                {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                    return <Select.Option key={index} value={id}>
                        {name}
                    </Select.Option>
                })}
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "wasteProductReceiptNumber",
            "title": "应用计划",
            "dataIndex": "wasteProductReceiptNumber",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, 'segmentName']} rules={[{
                    required: true,
                    message: '请选择文件类型'
                }]}>
                <Select placeholder="请选择产品类型">
                <Select.Option value={''} key="0">全部</Select.Option>
                {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                    return <Select.Option key={index} value={id}>
                        {name}
                    </Select.Option>
                })}
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "productTypeName",
            "title": "备注",
            "dataIndex": "productTypeName",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, 'segmentName']}>
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
            render: (_: undefined, record: Record<string, any>,index: number): React.ReactNode => (
                    <Button type="link" onClick={() => delRow(index)}>删除</Button>
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
             const value = await form.validateFields();
             
             getLoading(true)
             console.log(value)
             await saveRun({
                 ...value
             })
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
 
     const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
         try {
             await RequestUtil.post(`/tower-science/trialAssembly/save`, data).then(res => {
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
        <Attachment multiple ref={attachRef} isTable={false} dataSource={[]} onDoneChange={(dataInfo: FileProps[]) => {
                console.log(dataInfo)
                setUploadData([...dataInfo])
            }}><Button type="primary" style={{marginBottom: '16px'}} ghost>上传</Button></Attachment>
            <Form form={form} className={styles.upload_form}>
         <CommonTable 
         columns={tableColumns}
         dataSource={uploadData || []}
         />
         </Form>
     </DetailContent>
 })
 
 