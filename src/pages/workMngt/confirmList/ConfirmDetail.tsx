import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Form, Row, Col, Upload, message } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { Table, Input, InputNumber, Popconfirm, Typography, Select } from 'antd';
import AuthUtil from '../../../utils/AuthUtil';
import { downLoadFile } from '../../../utils';
import { productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
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
    const [visible, setVisible] = useState<boolean>(false);
    const [tableDataSource, setTableDataSource] = useState<object[]>([]);
    const [weight,setWeight] = useState<string>('0');
    const [description, setDescription] = useState('');
    const [attachInfo, setAttachInfo] = useState<any[]>([])
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: Item) => record.key === editingKey;

    const EditableCell: React.FC<EditableCellProps> = ({
      editing,
      dataIndex,
      title,
      inputType,
      enums,
      record,
      index,
      children,
      ...restProps
    }) => {
      const inputNode = inputType === 'number' ? <InputNumber style={{width:'100%'}} onChange={(value:number)=>{
        let number = 0;
        if(dataIndex==='productWeight'){
            number = formRef.getFieldValue('otherWeight')?formRef.getFieldValue('otherWeight'):0;
        }
        if(dataIndex==='otherWeight'){
          number = formRef.getFieldValue('productWeight')?formRef.getFieldValue('productWeight'):0;;
        }
        formRef.setFieldsValue({
            totalWeight:value+number
        })
      }} min={0} precision={4}/> : inputType === 'select' ?<Select style={{width:'100%'}}>{enums&&enums.map((item:any)=>{
        return <Select.Option value={item.value} key ={item.value}>{item.label}</Select.Option>
      })}</Select> : inputType === 'edit'?<span>保存后自动计算</span>: inputType === 'textArea'?<TextArea maxLength={500} rows={1} showCount/>:<Input />;
      if(dataIndex === 'name'){
        return (
        <td {...restProps}>
          {editing ? (
            <Form.Item
              name={dataIndex}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  validator: (rule: any, value: string, callback: (error?: string) => void) => {
                    checkProductNumber1(value,index).then(res => {
                          if (res > 0) {
                              callback('请输入* 杆塔号，且同一塔型下杆塔号唯一！')
                          } else {
                              callback();
                          }
                      })
                  }
                },
              ]}
            >
              {inputNode}
            </Form.Item>
          ) : (
            children
          )}
        </td>)
      }
      else{
        return (
          <td {...restProps}>
            {editing ? (
              <Form.Item
                name={dataIndex}
                style={{ margin: 0 }}
                rules={[
                  {
                    required: inputType==='textArea'?false:true,
                    message: `请输入${title}!`,
                  },
                ]}
              >
                {inputNode}
              </Form.Item>
            ) : (
              children
            )}
          </td>
        );
      }
     
    };
    const edit = (record: Partial<Item> & { key: React.Key }) => {
      formRef.setFieldsValue({ partBidNumber: '', unit: '', address: '', ...record });
      setEditingKey(record.key);
    };
    const onDelete = (key: React.Key)=>{
      const newData = [...tableDataSource];
      const index = newData.findIndex((item:any) => key === item.key);
      if (index > -1) {
        newData.splice(index, 1);
      }
      setTableDataSource(newData);
      let totalNumber = '0';
        newData.forEach((item:any)=>{
          totalNumber = (parseFloat(item.totalWeight)+parseFloat(totalNumber)).toFixed(4)
        })
        setWeight(totalNumber);
    };
    const cancel = () => {
      setEditingKey('');
    };

    const save = async (key: React.Key) => {
      try {
        const row = (await formRef.validateFields()) as Item;

        const newData = [...tableDataSource];
        const index = newData.findIndex((item:any) => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setTableDataSource(newData);
          setEditingKey('');
        } else {
          newData.push(row);
          setTableDataSource(newData);
          setEditingKey('');
        }
        let totalNumber = '0';
        newData.forEach((item:any)=>{
          totalNumber = (parseFloat(item.totalWeight)+parseFloat(totalNumber)).toFixed(4)
        })
        setWeight(totalNumber);
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    };

    const tableColumns = [
      { 
          title: '序号', 
          dataIndex: 'index', 
          key: 'index', 
          width: 50,
          render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) 
      },
      { 
          title: '* 线路名称', 
          dataIndex: 'lineName',
          type:'text',
          width: 80,
          editable: true,
          key: 'lineName', 
      },
      { 
          title: '* 杆塔号', 
          dataIndex: 'name', 
          type:'text',
          width: 80,
          editable: true,
          key: 'name' 
      },
      { 
          title: '* 塔型', 
          dataIndex: 'productCategory', 
          type:'text',
          width: 80,
          editable: true,
          key: 'productCategory' 
      },
      { 
          title: '* 塔型钢印号', 
          dataIndex: 'steelProductShape', 
          type:'text',
          width: 80,
          editable: true,
          key: 'steelProductShape' 
      },
      { 
          title: '* 产品类型', 
          dataIndex: 'productType', 
          type:'select',
          width: 100,
          editable: true,
          key: 'productType',
          enums:productTypeOptions && productTypeOptions.map(({ id, name }) => {
            return {
                label:name,
                value: id,
            }
          }),
          render: (value: number, record: object): React.ReactNode => {
            const renderEnum: any = productTypeOptions && productTypeOptions.map(({ id, name }) => {
              return {
                  label:name,
                  value: id,
              }
            })
            return <>{renderEnum&&value&&renderEnum.find((item: any) => item.value === value).label}</>
          }
      },
      { 
          title: '* 电压等级（kv）', 
          dataIndex: 'voltageLevel',
          type:'select', 
          width: 100,
          editable: true,
          key: 'voltageLevel',
          enums:voltageGradeOptions && voltageGradeOptions.map(({ id, name }) => {
            return {
                label:name,
                value: id,
            }
          }),
          render: (value: number, record: object): React.ReactNode => {
            const renderEnum: any = voltageGradeOptions && voltageGradeOptions.map(({ id, name }) => {
              return {
                  label:name,
                  value: id,
              }
            })
            return <>{renderEnum&&value&&renderEnum.find((item: any) => item.value === value).label}</>
          } 
      },
      { 
          title: '* 呼高（m）', 
          dataIndex: 'basicHight', 
          type:'number',
          width: 70,
          editable: true,
          key: 'basicHight' 
      },
      { 
          title: '* 模式', 
          dataIndex: 'pattern', 
          type:'select',
          width: 90,
          editable: true,
          key: 'pattern',
          enums: [
            {
                value: 1,
                label: "新放"
            },
            {
                value: 2,
                label: "重新出卡"
            },
            {
                value: 3,
                label: "套用"
            }
          ],
          render: (value: number, record: object): React.ReactNode => {
            const renderEnum: any = [
              {
                value: 1,
                label: "新放"
              },
              {
                value: 2,
                label: "重新出卡"
              },
              {
                value: 3,
                label: "套用"
              },
            ]
            return <>{renderEnum.find((item: any) => item.value === value).label}</>
          }
      },
      { 
          title: '* 杆塔重量（kg）', 
          dataIndex: 'productWeight', 
          type:'number',
          width: 100,
          editable: true,
          key: 'productWeight' 
      },
      { 
          title: '其他增重（kg）', 
          dataIndex: 'otherWeight', 
          type:'number',
          width: 100,
          editable: true,
          key: 'otherWeight' 
      },
      { 
          title: '* 总重（kg）', 
          dataIndex: 'totalWeight', 
          type:'edit',
          width: 100,
          editable: true,
          key: 'totalWeight',
          render:(_:any,record:any)=>{
              return <span>{(parseFloat(record.otherWeight)+parseFloat(record.productWeight)).toFixed(4)}</span>
          } 
      },
      { 
          title: '备注', 
          dataIndex: 'description', 
          type:'textArea',
          width: 250,
          editable: true,
          key: 'description' 
      },
      {
          key: 'operation',
          title: '操作',
          width: 70,
          dataIndex: 'operation',
          render: (_: any, record: Item) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <a href="javascript:;" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                保存
              </a>
              <Popconfirm title="确定取消更改吗？" onConfirm={cancel}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
              <Space>
                  <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                      编辑
                  </Typography.Link>
                  <Popconfirm title="确定删除该条数据吗？" onConfirm={() => onDelete(record.key)} disabled={editingKey !== ''}>
                    <Typography.Link disabled={editingKey !== ''}>
                        删除
                    </Typography.Link>
                  </Popconfirm>
              </Space>
          );
        },
      }

    ];
    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields();
            submitData.key = tableDataSource && tableDataSource.length.toString();
            submitData.otherWeight = submitData.otherWeight?submitData.otherWeight:0;
            submitData.index = tableDataSource.length;
            tableDataSource.push(submitData);
            setTableDataSource(tableDataSource);
            let number = '0';
            tableDataSource.forEach((item:any)=>{
                number = (parseFloat(item.totalWeight)+parseFloat(number)).toFixed(4)
            })
            setWeight(number);
            form.resetFields();
            setVisible(false);
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalCancel = () => {setVisible(false);form.resetFields();}
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawProductDetail/getDetailListById?drawTaskId=${params.id}`)
        resole(data);
        setTableDataSource(data?.drawProductDetailList.map(( item:any ,index: number )=>{return{ ...item, key: index.toString(),index: index }}));
        setAttachInfo([...data.attachInfoList]);
        setDescription(data?.description);
        let totalNumber = '0';
        data?.drawProductDetailList.forEach((item:any)=>{
          totalNumber = (parseFloat(item.totalWeight)+parseFloat(totalNumber)).toFixed(4)
        })
        setWeight(totalNumber);
    }), {})
    const detailData: any = data;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };
    const mergedColumns = tableColumns.map((col:any) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: Item) => ({
          record,
          inputType: col.type,
          dataIndex: col.dataIndex,
          enums: col.enums,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });

    const uploadChange = (event: any) => {
      if (event.file.status === "done") {
          if (event.file.response.code === 200) {
              const dataInfo = event.file.response.data
              const fileInfo = dataInfo.name.split(".")
              setAttachInfo([...attachInfo, {
                  id: "",
                  uid: attachInfo.length,
                  name: dataInfo.originalName,
                  description: "",
                  filePath: dataInfo.name,
                  link: dataInfo.link,
                  fileSize: dataInfo.size,
                  fileSuffix: fileInfo[fileInfo.length - 1],
                  userName: dataInfo.userName,
                  fileUploadTime: dataInfo.fileUploadTime
              }])
          }
      }
    }
    const deleteAttachData = (id: number) => {
      setAttachInfo(attachInfo.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    }

    /**
     * @description 验证杆塔号
     */
    const  checkProductNumber = (value: string): Promise<void | any> => {
      return new Promise(async (resolve, reject) => {  // 返回一个promise
          const formData = form.getFieldsValue(true)
          if (value && formData.productCategory && tableDataSource.length>0) {
              resolve(tableDataSource.findIndex((item:any) => 
                item.name === value && formData.productCategory === item.productCategory
              ))
          } else {
              resolve( !formData.productCategory || tableDataSource.length===0? -1 : false)
          }
      }).catch(error => {
          Promise.reject(error)
      })
    }

    /**
     * @description 验证杆塔号
     */
    const checkProductNumber1 = (value: string, index: number): Promise<void | any> => {
      return new Promise(async (resolve, reject) => { 
          const formData = formRef.getFieldsValue(true)
          let dataSource = JSON.parse(JSON.stringify(tableDataSource))
          if (value && formData.productCategory ) {
            const a = dataSource.filter((item:any)=>{
                    return item.name === value && formData.productCategory === item.productCategory && item.index!== formData.index
            })
            resolve(a.length)
          }
          else{
            resolve(false)
          }
      }).catch(error => {
          Promise.reject(error)
      })
    }
    
    return <Spin spinning={loading}>
            <DetailContent operation={[
                <Space>
                    <Button type='primary' onClick={async () => {
                        try {
                          const saveData:any = {
                              drawTaskId: params.id,
                              attachInfoList:attachInfo,
                              drawProductDetailList:tableDataSource.map((item:any)=>{
                                return {
                                  ...item,
                                  drawTaskId:params.id,
                              }}),
                              description
                          }
                          let saveDisabled = false;
                          tableDataSource.forEach((item:any)=>{
                            if(isEditing(item)){
                              saveDisabled = true;
                            }
                          })
                          if(saveDisabled){
                            message.error('存在塔信息未保存！')
                          }
                          else if(tableDataSource.length>0){
                              console.log(saveData)
                              await RequestUtil.post('/tower-science/drawProductDetail/saveDrawProduct', saveData).then(()=>{
                                  message.success('保存成功！');
                              }).then(()=>{
                                history.push('/workMngt/confirmList')
                              })
                          }
                          else{
                            message.error('未添加塔信息不可保存或提交！')
                          }
                      } catch (error) {
                          console.log(error)
                      }
                    }}>保存</Button>
                    <Button type='primary' onClick={async () => {
                        try {
                          const submitData:any = {
                            drawTaskId: params.id,
                            attachInfoList:attachInfo,
                            drawProductDetailList:tableDataSource.map((item:any)=>{
                              return {
                                ...item,
                                drawTaskId:params.id,
                            }}),
                            description
                          }
                          let saveDisabled = false;
                          tableDataSource.forEach((item:any)=>{
                            if(isEditing(item)){
                              saveDisabled = true;
                            }
                          })
                          if(saveDisabled){
                            message.error('存在塔信息未保存！')
                          }
                          else if(tableDataSource.length>0){
                              console.log(submitData)
                              await RequestUtil.post('/tower-science/drawProductDetail/submitDrawProduct', submitData).then(()=>{
                                  message.success('提交成功！');
                              }).then(()=>{
                                  history.push('/workMngt/confirmList')
                              })
                          }
                          else{
                            message.error('未添加塔信息不可保存或提交！')
                          }
                      } catch (error) {
                          console.log(error)
                      }
                    }}>保存并提交</Button>
                     {tableDataSource.length>0||attachInfo.length>0||description?<Popconfirm
                        title="是否放弃已添加信息?"
                        onConfirm={ () => history.goBack() }
                        okText="确定"
                        cancelText="取消"
                    >
                         <Button key="goback">返回</Button>
                    </Popconfirm>: <Button key="goback" onClick={() => history.goBack()}>返回</Button>}
                   
                </Space>
            ]}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <Space>
                        {/* <Button type='primary' ghost onClick={() => history.goBack()}>导出</Button>
                        <Button type='primary' ghost onClick={() => history.goBack()}>模板下载</Button> */}
                        <span>总基数：{tableDataSource.length}基</span>
                        <span>总重量：{weight}kg</span>
                    </Space>
                    <Space>
                        {/* <Button type='primary' ghost onClick={() => history.goBack()}>导入</Button> */}
                        <Button type='primary' ghost onClick={() => setVisible(true)}>添加</Button>
                    </Space>
                </div>
                <Form form={formRef} component={false}>
                    <Table
                      components={{
                        body: {
                          cell: EditableCell,
                        },
                      }}
                      size='small'
                      bordered
                      dataSource={[...tableDataSource]}
                      columns={mergedColumns}
                      rowClassName="editable-row"
                      // rowKey='index'
                      // pagination={{
                      //   onChange: cancel,
                      // }}
                      pagination={false}
                    />
                </Form>
                <DetailTitle title="备注"/>
                {detailData?<TextArea maxLength={ 200 } defaultValue={detailData?.description} onChange={(e)=>{
                    setDescription(e.target.value)
                }}/>:null}
                <DetailTitle title="附件信息" operation={[<Upload
                    action={ () => {
                      const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                      return baseUrl+'/sinzetech-resource/oss/put-file'
                    } } 
                    headers={
                        {
                            'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    showUploadList={ false }
                    data={ { productCategoryId: params.id } }
                    onChange={ uploadChange}
                ><Button key="enclosure" type="primary" ghost>添加</Button></Upload>]} />
                <CommonTable columns={[
                    {
                        title: '附件名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        render: (_: undefined, record: any): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Button type="link" onClick={() => downLoadFile(record.id?record.filePath:record.link)}>下载</Button>
                                {record.fileSuffix==='pdf'?<Button type='link' onClick={()=>{window.open(record.id?record.filePath:record.link)}}>预览</Button>:null}
                                <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>删除</Button>
                            </Space>
                        )
                    }
                ]} dataSource={attachInfo}  pagination={ false }/>
            </DetailContent>
            <Modal visible={visible} title="添加" onOk={handleModalOk} onCancel={handleModalCancel}  width={ 800 }>
                <Form form={form} { ...formItemLayout }>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="lineName" label="线路名称" rules={[{
                            "required": true,
                            "message":"请输入线路名称"
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="name" label="杆塔号" rules={[{
                            required: true,
                            validator: (rule: any, value: string, callback: (error?: string) => void) => {
                              checkProductNumber(value).then(res => {
                                    if (res>-1) {
                                        callback('请输入杆塔号，且同一塔型下杆塔号唯一！')
                                    } else {
                                        callback();
                                    }
                                })
                            }
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="productCategory" label="塔型" rules={[{
                            "required": true,
                            "message":"请输入塔型"
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="steelProductShape" label="塔型钢印号" rules={[{
                            "required": true,
                            "message":"请输入塔型钢印号"
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="productType" label="产品类型" rules={[{
                            "required": true,
                            "message":"请选择产品类型"
                        }]}>
                            <Select>
                              {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                  return <Select.Option key={index} value={id}>
                                      {name}
                                  </Select.Option>
                              })}
                            </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="voltageLevel" label="电压等级（kV）" rules={[{
                            "required": true,
                            "message":"请选择电压等级（kV）"
                        }]}>
                            <Select>
                              {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                                  return <Select.Option key={index} value={id}>
                                      {name}
                                  </Select.Option>
                              })}
                            </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="basicHight" label="呼高（m）" rules={[{
                            "required": true,
                            "message":"请输入呼高（m）"
                        }]}>
                            <InputNumber precision={4} style={{width:'100%'}} min={0}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="pattern" label="模式" rules={[{
                            "required": true,
                            "message":"请选择模式"
                        }]}>
                            <Select>
                                <Select.Option value={1} key={1}>新放</Select.Option>
                                <Select.Option value={3} key={3}>套用</Select.Option>
                                <Select.Option value={2} key={2}>重新出卡</Select.Option>
                            </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="productWeight" label="杆塔重量（kg）" rules={[{
                            "required": true,
                            "message":"请输入杆塔重量（kg）"
                        }]}>
                            <InputNumber precision={4} style={{width:'100%'}} min={0} onChange={(value:number)=>{
                                const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                form.setFieldsValue({
                                    totalWeight:data+value
                                })
                            }}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="otherWeight" label="其他增重（kg）">
                            <InputNumber precision={4} style={{width:'100%'}} min={0} onChange={(value:number)=>{
                                const data:number = form.getFieldValue('productWeight')?form.getFieldValue('productWeight'):0;
                                form.setFieldsValue({
                                    totalWeight:data+value
                                })
                            }}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="totalWeight" label="总重（kg）" rules={[{
                            "required": true,
                            "message":"请输入总重（kg）"
                        }]}>
                            <InputNumber precision={4} style={{width:'100%'}} disabled/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="description" label="备注">
                            <TextArea rows={1} showCount maxLength={500}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* <BaseInfo columns={towerData} dataSource={detailData || {}} edit col={ 2 }/> */}
                </Form>
            </Modal>
        </Spin>
}
