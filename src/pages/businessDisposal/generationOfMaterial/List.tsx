/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-代料
 */

 import React, { useRef, useState } from 'react';
 import { Space, Input, DatePicker, Select, Button, Form, message, Popconfirm, Row, Col, TreeSelect, Modal } from 'antd';
 import { FixedType } from 'rc-table/lib/interface';
 import styles from './GenerationOfMaterial.module.less';
 import { useHistory } from 'react-router-dom';
 import Page from '../../common/Page';
 import RequestUtil from '../../../utils/RequestUtil';
 import { columns } from "./generationOfMaterial.json"
 import useRequest from '@ahooksjs/use-request';
 import { TreeNode } from 'antd/lib/tree-select';
 import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import GenerationOfMaterialApply from './GenerationOfMaterialApply';
 
 interface EditRefProps {
     onSubmit: () => void;
     resetFields: () => void;
     onSave: () => void;
     onPass: () => void;
     onReject: () => void;
 }
 
 export default function List(): React.ReactNode {
     const history = useHistory();
     const [filterValues, setFilterValues] = useState<Record<string, any>>();
     const [visible, setVisible] = useState<boolean>(false);
     const addRef = useRef<EditRefProps>();
     const [type, setType] = useState<'new' | 'detail' | 'edit'>('new');
     const [rowId, setRowId] = useState<string>();

 
     const handleOk = () => new Promise(async (resove, reject) => {
         try {
             await addRef.current?.onSave()
             message.success("保存成功！")
             setVisible(false)
             addRef.current?.resetFields();
             history.go(0)
             resove(true)
         } catch (error) {
             reject(false)
         }
     })
 
     const handleLaunchOk = () => new Promise(async (resove, reject) => {
         try {
             await addRef.current?.onSubmit()
             message.success("保存并发起成功！")
             setVisible(false)
             addRef.current?.resetFields();
             history.go(0)
             resove(true)
         } catch (error) {
             reject(false)
         }
     })
     
     const handlePass = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onPass()
            message.success("通过成功！")
            setVisible(false)
            addRef.current?.resetFields();
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    
    const handleReject = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onReject()
            message.success("拒绝成功！")
            setVisible(false)
            addRef.current?.resetFields();
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

     return <>
         <Modal
             destroyOnClose
             key='ApplyTrial'
             visible={visible}
             title={type === 'new' ? '试装/免试装申请' : '详情'}
             footer={<Space direction="horizontal" size="small">
                 {type === 'detail' ?
                 <>
                 
                 <Button onClick={handlePass} type="primary" ghost>通过</Button>
                         <Button onClick={handleReject} type="primary" ghost>拒绝</Button>
                 </>
                     :
                     <>
                         <Button onClick={handleOk} type="primary" ghost>保存并关闭</Button>
                         <Button onClick={handleLaunchOk} type="primary" ghost>保存并发起</Button>
                     </>
                 }
                 <Button onClick={() => {
                     setVisible(false);
                     addRef.current?.resetFields();
                 }}>关闭</Button>
             </Space>}
             width="60%"
             onCancel={() => {
                 setVisible(false);
                 addRef.current?.resetFields();
             }}>
             <GenerationOfMaterialApply type={type} id={rowId} ref={addRef} />
         </Modal>
         <Page
             path="/tower-science/trialAssembly"
             columns={[
                 {
                     key: 'index',
                     title: '序号',
                     dataIndex: 'index',
                     width: 50,
                     fixed: 'left' as FixedType,
                     render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
                 },
                 ...columns,
                 {
                     key: 'operation',
                     title: '操作',
                     dataIndex: 'operation',
                     fixed: 'right' as FixedType,
                     width: 150,
                     render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                         <Space direction="horizontal" size="small">
                             <Button type='link' onClick={() => {
                                 setRowId(record?.id);
                                 setVisible(true);
                                 setType('detail');
                             }}>详情</Button>
                             <Popconfirm
                                 title="确认发起?"
                                 onConfirm={() => {
                                     RequestUtil.post(`/tower-science/trialAssembly/trialAssembly/launch/${record.id}`).then(res => {
                                         message.success('发起成功');
                                         history.go(0);
                                     });
                                 }}
                                 okText="确认"
                                 cancelText="取消"
                                 disabled={!(record.status === 1 || record.status === 5)}
                             >
                                 <Button disabled={!(record.status === 1 || record.status === 5)} type="link">发起</Button>
                             </Popconfirm>
                             <Popconfirm
                                 title="确认撤回?"
                                 onConfirm={() => {
                                     RequestUtil.post(`/tower-science/trialAssembly/trialAssembly/withdraw/${record.id}`).then(res => {
                                         message.success('撤回成功');
                                         history.go(0);
                                     });
                                 }}
                                 okText="确认"
                                 cancelText="取消"
                                 disabled={record.status !== 2}
                             >
                                 <Button disabled={record.status !== 2} type="link">撤回</Button>
                             </Popconfirm>
                             <Popconfirm
                                 title="确认删除?"
                                 onConfirm={() => {
                                     RequestUtil.delete(`/tower-science/trialAssembly/trialAssembly/${record.id}`).then(res => {
                                         message.success('删除成功');
                                         history.go(0);
                                     });
                                 }}
                                 okText="确认"
                                 cancelText="取消"
                                 disabled={!(record.status === 1 || record.status === 5)}
                             >
                                 <Button disabled={!(record.status === 1 || record.status === 5)} type="link">删除</Button>
                             </Popconfirm>
                         </Space>
                     )
                 }
             ]}
             headTabs={[]}
             extraOperation={<Button type='primary' style={{ margin: '6px 0' }} onClick={() => {
                 setType('new');
                 setVisible(true);
             }} ghost>申请</Button>}
             searchFormItems={[
                 {
                     name: 'updateStatusTime',
                     label: '日期',
                     children: <DatePicker.RangePicker />
                 },
                 {
                     name: 'fuzzyMsg',
                     label: '原材料类型',
                     children: <Input  />
                 },
                 {
                     name: 'fuzzyMsg',
                     label: '模糊查询项',
                     children: <Input style={{ width: '300px' }} placeholder="计划号/单号/塔型/工程名称/说明" />
                 }
             ]}
             filterValue={filterValues}
             onFilterSubmit={(values: Record<string, any>) => {
                 if (values.updateStatusTime) {
                     const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                     values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                     values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                 }
                 setFilterValues(values);
                 return values;
             }}
         />
     </>
 }