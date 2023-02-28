/**
 * 创建计划列表
 */
 import React, { useEffect, useState } from 'react';
 import { Modal, Form, Button, InputNumber, message, Spin, Input, Select } from 'antd';
 import { BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
 import useRequest from '@ahooksjs/use-request';
 import RequestUtil from '../../../utils/RequestUtil';
 import {
     material,
     baseInfoColumn,
     addMaterial
 } from "./CreatePlan.json";
 import moment from 'moment';
 import "./CreatePlan.less";
 import { materialStandardOptions, materialTextureOptions } from '../../../configuration/DictionaryOptions';
import AuthUtil from '@utils/AuthUtil';
 
 export default function CreatePlan(props: any): JSX.Element {
     const [addCollectionForm] = Form.useForm();
     const [visible, setVisible] = useState<boolean>(false)
     const [saveLoading, setSaveLoading] = useState<boolean>(false)
     const [submitLoading, setSubmitLoading] = useState<boolean>(false)
     const [type, setType] = useState<number>(0);
     const [materialList, setMaterialList] = useState<any[]>([])
     const [popDataList, setPopDataList] = useState<any[]>([])
     const [warehouseId, setWarehouseId] = useState<string>("");
     const [inWarehouseId, setInWarehouseId] = useState<string>("");
     const [ReservoirArea, setReservoirArea] = useState<any[]>([]);//入库库区数据
     const [Location, setLocation] = useState<any[]>([]);//入库库位数据
     const [InReservoirArea, setInReservoirArea] = useState<any[]>([]);//入库库区数据
     const [InLocation, setInLocation] = useState<any[]>([]);//入库库位数据
     const structureTextureEnum:any = materialTextureOptions?.map((item: { id: string, name: string }) => ({ value: item.name, label: item.name }))
     const materialStandardEnum:any = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
     // 获取仓库/库区/库位
     const getWarehousing = async (id?: any, type?: any) => {
         const data: any = await RequestUtil.get(`/tower-storage/warehouse/tree`, {
             id,
             type,
         });
         switch (type) {
             case 1:
                 setReservoirArea(data)
                 break;
             case 2:
                 setLocation(data)
                 break;
             default:
                 break;
         }
     }
     // 获取仓库/库区/库位
     const getInWarehousing = async (id?: any, type?: any) => {
        const data: any = await RequestUtil.get(`/tower-storage/warehouse/tree`, {
            id,
            type,
        });
        switch (type) {
            case 1:
                setInReservoirArea(data)
                break;
            case 2:
                setInLocation(data)
                break;
            default:
                break;
        }
    }
     const handleAddModalOk = () => {
         const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
         getInWarehousing(inWarehouseId,1)
         setMaterialList([...materialList, ...newMaterialList])
         setPopDataList([...materialList.map((item: any) => {
             return ({
                 ...item,
                 furnaceBatch: item.furnaceBatchNumber,
                 weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(5)
                     : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(5)
                         : (Number(item?.proportion || 1) / 1000).toFixed(5),
                 totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.num || 1) / 1000 / 1000).toFixed(5)
                     : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (item.num || 1) / 1000 / 1000 / 1000).toFixed(5)
                         : (Number(item?.proportion || 1) * (item.num || 1) / 1000).toFixed(5)
             })
         })])
         setVisible(false)
     }
 
    

     const handleNumChange = (value: number, id: string) => {
         const list = popDataList.map((item: any) => {
             if (item.id === id) {
                 return ({
                     ...item,
                     num: value,
                     weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(5)
                         : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(5)
                             : (Number(item?.proportion || 1) / 1000).toFixed(5),
                     totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * value / 1000 / 1000).toFixed(5)
                         : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * value / 1000 / 1000 / 1000).toFixed(5)
                             : (Number(item?.proportion || 1) * value / 1000).toFixed(5)
                 })
             }
             return item
         })
         setMaterialList(list.slice(0));
         setPopDataList(list.slice(0))
     }
     const handleInReservoirChange = (value: string, id: string) => {
         const list = popDataList.map((item: any) => {
             if (item.id === id) {
                 return ({
                     ...item,
                     allocationReservoirIn: InReservoirArea.filter((itemOne:any)=>{return itemOne?.name===value})[0].id,
                     allocationReservoirInName: value,
                 })
             }
             return item
         })
         getInWarehousing(InReservoirArea.filter((itemOne:any)=>{return itemOne?.name===value})[0].id, 2)
         setMaterialList(list.slice(0));
         setPopDataList(list.slice(0))
     }
     const handleInLocatorChange = (value: string, id: string) => {
         const list = popDataList.map((item: any) => {
             if (item.id === id) {
                 return ({
                     ...item,
                     allocationLocatorIn: InLocation.filter((itemOne:any)=>{return itemOne?.name===value})[0].id,
                     allocationLocatorInName: value
                 })
             }
             return item
         })
         setMaterialList(list.slice(0));
         setPopDataList(list.slice(0))
     }
     // 移除
     const handleRemove = (id: string) => {
         setMaterialList(materialList.filter((item: any) => item.id !== id))
         setPopDataList(materialList.filter((item: any) => item.id !== id))
     }
 

 
     const performanceBondChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
         
         if (fields.allocationWarehouseOut) {
             setWarehouseId(fields.allocationWarehouseOut);
             setMaterialList([])
             setPopDataList([])
             return;
         }
         if (fields.allocationWarehouseIn) {
             setInWarehouseId(fields.allocationWarehouseIn);
             getInWarehousing(fields.allocationWarehouseIn,1)
             setMaterialList(popDataList.map((item:any)=>{
                return {
                    ...item,
                    allocationLocatorIn:'',
                    allocationLocatorInName:'',
                    allocationReservoirIn:'',
                    allocationReservoirInName:''
                }
             }))
             setPopDataList(popDataList.map((item:any)=>{
                return {
                    ...item,
                    allocationLocatorIn:'',
                    allocationLocatorInName:'',
                    allocationReservoirIn:'',
                    allocationReservoirInName:''
                }
             }))
             setInLocation([])
             return;
        }
     }
 
     const handleCreateClick = async () => {
         try {
             const baseInfo = await addCollectionForm.validateFields();
             if (popDataList.length < 1) {
                 message.error("请您选择出库明细!");
                 return false;
             }
             // 添加对长度以及数量的拦截
             let flag = false;
             for (let i = 0; i < popDataList.length; i += 1) {
                 if (!(popDataList[i].num)) {
                     flag = true;
                 }
             }
             if (flag) {
                 message.error("请您填写数量！");
                 return false;
             }
             saveRun({
                 outStockDetailDTOList: popDataList,
                 ...baseInfo,
                 materialType: 1,
                 allocationUser: baseInfo?.allocationUser.id
             });
         } catch (error) {
             console.log(error);
         }
     }
     const handleSaveClick = async (type: string) => {
         try {
             const baseInfo = await addCollectionForm.validateFields();
             if (popDataList.length < 1) {
                 message.error("请您选择出库明细!");
                 return false;
             }
             console.log(popDataList)
             // 添加对长度以及数量的拦截
             let num = false;
             let locator = false;
             let reservoir = false;
             for (let i = 0; i < popDataList.length; i += 1) {
              
                 if (!(popDataList[i].allocationLocatorInName)){
                     locator = true
                 }
                 if (!(popDataList[i].allocationReservoirInName)){
                     reservoir = true
                 }
                 if (!(popDataList[i].num)){
                     num = true
                 }
             }
             if (locator) {
                 message.error("请您选择区位！");
                 return false;
             }
             if (reservoir) {
                 message.error("请您选择库区！");
                 return false;
             }
             if (num) {
                 message.error("请您填写数量！");
                 return false;
             }
             type==='save'&&setSaveLoading(true)
             type==='save'&&saveRun({
                allocationStockDetailDTOS: popDataList.map((item:any)=>{
                     return {
                         ...item,
                         contractNumber: item?.materialContractNumber,
                         allocationWarehouseIn: baseInfo.allocationWarehouseIn,
                         allocationWarehouseOut: baseInfo.allocationWarehouseOut,
                     }
                 }),
                 ...baseInfo,
                 commit: 0,
                 allocationUser: baseInfo?.allocationUser.id
             });
             type==='submit'&&setSubmitLoading(true)
             type==='submit'&&submitRun({
                allocationStockDetailDTOS: popDataList.map((item:any)=>{
                     return {
                         ...item,
                         contractNumber: item?.materialContractNumber,
                         allocationWarehouseIn: baseInfo.allocationWarehouseIn,
                         allocationWarehouseOut: baseInfo.allocationWarehouseOut,
                     }
                 }),
                 ...baseInfo,
                 commit: 1,
                 allocationUser: baseInfo?.allocationUser.id
             });
         } catch (error) {
             console.log(error);
         }
     }
     useEffect(() => {
         if (props.visible) {
             getBatchingStrategy();
             addCollectionForm.setFieldsValue({
                 applyTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                 allocationUser: {
                    id: AuthUtil.getUserInfo().user_id,
                    value: AuthUtil.getUserInfo().username,
                },
             })
         }
     }, [props.visible])
 
     const { run: saveRun } = useRequest<{ [key: string]: any }>((save: any) => new Promise(async (resove, reject) => {
         try {
             const path = '/tower-storage/allocationStock'
             const result: { [key: string]: any } = await RequestUtil[props.type === "create" ? "post" : "put"](path, props.type === "create" ? save : {
                 ...save,
                 id: props.id,
                 allocationNumber: data?.allocationNumber
             })
             setSaveLoading(false)
             message.success("创建成功！");
             setType(0)
             props?.handleCreate({ code: 1 })
             resove(result)
         } catch (error) {
             setSaveLoading(false)
             reject(error)
         }
     }), { manual: true })
     const { run: submitRun } = useRequest<{ [key: string]: any }>((submit: any) => new Promise(async (resove, reject) => {
         try {
             const path = '/tower-storage/allocationStock'
             const result: { [key: string]: any } = await RequestUtil[ props.type === "create" ? "post" : "put" ](path, props.type === "create" ? submit : {
                 ...submit,
                 id: props.id,
                 allocationNumber: data?.allocationNumber
             })
             setSubmitLoading(false)
             message.success("创建成功！");
             props?.handleCreate({ code: 1 })
             resove(result)
         } catch (error) {
             setSubmitLoading(false)
             reject(error)
         }
     }), { manual: true })
     const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
         try {
             const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/allocationStock/detail/${props.id}`)
             setPopDataList(result?.allocationStockDetailVOList)
             setMaterialList(result?.allocationStockDetailVOList)
             result?.allocationWarehouseOut && getWarehousing(result?.allocationWarehouseOut,1)
             result?.allocationWarehouseOut && result?.allocationWarehouseOut!==null && setWarehouseId(result?.allocationWarehouseOut)
             result?.allocationWarehouseIn && getInWarehousing(result?.allocationWarehouseIn,1)
             result?.allocationWarehouseIn && result?.allocationWarehouseIn!==null && setInWarehouseId(result?.allocationWarehouseIn)
             resole({
                 ...result,
                 allocationUser: props.type==='view'? result?.allocationUserName:{
                     id: result?.allocationUser,
                     value: result?.allocationUserName
                 },
                 applyTime: result?.applyTime,
                 allocationWarehouseOut: props.type==='view'? result?.allocationWarehouseOutName: result?.allocationWarehouseOut,
                 allocationWarehouseIn: props.type==='view'? result?.allocationWarehouseInName: result?.allocationWarehouseIn
             })
         } catch (error) {
             reject(error)
         }
     }), { ready: props.type !== "create" && props.id && props.visible, refreshDeps: [props.visible, props.type, props.id] })
 
     // 获取所有的仓库
     const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
         try {
             const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/getWarehouses`);
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     return (
         <Modal
             title={'原材料调拨单'}
             visible={props.visible}
             onCancel={() => {
                 setMaterialList([]);
                 setPopDataList([]);
                 setType(0)
                 props?.handleCreate({code:1});
                 
             }}
             maskClosable={false}
             width={1100}
             footer={props.type==='view'?[
                 <Button key="back" onClick={() => {
                     setMaterialList([]);
                     setPopDataList([]);
                     setType(0)
                     props?.handleCreate({code:1});
                 }}>
                     取消
                 </Button>
             ]:[
                 <Button key="back" onClick={() => {
                     setMaterialList([]);
                     setPopDataList([]);
                     props?.handleCreate({code:1});
                 }}>
                     取消
                 </Button>,
                 <Button key="create" type="primary" onClick={() => handleSaveClick('save')} loading={saveLoading}>
                     保存
                 </Button>,
                 <Button key="create" type="primary" onClick={() => handleSaveClick('submit')} loading={submitLoading}>
                     保存并提交
                 </Button>
             ]}
         >
             <Spin spinning={loading}>
                 <DetailTitle title="基本信息" />
                 <BaseInfo
                     form={addCollectionForm}
                     edit = {props.type!=='view'}
                     dataSource={data || {}}
                     col={2}
                     classStyle="baseInfo"
                     columns={baseInfoColumn.map((item: any) => {
                         if (item.dataIndex === "allocationWarehouseOut" && props.type!=='view') {
                             return ({
                                 ...item, enum: batchingStrategy?.map((item: any) => ({
                                     value: item.id,
                                     label: item.name
                                 }))
                             })
                         }
                         if (item.dataIndex === "allocationWarehouseOut" && props.type==='view') {
                            return ({
                                ...item, 
                                type:'string'
                            })
                        }
                         if (item.dataIndex === "allocationWarehouseIn" && props.type!=='view') {
                            return ({
                                ...item, enum: batchingStrategy?.map((item: any) => ({
                                    value: item.id,
                                    label: item.name
                                }))
                            })
                        }  
                        if (item.dataIndex === "allocationWarehouseIn" && props.type==='view') {
                            return ({
                                ...item, type:'string'
                            })
                        } 
                         return item
                     })}
                     onChange={performanceBondChange}
                 />
                 <DetailTitle title="出库明细" />
                 {props.type!=='view'&&<div className='btnWrapper'>
                     <Button type='primary' key="add" ghost style={{ marginRight: 8 }} disabled={!warehouseId||!inWarehouseId} onClick={() => {
                        getWarehousing(warehouseId,1)
                        setVisible(true)
                    }}>选择库存</Button>
                 </div>}
                 <CommonTable
                     style={{ padding: "0" }}
                     columns={[
                         {
                             key: 'index',
                             title: '序号',
                             dataIndex: 'index',
                             fixed: "left",
                             width: 50,
                             render: (_a: any, _b: any, index: number): React.ReactNode => {
                                 return (
                                     <span>
                                         {index + 1}
                                     </span>
                                 )
                             }
                         },
                         ...material.map((item: any) => {
                             if (["num"].includes(item.dataIndex) && props.type!=='view') {
                                 return ({
                                     ...item,
                                     render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handleNumChange(value, records.id)} key={key} />
                                 })
                             }
                             if (["allocationReservoirInName"].includes(item.dataIndex) && props.type!=='view') {
                                 return ({
                                     ...item,
                                     render: (value: string, records: any, key: number) => <Select
                                                 className="select"
                                                 style={{ width: "100%" }}
                                                 value={value ? value : '请选择'}
                                                 onChange={(val) => { handleInReservoirChange(val,records.id) }}
                                             >
                                                 {
                                                     InReservoirArea.map((item, index) => {
                                                         return (
                                                             <Select.Option
                                                                 value={item.name}
                                                             >
                                                                 {item.name}
                                                             </Select.Option>
                                                         )
                                                     })
                                                 }
                                             </Select>
                                 })
                             }
                             if (["allocationLocatorInName"].includes(item.dataIndex) && props.type!=='view') {
                                 return ({
                                     ...item,
                                     render: (value: string, records: any, key: number) => <Select
                                                 className="select"
                                                 style={{ width: "100%" }}
                                                 value={value ? value : '请选择'}
                                                 onChange={(val) => { handleInLocatorChange(val,records.id) }}
                                             >
                                                 {
                                                     InLocation.map((item, index) => {
                                                         return (
                                                             <Select.Option
                                                                 value={item.name}
                                                             >
                                                                 {item.name}
                                                             </Select.Option>
                                                         )
                                                     })
                                                 }
                                             </Select>
                                 })
                             }
                             
                             return item;
                         }),
                         {
                             title: "操作",
                             fixed: "right",
                             dataIndex: "opration",
                             render: (_: any, records: any) => <>
                                 <Button type="link" disabled={props.type=='view'} onClick={() => handleRemove(records.id)}>移除</Button>
                             </>
                         }]}
                     pagination={false}
                     dataSource={popDataList} />
             </Spin>
             <Modal width={1100} title={`选择库存`} destroyOnClose
                 visible={visible}
                 onOk={handleAddModalOk}
                 onCancel={() => {
                     setVisible(false);
                 }}
             >
                 <PopTableContent
                     data={{
                         ...addMaterial as any,
                         search: addMaterial.search.map((res: any) => {
                                     if (res.dataIndex === 'materialStandard') {
                                         return ({
                                             ...res,
                                             enum: [{value:'',label:'全部'},...materialStandardEnum]
                                         })
                                     }
                                     if (res.dataIndex === 'structureTexture') {
                                         return ({
                                             ...res,
                                             enum: [{value:'',label:'全部'},...structureTextureEnum]
                                         })
                                     }
                                     if (res.dataIndex === 'reservoirId') {
                                        return ({
                                            ...res,
                                            onChange:(val:string)=>getWarehousing(val,2),
                                            enum: ReservoirArea?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
                                        })
                                    }
                                    if (res.dataIndex === 'locatorId') {
                                        return ({
                                            ...res,
                                            enum: Location?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
                                        })
                                    }
                                     return res
                         }),
                         path: `${addMaterial.path}?warehouseId=${warehouseId}`
                     }}
                     value={{
                         id: "",
                         records: popDataList,
                         value: ""
                     }}
                     onChange={(fields: any[]) => {
                         setMaterialList(fields.map((item: any) => ({
                             ...item,
                             materialStockId: item.id,
                             allocationReservoirOutName: item?.allocationReservoirOutName?item?.allocationReservoirOutName:item?.reservoirName,
                             allocationReservoirOut: item?.allocationReservoirOut?item?.allocationReservoirOut:item?.reservoirId,
                             allocationLocatorOut: item?.allocationLocatorOut?item?.allocationLocatorOut:item?.locatorId,
                             allocationLocatorOutName: item?.allocationLocatorOutName?item?.allocationLocatorOutName:item?.locatorName,
                             weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(5)
                                 : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(5)
                                     : (Number(item?.proportion || 1) / 1000).toFixed(5),
                             totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.num || 1) / 1000 / 1000).toFixed(5)
                                 : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (item.num || 1) / 1000 / 1000 / 1000).toFixed(5)
                                     : (Number(item?.proportion || 1) * (item.num || 1) / 1000).toFixed(5)
                         })) || [])
                     }}
                 />
             </Modal>
         </Modal>
     )
 }