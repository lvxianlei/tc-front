import useRequest from '@ahooksjs/use-request';
import { Button, Modal, Spin, Table } from 'antd';
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap';
import React, { useEffect, useState } from 'react'
import RequestUtil from '../../../../utils/RequestUtil';
import styles from './Statements.module.less';

  
 
export default function Statements(): React.ReactNode {
      const [isFull, setIsFull] = useState<boolean>(false)
      const [detail, setDetail] = useState<any>({})
      useEffect(() => {
          initCharts();
      })
      const { loading, run } = useRequest<any>((date: string) => new Promise(async (resole, reject) => {
        try {
            getUserData()
            getProvinceBarData()
            resole({})
        } catch (error) {
            reject(error)
        }
      }), {})
     const { data: provinceBarData, run: getProvinceBarData } = useRequest<any>((date: string) => new Promise(async (resole, reject) => {
        try {
            const value: any = await RequestUtil.get<any>(`/tower-as/workclock/province`);
            resole(value)
        } catch (error) {
            reject(error)
        }
      }), {})
      const { data:userData, run: getUserData } = useRequest<any>((date: string) => new Promise(async (resole, reject) => {
        try {
            const value: any = await RequestUtil.get<any>(`/tower-as/workclock/person`);
            resole(value)
        } catch (error) {
            reject(error)
        }
      }), {})

 
 
    const { data:projectData, run: getProjectData } = useRequest<any>((afterSaleUser: string) => new Promise(async (resole, reject) => {
      try {
          const value: any = await RequestUtil.get<any>(`/tower-as/workOrder?current=1&size=10000&afterSaleUserId=${afterSaleUser}`);
          setIsFull(true)
          resole([{}])
      } catch (error) {
          reject(error)
      }
    }), {manual:true})
 
 
    const convertData = function () {
        const value = userData?.map((item:any)=>{
          return {
              ...item,
              name: item.userName,
              value: item?.lonLat.split(',').concat(`${item?.address}`),
              userId: item.userId
            }
           
        })
        return value;
    };

    const option = {
        backgroundColor:'transparent',
        tooltip: {
          trigger: 'item',
        },
        bmap: {
          center: [118.114129, 37.550339],
          zoom: 5,
          mapStyle: {
            style:'bluish'
          }
        },
        series: [
          {
            name: '',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: convertData(),
            encode: {
              value: 2
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: true
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: '#333'
            },
            emphasis: {
              scale: true
            },
            zlevel: 1
          }
        ]
      }
 
     const initCharts = () => {
         (document as HTMLElement | any).getElementById('LoftingStatisticalAnalysis').removeAttribute("_echarts_instance_");
         const myChart = echarts.init((document as HTMLElement | any).getElementById('LoftingStatisticalAnalysis'));

         // 绘制图表
         myChart.setOption(option);
         myChart.on("click", function (e:any) {
          console.log(e)    //  每个标识点的信息
          setDetail(e)
          getProjectData(e?.data?.userId)
          // e.event.stop()
        },false);
        (document as HTMLElement | any).getElementById('distribution').removeAttribute("_echarts_instance_");
         const myDisChart = echarts.init((document as HTMLElement | any).getElementById('distribution'));

         // 绘制图表
         myDisChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // Use axis to trigger tooltip
              type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
          },
          legend: {
            right: 0,
            textStyle:{
              color:'#fff'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisLabel:{
                color: '#fff'
          },
          },
          yAxis: {
            type: 'category',
            axisLine:{
                lineStyle:{
                  color: '#fff'
                }
            },
            data: provinceBarData?.map((item:any)=>{return item.province})
          },
          series: [
            {
              name: '数量',
              type: 'bar',
              stack: 'total',
              label: {
                show: true
              },
              emphasis: {
                focus: 'series'
              },
              data: provinceBarData?.map((item:any)=>{return item.count})
            }
          ]
        })
     }
 
     const chartsContent = (): React.ReactNode => {
         return <div className={styles.statement} id={'statement'}>
             <div className={styles.header}>
                 <div className={styles.headerbg}>
                     <span className={styles.headerTitle}>汇金通售后资源网络分布图</span>
                 </div>
                 {/* <Button type="primary" onClick={() => setIsFull(!isFull)} className={styles.fullBtn} size='small' ghost>{isFull ? '退出全屏' : '全屏'}</Button> */}
             </div>
             <div className={styles.top}>
                 <div className={styles.left}>
                     {/* <div>
                         <span className={styles.title}>放样统计分析</span>
                     </div> */}
                     <div id={'LoftingStatisticalAnalysis'} style={{ width: '100%', height: '780px' }} key={'LoftingStatisticalAnalysis'} />

                 </div>
                 <div className={styles.right}>
                    {isFull&&<div className={styles.rightTop}>
                        <div className={styles.title}>点击数据</div>
                        <div style={{color:'#fff',margin:'10px 0px',marginBottom:'20px'}}>
                          <div>名称：{detail?.data?.userName}</div>
                          <div>地址：{detail?.data?.address}</div>
                          {
                              projectData && projectData.map((res: any, index: number) => (
                                  <div>工程名称：{res?.projectName}</div>
                              ))
                          }
                        </div>
                            
                    </div>}
                    <div className={styles.rightTop}>
                      <div className={styles.title}>地区人员分布图</div>
                      <div id={'distribution'} style={{ width: '100%', height: '300px' }} key={'distribution'} />
                    </div>
                </div>
             </div>
             
         </div>
     }
 
     return <Spin spinning={false}>
         {
             
                 <>{chartsContent()}</>
         }
 
     </Spin>
 }