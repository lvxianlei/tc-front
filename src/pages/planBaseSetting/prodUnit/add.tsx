/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, } from 'react'
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select, } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import * as echarts from 'echarts';
import './prodUnit.less';
import moment from 'moment';
import dayjs from 'dayjs';

const ProdUnitAdd = (props: any) => {
    let [prodLinkList, setProdLinkList] = useState<any[]>([])
    let [itemInfo, setItemInfo] = useState<any>({})
    const [form] = Form.useForm();
    // let [times, setTimes] = useState<string[]>(['', ''])
    const [value, setValue] = useState<any>([moment(dayjs().format('YYYY-MM-DD')), moment(dayjs().add(6, 'day').format('YYYY-MM-DD'))]);
    const [dates, setDates] = useState<any>([]);
    const disabledDate = (current: any) => {
      if (!dates || dates.length === 0) {
        return false;
      }
      const tooLate = dates[0] && current.diff(dates[0], 'days') > 6;
      const tooEarly = dates[1] && dates[1].diff(current, 'days') > 6;
      return tooEarly || tooLate;
    };
    useEffect(() => {
        // times[0] = dayjs().format('YYYY-MM-DD')
        // times[1] = dayjs().add(7, 'day').format('YYYY-MM-DD')
        // setTimes(times)
        // setValue([new Date(), new Date(new Date().setDate(new Date().getDate()+7))])
        getProdLinkList()
        if (props.id) {
            getDetail()
            // initCharts([], [],productivity)
           
        }
    }, [])
    /**
     * @description 获取详情
     */
    const getDetail = async () => {
        const data: any = await RequestUtil.get(`/tower-aps/productionUnit/${props.id}`, {
            current: 1,
            size: 1000,
        })
        data['productionLinkDTOList'] = data['productionLinkVOList'].map((item: { productionLinkId: string }) => {
            return item.productionLinkId
        })
        setItemInfo(data)
        form.setFieldsValue({
            ...data
        })
        if(data){
            seeLoad(data.productivity);
        }
    }
    /**
     * @description 获取生产环节
     */
    const getProdLinkList = async () => {
        const data: any = await RequestUtil.get('/tower-aps/productionLink', {
            current: 1,
            size: 1000,
            unitId: props.id,
        })
        setProdLinkList(data.records)
        
    }
    /**
     * 
     * @param value 
     * @param keey 
     */
    const changeItemInfo = (value: string, key: string) => {
        itemInfo[key] = value
        setItemInfo({ ...itemInfo })
    }
    /**
     * @description 弹窗提交
     */
    const submit = async () => {
        await form.validateFields();
        const value = form.getFieldsValue(true);
        const submitValue = {
            ...value,
            productUnitCode:value.productUnitCode,
            productionLinkDTOList: [
                {
                    productionLinkId: props.id ? value.productionLinkDTOList[0]: value.productionLinkDTOList,
                    productionUnitId: props.id,
                }
            ],
           
        }
        await RequestUtil.post('/tower-aps/productionUnit', {
            ...submitValue,
        })
        message.success('操作成功')
        props.cancelModal(true)
        // if(itemInfo.productivity&&itemInfo.name&&itemInfo['productionLinkDTOList']&&itemInfo['productionLinkDTOList'].length>0){
        //     itemInfo['productionLinkDTOList'] = itemInfo['productionLinkDTOList'].map((item: string) => {
        //         return {
        //             productionLinkId: item,
        //             productionUnitId: props.id
        //         }
        //     })
        //     await RequestUtil.post('/tower-aps/productionUnit', {
        //         ...itemInfo,
        //     })
        //     message.success('操作成功')
        //     props.cancelModal(true)
        // }else{
        //     message.error('必填项未填写，不可提交！')
        // }
        
    }
    /**
     * @description
     */
    const seeLoad = async (max:number) => {
        // if (!times[0]) {
        //     message.error('请选择时间范围')
        //     return
        // }
        if (!value||value.length===0) {
            message.error('请选择时间范围')
            return
        }
        let data: any = await RequestUtil.get('/tower-aps/productionUnit/load', {
            id: props.id,
            startTime: value[0].format('YYYY-MM-DD'),
            endTime: value[1].format('YYYY-MM-DD'),
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
    /**
     * @description
     */
    const initCharts = (dates: string[], datas: any[]) => {
        const myChart = echarts.init((document as HTMLElement | any).getElementById('chartsBox'));
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
    const formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 20 }
    };
    return (
        <div className='public_page'>
            <Modal
                getContainer={false}
                className='public_modal_input ProdUnitAdd'
                title={props.id ? '编辑' : '新增'}
                // visible={isModal}
                visible={true}
                onOk={() => {
                    submit()
                }}
                onCancel={() => {
                    props.cancelModal()
                }}
                width={1000}
                cancelText='取消'
                okText='确定'
            >
                {/* <div>
                    <div className='edit-item'>
                        <span className='tip' style={{ width: 110, }}>生产单元名称*：</span>
                        <Input
                            className='input'
                            maxLength={24}
                            defaultValue={itemInfo['name']}
                            onChange={(ev) => {
                                changeItemInfo(ev.target.value.trim(), 'name')
                            }}
                            placeholder='请输入'
                        />
                    </div>
                    <div className='edit-item'>
                        <span className='tip' style={{ width: 110, }}>产力值*：</span>
                        <Input
                            className='input'
                            maxLength={12}
                            defaultValue={itemInfo['productivity']}
                            onChange={(ev) => {
                                // changeItemInfo(ev.target.value.replace(/[^0-9]/ig, ""), 'productivity')
                            }}
                            placeholder='请输入'
                        />
                    </div>
                    <div className='edit-item'>
                        <span className='tip' style={{ width: 110, }}>关联生产环节*：</span>
                        <Select
                            className='input'
                            placeholder='请选择'
                            defaultValue={itemInfo['productionLinkDTOList'] || []}
                            mode='multiple'
                            maxTagCount={10}
                            searchValue=''
                            onChange={(value) => {
                                changeItemInfo(value, 'productionLinkDTOList')
                            }}
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
                    </div>
                </div> */}
                <Form form={ form } {...formItemLayout}>
                    <Row>
                        <Col  span={24}>
                            <Form.Item label="生产单元名称" rules={[{required:true, message:'请填写生产单元名称'},]} name='name'>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24}>
                            {/* <Form.Item label="生产环节编码" rules={[{required:true,message:'请选择生产环节编码'}]} name='productionLinknum'>
                                <Select
                                    className='input'
                                    placeholder='请选择' */}
                                    {/* // onChange={(value) => { */}
                                    {/* //     changeItemInfo(value, 'productionLinkDTOList')
                                    // }} */}
                                {/* > */}
                                     {/* <Select.Option value={1}>德汇</Select.Option>
                                     <Select.Option value={2}>汇金通</Select.Option> */}
                                    {/* {
                                        prodLinkList.map((item: any, index: number) => {
                                            return (
                                                <Select.Option
                                                    key={index}
                                                    value={item.id}
                                                    disabled={item.isUse}
                                                >{item.name}</Select.Option>
                                            )
                                        })
                                    } */}
                                {/* </Select>
                            </Form.Item> */}
                            <Form.Item label="生产单元编码" rules={[{required:true,pattern: new RegExp(/[0-9a-z]{1,20}$/),message:'请输入数字与字母'},{max:20,message:"最多只能输入20个字符与数字"}]} name='productUnitCode'>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24}>
                            <Form.Item label="产力值" rules={[{required:true,message:'请填写产力值'}]} name='productivity'>
                                <InputNumber maxLength={12} min={0} style={{width:'100%'}} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24}>
                            <Form.Item label="关联生产环节" rules={[{required:true,message:'请选择关联生产环节'}]} name='productionLinkDTOList'>
                                <Select
                                    className='input'
                                    placeholder='请选择'
                                    // mode='multiple'
                                    maxTagCount={10}
                                    searchValue=''
                                    // onChange={(value) => {
                                    //     changeItemInfo(value, 'productionLinkDTOList')
                                    // }}
                                    disabled={props.id?true:false}
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
                    <Col span={24}>
                        <Form.Item label="时间范围" hidden={!props.id}>
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
                                    seeLoad(itemInfo.productivity)
                                }}
                            >查看负荷</Button>
                        </Form.Item>
                    </Col>
                    </Row>
                </Form>
                <div id='chartsBox' style={{ width: '100%', height: 300 }} hidden={!props.id}></div>
            </Modal>
        </div>
    )
}

export default ProdUnitAdd;

