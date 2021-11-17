import React, { useEffect, useState } from 'react';
import GSTCComponent, { GSTC } from './GSTC';
import { ITEM, Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as CalendarScroll } from 'gantt-schedule-timeline-calendar/dist/plugins/calendar-scroll.esm.min.js';
import { Plugin as HighlightWeekends } from 'gantt-schedule-timeline-calendar/dist/plugins/highlight-weekends.esm.min.js';
import useRequest from '@ahooksjs/use-request';
import { useHistory } from 'react-router-dom';
const DependencyLines = require('gantt-schedule-timeline-calendar/dist/plugins/dependency-lines.esm.min.js').Plugin;
export default function GantChart(props: any) {
  const GSTCID = GSTC.api.GSTCID;
  const [items,setItems] = useState<any>({});
  const [rows,setRows] = useState<any>({});
  const history = useHistory();
  //每一项内容显示
  const itemSlot=(vido: { html: any; onChange: any; update: any; }, props: { item: { deptProcessesName: string; name: string; time: {start:string; end: string}; }; })=> {
    const { html, onChange, update } = vido;
    let name = '';
    let deptProcessesName = '';
    let startTime = '';
    let endTime = '';
    onChange((newProps: { item: { deptProcessesName: string; name: string; time: {start:string; end: string};}; }) => {
      props = newProps;
      if (!props || !props.item) return;
      name = props.item.name;
      deptProcessesName = props.item.deptProcessesName;
      startTime = new Date(props.item.time.start).toLocaleString();
      endTime = new Date(props.item.time.end).toLocaleString();
      update();
    });
  
    return (content: any) =>
      html`<div class="item-text" style="overflow:hidden;
      text-overflow:ellipsis;">
          <div class="item-label">${content}</div>
          <div class="item-name" style="margin-top:2px;color:#fffffff0" title="${name}-${deptProcessesName}-${startTime}-${endTime}">
            ${name}-${deptProcessesName}
          </div>
        </div>`
  }

  //监听每一项action
  const addListenClick=(element: { addEventListener: (arg0: string, arg1: (e: any) => boolean) => void; }, data: { item: { name: any; deptProcessesName:any, id: any}; itemData: any})=> {
    const onClick = (e: { preventDefault: () => void; }) => {
      e.preventDefault()
      console.log(data)
      history.push(`/workshopManagement/processingTask/dispatch/${data.item.id}`)
      return false
    }
    element.addEventListener('click', onClick);
    
    return {
      update(element: any, newData: { item: { name: any; deptProcessesName: any; id: any}; itemData: any; }) {
        data = newData; // data from parent scope updated
      },
      destroy(element: { removeEventListener: (arg0: string, arg1: (e: { preventDefault: () => void; }) => boolean) => void; }, data: any) {
        element.removeEventListener('click', onClick);
      }
    };
   
  };
  //整体设置
  let config = {
    licenseKey:
      '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
    plugins: [
      // TimelinePointer(),
      // CalendarScroll(),
      //ProgressBar(),
      HighlightWeekends(),
      DependencyLines(),
    ],
    locale: {
      name: "zh",
      Now: "Now",
      weekdays:["周日","周一","周二","周三","周四","周五","周六"],
      months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
    },
    // innerHeight: props.value.length===1?props.value.length*70:props.value.length<4?props.value.length*50:props.value.length*45,
    list: {
      rows: rows,
      columns: {
        data: {
          // [GSTCID('id')]: {
          //   id: GSTCID('id'),
          //   data: ({ row }:any) => GSTC.api.sourceID(row.id),
          //   sortable: ({ row }:any) => Number(GSTC.api.sourceID(row.id)),
          //   width: 50,
          //   resizer: false,
          //   header: {
          //     content: '序号',
          //   },
          // },
          [GSTCID('deptProcessesName')]: {
            id: GSTCID('deptProcessesName'),
            data: 'deptProcessesName',
            sortable: 'deptProcessesName',
            isHTML: false,
            // expander: true,
            resizer: false,
            width: 200,
            header: {
              content: '工序',
            },
          },
          [GSTCID('name')]: {
            id: GSTCID('name'),
            data: 'name',
            sortable: 'name',
            isHTML: false,
            // expander: true,
            resizer: false,
            width: 200,
            header: {
              content: '产线',
            },
          },
          [GSTCID('id')]: {
            id: GSTCID('id'),
            data: 'id',
            sortable: 'id',
            isHTML: false,
            // expander: true,
            resizer: false,
            width: 200,
            header: {
              content: '派工设备名称',
            },
          },
          [GSTCID('operation')]: {
            id: GSTCID('operation'),
            resizer: false,
            data({ row, vido }:any) {
              return vido.html`<a style="color:#FF8C00" href="/workshopManagement/processingTask/dispatch/${row.id}">${row.operation}</a>`;
            },
            width: 80,
            header: {
              content: '操作',
            },
          },
  
        },
      },
      toggle:{
        display: false
      }
    },
    chart: {
      time: {
        from: new Date().getTime(),
        to: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
        zoom: 13,    
      },
      items: items,
    },
    // scroll: {
    //   horizontal: {
    //     precise: true,
    //   },
    //   vertical: {
    //     precise: true,
    //   },
    // },
    actions: {
      'chart-timeline-items-row-item': [addListenClick] // 监听事件
    },
    slots: {
      'chart-timeline-items-row-item': { content: [itemSlot] },
    },
  };

  let subs:any = [];

  function onLoad(gstc: { state: { update: (arg0: string, arg1: { (item1: any): any; (row: any): any; }) => void; subscribe: (arg0: string, arg1: { (items: any): void; (rows: any): void; }) => any; }; }) {
    subs.push(
      gstc.state.subscribe('config.chart.items', (items:any) => {
        console.log('items changed', items);
      })
    );
    subs.push(
      gstc.state.subscribe('config.list.rows', (rows:any) => {
        console.log('rows changed', rows);
      })
    );
  }

  useEffect(() => {
    return () => {
      subs.forEach((unsub: () => any) => unsub());
    };
  });
  const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
    // const data = await RequestUtil.get<any>(`/tower-science/assessTask/taskDetail/${ params.id }`);
    const valueItems:any ={};
    const rowItems:any ={};
    props.value.forEach((item:any,i:number)=>{
      const withParent = i > 0 && i % 2 === 0;
        valueItems[item.id]= {
          id:item.id,
          deptProcessesName: item.deptProcessesName,//工序名称
          name: item.name, //设备名称
          // parentId: withParent ? GSTCID(String(i - 1)) : undefined,
          style: { background: i===0?'#07ABA0':'#E74C3C'},
          time: {
            start:item.startTime,
            end: item.endTime,
          },
          dependant:i===0?['2']:undefined,//依赖线
          // rowId: '1',  //控制是否一行
          operation:'派工',
          expanded: false,
          vacations: [],
          rowId:item.id,
        };
    });
    
    props.value.forEach((item:any,i:number)=>{
      const withParent = i > 0 && i % 2 === 0;
        rowItems[item.id]= {
            id:item.id,
            deptProcessesName: item.deptProcessesName,
            name: item.name, //设备名称,
            operation:'派工',
            // parentId: withParent ? GSTCID(String(i - 1)) : undefined,
            expanded: false,
            vacations: [],
        };
    });
    setItems(valueItems);
    setRows(rowItems);
    resole(data);
  }), {})
  return (
    <>
      {Object.keys(items).length>0?<GSTCComponent config={config} onLoad={onLoad} />:null}
    </>
  );
}