/**
 * @author zyc
 * @copyright © 2022 
 * @description 图纸塔型-配段信息
 */

 import React, { forwardRef } from "react";
 import { CommonTable } from '../common';
 import { FixedType } from 'rc-table/lib/interface';
 
 interface WithSectionProps {
    dataSource: IWithSection[]
 }
 
 export interface IWithSection {

 }

 export default forwardRef(function WithSection({ dataSource }: WithSectionProps) {
 
     const tableColumns = [
         {
            key: 'index',
            title: '序号',
            fixed: "left" as FixedType,
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
         },
         {
            key: 'sort',
             title: '杆塔号',
             dataIndex: 'sort',
             width: 150,
         },
         {
             key: 'planNumber',
             title: '呼高',
             dataIndex: 'planNumber',
             width: 150
         },
         {
             key: 'productCategoryName',
             title: '配段信息',
             dataIndex: 'productCategoryName',
             width: 150
         },
         {
             key: 'productNum',
             title: 'A',
             dataIndex: 'productNum',
             width: 80
         },
         {
             key: 'description',
             title: 'B',
             dataIndex: 'description',
             width: 80
         },
         {
             key: 'description',
             title: 'C',
             dataIndex: 'description',
             width: 80
         },
         {
             key: 'description',
             title: 'D',
             dataIndex: 'description',
             width: 80
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
 
 