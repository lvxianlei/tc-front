/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单视图
 */

 import React, { useEffect, useRef, useState } from 'react';
 import { Input, DatePicker, Button, message, Space, Select, Radio, Modal, TreeSelect, Form } from 'antd';
 import { Page } from '../../common';
 import { FixedType } from 'rc-table/lib/interface';
 import styles from '../Management.module.less';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import { useHistory } from 'react-router-dom';
 import SelectUser from '../../common/SelectUser';
 import { useForm } from 'antd/lib/form/Form';
import { gantt } from 'dhtmlx-gantt';
import moment from 'moment';
 
 export interface EditRefProps {
     onSubmit: () => void
     resetFields: () => void
     onBack: () => void
 }
 export default function List(): React.ReactNode {
     const [filterValue, setFilterValue] = useState<any>({});
     const [searchForm] = useForm();
 
     const { data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         let result: any = await RequestUtil.get<any>(`/tower-work/template/type`);
         resole(result)
     }), {})
 
 useEffect(() => {
        
        gantt.clearAll();
        gantt.config.column_width = 20;
        gantt.config.columns = [
          {
            label:'工单编号', 
            name: "planNumber", 
            tree: true, 
            resize: true , 
            width:170, 
            template: function (task:any) {
            if(!task.parent){
              return (
                `
                <span style="color:#FF8C00" title="计划号：${task.planNumber}" >${task.planNumber}</span>
                `
              )
            }
              
          }
        },
          {
            label:'工单标题',
            name: "name", 
            align: "center", 
            resize: true, 
            template: function (task:any) {
              return (
                `
                <span title="工单标题：${task.name}" >${task.name}</span>
                `
              )
              
          }
        },
          {
            label:'处理节点',
            name: "productNum", 
            align: "center", 
            template: function (task:any) {
            return (
              `
              <span title="处理节点：${task.productNum}" >${task.productNum}</span>
              `
            )
            
        }
    },
          {
            label:'所属部门',
            name: "weight", 
            align: "center", 
            template: function (task:any) {
            return (
              `
              <span title="所属部门：${task.weight}" >${task.weight}</span>
              `
            )
            
        }
    },
          {
            label:'接收人',
            name: "deliveryTime", 
            align: "center", 
            width:150,
            template: function (task:any) {
            return (
              `
              <span title="接收人:${task.deliveryTime?task.deliveryTime:'-'}" >${task.deliveryTime?task.deliveryTime:'-'}</span>
              `
            )
            
        }
    },
          {
            label:'预计开始时间',
            name: "planStatus", 
            align: "center", 
            template: function (task:any) {
            return (
              `
              <span title="预计开始时间:${task.deliveryTime?task.deliveryTime:'-'}" >${task.deliveryTime?task.deliveryTime:'-'}</span>
              `
            )
          }
        },
        {
          label:'预计完成时间',
          name: "planStatus", 
          align: "center", 
          template: function (task:any) {
          return (
            `
            <span title="预计完成时间:${task.deliveryTime?task.deliveryTime:'-'}" >${task.deliveryTime?task.deliveryTime:'-'}</span>
            `
          )
        }
      }
        ];
        gantt.templates.task_text = function(start,end,task){
          return task.planNumber?`<b title='计划号:${task.planNumber}'>计划号:</b> `+task.planNumber:`<b title='塔型:${task.name}'> 塔型:</b> `+task.name;
        };
        gantt.config.scales = [
          {unit:"day", step:1, date:"%d" },
          {unit:"month", step:1, date:"%F, %Y" },
          // {unit:"year", step:1, date:"%Y" }
        ];

        gantt.config.row_height = 22;

        gantt.config.static_background = true;
        gantt.config.start_date = new Date(2021, 0, 1);
        // gantt.config.end_date = new Date(2021, 0, 1);
        
        gantt.config.drag_resize = false;//拖拽工期
        gantt.config.drag_progress = false;//拖拽进度
        gantt.config.drag_links = false;//通过拖拽的方式新增任务依赖的线条
        gantt.config.drag_move = false;
        gantt.config.layout = {
          css: "gantt_container",
          cols: [
           {
             width: 600,
             min_width: 300,
         
             // adding horizontal scrollbar to the grid via the scrollX attribute
             rows:[
              {view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer"}, 
              {view: "scrollbar", id: "gridScroll"}  
             ]
           },
           {resizer: true, width: 1},
           {
             rows:[
              {view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer"},
              {view: "scrollbar", id: "scrollHor"}
             ]
           },
           {view: "scrollbar", id: "scrollVer"}
          ]
        };
        gantt.init("planProd");
        gantt.i18n.setLocale("cn");
        const value = data.length>0 && data.reduce((res:any, item:any) => {
          const parent = {...item};
          delete parent.planProductCategoryVOList;
          return res.concat(item.planProductCategoryVOList.length>0&&item.planProductCategoryVOList.map((child:any) => ({...child,parent: parent.id})))
        }, []);
        const tasksNew = data.length>0 &&data.concat(value).map((item:any)=>{
          return {
            ...item,
            // open:true,
            start_date: item.startTime?new Date(item.startTime+ ' 00:00:00'): new Date(),
            name: item.name?item.name:item.productCategoryNum,
            deliveryTime: item.deliveryTime?moment(item.deliveryTime).format('YYYY-MM-DD'):undefined,
            planNumber:item.planNumber?item.planNumber:undefined,
            end_date: item.endTime?new Date(item.endTime+ ' 23:59:59'): new Date()
          }
        })
        const tasks = {
          data: tasksNew.length>0?tasksNew:[]
        }
        gantt.parse(tasks);
        gantt.detachAllEvents();
        gantt.attachEvent("onTaskDblClick", function(id:any, e:any) {
          console.log('id')
        },'');
        gantt.attachEvent("onTaskClick", async (id:any, e:any) => {
          return e
        },'');

 })

     const onFilterSubmit = (values: Record<string, any>) => {
         if (values?.selectTime) {
             const formatDate = values?.selectTime?.map((item: any) => item.format("YYYY-MM-DD"));
             values.startTime = formatDate[0] + ' 00:00:00';
             values.endTime = formatDate[1] + ' 23:59:59';
         }
         values.recipientUser = searchForm?.getFieldsValue(true)?.recipientUser
         setFilterValue(values);
     }
     return <>
        <Form layout="inline" style={{margin:'20px'}} onFinish={onFilterSubmit}>
          <Form.Item name='fuzzyMsg'>
          <Input style={{ width: '200px' }} placeholder="工单标题/工单编号" />
          </Form.Item>
          <Form.Item>
              <Button type="primary" htmlType="submit">查询</Button>
          </Form.Item>
          <Form.Item>
              <Button htmlType="reset">重置</Button>
          </Form.Item>
        </Form>
        <div id="planProd" style={{width:'calc(100vw - 280px)', height:'800px'}}></div>
     </>
 }