/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
 import { Button, ColProps, Table } from 'antd';
 import { ColumnsType } from 'antd/lib/table';
 import React from 'react';
 import { withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 
 import AbstractDetailComponent from '../../../components/AbstractDetailComponent';
 import ConfirmableButton from '../../../components/ConfirmableButton';
 import { ITabItem } from '../../../components/ITabableComponent';
 import SummaryRenderUtil, { IRenderdSummariableItem, IRenderedGrid } from '../../../utils/SummaryRenderUtil';
 
 export interface ITaskDetailProps {
     readonly id: string;
 }
 export interface ITaskDetailRouteProps extends RouteComponentProps<ITaskDetailProps> {}
 export interface ITaskDetailState {}
 
 /**
  * Contract detail page component.
  */
 class TaskDetail extends AbstractDetailComponent<ITaskDetailRouteProps, ITaskDetailState> {
 
     protected getTitle(): string {
         return `${ super.getTitle() }（<任务编号>）`;
     }
     
     /**
      * @implements
      * @description Gets subinfo col props
      * @returns subinfo col props 
      */
     public getSubinfoColProps(): ColProps[] {
         return [{
             span: 8,
             children: (
                 <span>内部合同编号：HT001</span>
             )
         }, {
             span: 8,
             children: (
                 <span>交货日期：2019-04-15 12:00</span>
             )
         }];
     }
 
     
     /**
      * @implements
      * @description Renders operation area
      * @returns operation area 
      */
     public renderOperationArea(): React.ReactNode | React.ReactNode[] {
         return [
             <Button key="new" href="/prom/task/new">新增</Button>,
             <Button key="edit" href={ `/prom/task/edit/${ this.props.match.params.id }`}>编辑</Button>,
             <ConfirmableButton key="delete" confirmTitle="要删除该合同吗？">删除</ConfirmableButton>,
             <Button key="special" href={ `/prom/task/special/${ this.props.match.params.id }`}>完善特殊要求</Button>,
             <Button key="product" href={ `/prom/task/product/${ this.props.match.params.id }`}>完善产品信息</Button>,
             <Button key="new" href={ `/prom/task/edit/${ this.props.match.params.id }`}>变更产品信息</Button>,
         ];
     }
 
     /**
      * @description Gets base info grid
      * @returns base info grid 
      */
     private getBaseInfoGrid(): IRenderedGrid {
         return {
             labelCol: {
                 span: 4
             },
             valueCol: {
                 span: 8
             },
             rows: [[{
                 label: '合同编号',
                 value: '12312312'
             },  {
                 label: '关联订单',
                 value: '12312312'
             }], [{
                 label: '关联合同',
                 value: '45678'
             },  {
                 label: '工程名称',
                 value: '12321312'
             }], [{
                 label: '工程简称',
                 value: '12312312'
             },  {
                 label: '业主单位',
                 value: '12321'
             }], [{
                 label: '合同签订单位',
                 value: '12312312'
             },  {
                 label: '合同签订日期',
                 value: '12321'
             }], [{
                 label: '客户交货日期',
                 value: '12312312'
             },  {
                 label: '计划交货日期',
                 value: '12321'
             }]]
         };
     }
 
     /**
      * @description Gets special info grid
      * @returns special info grid 
      */
      private getSpecialInfoGrid(): IRenderedGrid {
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 20
            },
            rows: [[{
                label: '原材料标准',
                value: '12312312'
            },  {
                label: '原材料要求',
                value: '12312312'
            }], [{
                label: '焊接要求',
                value: '45678'
            },  {
                label: '包装要求',
                value: '12321312'
            }], [{
                label: '镀锌要求',
                value: '12312312'
            },  {
                label: '备注',
                value: '12321'
            }]]
        };
    }
     /**
      * @description Gets order columns
      * @returns order columns 
      */
     private getOrderColumns(): ColumnsType<object> {
         return [{
             title: '序号',
             dataIndex: 'index'
         }, {
             title: '状态',
             dataIndex: 'status'
         }, {
             title: '线路名称',
             dataIndex: 'lineName'
         }, {
             title: '产品类型',
             dataIndex: 'type'
         }, {
             title: '塔型',
             dataIndex: 'towerType'
         }, {
             title: '杆塔号',
             dataIndex: 'towerNumber'
         }, {
             title: '电压等级（KV）',
             dataIndex: 'eLevel'
         }, {
             title: '呼高（米）',
             dataIndex: 'height'
         }, {
             title: '单位',
             dataIndex: 'unit'
         }, {
             title: '数量',
             dataIndex: 'count'
         }, {
             title: '单价',
             dataIndex: 'price'
         }, {
             title: '金额',
             dataIndex: 'amount'
         }, {
             title: '标段',
             dataIndex: 'tag'
         }, {
             title: '备注',
             dataIndex: 'description'
         }];
     }
 
     /**
      * @description Gets sys info grid
      * @returns sys info grid 
      */
     private getSysInfoGrid(): IRenderedGrid {
         return {
             labelCol: {
                 span: 4
             },
             valueCol: {
                 span: 8
             },
             rows: [[{
                 label: '最后编辑人',
                 value: '12312312'
             },{
                 label: '最后编辑时间',
                 value: '2019-03-15 17:27'
             }], [{
                 label: '创建人',
                 value: '12321312'
             }, {
                 label: '创建时间',
                 value: '2019-03-15 17:27'
             }]]
         };
     }
 
     /**
      * @description Gets order summariable items
      * @returns order summariable items 
      */
     private getOrderSummariableItems(): IRenderdSummariableItem[] {
         return [{
             fieldItems: [],
             render: (): React.ReactNode => (
                 <Table pagination={ false } bordered={ true } columns={ this.getOrderColumns() }/>
             )
         }];
     }
 
     /**
      * @description Gets charging record columns
      * @returns charging record columns 
      */
     private getChargingRecordColumns(): ColumnsType<object> {
         return [{
             title: '来款时间',
             dataIndex: 'chargingTime'
         }, {
             title: '来款单位',
             dataIndex: 'chargerOrg'
         }, {
             title: '来款方式',
             dataIndex: 'chargingType'
         }, {
             title: '来款金额（￥）',
             dataIndex: 'amount'
         }, {
             title: '币种',
             dataIndex: 'currency'
         }, {
             title: '汇率',
             dataIndex: 'exchangeRate'
         }, {
             title: '外币金额',
             dataIndex: 'foreignCurrencyExchange'
         }, {
             title: '收款银行',
             dataIndex: 'bank'
         }, {
             title: '备注',
             dataIndex: 'description'
         }];
     }
 
     /**
      * @description Gets charging record summariable items
      * @returns charging record summariable items 
      */
     private getChargingRecordSummariableItems(): IRenderdSummariableItem[] {
         return [{
             fieldItems: [{
                 label: '第1期回款计划',
                 value: '2019-04-01'
             }, {
                 label: '计划回款占比',
                 value: '33.33%'
             }, {
                 label: '计划回款金额',
                 value: '¥ 15,000.00'
             }, {
                 label: '已回款金额',
                 value: '¥ 5,000.00'
             }, {
                 label: '未回款金额',
                 value: '¥ 10,000.00'
             }],
             renderExtraInBar: (): React.ReactNode => (
                 <Button type="primary">添加</Button>
             ),
             render: (): React.ReactNode => (
                 <>
                     <Table pagination={ false } bordered={ true } columns={ this.getChargingRecordColumns() }/>
                     可以换成动态添加表单Form.List
                 </>
             )
         }, {
             fieldItems: [{
                 label: '第2期回款计划',
                 value: '2019-04-01'
             }, {
                 label: '计划回款占比',
                 value: '33.33%'
             }, {
                 label: '计划回款金额',
                 value: '¥ 15,000.00'
             }, {
                 label: '已回款金额',
                 value: '¥ 5,000.00'
             }, {
                 label: '未回款金额',
                 value: '¥ 10,000.00'
             }],
             renderExtraInBar: (): React.ReactNode => (
                 <Button type="primary">添加</Button>
             ),
             render: (): React.ReactNode => (
                 <>
                     <Table pagination={ false } bordered={ true } columns={ this.getChargingRecordColumns() }/>
                     可以换成动态添加表单Form.List
                 </>
             )
         }];
     }
 
     /**
      * @implements
      * @description Gets tab items
      * @returns tab items 
      */
     public getTabItems(): ITabItem[] {
         return [{
             label: '概况信息',
             key: 1,
             content: SummaryRenderUtil.renderSections([{
                 title: '基本信息',
                 render: (): React.ReactNode => SummaryRenderUtil.renderGrid(this.getBaseInfoGrid())
             }, {
                 title: '特殊要求',
                 render: (): React.ReactNode => SummaryRenderUtil.renderGrid(this.getSpecialInfoGrid())
            }, {
                 title: '产品信息',
                 render: (): React.ReactNode => SummaryRenderUtil.renderSummariableAreas(this.getOrderSummariableItems())
             }, {
                 title: '系统信息',
                 render: (): React.ReactNode => SummaryRenderUtil.renderGrid(this.getSysInfoGrid())
             }])
         }, {
             label: '相关附件',
             key: 2,
             content: SummaryRenderUtil.renderSections([{
                 title: '相关附件',
                 render: (): React.ReactNode => '可以用Table组件'
             }])
         }, {
             label: '回款记录',
             key: 3,
             content: SummaryRenderUtil.renderSections([{
                 title: '回款记录',
                 render: (): React.ReactNode => SummaryRenderUtil.renderSummariableAreas(this.getChargingRecordSummariableItems())
             }])
         }];
     }
 }
 
 export default withRouter(withTranslation()(TaskDetail));