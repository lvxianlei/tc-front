/**
 * @author lxy
 * @copyright © 2022 
 * @description 包装计划-改包捆
 */

import React, { useState } from 'react';
import { Input, Button, Modal, message, Space, Select, Spin, Form, Row, Col, Tree, Popconfirm } from 'antd';
import { CommonTable, DetailContent, DetailTitle } from '../common';
import { RightOutlined,PlusCircleOutlined,FormOutlined, DeleteOutlined} from '@ant-design/icons';

import RequestUtil from '../../utils/RequestUtil';
import { packageTypeOptions } from '../../configuration/DictionaryOptions';
import useRequest from '@ahooksjs/use-request';
export interface IPackingPlan {
    readonly id?: string;
    readonly angleTeamId?: string;
    readonly boardTeamId?: string;
    readonly pipeTeamId?: string;
    readonly angleTeamName?: string;
    readonly boardTeamName?: string;
    readonly pipeTeamName?: string;
}

export interface IResponseData {
    readonly total: number | undefined;
    readonly size: number | undefined;
    readonly current: number | undefined;
    readonly records: any[];
}

export interface IResponseTree {
    readonly id: number;
    readonly parentId: number|string;
    readonly treeName: string;
    readonly checked: boolean;
    readonly level: string;
    readonly code: number;
    readonly name: string;
    readonly children: IResponseTree[];
}
export default function DailySchedule(): React.ReactNode {
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const [formRefNew] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false);
    const [visibleNew, setVisibleNew] = useState<boolean>(false);
    const [waitSelectedKeys, setWaitSelectedKeys] = useState<React.Key[]>([]);
    const [waitSelectedRows, setWaitSelectedRows] = useState<any>([]);
    const [busySelectedKeys, setBusySelectedKeys] = useState<React.Key[]>([]);
    const [busySelectedRows, setBusySelectedRows] = useState<any>([]);
    const [waitTableDataSource, setWaitTableDataSource] = useState<any[]>([]);
    const [busyTableDataSource, setBusyTableDataSource] = useState<any[]>([]);
    const [towerTArr,setTowerTArr]= useState<any>([])  //第一层塔型数据
    const [towerArr,setTowerArr]= useState<any>([])     //第二层杆塔数据
    const [packArr,setPackArr]= useState<any>([]) //第二层包数据
    const [towerTId,setTowerTId]= useState<string>('') //杆塔Id
    const [productNumberId,setProductNumberId]= useState<string>('') //杆塔Id
    const [packageCodeId,setPackageCodeId]= useState<string>('') //包捆Id
    const [code,setCode] = useState<any>({})//件号选中数据
    const [numTowerT,setNumTowerT]= useState<any>('');
    const [numTower,setNumTower]= useState<any>('');
    const [numPack,setNumPack]= useState<any>('');



    const { loading, data, run } = useRequest<any[]>((filterValue) => new Promise(async (resole, reject) => {
            const resData: any[] = await RequestUtil.get<any[]>('/tower-production/package/plan/categories',
                filterValue
            );
            console.log(resData)
            setTowerTArr(resData)
            setTowerArr('')
            setPackArr('')
            setNumPack('')
            setNumTower('')
            setNumTowerT('')
            setPackageCodeId('')
            setTowerTId('')
            setProductNumberId('')
            setCode({})
            // setWaitSelectedKeys([])
            // setWaitSelectedRows([])
            setBusySelectedKeys([])
            setBusySelectedRows([])
            // setWaitTableDataSource([])
            setBusyTableDataSource([])
    }))
    const tableColumns = [
        {
            "key": "code",
            "title": "件号",
            "width": 100,
            "dataIndex": "code"
        },
        {
            "key": "structureSpec",
            "title": "材料规格",
            "width": 100,
            "dataIndex": "structureSpec"
        },{
            "key": "length",
            "title": "长度（mm）",
            "width": 100,
            "dataIndex": "length"
        },{
            "key": "num",
            "title": "数量",
            "width": 100,
            "dataIndex": "num"
        },{
            "key": "description",
            "title": "备注",
            "width": 150,
            "dataIndex": "description"
        },
    ]
    const columns = [
        {
            "key": "productNumber",
            "title": "杆塔号",
            "width": 100,
            "dataIndex": "productNumber"
        },{
            "key": "packageCode",
            "title": "原包号",
            "width": 100,
            "dataIndex": "packageCode"
        },{
            "key": "packageAttribute",
            "title": "包属性",
            "width": 100,
            "dataIndex": "packageAttribute",
            "render":(text:number)=>{
                return text===0?'专用包':text===1?'通用包':"-"
            }
        },
        {
            "key": "code",
            "title": "件号",
            "width": 100,
            "dataIndex": "code"
        },
        {
            "key": "structureSpec",
            "title": "材料规格",
            "width": 100,
            "dataIndex": "structureSpec"
        },{
            "key": "length",
            "title": "长度（mm）",
            "width": 100,
            "dataIndex": "length"
        },{
            "key": "num",
            "title": "数量",
            "width": 100,
            "dataIndex": "num"
        },{
            "key": "description",
            "title": "备注",
            "width": 150,
            "dataIndex": "description"
        },
    ]
    const finish = async (values: any) => {
        await run({
            ...values,
        })
    }
    //获取杆塔
    const onTowerSelect = async (info: any) => {
        const resTowerData: any = await RequestUtil.get<any[]>(`/tower-production/package/plan/products/${info.id}`);
        setTowerTId(info.id);
        setTowerArr(resTowerData?.productList!==null&&resTowerData?.productList.length>0?resTowerData?.productList:[])
        setNumTower('')
        setNumPack('')
        setPackArr([])
    };
    //获取包号
    const onPackSelect = async (info: any) => {
        const resPackData: any[] = await RequestUtil.get<any[]>(`/tower-production/package/plan/products/pkg/${info.id}`);
        setProductNumberId(info.id)
        if(info.hasOwnProperty("productNumber")){
            setNumPack('')
        }
        setPackArr(resPackData!==null?resPackData:[])
        setBusyTableDataSource([])
    };
    //获取件号
    const onSelectTable = async (info: any, type: string) => {
        const tableDataSource: any[] = await RequestUtil.get<any[]>(`/tower-production/package/plan/products/pkg/${info.id}/components`);
        
        var tempArray1:any = [];//临时数组1
        var tempArray2:any = [];//临时数组2
        if(tableDataSource!==null&& tableDataSource.length>0&& type!=='unnormal'){
            for(var i=0;i<waitTableDataSource.length;i++){
                tempArray1[waitTableDataSource[i]?.id]=true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
            }
            for(var i=0;i<tableDataSource.length;i++){
                if(!tempArray1[tableDataSource[i]?.id]){
                tempArray2.push(tableDataSource[i]);//过滤array1 中与array2 相同的元素；
                }
            }
        }
        console.log(tableDataSource)
        console.log(tempArray2)
        setBusySelectedKeys([])
        setBusySelectedRows([])
        setBusyTableDataSource(type==='unnormal'?tableDataSource:tempArray2)
    };
    const selectTowerTStyle = (index:number)=>{
        if(index===numTowerT){
            return{
                color: '#fff',
                backgroundColor:'#ffa538',
                borderColor: '#ffa538'
            }
        }else{
            return{
                color: '#000'
            }
        } 
    }
    const selectTowerStyle = (index:number)=>{
        if(index===numTower){
            return{
                color: '#fff',
                backgroundColor:'#ffa538',
                borderColor: '#ffa538'
            }
        }else{
            return{
                color: '#000'
            }
        } 
    }
    const selectPackStyle = (index:number)=>{
        if(index===numPack){
            return{
                color: '#fff',
                backgroundColor:'#ffa538',
                borderColor: '#ffa538'
            }
        }else{
            return{
                color: '#000'
            }
        } 
    }
 
    return <>
        <Spin spinning={false}>
            <DetailContent>
                <Form form={form} onFinish={(values) => finish(values)}>
                    <Row>
                        <Col>
                            <Form.Item label="模糊查询项" name="fuzzyQuery" style={{marginRight:'20px'}}>
                                <Input style={{ width: '300px' }} placeholder="请输入计划号/塔型进行查询" />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Space direction="horizontal">
                                <Button type='primary' htmlType="submit" >查询</Button>
                                <Button type='ghost' htmlType="reset">重置</Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
                <Row style={{ background: '#fff' }}>
                    <Col span={2} >
                        <DetailTitle title='塔型'/>
                        {towerTArr.length>0 && towerTArr.map((item:any,index:number)=>{
                            return <div style={selectTowerTStyle(index)} onClick={()=>{
                                onTowerSelect(item)
                                setNumTowerT(index)
                            }}>{item.productCategoryName}<RightOutlined/></div>
                        })}
                    </Col>
                    <Col span={2} >
                        <DetailTitle title='杆塔'/>
                        {towerArr.length>0 && towerArr.map((item:any,index:number)=>{
                            return <div style={selectTowerStyle(index)} onClick={()=>{
                                onPackSelect(item)
                                setNumTower(index)
                            }}>{item.productNumber} <RightOutlined/></div>
                        })}
                    </Col>
                    <Col span={2} style={{marginRight:"20px"}}>
                        <DetailTitle title='包号' operation={[<PlusCircleOutlined onClick={()=>{
                            if(productNumberId){
                                setVisible(true)
                            }else{
                                message.error('未选择杆塔，不可新增包！')
                            }
                           
                            }}/>]}
                        />
                        {packArr.length>0 && packArr.map((item:any,index:number)=>{
                            return <div style={selectPackStyle(index)} onClick={()=>{
                                onSelectTable(item,'normal')
                                setCode(item)
                                setNumPack(index)
                            }}> {item.packageCode}（{item.packageComponentCount}件）
                                {item.packageAttribute!==0?<Popconfirm
                                    title="当前为通用包，是否批量改名?"
                                    onConfirm={() => {
                                        formRefNew.setFieldsValue({
                                            packageCode: item.packageCode
                                        })
                                        setPackageCodeId(item.id)
                                        setVisibleNew(true)
                                    }}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <FormOutlined/>
                                </Popconfirm>:
                                <FormOutlined onClick={()=>{
                                        formRefNew.setFieldsValue({
                                            packageCode: item.packageCode
                                        })
                                        setPackageCodeId(item.id)
                                        setVisibleNew(true)
                                }}/>}
                                {item.packageComponentCount===0 && <DeleteOutlined onClick={()=>{
                                
                                    RequestUtil.delete(`/tower-production/package`,item.id).then(()=>{
                                        message.success('删除成功！')
                                    }).then(()=>{
                                        onPackSelect({id:productNumberId})
                                    });
                            }}/>} </div>
                        })}
                    </Col>
                    <Col span={8} style={{marginRight:"20px"}}>
                        <DetailTitle title='件号' operation={[<Button 
                          type='primary'
                          disabled={!(busySelectedKeys.length>0)}
                          onClick={async ()=>{
                            const value = waitTableDataSource;
                            value.push(...busySelectedRows)
                            console.log('待选区所有数据',value)
                            const addValue:any[] = await  RequestUtil.get(`/tower-production/package/plan/${towerTId}/products/pkg/${code?.packageCode}/components/${busySelectedRows.map((item:any)=>{
                                return item.code
                            }).join(',')}`)
                            var temp:any = {};  //用于id判断重复
                            var result:any[] = []; //最后的新数组
                             
                            const waitValue =  [...value].concat([...addValue])
                            waitValue.map(function (item, index) {
                              if(!(temp[item.id])){
                                result.push(item);
                                temp[item.id] = true;
                              }
                            });
                            console.log('去重数据',result)
                            setWaitTableDataSource(result)
                            var tempArray1:any = [];//临时数组1
                            var tempArray2:any = [];//临时数组2

                            for(var i=0;i<busySelectedRows.length;i++){
                                tempArray1[busySelectedRows[i]?.id]=true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
                            }
                            for(var i=0;i<busyTableDataSource.length;i++){
                                if(!tempArray1[busyTableDataSource[i]?.id]){
                                tempArray2.push(busyTableDataSource[i]);//过滤array1 中与array2 相同的元素；
                                }
                            }
                            console.log('包捆内数据',tempArray2)
                            setBusySelectedKeys([])
                            setBusySelectedRows([])
                            setBusyTableDataSource(tempArray2)
                          }}
                        >移到待放区→</Button>]}/>
                        <CommonTable 
                            columns={tableColumns} 
                            rowKey='id'
                            dataSource={[...busyTableDataSource]} 
                            pagination={false} 
                            rowSelection={{
                                selectedRowKeys: busySelectedKeys,
                                type: "checkbox",
                                onChange: (selectedRowKeys: React.Key[], selectedRows:any)=>{
                                    setBusySelectedKeys(selectedRowKeys)
                                    setBusySelectedRows(selectedRows)
                                }
                            }}
                        />
                    </Col>
                    <Col span={9} style={{marginRight:"20px"}}>
                        <DetailTitle title='待放区' operation={[waitSelectedRows.map((items:any) => items.packageAttribute).indexOf(1)>-1?
                        <Popconfirm 
                            title={'存在其他通用包，是否确定将此构件平均放在通用包内？'}
                            onConfirm={() => {
                                const submitData={
                                    packageId: code?.id,
                                    idList: waitSelectedRows.map((item: { id: any; })=>{return item.id})
                                }
                                RequestUtil.put(`/tower-production/package/components`,submitData).then(()=>{
                                    message.success('保存成功！')
                                }).then(async ()=>{
                                    var tempArray1:any = [];//临时数组1
                                    var tempArray2:any = [];//临时数组2
        
                                    for(var i=0;i<waitSelectedRows.length;i++){
                                        tempArray1[waitSelectedRows[i]?.id]=true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
                                    }
                                    for(var i=0;i<waitTableDataSource.length;i++){
                                        if(!tempArray1[waitTableDataSource[i]?.id]){
                                        tempArray2.push(waitTableDataSource[i]);//过滤array1 中与array2 相同的元素；
                                        }
                                    }
                                    setWaitSelectedRows([])
                                    setWaitSelectedKeys([])
                                    console.log(tempArray2)
                                    setWaitTableDataSource(tempArray2)
                                    await onPackSelect({id: productNumberId})
                                    await onSelectTable({id: code?.id},'unnormal')
                                })
                            }}
                            okText="是"
                            cancelText="否"
                            disabled={!(waitSelectedKeys.length>0)}
                        >
                            <Button type='primary' disabled={!(waitSelectedKeys.length>0)}>←移到包捆内</Button>
                        </Popconfirm>:
                        <Button 
                            type='primary'
                            disabled={!(waitSelectedKeys.length>0)}
                            onClick={()=>{
                                console.log(waitSelectedRows)
                                const submitData={
                                    packageId: code?.id,
                                    idList: waitSelectedRows.map((item: { id: any; })=>{return item.id})
                                }
                                RequestUtil.put(`/tower-production/package/components`,submitData).then(()=>{
                                    message.success('保存成功！')
                                }).then(async ()=>{
                                    var tempArray1:any = [];//临时数组1
                                    var tempArray2:any = [];//临时数组2
        
                                    for(var i=0;i<waitSelectedRows.length;i++){
                                        tempArray1[waitSelectedRows[i]?.id]=true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
                                    }
                                    for(var i=0;i<waitTableDataSource.length;i++){
                                        if(!tempArray1[waitTableDataSource[i]?.id]){
                                        tempArray2.push(waitTableDataSource[i]);//过滤array1 中与array2 相同的元素；
                                        }
                                    }
                                    setWaitSelectedRows([])
                                    setWaitSelectedKeys([])
                                    console.log(tempArray2)
                                    setWaitTableDataSource(tempArray2)
                                    await onPackSelect({id: productNumberId})
                                    await onSelectTable({id: code?.id},'unnormal')
                                })
                            }}
                        >←移到包捆内</Button>]}/>
                        <CommonTable 
                            columns={columns} 
                            // rowKey='id'
                            rowKey={(records: any) => `${records.packageAttribute}-${records.code}`}
                            dataSource={[...waitTableDataSource]} 
                            pagination={false} 
                            rowSelection={{
                                selectedRowKeys: waitSelectedKeys,
                                type: "checkbox",
                                onChange: (selectedRowKeys: React.Key[], selectedRows:any)=>{
                                    setWaitSelectedKeys(selectedRowKeys)
                                    
                                    var tempArray1:any = [];//临时数组1
                                    var tempArray2:any = [];//临时数组2

                                    for(var i=0;i<selectedRows.length;i++){
                                        tempArray1[selectedRows[i]?.packageAttribute]=true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
                                        tempArray1[selectedRows[i]?.code]=true;
                                    }
                                    for(var i=0;i<waitTableDataSource.length;i++){
                                        if(tempArray1[waitTableDataSource[i]?.code]&&tempArray1[waitTableDataSource[i]?.packageAttribute]){
                                        tempArray2.push(waitTableDataSource[i]);//过滤array1 中与array2 相同的元素；
                                        }
                                    }
                                    setWaitSelectedRows(tempArray2)
                                    // console.log()
                                }
                            }}
                        />
                    </Col>
                </Row>
                <Modal visible={ visible } width="40%" title={ "添加包捆" }  onOk={ async ()=>{
                    await formRef.validateFields()
                    const value = formRef.getFieldsValue(true)
                    const submitData = {
                        packageCode:value.packageCode,
                        packageAttribute: value.packageAttribute,
                        packageType: value.packageType,
                        productId: productNumberId
                    }
                    RequestUtil.post(`/tower-production/package`,submitData).then(()=>{
                        message.success('新增成功！')
                        setVisible(false)
                    }).then(()=>{
                        onPackSelect({id:productNumberId})
                    });
                } } onCancel={ ()=>{
                    setVisible(false)
                    formRef.setFieldsValue({
                        packageCode:'未命名包',
                        packageType:'',
                    })
                } }>
                    <Form form={ formRef } labelCol={{ span: 4 }}>
                        <Form.Item name="packageCode" label="包号" initialValue={'未命名包'} rules={[{
                                "required": true,
                                "message": "请输入包号"
                            },
                            {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                            }]}
                        >
                            <Input placeholder="请输入" maxLength={ 50 } />
                        </Form.Item>
                        <Form.Item name="packageAttribute" label="包属性" initialValue={0}  rules={[{
                                "required": true,
                                "message": "请选择包属性"
                            }]}
                        >
                            <Select placeholder="请选择" defaultValue={0} disabled style={{ width: "100%" }}>
                                <Select.Option key={0} value={0}>专用包</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="packageType" label="包类型"  rules={[{
                                "required": true,
                                "message": "请选择包类型"
                            }]}
                        >
                            <Select placeholder="请选择包类型"  style={{ width: "100%" }} >
                                {packageTypeOptions && packageTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal visible={ visibleNew } width="40%" title={ "重命名包捆" }  onOk={ async ()=>{
                    await formRefNew.validateFields()
                    const value = formRefNew.getFieldsValue(true)
                    const submitData = {
                        packageCode:value.packageCode,
                        id: packageCodeId
                    }
                    RequestUtil.put(`/tower-production/package`,submitData).then(()=>{
                        message.success('命名成功！')
                        setVisibleNew(false)
                    }).then(()=>{
                        onPackSelect({id:productNumberId})
                    });
                } } onCancel={ ()=>{
                    setVisibleNew(false)
                    formRefNew.setFieldsValue({
                        packageCode:''
                    })
                } }>
                    <Form form={ formRefNew } labelCol={{ span: 4 }}>
                        <Form.Item name="packageCode" label="包号"  rules={[{
                                "required": true,
                                "message": "请输入包号"
                            },
                            {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                            }]}
                        >
                            <Input placeholder="请输入" maxLength={ 50 } />
                        </Form.Item>
                    </Form>
                </Modal>
            </DetailContent>
        </Spin>
    </>
}