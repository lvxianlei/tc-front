/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, } from 'react'
import { Button, DatePicker, Input, message, Modal, Select, } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import * as echarts from 'echarts';
import './prodUnit.less';
import moment from 'moment';
import dayjs from 'dayjs';

const ProdUnitAdd = (props: any) => {
    let [prodLinkList, setProdLinkList] = useState<any[]>([])
    let [itemInfo, setItemInfo] = useState<any>({})
    // let [times, setTimes] = useState<string[]>(['', ''])
    const [value, setValue] = useState<any>([moment(dayjs().format('YYYY-MM-DD')), moment(dayjs().add(7, 'day').format('YYYY-MM-DD'))]);
    const [dates, setDates] = useState<any>([]);
    const disabledDate = (current: any) => {
      if (!dates || dates.length === 0) {
        return false;
      }
      const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
      const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
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
            initCharts([], [])
            if(value){
                seeLoad();
            }
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
        if(itemInfo.productivity&&itemInfo.name&&itemInfo['productionLinkDTOList']&&itemInfo['productionLinkDTOList'].length>0){
            itemInfo['productionLinkDTOList'] = itemInfo['productionLinkDTOList'].map((item: string) => {
                return {
                    productionLinkId: item,
                    productionUnitId: props.id
                }
            })
            await RequestUtil.post('/tower-aps/productionUnit', {
                ...itemInfo,
            })
            message.success('操作成功')
            props.cancelModal(true)
        }else{
            message.error('必填项未填写，不可提交！')
        }
        
    }
    /**
     * @description
     */
    const seeLoad = async () => {
        // if (!times[0]) {
        //     message.error('请选择时间范围')
        //     return
        // }
        if (!value) {
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
                    name: '已排产',
                    type: 'bar',
                    stack: 'stack',
                    emphasis: {
                        focus: 'series'
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
                    data: []
                },
                {
                    name: '待确认',
                    type: 'bar',
                    stack: 'stack',
                    emphasis: {
                        focus: 'series'
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
                        res.data.push(0)
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
                    type: 'value'
                }
            ],
            series:datas,
        });
    }
    return (
        <div className='public_page'>
            <Modal
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
                <div>
                    <div className='edit-item'>
                        <span className='tip' style={{ width: 110, }}>生产单元名称*：</span>
                        <Input
                            className='input'
                            maxLength={24}
                            value={itemInfo['name']}
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
                            value={itemInfo['productivity']}
                            onChange={(ev) => {
                                changeItemInfo(ev.target.value.replace(/[^1-9]/ig, ""), 'productivity')
                                console.log(itemInfo)
                            }}
                            placeholder='请输入'
                        />
                    </div>
                    <div className='edit-item'>
                        <span className='tip' style={{ width: 110, }}>关联生产环节*：</span>
                        <Select
                            className='input'
                            placeholder='请选择'
                            value={itemInfo['productionLinkDTOList'] || []}
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
                </div>
                <div className='see' hidden={!props.id}>
                    <Button
                        onClick={() => {
                            seeLoad()
                        }}
                    >查看负荷</Button>
                    <DatePicker.RangePicker
                        disabledDate={disabledDate}
                        onCalendarChange={(val: any) => setDates(val)}
                        defaultValue={value}
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
                </div>
                <div id='chartsBox' style={{ width: '100%', height: 300 }} hidden={!props.id}></div>
            </Modal>
        </div>
    )
}

export default ProdUnitAdd;

