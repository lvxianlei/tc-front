import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Form, Row, Col } from 'antd';
import { useHistory } from 'react-router-dom';
import { DetailContent, DetailTitle  } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import { Input, Select } from 'antd';
import UserModal from './UserModal';




export default function WorkshopTeamAdd(): React.ReactNode {
    const history = useHistory();
    const [dataDTO, setDataDTO] = useState({});
    const [user, setUser] = useState([]);
    const [users, setUsers] = useState([]);
    const [form] = Form.useForm();
    const formItemLayout = {
      labelCol: { span: 2},
      wrapperCol: { span: 10 }
    };
   
    const { data, loading } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<any[]>(`/tower-system/employee?current=1&size=1000`);
        resole(data?.records.filter((item:any)=>{
            // return item.deptName==='成品包装车间'
            return item
        }));
    }), {})

   
    return <Spin spinning={loading}>
            <DetailContent operation={[
              <>
                <Space>
                    <Button type='primary' onClick={async () => {
                        try {
                          const saveData:any = {
                              
                          }
                          
                      } catch (error) {
                          console.log(error)
                      }
                    }}>保存</Button>
                     <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                   
                </Space>
            </>]}>
                <DetailTitle title="编辑班组"/>
                <Form form={form}  {...formItemLayout}>
                    <Form.Item name="productUnitId" label="班组名称" rules={[{
                        "required": true,
                        "message": "请选择所属生产单元"
                    },
                    {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                    }]}>
                        <Input maxLength={40}/>
                    </Form.Item>
                    <Form.Item name="name" label="班长">
                        <Select placeholder="请选择" showSearch>
                            {data?.map((item: any) => {
                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name="productUnitId" label="备注">
                        <Input.TextArea maxLength={300} showCount rows={3}/>
                    </Form.Item>
                    <Form.Item name="productUnitId" label="组员">
                        <UserModal onSelect={(selectedRows:any)=>{
                            console.log(selectedRows)
                            setUsers(selectedRows)
                        }} buttonType='link' rowSelectionType='checkbox'/>
                        
                    </Form.Item>
                    <Row>
                        <Col span={2}/>
                        <Col span={10} style={{width:'100%'}}>
                        {
                            users.length>0&&<Space size={[20, 16]}  wrap style={{width:'100%'}}>{users.map((item:any,index:number)=>{

                                    return <div >{item.name}</div>
                                
                            })}</Space>
                        }
                        </Col>
                    </Row>
                </Form>
            </DetailContent>
            
        </Spin>
}
