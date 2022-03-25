/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-杆塔配段-包装清单-套用包
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Spin, Form, Input, Space, Button } from 'antd';
 import { CommonTable, DetailContent } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
import { IPackingList } from "./ISetOut";
import styles from './SetOut.module.less';

 interface ApplyPackingProps {
     id: string;
 }

 export interface EditProps {
    onSubmit: () => void
}
 export default forwardRef(function ApplyPacking({ id }: ApplyPackingProps, ref) {
     const [form] = Form.useForm();
     const [dataSource, setDataSource]=useState<IPackingList[]>([]);
     const [packingData, setPackingData]=useState<IPackingList[]>([]);
     const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
     
     const towerColumns = [
         {
        "key": "length",
        "title": "计划号",
        "dataIndex": "length",
        "width": 150
    },
        {
            "key": "length",
            "title": "工程名称",
            "dataIndex": "length",
            "width": 150
        },
        {
            "key": "length",
            "title": "塔型",
            "dataIndex": "length",
            "width": 120
        },
        {
            "key": "length",
            "title": "杆塔号",
            "dataIndex": "length",
            "width": 120
        },
        {
            "key": "length",
            "title": "呼高",
            "dataIndex": "length",
            "width": 80
        }
     ]

     const packingColumns = [
        {
       "key": "length",
       "title": "包名",
       "dataIndex": "length",
       "width": 150
   },
       {
           "key": "length",
           "title": "包类型",
           "dataIndex": "length",
           "width": 150
       },
       {
           "key": "length",
           "title": "包属性",
           "dataIndex": "length",
           "width": 150
       },
       {
           "key": "length",
           "title": "包段落",
           "dataIndex": "length",
           "width": 150
       }
    ]
 
     const { loading } = useRequest(() => new Promise(async (resole, reject) => {
         try {
            getTableDataSource();
            resole(true)
         } catch (error) {
             reject(error)
         }
     }), { refreshDeps: [id] })

     const getTableDataSource = (filterValues?: Record<string, any>) => new Promise(async (resole, reject) => {
        const list = await RequestUtil.get<IPackingList[]>(``, { ...filterValues });
        setDataSource(list);
    });

     const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
         try {
             const result = await RequestUtil.post(``, postData);
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onSubmit = () => new Promise(async (resolve, reject) => {
         try {
             await saveRun(selectedRowKeys)
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
 
     const resetFields = () => {
         form.resetFields();
     }
 
     const handleChange = (selectedRowKeys: string[], selectRows: []) => {
        setSelectedRowKeys(selectedRowKeys)
    }

    const getPackingList = (id: string) => new Promise(async (resole, reject) => {
        const list = await RequestUtil.get<IPackingList[]>(``);
        setPackingData(list);
    });
    

     useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

 
     return <Spin spinning={loading}>
         <DetailContent style={{padding: '16px'}}>
         <Form 
            form={form} 
            layout="inline" 
            style={{paddingBottom: '16px'}} 
            onFinish={(value: Record<string, any>) => getTableDataSource(value)}
        >
             <Form.Item name="materialSpec" label="工程名称">
                            <Input placeholder="请输入" maxLength={100} />
                        </Form.Item>
                        <Form.Item name="materialSpec" label="计划号">
                            <Input placeholder="请输入" maxLength={100} />
                        </Form.Item>
                        <Form.Item name="materialSpec" label="塔型">
                            <Input placeholder="请输入" maxLength={100} />
                        </Form.Item>
                        <Form.Item name="materialSpec" label="杆塔号">
                            <Input placeholder="请输入" maxLength={100} />
                        </Form.Item>
                        <Space direction="horizontal">
                            <Button type="primary" htmlType="submit">搜索</Button>
                            <Button type="ghost" htmlType="reset">重置</Button>
                        </Space>
            </Form>
            <CommonTable
                haveIndex
                columns={towerColumns}
                dataSource={dataSource}
                pagination={false}
                style={{
                    width: '48%',
                    position: 'absolute'
                }}
                onRow={(record: Record<string, any>, index: number) => ({
                    onClick: () => getPackingList(record.id),
                    className: styles.tableRow
                })}
            />
            <CommonTable
            haveIndex
                columns={packingColumns}
                style={{
                    width: '50%',
                    position: 'relative',
                    left: '50%'
                }}
                dataSource={packingData}
                pagination={false}
                rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    type: "checkbox",
                    onChange: handleChange,
                }}
            />
         </DetailContent>
     </Spin>
 })
 
 