/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单视图
 */

import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Form } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { useForm } from 'antd/lib/form/Form';
import { gantt } from 'dhtmlx-gantt';
import './view.css';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

export interface EditRefProps {
  onSubmit: () => void
  resetFields: () => void
  onBack: () => void
}
export default function List(): React.ReactNode {
  const [filterValue, setFilterValue] = useState<any>({});
  const [searchForm] = useForm();

  const { data, run } = useRequest<any>((filterValues: any) => new Promise(async (resole, reject) => {
    let result: any = await RequestUtil.get<any>(`/tower-work/workOrder/view`, { ...filterValues });
    resole(result || [])
  }), {})

  useEffect(() => {

    gantt.clearAll();
    gantt.config.column_width = 80;
    gantt.config.columns = [
      {
        label: '工单编号',
        name: "workOrderNumber",
        tree: true,
        resize: true,
        width: 120,
        template: function (task: any) {
          if (!task.parent) {
            return (
              `
                <span style="color:#FF8C00" title="工单编号：${task.workOrderNumber}" >${task.workOrderNumber || '-'}</span>
                `
            )
          }

        }
      },
      {
        label: '工单标题',
        name: "workOrderTitle",
        align: "center",
        resize: true,
        width: 100,
        template: function (task: any) {
          return (
            `
                <span title="工单标题：${task.workOrderTitle}" >${task.workOrderTitle || '-'}</span>
                `
          )

        }
      },
      {
        label: '处理节点',
        name: "processingName",
        align: "center",
        width: 100,
        template: function (task: any) {
          return (
            `
              <span title="处理节点：${task.processingName}" >${task.processingName || '-'}</span>
              `
          )

        }
      },
      {
        label: '接收人',
        name: "recipientUserName",
        align: "center",
        width: 80,
        template: function (task: any) {
          return (
            `
              <span title="接收人:${task.recipientUserName}" >${task.recipientUserName || '-'}</span>
              `
          )
        }
      },
      {
        label: '预计开始时间',
        name: "planStartTime",
        align: "center",
        width: 150,
        template: function (task: any) {
          return (
            `
              <span title="预计开始时间:${task.status === 1 ? task.planStartTime || '-' : task.actualStartTime || '-'}" >${task.status === 1 ? task.planStartTime || '-' : task.actualStartTime || '-'}</span>
              `
          )
        }
      },
      {
        label: '预计完成时间',
        name: "planEndTime",
        align: "center",
        width: 150,
        template: function (task: any) {
          return (
            `
            <span title="预计完成时间:${task.status === 1 ? task.planEndTime || '-' : task.actualEndTime || '-'}" >${task.status === 1 ? task.planEndTime || '-' : task.actualEndTime || '-'}</span>
            `
          )
        }
      }
    ];
    gantt.templates.task_text = function (start, end, task) {
      return task.workOrderNumber ? `<b title='工单编号:${task.workOrderNumber}'>工单编号:</b> ` + task.workOrderNumber : `<b title='处理环节:${task.processingName}'>` + task.processingName + `</b> `;
    };
    gantt.config.scales = [
      { unit: "day", step: 1, date: "%d" },
      { unit: "month", step: 1, date: "%F, %Y" },
      { unit: "hour", step: 8, date: "%H:%i" },
      // {unit:"year", step:1, date:"%Y" }
    ];

    gantt.config.row_height = 22;

    gantt.config.static_background = true;
    gantt.config.start_date = new Date(2019, 1, 1);

    gantt.config.drag_resize = false;//拖拽工期
    gantt.config.drag_progress = false;//拖拽进度
    gantt.config.drag_links = false;//通过拖拽的方式新增任务依赖的线条
    gantt.config.drag_move = false;
    gantt.config.show_errors = false;

    gantt.config.layout = {
      css: "gantt_container",
      cols: [
        {
          width: 600,
          min_width: 300,

          // adding horizontal scrollbar to the grid via the scrollX attribute
          rows: [
            { view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer" },
            { view: "scrollbar", id: "gridScroll" }
          ]
        },
        { resizer: true, width: 1 },
        {
          rows: [
            { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
            { view: "scrollbar", id: "scrollHor" }
          ]
        },
        { view: "scrollbar", id: "scrollVer" }
      ]
    };
    gantt.init("planProd");
    gantt.i18n.setLocale("cn");
    gantt.templates.task_class = function (start, end, item) {
      return  item?.workOrderNumber ? item?.status ===1 ? 'dashed' : '' :  item?.status ===3 ? '' : 'dashed'
    };
  
    const value = data?.length > 0 && data?.reduce((res: any, item: any) => {
      const parent = { ...item };
      delete parent?.workOrderNodeViewList;
      return res.concat(item?.workOrderNodeViewList?.length > 0 && item?.workOrderNodeViewList?.map((child: any) => ({ ...child, parent: parent.id })))
    }, []);
    const tasksNew = data?.length > 0 && data?.concat(value).map((item: any) => {
      return {
        ...item,
        start_date: item.planStartTime ? new Date(item.planStartTime) : new Date(),
        end_date: item.planEndTime ? new Date(item.planEndTime) : new Date(),
        // color: item.workOrderNumber ? '#0ac189' : item?.colour,
        color: item.status === 3 ? '#0ac189' : '#0000003b',
        "border": "1px dashed #ff0 !important"
      }
    })
    const tasks = {
      data: tasksNew.length > 0 ? tasksNew : []
    }
    gantt.parse(tasks);
    gantt.detachAllEvents();
    gantt.attachEvent("onTaskDblClick", function (id: any, e: any) {
      console.log('id')
    }, '');
    gantt.attachEvent("onTaskClick", async (id: any, e: any) => {
      return e
    }, '');

  })

  const onFilterSubmit = (values: Record<string, any>) => {
    if (values?.selectTime) {
      const formatDate = values?.selectTime?.map((item: any) => item.format("YYYY-MM-DD"));
      values.startTime = formatDate[0] + ' 00:00:00';
      values.endTime = formatDate[1] + ' 23:59:59';
    }
    values.recipientUser = searchForm?.getFieldsValue(true)?.recipientUser
    gantt.clearAll();
    run(values)
    setFilterValue(values);
  }
  return <>
    <Form layout="inline" style={{ margin: '20px' }} onFinish={onFilterSubmit}>
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
    <div id="planProd" style={{ width: 'calc(100vw - 280px)', height: '800px' }}></div>
  </>
}