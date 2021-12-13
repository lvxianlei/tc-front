import React from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { Button, DatePicker, Form, Input, Popconfirm, Select } from 'antd';
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
          {label:'计划号', name: "planNumber", tree: true, resize: true },
          {label:'塔型',name: "name", align: "center", resize: true, width: 100},
          {label:'基数',name: "productNum", align: "center"},
          {label:'重量',name: "weight", align: "center"},
          {label:'交货日期',name: "deliveryTime", align: "center"},
          {label:'计划状态',name: "planStatus", align: "center", template: function (task:any) {
            switch(task.planStatus){
              case 1: return '待排产'
              case 2: return '排产中'
              case 3: return '已排产'
            }
          }},
          {label:'操作',name: "buttons",width: 150, align: "center", template: function (task:any) {
            if(task.parent){
              // href='/planProd/planMgmt/detail/${task.id}/${task.planId}'
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
        const value = tree.length>0 && tree.reduce((res:any, item:any) => {
          const parent = {...item};
          delete parent.planProductCategoryVOList;
          return res.concat(item.planProductCategoryVOList.length>0&&item.planProductCategoryVOList.map((child:any) => ({...child,parent: parent.id})))
        }, []);
        const tasksNew = tree.length>0 &&tree.concat(value).map((item:any)=>{
          return {
            ...item,
            open:true,
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
          value.reinstatementDateStart = formatDate[0]+ ' 00:00:00';
          value.reinstatementDateEnd = formatDate[1]+ ' 23:59:59';
          delete value.time
      }
      const tree: any = await RequestUtil.get<any>('/tower-aps/productionPlan/thread',value);
      const valueN = tree.length>0 && tree.reduce((res:any, item:any) => {
        const parent = {...item};
        delete parent.planProductCategoryVOList;
        return res.concat(item.planProductCategoryVOList.length>0&&item.planProductCategoryVOList.map((child:any) => ({...child,parent: parent.id})))
      }, []);
      const tasksNew = tree.length>0 &&tree.concat(valueN).map((item:any)=>{
        return {
          ...item,
          open:true,
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
