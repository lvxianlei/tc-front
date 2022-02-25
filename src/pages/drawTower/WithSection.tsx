/**
 * @author zyc
 * @copyright © 2022 
 * @description 图纸塔型-配段信息
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Spin, Form, Select, Divider } from 'antd';
 import { BaseInfo, CommonTable } from '../common';
 import RequestUtil from '../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import { MenuOutlined } from '@ant-design/icons';
 import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
 
 interface WithSectionProps {
    dataSource: IWithSection[]
 }
 
 export interface IWithSection {

 }
 
 const SortableItem = SortableElement((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />);
 const SortableCon = SortableContainer((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableSectionElement> & React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />);
 
 export default forwardRef(function WithSection({ dataSource }: WithSectionProps, ref) {

 
     const tableColumns = [
         {
             title: '排序',
             dataIndex: 'sort',
             width: 50,
             className: 'drag-visible',
         },
         {
             key: 'planNumber',
             title: '计划号',
             dataIndex: 'planNumber',
             width: 150
         },
         {
             key: 'productCategoryName',
             title: '塔型',
             dataIndex: 'productCategoryName',
             width: 150
         },
         {
             key: 'productNum',
             title: '基数',
             dataIndex: 'productNum',
             width: 120
         },
         {
             key: 'description',
             title: '备注',
             dataIndex: 'description',
             width: 180
         }
     ]


 
     return <CommonTable
             scroll={{ x: '700' }}
             rowKey="index"
             dataSource={dataSource}
             pagination={false}
             columns={tableColumns}
         />
 })
 
 