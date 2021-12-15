import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, Input, message, InputNumber} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import moment from 'moment';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

export default function RecruitEdit(): React.ReactNode {
    
    const history = useHistory()
    const params = useParams<{ id: string, productCategoryId: string, planId: string }>();
    const [form] = Form.useForm();
    const [value, setValue] = useState<any>([moment(dayjs().format('YYYY-MM-DD')), moment(dayjs().add(6, 'day').format('YYYY-MM-DD'))]);
    const [dates, setDates] = useState<any>([]);
    const [ prodLinkList, setProdLinkList] = useState<any[]>([])
    const [ prodUnitList, setProdUnitList] = useState<any[]>([])
    const [ detail, setDetail] = useState<any>({})
    const [productivity, setProductivity] = useState<any>('');
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = params.productCategoryId && await RequestUtil.get(`/tower-aps/planUnitLink/${params.productCategoryId}`);
        getProdLinkList();
        getProdUnitList();
        setDetail(data)
        form.setFieldsValue( params.productCategoryId?{
            ...data,
            startTime: data?.startTime?moment(data?.startTime):'',
            endTime: data?.startTime && data.minCompletionDays?moment(new Date( data?.startTime).setDate(new Date( data?.startTime).getDate()+ data.minCompletionDays-1)):'',
        }:{})
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

    let detailData: any = data;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    /**
     * @description 获取生产环节
     */
    const getProdLinkList = async () => {
        const data: any = await RequestUtil.get('/tower-aps/productionLink', {
            current: 1,
            size: 1000
        })
        setProdLinkList(data.records)
    }
    /**
     * @description 获取生产单元
     */
    const getProdUnitList = async () => {
        const list: any = await RequestUtil.get('/tower-aps/productionUnit', {
            current: 1,
            size: 1000
        })
        setProdUnitList(list.records)
        const listValue: any = list.records.length>0?list.records.filter((res: any) => {return res.id === detail.unitId}):[{}]
        setProductivity(listValue[0].productivity?listValue[0].productivity:'')
        seeLoad(listValue[0].productivity)
    }

    /**
     * @description
     */
     const seeLoad = async (max: any) => {
        // if (!times[0]) {
        //     message.error('请选择时间范围')
        //     return
        // }
        if (!value) {
            message.error('请选择时间范围')
            return
        }
        let data: any = await RequestUtil.get('/tower-aps/productionUnit/load', {
            id: form.getFieldsValue().unitId,
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
                    name: '已排产',
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
                    name: '已反馈',
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
                    name: '待确认',
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
                    type: 'value'
                }
            ],
            series:datas,
        });
    }
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space> 
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
            <DetailTitle title="查看环节"/>
            <Form form={ form } { ...formItemLayout }>
                <Row>
                    <Col span={12}>
                        <Form.Item label="生产环节" rules={[{required:true,message:'请选择生产环节'}]} name='linkId'>
                            <Select
                                className='input'
                                placeholder='请选择'
                                style={{width:'100%'}}
                                disabled={params.productCategoryId? true : false}
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
                            <InputNumber maxLength={12} min={0} style={{width:'100%'}} disabled={params.productCategoryId? true : false}/>
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
                                disabled={params.productCategoryId? true : false}
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
                        <Form.Item label="最小完成天数" rules={[{required:true,message:'请填写最小完成天数'}]} name='minCompletionDays'>
                            <InputNumber maxLength={10} min={0} style={{width:'100%'}} onChange={
                                e=>{
                                    const value = form.getFieldsValue().startTime
                                    if(value){
                                        const newDate = new Date(value)
                                        const endTime =  newDate.setDate(newDate.getDate()+e)
                                        form.setFieldsValue({
                                            endTime: moment(endTime)
                                        })
                                    }
                                    
                                }
                            
                            } disabled={params.productCategoryId? true : false}/>
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
                                const endTime =  formatDate2.setDate(formatDate2.getDate()+value)
                                form.setFieldsValue({
                                    endTime: moment(endTime)
                                })
                            }} disabled={params.productCategoryId? true : false}/>
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
                        <Form.Item label="负荷">
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
            </Form>
            
            <div id='detailGantt' style={{ width: '100%', height: 300 }}></div>
            </DetailContent>
        </Spin>
    </>
}