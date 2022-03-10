import React from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import './planProd.css';
import moment from 'moment';
export interface IRouteProps extends RouteComponentProps<any>, WithTranslation {}
export interface WithSectionModalProps {}
export interface IWithSectionModalRouteProps extends RouteComponentProps<WithSectionModalProps>, WithTranslation {
    readonly id: number | string;
    readonly updateList: () => void;
    dataSource: {
      data:any
    };
}
export interface WithSectionModalState {
  dataSource?:any
}
class PlanGantt extends React.Component<IWithSectionModalRouteProps, WithSectionModalState> {
  constructor(props: IWithSectionModalRouteProps) {
    super(props);
    this.state={
      dataSource:[]
    }
  }
    componentDidUpdate() {
      gantt.render();
    }
    
   
    async componentDidMount() {
        const tree: any = await RequestUtil.get<any>('/tower-aps/productionPlan/thread');
        
        gantt.clearAll();
        gantt.config.column_width = 20;
        gantt.config.columns = [
          {label:'计划号', name: "planNumber", tree: true, resize: true , width:170, template: function (task:any) {
            if(!task.parent){
              // href='/planProd/planMgmt/detail/${task.id}/${task.planId}'
              return (
                `
                <span style="color:#FF8C00" title="计划号：${task.planNumber}&#10;客户：${task.customerCompany}&#10;线路：${task.lineName}" >${task.planNumber}</span>
                `
              )
            }
              
          }},
          {label:'塔型',name: "name", align: "center", resize: true, template: function (task:any) {
              return (
                `
                <span title="塔型：${task.name}" >${task.name}</span>
                `
              )
              
          }},
          {label:'基数',name: "productNum", align: "center", template: function (task:any) {
            return (
              `
              <span title="基数：${task.productNum}" >${task.productNum}</span>
              `
            )
            
        }},
          {label:'重量（T）',name: "weight", align: "center", template: function (task:any) {
            return (
              `
              <span title="重量（T）：${task.weight}" >${task.weight}</span>
              `
            )
            
        }},
          {label:'交货日期',name: "deliveryTime", align: "center", width:150,template: function (task:any) {
            return (
              `
              <span title="交货日期:${task.deliveryTime?task.deliveryTime:'-'}" >${task.deliveryTime?task.deliveryTime:'-'}</span>
              `
            )
            
        }},
          // {label:'计划状态',name: "planStatus", align: "center", template: function (task:any) {
          //   switch(task.planStatus){
          //     case 1: return '待排产'
          //     case 2: return '排产中'
          //     case 3: return '已排产'
          //   }
          // }},
          {label:'操作',name: "buttons",width: 150, align: "center", template: function (task:any) {
            if(task.parent){
              // href='/planProd/planMgmt/detail/${task.id}/${task.planId}'
              return (
                `
                <a style="color:#FF8C00" id="planEdit" href='/planProd/planMgmt/detail/${task.id}/${task.planId}'>详情</a>
                `
              );
            }else{
              return '-'
            }
              
          }}
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
        const value = tree.length>0 && tree.reduce((res:any, item:any) => {
          const parent = {...item};
          delete parent.planProductCategoryVOList;
          return res.concat(item.planProductCategoryVOList.length>0&&item.planProductCategoryVOList.map((child:any) => ({...child,parent: parent.id})))
        }, []);
        const tasksNew = tree.length>0 &&tree.concat(value).map((item:any)=>{
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
        // 一行存在多个task
        // const tasks = {
        //   data: [
        //     {id: 11, text: "Project #1", type: "project", progress: 0, open: true, start_date: "02-04-2018 00:00", duration: 13, parent: 0},
        //     {id: 12, text: "Task #1", start_date: "03-04-2018 00:00", duration: 5, parent: "11", progress: 0, open: true},
        //     {id: 13, text: "Task #2", start_date: "03-04-2018 00:00", type: "project", render:"split", parent: "11", progress: 0.5, open: false, duration: 11},
        //     {id: 17, text: "Stage #1", start_date: "03-04-2018 00:00", duration: 1, parent: "13", progress: 0, open: true},
        //     {id: 18, text: "Stage #2", start_date: "05-04-2018 00:00", duration: 2, parent: "13", progress: 0, open: true},
        //     {id: 19, text: "Stage #3", start_date: "08-04-2018 00:00", duration: 1, parent: "13", progress: 0, open: true},
        //     {id: 20, text: "Stage #4", start_date: "10-04-2018 00:00", duration: 4, parent: "13", progress: 0, open: true},
        //     {id: 14, text: "Task #3", start_date: "02-04-2018 00:00", duration: 6, parent: "11", progress: 0, open: true},
        //     {id: 15, text: "Task #4", type: "project", render:"split", parent: "11", progress: 0, open: true, start_date: "03-04-2018 00:00", duration: 11},
        //     {id: 21, text: "Stage #1", start_date: "03-04-2018 00:00", duration: 4, parent: "15", progress: 0, open: true},
        //     {id: 22, text: "Stage #2", start_date: "08-04-2018 00:00", duration: 3, parent: "15", progress: 0, open: true},
        //   ],
        //   links:[
        //     {id:"15",source:"13",target:"17",type:"1"},
        //     {id:"16",source:"17",target:"18",type:"0"},
        //     {id:"17",source:"18",target:"19",type:"0"},
        //     {id:"18",source:"19",target:"20",type:"0"},
        //     {id:"21",source:"15",target:"23",type:"0"},
        //     {id:"22",source:"21",target:"22",type:"0"},
        //     {id:"23",source:"14",target:"15",type:"0"},
        //     {id:"24",source:"22",target:"23",type:"0"},
        //     {id:"25",source:"12",target:"20",type:"0"}
        //   ]
        // }
        
        this.setState({
          dataSource: tasks
        })
        gantt.parse(tasks);
        gantt.detachAllEvents();
        gantt.attachEvent("onTaskDblClick", function(id:any, e:any) {
          console.log('id')
        },'');
        gantt.attachEvent("onTaskClick", async (id:any, e:any) => {
          // if(e.target.id === 'planEdit'){
          //   this.onDetail(id)
          // }
          return e
        },'');

        
    }


    onDetail = (task:any) =>{
      const value = this.state.dataSource.data.filter((item:any)=>{return item.id === task})
      this.props.history.push(`/planProd/planMgmt/detail/${task}/${value[0].planId}`)
    }
    onFilterSubmit = async (value: any) => {
      if (value.time) {
          const formatDate = value.time.map((item: any) => item.format("YYYY-MM-DD"))
          value.startTime = formatDate[0]+ ' 00:00:00';
          value.endTime = formatDate[1]+ ' 23:59:59';
          delete value.time
      }
      gantt.clearAll();
      const tree: any = await RequestUtil.get<any>('/tower-aps/productionPlan/thread',value);
      const valueN = tree.length>0 && tree.reduce((res:any, item:any) => {
        const parent = {...item};
        delete parent.planProductCategoryVOList;
        return res.concat(item.planProductCategoryVOList.length>0&&item.planProductCategoryVOList.map((child:any) => ({...child,parent: parent.id})))
      }, []);
      const tasksNew = tree.length>0 &&tree.concat(valueN).map((item:any)=>{
        return {
          ...item,
          // open:true,
          start_date: item.startTime?new Date(item.startTime+' 00:00:00'): new Date(),
          name: item.name?item.name:item.productCategoryNum,
          deliveryTime: item.deliveryTime?moment(item.deliveryTime).format('YYYY-MM-DD'):undefined,
          planNumber:item.planNumber?item.planNumber:undefined,
          end_date: item.endTime?new Date(item.endTime+' 23:59:59'): new Date()
        }
      })
      const tasks = {
        data: tasksNew.length>0?tasksNew:[]
      }
      gantt.parse(tasks);
    }
    List = async () =>{
      const value = await RequestUtil.get(`/tower-science/drawProductSegment/getSegmentBySegmentGroupId`);
      return value
    }
    render() {
      return (<>
        <Form layout="inline" style={{margin:'20px'}} onFinish={this.onFilterSubmit}>
          <Form.Item label='生产计划号/塔型' name='fuzzyMsg'>
              <Input/>
          </Form.Item>
          <Form.Item label='计划状态' name='planStatus'>
              <Select placeholder="请选择" style={{ width: "150px" }}>
                  <Select.Option value={''} key="">全部</Select.Option>
                  <Select.Option value={1} key="1">待排产</Select.Option>
                  <Select.Option value={2} key="2">排产中</Select.Option>
                  <Select.Option value={3} key="3">已排产</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item label='交货时间' name='time'>
              <DatePicker.RangePicker format="YYYY-MM-DD" />
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
      );
    }
  }
export default withRouter(withTranslation('translation')(PlanGantt))
