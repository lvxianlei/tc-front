/***
 * 付款记录列表
 * 2021/11/22
 */
 import React, { useState,useRef } from 'react';
 import { Button, Input, DatePicker,Select ,Form,TreeSelect,Table} from 'antd'
 import { Page } from '../common'
 import { fundRecordColumns } from "./fundRecord.json"
 import { payTypeOptions } from '../../configuration/DictionaryOptions';
 import OverViewRecord from './overViewRecord'; // 查看付款记录详情
 import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
 import useRequest from '@ahooksjs/use-request';
 import RequestUtil from '../../utils/RequestUtil'
 interface ViewRefProps {
    getDetail: () => void
}
 export default function FaundInfomation() {
    const [ payApplyId, setPayApplyId ] = useState<string>("");
     const [ visibleOverView, setVisibleOverView ] = useState<boolean>(false);
     const [ departData, setDepartData ] = useState<SelectDataNode[]>([]);
     const confirmed = [{ "title": "备注", "dataIndex": "description"}];
     const viewRef = useRef<ViewRefProps>();
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
    //查看详情
    const viewShow = (record:{id:string})=>{
        setVisibleOverView(true);
        setPayApplyId(record.id);
        setTimeout(()=>{
            viewRef.current?.getDetail()
        }) 
    }
        //table footer
    const footerElement = (data:any)=>{
        if(!data.length){
            return;
        }
        const records = data;
        let payMoney=0;
        records.forEach((item:any) => {
            payMoney= (payMoney*100+Number(item.payMoney)*100)/100;
        });
        let list:{[t:string]:any} ={}
        fundRecordColumns.forEach((item:any)=>{
            list[item.dataIndex]=""
        });
        list.key=1000;
        list.paymentNumber = "合计";
        list.Sunmry=true;
        list.payMoney=payMoney;
        return (
            <Table showHeader={false} columns={fundRecordColumns} dataSource={[list]}></Table>
        )
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
                    金额合计：{data ? Number(data.totalSumMoney).toFixed(2) : null}元
                </>}
                // isSunmryLine={addList}
                tableProps={
                    {footer:footerElement}
                }
                 columns={[
                     ...fundRecordColumns.map((item: any) => {
                        if (item.dataIndex === 'payType') {
                            return ({
                                title: item.title,
                                dataIndex: 'payType',
                                width: 50,
                                render: (_: any, record: any):
                                React.ReactNode => (
                                    <span>{
                                           !record.Sunmry ?
                                                (payTypeOptions as Array<any>)?.find((item:any)=>item.id == record.payType)['name'] :""
                                        }
                                    </span>
                                )
                            })
                        }
                        return item;
                    }),
                     {
                         title: "操作",
                         dataIndex: "opration",
                         fixed: "right",
                         width: 100,
                         render: (_: any, record: any) => {
                            if(!record.Sunmry){
                                return <Button type="link" 
                                onClick={() => {viewShow(record)}}>详情</Button>
                            }
                         }
                     }]}
             />
             {/* 查看 */}
             <OverViewRecord
                payApplyId={payApplyId}
                 title={confirmed}
                 visible={visibleOverView}
                 ref={viewRef}
                 onCancel={() => setVisibleOverView(false)}
             />
         </>
     )
 }