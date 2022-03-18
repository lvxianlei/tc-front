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
    
    const params = useParams<{ id: string, status: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawProductDetail/getDetailListById?drawTaskId=${params.id}`)

        resole(data);
    }), {})
    const detailData: any = data;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };
   


   
    return <Spin spinning={loading}>
            <DetailContent operation={[
              <>
                <Space>
                    <Button type='primary' onClick={async () => {
                        try {
                          const saveData:any = {
                              drawTaskId: params.id,
                          }
                          
                      } catch (error) {
                          console.log(error)
                      }
                    }}>保存</Button>
                     <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                   
                </Space>
            </>]}>
                <DetailTitle title="编辑班组"/>
                <Form form={formRef} component={false} >
                    
                </Form>
            </DetailContent>
    
        </Spin>
}
