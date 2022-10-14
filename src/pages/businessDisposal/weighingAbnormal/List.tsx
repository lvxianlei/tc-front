/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-过磅异常
 */

 import React, { useRef, useState } from 'react';
 import { Space, Input, DatePicker, Select, Button, Form, message, Popconfirm, Row, Col, TreeSelect, Modal } from 'antd';
 import { FixedType } from 'rc-table/lib/interface';
 import styles from './GenerationOfMaterial.module.less';
 import { useHistory } from 'react-router-dom';
 import Page from '../../common/Page';
 import RequestUtil from '../../../utils/RequestUtil';
 import { columns } from "./weighingAbnormal.json"
 import useRequest from '@ahooksjs/use-request';
 import { TreeNode } from 'antd/lib/tree-select';
 import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import Detail from './Detail';
 
 interface EditRefProps {
     resetFields: () => void;
     onPass: () => void;
     onReject: () => void;
 }
 
 export default function List(): React.ReactNode {
     const history = useHistory();
     const [filterValues, setFilterValues] = useState<Record<string, any>>();
     const [visible, setVisible] = useState<boolean>(false);
     const addRef = useRef<EditRefProps>();
     const [type, setType] = useState<'detail' | 'approval'>('approval');
     const [rowId, setRowId] = useState<string>();

     
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
             key='Detail'
             visible={visible}
             title={'详情'}
             footer={<Space direction="horizontal" size="small">
                 {type === 'approval' ?
                     <>
                 <Button onClick={handlePass} type="primary" ghost>通过</Button>
                         <Button onClick={handleReject} type="primary" ghost>拒绝</Button>
                     </>
                     :
                 null
                 }
                 <Button onClick={() => {
                     setVisible(false);
                     addRef.current?.resetFields();
                 }}>关闭</Button>
             </Space>}
             width="80%"
             onCancel={() => {
                 setVisible(false);
                 addRef.current?.resetFields();
             }}>
             <Detail type={type} id={rowId} ref={addRef} />
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
                                 setType('approval');
                             }}>详情</Button>
                         </Space>
                     )
                 }
             ]}
             headTabs={[]}
             searchFormItems={[
                 {
                     name: 'fuzzyMsg',
                     label: '审批状态',
                     children: <Select placeholder="请选择审批状态">
                     <Select.Option key={1} value={1}>未发起</Select.Option>
                     <Select.Option key={2} value={2}>待审批</Select.Option>
                     <Select.Option key={3} value={3}>审批中</Select.Option>
                     <Select.Option key={4} value={4}>已通过</Select.Option>
                     <Select.Option key={5} value={5}>已撤回</Select.Option>
                     <Select.Option key={0} value={0}>已拒绝</Select.Option>
                 </Select>
                 },
                 {
                     name: 'updateStatusTime',
                     label: '发车日期',
                     children: <DatePicker.RangePicker />
                 },
                 {
                     name: 'fuzzyMsg',
                     label: '模糊查询项',
                     children: <Input style={{ width: '300px' }} placeholder="运单编号/计划号/工程名称" />
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