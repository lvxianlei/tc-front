
/**
 * @author zyc
 * @copyright © 2021 
 * @description 车间班组管理
 */

 import React, { useState } from 'react';
 import { Space, Input, Button, Modal, Select, Form, Popconfirm, message, Row, Col, Spin } from 'antd';
 import { CommonTable, Page } from '../common';
 import { FixedType } from 'rc-table/lib/interface';
 import RequestUtil from '../../utils/RequestUtil';
 import WorkshopUserModal from '../../components/UserSelectedModal';
 import useRequest from '@ahooksjs/use-request';
 import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
 import { DataType } from '../../components/AbstractSelectableModal';
import { useHistory } from 'react-router-dom';
 
 
 export default function WorkshopTeamMngt(): React.ReactNode {
     const history = useHistory()
     const columns = [
         {
             key: 'index',
             title: '序号',
             fixed: "left" as FixedType,
             dataIndex: 'index',
             width: 100,
             render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
         },
         {
             key: 'teamName',
             title: '班组名称',
             width: 200,
             dataIndex: 'teamName'
         },
         {
             key: 'classPresidentName',
             title: '班长',
             width: 200,
             dataIndex: 'classPresidentName'
         },
         {
             key: 'number',
             title: '总人数',
             width: 200,
             dataIndex: 'number'
         },
         {
             key: 'description',
             title: '备注',
             width: 200,
             dataIndex: 'description'
         },
         {
             key: 'operation',
             title: '操作',
             dataIndex: 'operation',
             fixed: 'right' as FixedType,
             width: 150,
             render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                 <Space direction="horizontal" size="small">
                     <Button type="link" onClick={() => history.push(`/workshopTeam/workshopTeamList/view/${record.id}`)} >详情</Button>
                     <Button type="link" onClick={() => history.push(`/workshopTeam/workshopTeamList/edit/${record.id}`)} >编辑</Button>
                     <Popconfirm
                         title="确认删除?"
                         onConfirm={() => {
                             RequestUtil.delete(`/tower-production/workshopTeam/${record.id}`).then(res => {
                                 message.success('删除成功');
                                 setRefresh(!refresh);
                             });
                         }}
                         okText="确认"
                         cancelText="取消"
                     >
                         <Button type="link">删除</Button>
                     </Popconfirm>
                 </Space>
             )
         }
     ]
 
     const [refresh, setRefresh] = useState(false);
     const [visible, setVisible] = useState(false);
     const [form] = Form.useForm();
     const [userList, setUserList] = useState<any[]>([]);
     const [title, setTitle] = useState('新增');
     const [detail, setDetail] = useState<any>({});
     const [loading, setLoading] = useState(true);
     const { data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
         const data: any = await RequestUtil.get<SelectDataNode[]>(`/tower-aps/productionUnit?size=1000`);
         resole(data?.records);
     }), {})
     const productUnitData: any = data || [];
     return (
         <>
             <Page
                 path="/tower-production/workshopTeam"
                 columns={columns}
                 headTabs={[]}
                 extraOperation={<Button type="primary" onClick={() => {
                    history.push(`/workshopTeam/workshopTeamList/add`)}}
                 ghost>添加</Button>}
                 refresh={refresh}
                 searchFormItems={[
                     {
                         name: 'fuzzyMsg',
                         label: '',
                         children: <Input placeholder="请输入班组名称、班长名称进行查询" />
                     }
                 ]}
                 onFilterSubmit={(values: Record<string, any>) => { return values; }}
             />
         </>
     )
 }