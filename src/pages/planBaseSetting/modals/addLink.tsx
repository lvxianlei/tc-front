/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, } from 'react'
import { Button, DatePicker, Input, message, Modal, Select, } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import * as echarts from 'echarts';

const AddLink = (props: any) => {
    let [prodLinkList, setProdLinkList] = useState<any[]>([])
    let [itemInfo, setItemInfo] = useState<any>({})
    useEffect(() => {
        getProdLinkList()
        if (props.id) {
            getDetail()
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
    useEffect(()=>{
        initCharts()
    },[])
    /**
     * @description
     */
    const initCharts = () => {
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
                    data: ['12-08', '12-09', '12-10']
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
            series: [
                {
                    name: 'Baidu',
                    type: 'bar',
                    stack: 'stack',
                    emphasis: {
                        focus: 'series'
                    },
                    data: [130, 320, 60,]
                },
                {
                    name: 'Google',
                    type: 'bar',
                    stack: 'stack',
                    emphasis: {
                        focus: 'series'
                    },
                    data: [120, 132, 101,]
                },
            ]
        });
    }
    return (
        <div className='public_page'>
            <Modal
                className='public_modal_input AddLink'
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
                        <span className='tip' style={{ width: 110, }}>生产环节*：</span>
                        <Select
                            className='input'
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
                    <div className='edit-item'>
                        <span className='tip' style={{ width: 110, }}>占用产力*：</span>
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
                        <span className='tip' style={{ width: 110, }}>生产单元*：</span>
                        <Select
                            className='input'
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
                    <div className='edit-item'>
                        <span className='tip' style={{ width: 110, }}>最小完成天数*：</span>
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
                        <span className='tip' style={{ width: 110, }}>开始时间*：</span>
                        <DatePicker
                            className='input'

                        />
                    </div>
                    <div className='edit-item'>
                        <DatePicker.RangePicker
                            className='input'

                        />
                    </div>
                    <div id='chartsBox' style={{ width: '100%', height: 300 }}></div>
                    <div className='edit-item'>
                        <span className='tip' style={{ width: 110, }}>结束时间*：</span>
                        <DatePicker

                        />
                    </div>
                    <div>
                        <Button>优化检测</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AddLink;

