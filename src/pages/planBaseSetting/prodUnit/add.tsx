/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, } from 'react'
import { Button, DatePicker, Form, Input, message, Modal, Select, } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import * as echarts from 'echarts';
import './prodUnit.less';
import moment from 'moment';

const ProdUnitAdd = (props: any) => {
    let [prodLinkList, setProdLinkList] = useState<any[]>([])
    let [itemInfo, setItemInfo] = useState<any>({})
    let [times, setTimes] = useState<string[]>(['', ''])
    useEffect(() => {
        getProdLinkList()
        if (props.id) {
            getDetail()
            initCharts([],[])
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
    }
    /**
     * @description
     */
    const seeLoad = async () => {
        if (!times[0]) {
            message.error('请选择时间范围')
            return
        }
        let data: any = await RequestUtil.get('/tower-aps/productionUnit/load', {
            id: props.id,
            startTime: times[0] ? `${times[0]} 00:00:00` : null,
            endTime: times[1] ? `${times[1]} 23:59:59` : null,
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
                    data: [130, 320, 60, 10]
                },
                {
                    name: '已反馈',
                    type: 'bar',
                    stack: 'stack',
                    emphasis: {
                        focus: 'series'
                    },
                    data: [120, 132, 101, 10]
                },
                {
                    name: '待确认',
                    type: 'bar',
                    stack: 'stack',
                    emphasis: {
                        focus: 'series'
                    },
                    data: [130, 320, 60, 10]
                },
                {
                    name: '已锁定',
                    type: 'bar',
                    stack: 'stack',
                    emphasis: {
                        focus: 'series'
                    },
                    data: [120, 132, 101, 10]
                },
            ];
            (data.loadList || []).forEach((item: { productivityList: { forEach: (arg0: (e: any, i: string) => void) => void; }; }, index: any) => {
                item.productivityList.forEach((e: any, i: string) => {
                    datas[i].data.push(e.productivity)
                });
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
            // color: '#FF8C00',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
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
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            series: datas,
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
                            maxLength={100}
                            value={itemInfo['productivity']}
                            onChange={(ev) => {
                                changeItemInfo(ev.target.value.replace(/[^0-9]/ig, ""), 'productivity')
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
                        value={times[0] ? [moment(times[0]), moment(times[1])] : null}
                        onChange={(value, valueString) => {
                            setTimes(valueString)
                        }}
                    />
                </div>
                <div id='chartsBox' style={{ width: '100%', height: 300 }} hidden={!props.id}></div>
            </Modal>
        </div>
    )
}

export default ProdUnitAdd;

