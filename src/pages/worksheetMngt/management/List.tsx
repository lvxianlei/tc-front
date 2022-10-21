/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理
 */

 import React, { useRef, useState } from 'react';
 import { Input, DatePicker, Button, message, Space, Select, Dropdown, Menu, Radio, Modal, TreeSelect, Form, Row, Col, Popconfirm } from 'antd';
 import { Page } from '../../common';
 import { FixedType } from 'rc-table/lib/interface';
 import styles from '../Management.module.less';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import { Link, useHistory } from 'react-router-dom';
import SelectUser from '../../common/SelectUser';
import WorkOrderNew from './WorkOrderNew';
import WorkOrderDetail from './WorkOrderDetail';
import EngineeringInformation from './EngineeringInformation';
import Dispatching from './Dispatching';
 
export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
    onBack: () => void
}
 export default function List(): React.ReactNode {
     const [refresh, setRefresh] = useState<boolean>(false);
     const [filterValue, setFilterValue] = useState({});
     const [confirmStatus, setConfirmStatus] = useState<number>(1);
     const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
     const [type, setType] = useState<'new' | 'edit'>('new');
     const [visible, setVisible] = useState<boolean>(false);
     const ref = useRef<EditRefProps>();
     const [rowId, setRowId] = useState<string>('');
     const history = useHistory();
     const [detailVisible,setDetailVisible] = useState<boolean>(false);
     const [dealVisible, setDealVisible] = useState<boolean>(false);
     const dealRef = useRef<EditRefProps>();
     const [dispatchVisible,setDispatchVisible] = useState<boolean>(true);
     const dispatchRef = useRef<EditRefProps>();
 
     const { data: galvanizedTeamList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
         try {
             const result: { [key: string]: any } = await RequestUtil.get(`/tower-production/workshopTeam?size=1000`);
             resole(result?.records)
         } catch (error) {
             reject(error)
         }
     }))  

     const { data: templateTypes } = useRequest<any>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(``);
        resole([]);
    }), {})
 
     const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
         {
             "key": "planNumber",
             "title": "工单编号",
             "width": 150,
             "dataIndex": "planNumber"
         },
         {
             "key": "productCategoryName",
             "title": "产生途径",
             "width": 150,
             "dataIndex": "productCategoryName"
         },
         {
             "key": "productNumber",
             "title": "工单标题",
             "width": 150,
             "dataIndex": "productNumber"
         },
         {
             "key": "packageCode",
             "title": "工单类型",
             "width": 150,
             "dataIndex": "packageCode"
         },
         {
             "key": "packageComponentCount",
             "title": "工单状态",
             "width": 150,
             "dataIndex": "packageComponentCount"
         },
         {
             "key": "packageWeight",
             "title": "派工状态",
             "width": 150,
             "dataIndex": "packageWeight"
         },
         {
             "key": "packageTypeName",
             "title": "当前处理节点",
             "width": 150,
             "dataIndex": "packageTypeName"
         },
         {
             "key": "packageAttribute",
             "title": "接收人",
             "width": 150,
             "dataIndex": "packageAttribute"
         },
         {
             "key": "teamName",
             "title": "产生时间",
             "width": 150,
             "dataIndex": "teamName"
         },
         {
             "key": "packageStatus",
             "title": "预计开始时间",
             "width": 150,
             "dataIndex": "packageStatus"
         },
         {
             "key": "startTime",
             "title": "实际开始时间",
             "width": 150,
             "dataIndex": "startTime",
         },
         {
             "key": "endTime",
             "title": "预计完成时间",
             "width": 150,
             "dataIndex": "endTime",
             "type": "date",
             "format": 'YYYY-MM-DD'
         },
         {
             "key": "endTime",
             "title": "实际完成时间",
             "width": 150,
             "dataIndex": "endTime",
             "type": "date",
             "format": 'YYYY-MM-DD'
         },
         {
             "key": "operation",
             "title": "操作",
             "dataIndex": "operation",
             fixed: "right" as FixedType,
             "width": 150,
             render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                 <Space>
                 <Button type='link' onClick={() =>{
                setDetailVisible(true);
                setRowId(record.id);
             }} >详情</Button>
                     <Button type='link' onClick={() =>{
                    setDispatchVisible(true);
                    setRowId(record.id);
                 }} >派工</Button>
                     <Button type='link'onClick={() => {
                        setDealVisible(true);
                        setRowId(record.id);
                     }}>处理</Button>
                     <Button type='link' onClick={() =>{
                    setVisible(true);
                    setType('edit');
                    setRowId(record.id);
                 }} >编辑</Button>
                     <Popconfirm
                                            title="确认取消?"
                                            onConfirm={() => {
                                                RequestUtil.delete(``).then(res => {
                                                    message.success('取消成功');
                                                    history.go(0);
                                                });
                                            }}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <Button type="link">取消</Button>
                                        </Popconfirm>
                 </Space>
             )
         }
     ]
 
     const searchItems = [
         {
             name: 'timeType',
             children: <Form.Item name="timeType" initialValue={0}>
                <Select placeholder="请选择" style={{ width: '120px' }}>
             <Select.Option key={0} value={0}>预计开始时间</Select.Option>
             <Select.Option key={1} value={1}>预计完成时间</Select.Option>
             <Select.Option key={2} value={2}>实际开始时间</Select.Option>
             <Select.Option key={3} value={3}>实际完成时间</Select.Option>
         </Select>
                </Form.Item>
         },
         {
             name: 'time',
             children: <DatePicker.RangePicker />
         },
         {
             name: 'packageAttribute',
             label: '产生途径',
             children: <Select placeholder="请选择" style={{ width: '120px' }} defaultValue={''}>
                 <Select.Option key={4} value={''}>全部</Select.Option>
                 <Select.Option key={0} value={0}>系统</Select.Option>
                 <Select.Option key={1} value={1}>人工</Select.Option>
             </Select>
         },
         {
             name: 'teamId',
             label: '工单类型',
             children: <TreeSelect 
          style={{ width: '200px' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={templateTypes}
          placeholder="请选择"
          treeDefaultExpandAll
        />
         },
         {
             name: 'packageAttribute',
             label: '派工状态',
             children: <Select placeholder="请选择" style={{ width: '120px' }} defaultValue={''}>
                 <Select.Option key={4} value={''}>全部</Select.Option>
                 <Select.Option key={0} value={0}>待派工</Select.Option>
                 <Select.Option key={1} value={1}>已派工</Select.Option>
             </Select>
         },
         {
             name: 'time',
             label: '接收人',
             children: <Input disabled size="small" suffix={
                <SelectUser selectType='checkbox' onSelect={(selectedRows: Record<string, any>) => {
                    console.log(selectedRows)
                }} />
            } />
         },
         {
             name: 'fuzzyQuery',
             label: "模糊查询项",
             children: <Input style={{ width: '200px' }} placeholder="工单标题/工单编号" />
         }
     ]
 
     const operationChange = (event: any) => {
         setConfirmStatus(parseFloat(`${event.target.value}`));
         setRefresh(!refresh);
     }
  
     const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await ref.current?.onSubmit()
            message.success("上传成功！")
            setVisible(false)
            // history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })
  
    const handleDealOk = () => new Promise(async (resove, reject) => {
        try {
            await dealRef.current?.onSubmit()
            message.success("处理完成！")
            setDealVisible(false)
            // history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    }) 

    const handleBack = () => new Promise(async (resove, reject) => {
       try {
           await dealRef.current?.onBack()
           message.success("退回成功！")
           setDealVisible(false)
           // history.go(0)
           resove(true)
       } catch (error) {
           reject(false)
       }
   })

   const handleDispatchOk = () => new Promise(async (resove, reject) => {
      try {
          await dealRef.current?.onBack()
          message.success("派工成功！")
          setDealVisible(false)
          // history.go(0)
          resove(true)
      } catch (error) {
          reject(false)
      }
  })

     return <>
     <Modal
            destroyOnClose
            key='Dispatching'
            visible={dispatchVisible}
            width="80%"
            onOk={handleDispatchOk}
            okText="完成"
            title={"派工"}
            onCancel={() => { setDispatchVisible(false); dispatchRef.current?.resetFields(); }}>
            <Dispatching rowId={rowId} ref={dispatchRef} />
        </Modal>
     <Modal
            destroyOnClose
            key='EngineeringInformation'
            visible={dealVisible}
            width="95%"
            footer={
                <Space>
                <Button type="primary" onClick={handleDealOk} ghost>完成</Button>
                <Button type="primary" onClick={handleBack} ghost>退回</Button>
                <Button onClick={() => {
                    setDealVisible(false);
                }}>关闭</Button>
                </Space>
            }
            title="报工信息"
            onCancel={() => setDealVisible(false)}>
            <EngineeringInformation rowId={rowId} ref={dealRef} />
        </Modal>
     <Modal
            destroyOnClose
            key='WorkOrderDetail'
            visible={detailVisible}
            width="95%"
            footer={
                <Button onClick={() => {
                    setDetailVisible(false);
                }}>关闭</Button>
            }
            title="详情"
            onCancel={() => setDetailVisible(false)}>
            <WorkOrderDetail rowId={rowId} />
        </Modal>
     <Modal
            destroyOnClose
            key='WorkOrderNew'
            visible={visible}
            width="40%"
            onOk={handleOk}
            okText="完成"
            title={type === 'new' ? '新建' :  "编辑"}
            onCancel={() => { setVisible(false); ref.current?.resetFields(); }}>
            <WorkOrderNew rowId={rowId} type={type} ref={ref} />
        </Modal>
        <Page
         path={`/tower-science/loftingList`}
         columns={columns}
         headTabs={[]}
         requestData={{ packageStatus: confirmStatus }}
         extraOperation={
            <Space style={{width: '100%'}}>
                <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                     <Radio.Button value={''}>全部</Radio.Button>
                     <Radio.Button value={1}>待关闭</Radio.Button>
                     <Radio.Button value={2}>已关闭</Radio.Button>
                     <Radio.Button value={2}>已取消</Radio.Button>
                 </Radio.Group>
                 <Space size='small'  style={{position:'absolute' ,right: '16px',top: 0}}>
                 <Button type='primary' onClick={() =>{
                    setVisible(true);
                    setType('new')
                 }} ghost>人工创建工单</Button>
                 <Button type='primary' ghost>批量派工</Button>
                 </Space>
            </Space>  
         }
         refresh={refresh}
         searchFormItems={searchItems}
         filterValue={filterValue}
         onFilterSubmit={(values: Record<string, any>) => {
             if (values?.time) {
                    const formatDate = values?.time?.map((item: any) => item.format("YYYY-MM-DD"));
                    values.startTimeMin = formatDate[0] + ' 00:00:00';
                    values.startTimeMax = formatDate[1] + ' 23:59:59';
             }
             setFilterValue(values);
             return values;
         }}
         tableProps={confirmStatus === 1 ? {
             rowSelection: {
                 selectedRowKeys: selectedKeys,
                 onChange: (selectedRowKeys: React.Key[]): void => {
                     setSelectedKeys(selectedRowKeys);
                 }
             }
         } : {}}
     />
     </>
 }