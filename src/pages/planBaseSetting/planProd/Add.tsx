import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, Input, message, InputNumber, TableColumnProps, Table } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import moment from 'moment';
import * as echarts from 'echarts';
import { IAnnouncement } from '../../announcement/AnnouncementMngt';
import dayjs from 'dayjs';

export default function RecruitEdit(): React.ReactNode {
    const columns: TableColumnProps<object>[] = [
        {
            title: '杆塔号',
            dataIndex: 'productNumber',
        },
        {
            title: '杆塔要求完成时间',
            dataIndex: 'completionTime',
            render:(time:string)=>{
                return time?moment(time).format('YYYY-MM-DD'):'-'
            }
        },

    ]

    const history = useHistory()
    const params = useParams<{ id: string, productCategoryId: string, planId: string }>();
    const [form] = Form.useForm();
    const [type,setType]=useState<any>();
    const [productivity, setProductivity] = useState<any>('');
    const [value, setValue] = useState<any>([moment(dayjs().format('YYYY-MM-DD')), moment(dayjs().add(6, 'day').format('YYYY-MM-DD'))]);
    const [dates, setDates] = useState<any>([]);
    const [towerData, setTowerData] = useState<any>({});
    const [prodLinkList, setProdLinkList] = useState<any[]>([])
    const [prodUnitList, setProdUnitList] = useState<any[]>([])
    const [towerList, setTowerList] = useState<any[]>([])
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IAnnouncement[]>([]);
    const [typenum,settypenum]=useState<any>(1)
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IAnnouncement[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = params.productCategoryId && await RequestUtil.get(`/tower-aps/planUnitLink/${params.productCategoryId}`);
        params.productCategoryId && setTowerData(data)
        if(params.productCategoryId){
            getProdLinkList(data?.linkId);
        }else{
            getProdLinkList();
        }
        params.productCategoryId &&settypenum(data.status)
        // getProdUnitList();
        const value: any = params.productCategoryId && await RequestUtil.get('/tower-aps/productionUnit', {
            current: 1,
            size: 1000,
            productionLinkId: data.linkId
        })
        params.productCategoryId && setProdUnitList(value.records)
        const listValue: any = params.productCategoryId && value.records.length > 0 && value.records.filter((res: any) => { return res.id === data?.unitId })
        console.log(listValue)
        params.productCategoryId && setProductivity(listValue[0]?.productivity?listValue[0].productivity:'')
        params.productCategoryId&& seeLoad(listValue[0]?.productivity, data.unitId)
        
        form.setFieldsValue(params.productCategoryId ? {
            ...data,
            startTime: data?.startTime ? moment(data?.startTime) : '',
            endTime: data?.startTime && data.minCompletionDays ? moment(new Date(data?.startTime).setDate(new Date(data?.startTime).getDate() + data.minCompletionDays)) : '',
        } : {})
        resole(data)
    }), {})
    const disabledDate = (current: any) => {
        if (!dates || dates.length === 0) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
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
    const getProdLinkList = async (linkId?: string) => {
        const data: any = await RequestUtil.get('/tower-aps/productionLink', {
            current: 1,
            size: 1000
        })
        setProdLinkList(data.records)
        const value = linkId && data.records.filter((item:any)=>{
            return item.id === linkId
        })
        linkId && value && value.length>0 && setType(value[0].issuedType)

        params.productCategoryId && value.length>0 && value[0]?.issuedType == 'towerName' && getProdLinkLists()
    }

    /**
       * @description 下发
       */
    const culIssue = async () => {
        if(towerList.length>0){
            if(selectedRows.length>0){
                const value:any[] = selectedRows.filter((item:any)=>{
                    return item.productStatus !== 1
                }).map((item:any)=>{
                    return item.id
                })
                if (value.length > 0) {
                    RequestUtil.post('/tower-aps/planUnitLink/issue', {
                        id: params.productCategoryId,
                        productIds: value
                    }).then(() => {
                        message.success("下发成功")
                        history.push(`/planProd/planMgmt/detail/${params.id}/${params.planId}`)
                    })
                } else{
                    message.error("至少选取一个塔型！")
                }
            }
            else {
                message.error("至少选取一个塔型！")
            }
        }else{
            RequestUtil.post('/tower-aps/planUnitLink/issue', {
                id: params.productCategoryId,
                productIds:[]
            }).then((res) => {
                message.success("下发成功")
                history.push(`/planProd/planMgmt/detail/${params.id}/${params.planId}`)
            })
        }


    }
    // /**
    //      * @description 获取生产单元
    //      */
    // const getProdUnitList = async () => {
    //     const data: any = await RequestUtil.get('/tower-aps/productionUnit', {
    //         current: 1,
    //         size: 1000
    //     })
    //     setProdUnitList(data.records)
    // }

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
   * @description 获取杆塔明细
   */
    const getProdLinkLists = async () => {
        const data: any = await RequestUtil.get(`/tower-aps/planUnitLink/product?id=${params.productCategoryId}`)
        setTowerList(data)
        let ids = data.filter((item: any) => { return item.productStatus === 1 }).map((item:any)=>{
            return item.id
        })
        setSelectedKeys(ids);
    }
    /**
     * @description
     */
    const seeLoad = async (max?: number, id?: any) => {
        // if (!times[0]) {
        //     message.error('请选择时间范围')
        //     return
        // }
        if (!value || value.length === 0) {
            message.error('请选择时间范围')
            return
        }
        let data: any = await RequestUtil.get('/tower-aps/productionUnit/load', {
            id: form.getFieldsValue().unitId ? form.getFieldsValue().unitId : id,
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
                            name: '产力值',
                            yAxis: max
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
                            name: '产力值',
                            yAxis: max
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
                            name: '产力值',
                            yAxis: max
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
            (data.loadList || []).forEach((item: { productivityList: any }, index: any) => {
                datas.map((res: any, i: number) => {
                    if (item?.productivityList?.length > 0 && res.name === item.productivityList[i].statusName) {
                        res.data.push(item.productivityList[i].productivity || 0)
                    } else {
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
            series: datas,
        });
    }
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space>
                    {
                        typenum && typenum!==2 &&
                   
                        <Button type="primary" onClick={() => {
                            form.validateFields().then(async res => {
                                await form.validateFields();
                                const value = form.getFieldsValue(true);
                                const submitValue = {
                                    ...value,
                                    planId: params.planId,
                                    planProductCategoryId: params.id,
                                    startTime: value.startTime ? moment(value.startTime).format('YYYY-MM-DD') : undefined,
                                    endTime: value.endTime ? moment(value.endTime).format('YYYY-MM-DD') : undefined,

                                }
                                RequestUtil.post(`/tower-aps/planUnitLink`, submitValue).then(() => {
                                    message.success('保存成功！')
                                }).then(() => {
                                    history.push(`/planProd/planMgmt/detail/${params.id}/${params.planId}`)
                                })
                            })

                        }}>保存</Button> 
                    }
                    {
                        params.productCategoryId &&typenum&&typenum==2&& <Button onClick={() => culIssue() } type='primary'>下发</Button>
                    }

                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
                <DetailTitle title={params.productCategoryId ? "编辑环节" : "新增环节"} />
                <Form form={form} {...formItemLayout}>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="生产环节" rules={[{ required: true, message: '请选择生产环节' }]} name='linkId'>
                                <Select
                                    className='input'
                                    placeholder='请选择'
                                    style={{ width: '100%' }}
                                    onChange={async (value) => {
                                        const list = prodLinkList.filter((item, index) => {
                                            return item.id === value
                                        })
                                       
                                        if (params.productCategoryId) {
                                            if (list[0].issuedType == 'towerName') {
                                                setType(list[0].issuedType)
                                                await getProdLinkLists()
                                            }else{
                                                setType(list[0].issuedType)
                                                setTowerList([])
                                            }
                                        }
                                        getProdUnitList(value)

                                    }}
                                    disabled={params.productCategoryId &&typenum&&typenum==2}
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
                            <Form.Item label="占用产力" rules={[{ required: true, message: '请填写占用产力' }]} name='useProductivity'>
                                <InputNumber maxLength={12} min={0} style={{ width: '100%' }} disabled={params.productCategoryId &&typenum&&typenum==2}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="生产单元" rules={[{ required: true, message: '请选择生产单元' }]} name='unitId'>
                                <Select
                                    className='input'
                                    placeholder='请选择'
                                    style={{ width: '100%' }}
                                    disabled={params.productCategoryId &&typenum&&typenum==2}
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
                            <Form.Item label="最小完成天数" rules={[{ required: true, message: '请填写最小完成天数' }]} name='minCompletionDays'>
                                <InputNumber maxLength={10} min={0} style={{ width: '100%' }} onChange={
                                    e => {
                                        const value = form.getFieldsValue().startTime
                                        if (value) {
                                            const newDate = new Date(value)
                                            const endTime = newDate.setDate(newDate.getDate() + e-1)
                                            form.setFieldsValue({
                                                endTime: moment(endTime)
                                            })
                                        }

                                    }
                                } disabled={params.productCategoryId &&typenum&&typenum==2}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]} name='startTime'>
                                <DatePicker style={{ width: '100%' }} onChange={current => {
                                    const value = form.getFieldsValue().minCompletionDays || 0
                                    const newDate = current?.format('YYYY-MM-DD')
                                    var formatDate2 = new Date(`${newDate}`)
                                    const endTime = formatDate2.setDate(formatDate2.getDate() + value-1)
                                    form.setFieldsValue({
                                        endTime: moment(endTime)
                                    })
                                }} disabled={params.productCategoryId &&typenum&&typenum==2}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="结束时间" rules={[{ required: true, message: '请选择结束时间' }]} name='endTime'>
                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} disabled />
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
                            <Form.Item label="优化检测" name='useProduc'>
                                <Input value={'当前排产超最大产力值/产力值空余过多'} maxLength={12} min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* <Row>
                    <Col span={12}>
                        <Form.Item label="负荷">
                            <DatePicker.RangePicker
                                disabledDate={disabledDate}
                                onCalendarChange={(val: any) => setDates(val)}
                                value={value}
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
                </Row> */}
                </Form>
                {
                    params.productCategoryId && type && type == 'towerName' ? <Table dataSource={towerList} rowKey="id"
                        rowSelection={{
                            selectedRowKeys: selectedKeys,
                            onChange: SelectChange,
                            getCheckboxProps: (record: any) => {
                                return ({
                                    ...record,
                                    disabled: record.productStatus === 1?true:false
                                })
                            },
                        }} columns={columns}  pagination={false}/> : ""
                }
                <div id='detailGantt' style={{ width: '100%', height: 300 }}></div>
            </DetailContent>
        </Spin>
    </>
}