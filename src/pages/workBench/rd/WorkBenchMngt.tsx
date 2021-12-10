import React from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps, useHistory } from 'react-router';
import styles from './WorkBench.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import { DetailTitle } from '../../common';
import Line from './Line';
import { CheckCircleOutlined, RightOutlined, SoundOutlined } from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';
import { Spin, Table } from 'antd';
import AuthUtil from '../../../utils/AuthUtil';

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
}

export default function WorkBenchMngt(): React.ReactNode {
	const userId = AuthUtil.getUserId();
	const assessVO = [ //评估员
		{
			title: '评估任务',
			col: 2,
			child: [
				{
					title: '待完成',
					dataIndex: 'assessToBeComplete',
					path: '/workMngt/evaluationList',
					state: 3,
					userId: userId
				}
			]
		}
	]

	const boltLeaderVO = [ //螺栓负责人
		{
			title: '问题单',
			col: 2,
			child: [
				{
					title: '待修改',
					dataIndex: 'boltProblemPending',
					path: '/question/questionMngt',
					state: 1,
					userId: userId
				}
			]
		},
		{
			title: '螺栓列表',
			col: 2,
			child: [  
				{
					title: '待制作',
					dataIndex: 'boltToBeMade',
					path: '/workMngt/boltList',
					state: 2,
					userId: userId
				}
			]
		}
	]

	const confirmVO = [ //确认员
		{
			title: '确认任务',
			col: 2,
			child: [
				{
					title: '待完成',
					dataIndex: 'confirmToBeComplete',
					path: '/workMngt/confirmList',
					state: 3,
					userId: userId
				}
			]
		}
	]

	const director = [ //主任
		{
			title: '评估任务',
			child: [
				{
					title: '待确认',
					dataIndex: 'assessToBeConfirmed',
					path: '/assessmentTask',
					state: 1
				}, {
					title: '待指派',
					dataIndex: 'assessToBeAssigned',
					path: '/assessmentTask',
					state: 2
				}, {
					title: '待提交',
					dataIndex: 'assessToBeSubmitted',
					path: '/assessmentTask',
					state: 4
				}
			]
		}, {
			title: '确认任务',
			child: [
				{
					title: '待确认',
					dataIndex: 'confirmToBeConfirmed',
					path: '/confirmTask/ConfirmTaskMngt',
					state: 1
				}, {
					title: '待指派',
					dataIndex: 'confirmToBeAssigned',
					path: '/confirmTask/ConfirmTaskMngt',
					state: 2
				}, {
					title: '待提交',
					dataIndex: 'confirmToBeSubmitted',
					path: '/confirmTask/ConfirmTaskMngt',
					state: 4
				}
			]
		}, {
			title: '放样任务',
			child: [
				{
					title: '待确认',
					dataIndex: 'loftingToBeConfirmed',
					path: '/setOutTask',
					state: 1
				}, {
					title: '待指派',
					dataIndex: 'loftingToBeAssigned',
					path: '/workMngt/scheduleList',
					state: 2
				}, {
					title: '待提交',
					dataIndex: 'loftingToBeSubmitted',
					path: '/setOutTask',
					state: 4
				}
			]
		}
	]

	const drawVO = [ //图纸负责人
		{
			title: '图纸',
			col: 2,
			child: [
				{
					title: '待上传',
					dataIndex: 'drawToUpload',
					path: '/workMngt/templateList',
					state: 1,
					userId: userId
				}
			]
		}
	]

	const loftingLeaderVO = [ //放样负责人
		{
			title: '问题单',
			child: [
				{
					title: '待修改',
					dataIndex: 'segmentAndBoltProblemPending',
					path: '/question/questionMngt',
					state: 1,
					userId: userId
				},
				{
					title: '我创建的',
					dataIndex: 'segmentAndBoltProblemEstablish',
					path: '/question/questionMngt',
					createUserId: userId
				}
			]
		},
		{
			title: '螺栓列表',
			child: [  
				{
					title: '待制作',
					dataIndex: 'boltToBeMade',
					path: '/workMngt/boltList',
					state: 2,
					userId: userId
				},
				{
					title: '待校核',
					dataIndex: 'boltToBeMade',
					path: '/workMngt/boltList',
					state: 3
				}
				
			]
		},
		{
			title: '图纸',
			col: 2,
			child: [
				{
					title: '待上传',
					dataIndex: 'drawToUpload',
					path: '/workMngt/templateList',
					state: 1,
					userId: userId
				}
			]
		}, {
			title: '放样任务',
			child: [
				{
					title: '待指派',
					dataIndex: 'productToBeAssigned',
					path: '/workMngt/setOutList',
					state: 1,
					userId: userId
				}, {
					title: '待出单',
					dataIndex: 'productToBeSubmittedLofting',
					path: '/workMngt/setOutList',
					state: 4
				}, {
					title: '待配段',
					dataIndex: 'productToBeSubmittedWelding',
					path: '/workMngt/setOutList',
					state: 4
				}, {
					title: '待校核',
					dataIndex: 'segmentProductToBeCheck',
					path: '/workMngt/setOutList',
					state: 2,
					userId: userId
				}, {
					title: '待放样',
					dataIndex: 'segmentProductToBeLofting',
					path: '/workMngt/setOutList',
					state: 2,
					userId: userId
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
					userId: userId
				}
			]
		}, {
			title: '组焊工作',
			col: 2,
			child: [
				{
					title: '待组焊',
					dataIndex: 'weldingToBeWelding',
					path: '/workMngt/assemblyWeldingList',
					state: 2,
					userId: userId
				}
			]
		}
	]

	const loftingToCheckVO = [ //放样校核员
		{
			title: '问题单',
			col: 2,
			child: [
				{
					title: '放样任务',
					dataIndex: 'segmentProblemEstablish',
					path: '/question/questionMngt',
					type: 'WTD-FY',
					createUserId: userId
				}
			]
		}, {
			title: '放样任务',
			child: [
				{
					title: '待校核',
					dataIndex: 'segmentProductToBeCheck',
					path: '/workMngt/setOutList',
					state: 2
				}, {
					title: '待放样',
					dataIndex: 'segmentProductToBeLofting',
					path: '/workMngt/setOutList',
					state: 2
				}
			]
		}
	]

	const materialToCheckVO = [ //提料校核员
		{
			title: '提料任务',
			child: [
				{
					title: '待提料',
					dataIndex: 'segmentMaterialToBeMaterial',
					path: '/workMngt/pickList',
					state: 2
				}, {
					title: '待校核',
					dataIndex: 'segmentMaterialToBeCheck',
					path: '/workMngt/pickList',
					state: 2
				}
			]
		},
		{
			title: '问题单',
			child: [
				{
					title: '提料信息',
					dataIndex: 'materialProblemEstablish',
					path: '/question/questionMngt',
					type: 'WTD-TL',
					createUserId: userId
				}, 
				{
					title: '待修改',
					dataIndex: 'segmentProblemEstablish',
					path: '/question/questionMngt',
					type: 'WTD-TL',
					state: 1,
					userId: userId
				}
			]
		}
	]

	const materialToBeMatchVO = [ //提料/配段负责人
		{
			title: '提料任务',
			child: [
				{
					title: '待指派',
					dataIndex: 'materialToBeAssigned',
					path: '/workMngt/pickList',
					state: 1,
					userId: userId
				}, {
					title: '待提料',
					dataIndex: 'segmentMaterialToBeMaterial',
					path: '/workMngt/pickList',
					state: 2,
					userId: userId
				}, {
					title: '待校核',
					dataIndex: 'segmentMaterialToBeCheck',
					path: '/workMngt/pickList',
					state: 2
				}, {
					title: '待配段',
					dataIndex: 'rodMaterialToBeMatch',
					path: '/workMngt/pickList',
					state: 3,
					userId: userId
				}
			]
		}, {
			title: '问题单',
			child: [
				{
					title: '提料信息',
					dataIndex: 'materialProblemEstablish',
					path: '/question/questionMngt',
					type: 'WTD-TL',
					createUserId: userId
				}, {
					title: '待修改',
					dataIndex: 'materialProblemPending',
					path: '/question/questionMngt',
					type: 'WTD-TL',
					state: 1,
					userId: userId
				}
			]
		}
	]

	const sampleLeaderVO = [ //小样图负责人
		{
			title: '放样任务',
			col: 2,
			child: [
				{
					title: '待放样',
					dataIndex: 'segmentProductToBeLofting',
					path: '/workMngt/setOutList',
					state: 2
				}
			]
		},
		{
			title: '小样图',
			col: 2,
			child: [
				{
					title: '待上传',
					dataIndex: 'sampleToBeUploaded',
					path: '/workMngt/sampleDrawList',
					state: 2,
					userId: userId
				}
			]
		}
	]

	const weldingLeaderVO = [ //编程负责人
		{
			title: '问题单',
			child: [
				{
					title: '螺栓',
					dataIndex: 'boltProblemEstablish',
					path: '/question/questionMngt',
					type: 'WTD-LS',
					createUserId: userId
				}, {
					title: '待修改',
					dataIndex: 'boltProblemPending',
					path: '/question/questionMngt',
					type: 'WTD-LS',
					state: 1,
					userId: userId
				}
			]
		}, {
			title: '螺栓工作',
			col: 2,
			child: [
				{
					title: '待校核',
					dataIndex: 'boltToBeCheck',
					path: '/workMngt/boltList',
					state: 3
				}
			]
		}, {
			title: '放样任务',
			child: [
				{
					title: '待放样',
					dataIndex: 'segmentProductToBeLofting',
					path: '/workMngt/setOutList',
					state: 2
				}, {
					title: '待配段',
					dataIndex: 'rodProductToBeMatch',
					path: '/workMngt/setOutList',
					state: 4
				}, {
					title: '待出单',
					dataIndex: 'rodProductToBeIssue',
					path: '/workMngt/setOutList',
					state: 4
				}
			]
		}, {
			title: '组焊工作',
			child: [
				{
					title: '待组焊',
					dataIndex: 'weldingToBeWelding',
					path: '/workMngt/assemblyWeldingList',
					state: 2,
					userId: userId
				}
			]
		}
	]

	const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
		const data = await RequestUtil.get(`/tower-science/workbench`);
		resole(data)
	}), {})
	const detailData: any = data;
	const history = useHistory();
	console.log(userId)
	if (loading) {
		return <Spin spinning={loading}>
			<div style={{ width: '100%', height: '300px' }}></div>
		</Spin>
	}

	const getChildContent = (res: IList, ind: number, data: Record<string, any>) => {
		return <div key={ind} className={res.col !== 2 ? styles.border : styles.border2}>
			<DetailTitle title={res.title}></DetailTitle>
			<div>{
				res?.child && res?.child.map((item: IList, index: number) => {
					const dataIndex: string | undefined = item.dataIndex;
					return <div className={res.col !== 2 ? styles.content : styles.content2} key={ind + '_' + index}>
						<p onClick={() => { if (item.path) history.push({ pathname: item.path, state: { state: item?.state, type: item?.type, userId: item?.userId, createUserId: item?.createUserId} }) }}><CheckCircleOutlined />{item.title}<span className={styles.rightoutlined}><RightOutlined /></span></p>
						<p className={styles.total}>{data && data[dataIndex || ''] === -1 ? 0 : data && data[dataIndex || ''] || 0}</p>
						{/* <div className={styles.draw}><Line keyIndex={dataIndex + '_' + index} valueList={[Math.ceil(Math.random() * 80), Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 150), Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 90), Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 100)]} /></div> */}
					</div>
				})
			}</div>
		</div>
	}

	return <div className={styles.all}>
		<div className={styles.left}>
			{
				detailData.assessVO ? assessVO.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData.assessVO)}</>
				})
				: null
			}
			{
				detailData.boltLeaderVO ? boltLeaderVO.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData.boltLeaderVO)}</>
				})
				: null
			}
			{
				detailData.confirmVO ? confirmVO.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData.confirmVO)}</>
				})
				: null
			}
			{
				detailData.director ? director.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData.director)}</>
				})
				: null
			}
			{
				detailData.drawVO ? drawVO.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData.drawVO)}</>
				})
				: null
			}
			{
				detailData.loftingLeaderVO ? loftingLeaderVO.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData.loftingLeaderVO)}</>
				})
				: null
			}
			{
				detailData.loftingToCheckVO ? loftingToCheckVO.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData.loftingToCheckVO)}</>
				})
				: null
			}
			{
				detailData.materialToCheckVO ? materialToCheckVO.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData.materialToCheckVO)}</>
				})
				: null
			}
			{
				detailData.materialToBeMatchVO ? materialToBeMatchVO.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData.materialToBeMatchVO)}</>
				})
				: null
			}
			{
				detailData.sampleLeaderVO ? sampleLeaderVO.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData.sampleLeaderVO)}</>
				})
				: null
			}
			{
				detailData.weldingLeaderVO ? weldingLeaderVO.map((res: IList, ind: number) => {
					return <>{getChildContent(res, ind, detailData.weldingLeaderVO)}</>
				})
				: null
			}
		</div>
		<div className={styles.right}>
			<div className={styles.notice}>
				<p><SoundOutlined /> 公告通知</p>
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
