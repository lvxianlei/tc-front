import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Select, Popconfirm, message, Modal, Row, Col, Spin, InputNumber } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { CommonTable, DetailContent, DetailTitle, Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import useRequest from '@ahooksjs/use-request';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { PlusOutlined } from "@ant-design/icons"
import styles from './release.module.less';

export default function Release(): React.ReactNode {
    const history = useHistory();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
    const [tableDataSource, setTableDataSource] = useState<any[]>([]);
    const [aTableDataSource, setATableDataSource] = useState<any[]>([]);
    const location = useLocation<{ state?: number, userId?: string }>();
    const [ form ] = Form.useForm();
    const [ formRef ] = Form.useForm();
    const params = useParams<{ id: string }>()
    const [check, setCheck] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [visible, setVisible] = useState<boolean>(false);
    const [releaseData, setReleaseData] = useState<any|undefined>({});
    const rowChange = (index: number) => {
        form.setFieldsValue({
            trialAssembleSegment:""
        })
    }
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data:any = await RequestUtil.get(`/tower-science/loftingBatch/${params.id}`);
        const value  = data?.loftingBatchProductVOList.filter((item:any)=>{
            return item.status===0||item.status==='0'
        })
        form.setFieldsValue({
            ...data,
            loftingBatchProductDTOList:value,
            // loftingBatchProductDTOList:[{id:1,segmentName:1,segmentNum:10,issuedNum:null},{id:2,segmentName:2,segmentNum:5,issuedNum:1},{id:3,segmentName:3,segmentNum:5,issuedNum:5}],
        })
        formRef.setFieldsValue({
            trialAssembleSegments:[],
        })
        setDisabled(data?.trialAssemble===1)
        setTableDataSource(value)
        setReleaseData(data)
    }), {})
    const SelectChange = (selectedRowKeys: React.Key[],selectedRows: any): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }

    return (
        <Spin spinning={false}>
            <Modal
                title='试装信息'  
                width={'40%'} 
                visible={visible} 
                onCancel={()=>{
                    formRef.resetFields()
                    setVisible(false)
                }}
                onOk={async ()=>{
                    await formRef.validateFields();
                    const value = formRef.getFieldsValue(true).trialAssembleSegments
                    const warnValue = value.filter((item:any)=>{
                        return  item.trialAssembleNum>0
                    })
                    if(!(warnValue.length>0)){
                        return message.error(`至少存在一条非0的试装数量数据！`)
                    }
                    form.setFieldsValue({
                        trialAssembleSegment: warnValue.map((item:any)=>{
                            return  item.segmentName+'*'+item.trialAssembleNum
                        }).join(',')
                    })
                    setATableDataSource(value)
                    formRef.setFieldsValue({
                        trialAssembleSegments: value
                    })
                    setVisible(false)
                }}
            >
                <Form form={formRef} className={ styles.descripForm }>
                    <CommonTable  
                        columns={[
                            {
                                title: "序号",
                                dataIndex: "index",
                                width: 50,
                                render: (_a: any, _b: any, index: number) => <>{index + 1}</>
                            },
                            {
                                title: "段号",
                                dataIndex: "segmentName",
                                width: 50,
                            },
                            {
                                title: "试装数量",
                                dataIndex: "trialAssembleNum",
                                width: 100,
                                render:(number: number, record:any, index:number)=>{
                                    return  <Form.Item name={['trialAssembleSegments',index,'trialAssembleNum']} initialValue={number} rules={[
                                    //     {
                                    //     required:true,
                                    //     message:'请输入试装数量'
                                    // },
                                    {
                                            validator: (rule, value, callback) => {
                                              let maxPrice = record.batchNum; //拿到最大值
                                              if (value > maxPrice) {
                                                callback(`不能大于下达数量${maxPrice}`);
                                              } 
                                              else{
                                                callback();
                                              }
                                            },
                                          },
                                    ]}>
                                        <InputNumber precision={0} min={0} style={{width:'100%'}}/>
                                    </Form.Item>
                                }
                            }
                        ]}
                        dataSource={aTableDataSource} 
                        pagination={false}
                        rowKey={'id'}
                    />
                </Form>
            </Modal>
            <DetailContent operation={[
                <Space>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                    <Button type='primary' onClick={async () => {
                        await form.validateFields()
                        const value = form.getFieldsValue(true)
                        console.log(value)
                        if(value.trialAssemble===1){
                            if(!value.trialAssembleSegment) 
                                return message.error('未填写试装段，不可保存！')
                        }
                        const trialValue = formRef.getFieldsValue(true)?.trialAssembleSegments?formRef.getFieldsValue(true)?.trialAssembleSegments.map((item:any)=>{
                            return {
                                id: item.id,
                                productCategoryId:params.id,
                                segmentId:item.segmentId,
                                segmentName:item.segmentName,
                                trialAssembleNum:item.trialAssembleNum,
                            }
                        }):[]
                        console.log(trialValue)
                        const submitValue ={
                            galvanizeDemand: value.galvanizeDemand,
                            machiningDemand: value.machiningDemand,
                            packDemand: value.packDemand,
                            planNumber: releaseData?.productCategoryVOList[0].voltageLevel,
                            productCategoryId: params.id,
                            trialAssemble: value.trialAssemble,
                            trialAssembleDemand: value.trialAssembleDemand,
                            voltageLevel: releaseData?.productCategoryVOList[0].voltageLevel,
                            weldingDemand: value.weldingDemand,
                            trialAssembleSegments: trialValue,
                            loftingBatchProductDTOList: value.loftingBatchProductDTOList.map((item:any)=>{
                                return {
                                    ...item,
                                    batchNum: item.batchNum===null?0:item.batchNum
                                }
                            })
                        }
                        console.log(submitValue)
                        RequestUtil.post(`/tower-science/loftingBatch/save`,submitValue).then(()=>{
                            message.success('保存成功');
                            history.push(`/workMngt/releaseList`)
                        })
                    }}>保存</Button>
                </Space>
            ]}>
                    <DetailTitle title='基础信息'/>
                    <CommonTable columns={[
                            {
                                title: "塔形",
                                dataIndex: "name",
                                width: 50,
                            },
                            {
                                title: "钢印号",
                                dataIndex: "steelProductShape",
                                width: 150
                            },
                            {
                                title: "计划号",
                                dataIndex: "planNumber",
                                width: 150
                            },
                            {
                                title: "试装",
                                dataIndex: "trialAssembleName",
                                width: 150
                            },
                            {
                                title: "电压等级",
                                dataIndex: "voltageGradeName",
                                width: 150
                            },
                            {
                                title: "材料标准",
                                dataIndex: "materialStandardName",
                                width: 150
                            },
                            {
                                title: "产品类型",
                                dataIndex: "productTypeName",
                                width: 150
                            }
                        ]}
                        dataSource={releaseData?.productCategoryVOList} pagination={false}/>
                    <DetailTitle title='批次信息'/>
                    <CommonTable
                        columns={[
                            {
                                title: "批次号",
                                dataIndex: "productionBatchNo",
                            },
                            {
                                title: "基数",
                                dataIndex: "num",
                            },
                            {
                                title: "杆塔号",
                                dataIndex: "productNames",
                            }
                        ]}
                        pagination={false} 
                        dataSource={ releaseData?.loftingBatchDetailVOList}
                    />
                   
                   <Form form={ form } labelCol={{span:4}}>
                        <DetailTitle title='下达信息'/>
                            <Row >
                                <Col span={12}>
                                    <Form.Item name="machiningDemand" label="加工要求">
                                        <Input.TextArea placeholder="请输入" maxLength={ 200 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            
                                <Col span={12}>
                                    <Form.Item name="weldingDemand" label="电焊说明">
                                        <Input.TextArea placeholder="请输入" maxLength={ 200 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="galvanizeDemand" label="镀锌要求">
                                        <Input.TextArea placeholder="请输入" maxLength={ 200 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            
                                <Col span={12}>
                                    <Form.Item name="packDemand" label="包装说明">
                                        <Input.TextArea placeholder="请输入" maxLength={ 200 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        <DetailTitle title='试装信息'/>
                            <Row>
                                <Col span={12}>
                                <Form.Item name="trialAssemble" label="试装类型"  rules={[{
                                        "required": true,
                                        "message": "请选择试装类型"
                                    },
                                    {
                                        pattern: /^[^\s]*$/,
                                        message: '禁止输入空格',
                                    }]}>
                                   <Select style={{width:"100%"}} onChange={(value)=>{
                                        form.setFieldsValue({
                                            trialAssembleSegment:'',
                                            trialAssembleDemand:''
                                        })
                                        formRef.setFieldsValue({
                                            trialAssembleSegments:[]
                                        })
                                        setDisabled(value===1)
                                   }}>
                                        <Select.Option value={1} key ={1}>试组装</Select.Option>
                                        <Select.Option value={0} key={0}>免试组</Select.Option>
                                    </Select>
                                </Form.Item>
                                </Col>
                                <Col span={12}>
                                <Form.Item name="trialAssembleSegment" label="试装段">
                                    <Input
                                        disabled
                                        addonAfter={<PlusOutlined onClick={async () => {
                                            await form.validateFields()
                                            form.getFieldsValue(true).trialAssemble===1 && setVisible(true);
                                            const value = form.getFieldsValue(true)?.loftingBatchProductDTOList.filter((item:any,index:number)=>{
                                                return item.batchNum&&item.batchNum!==null&&item.batchNum!=='0'&&item.batchNum!==0
                                            });
                                            let newArr: any[] = [];
                                            const arr = JSON.parse(JSON.stringify(value))
                                            for(var i = 0; i<arr.length; i++){
                                                const res = newArr.findIndex(ol=> {
                                                    return arr[i].segmentName === ol.segmentName;
                                                });
                                                if (res!== -1) {
                                                newArr[res].batchNum = newArr[res].batchNum +  arr[i].batchNum;
                                                } else {
                                                newArr.push(arr[i]);
                                                }
                                            }
                                            setATableDataSource(newArr)
                                            formRef.setFieldsValue({
                                                trialAssembleSegments: newArr
                                            })
                                        } }/>} 
                                    />
                                </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="trialAssembleDemand" label="试装说明">
                                        <Input.TextArea placeholder="请输入"  maxLength={ 200 } showCount rows={1} disabled={!disabled}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                <DetailTitle title='杆塔信息' operation={[ <Checkbox checked={check} onChange={(e: { target: { checked: any; }; })=>{
                    if(e.target.checked){
                        form.setFieldsValue({
                            loftingBatchProductDTOList:releaseData?.loftingBatchProductVOList,
                            trialAssembleSegment:''
                        })
                        formRef.setFieldsValue({
                            trialAssembleSegments:[],
                        })
                        setTableDataSource(releaseData?.loftingBatchProductVOList)
                        setSelectedKeys([])
                        
                    }else{
                        const value  = releaseData?.loftingBatchProductVOList.filter((item:any)=>{
                            return item.status===0||item.status==='0'
                        })
                        form.setFieldsValue({
                            loftingBatchProductDTOList:value,
                            trialAssembleSegment:''
                        })
                        formRef.setFieldsValue({
                            trialAssembleSegments:[],
                        })
                        setTableDataSource(value)
                        setSelectedKeys([])
                    }
                    setCheck(e.target.checked)
                    
                }}>显示已全部下达</Checkbox>,<Button type="primary" onClick={ ()=>{
                    const value = tableDataSource.map((item:any)=>{
                        if(selectedKeys.includes(item.id)&&item.segmentNum-item.issuedNum!==0){
                            return {
                                ...item,
                                batchNum:item.issuedNum?item.segmentNum-item.issuedNum:item.segmentNum
                            }
                        }else{
                            return {
                                ...item
                            }
                        }
                        
                    })
                    form.setFieldsValue({
                        loftingBatchProductDTOList:value,
                        trialAssembleSegments: ''
                    })
                    setTableDataSource(value)
                }} disabled={!(selectedKeys.length>0)}>输入全部</Button>]}/>
                    <Form form={form}   className={ styles.descripForm }>
                        <CommonTable  columns={[
                                {
                                    title: "序号",
                                    dataIndex: "index",
                                    width: 50,
                                    render: (_a: any, _b: any, index: number) => <>{index + 1}</>
                                },
                                {
                                    title: "段号",
                                    dataIndex: "segmentName",
                                    width: 50,
                                },
                                {
                                    title: "批次号",
                                    dataIndex: "productionBatchNo",
                                    width: 150
                                },
                                {
                                    title: "段数",
                                    dataIndex: "segmentNum",
                                    width: 150
                                },
                                {
                                    title: "已下达数量",
                                    dataIndex: "issuedNum",
                                    width: 150
                                },
                                {
                                    title: "下达数量",
                                    dataIndex: "batchNum",
                                    width: 150,
                                    render:(number: number, record:any, index:number)=>{
                                        return  <Form.Item name={['loftingBatchProductDTOList',index,'batchNum']} initialValue={number||0} rules={[
                                            {
                                                validator: (rule, value, callback) => {
                                                  let maxPrice = record.segmentNum-record.issuedNum; //拿到最大值
                                                  if (value > maxPrice) {
                                                    callback(`不能大于${maxPrice}`);
                                                  } 
                                                  else{
                                                    callback();
                                                  }
                                                },
                                              },
                                        ]}>
                                            <InputNumber precision={0} min={0} style={{width:'100%'}} onChange={()=>rowChange(index)} disabled={record.segmentNum===record.issuedNum}/>
                                        </Form.Item>
                                    }
                                }
                            ]}
                            dataSource={tableDataSource} 
                            pagination={false} 
                            rowSelection={{
                                selectedRowKeys: selectedKeys,
                                onChange: SelectChange,
                                getCheckboxProps: (record: Record<string, any>) => ({
                                    disabled: record.segmentNum===record.issuedNum
                                })
                            }}
                            rowKey={'id'}
                        />
                    </Form>
        </DetailContent>
    </Spin>
    )
}