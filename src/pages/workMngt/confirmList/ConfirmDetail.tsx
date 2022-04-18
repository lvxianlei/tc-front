import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Modal, Form, Upload, message, Image, Descriptions } from 'antd';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { Table, Input, InputNumber, Popconfirm, Select } from 'antd';
import AuthUtil from '../../../utils/AuthUtil';
import { patternTypeOptions, productTypeOptions } from '../../../configuration/DictionaryOptions';
import { downloadTemplate } from '../setOut/downloadTemplate';
import styles from './confirm.module.less'
export default function ConfirmDetail(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [pictureVisible, setPictureVisible] = useState<boolean>(false);
    const [pictureUrl, setPictureUrl] = useState('');
    const [tableDataSource, setTableDataSource] = useState<object[]>([]);
    const [weight,setWeight] = useState<string>('0');
    const [description, setDescription] = useState('');
    const [attachInfo, setAttachInfo] = useState<any[]>([]);
    const [confirmData, setConfirmData] = useState<any[]>([{
        B:0,
        C:0,
        D:0,
        E:0,
        F:0,
        H:0,
        I:0,
        J:0,
        K:0,
        legWeightA:0,
        legWeightB:0,
        legWeightC:0,
        legWeightD:0,
    }]);
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();

    const [edit, setEdit] = useState('添加');
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
          width: 80,
          key: 'lineName', 
      },
      { 
          title: '* 产品类型', 
          dataIndex: 'productType', 
          width: 100,
          key: 'productType',
      },
      { 
          title: '* 电压等级（kv）', 
          dataIndex: 'voltageLevel',
          width: 120,
          key: 'voltageLevel'
      },
      { 
          title: '* 塔型', 
          dataIndex: 'productCategory', 
          width: 80,
          key: 'productCategory' 
      },
      { 
          title: '* 塔型钢印号', 
          dataIndex: 'steelProductShape', 
          width: 100,
          key: 'steelProductShape' 
      },
      
      { 
          title: '* 杆塔号', 
          dataIndex: 'name', 
          width: 80,
          key: 'name' 
      },
      { 
          title: '* 呼高（m）', 
          dataIndex: 'basicHeight', 
          width: 90,
          key: 'basicHeight',
          render:(value:any)=>{
            return parseFloat(value).toFixed(2)
          }  
      },
      { 
          title: '* 模式', 
          dataIndex: 'pattern', 
          width: 90,
          key: 'pattern',
      },
      { 
        title: '接腿配置A', 
        dataIndex: 'legConfigurationA', 
        width: 80,
        key: 'legConfigurationA' 
      },
      { 
        title: '接腿配置B', 
        dataIndex: 'legConfigurationB', 
        width: 80,
        key: 'legConfigurationB' 
      },
      { 
        title: '接腿配置C', 
        dataIndex: 'legConfigurationC', 
        width: 80,
        key: 'legConfigurationC' 
      },
      { 
        title: '接腿配置D', 
        dataIndex: 'legConfigurationD', 
        width: 80,
        key: 'legConfigurationD' 
      },
      { 
        title: '接腿重A（kg）', 
        dataIndex: 'legWeightA', 
        width: 100,
        key: 'legWeightA', 
        render:(value:any)=>{
          return parseFloat(value).toFixed(2)
        }  
      },
      { 
        title: '接腿重B（kg）', 
        dataIndex: 'legWeightB', 
        width: 100,
        key: 'legWeightB', 
        render:(value:any)=>{
          return parseFloat(value).toFixed(2)
        }  
      },
      { 
        title: '接腿重C（kg）', 
        dataIndex: 'legWeightC',
        width: 100,
        key: 'legWeightC', 
        render:(value:any)=>{
          return parseFloat(value).toFixed(2)
        }  
      },
      { 
        title: '接腿重D（kg）', 
        dataIndex: 'legWeightD',
        width: 100,
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
        title: '* 本体重量（kg）', 
        dataIndex: 'bodyWeight', 
        width: 120,
        key: 'bodyWeight',
        render:(value:any)=>{
          return parseFloat(value).toFixed(2)
        }   
      },//范春森于11月23日去掉，于龙于11月25号加上
      { 
        title: '* 单重（kg）', 
        dataIndex: 'monomerWeight', 
        width: 100,
        key: 'monomerWeight', 
        render:(_:any,record:any)=>{
          return <span>{(parseFloat(record.legWeightA)+parseFloat(record.legWeightB)+parseFloat(record.legWeightC)+parseFloat(record.legWeightD)+parseFloat(record.bodyWeight)).toFixed(2)}</span>
        }  
      },
      // { 
      //     title: '其他重量（kg）', 
      //     dataIndex: 'otherWeight', 
      //     type:'number',
      //     width: 120,
      //     editable: true,
      //     key: 'otherWeight',
      //     render:(value:any)=>{
      //       return parseFloat(value).toFixed(2)
      //     }  
      // },
      { 
          title: '* 总重（kg）', 
          dataIndex: 'totalWeight', 
          width: 100,
          key: 'totalWeight',
          render:(_:any,record:any)=>{
              return <span>{(parseFloat(record.otherWeight)+parseFloat(record.legWeightA)+parseFloat(record.legWeightB)+parseFloat(record.legWeightC)+parseFloat(record.legWeightD)+parseFloat(record.bodyWeight)).toFixed(2)}</span>
          } 
      },
      { 
          title: '备注', 
          dataIndex: 'description', 
          width: 250,
          key: 'description' 
      },
      {
          key: 'operation',
          title: '操作',
          width: 100,
          dataIndex: 'operation',
          render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Space direction="horizontal" size="small">
                <Button type="link" onClick={()=>{
                    setEdit('编辑')
                    form.setFieldsValue({
                        confirmList: [record]
                    })
                }}>编辑</Button>
                <Popconfirm
                    title="确认删除?"
                    onConfirm={async () => {
                      // const newData:any = [...tableDataSource];
                      // const index = newData.findIndex((item:any) => key === item.key);
                      // console.log(newData[index])
                      // if (index > -1 && newData[index].id) {
                        RequestUtil.delete(`/tower-science/drawProductDetail?id=${record.id}`)
                      //   newData.splice(index, 1);
                      // }else{
                      //   newData.splice(index, 1);
                      // }
                      // setTableDataSource(newData);
                      // let totalNumber = '0';
                      // console.log(newData)
                      // newData.forEach((item:any)=>{
                      //   totalNumber = (parseFloat(item.totalWeight)+parseFloat(totalNumber)).toFixed(2)
                      // })
                      // setWeight(totalNumber);
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
                    }}
                    okText="确认"
                    cancelText="取消"
                >
                    <Button type="link">删除</Button>
                </Popconfirm>
            </Space>
        )
      }

    ];
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
                          if(tableDataSource.length>0){
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
                          if(tableDataSource.length>0){
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
                
                        {params.status==='3'?<Button type='primary' ghost onClick={() => {
                            setEdit('添加')
                            setVisible(true)
                            
                        }}>添加</Button>:null}
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
                <CommonTable columns={tableColumns} dataSource={[...tableDataSource]} pagination={false}/>
                <div style={{paddingBottom: '24px'}}>
                  <DetailTitle title="备注"/>
                  {detailData?<TextArea maxLength={ 200 } defaultValue={detailData?.description} onChange={(e)=>{
                      setDescription(e.target.value)
                  }} disabled={params.status!=='3'} />:null}
                </div>
                
                <Attachment dataSource={attachInfo} edit={params.status==='3'?true:false} title="附件信息" ref={attchsRef}/>
            </DetailContent>
            <Modal visible={pictureVisible} onCancel={handlePictureModalCancel} footer={false}>
                <Image src={pictureUrl} preview={false}/>
            </Modal>
            <Modal visible={visible} title={edit} onOk={handleModalOk} onCancel={handleModalCancel}  width={ '95%'}>
                <Form form={form} { ...formItemLayout } className={styles.descripForm}>
                        <Descriptions title="" bordered size="small" colon={ false } column={ 14 }>
                            <Descriptions.Item label="线路名称" span={ 2 }>
                                <Form.Item name="lineName" rules={[{
                                    "required": true,
                                    "message":"请输入线路名称"
                                }]}>
                                    <Input  maxLength={50}/>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="塔型" span={ 2 }>
                                <Form.Item name="productCategory" rules={[{
                                  "required": true,
                                  "message":"请输入塔型"
                                }]}>
                                    <Input  maxLength={50}/>
                                </Form.Item>
                              
                            </Descriptions.Item>
                            <Descriptions.Item label="塔型钢印号" span={ 2 }>
                                <Form.Item name="steelProductShape" rules={[{
                                    "required": true,
                                    "message":"请输入塔型钢印号"
                                }]}>
                                    <Input  maxLength={50}/>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="产品类型" span={ 2 }>
                                <Form.Item name="productType" rules={[{
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
                            </Descriptions.Item>
                            <Descriptions.Item label="电压等级" span={ 2 }>
                                <Form.Item name="productType" rules={[{
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
                            </Descriptions.Item>
                            <Descriptions.Item label="模式" span={ 2 }>
                                <Form.Item name="pattern" rules={[{
                                    "required": true,
                                    "message":"请选择模式"
                                }]}>
                                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                                      { patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                          return <Select.Option key={ index } value={ id }>
                                              { name }
                                          </Select.Option>
                                      }) }
                                  </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item children span={ 14 }></Descriptions.Item>
                            {
                                confirmData?.map((item: any, index: number) => {
                                    return  <>  
                                        <Descriptions.Item label="杆塔号" span={ 2 }>
                                          <Form.Item name={["confirmList", index, "name"]} rules={[{
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
                                        </Descriptions.Item>
                                        <Descriptions.Item label="基数"  span={ 2 }>
                                            <Form.Item name={["confirmList", index, "A"]}
                                                rules={[{
                                                    required: true
                                                }]} >
                                                <Input  maxLength={50}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="呼高（m）"  span={ 2 }>
                                          <Form.Item name={["confirmList", index, "basicHeight"]}  rules={[{
                                              "required": true,
                                              "message":"请输入呼高（m）"
                                          }]}>
                                              <InputNumber precision={2}  min={0} max={99.99}/>
                                          </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="本体重量（kg）" span={ 2 }>
                                          <Form.Item name={["confirmList", index, "bodyWeight"]} rules={[{
                                              "required": true,
                                              "message":"请输入本体重量（kg）"
                                          }]} initialValue={0}>
                                              <InputNumber precision={2}  min={0}  onChange={(value:number)=>{
                                                  const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                  const dataA: number = legValueSum[index]?.legWeightA?legValueSum[index]?.legWeightA:0;
                                                  const dataB: number = legValueSum[index]?.legWeightB?legValueSum[index]?.legWeightB:0;
                                                  const dataC: number = legValueSum[index]?.legWeightC?legValueSum[index]?.legWeightC:0;
                                                  const dataD: number = legValueSum[index]?.legWeightD?legValueSum[index]?.legWeightD:0;
                                                  const otherA:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                  const otherB:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                  const otherC:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                  const otherD:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                  const otherE:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                  const otherF:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                  const otherG:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                  const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                  const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                  const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                  legValueSum[index].monomerWeight = dataA+dataB+dataC+dataD+value
                                                  legValueSum[index].totalWeight = dataA+dataB+dataC+dataD+otherA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value

                                                  form.setFieldsValue({
                                                      confirmList: [...legValueSum]
                                                  })
                                                  setConfirmData([...legValueSum])
                                                  // const dataA:number = form.getFieldValue('legWeightA')?form.getFieldValue('legWeightA'):0;
                                                  // const dataB:number = form.getFieldValue('legWeightB')?form.getFieldValue('legWeightB'):0;
                                                  // const dataC:number = form.getFieldValue('legWeightC')?form.getFieldValue('legWeightC'):0;
                                                  // const dataD:number = form.getFieldValue('legWeightD')?form.getFieldValue('legWeightD'):0;
                                                  // const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                                  // form.setFieldsValue({
                                                  //     monomerWeight:dataA+dataB+dataC+dataD+value,
                                                  //     totalWeight:data+dataA+dataB+dataC+dataD+value
                                                  // })
                                              }} max={999999.99}/>
                                          </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="接腿配置A" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "legConfigurationA"]}>
                                              <Input   maxLength={10}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="接腿配置B" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "legConfigurationB"]} >
                                                <Input   maxLength={10}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="接腿配置C" span={ 2 }>
                                          <Form.Item name={["confirmList", index, "legConfigurationC"]}>
                                              <Input   maxLength={10}/>
                                          </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="接腿配置D" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "legConfigurationD"]} >
                                                <Input  maxLength={10}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="接腿重A（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "legWeightA"]}
                                            // rules={[{
                                            //     "required": true,
                                            //     "message":"请输入接腿重A（kg）"
                                            // }]}
                                            initialValue={0}
                                            >
                                                <InputNumber precision={2} min={0}  onChange={(value:number)=>{
                                                     const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                     const dataA: number = legValueSum[index]?.bodyWeight?legValueSum[index]?.bodyWeight:0;
                                                     const dataB: number = legValueSum[index]?.legWeightB?legValueSum[index]?.legWeightB:0;
                                                     const dataC: number = legValueSum[index]?.legWeightC?legValueSum[index]?.legWeightC:0;
                                                     const dataD: number = legValueSum[index]?.legWeightD?legValueSum[index]?.legWeightD:0;
                                                     const otherA:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                     const otherB:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                     const otherC:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                     const otherD:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                     const otherE:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                     const otherF:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                     const otherG:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                     const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                     const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                     const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                     legValueSum[index].monomerWeight = dataA+dataB+dataC+dataD+value
                                                     legValueSum[index].totalWeight = dataA+dataB+dataC+dataD+otherA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                     console.log(legValueSum)
                                                     form.setFieldsValue({
                                                         confirmList: [...legValueSum]
                                                     })
                                                     setConfirmData([...legValueSum])
                                                    // const dataA:number = form.getFieldValue('legWeightB')?form.getFieldValue('legWeightB'):0;
                                                    // const dataB:number = form.getFieldValue('legWeightC')?form.getFieldValue('legWeightC'):0;
                                                    // const dataC:number = form.getFieldValue('legWeightD')?form.getFieldValue('legWeightD'):0;
                                                    // const dataD:number = form.getFieldValue('bodyWeight')?form.getFieldValue('bodyWeight'):0;
                                                    // const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     monomerWeight:dataA+dataB+dataC+dataD+value,
                                                    //     totalWeight:data+dataA+dataB+dataC+dataD+value
                                                    // })
                                                }} max={99999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="接腿重B（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "legWeightB"]}  initialValue={0}>
                                                <InputNumber precision={2} min={0}  onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.bodyWeight?legValueSum[index]?.bodyWeight:0;
                                                    const dataB: number = legValueSum[index]?.legWeightA?legValueSum[index]?.legWeightA:0;
                                                    const dataC: number = legValueSum[index]?.legWeightC?legValueSum[index]?.legWeightC:0;
                                                    const dataD: number = legValueSum[index]?.legWeightD?legValueSum[index]?.legWeightD:0;
                                                    const otherA:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                    const otherB:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                    const otherC:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                    const otherD:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                    const otherE:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                    const otherF:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                    const otherG:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                    const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                    const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                    const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                    legValueSum[index].monomerWeight = dataA+dataB+dataC+dataD+value
                                                    legValueSum[index].totalWeight = dataA+dataB+dataC+dataD+otherA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const dataA:number = form.getFieldValue('legWeightA')?form.getFieldValue('legWeightA'):0;
                                                    // const dataB:number = form.getFieldValue('legWeightC')?form.getFieldValue('legWeightC'):0;
                                                    // const dataC:number = form.getFieldValue('legWeightD')?form.getFieldValue('legWeightD'):0;
                                                    // const dataD:number = form.getFieldValue('bodyWeight')?form.getFieldValue('bodyWeight'):0;
                                                    // const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     monomerWeight:dataA+dataB+dataC+dataD+value,
                                                    //     totalWeight:data+dataA+dataB+dataC+dataD+value
                                                    // })
                                                }} max={99999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="接腿重C（kg）" span={ 2 }>
                                          <Form.Item name={["confirmList", index, "legWeightC"]}  initialValue={0}>
                                              <InputNumber precision={2} min={0}   onChange={(value:number)=>{
                                                  const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                  const dataA: number = legValueSum[index]?.bodyWeight?legValueSum[index]?.bodyWeight:0;
                                                  const dataB: number = legValueSum[index]?.legWeightA?legValueSum[index]?.legWeightA:0;
                                                  const dataC: number = legValueSum[index]?.legWeightB?legValueSum[index]?.legWeightB:0;
                                                  const dataD: number = legValueSum[index]?.legWeightD?legValueSum[index]?.legWeightD:0;
                                                  const otherA:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                  const otherB:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                  const otherC:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                  const otherD:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                  const otherE:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                  const otherF:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                  const otherG:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                  const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                  const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                  const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                  legValueSum[index].monomerWeight = dataA+dataB+dataC+dataD+value
                                                  legValueSum[index].totalWeight = dataA+dataB+dataC+dataD+otherA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                  console.log(legValueSum)
                                                  form.setFieldsValue({
                                                      confirmList: [...legValueSum]
                                                  })
                                                  setConfirmData([...legValueSum])
                                                  // const dataA:number = form.getFieldValue('legWeightA')?form.getFieldValue('legWeightA'):0;
                                                  // const dataB:number = form.getFieldValue('legWeightB')?form.getFieldValue('legWeightB'):0;
                                                  // const dataC:number = form.getFieldValue('legWeightD')?form.getFieldValue('legWeightD'):0;
                                                  // const dataD:number = form.getFieldValue('bodyWeight')?form.getFieldValue('bodyWeight'):0;
                                                  // const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                                  // form.setFieldsValue({
                                                  //     monomerWeight:dataA+dataB+dataC+dataD+value,
                                                  //     totalWeight:data+dataA+dataB+dataC+dataD+value
                                                  // })
                                              }} max={99999.99}/>
                                          </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="接腿重D（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "legWeightD"]}  initialValue={0}>
                                                <InputNumber precision={2}  min={0}  onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.bodyWeight?legValueSum[index]?.bodyWeight:0;
                                                    const dataB: number = legValueSum[index]?.legWeightA?legValueSum[index]?.legWeightA:0;
                                                    const dataC: number = legValueSum[index]?.legWeightB?legValueSum[index]?.legWeightB:0;
                                                    const dataD: number = legValueSum[index]?.legWeightC?legValueSum[index]?.legWeightC:0;
                                                    const otherA:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                    const otherB:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                    const otherC:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                    const otherD:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                    const otherE:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                    const otherF:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                    const otherG:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                    const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                    const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                    const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                    legValueSum[index].monomerWeight = dataA+dataB+dataC+dataD+value
                                                    legValueSum[index].totalWeight = dataA+dataB+dataC+dataD+otherA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const dataA:number = form.getFieldValue('legWeightA')?form.getFieldValue('legWeightA'):0;
                                                    // const dataB:number = form.getFieldValue('legWeightB')?form.getFieldValue('legWeightB'):0;
                                                    // const dataC:number = form.getFieldValue('legWeightC')?form.getFieldValue('legWeightC'):0;
                                                    // const dataD:number = form.getFieldValue('bodyWeight')?form.getFieldValue('bodyWeight'):0;
                                                    // const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     monomerWeight:dataA+dataB+dataC+dataD+value,
                                                    //     totalWeight:data+dataA+dataB+dataC+dataD+value
                                                    // })
                                                }} max={99999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="单重（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "monomerWeight"]}  rules={[{
                                                "required": true,
                                                "message":"请输入单重（kg）"
                                            }]} initialValue={0}>
                                                <InputNumber precision={2} disabled  max={9999999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="总重（kg）" span={ 2 }>
                                          <Form.Item name={["confirmList", index, "totalWeight"]} rules={[{
                                              "required": true,
                                              "message":"请输入总重（kg）"
                                          }]} initialValue={0}>
                                              <InputNumber precision={2} disabled />
                                          </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="其他增重-抱箍（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "B"]} initialValue={0}>
                                                <InputNumber precision={2}  min={0} onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.monomerWeight?legValueSum[index]?.monomerWeight:0;
                                                    const otherB:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                    const otherC:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                    const otherD:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                    const otherE:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                    const otherF:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                    const otherG:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                    const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                    const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                    const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                    legValueSum[index].totalWeight = dataA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const data:number = form.getFieldValue('monomerWeight')?form.getFieldValue('monomerWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     totalWeight:data+value
                                                    // })
                                                }} max={999999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="其他增重-平台（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "C"]} initialValue={0}>
                                                <InputNumber precision={2}  min={0} onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.monomerWeight?legValueSum[index]?.monomerWeight:0;
                                                    const otherB:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                    const otherC:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                    const otherD:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                    const otherE:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                    const otherF:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                    const otherG:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                    const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                    const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                    const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                    legValueSum[index].totalWeight = dataA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const data:number = form.getFieldValue('monomerWeight')?form.getFieldValue('monomerWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     totalWeight:data+value
                                                    // })
                                                }} max={999999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="其他增重-相序牌（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "D"]} initialValue={0}>
                                                <InputNumber precision={2}  min={0} onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.monomerWeight?legValueSum[index]?.monomerWeight:0;
                                                    const otherB:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                    const otherC:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                    const otherD:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                    const otherE:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                    const otherF:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                    const otherG:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                    const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                    const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                    const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                    legValueSum[index].totalWeight = dataA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const data:number = form.getFieldValue('monomerWeight')?form.getFieldValue('monomerWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     totalWeight:data+value
                                                    // })
                                                }} max={999999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="其他增重-爬梯（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "E"]} initialValue={0}>
                                                <InputNumber precision={2}  min={0} onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.monomerWeight?legValueSum[index]?.monomerWeight:0;
                                                    const otherB:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                    const otherC:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                    const otherD:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                    const otherE:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                    const otherF:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                    const otherG:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                    const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                    const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                    const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                    legValueSum[index].totalWeight = dataA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const data:number = form.getFieldValue('monomerWeight')?form.getFieldValue('monomerWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     totalWeight:data+value
                                                    // })
                                                }} max={999999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="其他增重-防盗（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "F"]} initialValue={0}>
                                                <InputNumber precision={2}  min={0} onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.monomerWeight?legValueSum[index]?.monomerWeight:0;
                                                    const otherB:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                    const otherC:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                    const otherD:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                    const otherE:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                    const otherF:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                    const otherG:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                    const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                    const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                    const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                    legValueSum[index].totalWeight = dataA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const data:number = form.getFieldValue('monomerWeight')?form.getFieldValue('monomerWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     totalWeight:data+value
                                                    // })
                                                }} max={999999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="其他增重-兜底绳施工孔板（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "G"]} initialValue={0} >
                                                <InputNumber precision={2}  min={0} onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.monomerWeight?legValueSum[index]?.monomerWeight:0;
                                                    const otherB:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                    const otherC:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                    const otherD:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                    const otherE:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                    const otherF:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                    const otherG:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                    const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                    const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                    const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                    legValueSum[index].totalWeight = dataA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const data:number = form.getFieldValue('monomerWeight')?form.getFieldValue('monomerWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     totalWeight:data+value
                                                    // })
                                                }} max={999999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="其他增重-挂点修改（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "H"]} initialValue={0}>
                                                <InputNumber precision={2} min={0} onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.monomerWeight?legValueSum[index]?.monomerWeight:0;
                                                    const otherB:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                    const otherC:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                    const otherD:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                    const otherE:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                    const otherF:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                    const otherG:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                    const otherH:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                    const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                    const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                    legValueSum[index].totalWeight = dataA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const data:number = form.getFieldValue('monomerWeight')?form.getFieldValue('monomerWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     totalWeight:data+value
                                                    // })
                                                }} max={999999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="其他增重-修改（kg）" span={ 2 }>
                                            <Form.Item name={["confirmList", index, "I"]} initialValue={0} >
                                                <InputNumber precision={2}  min={0} onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.monomerWeight?legValueSum[index]?.monomerWeight:0;
                                                    const otherB:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                    const otherC:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                    const otherD:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                    const otherE:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                    const otherF:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                    const otherG:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                    const otherH:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                    const otherI:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                    const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                    legValueSum[index].totalWeight = dataA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const data:number = form.getFieldValue('monomerWeight')?form.getFieldValue('monomerWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     totalWeight:data+value
                                                    // })
                                                }} max={999999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="其他增重-全塔双帽（kg）"span={ 2 }>
                                            <Form.Item name={["confirmList", index, "J"]} initialValue={0}>
                                                <InputNumber precision={2}  min={0} onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.monomerWeight?legValueSum[index]?.monomerWeight:0;
                                                    const otherB:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                    const otherC:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                    const otherD:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                    const otherE:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                    const otherF:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                    const otherG:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                    const otherH:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                    const otherI:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                    const otherJ:number = legValueSum[index]?.K?legValueSum[index]?.K:0;
                                                    legValueSum[index].totalWeight = dataA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const data:number = form.getFieldValue('monomerWeight')?form.getFieldValue('monomerWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     totalWeight:data+value
                                                    // })
                                                }} max={999999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="其他增重-螺栓（kg）"span={ 2 }>
                                            <Form.Item name={["confirmList", index, "K"]} initialValue={0}>
                                                <InputNumber precision={2}  min={0} onChange={(value:number)=>{
                                                    const legValueSum = form.getFieldsValue(true)?.confirmList;
                                                    const dataA: number = legValueSum[index]?.monomerWeight?legValueSum[index]?.monomerWeight:0;
                                                    const otherB:number = legValueSum[index]?.B?legValueSum[index]?.B:0;
                                                    const otherC:number = legValueSum[index]?.C?legValueSum[index]?.C:0;
                                                    const otherD:number = legValueSum[index]?.D?legValueSum[index]?.D:0;
                                                    const otherE:number = legValueSum[index]?.E?legValueSum[index]?.E:0;
                                                    const otherF:number = legValueSum[index]?.F?legValueSum[index]?.F:0;
                                                    const otherG:number = legValueSum[index]?.G?legValueSum[index]?.G:0;
                                                    const otherH:number = legValueSum[index]?.H?legValueSum[index]?.H:0;
                                                    const otherI:number = legValueSum[index]?.I?legValueSum[index]?.I:0;
                                                    const otherJ:number = legValueSum[index]?.J?legValueSum[index]?.J:0;
                                                    legValueSum[index].totalWeight = dataA+otherB+otherC+otherD+otherE+otherF+otherG+otherH+otherI+otherJ+value
                                                    console.log(legValueSum)
                                                    form.setFieldsValue({
                                                        confirmList: [...legValueSum]
                                                    })
                                                    setConfirmData([...legValueSum])
                                                    // const data:number = form.getFieldValue('monomerWeight')?form.getFieldValue('monomerWeight'):0;
                                                    // form.setFieldsValue({
                                                    //     totalWeight:data+value
                                                    // })
                                                }} max={999999.99}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="备注" span={ 7 }>
                                            <Form.Item name="description" >
                                                <TextArea rows={1}  maxLength={400} style={{width:'100%'}}/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item span={2}>
                                            <Space direction="horizontal">
                                                {index===confirmData.length-1&&edit!=='编辑'&&<Button type="primary" ghost size="small" onClick={ () => {
                                                    confirmData.push({
                                                       B:0,
                                                       C:0,
                                                       D:0,
                                                       E:0,
                                                       F:0,
                                                       H:0,
                                                       I:0,
                                                       J:0,
                                                       K:0,
                                                       legWeightA:0,
                                                       legWeightB:0,
                                                       legWeightC:0,
                                                       legWeightD:0,
                                                    })
                                                    form.setFieldsValue({
                                                      confirmList: [...confirmData]
                                                    })
                                                    setConfirmData([...confirmData])
                                                    
                                                } }>添加</Button>}
                                                {confirmData.length!==1&&<Button type="ghost" size="small" onClick={ () => {
                                                    confirmData.splice(index,1)
                                                    form.setFieldsValue({
                                                        confirmList: [...confirmData]
                                                    })
                                                    setConfirmData([...confirmData])
                                                }}>删除</Button>}
                                            </Space>
                                        </Descriptions.Item>
                                    </>
                                })
                            }
                        </Descriptions>
                </Form>
            </Modal>
        </Spin>
}
