import React from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps, useHistory } from 'react-router';
import styles from './WorkBench.module.less';
import RequestUtil from '../../utils/RequestUtil';
import { DetailTitle } from '../common';
import Line from './Line';
import { CheckCircleOutlined, RightOutlined, SoundOutlined } from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';
import { Spin, Table } from 'antd';

export interface WorkBenchMngtProps {}
export interface IWorkBenchMngtRouteProps extends RouteComponentProps<WorkBenchMngtProps>, WithTranslation {}

export interface WorkBenchMngtState {
	readonly data?: {};
}

interface IList {
	readonly title: string;
	readonly child?: IList[];
	readonly dataIndex?: string;
	readonly col?: number;
	readonly path?: string;
}

const directorList = [
	{
		title: '评估任务',
		child: [
			{
				title: '待确认',
				dataIndex: 'assessToBeConfirmed',
				path: '/assessmentTask',
			}, {
				title: '待指派',
				dataIndex: 'assessToBeAssigned',
				path: '/assessmentTask',
			}, {
				title: '待提交',
				dataIndex: 'assessToBeSubmitted',
				path: '/assessmentTask',
			}
		]
	}, {
		title: '确认任务',
		child: [
			{
				title: '待确认',
				dataIndex: 'confirmToBeConfirmed',
				path: '/confirmTask/ConfirmTaskMngt',
			}, {
				title: '待指派',
				dataIndex: 'confirmToBeAssigned',
				path: '/confirmTask/ConfirmTaskMngt',
			}, {
				title: '待提交',
				dataIndex: 'confirmToBeSubmitted',
				path: '/confirmTask/ConfirmTaskMngt',
			}
		]
	}, {
		title: '放样任务',
		child: [
			{
				title: '待确认',
				dataIndex: 'loftingToBeConfirmed',
				path: '/setOutTask',
			}, {
				title: '待指派',
				dataIndex: 'loftingToBeAssigned',
				path: '/setOutTask',
			}, {
				title: '待提交',
				dataIndex: 'loftingToBeSubmitted',
				path: '/setOutTask',
			}
		]
	},{
		title: '问题单',
		col: 2,
		child: [
			{
				title: '',
				dataIndex: 'questionnaire',
				path: '/question/questionMngt'
			}
		]
	}, {
		title: '审批',
		col: 2,
		child: [
			{
				title: '',
				dataIndex: 'examineAndApprove'
			}
		]
	}
]

const groupLeaderList = [
	{
		title: '提料工作',
		child: [
			{
				title: '待指派',
				dataIndex: 'materialToBeAssigned',
				path: '/workMngt/pickList'
			}, {
				title: '待提交提料',
				dataIndex: 'materialToBeSubmittedMaterial',
				path: '/workMngt/pickList'
			}, {
				title: '待汇总',
				dataIndex: 'materialToBeSummarized',
				path: '/workMngt/pickList'
			}
		]
	}, {
		title: '放样工作',
		child: [
			{
				title: '待指派',
				dataIndex: 'loftingToBeAssigned',
				path: '/workMngt/setOutList'
			}, {
				title: '待提交放样',
				dataIndex: 'loftingToBeSubmittedLofting',
				path: '/workMngt/setOutList'
			}, {
				title: '待提交组焊',
				dataIndex: 'loftingToBeSubmittedWelding',
				path: '/workMngt/setOutList'
			}, {
				title: '待汇总',
				dataIndex: 'loftingToBeSummarized',
				path: '/workMngt/setOutList'
			}
		]
	} 
]

const workmanList = [
	{
		title: '评估任务',
		col: 2,
		child: [
			{
				title: '待完成',
				dataIndex: 'assessToBeComplete',
				path: '/workMngt/evaluationList'
			}
		]
	}, {
		title: '确认任务',
		col: 2,
		child: [
			{
				title: '待完成',
				dataIndex: 'confirmToBeComplete',
				path: '/workMngt/confirmList'
			}
		]
	}, {
		title: '提料工作',
		child: [
			{
				title: '待提料',
				dataIndex: 'materialToBeMaterial',
				path: '/workMngt/pickList'
			}, {
				title: '待校核',
				dataIndex: 'materialToBeCheck',
				path: '/workMngt/pickList'
			}, {
				title: '待配段',
				dataIndex: 'materialToBeMatch',
				path: '/workMngt/pickList'
			}
		]
	}, {
		title: '放样工作',
		child: [
			{
				title: '待放样',
				dataIndex: 'loftingToBeLofting',
				path: '/workMngt/setOutList'
			}, {
				title: '待校核',
				dataIndex: 'loftingToBeCheck',
				path: '/workMngt/setOutList'
			}, {
				title: '待配段',
				dataIndex: 'loftingToBeMatch',
				path: '/workMngt/setOutList'
			}, {
				title: '待出单',
				dataIndex: 'loftingToBeIssue',
				path: '/workMngt/setOutList'
			}
		]
	}, {
		title: '组焊工作',
		child: [
			{
				title: '待组焊',
				dataIndex: 'weldingToBeWelding',
				path: '/workMngt/assemblyWeldingList'
			}, {
				title: '待校核',
				dataIndex: 'weldingToBeCheck',
				path: '/workMngt/assemblyWeldingList'
			}
		]
	}, {
		title: '小样图工作',
		child: [
			{
				title: '待上传',
				dataIndex: 'sampleToBeUploaded',
				path: '/workMngt/sampleDrawList'
			}, {
				title: '待校核',
				dataIndex: 'sampleToBeCheck',
				path: '/workMngt/sampleDrawList'
			}
		]
	}, {
		title: '螺栓工作',
		child: [
			{
				title: '待制作',
				dataIndex: 'boltToBeMade',
				path: '/workMngt/boltList'
			}, {
				title: '待校核',
				dataIndex: 'boltToBeCheck',
				path: '/workMngt/boltList'
			}
		]
	},
]
   
export default function WorkBenchMngt(): React.ReactNode { 
	const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/workbench`);
        resole(data)
    }), {})
    const detailData: any = data;
    const history = useHistory()
	if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }
	
	return <div className={ styles.all }>
		<div className={ styles.left }>
			{
				Object.keys(detailData.director).length > 0 ? directorList.map((res: IList, ind: number) => {
					return <div className={ res.col !== 2 ? styles.border : styles.border2 }>
						<DetailTitle title={ res.title }></DetailTitle>
						<div>
							{ 	
								res?.child && res?.child.map((item: IList, index: number) => {
									const dataIndex: string | undefined = item.dataIndex;
									return <div className={ res.col !== 2 ? styles.content : styles.content2 } key={ ind + '_' + index }>
										<p onClick={ () => { if( item.path) history.push(item.path) } }><CheckCircleOutlined />{ item.title }<span className={ styles.rightoutlined }><RightOutlined /></span></p>
										<p className={ styles.total }>{ detailData.director && detailData.director[dataIndex || ''] || 0 }</p>
										<div className={ styles.draw }><Line keyIndex={ dataIndex +'_'+index  } valueList={ [Math.ceil(Math.random()*80), Math.ceil(Math.random()*100), Math.ceil(Math.random()*150), Math.ceil(Math.random()*100), Math.ceil(Math.random()*90), Math.ceil(Math.random()*100), Math.ceil(Math.random()*100)] }/></div>
									</div>
								})
							}
						</div>
					</div>
				})
				: null
			}
			{
				Object.keys(detailData.leaderToDoVO).length > 0 ? groupLeaderList.map((res: IList, ind: number) => {
					return <div className={ res.col !== 2 ? styles.border : styles.border2 }>
						<DetailTitle title={ res.title }></DetailTitle>
						<div>
							{ 	
								res?.child && res?.child.map((item: IList, index: number) => {
									const dataIndex: string | undefined = item.dataIndex;
									return <div className={ res.col !== 2 ? styles.content : styles.content2 } key={ dataIndex + '_' + index }>
										<p><CheckCircleOutlined />{ item.title }<span className={ styles.rightoutlined }><RightOutlined /></span></p>
										<p className={ styles.total }>{ detailData.leaderToDoVO && detailData.leaderToDoVO[dataIndex || ''] || 0 }</p>
										<div className={ styles.draw }><Line keyIndex={ dataIndex + '_' +index  } valueList={ [Math.ceil(Math.random()*80), Math.ceil(Math.random()*100), Math.ceil(Math.random()*150), Math.ceil(Math.random()*100), Math.ceil(Math.random()*90), Math.ceil(Math.random()*100), Math.ceil(Math.random()*100)] }/></div>
									</div>
								})
							}
						</div>
					</div>
				})
				: null
			}
			{
				Object.keys(detailData.staffToDoVO).length > 0 ? workmanList.map((res: IList, ind: number) => {
					return  <div className={ res.col !== 2 ? styles.border : styles.border2 }>
						<DetailTitle title={ res.title }></DetailTitle>
						<div>
							{ 	
								res?.child && res?.child.map((item: IList, index: number) => {
									const dataIndex: string | undefined = item.dataIndex;
									return <div className={ res.col !== 2 ? styles.content : styles.content2 } key={ dataIndex + '_' + index }>
										<p><CheckCircleOutlined />{ item.title }<span className={ styles.rightoutlined }><RightOutlined /></span></p>
										<p className={ styles.total }>{ detailData.staffToDoVO && detailData.staffToDoVO[dataIndex || ''] || 0 }</p>
										<div className={ styles.draw }><Line keyIndex={ ind + '_' + index  } valueList={ [Math.ceil(Math.random()*80), Math.ceil(Math.random()*100), Math.ceil(Math.random()*150), Math.ceil(Math.random()*100), Math.ceil(Math.random()*90), Math.ceil(Math.random()*100), Math.ceil(Math.random()*100)] }/></div>
									</div>
								})
							}
						</div>
					</div>
				})
				: null
			}
		</div>
		<div className={ styles.right }>
			<div className={ styles.notice }>
				<p><SoundOutlined /> 公告通知</p>
				<Table dataSource={[]} pagination={ false } showHeader={ false } columns={[{
					key: 'time',
					title: '时间',
					dataIndex: 'time', 
				},
				{  
					key: 'description', 
					title: '文案', 
					dataIndex: 'description' 
				}]}/>
			</div>
			<div className={ styles.notice }>
				<p><SoundOutlined /> 通知提醒</p>
				<Table dataSource={[]} pagination={ false } showHeader={ false } columns={[{
						key: 'time',
						title: '时间',
						dataIndex: 'time', 
					},
					{  
						key: 'description', 
						title: '文案', 
						dataIndex: 'description' 
					}]}/>
			</div>
		</div>
	</div>
}
