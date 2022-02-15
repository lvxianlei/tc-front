import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Modal, Form, Row, Col, Upload, message, Image } from 'antd';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { Table, Input, InputNumber, Popconfirm, Typography, Select } from 'antd';
import AuthUtil from '../../../utils/AuthUtil';
import { downLoadFile } from '../../../utils';
import { patternTypeOptions, productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import { downloadTemplate } from '../setOut/downloadTemplate';
import ExportList from '../../../components/export/list';
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
    const [pictureVisible, setPictureVisible] = useState<boolean>(false);
    const [pictureUrl, setPictureUrl] = useState('');
    const [tableDataSource, setTableDataSource] = useState<object[]>([]);
    const [weight,setWeight] = useState<string>('0');
    const [description, setDescription] = useState('');
    const [attachInfo, setAttachInfo] = useState<any[]>([])
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();

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
        if(dataIndex==='otherWeight'){
          const dataA:number = formRef.getFieldValue('legWeightA')?formRef.getFieldValue('legWeightA'):0;
          const dataB:number = formRef.getFieldValue('legWeightB')?formRef.getFieldValue('legWeightB'):0;
          const dataC:number = formRef.getFieldValue('legWeightC')?formRef.getFieldValue('legWeightC'):0;
          const dataD:number = formRef.getFieldValue('legWeightD')?formRef.getFieldValue('legWeightD'):0;
          const data:number = formRef.getFieldValue('bodyWeight')?formRef.getFieldValue('bodyWeight'):0;
          number = dataA+dataB+dataC+dataD+data;
        }
        if(dataIndex==='legWeightA'){
          const dataA:number = formRef.getFieldValue('legWeightB')?formRef.getFieldValue('legWeightB'):0;
          const dataB:number = formRef.getFieldValue('legWeightC')?formRef.getFieldValue('legWeightC'):0;
          const dataC:number = formRef.getFieldValue('legWeightD')?formRef.getFieldValue('legWeightD'):0;
          const dataD:number = formRef.getFieldValue('bodyWeight')?formRef.getFieldValue('bodyWeight'):0;
          const data:number = formRef.getFieldValue('otherWeight')?formRef.getFieldValue('otherWeight'):0;
          number = dataA+dataB+dataC+dataD+data;
        }
        if(dataIndex==='legWeightB'){
          const dataA:number = formRef.getFieldValue('legWeightA')?formRef.getFieldValue('legWeightA'):0;
          const dataB:number = formRef.getFieldValue('legWeightC')?formRef.getFieldValue('legWeightC'):0;
          const dataC:number = formRef.getFieldValue('legWeightD')?formRef.getFieldValue('legWeightD'):0;
          const dataD:number = formRef.getFieldValue('bodyWeight')?formRef.getFieldValue('bodyWeight'):0;
          const data:number = formRef.getFieldValue('otherWeight')?formRef.getFieldValue('otherWeight'):0;
          number = dataA+dataB+dataC+dataD+data;
        }
        if(dataIndex==='legWeightC'){
          const dataA:number = formRef.getFieldValue('legWeightA')?formRef.getFieldValue('legWeightA'):0;
          const dataB:number = formRef.getFieldValue('legWeightB')?formRef.getFieldValue('legWeightB'):0;
          const dataC:number = formRef.getFieldValue('legWeightD')?formRef.getFieldValue('legWeightD'):0;
          const dataD:number = formRef.getFieldValue('bodyWeight')?formRef.getFieldValue('bodyWeight'):0;
          const data:number = formRef.getFieldValue('otherWeight')?formRef.getFieldValue('otherWeight'):0;
          number = dataA+dataB+dataC+dataD+data;
        }
        if(dataIndex==='legWeightD'){
          const dataA:number = formRef.getFieldValue('legWeightA')?formRef.getFieldValue('legWeightA'):0;
          const dataB:number = formRef.getFieldValue('legWeightB')?formRef.getFieldValue('legWeightB'):0;
          const dataC:number = formRef.getFieldValue('legWeightC')?formRef.getFieldValue('legWeightC'):0;
          const dataD:number = formRef.getFieldValue('bodyWeight')?formRef.getFieldValue('bodyWeight'):0;
          const data:number = formRef.getFieldValue('otherWeight')?formRef.getFieldValue('otherWeight'):0;
          number = dataA+dataB+dataC+dataD+data;
        }
        dataIndex!=="basicHeight" && formRef.setFieldsValue({
            totalWeight:number + value
        })
      }} min={0} precision={2} max={dataIndex!=='basicHeight'&&dataIndex!=='otherWeight'? 99999.99 :dataIndex ==='basicHeight'?99.99: 999999.99}/> : inputType === 'select' ?<Select style={{width:'100%'}}>{enums&&enums.map((item:any)=>{
        return <Select.Option value={item.value} key ={item.value}>{item.label}</Select.Option>
      })}</Select> : inputType === 'edit'?<span>保存后自动计算</span>: inputType === 'textArea'?<TextArea maxLength={dataIndex==='description'?400:10} rows={1}/>:<Input />;
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
      const newData:any = [...tableDataSource];
      const index = newData.findIndex((item:any) => key === item.key);
      console.log(newData[index])
      if (index > -1 && newData[index].id) {
        RequestUtil.delete(`/tower-science/drawProductDetail?id=${newData[index].id}`)
        newData.splice(index, 1);
      }else{
        newData.splice(index, 1);
      }
      setTableDataSource(newData);
      let totalNumber = '0';
        newData.forEach((item:any)=>{
          totalNumber = (parseFloat(item.totalWeight)+parseFloat(totalNumber)).toFixed(2)
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
          totalNumber = (parseFloat(item.totalWeight)+parseFloat(totalNumber)).toFixed(2)
        })
        setWeight(totalNumber);
        RequestUtil.post(`/tower-science/drawProductDetail/save`,{...newData[index],drawTaskId: params.id}).then(()=>{
          message.success('保存成功！')
        })
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
          width: 100,
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
            return <>{renderEnum&&value&&renderEnum.find((item: any) => item.value === value)?.label}</>
          }
      },
      { 
          title: '* 电压等级（kv）', 
          dataIndex: 'voltageLevel',
          type:'select', 
          width: 120,
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
            return <>{renderEnum&&value&&renderEnum.find((item: any) => item.value === value)?.label}</>
          } 
      },
      { 
          title: '* 呼高（m）', 
          dataIndex: 'basicHeight', 
          type:'number',
          width: 90,
          editable: true,
          key: 'basicHeight',
          render:(value:any)=>{
            return parseFloat(value).toFixed(2)
          }  
      },
      { 
          title: '* 模式', 
          dataIndex: 'pattern', 
          type:'select',
          width: 90,
          editable: true,
          key: 'pattern',
          enums:patternTypeOptions && patternTypeOptions.map(({ id, name }) => {
            return {
                label:name,
                value: id,
            }
          }),
          render: (value: string, record: object): React.ReactNode => {
            const renderEnum: any = patternTypeOptions && patternTypeOptions.map(({ id, name }) => {
              return {
                  label:name,
                  value: id,
              }
            })
            return <>{renderEnum&&value&&renderEnum.find((item: any) => item.value === value)?.label}</>
          } 
      },
      { 
        title: '* 本体重量（kg）', 
        dataIndex: 'bodyWeight', 
        type:'number',
        width: 120,
        editable: true,
        key: 'bodyWeight',
        render:(value:any)=>{
          return parseFloat(value).toFixed(2)
        }   
      },//范春森于11月23日去掉，于龙于11月25号加上
      { 
        title: '接腿配置A', 
        dataIndex: 'legConfigurationA', 
        type:'textArea',
        width: 80,
        editable: true,
        key: 'legConfigurationA' 
      },
      { 
        title: '接腿配置B', 
        dataIndex: 'legConfigurationB', 
        type:'textArea',
        width: 80,
        editable: true,
        key: 'legConfigurationB' 
      },
      { 
        title: '接腿配置C', 
        dataIndex: 'legConfigurationC', 
        type:'textArea',
        width: 80,
        editable: true,
        key: 'legConfigurationC' 
      },
      { 
        title: '接腿配置D', 
        dataIndex: 'legConfigurationD', 
        type:'textArea',
        width: 80,
        editable: true,
        key: 'legConfigurationD' 
      },
      { 
        title: '接腿重A（kg）', 
        dataIndex: 'legWeightA', 
        type:'number',
        width: 100,
        editable: true,
        key: 'legWeightA', 
        render:(value:any)=>{
          return parseFloat(value).toFixed(2)
        }  
      },
      { 
        title: '接腿重B（kg）', 
        dataIndex: 'legWeightB', 
        type:'number',
        width: 100,
        editable: true,
        key: 'legWeightB', 
        render:(value:any)=>{
          return parseFloat(value).toFixed(2)
        }  
      },
      { 
        title: '接腿重C（kg）', 
        dataIndex: 'legWeightC', 
        type:'number',
        width: 100,
        editable: true,
        key: 'legWeightC', 
        render:(value:any)=>{
          return parseFloat(value).toFixed(2)
        }  
      },
      { 
        title: '接腿重D（kg）', 
        dataIndex: 'legWeightD', 
        type:'number',
        width: 100,
        editable: true,
        key: 'legWeightD', 
        render:(value:any)=>{
          return parseFloat(value).toFixed(2)
        }  
      },
      // { 
      //     title: '* 杆塔重量（kg）', 
      //     dataIndex: 'monomerWeight', 
      //     type:'number',
      //     width: 100,
      //     editable: true,
      //     key: 'monomerWeight', 
      //     render:(value:any)=>{
      //       return parseFloat(value).toFixed(2)
      //     }  
      // },
      { 
        title: '* 单重（kg）', 
        dataIndex: 'monomerWeight', 
        type:'edit',
        width: 100,
        editable: true,
        key: 'monomerWeight', 
        render:(_:any,record:any)=>{
          return <span>{(parseFloat(record.legWeightA)+parseFloat(record.legWeightB)+parseFloat(record.legWeightC)+parseFloat(record.legWeightD)+parseFloat(record.bodyWeight)).toFixed(2)}</span>
        }  
      },
      { 
          title: '其他重量（kg）', 
          dataIndex: 'otherWeight', 
          type:'number',
          width: 120,
          editable: true,
          key: 'otherWeight',
          render:(value:any)=>{
            return parseFloat(value).toFixed(2)
          }  
      },
      { 
          title: '* 总重（kg）', 
          dataIndex: 'totalWeight', 
          type:'edit',
          width: 100,
          editable: true,
          key: 'totalWeight',
          render:(_:any,record:any)=>{
              return <span>{(parseFloat(record.otherWeight)+parseFloat(record.legWeightA)+parseFloat(record.legWeightB)+parseFloat(record.legWeightC)+parseFloat(record.legWeightD)+parseFloat(record.bodyWeight)).toFixed(2)}</span>
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
          width: 100,
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
                  <Typography.Link disabled={editingKey !== ''||params.status!=='3'} onClick={() => edit(record)}>
                      编辑
                  </Typography.Link>
                  <Popconfirm title="确定删除该条数据吗？" onConfirm={() => onDelete(record.key)} disabled={editingKey !== ''||params.status!=='3'}>
                    <Typography.Link disabled={editingKey !== ''||params.status!=='3'}>
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
            const id:any = await RequestUtil.post(`/tower-science/drawProductDetail/save`,{
              ...submitData,
              drawTaskId: params.id
            })
            submitData['id'] = id;
            tableDataSource.push(submitData);
            let number = '0';
            tableDataSource.forEach((item:any)=>{
                number = (parseFloat(item.totalWeight)+parseFloat(number)).toFixed(2)
            })
            setWeight(number);
            setTableDataSource(tableDataSource);
            form.resetFields();
            setVisible(false);
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalCancel = () => {setVisible(false);form.resetFields();}
    const handlePictureModalCancel = () => {setPictureVisible(false)}
    const [urlVisible, setUrlVisible] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const params = useParams<{ id: string, status: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawProductDetail/getDetailListById?drawTaskId=${params.id}`)
        setTableDataSource(data?.drawProductDetailList.map(( item:any ,index: number )=>{
          return{ 
            ...item, 
            key: index.toString(),
            index: index,
            legConfigurationA:item.legConfigurationA? item.legConfigurationA: 0,
            legConfigurationB:item.legConfigurationB? item.legConfigurationB: 0,
            legConfigurationC:item.legConfigurationC? item.legConfigurationC: 0,
            legConfigurationD:item.legConfigurationD? item.legConfigurationD: 0,
            otherWeight:item.otherWeight? item.otherWeight: 0,
            totalWeight: item.totalWeight? item.totalWeight: 0,
          }
        }));
        setAttachInfo([...data.fileVOList]);
        setDescription(data?.description);
        let totalNumber = '0';
        data?.drawProductDetailList.forEach((item:any)=>{
          totalNumber = (parseFloat(item.totalWeight)+parseFloat(totalNumber)).toFixed(2)
        })
        setWeight(totalNumber);
        resole(data);
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
            resolve(1)
          }
      }).catch(error => {
          Promise.reject(error)
      })
    }
    
    return <Spin spinning={loading}>
            <DetailContent operation={[
              <>
                {params.status==='3'?<Space>
                    <Button type='primary' onClick={async () => {
                        try {
                          const saveData:any = {
                              drawTaskId: params.id,
                              fileVOList:attchsRef.current.getDataSource(),
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
                            fileVOList:attchsRef.current.getDataSource(),
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
                    }}>完成确认明细</Button>
                     {tableDataSource.length>0||attachInfo.length>0||description?<Popconfirm
                        title="是否放弃已添加信息?"
                        onConfirm={ () => history.goBack() }
                        okText="确定"
                        cancelText="取消" 
                    >
                         <Button key="goback">返回</Button>
                    </Popconfirm>: <Button key="goback" onClick={() => history.goBack()}>返回</Button>}
                   
                </Space>: <Button key="goback" onClick={() => history.goBack()}>返回</Button>} 
            </>]}>
                <Space style={{paddingBottom:'16px'}}>
                  <Button type='primary' onClick={()=>{downloadTemplate(`/tower-science/drawProductDetail/export?drawTaskId=${params.id}`, '杆塔信息')}}>导出</Button>
                  <Button type="primary" onClick={ () => downloadTemplate('/tower-science/drawProductDetail/importTemplate', '确认明细模板') } ghost>模板下载</Button>
                </Space>
                <DetailTitle title="确认明细"/>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
                    <Space>
                      <span>总基数：{tableDataSource.length}基</span>
                      <span>总重量：{weight}kg</span>
                    </Space>
                    <Space>
                        {params.status==='3'?
                        <Upload 
                            action={ () => {
                                const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                                return baseUrl+'/tower-science/drawProductDetail/import'
                            } } 
                            headers={
                                {
                                    'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                                    'Tenant-Id': AuthUtil.getTenantId(),
                                    'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                                }
                            }
                            data={ { drawTaskId: params.id } }
                            showUploadList={ false }
                            onChange={ async (info) => {
                                if(info.file.response && !info.file.response?.success) {
                                    message.warning(info.file.response?.msg)
                                }
                                if(info.file.response && info.file.response?.success){
                                    if (info.file.response && info.file.response?.success) {
                                      if (info.file.response?.data) {
                                          setUrl(info.file.response?.data);
                                          setUrlVisible(true);
                                      } else {
                                          message.success('导入成功！');
                                          const data: any = await RequestUtil.get(`/tower-science/drawProductDetail/getDetailListById?drawTaskId=${params.id}`)
                                          setTableDataSource(data?.drawProductDetailList.map(( item:any ,index: number )=>{return{ ...item, key: index.toString(),index: index,
                                            legConfigurationA:item.legConfigurationA? item.legConfigurationA: 0,
                                            legConfigurationB:item.legConfigurationB? item.legConfigurationB: 0,
                                            legConfigurationC:item.legConfigurationC? item.legConfigurationC: 0,
                                            legConfigurationD:item.legConfigurationD? item.legConfigurationD: 0,
                                            otherWeight:item.otherWeight? item.otherWeight: 0,
                                            totalWeight: item.totalWeight? item.totalWeight: 0,
                                          }}));
                                          setAttachInfo([...data.fileVOList]);
                                          setDescription(data?.description);
                                          let totalNumber = '0';
                                          data?.drawProductDetailList.forEach((item:any)=>{
                                            totalNumber = (parseFloat(item.totalWeight)+parseFloat(totalNumber)).toFixed(2)
                                          })
                                          setWeight(totalNumber);
                                      }
                                  }
                                } 
                            } }
                        >
                            <Button type="primary" ghost>导入</Button>
                        </Upload>:null}
                
                        {params.status==='3'?<Button type='primary' ghost onClick={() => setVisible(true)}>添加</Button>:null}
                    </Space>
                </div>
                <Modal
                    visible={urlVisible}
                    onOk={() => {
                        window.open(url);
                        setUrlVisible(false);
                    }}
                    onCancel={() => { setUrlVisible(false); setUrl('') }}
                    title='提示'
                    okText='下载'
                >
                    当前存在错误数据，请重新下载上传！
                </Modal>
                <Form form={formRef} component={false} >
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
                      style={{paddingBottom: '24px'}}
                      scroll={{x:1000}}
                      pagination={false}
                    />
                </Form>
                <div style={{paddingBottom: '24px'}}>
                  <DetailTitle title="备注"/>
                  {detailData?<TextArea maxLength={ 200 } defaultValue={detailData?.description} onChange={(e)=>{
                      setDescription(e.target.value)
                  }} disabled={params.status!=='3'} />:null}
                </div>
                {/* <DetailTitle title="附件信息" operation={[params.status==='3'?<Upload
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
                ><Button key="enclosure" type="primary" ghost>添加</Button></Upload>:null]} />
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
                              {['jpg','jpeg', 'png', 'gif'].includes(record.fileSuffix)?<Button type='link' onClick={()=>{setPictureUrl(record.id?record.filePath:record.link);setPictureVisible(true);}}>预览</Button>:null}
                              <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>删除</Button>

                          </Space>
                      )
                  }
                ]} dataSource={attachInfo}  pagination={ false }/> */}
                <Attachment dataSource={attachInfo} edit={params.status==='3'?true:false} title="附件信息" ref={attchsRef}/>
            </DetailContent>
            <Modal visible={pictureVisible} onCancel={handlePictureModalCancel} footer={false}>
                <Image src={pictureUrl} preview={false}/>
            </Modal>
            <Modal visible={visible} title="添加" onOk={handleModalOk} onCancel={handleModalCancel}  width={ 800 }>
                <Form form={form} { ...formItemLayout }>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="lineName" label="线路名称" rules={[{
                            "required": true,
                            "message":"请输入线路名称"
                        }]}>
                            <Input  maxLength={50}/>
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
                            <Input  maxLength={50}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="productCategory" label="塔型" rules={[{
                            "required": true,
                            "message":"请输入塔型"
                        }]}>
                            <Input  maxLength={50}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="steelProductShape" label="塔型钢印号" rules={[{
                            "required": true,
                            "message":"请输入塔型钢印号"
                        }]}>
                            <Input  maxLength={50}/>
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
                        <Form.Item name="basicHeight" label="呼高（m）" rules={[{
                            "required": true,
                            "message":"请输入呼高（m）"
                        }]}>
                            <InputNumber precision={2} style={{width:'100%'}} min={0} max={99.99}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="pattern" label="模式" rules={[{
                            "required": true,
                            "message":"请选择模式"
                        }]}>
                            <Select style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                              { patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                  return <Select.Option key={ index } value={ id }>
                                      { name }
                                  </Select.Option>
                              }) }
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="legConfigurationA" label="接腿配置A">
                            <Input style={{width:'100%'}}  maxLength={10}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="legConfigurationB" label="接腿配置B">
                            <Input style={{width:'100%'}}  maxLength={10}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="legConfigurationC" label="接腿配置C">
                            <Input style={{width:'100%'}}  maxLength={10}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="legConfigurationD" label="接腿配置D">
                            <Input style={{width:'100%'}} maxLength={10}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="legWeightA" label="接腿重A（kg）" 
                        // rules={[{
                        //     "required": true,
                        //     "message":"请输入接腿重A（kg）"
                        // }]}
                        initialValue={0}
                        >
                            <InputNumber precision={2} style={{width:'100%'}} min={0}  onChange={(value:number)=>{
                                const dataA:number = form.getFieldValue('legWeightB')?form.getFieldValue('legWeightB'):0;
                                const dataB:number = form.getFieldValue('legWeightC')?form.getFieldValue('legWeightC'):0;
                                const dataC:number = form.getFieldValue('legWeightD')?form.getFieldValue('legWeightD'):0;
                                const dataD:number = form.getFieldValue('bodyWeight')?form.getFieldValue('bodyWeight'):0;
                                const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                form.setFieldsValue({
                                    monomerWeight:dataA+dataB+dataC+dataD+value,
                                    totalWeight:data+dataA+dataB+dataC+dataD+value
                                })
                            }} max={99999.99}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="legWeightB" label="接腿重B（kg）" initialValue={0}>
                            <InputNumber precision={2} style={{width:'100%'}} min={0}  onChange={(value:number)=>{
                                const dataA:number = form.getFieldValue('legWeightA')?form.getFieldValue('legWeightA'):0;
                                const dataB:number = form.getFieldValue('legWeightC')?form.getFieldValue('legWeightC'):0;
                                const dataC:number = form.getFieldValue('legWeightD')?form.getFieldValue('legWeightD'):0;
                                const dataD:number = form.getFieldValue('bodyWeight')?form.getFieldValue('bodyWeight'):0;
                                const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                form.setFieldsValue({
                                    monomerWeight:dataA+dataB+dataC+dataD+value,
                                    totalWeight:data+dataA+dataB+dataC+dataD+value
                                })
                            }} max={99999.99}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="legWeightC" label="接腿重C（kg）" initialValue={0}>
                            <InputNumber precision={2} style={{width:'100%'}} min={0}   onChange={(value:number)=>{
                                const dataA:number = form.getFieldValue('legWeightA')?form.getFieldValue('legWeightA'):0;
                                const dataB:number = form.getFieldValue('legWeightB')?form.getFieldValue('legWeightB'):0;
                                const dataC:number = form.getFieldValue('legWeightD')?form.getFieldValue('legWeightD'):0;
                                const dataD:number = form.getFieldValue('bodyWeight')?form.getFieldValue('bodyWeight'):0;
                                const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                form.setFieldsValue({
                                    monomerWeight:dataA+dataB+dataC+dataD+value,
                                    totalWeight:data+dataA+dataB+dataC+dataD+value
                                })
                            }} max={99999.99}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="legWeightD" label="接腿重D（kg）" initialValue={0}>
                            <InputNumber precision={2} style={{width:'100%'}} min={0}  onChange={(value:number)=>{
                                const dataA:number = form.getFieldValue('legWeightA')?form.getFieldValue('legWeightA'):0;
                                const dataB:number = form.getFieldValue('legWeightB')?form.getFieldValue('legWeightB'):0;
                                const dataC:number = form.getFieldValue('legWeightC')?form.getFieldValue('legWeightC'):0;
                                const dataD:number = form.getFieldValue('bodyWeight')?form.getFieldValue('bodyWeight'):0;
                                const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                form.setFieldsValue({
                                    monomerWeight:dataA+dataB+dataC+dataD+value,
                                    totalWeight:data+dataA+dataB+dataC+dataD+value
                                })
                            }} max={99999.99}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="bodyWeight" label="本体重量（kg）" rules={[{
                            "required": true,
                            "message":"请输入本体重量（kg）"
                        }]} initialValue={0}>
                            <InputNumber precision={2} style={{width:'100%'}} min={0}  onChange={(value:number)=>{
                                const dataA:number = form.getFieldValue('legWeightA')?form.getFieldValue('legWeightA'):0;
                                const dataB:number = form.getFieldValue('legWeightB')?form.getFieldValue('legWeightB'):0;
                                const dataC:number = form.getFieldValue('legWeightC')?form.getFieldValue('legWeightC'):0;
                                const dataD:number = form.getFieldValue('legWeightD')?form.getFieldValue('legWeightD'):0;
                                const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                form.setFieldsValue({
                                    monomerWeight:dataA+dataB+dataC+dataD+value,
                                    totalWeight:data+dataA+dataB+dataC+dataD+value
                                })
                            }} max={999999.99}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="monomerWeight" label="单重（kg）" rules={[{
                            "required": true,
                            "message":"请输入单重（kg）"
                        }]} initialValue={0}>
                            <InputNumber precision={2} style={{width:'100%'}} disabled  max={9999999.99}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="otherWeight" label="其他增重（kg）">
                            <InputNumber precision={2} style={{width:'100%'}} min={0} onChange={(value:number)=>{
                                const data:number = form.getFieldValue('monomerWeight')?form.getFieldValue('monomerWeight'):0;
                                form.setFieldsValue({
                                    totalWeight:data+value
                                })
                            }} max={999999.99}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="totalWeight" label="总重（kg）" rules={[{
                            "required": true,
                            "message":"请输入总重（kg）"
                        }]} initialValue={0}>
                            <InputNumber precision={2} style={{width:'100%'}} disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="description" label="备注">
                            <TextArea rows={1} showCount maxLength={400}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* <BaseInfo columns={towerData} dataSource={detailData || {}} edit col={ 2 }/> */}
                </Form>
            </Modal>
        </Spin>
}
