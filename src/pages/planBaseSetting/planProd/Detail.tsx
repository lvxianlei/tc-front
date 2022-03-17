import React from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { Button, DatePicker, Form, Input, message, Popconfirm, Select, Space } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import { DetailContent } from '../../common';
import { RouteComponentProps, withRouter } from 'react-router';
import { withTranslation, WithTranslation } from 'react-i18next';
import moment from 'moment';
import DataSource from '../../cockpit/rawMaterial/DataSource';
export interface IRouteProps extends RouteComponentProps<any>, WithTranslation {}
export interface WithSectionModalProps {
  planId: any;
  id: string;
}
export interface IWithSectionModalRouteProps extends RouteComponentProps<WithSectionModalProps>, WithTranslation {
    readonly id: number | string;
    readonly updateList: () => void;
    value:IDetail;
    dataSource: {
      data:any
    };
}
export interface WithSectionModalState {
  value:IDetail,
  dataSource?:any
}
interface IDetail{
  name?: string;
  productNum?: string;
  startTime?:string;
  weight?: number;
  endTime?: string;
}
class Gantt extends React.Component<IWithSectionModalRouteProps, WithSectionModalState> {

    /**
       * @constructor
       * Creates an instance of AbstractMngtComponent.
       * @param props 
       */
    constructor(props: IWithSectionModalRouteProps) {
      super(props);
      this.state={
        dataSource:[],
        value: {
          name: '',
          productNum: '',
          startTime:'',
          weight: 0,
          endTime: ''
        }
      } 
      this.onLock = this.onLock.bind(this);
      this.onUnLock = this.onUnLock.bind(this);
      this.onConfirm = this.onConfirm.bind(this);
    }
    onUnLock=async (id:any)=>{
      await RequestUtil.post<any>(`/tower-aps/planUnitLink/unlock?id=${id}`).then(()=>{
        message.success('解锁成功！')
      }).then(async ()=>{
        // this.props.history.go(0)
        const value = this.state.dataSource.data.map((item:any)=>{
          return{
            ...item,
            status: item.id===id?1:item.status
          }
        })
        const newValue={
          data: value
        }
        this.setState({
          dataSource: newValue
        })
        gantt.parse(newValue)
        gantt.render();
      });
    }
    onLock=async (id:any)=>{
      await RequestUtil.post<any>(`/tower-aps/planUnitLink/lock?id=${id}`).then(()=>{
        message.success('锁定成功！')
      }).then(async ()=>{
        // this.props.history.go(0)
        const value = this.state.dataSource.data.map((item:any)=>{
          return{
            ...item,
            status: item.id===id?2:item.status
          }
        })
        const newValue={
          data: value
        }
        this.setState({
          dataSource: newValue
        })
        gantt.parse(newValue)
        gantt.render();
      });
    }
    onConfirm =async (id:any)=>{
      await RequestUtil.post<any>(`/tower-aps/planUnitLink/issue?id=${id}`).then(()=>{
        message.success('下发成功！')
      }).then(async ()=>{
        // this.props.history.go(0)
        const value = this.state.dataSource.data.map((item:any)=>{
          return{
            ...item,
            status: item.id===id?3:item.status
          }
        })
        const newValue={
          data: value
        }
        this.setState({
          dataSource: newValue
        })
        gantt.parse(newValue)
        gantt.render();
      });
    }
    componentDidUpdate() {
  
      gantt.render();
    }
    async componentDidMount() {
        gantt.clearAll();
        let tree: any = {};
        tree = await RequestUtil.get<any>(`/tower-aps/productionPlan/unitLinks`,{
          planProductCategoryId:this.props.match.params.id,
        });
        
        
        gantt.config.column_width = 20;
        gantt.config.columns = [
          {label:'生产环节', name: "linkName",  resize: true, width:130 , template: function (task:any) {
            return (
              `
              <span  title="${task.linkName}" >${task.linkName}</span>
              `
            );
          }},
          {label:'生产单元',name: "unitName", align: "center", resize: true, width:120, template: function (task:any) {
            return (
              `
              <span  title="${task.unitName}" >${task.unitName}</span>
              `
            );
          }},
          {label:'开始时间',name: "startTime", align: "center", width:100 , template: function (task:any) {
            return (
              `
            ${moment(task.startTime).format('YYYY-MM-DD')}
              `
            );
          }},
          {label:'结束时间',name: "endTime", align: "center", width:100, template: function (task:any) {
            return (
              `
            ${moment(task.endTime).format('YYYY-MM-DD')}
              `
            );
          }},
          {label:'状态',name: "status", align: "center", width:70 , template: function (task:any) {
            switch(task.status){
              case 1:
                return '待排产'
              case 2:
                return '已锁定'
              case 3:
                return '已下发'
              case 4:
                return '已下达'
              case 5:
                return '已完成'
            }
          }},
          {label:'操作',name: "buttons",width: 100, align: "left", template: function (task:any) {
            if(task.status===1){
              
              return (
                `
                <a style="color:#FF8C00" id='view'>查看</a>
                <a style="color:#FF8C00" id='lock'>锁定</a>
                <a style="color:#FF8C00" id='edit' >编辑</a>
                `
              );
            
          
          }
          else if(task.status===2){
            return (
              `
              <a style="color:#FF8C00" id='view'>查看</a>
              <a style="color:#FF8C00" id='unLock'>解锁</a>
              <a style="color:#FF8C00" id='edit' >编辑</a>
             
              `
            );
          }  
            
          else{
            return (
              `
              <a style="color:#FF8C00" id='view'>查看</a> 
             
              `
            );
          }
          }  
           
            
        }
        ];
        gantt.templates.task_text = function(start,end,task){
          return task.linkName?`<b title='生产环节:${task.linkName}'>生产环节:</b> `+task.linkName:`<b  title='生产环节:-'>生产环节:</b> `+"-";
        };
        gantt.config.scales = [
          {unit:"day", step:1, date:"%d" },
          {unit:"month", step:1, date:"%F, %Y" },
          // {unit:"year", step:1, date:"%Y" }
        ];

        gantt.config.row_height = 22;

        gantt.config.static_background = true;
        gantt.config.start_date = new Date();
        // gantt.config.end_date = new Date(2021, 0, 1);
        
        gantt.config.drag_resize = false;//拖拽工期
        gantt.config.drag_progress = false;//拖拽进度
        gantt.config.drag_links = false;//通过拖拽的方式新增任务依赖的线条
        gantt.config.drag_move = false;
        gantt.config.layout = {
          css: "gantt_container",
          cols: [
           {
             width: 620,
             min_width: 100,
         
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
        gantt.init("ganttDetail");
        gantt.i18n.setLocale("cn");
        const tasksNew = tree.planUnitLinkVOList&&tree.planUnitLinkVOList.length>0 ? tree.planUnitLinkVOList.map((item:any)=>{
          return {
            ...item,
            open:true,
            start_date: item.startTime?new Date(item.startTime+' 00:00:00'): new Date(),
            name: item.name?item.name:item.productCategoryNum,
            deliveryTime: item.deliveryTime?moment(item.deliveryTime).format('YYYY-MM-DD'):undefined,
            planNumber:item.planNumber?item.planNumber:undefined,
            end_date: item.endTime?new Date(item.endTime+' 23:59:59'): new Date()
          }
        }):[];
        this.setState({
          value:tree
        })
        const tasks={
          data:tasksNew
        };
        this.setState({
          dataSource: tasks
        })
        gantt.parse(tasks);
        gantt.detachAllEvents();
        gantt.attachEvent("onTaskDblClick", function(id:any, e:any) {
          console.log(id)
        },'');
        gantt.attachEvent("onTaskClick", async (id:any, e:any) => {
          if(e.target.id === 'view'){
            this.props.history.push(`/planProd/planMgmt/detail/${this.props.match.params.id}/${this.props.match.params.planId}/view/${id}`)
          }
          if(e.target.id === 'edit'){
            this.props.history.push(`/planProd/planMgmt/detail/${this.props.match.params.id}/${this.props.match.params.planId}/edit/${id}`)
          }
          if(e.target.id === 'lock'){
            this.onLock(id);
          }
          if(e.target.id === 'unLock'){
            this.onUnLock(id);
          }
          if(e.target.id === 'confirm'){
            this.onConfirm(id);
          }
          
          return e
        },'');
    }
    onFilterSubmit = async (value: any) => {
      if (value.time) {
          const formatDate = value.time.map((item: any) => item.format("YYYY-MM-DD"))
          value.startTime = formatDate[0]+ ' 00:00:00';
          value.endTime = formatDate[1]+ ' 23:59:59';
          delete value.time
      }
      gantt.clearAll();
      const tree = await RequestUtil.get<any>(`/tower-aps/productionPlan/unitLinks`,{
        planProductCategoryId:this.props.match.params.id,
        ...value
      });
      const tasksNew = tree.planUnitLinkVOList&&tree.planUnitLinkVOList.length>0 ? tree.planUnitLinkVOList.map((item:any)=>{
        return {
          ...item,
          open:true,
          start_date: item.startTime?new Date(item.startTime+' 00:00:00'): new Date(),
          name: item.name?item.name:item.productCategoryNum,
          deliveryTime: item.deliveryTime?moment(item.deliveryTime).format('YYYY-MM-DD'):undefined,
          planNumber:item.planNumber?item.planNumber:undefined,
          end_date: item.endTime?new Date(item.endTime+' 23:59:59'): new Date()
        }
      }):[];
      this.setState({
        value:tree
      })
      const tasks={
        data:tasksNew
      };
      this.setState({
        dataSource: tasks
      })
      gantt.parse(tasks);
    }

    
    render() {
      
      return (<DetailContent operation={[
            <Space>
                <Button key="goback" onClick={()=>{this.props.history.push(`/planProd/planMgmt`)}}>返回</Button>
            </Space>
        ]}>
          <Form layout="inline" style={{margin:'20px'}} onFinish={this.onFilterSubmit}>
              <Form.Item label='状态' name='planUnitLinkStatus'>
                  <Select placeholder="请选择" style={{ width: "150px" }}>
                      <Select.Option value={''} key="">全部</Select.Option>
                      <Select.Option value={1} key="1">待排产</Select.Option>
                      <Select.Option value={2} key="2">已锁定</Select.Option>
                      <Select.Option value={3} key="3">已下发</Select.Option>
                      <Select.Option value={4} key="4">已下达</Select.Option>
                      <Select.Option value={5} key="5">已完成</Select.Option>
                  </Select>
              </Form.Item>
              <Form.Item label='时间范围' name='time'>
                  <DatePicker.RangePicker format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item>
                  <Button type="primary" htmlType="submit">查询</Button>
              </Form.Item>
              <Form.Item>
                  <Button htmlType="reset">重置</Button>
              </Form.Item>
            </Form>
            <Button type='primary' onClick={()=>{this.props.history.push(`${this.props.history?.location?.pathname}/add`)}} style={{margin:'10px'}}> 新增</Button>
            <div>
              <Space>
                <span>塔型：{this.state.value.name}</span>
                <span>基数：{this.state.value.productNum}</span>
                <span>重量（T）：{this.state.value.weight}</span>
                <span>开始时间：{this.state.value.startTime}</span>
                <span>结束时间：{this.state.value.endTime}</span>
              </Space>
            </div>
            <div id="ganttDetail" style={{width:'calc(100vw - 280px)', height:'800px'}}></div>
        </DetailContent>
      );
    }
  }
export default withRouter(withTranslation('translation')(Gantt))
