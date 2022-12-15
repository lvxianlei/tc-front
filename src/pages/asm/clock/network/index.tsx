import useRequest from '@ahooksjs/use-request';
import { Button, Modal, Spin } from 'antd';
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap';
import React, { useEffect, useState } from 'react'
import RequestUtil from '../../../../utils/RequestUtil';
import styles from './Statements.module.less';
import { China } from './china.json';

export default function Statements(): React.ReactNode {
  const [isFull, setIsFull] = useState<boolean>(false)
  const [isClick, setIsClick] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>({})
  useEffect(() => {
    echarts.registerMap('china', (China) as any);
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
  const { data: userData, run: getUserData } = useRequest<any>((date: string) => new Promise(async (resole, reject) => {
    try {
      const value: any = await RequestUtil.get<any>(`/tower-as/workclock/person`);
      resole(value?.map((item: any) => {
        return {
          ...item,
          number: Number(item?.number)
        }
      }))
    } catch (error) {
      reject(error)
    }
  }), {})



  const { data: projectData, run: getProjectData } = useRequest<any>((afterSaleUser: string) => new Promise(async (resole, reject) => {
    try {
      const value: any = await RequestUtil.get<any>(`/tower-as/workOrder?current=1&size=10000&afterSaleUserId=${afterSaleUser}&isClose=0`);
      setIsClick(true)
      resole(value?.records)
    } catch (error) {
      reject(error)
    }
  }), { manual: true })


  const convertData = function (data: any[]) {
    const value = data?.map((item: any) => {
      return {
        ...item,
        name: item.userName,
        value: item?.lonLat.split(',').concat(`${item?.number}`),
        userId: item.userId
      }

    })
    return value;
  };
  const option = {
    tooltip: {
      trigger: 'item',

    },
    backgroundColor: '#050224',
    geo: {
      type: 'map',
      map: 'china', //'jiangxi'
      roam: true,
      geoIndex: 1,
      center: [107.47, 35.71],
      aspectScale: 0.8,
      zoom: 1.6,  //地图的比例
      label: {
        normal: {
          show: true,
          textStyle: {
            color: '#B49167'  //字体颜色
          }
        },
        emphasis: {
          textStyle: {
            color: '#B49167'  //选中后的字体颜色
          }
        }
      },
      itemStyle: {
        normal: {
          areaColor: '#13076E',
          borderColor: '#B49167',
        },
        emphasis: {
          areaColor: '#13076E',
        }
      },
    },
    series: [
      {
        name: '工程量',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(userData?.filter((item: any) => {
          return item.number === 0
        })),
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
          show: true,
          color: '#fff'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: '#333',
          color: '#79F68B'
        },
        emphasis: {
          scale: true
        },
      },
      {
        name: '工程量',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(userData?.filter((item: any) => {
          return item.number > 0 && item.number < 3
        })),
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
          color: '#fff',
          show: true
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: '#333',
          color: '#04D0FA'
        },
        emphasis: {
          scale: true
        },
      },
      {
        name: '工程量',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(userData?.filter((item: any) => {
          return item.number > 2 && item.number < 5
        })),
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
          color: '#fff',
          show: true
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: '#333',
          color: '#F1F556'
        },
        emphasis: {
          scale: true
        },
      },
      {
        name: '工程量',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(userData?.filter((item: any) => {
          return item.number > 4
        })),
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
          color: '#fff',
          show: true
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: '#333',
          color: '#FA2B0A'
        },
        emphasis: {
          scale: true
        },
      }
    ]
  }
  // const option = {
  //     // backgroundColor:'transparent',
  //     tooltip: {
  //       trigger: 'item',
  //     },
  //     bmap: {
  //       // center: [118.114129, 37.550339],
  //       zoom: 5,
  //       mapStyle: {
  //         styleJson:[{
  //           "featureType": "land",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "color": "#00246dff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "water",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#1a11b6ff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "building",
  //           "elementType": "geometry.fill",
  //           "stylers": {
  //               "color": "#22191dff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "building",
  //           "elementType": "geometry.stroke",
  //           "stylers": {
  //               "color": "#130704ff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "water",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "color": "#010133ff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "village",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "town",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "district",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "country",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "city",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "continent",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "poilabel",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "poilabel",
  //           "elementType": "labels.icon",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "scenicspotslabel",
  //           "elementType": "labels.icon",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "scenicspotslabel",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "transportationlabel",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "transportationlabel",
  //           "elementType": "labels.icon",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "airportlabel",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "airportlabel",
  //           "elementType": "labels.icon",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "geometry.fill",
  //           "stylers": {
  //               "color": "#9b633fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "geometry.stroke",
  //           "stylers": {
  //               "color": "#7d4017ff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "weight": 3
  //           }
  //       }, {
  //           "featureType": "green",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "color": "#b49167ff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "scenicspots",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "color": "#2d252cff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "scenicspots",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "scenicspots",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "weight": 1,
  //               "color": "#765e4eff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "continent",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "country",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "city",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "city",
  //           "elementType": "labels.icon",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "scenicspotslabel",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "airportlabel",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "transportationlabel",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "railway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "subway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "highwaysign",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "nationalwaysign",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "nationalwaysign",
  //           "elementType": "labels.icon",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "provincialwaysign",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "provincialwaysign",
  //           "elementType": "labels.icon",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "tertiarywaysign",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "tertiarywaysign",
  //           "elementType": "labels.icon",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "subwaylabel",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "subwaylabel",
  //           "elementType": "labels.icon",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on",
  //               "weight": 90
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "shopping",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "scenicspots",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "scenicspotslabel",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "manmade",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "manmade",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "highwaysign",
  //           "elementType": "labels.icon",
  //           "stylers": {
  //               "visibility": "off"
  //           }
  //       }, {
  //           "featureType": "water",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#d4ab7900",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "road",
  //           "elementType": "labels.text",
  //           "stylers": {
  //               "fontsize": 24
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "geometry.fill",
  //           "stylers": {
  //               "color": "#9b633fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "geometry.stroke",
  //           "stylers": {
  //               "color": "#1c4f7eff"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "weight": 3
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "geometry.fill",
  //           "stylers": {
  //               "color": "#9b633fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "geometry.stroke",
  //           "stylers": {
  //               "color": "#1c4f7eff"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "weight": 3
  //           }
  //       }, {
  //           "featureType": "provincialway",
  //           "elementType": "geometry.fill",
  //           "stylers": {
  //               "color": "#9b633fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "geometry.fill",
  //           "stylers": {
  //               "color": "#9b633fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "arterial",
  //           "elementType": "geometry.fill",
  //           "stylers": {
  //               "color": "#9b633fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "tertiaryway",
  //           "elementType": "geometry.fill",
  //           "stylers": {
  //               "color": "#9b633fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "fourlevelway",
  //           "elementType": "geometry.fill",
  //           "stylers": {
  //               "color": "#9b633fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "local",
  //           "elementType": "geometry.fill",
  //           "stylers": {
  //               "color": "#9b633fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "provincialway",
  //           "elementType": "geometry.stroke",
  //           "stylers": {
  //               "color": "#7d4017ff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "geometry.stroke",
  //           "stylers": {
  //               "color": "#7d4017ff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "arterial",
  //           "elementType": "geometry.stroke",
  //           "stylers": {
  //               "color": "#7d4017ff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "tertiaryway",
  //           "elementType": "geometry.stroke",
  //           "stylers": {
  //               "color": "#7d4017ff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "fourlevelway",
  //           "elementType": "geometry.stroke",
  //           "stylers": {
  //               "color": "#7d4017ff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "local",
  //           "elementType": "geometry.stroke",
  //           "stylers": {
  //               "color": "#7d4017ff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "local",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "local",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "fourlevelway",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "tertiaryway",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "arterial",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "provincialway",
  //           "elementType": "labels.text.fill",
  //           "stylers": {
  //               "color": "#e2953fff",
  //               "visibility": "on"
  //           }
  //       }, {
  //           "featureType": "provincialway",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "arterial",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "tertiaryway",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "fourlevelway",
  //           "elementType": "labels.text.stroke",
  //           "stylers": {
  //               "color": "#765e4eff",
  //               "visibility": "on",
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "fourlevelway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "tertiaryway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "local",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "weight": 1
  //           }
  //       }, {
  //           "featureType": "provincialway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "weight": 3
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "weight": 3
  //           }
  //       }, {
  //           "featureType": "arterial",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "weight": 3
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "highway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "nationalway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "provincialway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "8,10",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "provincialway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "8,10",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "provincialway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "8,10",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "provincialway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "8,10",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "provincialway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "8,10",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "provincialway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "8,10",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "6"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "7"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "8"
  //           }
  //       }, {
  //           "featureType": "cityhighway",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "6,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "arterial",
  //           "stylers": {
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "9,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "arterial",
  //           "elementType": "geometry",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "9,9",
  //               "level": "9"
  //           }
  //       }, {
  //           "featureType": "arterial",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "off",
  //               "curZoomRegionId": "0",
  //               "curZoomRegion": "9,9",
  //               "level": "9"
  //           }
  //       },{
  //           "featureType": "water",
  //           "elementType": "labels",
  //           "stylers": {
  //               "visibility": "on"
  //           }
  //         }]
  //       }
  //     },
  //     series: [
  //       {
  //         name: '工程量',
  //         type: 'effectScatter',
  //         coordinateSystem: 'bmap',
  //         data: convertData(userData?.filter((item:any)=>{
  //           return item.number===0
  //         })),
  //         encode: {
  //           value: 2
  //         },
  //         showEffectOn: 'render',
  //         rippleEffect: {
  //           brushType: 'stroke'
  //         },
  //         label: {
  //           formatter: '{b}',
  //           position: 'right',
  //           show: true,
  //           color:'#fff'
  //         },
  //         itemStyle: {
  //           shadowBlur: 10,
  //           shadowColor: '#333',
  //           color:'#79F68B'
  //         },
  //         emphasis: {
  //           scale: true
  //         },
  //       },
  //       {
  //         name: '工程量',
  //         type: 'effectScatter',
  //         coordinateSystem: 'bmap',
  //         data: convertData(userData?.filter((item:any)=>{
  //           return item.number>0&&item.number<3
  //         })),
  //         encode: {
  //           value: 2
  //         },
  //         showEffectOn: 'render',
  //         rippleEffect: {
  //           brushType: 'stroke'
  //         },
  //         label: {
  //           formatter: '{b}',
  //           position: 'right',
  //           color:'#fff',
  //           show: true
  //         },
  //         itemStyle: {
  //           shadowBlur: 10,
  //           shadowColor: '#333',
  //           color:'#04D0FA'
  //         },
  //         emphasis: {
  //           scale: true
  //         },
  //       },
  //       {
  //         name: '工程量',
  //         type: 'effectScatter',
  //         coordinateSystem: 'bmap',
  //         data: convertData(userData?.filter((item:any)=>{
  //           return item.number>2&&item.number<5
  //         })),
  //         encode: {
  //           value: 2
  //         },
  //         showEffectOn: 'render',
  //         rippleEffect: {
  //           brushType: 'stroke'
  //         },
  //         label: {
  //           formatter: '{b}',
  //           position: 'right',
  //           color:'#fff',
  //           show: true
  //         },
  //         itemStyle: {
  //           shadowBlur: 10,
  //           shadowColor: '#333',
  //           color:'#F1F556'
  //         },
  //         emphasis: {
  //           scale: true
  //         },
  //       },
  //       {
  //         name: '工程量',
  //         type: 'effectScatter',
  //         coordinateSystem: 'bmap',
  //         data: convertData(userData?.filter((item:any)=>{
  //           return item.number>4
  //         })),
  //         encode: {
  //           value: 2
  //         },
  //         showEffectOn: 'render',
  //         rippleEffect: {
  //           brushType: 'stroke'
  //         },
  //         label: {
  //           formatter: '{b}',
  //           position: 'right',
  //           color:'#fff',
  //           show: true
  //         },
  //         itemStyle: {
  //           shadowBlur: 10,
  //           shadowColor: '#333',
  //           color:'#FA2B0A'
  //         },
  //         emphasis: {
  //           scale: true
  //         },
  //       }
  //     ]
  //   }

  const initCharts = () => {
    (document as HTMLElement | any).getElementById('LoftingStatisticalAnalysis').removeAttribute("_echarts_instance_");
    (document as HTMLElement | any).getElementById('LoftingStatisticalAnalysis').style.height = '100%'
    const myChart = echarts.init((document as HTMLElement | any).getElementById('LoftingStatisticalAnalysis'));

    // 绘制图表
    myChart.setOption(option);
    myChart.on("click", function (e: any) {
      console.log(e)    //  每个标识点的信息
      if (e?.componentType === 'series') {
        setDetail(e)
        getProjectData(e?.data?.userId)
      }

      // e.event.stop()
    }, false);
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
        textStyle: {
          color: '#fff'
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
        axisLabel: {
          color: '#fff'
        },
      },
      yAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        data: provinceBarData?.map((item: any) => { return item.province })
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
          data: provinceBarData?.map((item: any) => { return item.count })
        }
      ]
    })

    window.addEventListener('resize', () => {
      myChart.resize();
      myDisChart.resize();
    })
  }

  const chartsContent = (): React.ReactNode => {
    return <div className={styles.statement} id={'statement'}>
      <div className={styles.header}>
        <div className={styles.headerbg}>
          <span className={styles.headerTitle}>汇金通售后资源网络分布图</span>
        </div>
        <Button type="primary" onClick={() => setIsFull(!isFull)} className={styles.fullBtn} size='small' ghost>{isFull ? '退出全屏' : '全屏'}</Button>
      </div>
      <div className={styles.top}>
        <div className={styles.left}>
          {/* <div>
                         <span className={styles.title}>放样统计分析</span>
                     </div> */}
          <div className={styles.count}>
            <div id={'LoftingStatisticalAnalysis'} key={'LoftingStatisticalAnalysis'} />
          </div>
          {/* <Button type="primary" onClick={() => setIsFull(!isFull)} className={styles.fullBtn} size='small' ghost>{isFull ? '退出全屏' : '全屏'}</Button> */}

        </div>
        <div className={styles.right}>
          {isClick && <div className={styles.rightTop}>
            <div className={styles.title}>{detail?.data?.userName}</div>
            <div style={{ color: '#fff', margin: '10px 0px', marginBottom: '20px' }}>
              {/* <div>名称：</div> */}
              <div>地址：{detail?.data?.address}</div>
              <div>工程名称：{
                projectData && projectData.map((res: any, index: number) => {
                  return res?.projectName
                }).join(',').length > 0 ? projectData && projectData.map((res: any, index: number) => {
                  return res?.projectName
                }).join(',') : '无'
              }</div>
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
      isFull ?
        <Modal width='100%' className={styles.statementsModal} visible={isFull} closable={false} footer={false} onCancel={() => setIsFull(false)}>
          {chartsContent()}
        </Modal>
        :
        <>{chartsContent()}</>
    }
    {/* {
             
                 <>{chartsContent()}</>
         } */}

  </Spin>
}