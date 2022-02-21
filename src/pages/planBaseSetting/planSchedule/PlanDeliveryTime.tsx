/**
 * @author zyc
 * @copyright © 2022 
 * @description 计划交货期
 */

 import React, { useEffect, useRef, useState } from 'react';
 import { Input, Button, Modal, message, Select, DatePicker, Form, Tooltip, Space } from 'antd';
 import { Page } from '../../common';
 import { FixedType } from 'rc-table/lib/interface';
 import { productTypeOptions } from '../../../configuration/DictionaryOptions';
 import { IPlanSchedule } from './IPlanSchedule';
 import { gantt } from 'dhtmlx-gantt';
 import { Link } from 'react-router-dom';
 
 
 
 export default function DistributedTech(): React.ReactNode {
     const columns = [
         {
             key: 'planNumber',
             title: '计划号',
             width: 150,
             dataIndex: 'planNumber',
             fixed: 'left' as FixedType
         },
         {
             key: 'productCategoryName',
             title: '塔型',
             dataIndex: 'productCategoryName',
             width: 120,
             fixed: 'left' as FixedType
         },
         {
             key: 'productTypeName',
             title: '杆塔号',
             dataIndex: 'productTypeName',
             width: 120
         },
         {
             key: 'deliveryTime',
             title: '客户交货日期',
             dataIndex: 'deliveryTime',
             width: 120
         },
         {
             key: 'planDeliveryTime',
             title: '计划交货日期',
             dataIndex: 'planDeliveryTime',
             width: 120,
             format: 'YYYY-MM-DD'
         }
     ]
 
     useEffect(() => {
         gantt.clearAll();
     })
 
 
     const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IPlanSchedule[]): void => {
         setSelectedKeys(selectedRowKeys);
         setSelectedRows(selectedRows);
     }
 
     const [refresh, setRefresh] = useState(false);
     const [visible, setVisible] = useState(false);
     const [filterValue, setFilterValue] = useState({});
     const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
     const [selectedRows, setSelectedRows] = useState<IPlanSchedule[]>([]);
     return (
         <>
             <Page
                 path="/tower-aps/productionPlan"
                 columns={columns}
                 headTabs={[]}
                 extraOperation={<Space>
                     <Link to={``}><Button type="primary">计划交货期</Button></Link>
                     <Link to={``}><Button type="primary">拆分批次</Button></Link>
                     <Link to={``}><Button type="primary">下发技术</Button></Link>
                 </Space>}
                 refresh={refresh}
                 tableProps={{
                     rowSelection: {
                         selectedRowKeys: selectedKeys,
                         onChange: SelectChange,
                         getCheckboxProps: (record: Record<string, any>) => ({
                             disabled: record.loftingStatus !== 0
                         })
                     }
                 }}
                 searchFormItems={[]}
                 filterValue={filterValue}
             />
         </>
     )
 }