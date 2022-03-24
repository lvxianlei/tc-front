import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Form, Row, Col, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { DetailContent, DetailTitle  } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import { Input, Select } from 'antd';
import UserModal from './UserModal';

const { Option } = Select;


export default function WorkshopTeamAdd(): React.ReactNode {
    const history = useHistory();
    const [dataDTO, setDataDTO] = useState({});
    const [user, setUser] = useState([]);
    const [users, setUsers] = useState<any[]>([]);
    const [form] = Form.useForm();
    const formItemLayout = {
      labelCol: { span: 2},
      wrapperCol: { span: 10 }
    };
   
    const { data, loading } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<any[]>(`/tower-system/employee?current=1&size=1000`);
        setUser(data?.records)
        resole(data?.records);
    }), {})
   
    return <Spin spinning={loading}>
            <DetailContent operation={[
              <>
                <Space>
                    <Button type='primary' onClick={async () => {
                        try {
                            await form.validateFields()
                            const value = form.getFieldsValue(true);
                            if(value.classPresidentId){
                                const userIds = users.map((item:any)=>{
                                    return  item.userId
                                })
                                if(userIds.includes(value.classPresidentId)){
                                    return message.error('同一个人不可既是组长又是组员！')
                                } 
                                
                            }
                            const saveData:any = {
                                ...value,
                                workshopUserDTOList: users.map((item:any)=>{
                                    return{
                                        userId: item.userId
                                    }
                                })
                            }
                            RequestUtil.post(`/tower-production/workshopTeam`, saveData).then(()=>{
                                message.success('保存成功！')
                                history.push(`/workshopTeam/workshopTeamList`)
                            });
                        } catch (error) {
                            console.log(error)
                        }
                    }}>保存</Button>
                     <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                   
                </Space>
            </>]}>
                <DetailTitle title="添加班组"/>
                <Form form={form}  {...formItemLayout}>
                    <Form.Item name="teamName" label="班组名称" rules={[{
                        "required": true,
                        "message": "请填写班组名称"
                    },
                    {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                    }]}>
                        <Input maxLength={20}/>
                    </Form.Item>
                    <Form.Item name="classPresidentId" label="班长">
                        <Select placeholder="请选择" showSearch allowClear filterOption={(input:string, option:any) =>
                            option?.children.indexOf(input) >= 0
                        }>
                            {user?.map((item: any) => {
                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name="description" label="备注">
                        <Input.TextArea maxLength={300} showCount rows={3}/>
                    </Form.Item>
                    <Form.Item name="workshopUserDTOList" label="组员">
                        <UserModal onSelect={(selectedRows:any[])=>{
                            
                            const c = users.concat(selectedRows)
                            const temp:any = {}//用于id判断重复
                            const result:any[] = [];//最后的新数组
                            c.map((item:any,index:number)=>{
                                if(!temp[item.userId]){
                                    result.push(item);
                                    temp[item.userId] = true
                                }
                            })
                            setUsers(result)
                        }} buttonType='link' rowSelectionType='checkbox' selectKey={users.map((item:any)=>{
                            return item.userId
                        })}/>
                        
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
