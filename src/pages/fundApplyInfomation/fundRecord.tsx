/***
 * 付款记录列表
 * 2021/11/22
 */
 import React, { useState } from 'react';
 import { Button, Input, DatePicker,Select ,Form,TreeSelect} from 'antd'
 import { Page } from '../common'
 import { fundRecordColumns } from "./fundRecord.json"
 import { payTypeOptions } from '../../configuration/DictionaryOptions';
 import OverViewRecord from './overViewRecord'; // 查看付款记录详情
 import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
 import useRequest from '@ahooksjs/use-request';
 import RequestUtil from '../../utils/RequestUtil'
 export default function FaundInfomation() {
     const [ visibleOverView, setVisibleOverView ] = useState<boolean>(false);
     const [ departData, setDepartData ] = useState<SelectDataNode[]>([]);
     const confirmed = [{ "title": "备注", "dataIndex": "description"}];
     //请求部门
     useRequest(() => new Promise(async (resole, reject) => {
         const deptData: SelectDataNode[] = await RequestUtil.get(`/tower-system/department/tree`);
         setDepartData(deptData);
     }), {})
     const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
         roles && roles.forEach((role: any & SelectDataNode): void => {
             role.value = role.id;
             role.isLeaf = false;
             if (role.children && role.children.length > 0) {
                 wrapRole2DataNode(role.children);
             }
         });
         return roles;
     }
     // 查询按钮
     const onFilterSubmit = (value: any) => {
         if (value.endPayApplyTime) {
             const formatDate = value.endPayApplyTime.map((item: any) => item.format("YYYY-MM-DD"))
             value.endPayApplyTime = formatDate[0]
             value.startPayApplyTime = formatDate[1]
         }
         return value
     }
     // 新增回调
     const handleOk = (result:object, callBack: any) => {
         console.log(result, '-------------11111111');
         setTimeout(() => {
             callBack();
             // setAddVisible(false);
         }, 1000);
     }
 
     // 查看
     const hanleSee = (record: any) => {
         console.log(record, 'record');
         setVisibleOverView(true);
     }
     return (
         <>
             <Page
                 path="/tower-finance/payApply/payment"
                 onFilterSubmit={onFilterSubmit}
                 searchFormItems={[
                     {
                         name: 'fuzzyQuery',
                         children: <Input placeholder="请输入请款单号/收款方进行查询" style={{ width: 200 }} />
                     },
                     {
                         name: 'payType',
                         label: '付款方式',
                         children: <Form.Item name="payType">
                             <Select placeholder="费用类型" style={{ width: "100px" }}>
                                     { payTypeOptions && payTypeOptions.map(({ id, name }, index) => {
                                     return <Select.Option key={index} value={id}>
                                         {name}
                                     </Select.Option>
                                 }) }
                             </Select>
                         </Form.Item>
                     },
                     {
                         name: 'payerDeptId',
                         label: '请款部门',
                         children: <Form.Item name="payerDeptId">
                             <TreeSelect
                                 style={{ width: '150px' }}
                                 dropdownStyle={{ maxHeight: 400, overflow: 'auto',width:200 }}
                                 treeData={wrapRole2DataNode(departData)}
                                 placeholder="请选择"
                                 
                             />
                         </Form.Item>
                     },
                     {
                         name: 'endPayApplyTime',
                         label: '请款日期：',
                         children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: "200px" }} />
                     }
                 ]}
                 sourceKey="paymentDetailListVOIPage.records"
                 extraOperation={(data: any) => <>
                    金额合计：{data ? data.totalSumMoney : null}元
                </>}
                 columns={[
                     ...fundRecordColumns,
                     {
                         title: "操作",
                         dataIndex: "opration",
                         fixed: "right",
                         width: 100,
                         render: (_: any, record: any) => {
                             return <Button type="link"onClick={() => setVisibleOverView(true)}>详情</Button>
                         }
                     }]}
             />
             {/* 查看 */}
             <OverViewRecord
                 title={confirmed}
                 visible={visibleOverView}
                 onCancel={() => setVisibleOverView(false)}
             />
         </>
     )
 }