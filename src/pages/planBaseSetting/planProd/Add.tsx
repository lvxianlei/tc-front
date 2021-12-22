import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, Input, message, InputNumber, TableColumnProps, Table} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import moment from 'moment';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { IAnnouncement } from '../../announcement/AnnouncementMngt';

export default function RecruitEdit(): React.ReactNode {
    const columns: TableColumnProps<object>[] = [
        {
            title: '杆塔号',
            dataIndex: 'productNumber',
        },
        {
            title: '杆塔要求完成时间',
            dataIndex: 'completionTime',
        },
      
    ]
    const [typenum,settypenum]=useState<any>(null)
    const history = useHistory()
    const params = useParams<{ id: string, productCategoryId: string, planId: string }>();
    const [form] = Form.useForm();
    const [value, setValue] = useState<any>([moment(dayjs().format('YYYY-MM-DD')), moment(dayjs().add(6, 'day').format('YYYY-MM-DD'))]);
    const [dates, setDates] = useState<any>([]);
    const [ prodLinkList, setProdLinkList] = useState<any[]>([])
    const [ prodUnitList, setProdUnitList] = useState<any[]>([])
    const [list,setList]=useState<any[]>([])
    const [ TowerList, setTowerList] = useState<any[]>([])
    const [productivity, setProductivity] = useState<any>('');
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = params.productCategoryId && await RequestUtil.get(`/tower-aps/planUnitLink/${params.productCategoryId}`);
      
        if(params.productCategoryId){
            getProdLinkList(data.linkId);
        }else{
            getProdLinkList();
        }
        const tree =params.productCategoryId && await RequestUtil.get<any>(`/tower-aps/productionPlan/unitLinks`,{
            planProductCategoryId:params.id,
            
          });
        params.productCategoryId && getProdLinkLists(tree.planId,tree.name);
        const value: any = params.productCategoryId &&await RequestUtil.get('/tower-aps/productionUnit', {
            current: 1,
            size: 1000,
            productionLinkId:data.linkId
        })
        const listValue: any = params.productCategoryId&& value.records.length>0?value.records.filter((res: any) => {return res.id === data.unitId}):[{}]
        params.productCategoryId && setProductivity(listValue[0].productivity?listValue[0].productivity:'')
        params.productCategoryId&& seeLoad(listValue[0].productivity, data.unitId)
        params.productCategoryId && setProdUnitList(value.records)
        form.setFieldsValue( params.productCategoryId?{
            ...data,
            startTime: data?.startTime?moment(data?.startTime):'',
            endTime: data?.startTime && data.minCompletionDays?moment(new Date( data?.startTime).setDate(new Date( data?.startTime).getDate()+ data.minCompletionDays-1)):'',
        }:{})
        console.log(data)
        resole(data)
    }), {})
    const disabledDate = (current: any) => {
        if (!dates || dates.length === 0) {
          return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > 6;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 6;
        return tooEarly || tooLate;
    };
    const detailData: any = data;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    /**
     * @description 获取生产环节
     */
    const getProdLinkList = async (linkId?:string) => {
        const data: any = await RequestUtil.get('/tower-aps/productionLink', {
            current: 1,
            size: 1000
        }) 
        setProdLinkList(data.records)
        // const list= params.productCategoryId && data.records.filter((item:any,index:any)=>{
        //     return item.id === linkId
        // })
        // params.productCategoryId && setList(list)
       
    }
      /**
     * @description 获取杆塔明细
     */
       const getProdLinkLists = async (planId:string,name:string) => {
        const data: any = await RequestUtil.get(`/tower-aps/planUnitLink/product`,{
            planId:planId,
            id:params.productCategoryId,
            productCategoryName:name
        })
        
        setTowerList(data)
    }
    /**
     * @description 获取生产单元
     */
    const getProdUnitList = async (id:any) => {
        form.setFieldsValue({
            unitId:''
        })
        const data: any = await RequestUtil.get('/tower-aps/productionUnit', {
            current: 1,
            size: 1000,
            productionLinkId:id
        })
        setProdUnitList(data.records)
        
    }
   
    /**
     * @description
     */
     const seeLoad = async (max?:number, id?:any) => {
        // if (!times[0]) {
        //     message.error('请选择时间范围')
        //     return
        // }
        if (!value||value.length===0) {
            message.error('请选择时间范围')
            return
        }
        let data: any = await RequestUtil.get('/tower-aps/productionUnit/load', {
            id: form.getFieldsValue().unitId?form.getFieldsValue().unitId:id,
            startTime: value[0].format('YYYY-MM-DD'),
            endTime: value[1].format('YYYY-MM-DD') 
            // startTime: times[0] ? `${times[0]} 00:00:00` : null,
            // endTime: times[1] ? `${times[1]} 23:59:59` : null,
        })
        if (data) {
            let dates = (data.loadList || []).map((item: { dayTime: string }) => {
                return item.dayTime
            })
            let datas: any[] = [
                {
                    name: '已下达',
                    type: 'bar',
                    stack: 'stack',
                    emphasis: {
                        focus: 'series'
                    },
                    markLine: {
                        data: [{
                            name:'产力值',
                           yAxis:max
                        }]
                    },
                    data: []
                },
                {
                    name: '已下发',
                    type: 'bar',
                    stack: 'stack',
                    emphasis: {
                        focus: 'series'
                    },
                    markLine: {
                        data: [{
                            name:'产力值',
                           yAxis:max
                        }]
                    },
                    data: []
                },
                // {
                //     name: '待确认',
                //     type: 'bar',
                //     stack: 'stack',
                //     emphasis: {
                //         focus: 'series'
                //     },
                //     markLine: {
                //         data: [{
                //             name:'产力值',
                //            yAxis:max
                //         }]
                //     },
                //     data: []
                // },
                {
                    name: '已锁定',
                    type: 'bar',
                    stack: 'stack',
                    emphasis: {
                        focus: 'series'
                    },
                    markLine: {
                        data: [{
                            name:'产力值',
                           yAxis:max
                        }]
                    },
                    data: []
                },
            ];
           
            // (data.loadList || []).forEach((item: { productivityList: { forEach: (arg0: (e: any, i: string) => void) => void; }; }, index: any) => {
            //     item.productivityList.forEach((e: any, i: any) => {
            //         datas[i].name = e.statusName
            //         datas[i].data.push(e.productivity || 0)
            //     });
            // });
            (data.loadList || []).forEach((item: { productivityList:  any }, index: any) => {
                datas.map((res: any, i: number) => {
                    if(item?.productivityList?.length > 0 && res.name === item.productivityList[i].statusName ){
                        res.data.push(item.productivityList[i].productivity || 0)
                    }  else  {
                        res.data.push(undefined)
                    } 
                })
            });
            initCharts(dates, datas)
        }
    }
     const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<IAnnouncement[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IAnnouncement[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
   const onUnLock=async (id:any)=>{
        await RequestUtil.post<any>(`/tower-aps/planUnitLink/unlock?id=${id}`).then(()=>{
          message.success('解锁成功！')
        }).then(async ()=>{
          // this.props.history.go(0)
        //   const value = this.state.dataSource.data.map((item:any)=>{
        //     return{
        //       ...item,
        //       status: item.id===id?1:item.status
        //     }
        //   })
        //   const newValue={
        //     data: value
        //   }
        //   this.setState({
        //     dataSource: newValue
        //   })
        //   gantt.parse(newValue)
        });
      }
    const  onLock=async (id:any)=>{
        await RequestUtil.post<any>(`/tower-aps/planUnitLink/lock?id=${id}`).then(()=>{
          message.success('锁定成功！')
        }).then(async ()=>{
          // this.props.history.go(0)
        //   const value = this.state.dataSource.data.map((item:any)=>{
        //     return{
        //       ...item,
        //       status: item.id===id?2:item.status
        //     }
        //   })
        //   const newValue={
        //     data: value
        //   }
        //   this.setState({
        //     dataSource: newValue
        //   })
        //   gantt.parse(newValue)
        });
      }
    const  onConfirm =async (id:any)=>{
        let ids:any=[]
        selectedRows.forEach((item,index)=>{
            ids[index].id=item.id
        })
        await RequestUtil.post(`/tower-aps/planUnitLink/issue`,{
            id:id,
            productIds:ids
        }).then(()=>{
          message.success('下发成功！')
        })
      }
    /**
     * @description
     */
    const initCharts = (dates: string[], datas: any[],) => {
        const myChart = echarts.init((document as HTMLElement | any).getElementById('detailGantt'));
        // 绘制图表
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: dates,
                }
            ],
            yAxis: [
               
                {
                    type: 'value',
                }
            ],
            series:datas,
        });
    }
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space> 
                    <Button type="primary" onClick={async () => {
                            await form.validateFields();
                            const value= form.getFieldsValue(true);
                            const submitValue={
                                ...value,
                                planId:params.planId,
                                planProductCategoryId:params.id,
                                startTime: value.startTime?moment(value.startTime).format('YYYY-MM-DD'):undefined,
                                endTime:value.endTime?moment(value.endTime).format('YYYY-MM-DD'):undefined,

                            }
                            if(params.productCategoryId&&list[0].issuedType=='productCategoryName'){
                                if(selectedKeys.length>0){
                                    let newValue={
                                        ...submitValue,
                                        selectedKeys
                                    }
                                    RequestUtil.post(`/tower-aps/planUnitLink`,newValue).then(()=>{
                                        message.success('保存成功！')
                                    }).then(()=>{
                                        history.push(`/planProd/planMgmt/detail/${params.id}/${params.planId}`)
                                    })
                                }else{
                                        message.error('当前未选择杆塔号，不可保存！')
                                }
                            }else{
                                RequestUtil.post(`/tower-aps/planUnitLink`,submitValue).then(()=>{
                                    message.success('保存成功！')
                                }).then(()=>{
                                    history.push(`/planProd/planMgmt/detail/${params.id}/${params.planId}`)
                                })
                            }
                           
                        
                    }}>保存</Button>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
                
                 {params.productCategoryId?<div className='nav'>
                     <Button   onClick={() => { 
                         settypenum("2")
                          onLock(params.productCategoryId)
                    }
                     }>锁定</Button>
                 <Button  onClick={() =>{
                     settypenum("1")
                     onUnLock(params.productCategoryId)
                 }}>解除锁定</Button>
                 <Button  disabled={typenum==='1'? true:false} onClick={() => onConfirm(params.productCategoryId)}>下发</Button></div>:null}
            <DetailTitle title={params.productCategoryId?"编辑环节":"新增环节"}/>
           
            <Form form={ form } { ...formItemLayout }>
         
                <Row>
                    <Col span={12}>
                        <Form.Item label="生产环节" rules={[{required:true,message:'请选择生产环节'}]} name='linkId'>
                            <Select
                                className='input'
                                placeholder='请选择'
                                style={{width:'100%'}}
                                // onChange={async (value:any)=>{
                                //     getProdUnitList(value)
                                //      const list= prodLinkList.filter((item,index)=>{
                                //         return item.id===value
                                //     })

                                //     // setList(list)
                                //     // const tree = await RequestUtil.get<any>(`/tower-aps/productionPlan/unitLinks`,{
                                //     //     planProductCategoryId:params.id,
                                        
                                //     //   });
                                //     //   getProdLinkLists(tree.planId,tree.name);
                                // }}
                            >
                                {
                                    prodLinkList.map((item: any, index: number) => {
                                        return (
                                            <Select.Option
                                                key={index}
                                                value={item.id}
                                                disabled={item.isUse}
                                            >{item.name}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="占用产力" rules={[{required:true,message:'请填写占用产力'}]} name='useProductivity'>
                            <InputNumber maxLength={12} min={0} style={{width:'100%'}} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="生产单元" rules={[{required:true,message:'请选择生产单元'}]} name='unitId'>
                            <Select
                                className='input'
                                placeholder='请选择'
                                style={{width:'100%'}}
                                onChange={(select:any)=>{
                                    console.log(select)
                                    const list: any = prodUnitList.filter((res: any) => {return res.id === select})
                                    setProductivity(list[0].productivity?list[0].productivity:'')
                                }}
                            >
                                {
                                    prodUnitList.map((item: any, index: number) => {
                                        return (
                                            <Select.Option
                                                key={index}
                                                value={item.id}
                                                disabled={item.isUse}
                                            >{item.name}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="完成天数" rules={[{required:true,message:'请填写完成天数'}]} name='minCompletionDays'>
                            <InputNumber maxLength={10} min={1} style={{width:'100%'}} precision={0} onChange={
                                e=>{
                                    const value = form.getFieldsValue().startTime
                                    if(value){
                                        const newDate = new Date(value)
                                        const endTime =  newDate.setDate(newDate.getDate()+e-1)
                                        form.setFieldsValue({
                                            endTime: moment(endTime)
                                        })
                                    }
                                    
                                }
                            }/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="开始时间" rules={[{required:true,message:'请选择开始时间'}]} name='startTime'>
                            <DatePicker  style={{width:'100%'}} onChange={current=>{
                                const value = form.getFieldsValue().minCompletionDays||0
                                const newDate = current?.format('YYYY-MM-DD')
                                var formatDate2 = new Date(`${newDate}`)
                                const endTime =  formatDate2.setDate(formatDate2.getDate()+value-1)
                                form.setFieldsValue({
                                    endTime: endTime?moment(endTime):''
                                })
                            }}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="结束时间" rules={[{required:true,message:'请选择结束时间'}]} name='endTime'>
                            <DatePicker format="YYYY-MM-DD" style={{width:'100%'}} disabled/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="时间范围">
                            <DatePicker.RangePicker
                                disabledDate={disabledDate}
                                onCalendarChange={(val: any) => setDates(val)}
                                value={value}
                                defaultValue={value}
                                onChange={(value) => {
                                    setValue(value)
                                }}
                                onOpenChange={(open: boolean) => {
                                    if (open) {
                                        setDates([]);
                                        setValue([])
                                    }
                                }}
                            />
                            <Button
                                onClick={() => {
                                    seeLoad(productivity)
                                }}
                            >查看负荷</Button>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="优化检测"  name='useProduc'>
                            <Input defaultValue={'当前排产超最大产力值/产力值空余过多'} maxLength={12} min={0} style={{width:'100%'}} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            {
               params.productCategoryId&&list[0].issuedType=='productCategoryName'?<Table dataSource={TowerList}  rowKey={"userName"}    
                rowSelection={{
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                  }} columns={columns} />:""
            }
            <div id='detailGantt' style={{ width: '100%', height: 300 }}></div>
            </DetailContent>
        </Spin>
    </>
}