import React, { useState } from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps, useHistory } from 'react-router';
import styles from './WorkBench.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import { CommonTable, DetailTitle } from '../../common';
import Line from './Line';
import { CheckCircleOutlined, RightOutlined, SoundOutlined, DoubleRightOutlined } from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';
import { Spin, Table } from 'antd';
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
	readonly dataIndex?: string;
	readonly col?: number;
	readonly path?: string;
	readonly state?: number;
	readonly type?: string;
	readonly userId?: string;
	readonly createUserId?: string;
	readonly authority?: string;
	readonly weldingUserId?: string;
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
	const userId = AuthUtil.getUserId();
	const authorities = ApplicationContext.get().authorities;
	const workBenchList = [
		{
			title: '评估任务',
			child: [
				{
					title: '待确认',
					dataIndex: 'assessToBeConfirmed',
					path: '/assessmentTask/assessmentTaskList',
					state: 1,
					authority: 'assess_to_be_confirmed'
				}, {
					title: '待指派',
					dataIndex: 'assessToBeAssigned',
					path: '/assessmentTask/assessmentTaskList',
					state: 2,
					authority: 'assess_to_be_assigned'
				}, {
					title: '待提交',
					dataIndex: 'assessToBeSubmitted',
					path: '/assessmentTask/assessmentTaskList',
					state: 4,
					authority: 'assess_to_be_submitted'
				}
			]
		},
		{
			title: '确认任务',
			child: [
				{
					title: '待确认',
					dataIndex: 'confirmToBeConfirmed',
					path: '/confirmTask/ConfirmTaskMngt',
					state: 1,
					authority: 'confirm_to_be_confirmed'
				}, {
					title: '待指派',
					dataIndex: 'confirmToBeAssigned',
					path: '/confirmTask/ConfirmTaskMngt',
					state: 2,
					authority: 'confirm_to_be_assigned'
				}, {
					title: '待提交',
					dataIndex: 'confirmToBeSubmitted',
					path: '/confirmTask/ConfirmTaskMngt',
					state: 4,
					authority: 'confirm_to_be_submitted'
				}
			]
		},
		{
			title: '放样任务',
			child: [
				{
					title: '待确认',
					dataIndex: 'loftingToBeConfirmed',
					path: '/setOutTask/setOutTaskList',
					state: 1,
					authority: 'lofting_to_be_confirmed'
				}, {
					title: '待指派',
					dataIndex: 'loftingToBeAssigned',
					path: '/workMngt/scheduleList',
					state: 2,
					authority: 'lofting_to_be_confirmed'
				}, {
					title: '待提交',
					dataIndex: 'loftingToBeSubmitted',
					path: '/setOutTask/setOutTaskList',
					state: 4,
					authority: 'lofting_to_be_submitted'
				}
			]
		},
		{
			title: '评估任务',
			col: 2,
			child: [
				{
					title: '待完成',
					dataIndex: 'assessToBeComplete',
					path: '/workMngt/evaluationList',
					state: 3,
					userId: userId,
					authority: 'assess_to_be_complete'
				}
			]
		},
		{
			title: '确认任务',
			col: 2,
			child: [
				{
					title: '待完成',
					dataIndex: 'confirmToBeComplete',
					path: '/workMngt/confirmList',
					state: 3,
					userId: userId,
					authority: 'confirm_to_be_complete'
				}
			]
		},
		{
			title: '提料任务',
			child: [
				{
					title: '待提料',
					dataIndex: 'segmentMaterialToBeMaterial',
					path: '/workMngt/pickList',
					state: 2,
					authority: 'segment_material_to_be_material'
				}, {
					title: '待校核',
					dataIndex: 'segmentMaterialToBeCheck',
					path: '/workMngt/pickList',
					state: 2,
					authority: 'segment_material_to_be_check'
				}, {
					title: '待指派',
					dataIndex: 'materialToBeAssigned',
					path: '/workMngt/pickList',
					state: 1,
					userId: userId,
					authority: 'material_to_be_assigned'
				}, {
					title: '待配段',
					dataIndex: 'rodMaterialToBeMatch',
					path: '/workMngt/pickList',
					state: 3,
					userId: userId,
					authority: 'rod_material_to_be_match'
				}
			]
		},
		{
			title: '问题单',
			child: [
				{
					title: '我创建的-提料信息',//问题单-我创建的-提料信息-塔
					dataIndex: 'problemEstablish',
					path: '/question/questionMngt',
					type: 'WTD-TL',
					createUserId: userId,
					authority: 'problem_establish'
				}, {
					title: '我创建的-放样任务', //问题单-我创建的-放样任务-塔
					dataIndex: 'segmentProblemEstablish',
					path: '/question/questionMngt',
					type: 'WTD-FY',
					createUserId: userId,
					authority: 'segment_problem_establish'
				}, {
					title: '我创建的-螺栓',//问题单-我创建的-放样任务-螺栓
					dataIndex: 'boltProblemEstablish',
					path: '/question/questionMngt',
					type: 'WTD-LS',
					createUserId: userId,
					authority: 'bolt_problem_establish'
				}, {
					title: '待修改',//问题单-待修改
					dataIndex: 'problemPending',
					path: '/question/questionMngt',
					state: 1,
					userId: userId,
					authority: 'problem_pending'
				}
			]
		}, {
			title: '放样任务',
			child: [
				{
					title: '待指派',
					dataIndex: 'loftingToBeAssigned',
					path: '/workMngt/setOutList',
					state: 1,
					userId: userId,
					authority: 'product_to_be_assigned'
				}, {
					title: '待出单',
					dataIndex: 'rodProductToBeIssue',
					path: '/workMngt/setOutList',
					state: 4,
					authority: 'rod_product_to_be_issue'
				}, {
					title: '待配段',
					dataIndex: 'rodProductToBeMatch',
					path: '/workMngt/setOutList',
					state: 4,
					authority: 'rod_product_to_be_match'
				}, {
					title: '待校核',
					dataIndex: 'segmentProductToBeCheck',
					path: '/workMngt/setOutList',
					state: 2,
					userId: userId,
					authority: 'segment_product_to_be_check'
				}, {
					title: '待放样',
					dataIndex: 'segmentProductToBeLofting',
					path: '/workMngt/setOutList',
					state: 2,
					userId: userId,
					authority: 'segment_product_to_be_lofting'
				}
			]
		}, {
			title: '组焊工作',
			child: [
				{
					title: '待指派',
					dataIndex: 'weldingToBeAssigned',
					path: '/workMngt/assemblyWeldingList',
					state: 2,
					userId: userId,
					authority: 'welding_to_be_assigned'
				},
				{
					title: '待组焊',
					dataIndex: 'weldingToBeWelding',
					path: '/workMngt/assemblyWeldingList',
					state: 3,
					weldingUserId: userId,
					authority: 'welding_to_be_welding'
				}
			]
		}, {
			title: '螺栓列表',
			child: [
				{
					title: '待指派',
					dataIndex: 'boltToBeAssigned',
					path: '/workMngt/boltList',
					state: 2,
					weldingUserId: userId,
					authority: 'bolt_to_be_assigned'
				},
				{
					title: '待制作',
					dataIndex: 'boltToBeMade',
					path: '/workMngt/boltList',
					state: 3,
					userId: userId,
					authority: 'bolt_to_be_made'
				},
				{
					title: '待校核',
					dataIndex: 'boltToBeCheck',
					path: '/workMngt/boltList',
					state: 4,
					userId: userId,
					authority: 'bolt_to_be_check'
				}
			]
		}, {
			title: '小样图工作',
			col: 2,
			child: [
				{
					title: '待上传',
					dataIndex: 'sampleToBeUploaded',
					path: '/workMngt/sampleDrawList',
					state: 2,
					userId: userId,
					authority: 'sample_to_be_uploaded'
				}
			]
		}, {
			title: '图纸',
			col: 2,
			child: [
				{
					title: '待上传',
					dataIndex: 'drawToUpload',
					path: '/workMngt/templateList',
					state: 1,
					userId: userId,
					authority: 'draw_to_upload'
				}
			]
		}
	]

	const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
		const data = await RequestUtil.get(`/tower-science/workbench`);
		const announceData = await RequestUtil.get<IResponseData>(`/tower-system/notice/staff/list?size=10&state=1`);
		setAnnounceData(announceData.records)
		resole(data)
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
		return <div key={ind} className={res.col !== 2 ? styles.border : styles.border2}>
			<DetailTitle title={res.title} />
			<div>{
				res?.child && res?.child.map((item: IList, index: number) => {
					const dataIndex: string | undefined = item.dataIndex;
					if (authorities?.indexOf(item?.authority || '') === -1) {
						return null
					} else {
						return <div className={res.col !== 2 ? styles.content : styles.content2} key={ind + '_' + index} onClick={() => {
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
							<p>
								<CheckCircleOutlined style={{ paddingRight: "8px" }} />{item.title}<span className={styles.rightoutlined}><RightOutlined /></span>
							</p>
							<p className={styles.total}>{data && data[dataIndex || ''] === -1 ? 0 : data && data[dataIndex || ''] || 0}</p>
							<div className={styles.draw}>
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
							</div>
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
				<p>
					<SoundOutlined />公告通知
					<Link to={`/homePage/notice`} className={styles.more}>更多<DoubleRightOutlined /></Link>
				</p>
				<CommonTable dataSource={announceData} pagination={false} showHeader={false} columns={[{
					key: 'releaseTime',
					title: '时间',
					dataIndex: 'releaseTime',
				},
				{
					key: 'title',
					title: '文案',
					dataIndex: 'title',
					render: (_: string, record: Record<string, any>): React.ReactNode => (
						<Link to={`/homePage/notice/detail/${record.id}`}>{_}</Link>
					)
				}]} />
			</div>
			<div className={styles.notice}>
				<p><SoundOutlined /> 通知提醒</p>
				<Table dataSource={[]} pagination={false} showHeader={false} columns={[{
					key: 'time',
					title: '时间',
					dataIndex: 'time',
				},
				{
					key: 'description',
					title: '文案',
					dataIndex: 'description'
				}]} />
			</div>
		</div>
	</div>
}
