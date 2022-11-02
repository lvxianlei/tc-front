import React, { useState } from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps, useHistory } from 'react-router';
import styles from './WorkBench.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import { CommonTable, DetailTitle } from '../../common';
import Line from './Line';
import { CheckCircleOutlined, RightOutlined, SoundOutlined, DoubleRightOutlined } from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';
import { Spin, Table, Image } from 'antd';
import AuthUtil from '../../../utils/AuthUtil';
import ApplicationContext from '../../../configuration/ApplicationContext';
import { Link } from 'react-router-dom';

export interface WorkBenchMngtProps { }
export interface IWorkBenchMngtRouteProps extends RouteComponentProps<WorkBenchMngtProps>, WithTranslation { }

export interface WorkBenchMngtState {
	readonly data?: {};
}

interface IList {
	readonly title: string;
	readonly child?: IList[];
	readonly icon?: string;
	readonly dataIndex?: string;
	readonly col?: number;
	readonly path?: string;
	readonly state?: number;
	readonly type?: string;
	readonly userId?: string;
	readonly createUserId?: string;
	readonly authority?: string;
	readonly weldingUserId?: string;
	readonly url?: string;
}

export interface IResponseData {
	readonly total: number | undefined;
	readonly size: number | undefined;
	readonly current: number | undefined;
	readonly parentCode: string;
	readonly records: [];
	readonly paymentPlanVos: [];
}

export default function WorkBenchMngt(): React.ReactNode {
	const userId = AuthUtil.getUserInfo().user_id;
	const authorities = ApplicationContext.get().authorities;
	const host = window.location.hostname?.split('.')[0]?.split('-')[2] === 'gxhd' ? 'uat' : window.location.hostname?.split('.')[0]?.split('-')[2];
	const workBenchList = [
		{
			title: '评估任务',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E8%AF%84%E4%BC%B0%E4%BB%BB%E5%8A%A1.png',
			col: 4,
			child: [
				{
					title: '待确认',
					dataIndex: 'assessToBeConfirmed',
					path: '/taskMngt/assessmentTaskList',
					state: 1,
					authority: 'tc_erp_rd_workbench_work_assess_confirmed'
				}, {
					title: '待指派',
					dataIndex: 'assessToBeAssigned',
					path: '/taskMngt/assessmentTaskList',
					state: 2,
					authority: 'tc_erp_rd_workbench_work_assess_assigned'
				}, {
					title: '待提交',
					dataIndex: 'assessToBeSubmitted',
					path: '/taskMngt/assessmentTaskList',
					state: 4,
					authority: 'tc_erp_rd_workbench_work_assess_submitted'
				}
			]
		},
		{
			title: '确认任务',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E7%A1%AE%E8%AE%A4%E4%BB%BB%E5%8A%A1.png',
			col: 4,
			child: [
				// {
				// 	title: '待确认',
				// 	dataIndex: 'confirmToBeConfirmed',
				// 	path: '/taskMngt/ConfirmTaskMngt',
				// 	state: 1,
				// 	authority: 'tc_erp_rd_workbench_work_confirm_confirmed'
				// }, 
				{
					title: '待指派',
					dataIndex: 'confirmToBeAssigned',
					path: '/taskMngt/ConfirmTaskMngt',
					state: 2,
					authority: 'tc_erp_rd_workbench_work_confirm_assigned'
				}, {
					title: '待提交',
					dataIndex: 'confirmToBeSubmitted',
					path: '/taskMngt/ConfirmTaskMngt',
					state: 4,
					authority: 'tc_erp_rd_workbench_work_confirm_submitted'
				}
			]
		},
		{
			title: '放样任务',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E6%94%BE%E6%A0%B7%E4%BB%BB%E5%8A%A1.png',
			col: 4,
			child: [
				// {
				// 	title: '待确认',
				// 	dataIndex: 'loftingToBeConfirmed',
				// 	path: '/taskMngt/setOutTaskList',
				// 	state: 1,
				// 	authority: 'tc_erp_rd_workbench_work_lofting_confirmed'
				// }, 
				{
					title: '待指派',
					dataIndex: 'loftingToBeAssigned',
					path: '/workMngt/scheduleList',
					state: 2,
					authority: 'tc_erp_rd_workbench_work_lofting_assigned'
				}, {
					title: '待提交',
					dataIndex: 'loftingToBeSubmitted',
					path: '/taskMngt/setOutTaskList',
					state: 4,
					authority: 'tc_erp_rd_workbench_work_lofting_submitted'
				}
			]
		},
		{
			title: '评估任务',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E8%AF%84%E4%BC%B0%E4%BB%BB%E5%8A%A1.png',
			col: 4,
			child: [
				{
					title: '待完成',
					dataIndex: 'assessToBeComplete',
					path: '/workMngt/evaluationList',
					state: 3,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_assess_complete'
				}
			]
		},
		{
			title: '确认任务',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E7%A1%AE%E8%AE%A4%E4%BB%BB%E5%8A%A1.png',
			col: 4,
			child: [
				{
					title: '待完成',
					dataIndex: 'confirmToBeComplete',
					path: '/workMngt/confirmList',
					state: 3,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_confirm_complete'
				}
			]
		},
		{
			title: '提料任务',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E6%8F%90%E6%96%99%E4%BB%BB%E5%8A%A1.png',
			col: 4,
			child: [
				{
					title: '待提料',
					dataIndex: 'segmentMaterialToBeMaterial',
					path: '/workMngt/pickList',
					state: 2,
					authority: 'tc_erp_rd_workbench_work_material_material'
				}, {
					title: '待校核',
					dataIndex: 'segmentMaterialToBeCheck',
					path: '/workMngt/pickList',
					state: 2,
					authority: 'tc_erp_rd_workbench_work_material_check'
				}, {
					title: '待指派',
					dataIndex: 'materialToBeAssigned',
					path: '/workMngt/pickList',
					state: 1,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_material_assigned'
				}, {
					title: '待配段',
					dataIndex: 'rodMaterialToBeMatch',
					path: '/workMngt/pickList',
					state: 3,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_rod_material_match'
				}
			]
		},
		{
			title: '问题单',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E9%97%AE%E9%A2%98%E5%8D%95.png',
			col: 4,
			child: [
				{
					title: '提料信息',//问题单-我创建的-提料信息-塔
					dataIndex: 'problemEstablish',
					path: '/question/questionMngt',
					type: 'WTD-TL',
					createUserId: userId,
					authority: 'tc_erp_rd_workbench_work_material_problem_establish'
				}, {
					title: '放样任务', //问题单-我创建的-放样任务-塔
					dataIndex: 'segmentProblemEstablish',
					path: '/question/questionMngt',
					type: 'WTD-FY',
					createUserId: userId,
					authority: 'tc_erp_rd_workbench_work_loft_problem_establish'
				}, {
					title: '螺栓',//问题单-我创建的-放样任务-螺栓
					dataIndex: 'boltProblemEstablish',
					path: '/question/questionMngt',
					type: 'WTD-LS',
					createUserId: userId,
					authority: 'tc_erp_rd_workbench_work_bolt_problem_establish'
				}, {
					title: '待修改',//问题单-待修改
					dataIndex: 'problemPending',
					path: '/question/questionMngt',
					state: 1,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_problem_pending'
				}
			]
		},
		{
			title: '组焊工作',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E7%BB%84%E7%84%8A%E5%B7%A5%E4%BD%9C.png',
			col: 4,
			child: [
				{
					title: '待组焊',
					dataIndex: 'weldingToBeWelding',
					path: '/workMngt/assemblyWeldingList',
					state: 2,
					weldingUserId: userId,
					authority: 'tc_erp_rd_workbench_work_welding_welding'
				}
			]
		},
		{
			title: '螺栓列表',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E7%BC%96%E7%BB%84%2021.png',
			col: 4,
			child: [
				{
					title: '待指派',
					dataIndex: 'boltToBeAssigned',
					path: '/workMngt/boltList',
					state: 1,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_bolt_assigned'
				},
				{
					title: '待制作',
					dataIndex: 'boltToBeMade',
					path: '/workMngt/boltList',
					state: 2,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_bolt_made'
				},
				{
					title: '待校核',
					dataIndex: 'boltToBeCheck',
					path: '/workMngt/boltList',
					state: 4,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_bolt_check'
				}
			]
		},
		{
			title: '小样图工作',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E5%B0%8F%E6%A0%B7%E5%9B%BE.png',
			col: 4,
			child: [
				{
					title: '待上传',
					dataIndex: 'sampleToBeUploaded',
					path: '/workMngt/sampleDrawList',
					state: 1,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_sample_uploaded'
				}
			]
		},
		{
			title: '图纸',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E5%9B%BE%E7%BA%B8.png',
			col: 4,
			child: [
				{
					title: '待上传',
					dataIndex: 'drawToUpload',
					path: '/workMngt/templateList',
					state: 1,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_draw_to_upload'
				}
			]
		},
		{
			title: '放样任务',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E6%94%BE%E6%A0%B7%E4%BB%BB%E5%8A%A1.png',
			col: 5,
			child: [
				{
					title: '待指派',
					dataIndex: 'loftingToBeAssigned',
					path: '/workMngt/setOutList',
					state: 1,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_lofting_assigned'
				},
				{
					title: '待出单',
					dataIndex: 'rodProductToBeIssue',
					path: '/workMngt/setOutList',
					state: 4,
					authority: 'tc_erp_rd_workbench_work_loft_rod_match'
				},
				{
					title: '待配段',
					dataIndex: 'rodProductToBeMatch',
					path: '/workMngt/setOutList',
					state: 4,
					authority: 'tc_erp_rd_workbench_work_loft_rod_match'
				},
				{
					title: '待校核',
					dataIndex: 'segmentProductToBeCheck',
					path: '/workMngt/setOutList',
					state: 2,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_loft_product_check'
				},
				{
					title: '待放样',
					dataIndex: 'segmentProductToBeLofting',
					path: '/workMngt/setOutList',
					state: 2,
					userId: userId,
					authority: 'tc_erp_rd_workbench_work_loft_product_lofting'
				}
			]
		},
		{
			title: '审批',
			icon: 'https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/rd%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%9B%BE%E6%A0%872/%E6%94%BE%E6%A0%B7%E4%BB%BB%E5%8A%A1.png',
			col: 4,
			child: [
				{
					title: '待办事宜',
					dataIndex: 'todo',
					url: `http://workflow-${host}.dhwy.cn/#/tower/flowTodo`,
					authority: ''
				},
				{
					title: '已办事宜',
					dataIndex: 'done',
					url: `http://workflow-${host}.dhwy.cn/#/tower/flowDone`,
					authority: ''
				},
				{
					title: '抄送事宜',
					dataIndex: 'circulate',
					url: `http://workflow-${host}.dhwy.cn/#/tower/flowCirculate`,
					authority: ''
				},
				{
					title: '我发起的',
					dataIndex: 'launch',
					url: `http://workflow-${host}.dhwy.cn/#/tower/flowLaunch`,
					authority: ''
				}
			]
		}
	]

	const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
		const data = await RequestUtil.get<any>(`/tower-science/workbench`);
		const announceData = await RequestUtil.get<IResponseData>(`/tower-system/notice/staff/list?size=10&state=1`);
		const result = await RequestUtil.get<any>(`/tower-workflow/workflow/Engine/FlowBefore/count`);
		setAnnounceData(announceData.records)
		resole({
			...data,
			...result
		})
	}), {})
	const detailData: any = data;
	const history = useHistory();
	const [announceData, setAnnounceData] = useState([]);
	if (loading) {
		return <Spin spinning={loading}>
			<div style={{ width: '100%', height: '300px' }}></div>
		</Spin>
	}

	const getChildContent = (res: IList, ind: number, data: Record<string, any>) => {
		return <div key={ind} className={res.col === 4 ? styles.border : styles.border2}>
			<div style={{ padding: '10px', display: 'flex' }}>
				<div>
					<span style={{ marginRight: "10px" }}><img src={res.icon} /></span>
					<span className={styles.detailTitle}>{res.title}</span>
				</div>
			</div>
			<div style={{ backgroundColor: "#fff", }}>{
				res?.child && res?.child.map((item: IList, index: number) => {
					const dataIndex: string | undefined = item.dataIndex;
					if (authorities?.indexOf(item?.authority || '') === -1) {
						if (res.title === '审批') {
							return <div className={res.col === 4 ? styles.content : styles.content2}
								style={res.col && res.col !== 4 ? { width: `${((res?.col) * 10 + 11) / res?.col}%` } : { width: '22%' }}
								key={ind + '_' + index} onClick={() => {
									if (item.url) {
										window.open(item.url)
									}
								}}>
								<div className={styles.total}>{data && data[dataIndex || ''] === -1 ? 0 : data && data[dataIndex || ''] || 0}</div>
								<div style={{ textAlign: 'center' }}>
									{item.title}
								</div>
							</div>
						} else {
							return null
						}
					} else {
						return <div className={res.col === 4 ? styles.content : styles.content2}
							style={res.col && res.col !== 4 ? { width: `${((res?.col) * 10 + 11) / res?.col}%` } : { width: '22%' }}
							key={ind + '_' + index} onClick={() => {
								if (item.path) {
									history.push({
										pathname: item.path,
										state: {
											state: item?.state,
											type: item?.type,
											userId: item?.userId,
											createUserId: item?.createUserId,
											weldingUserId: item?.weldingUserId
										}
									})
								}
							}}>
							<div className={styles.total}>{data && data[dataIndex || ''] === -1 ? 0 : data && data[dataIndex || ''] || 0}</div>
							<div style={{ textAlign: 'center' }}>
								{item.title}
							</div>
							{/* <div className={styles.draw}>
								<Line
									keyIndex={dataIndex + '_' + index}
									valueList={[
										Math.ceil(Math.random() * 80),
										Math.ceil(Math.random() * 100),
										Math.ceil(Math.random() * 150),
										Math.ceil(Math.random() * 100),
										Math.ceil(Math.random() * 90),
										Math.ceil(Math.random() * 100),
										Math.ceil(Math.random() * 100)
									]}
								/>
							</div> */}
						</div>
					}
				})
			}</div>
		</div>
	}

	return <div className={styles.workBench}>
		<div className={styles.left}>
			{
				detailData ? workBenchList.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData)}</>
				})
					: null
			}
		</div>
		<div className={styles.right}>
			<div className={styles.notice}>
				<p >
					公告
					<Link to={`/homePage/notice`} className={styles.more}>更多<RightOutlined /></Link>
				</p>
				<CommonTable dataSource={announceData} pagination={false} showHeader={false} columns={[
					{
						key: 'title',
						title: '文案',
						dataIndex: 'title',
						render: (_: string, record: Record<string, any>): React.ReactNode => (
							<span onClick={() => { history.push(`/homePage/notice/detail/${record.id}`) }} className={styles.titleColor}>{_.length > 18 ? _.slice(0, 18) + '...' : _}</span>
						)
					}, {
						key: 'releaseTime',
						title: '时间',
						dataIndex: 'releaseTime',
					}]} />
			</div>
			<div className={styles.notice}>
				<p> 提醒</p>
				<Table dataSource={[]} pagination={false} showHeader={false} columns={[
					{
						key: 'description',
						title: '文案',
						dataIndex: 'description',
						render: (_: string, record: Record<string, any>): React.ReactNode => (
							<span>{_.length > 18 ? _.slice(0, 18) + '...' : _}</span>
						)
					}, {
						key: 'time',
						title: '时间',
						dataIndex: 'time',
					}]} />
			</div>
		</div>
	</div>
}
