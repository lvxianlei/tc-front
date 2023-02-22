/**
 * 创建出库单
 */
import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, Form, Button, InputNumber, message, Spin, TreeSelect, Input } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, IntgSelect, PopTableContent } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import {
    material,
    baseInfoColumn,
    addMaterial,
    addMaterialB
} from "./CreatePlan.json";
import moment from 'moment';
import styles from "./CreatePlan.module.less";
import { totalTaxPrice } from '@utils/calcUtil';

export default forwardRef(function CreatePlan(props: any, ref): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [form] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [visibleB, setVisibleB] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [warehouseId, setWarehouseId] = useState<string>("");
    const [type, setType] = useState<any>(0);
    const handleAddModalOk = () => {
        const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        // for (let i = 0; i < popDataList.length; i += 1) {
        //     for (let p = 0; p < materialList.length; p += 1) {
        //         if (popDataList[i].id === materialList[p].id) {
        //             materialList[p].structureTexture = popDataList[i].structureTexture;
        //             materialList[p].materialTexture = popDataList[i].materialTexture;
        //         }
        //     }
        // }
        setMaterialList([...materialList, ...newMaterialList])
        setPopDataList([...materialList.map((item: any) => {
            return ({
                ...item,
                warehouseItemId: item.locatorId
            })
        })])
        setVisible(false)
    }
    const handleAddModalOkB = () => {
        const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        // for (let i = 0; i < popDataList.length; i += 1) {
        //     for (let p = 0; p < materialList.length; p += 1) {
        //         if (popDataList[i].id === materialList[p].id) {
        //             materialList[p].structureTexture = popDataList[i].structureTexture;
        //             materialList[p].materialTexture = popDataList[i].materialTexture;
        //         }
        //     }
        // }
        setMaterialList([...materialList, ...newMaterialList])
        setPopDataList([...materialList.map((item: any) => {
            return ({
                ...item,
                warehouseItemId: item.locatorId
            })
        })])
        setVisibleB(false)
    }
    const handleNumChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    num: value,
                    // 含税金额
                    totalTaxPrice: totalTaxPrice(item.taxPrice, value),
                    // 不含税金额
                    totalUnTaxPrice: totalTaxPrice(item.unTaxPrice, value)
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handleDescriptionChange = async (value: any, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    remark: value
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    
}

    // 移除
    const handleRemove = (id: string) => {
        const value = materialList.filter((item: any) => item.id !== id)
        form.setFieldsValue({
            list: value
        })
        setMaterialList(value)
        setPopDataList(value)
    }

    const performanceBondChange = (fields: { [key: string]: any }) => {
        if (fields.outType&&fields.outType!==0) {
            setType(fields.outType)
            setPopDataList([])
            setMaterialList([])
            return;
        }
        if (fields.outType===0) {
            setType(fields.outType)
            setPopDataList([])
            setMaterialList([])
            return;
        }
        if (fields.warehouseId) {
            setWarehouseId(fields.warehouseId);
            setPopDataList([])
            setMaterialList([])
            return;
        }
        if (fields.pickingUserId) {
            addCollectionForm.setFieldsValue({
                departmentName: {
                    id:fields.pickingUserId.records[0].dept,
                    records: [{
                        id:fields.pickingUserId.records[0].dept,
                        name: fields.pickingUserId.records[0].deptName
                    }],
                    value: fields.pickingUserId.records[0].deptName,
                }
            })
            return;
        }
    }

    const handleCreateClick = () => new Promise(async (resove, reject) => {
        try {
            const baseInfo = await addCollectionForm.validateFields();
            if (materialList.length < 1) {
                message.error("请您选择出库明细!");
                return false;
            }
            // 添加对长度以及数量的拦截
            let flag = false;
            for (let i = 0; i < materialList.length; i += 1) {
                if (!(materialList[i].num)) {
                    flag = true;
                }
            }
            if (flag) {
                message.error("请您填写数量！");
                throw Error('请您填写数量！')
            }
            await saveRun({
                outStockDetailDTOList: materialList.map((item:any)=>{
                    return {
                        ...item,
                        num: type===1||type==='1'? 0-item.num : item.num, 
                        totalTaxPrice: type===1||type==='1'? 0-item.totalTaxPrice : item.totalTaxPrice,
                        totalUnTaxPrice: type===1||type==='1'? 0-item.totalUnTaxPrice : item.totalUnTaxPrice,
                    }
                }),
                ...baseInfo,
                pickingTeamName: baseInfo?.dept.value,
                pickingTeamId: baseInfo?.dept.id,
                pickingTime: baseInfo.pickingTime+' 00:00:00',
                pickingUserId: baseInfo?.pickingUserId.id,
                departmentId: baseInfo?.departmentName?.id,
                departmentName: baseInfo?.departmentName?.value
            });
            resove(true)
        } catch (error) {
            console.log(error);
            reject(false)
        }
    })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const path = props.type === "create" ? `/tower-storage/auxiliaryOutStock/save` : '/tower-storage/auxiliaryOutStock'
            const result: { [key: string]: any } = await RequestUtil[props.type === "create" ? "post" : "put"](path, props.type === "create" ? {
                ...data,
                materialType: 2
            } : {
                ...data,
                materialType: 2,
                id: props.id
            })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(
                `/tower-storage/auxiliaryOutStock/${props.id}`,
                { materialType: 2 }
            )
            setPopDataList(result?.outStockDetailVOList.map((item:any)=>{
                return {
                    ...item,
                    num: result?.outType===1||result?.outType==='1' ? 0 - item.num : item.num, 
                    totalTaxPrice: result?.outType===1||result?.outType==='1' ? 0 - item.totalTaxPrice : item.totalTaxPrice,
                    totalUnTaxPrice: result?.outType===1||result?.outType==='1' ? 0 - item.totalUnTaxPrice : item.totalUnTaxPrice,
                }
            }))
            setMaterialList(result?.outStockDetailVOList.map((item:any)=>{
                return {
                    ...item,
                    num: result?.outType===1||result?.outType==='1' ? 0 - item.num : item.num, 
                    totalTaxPrice: result?.outType===1||result?.outType==='1' ? 0 - item.totalTaxPrice : item.totalTaxPrice,
                    totalUnTaxPrice: result?.outType===1||result?.outType==='1' ? 0 - item.totalUnTaxPrice : item.totalUnTaxPrice,
                }
            }))
            setWarehouseId(result?.warehouseId)
            setType(result?.outType)
            // addCollectionForm.setFieldsValue({...result,dept:{id:result?.deptId,value:result?.deptName}})
            resole({
                ...result,
                pickingUserId: {
                    id: result?.applyStaffId,
                    value: result?.applyStaffName
                },
                dept:{
                    id:result?.pickingTeamId||'',
                    value:result?.pickingTeamName||''
                },
                pickingTime: result?.createTime
            })
        } catch (error) {
            reject(error)
        }
    }), {
        ready: props.type === "edit" && props.visible,
        refreshDeps: [props.type, props.visible]
    })

    //库区库位
    const { data: locatorData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/tree/${warehouseId}`)
            resole(result?.map((item: any) => ({
                label: item.name,
                value: item.id,
                key: item.id,
                disabled: true,
                children: item.children?.map((cItem: any) => ({
                    label: cItem.name,
                    value: cItem.id,
                    key: cItem.id
                }) || [])
            })) || [])
        } catch (error) {
            reject(error)
        }
    }), { ready: !!warehouseId, refreshDeps: [warehouseId] })
    // 获取所有的仓库
    const { data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(
                `/tower-storage/warehouse/getWarehouses`, {
                materialType: 2
            });
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const resetFields = () => {
        setMaterialList([])
        setPopDataList([])
    }

    useImperativeHandle(ref, () => ({
        onSubmit: handleCreateClick,
        resetFields
    }), [ref, handleCreateClick, resetFields])

    useEffect(() => {
        if (props.visible) {
            addCollectionForm.setFieldsValue({
                type:0,
                pickingTime: moment(new Date()).format("YYYY-MM-DD"),
                dept:{
                    id:'',
                    value:''
                },
            })
        }
    }, [props.visible])
    return (<>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo
                form={addCollectionForm}
                edit
                dataSource={data||{}}
                col={2}
                classStyle={styles.baseInfo}
                columns={baseInfoColumn.map((item: any) => {
                    if (item.dataIndex === "warehouseId") {
                        return ({
                            ...item,
                            enum: batchingStrategy?.map((item: any) => ({
                                value: item.id,
                                label: item.name
                            }))
                        })
                    }
                    // if (item.dataIndex === "departmentName") {
                    //     return ({
                    //         ...item,
                    //         enum: batchingStrategy?.map((item: any) => ({
                    //             value: item.id,
                    //             label: item.name
                    //         }))
                    //     })
                    // }
                    return item
                })}
                onChange={performanceBondChange}
            />
            <DetailTitle title="出库明细" />
            <div className={styles.btnWrapper}>
                { (type === 1 || type === '1')?<Button
                    type='primary'
                    key="add"
                    ghost
                    style={{ marginRight: 8 }}
                    disabled={!warehouseId}
                    onClick={() => setVisibleB(true)}>选择出库明细</Button>
                :<Button
                    type='primary'
                    key="add"
                    ghost
                    style={{ marginRight: 8 }}
                    disabled={!warehouseId}
                    onClick={() => setVisible(true)}>选择库存</Button>}
            </div>
            <Form form={form} className={styles.descripForm}>
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
                        // if (["num"].includes(item.dataIndex)) {
                        //     return ({
                        //         ...item,
                        //         render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handleNumChange(value, records.id)} key={key} />
                        //     })
                        // }
                        if (["num"].includes(item.dataIndex)&&![1,'1'].includes(type)) {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => {return <Form.Item 
                                    name={['list', key, 'num']}
                                    initialValue={value||undefined}
                                    rules={[{
                                        validator: async (rule: any, value: any, callback: (error?: string) => void) => {
                                            const resData:any = await RequestUtil.get(`/tower-storage/materialStock/outDetails?warehouseId=${warehouseId}&current=1&size=10&rawStockId=${records?.rawStockId}`);
                                            if(resData.records[0]?.num < value)
                                            return Promise.reject(`数量不可大于${resData.records[0]?.num}`);
                                            else return Promise.resolve('数量可用');
                                        }
                                    }]}>
                                        <InputNumber  onChange={(value: number) => handleNumChange(value, records.id)} key={key}  disabled={records?.outStockItemStatus&&records?.outStockItemStatus!==0} />
                                    </Form.Item>
                                // render: (value: number, records: any, key: number) => <InputNumber max={records?.maxNum} min={1} value={value || undefined} onChange={(value: number) => handleNumChange(value, records.id)} key={key}  disabled={records?.outStockItemStatus&&records?.outStockItemStatus!==0}/>
                            }})
                        }
                        if (["num"].includes(item.dataIndex)&&[1,'1'].includes(type)) {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => {return <Form.Item 
                                    name={['list', key, 'num']}
                                    initialValue={value||undefined}
                                    // rules={[{
                                    //     validator: async (rule: any, value: any, callback: (error?: string) => void) => {
                                    //         const resData:any = await RequestUtil.get(`/tower-storage/materialStock/outDetails?warehouseId=${warehouseId}&current=1&size=10&rawStockId=${records?.rawStockId}`);
                                    //         if(resData.records[0]?.num < value)
                                    //         return Promise.reject(`数量不可大于${resData.records[0]?.num}`);
                                    //         else return Promise.resolve('数量可用');
                                    //     }
                                    // }]}
                                    >
                                        <InputNumber  onChange={(value: number) => handleNumChange(value, records.id)} key={key} />
                                    </Form.Item>
                                // render: (value: number, records: any, key: number) => <InputNumber max={records?.maxNum} min={1} value={value || undefined} onChange={(value: number) => handleNumChange(value, records.id)} key={key}  disabled={records?.outStockItemStatus&&records?.outStockItemStatus!==0}/>
                            }})
                        }
                        if (["remark"].includes(item.dataIndex)) {
                            return ({
                                ...item,
                                width: 160,
                                render: (value: string, records: any, key: number) => {return <Form.Item 
                                    name={['list', key, 'remark']}>
                                        <Input defaultValue={value || undefined}   onBlur={(e:any)=> handleDescriptionChange(e.target.value,records.id)} maxLength={50} />
                                    </Form.Item>
                            }})
                        }
                        return item;
                    }),
                    {
                        title: "操作",
                        fixed: "right",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            {/* <Button type="link" style={{marginRight: 8}} onClick={() => handleCopy(records)}>复制</Button> */}
                            <Button type="link" disabled={records.source === 1} onClick={() => handleRemove(records.id)}>移除</Button>
                        </>
                    }]}
                pagination={false}
                dataSource={popDataList} />
            </Form>
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
                    search: (addMaterial as any).search.map((item: any) => {
                        if (item.dataIndex === "locatorId") {
                            return ({
                                ...item,
                                treeData: locatorData,
                            })
                        }
                        return item
                    }),
                    path: `${addMaterial.path}?materialType=2&warehouseId=${warehouseId}`
                }}
                value={{
                    id: "",
                    records: popDataList,
                    value: ""
                }}
                onChange={(fields: any[]) => {
                    setMaterialList(fields.map((item:any)=>{
                        return{
                            ...item,
                            rawStockId: item.id,
                        }
                    }) || [])
                }}
            />
        </Modal>
        <Modal width={1100} title={`选择出库明细`} destroyOnClose
            visible={visibleB}
            onOk={handleAddModalOkB}
            onCancel={() => {
                setVisibleB(false);
            }}
        >
            <PopTableContent
                data={{
                    ...addMaterialB as any,
                    search: (addMaterialB as any).search.map((item: any) => {
                        if (item.dataIndex === "locatorId") {
                            return ({
                                ...item,
                                treeData: locatorData,
                            })
                        }
                        if (item.dataIndex === 'applyStaffId') {
                            return ({
                                ...item,
                                format: (search:any) => {return search.value},
                                render: () => <IntgSelect width={200} />
                            })
                        }
                        return item
                    }),
                    path: `${addMaterialB.path}?status=2&warehouseId=${warehouseId}&outType=0`
                }}
                value={{
                    id: "",
                    records: popDataList,
                    value: ""
                }}
                onChange={(fields: any[]) => {
                    setMaterialList(fields.map((item:any)=>{
                        return{
                            ...item,
                            rawStockId: item.id,
                        }
                    }) || [])
                }}
            />
        </Modal>
    </>
    )
})