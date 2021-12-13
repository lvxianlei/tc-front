import React from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { Button, DatePicker, Form, Input, Popconfirm } from 'antd';
import { IResponseData } from '../../common/Page';
import RequestUtil from '../../../utils/RequestUtil';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import moment from 'moment';
export interface IRouteProps extends RouteComponentProps<any>, WithTranslation {}
export interface WithSectionModalProps {}
export interface IWithSectionModalRouteProps extends RouteComponentProps<WithSectionModalProps>, WithTranslation {
    readonly id: number | string;
    readonly updateList: () => void;
}
export interface WithSectionModalState {}
class PlanGantt extends React.Component<IWithSectionModalRouteProps, WithSectionModalState> {

    componentDidUpdate() {
      gantt.render();
    }
    
   
    async componentDidMount() {
        const tree: any = await RequestUtil.get<any>('/tower-aps/productionPlan/thread');
        
        gantt.clearAll();
        gantt.config.column_width = 20;
        gantt.config.columns = [
          {label:'计划号', name: "planNumber", tree: true, resize: true },
          {label:'塔型',name: "name", align: "center", resize: true, width: 100},
          {label:'基数',name: "productNum", align: "center"},
          {label:'重量',name: "weight", align: "center"},
          {label:'交货日期',name: "deliveryTime", align: "center"},
          {label:'操作',name: "buttons",width: 150, align: "center", template: function (task:any) {
            if(task.parent){
              return (
                `
                <a style="color:#FF8C00" id="planEdit" href='/planProd/planMgmt/detail/${task.id}/${task.planId}'>查看</a>
                `
              );
            }else{
              return '-'
            }
              
          }}
        ];
        gantt.templates.task_text = function(start,end,task){
          return task.planNumber?"<b>计划号:</b> "+task.planNumber:"<b> 塔型:</b> "+task.name;
        };
        gantt.config.scales = [
          {unit:"day", step:1, date:"%d" },
          {unit:"month", step:1, date:"%F, %Y" },
          {unit:"year", step:1, date:"%Y" }
        ];

        gantt.config.row_height = 22;

        gantt.config.static_background = true;
        gantt.config.start_date = new Date(2021, 0, 1);
        // gantt.config.end_date = new Date(2021, 0, 1);
        
        gantt.config.drag_resize = false;//拖拽工期
        gantt.config.drag_progress = false;//拖拽进度
        gantt.config.drag_links = false;//通过拖拽的方式新增任务依赖的线条
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
        const value = tree.reduce((res:any, item:any) => {
          const parent = {...item};
          delete parent.planProductCategoryVOList;
          return res.concat(item.planProductCategoryVOList.map((child:any) => ({...child,parent: parent.id})))
        }, []);
        const tasksNew = tree.concat(value).map((item:any)=>{
          return {
            ...item,
            open:true,
            start_date: item.startTime?new Date(item.startTime): new Date(),
            name: item.name?item.name:item.productCategoryNum,
            deliveryTime: item.deliveryTime?moment(item.deliveryTime).format('YYYY-MM-DD'):undefined,
            planNumber:item.planNumber?item.planNumber:undefined,
            end_date: item.endTime?new Date(item.endTime): new Date()
          }
        })
        // const tasks={
        //   data:[
        //       {id:1, planNumber:"1", deliveryTime:"2021-12-01", productNum:11,  open:true, tower:'1', start_date:new Date("2021-12-10"), duration: 6, progress:1},
        //       {id:2, planNumber:"2", deliveryTime:"2021-12-02", productNum:11,  open:true, tower:'2', start_date:new Date("2021-12-02"), duration: 5, progress:0.7},
        //       {id:3, planNumber:"3", deliveryTime:"2021-12-03", productNum:11,  open:true, tower:'3', start_date:new Date("2021-12-03"), duration: 4},
        //       {id:4, planNumber:"4", deliveryTime:"2021-12-04", productNum:11,  open:true, tower:'4', start_date:new Date("2021-12-04"), duration: 3},
        //       {id:5, planNumber:"5", deliveryTime:"2021-12-05", productNum:11,  open:true, tower:'5', start_date:new Date("2021-12-05"), duration: 2}, 
        //       {id:6, planNumber:"6", deliveryTime:"2021-12-06", productNum:11,  open:true, tower:'6', start_date:new Date("2021-12-06"), duration: 1}, 
        //       {id:6, planNumber:undefined, deliveryTime:"2021-12-07", productNum:12,  open:true, tower:'塔型7', start_date:new Date("2021-12-06"), duration: 1,parent:1}
        //   ]
        // };
        const tasks = {
          data: tasksNew
        }
        tasksNew&&gantt.parse(tasks);
        gantt.parse(tasks);
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
      this.props.history.push(`/planProd/planMgmt/detail/${task}`)
    }
    onFilterSubmit = (value: any) => {
      if (value.time) {
          const formatDate = value.time.map((item: any) => item.format("YYYY-MM-DD"))
          value.reinstatementDateStart = formatDate[0]+ ' 00:00:00';
          value.reinstatementDateEnd = formatDate[1]+ ' 23:59:59';
          delete value.time
      }
      // setFilterValue(value)
      return value
    }
    List = async () =>{
      const value = await RequestUtil.get(`/tower-science/drawProductSegment/getSegmentBySegmentGroupId`);
      return value
    }
    render() {
      return (<>
        <Form layout="inline" style={{margin:'20px'}} onFinish={this.onFilterSubmit}>
          <Form.Item label='生产计划号/塔型' name='materialName'>
              <Input/>
          </Form.Item>
          <Form.Item label='计划状态' name='structureTexture'>
              <Input/>
          </Form.Item>
          <Form.Item label='排产时间' name='time'>
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
