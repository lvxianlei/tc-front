/***
 * 请款申请列表
 * 2021/11/22
 */
 import React, { useState ,useRef} from 'react';
 import { Button, Input, DatePicker, Radio,Select ,Form,TreeSelect,Table} from 'antd'
 // import { useHistory } from 'react-router-dom'
 import { Page } from '../common'
 import { fundListColumns, approvalStatus,payStatuOptions } from "./fundListHead.json"
 import { costTypeOptions } from '../../configuration/DictionaryOptions';
 import AddModal from './addModal'; // 新增付款记录
 import OverView from './overView'; // 查看付款记录详情
 import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
 import useRequest from '@ahooksjs/use-request';
 import RequestUtil from '../../utils/RequestUtil';
 interface ViewRefProps {
    getDetail: () => void
}
 export default function FaundInfomation() {
     const [ refresh, setRefresh ] = useState<boolean>(false);
     const [payStatus, setPayStatus] = useState<number>(1);
     const [ departData, setDepartData ] = useState<SelectDataNode[]>([]);
     const [AddVisible, setAddVisible] = useState(false);
     const [ visibleOverView, setVisibleOverView ] = useState<boolean>(false);
     const [ payApplyId, setPayApplyId ] = useState<string>("");
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
         value.payStatus=payStatus;
         return value
     }
     // tab切换
     const operationChange = (event: any) => {
         setPayStatus(parseFloat(`${event.target.value}`));
         setRefresh(!refresh);
     }
     // 新增回调
     const handleOk = (result:object, callBack: any) => {
        setAddVisible(false);
        setRefresh(!refresh);
     }
    //查看详情
    const viewShow = (record:{id:string})=>{
        setVisibleOverView(true);
        setPayApplyId(record.id);
        setTimeout(()=>{
            viewRef.current?.getDetail()
        }) 
    }
    //表格增加底部计算
    const addList = (data:any)=> {
        //如果没有数据
        if(!data.payApplyListVOIPage.records.length){
            return;
        }
        const records = data.payApplyListVOIPage.records;
        let sumMoney=0,
                money=0,
                payMoney=0;
        records.forEach((item:any) => {
            sumMoney= (sumMoney*100+Number(item.sumMoney)*100)/100;
            money= (money*100+Number(item.money)*100)/100;
            payMoney= (payMoney*100+Number(item.payMoney)*100)/100;
        });
        let list:{[t:string]:any} ={}
        fundListColumns.forEach((item:any)=>{
            list[item.dataIndex]=""
        });
        list.id=1000;
        list.payApplyNumber = "合计";
        list.Sunmry=true;
        list.sumMoney=sumMoney;
        list.money=money;
        list.payMoney=payMoney;
        records.push(list)
    }
     return (
         <>
             <Page
                 path="/tower-finance/payApply"
                 onFilterSubmit={onFilterSubmit}
                 filterValue={{ payStatus}}
                 refresh={ refresh }
                 searchFormItems={[
                     {
                         name: 'fuzzyQuery',
                         children: <Input placeholder="请输入请款单号/收款方进行查询" style={{ width: 200 }} />
                     },
                     {
                         name: 'costType',
                         label: '费用类型',
                         children: <Form.Item name="costType">
                             <Select placeholder="费用类型" style={{ width: "100px" }}>
                                     { costTypeOptions && costTypeOptions.map(({ id, name }, index) => {
                                     return <Select.Option key={index} value={name}>
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
                 sourceKey="payApplyListVOIPage.records"
                 extraOperation={(data: any) => <>
                     <Radio.Group defaultValue={payStatus} onChange={operationChange}>
                                 {approvalStatus.map((item: any) => 
                                      <Radio.Button value={item.value} key={item.value}>{item.label}</Radio.Button>
                                 )}
                     </Radio.Group>
                     { payStatus == 1 ? 
                                 <span style={{marginLeft:"20px"}}>
                                     请款金额总计：{data ? data.totalSumMoney : null}元   
                                     已付金额合计：{data ?data.totalMoney : null}元    
                                     应付款余额合计：{data ?data.totalPayMoney : null}元
                                 </span>
                                 :
                                 <span style={{marginLeft:"20px"}}>请款金额总计：{data ?data.totalSumMoney : null}元</span>
                             }
                 </>}
                  isSunmryLine={addList}
                 columns={[
                     ...fundListColumns.map((item: any) => {
                         if (item.dataIndex === 'payStatus') {
                             return ({
                                 title: item.title,
                                 dataIndex: 'payStatus',
                                 width: 50,
                                 render: (_: any, record: any): 
                                 React.ReactNode => (
                                 <span>{!record.Sunmry ? payStatuOptions[record.payStatus]: ""}</span>
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
                                if (payStatus === 1) {
                                    return (
                                        <>
                                        {/* 等于2为已付款 */}
                                        {record.payStatus != 2 ?
                                            <Button type="link" onClick={() => { setAddVisible(true);setPayApplyId(record.id) } }>新增付款记录</Button>
                                        :""}
                                            <Button type="link"  onClick={() => {viewShow(record)}}>详情</Button>
                                        </>
                                    )
                                }
                                return <Button type="link"onClick={() => { viewShow(record) }}>详情</Button>
                            }
                         }
                     }]}
                     
             />
             {/* 新增 */}
             <AddModal
                payApplyId={payApplyId}
                 visible={AddVisible}
                 onCancel={() => setAddVisible(false)}
                 onOk={handleOk}
             />
             {/* 查看 */}
             <OverView
                payApplyId={payApplyId}
                 title={confirmed}
                 visible={visibleOverView}
                 ref={viewRef}
                 onCancel={() => setVisibleOverView(false)}
             />
         </>
     )
 }