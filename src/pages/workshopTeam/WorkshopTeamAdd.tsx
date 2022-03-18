import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Modal, Form, Row, Col, Upload, message, Image } from 'antd';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, AttachmentRef } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { Table, Input, InputNumber, Popconfirm, Typography, Select } from 'antd';
import AuthUtil from '../../utils/AuthUtil';
import { patternTypeOptions, productTypeOptions, voltageGradeOptions } from '../../configuration/DictionaryOptions';
import UserModal from './UserModal';
interface Item {
  key: string;
  name: string;
  partBidNumber: number;
  address: string;
  pattern: number;
}

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    partBidNumber: 32,
    pattern: 1,
    address: `London Park no. ${i}`,
  });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'select' | 'edit' | 'textArea';
  enums?: object[];
  record: Item;
  index: number;
  children: React.ReactNode;
}



export default function ConfirmDetail(): React.ReactNode {
    const history = useHistory();
    const [dataDTO, setDataDTO] = useState({});
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
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
                <DetailTitle title="添加班组"/>
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
                            <Form.Item name="name" label="班长"  rules={[{
                                "required": true,
                                "message": "请选择班长"
                            }]}>
                                <Select placeholder="请选择">
                                    {data?.map((item: any) => {
                                        return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item name="productUnitId" label="备注">
                                <Input.TextArea maxLength={300} showCount rows={3}/>
                            </Form.Item>
                            <Form.Item name="productUnitId" label="组员">
                                {/* <Button type='link'>选择组员</Button> */}
                                {/* <UserModal onSelect={()=>{

                                }}/> */}
                            </Form.Item>
                </Form>
            </DetailContent>
            
        </Spin>
}
