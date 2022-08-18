
 import React, { useState, useRef } from 'react';
 import { Button, Input, DatePicker, Radio, Select, message, Modal, Tabs, Popconfirm } from 'antd';
 import moment from 'moment';
 import useRequest from '@ahooksjs/use-request'
 import { useHistory } from 'react-router-dom';
 import RequestUtil from '../../../utils/RequestUtil';
 import { Page } from '../../common';
 import AddRoleModal from './AddRoleModal';
 interface EditRefProps {
    id?: string
    onSubmit: () => void
    resetFields: () => void
}
 
 export default function RoleMngtList(): React.ReactNode {
     const history = useHistory();
     const [ refresh, setRefresh ] = useState<boolean>(false);
     const [ visible, setVisible ] = useState<boolean>(false);
     const [ id, setId ] = useState<string>("");
     const addRef = useRef<EditRefProps>();
     const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
         try {
             const result: { [key: string]: any } = await RequestUtil.get(`/sinzetech-system/role?current=1&size=20&type=`)
             resole(result);
             message.success("删除角色成功！");
             setRefresh(!refresh);
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onFilterSubmit = (value: any) => {
        return value
    }

     // 新增回调
     const handleOkuseState = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onSubmit();
            message.success(`${id ? '编辑' : '新增'}角色成功！`)
            setVisible(false)
            setRefresh(!refresh);
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

     return (
         <>
            <Page
                path="/sinzetech-system/role"
                columns={[
                    {
                    title: "角色名称",
                    dataIndex: "name",
                    },
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 100,
                        render: (_: any, record: any) => {
                            return (
                                <>
                                <Button type="link" style={{marginRight: 12}} onClick={() => {
                                    setId(record.id);
                                    setVisible(true)
                                }}>编辑</Button>
                                <Popconfirm
                                    title="您确定删除该角色吗?"
                                    onConfirm={() => {
                                        RequestUtil.delete(`/sinzetech-system/role?ids=${record.id}`).then(res => {
                                            getUser();
                                        });
                                    }}
                                    okText="确认"
                                    cancelText="取消"
                                ><Button type="link">删除</Button></Popconfirm>
                                </>
                            )
                        }
                    }]}
                refresh={ refresh }
             onFilterSubmit={onFilterSubmit}
            //  filterValue={{ acceptStatus }}
            extraOperation={
                <Button type="primary" style={{marginRight: 20}} onClick={() => {
                    setVisible(true);
                    setId("");
                }}>新增</Button>
            }
                searchFormItems={[
                    {
                        name: 'name',
                        children: <Input placeholder="请输入角色名称" style={{ width: 300 }} />
                    }
                ]}
            />
            <Modal
                title={`${id ? '修改': '新增'}角色权限`}
                visible={visible}
                width={1000}
                maskClosable={false}
                destroyOnClose={true}
                onCancel={() => {
                    setVisible(false)
                    addRef.current?.resetFields();
                }}
                  footer={[
                    <Button key="submit" type="primary" onClick={() => handleOkuseState()}>
                      提交
                    </Button>,
                    <Button key="back" onClick={() => {
                        setVisible(false)
                        addRef.current?.resetFields();
                    }}>
                      取消
                    </Button>
                  ]}
            >
                <AddRoleModal ref={addRef} id={id} />
            </Modal>
         </>
     )
 }