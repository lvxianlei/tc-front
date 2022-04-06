/**
 * @author lxy
 * @copyright © 2022 
 * @description 包装计划-改包捆
 */

import React, { useRef, useState } from 'react';
import { Input, DatePicker, Button, Modal, Radio, message, Space, Select, Spin, Form, Row, Col, Tree, Card } from 'antd';
import { CommonTable, DetailContent, DetailTitle, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { DataNode } from 'antd/lib/tree';
import useRequest from '@ahooksjs/use-request';
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
    const [treeData, setTreeData] = useState<IResponseTree[]>([]);
    const [expandKeys, setExpandKeys] = useState<React.Key[]>([]);
    const [selectedKey, setSelectedKey] = useState([]);
    const [waitSelectedKeys, setWaitSelectedKeys] = useState<React.Key[]>([]);
    const [waitSelectedRows, setWaitSelectedRows] = useState([]);
    const [busySelectedKeys, setBusySelectedKeys] = useState<React.Key[]>([]);
    const [busySelectedRows, setBusySelectedRows] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
    const [waitTableDataSource, setWaitTableDataSource] = useState<any[]>([]);
    const [busyTableDataSource, setBusyTableDataSource] = useState<any[]>([]);
// readonly selectedMaterialKeys: React.Key[];
// readonly selectedMaterials: IMaterial[];

//  const { loading, data: galvanizedTeamList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
//      try {
//          const result: { [key: string]: any } = await RequestUtil.get(`/tower-production/workshopTeam?size=1000`);
//          resole(result?.records)
//      } catch (error) {
//          reject(error)
//      }
//  }))

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
            const resData: IResponseTree[] = await RequestUtil.get<IResponseTree[]>('/tower-system/materialCategory/tree');
            setTreeData(resData);
            setExpandKeys(expandKeysByValue(resData))
        // } catch (error) {
        //     reject(error)
        // }
    }))
    /**
     * 获取expandKeys
     */
    const  expandKeysByValue=(materialTrees: IResponseTree[]): number[] =>{
        let data: number[] = [];
        data = expandKeysId(materialTrees, data);
        return data;
    }

    //获取childrenID 
    const  expandKeysId=(materialTrees: IResponseTree[], data: number[]): number[] =>{
        materialTrees.forEach((item: IResponseTree): void => {
            data.push(item.code)
            if (item.children && item.children.length) {
                expandKeysId(item.children as IResponseTree[], data);
            }
        });
        return data;
    }
    const tableColumns = [
        {
            "key": "planNumber",
            "title": "件号",
            "width": 100,
            "dataIndex": "planNumber"
        },
        {
            "key": "planNumber",
            "title": "材料规格",
            "width": 100,
            "dataIndex": "planNumber"
        },{
            "key": "planNumber",
            "title": "长度（mm）",
            "width": 100,
            "dataIndex": "planNumber"
        },{
            "key": "planNumber",
            "title": "数量",
            "width": 100,
            "dataIndex": "planNumber"
        },{
            "key": "planNumber",
            "title": "备注",
            "width": 150,
            "dataIndex": "planNumber"
        },
    ]
    const columns = [
        {
            "key": "planNumber",
            "title": "杆塔号",
            "width": 100,
            "dataIndex": "planNumber"
        },{
            "key": "planNumber",
            "title": "原包号",
            "width": 100,
            "dataIndex": "planNumber"
        },{
            "key": "planNumber",
            "title": "包属性",
            "width": 100,
            "dataIndex": "planNumber"
        },
        {
            "key": "planNumber",
            "title": "件号",
            "width": 100,
            "dataIndex": "planNumber"
        },
        {
            "key": "planNumber",
            "title": "材料规格",
            "width": 100,
            "dataIndex": "planNumber"
        },{
            "key": "planNumber",
            "title": "长度（mm）",
            "width": 100,
            "dataIndex": "planNumber"
        },{
            "key": "planNumber",
            "title": "数量",
            "width": 100,
            "dataIndex": "planNumber"
        },{
            "key": "planNumber",
            "title": "备注",
            "width": 150,
            "dataIndex": "planNumber"
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
    const onSelect = async (selectedKeys: React.Key[], info: any) => {
        let value: any = {
            smallCategory: info.node.level === 3 ? selectedKeys[0] : '',
            middleCategory: info.node.level === 2 ? selectedKeys[0] : '',
            bigCategory: info.node.level === 1 ? selectedKeys[0] : '',
        }
        await run({
            ...value,
        })
    };
    const wrapMaterialTree2DataNode=(materials: (IResponseTree & DataNode)[] = []): DataNode[] =>{
        materials.forEach((material: (IResponseTree & DataNode)): void => {
            material.title = material.treeName;
            material.key = material.code;
            material.disabled = material?.children.length>0?true:false;
            
            if (material.children && material?.children.length) {
                wrapMaterialTree2DataNode(material.children as (IResponseTree & DataNode)[]);
            }
        });
        return materials;
    }
    const renderTreeNodes = (data:any) => data.map((item:any) => {

      if (item.children && item.children.length > 0) {
          item.disabled = true;
          
          return (<TreeNode key={ item.id } title={ item.treeName }  disabled={ item.disabled } >
              { renderTreeNodes(item.children) }
          </TreeNode>);
      }
      item.title = (
        <div>
         <span onClick={()=>{
           console.log(2)
         }}>
          {item.treeName}
         </span>
         {/* <Icon type='close' style={{marginLeft:10}} onClick={() => this.onClose(item.key, item.defaultValue)}/>
         <Icon type='check' style={{marginLeft:10}} onClick={() => this.onSave(item.key)}/> */}
         <Button type='link' onClick={()=>{
console.log(item)
         }}>+</Button>
        </div>
       );
      return <TreeNode { ...item } key={ item.id } title={ item.title } value={ item.id } />;
  });
    //展开控制
    const onExpand = (expandKeys: React.Key[]) => {
        setExpandKeys(expandKeys)
        setAutoExpandParent(false)
    }
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
                    <Col span={4} style={{marginRight:"20px"}}>
                        {/* <Card bordered={false}> */}
                            {/* <Button onClick={() => {
                                this.setState({
                                    selectedKey: []
                                })
                                this.fetchMaterials({}, {
                                    current: 1,
                                    pageSize: 10,
                                    total: 0,
                                    showSizeChanger: false
                                });
                            }}>全部</Button> */}
                            <DetailTitle title='包号' operation={[<Button 
                              type='primary'
                              onClick={()=>{
                                const value = waitTableDataSource;
                                value.push(busySelectedRows)
                                setWaitTableDataSource(value)
                              }}
                            >新增包</Button>]}/>
                            <Tree
                                // onSelect={onSelect}
                                // treeData={wrapMaterialTree2DataNode(treeData as (IResponseTree & DataNode)[])}
                                // expandedKeys={expandKeys}
                                // autoExpandParent={autoExpandParent}
                                // onExpand={onExpand}
                                defaultExpandAll
                                selectedKeys={selectedKey}
                            >
                               {renderTreeNodes(treeData as (IResponseTree & DataNode)[])}
                            </Tree>
                        {/* </Card> */}
                    </Col>
                    <Col span={9} style={{marginRight:"20px"}}>
                        <DetailTitle title='件号' operation={[<Button 
                          type='primary'
                          disabled={!(busySelectedKeys.length>0)}
                          onClick={()=>{
                            const value = waitTableDataSource;
                            value.push(busySelectedRows)
                            setWaitTableDataSource(value)
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
                    <Col span={10} style={{marginRight:"20px"}}>
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
            </DetailContent>
        </Spin>
    </>
}

// import { Transfer, Switch } from 'antd';
// import React from 'react';

// export default function DailySchedule(): React.ReactNode{
//   const [mockData, setMockData] = React.useState([]);
//   const [targetKeys, setTargetKeys] = React.useState([]);

//   React.useEffect(() => {
//     const newTargetKeys :any= [];
//     const newMockData:any = [];
//     for (let i = 0; i < 2000; i++) {
//       const data = {
//         key: i.toString(),
//         title: `content${i + 1}`,
//         description: `description of content${i + 1}`,
//         chosen: Math.random() * 2 > 1,
//       };
//       if (data.chosen) {
//         newTargetKeys.push(data.key);
//       }
//       newMockData.push(data);
//     }

//     setTargetKeys(newTargetKeys);
//     setMockData(newMockData);
//   }, []);

//   const onChange = (newTargetKeys:any, direction: any, moveKeys: any) => {
//     console.log(moveKeys);
//     setTargetKeys(newTargetKeys);
//   };

//   return (
//     <>
//       <Transfer
//         dataSource={mockData}
//         targetKeys={targetKeys}
//         onChange={onChange}
//         render={(item:any) => item.title}
//         pagination={false}
//       />
//     </>
//   );
// };