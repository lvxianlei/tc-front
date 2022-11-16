/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-过磅异常
 */

 import React, { useEffect, useRef, useState } from 'react';
 import { Space, Input, DatePicker, Select, Button, Form, message, Popconfirm, Row, Col, TreeSelect, Modal } from 'antd';
 import { FixedType } from 'rc-table/lib/interface';
 import styles from './WeighingAbnormal.module.less';
 import { useHistory } from 'react-router-dom';
 import Page from '../../common/Page';
 import RequestUtil from '../../../utils/RequestUtil';
 import { columns } from "./weighingAbnormal.json"
import Detail from './Detail';
 
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
     const ref = useRef<EditRefProps>();
     const [type, setType] = useState<'review' | 'detail'>('review');
     const [rowId, setRowId] = useState<string>();
     const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

         
    useEffect(() => {
        setConfirmLoading(confirmLoading);
    }, [confirmLoading])

     
     const handlePass = () => new Promise(async (resove, reject) => {
        try {
            await ref.current?.onPass()
            message.success("通过成功！")
            setConfirmLoading(false);
            setVisible(false)
            ref.current?.resetFields();
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    
    const handleReject = () => new Promise(async (resove, reject) => {
        try {
            await ref.current?.onReject()
            message.success("拒绝成功！")
            setConfirmLoading(false);
            setVisible(false)
            ref.current?.resetFields();
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
                 {type === 'review' ?
                 <>
                 
                 <Button onClick={handlePass} loading={confirmLoading} type="primary" ghost>通过</Button>
                         <Button onClick={handleReject} loading={confirmLoading} type="primary" ghost>拒绝</Button>
                 </>
                     :
                     null
                 }
                 <Button onClick={() => {
                     setVisible(false);
                     ref.current?.resetFields();
                 }}>关闭</Button>
             </Space>}
             width="60%"
             onCancel={() => {
                 setVisible(false);
                 ref.current?.resetFields();
             }}>
             <Detail type={type} getLoading={(loading: boolean) => setConfirmLoading(loading)} id={rowId} ref={ref} />
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
                         </Space>
                     )
                 }
             ]}
             headTabs={[]}
             searchFormItems={[
                {
                    name: 'time',
                    label: '审批状态',
                    children: <Select placeholder="请选择审批状态" defaultValue={''}>
                    <Select.Option key={9} value={''}>全部</Select.Option>
                    <Select.Option key={1} value={1}>未发起</Select.Option>
                    <Select.Option key={2} value={2}>待审批</Select.Option>
                    <Select.Option key={3} value={3}>审批中</Select.Option>
                    <Select.Option key={4} value={4}>已通过</Select.Option>
                    <Select.Option key={5} value={5}>已撤回</Select.Option>
                    <Select.Option key={0} value={0}>已拒绝</Select.Option>
                </Select>
                },
                 {
                     name: 'time',
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
                 if (values.time) {
                     const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                     values.timeStart = formatDate[0] + ' 00:00:00';
                     values.timeEnd = formatDate[1] + ' 23:59:59';
                 }
                 setFilterValues(values);
                 return values;
             }}
         />
     </>
 }