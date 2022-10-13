import React from 'react'
import { Button, Spin, Form, Row, Col, Select, InputNumber, message, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { DetailContent, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
export interface IDetail {
    id: number;
    name: string;
    code: string;
    type: number;
    value: number
}

export default function TowerDetail(): React.ReactNode {
    const history = useHistory()
    const { loading, data } = useRequest<IDetail[]>(() => new Promise(async (resole, reject) => {
        const data: IDetail[] = await RequestUtil.get<IDetail[]>(`/tower-science/config`)
        resole(data)
    }), {})
    let detailData: IDetail[]|undefined = data&&data.map((item:IDetail)=>{
        return {
            ...item,
            value:item.value===-1?0:item.value,
        }
    })
    const [form] = Form.useForm();
   
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button onClick={()=>{
                    form.validateFields().then(async (res) => {
                        const data: any = await RequestUtil.post(`/tower-science/config`, 
                            form.getFieldsValue(true).detailData,
                        );
                        if(data===true){
                            message.success('保存成功');
                            history.go(0)
                        }
                    })
                }}>保存</Button>
            ]}>
                <DetailTitle title="技术部时间节点配置" />
                {data?<Form initialValues={{ detailData : detailData }} autoComplete="off" form={form}>  
                    <Row>
                        <Form.List name="detailData">
                            {
                                ( fields , { add, remove }) => fields.map(
                                    field => (
                                    <>
                                        <Col span={ 3 }>
                                        <Form.Item name={[ field.name , 'name']}>
                                            <span><span style={{color:'red'}}>* </span> {detailData&&detailData[field.name].name}</span>
                                        </Form.Item>
                                        </Col>
                                        <Col span={ 3 }>
                                        <Form.Item name={[ field.name , 'value']} rules={[{required:true,message:`请输入${detailData&&detailData[field.name].name}`}]}>
                                            <InputNumber style={{width:'100%'}} precision={0} min={0}/>
                                        </Form.Item>
                                        </Col>
                                        <Col>
                                        <Form.Item  name={[ field.name , 'type']}>
                                            <Select defaultValue={1}>
                                                <Select.Option value={1} key={1}>天</Select.Option>
                                                <Select.Option value={2} key={2}>小时</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        </Col>
                                        <Col>
                                        <Form.Item  name={[ field.name , 'type']}>
                                            <Select defaultValue={1}>
                                                <Select.Option value={1} key={1}>自然日</Select.Option>
                                                <Select.Option value={2} key={2}>工作日</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        </Col>
                                        <Col>
                                        <Form.Item  name={[ field.name , 'type']}>
                                            <Input.TextArea maxLength={400}/>
                                        </Form.Item>
                                        </Col>
                                    </>
                                    )
                                )
                            }
                        </Form.List> 
                    </Row>
                </Form>:null}
            </DetailContent>
        </Spin>
    </>
}






