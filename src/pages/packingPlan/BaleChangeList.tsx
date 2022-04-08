/**
 * @author lxy
 * @copyright © 2022 
 * @description 包装计划-改包捆
 */

import React, { useRef, useState } from 'react';
import { Input, DatePicker, Button, Modal, Radio, message, Space, Select, Spin, Form, Row, Col, Tree, Card } from 'antd';
import { CommonTable, DetailContent, DetailTitle, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import { RightOutlined,PlusCircleOutlined,FormOutlined, DeleteOutlined} from '@ant-design/icons';

import RequestUtil from '../../utils/RequestUtil';
import { DataNode } from 'antd/lib/tree';
import { packageTypeOptions } from '../../configuration/DictionaryOptions';
import useRequest from '@ahooksjs/use-request';
import styles from './PackingPlan.module.less'

const { TreeNode } = Tree;
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
    const [treeData, setTreeData] = useState<IResponseTree[]>([]);
    const [expandKeys, setExpandKeys] = useState<React.Key[]>([]);
    const [selectedKey, setSelectedKey] = useState<any>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [visibleNew, setVisibleNew] = useState<boolean>(false);
    const [waitSelectedKeys, setWaitSelectedKeys] = useState<React.Key[]>([]);
    const [waitSelectedRows, setWaitSelectedRows] = useState<any>([]);
    const [busySelectedKeys, setBusySelectedKeys] = useState<React.Key[]>([]);
    const [busySelectedRows, setBusySelectedRows] = useState<any>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
    const [waitTableDataSource, setWaitTableDataSource] = useState<any[]>([]);
    const [busyTableDataSource, setBusyTableDataSource] = useState<any[]>([]);
    const [towerTArr,setTowerTArr]=useState<any>([])  //第一层塔型数据
    const [towerArr,setTowerArr]=useState<any>([])     //第二层杆塔数据
    const [packArr,setPackArr]=useState<any>([]) //第二层包数据
    const [productNumberId,setProductNumberId]=useState<string>('') //杆塔Id
    const [packageCodeId,setPackageCodeId]=useState<string>('') //包捆Id
    



    const { loading, data, run } = useRequest<any[]>((filterValue) => new Promise(async (resole, reject) => {
        // try {
            // if (filterValue.type) {
            //     const result: any[] = await RequestUtil.get(`/tower-aps/workPlan`, {
            //         ...filterValue
            //     })
            //     resole(result)
            // } else {
            //     message.warning('请选择类型')
            //     resole([])
            // }
            console.log(1)
            // const resData: IResponseTree[] = await RequestUtil.get<IResponseTree[]>('/tower-system/materialCategory/tree');
            // setTreeData(resData);
            // setExpandKeys(expandKeysByValue(resData))
            const resData: any[] = await RequestUtil.get<any[]>('/tower-production/package/plan/categories');
            console.log(resData)
            setTowerTArr(resData)
        // } catch (error) {
        //     reject(error)
        // }
    }))
    // /**
    //  * 获取expandKeys
    //  */
    // const  expandKeysByValue=(materialTrees: IResponseTree[]): number[] =>{
    //     let data: number[] = [];
    //     data = expandKeysId(materialTrees, data);
    //     return data;
    // }

    // //获取childrenID 
    // const  expandKeysId=(materialTrees: IResponseTree[], data: number[]): number[] =>{
    //     materialTrees.forEach((item: IResponseTree): void => {
    //         data.push(item.code)
    //         if (item.children && item.children.length) {
    //             expandKeysId(item.children as IResponseTree[], data);
    //         }
    //     });
    //     return data;
    // }
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
            // status: confirmStatus,
            startTime: values.time && values?.time[0].format('YYYY-MM-DD') + ' 00:00:00',
            endTime: values.time && values?.time[1].format('YYYY-MM-DD') + ' 23:59:59'
        })
    }
    // const onSelect = async (selectedKeys: React.Key[], info: any) => {
    //     let value: any = {
    //         smallCategory: info.node.level === 3 ? selectedKeys[0] : '',
    //         middleCategory: info.node.level === 2 ? selectedKeys[0] : '',
    //         bigCategory: info.node.level === 1 ? selectedKeys[0] : '',
    //     }
    //     await run({
    //         ...value,
    //     })
    // };
    const onTowerSelect = async (info: any) => {
        const resTowerData: any = await RequestUtil.get<any[]>(`/tower-production/package/plan/products/${info.id}`);
        console.log(resTowerData)
        setTowerArr(resTowerData?.productList!==null&&resTowerData?.productList.length>0?resTowerData?.productList:[])
        setPackArr([])
    };
    const onPackSelect = async (info: any) => {
        const resPackData: any[] = await RequestUtil.get<any[]>(`/tower-production/package/plan/products/pkg/${info.id}`);
        console.log(resPackData)
        setProductNumberId(info.id)
        setPackArr(resPackData!==null?resPackData:[])
        setBusyTableDataSource([])
    };
    const onSelectTable = async (info: any) => {
        const tableDataSource: any[] = await RequestUtil.get<any[]>(`/tower-production/package/plan/products/pkg/${info.id}/components`);
        console.log(tableDataSource)
        setBusyTableDataSource(tableDataSource!==null?tableDataSource:[])
    };
//     const wrapMaterialTree2DataNode=(materials: (IResponseTree & DataNode)[] = []): DataNode[] =>{
//         materials.forEach((material: (IResponseTree & DataNode)): void => {
//             material.title = material.treeName;
//             material.key = material.code;
//             material.disabled = material?.children.length>0?true:false;
            
//             if (material.children && material?.children.length) {
//                 wrapMaterialTree2DataNode(material.children as (IResponseTree & DataNode)[]);
//             }
//         });
//         return materials;
//     }
//     const renderTreeNodes = (data:any) => data.map((item:any) => {

//       if (item.children && item.children.length > 0) {
//           item.disabled = true;
          
//           return (<TreeNode key={ item.id } title={ item.treeName }  disabled={ item.disabled } >
//               { renderTreeNodes(item.children) }
//           </TreeNode>);
//       }
//       item.title = (
//         <div>
//          <span onClick={()=>{
//            console.log(2)
//          }}>
//           {item.treeName}
//          </span>
//          {/* <Icon type='close' style={{marginLeft:10}} onClick={() => this.onClose(item.key, item.defaultValue)}/>
//          <Icon type='check' style={{marginLeft:10}} onClick={() => this.onSave(item.key)}/> */}
//          <Button type='link' onClick={()=>{
//             console.log(item)
//          }}>+</Button>
//         </div>
//        );
//       return <TreeNode { ...item } key={ item.id } title={ item.title } value={ item.id } />;
//   });
//     //展开控制
//     const onExpand = (expandKeys: React.Key[]) => {
//         setExpandKeys(expandKeys)
//         setAutoExpandParent(false)
//     }
 
    return <>
        <Spin spinning={false}>
            <DetailContent>
                <Form form={form} onFinish={(values) => finish(values)}>
                    <Row>
                        <Col>
                            <Form.Item label="模糊查询项" name="fuzzyMsg" style={{marginRight:'20px'}}>
                                <Input style={{ width: '300px' }} placeholder="请输入订单工程名称/计划号/塔型进行查询" />
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
                        {towerTArr.length>0 && towerTArr.map((item:any)=>{
                            return <div ><div className={ styles.btnDefault } onClick={()=>{
                                onTowerSelect(item)
                            }}>{item.productCategoryName} <RightOutlined/></div>
                            
                            </div>
                        })}
                    </Col>
                    <Col span={2} >
                        <DetailTitle title='杆塔'/>
                        {towerArr.length>0 && towerArr.map((item:any)=>{
                            return <div onClick={()=>{
                                onPackSelect(item)
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
                        {packArr.length>0 && packArr.map((item:any)=>{
                            return <div onClick={()=>{
                                onSelectTable(item)
                            }}>{item.packageCode}（{item.packageComponentCount}件） <FormOutlined onClick={()=>{
                                formRefNew.setFieldsValue({
                                    packageCode: item.packageCode
                                })
                                setPackageCodeId(item.id)
                                setVisibleNew(true)
                            }}/> {item.packageComponentCount===0 && <DeleteOutlined onClick={()=>{
                                
                                RequestUtil.delete(`/tower-production/package`,item.id).then(()=>{
                                    message.success('删除成功！')
                                }).then(()=>{
                                    onPackSelect({id:productNumberId})
                                });
                            }}/>} </div>
                        })}
                            {/* <Tree
                                // onSelect={onSelect}
                                // treeData={wrapMaterialTree2DataNode(treeData as (IResponseTree & DataNode)[])}
                                // expandedKeys={expandKeys}
                                // autoExpandParent={autoExpandParent}
                                // onExpand={onExpand}
                                defaultExpandAll
                                selectedKeys={selectedKey}
                            >
                               {renderTreeNodes(treeData as (IResponseTree & DataNode)[])}
                            </Tree> */}
                    </Col>
                    <Col span={8} style={{marginRight:"20px"}}>
                        <DetailTitle title='件号' operation={[<Button 
                          type='primary'
                          disabled={!(busySelectedKeys.length>0)}
                          onClick={()=>{
                            const value = waitTableDataSource;
                            value.push(...busySelectedRows)
                            console.log(value)
                            setWaitTableDataSource([...value])
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
                            console.log(tempArray2)
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
                        <DetailTitle title='待放区' operation={[<Button 
                          type='primary'
                          disabled={!(waitSelectedKeys.length>0)}
                          onClick={()=>{
                            const value = busyTableDataSource;
                            value.push(busySelectedRows)
                            setBusyTableDataSource(value)
                          }}
                        >←移到包捆内</Button>]}/>
                        <CommonTable 
                            columns={columns} 
                            rowKey='id'
                            dataSource={[...waitTableDataSource]} 
                            pagination={false} 
                            rowSelection={{
                                selectedRowKeys: waitSelectedKeys,
                                type: "checkbox",
                                onChange: (selectedRowKeys: React.Key[], selectedRows:any)=>{
                                    setWaitSelectedKeys(selectedRowKeys)
                                    setWaitSelectedRows(selectedRows)
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