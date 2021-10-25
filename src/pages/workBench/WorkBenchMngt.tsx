import React from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import styles from './WorkBench.module.less';
import RequestUtil from '../../utils/RequestUtil';
import { DetailTitle } from '../common';
import Line from './Line';
import { CheckCircleOutlined, RightOutlined } from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';
import { Col, Layout, Row, Spin } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';

export interface WorkBenchMngtProps {}
export interface IWorkBenchMngtRouteProps extends RouteComponentProps<WorkBenchMngtProps>, WithTranslation {

}

export interface WorkBenchMngtState {
	readonly data?: {};
}

interface IList {
	readonly title: string;
	readonly child?: IList[];
	readonly dataIndex?: string;
}

const directorList = [
	{
		title: '评估任务',
		child: [
			{
				title: '待确认',
				dataIndex: 'assessToBeConfirmed'
			}, {
				title: '待指派',
				dataIndex: 'assessToBeAssigned'
			}, {
				title: '待提交',
				dataIndex: 'assessToBeSubmitted'
			}
		]
	}, {
		title: '确认任务',
		child: [
			{
				title: '待确认',
				dataIndex: 'confirmToBeConfirmed'
			}, {
				title: '待指派',
				dataIndex: 'confirmToBeAssigned'
			}, {
				title: '待提交',
				dataIndex: 'confirmToBeSubmitted'
			}
		]
	}, {
		title: '放样任务',
		child: [
			{
				title: '待确认',
				dataIndex: 'loftingToBeConfirmed'
			}, {
				title: '待指派',
				dataIndex: 'loftingToBeAssigned'
			}, {
				title: '待提交',
				dataIndex: 'loftingToBeSubmitted'
			}
		]
	},{
		title: '问题单',
		child: [
			{
				title: '',
				dataIndex: 'questionnaire'
			}
		]
	}, {
		title: '审批',
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
				dataIndex: 'materialToBeAssigned'
			}, {
				title: '待提交提料',
				dataIndex: 'materialToBeSubmittedMaterial'
			}, {
				title: '待汇总',
				dataIndex: 'materialToBeSummarized'
			}
		]
	}, {
		title: '放样工作',
		child: [
			{
				title: '待指派',
				dataIndex: 'loftingToBeAssigned'
			}, {
				title: '待提交放样',
				dataIndex: 'loftingToBeSubmittedLofting'
			}, {
				title: '待提交组焊',
				dataIndex: 'loftingToBeSubmittedWelding'
			}, {
				title: '待汇总',
				dataIndex: 'loftingToBeSummarized'
			}
		]
	} 
]

const workmanList = [
	{
		title: '评估任务',
		child: [
			{
				title: '待完成',
				dataIndex: 'assessToBeComplete'
			}
		]
	}, {
		title: '确认任务',
		child: [
			{
				title: '待完成',
				dataIndex: 'confirmToBeComplete'
			}
		]
	}, {
		title: '提料工作',
		child: [
			{
				title: '待提料',
				dataIndex: 'materialToBeMaterial'
			}, {
				title: '待校核',
				dataIndex: 'materialToBeCheck'
			}, {
				title: '待配段',
				dataIndex: 'materialToBeMatch'
			}
		]
	}, {
		title: '放样工作',
		child: [
			{
				title: '待放样',
				dataIndex: 'loftingToBeLofting'
			}, {
				title: '待校核',
				dataIndex: 'loftingToBeCheck'
			}, {
				title: '待配段',
				dataIndex: 'loftingToBeMatch'
			}, {
				title: '待出单',
				dataIndex: 'loftingToBeIssue'
			}
		]
	}, {
		title: '组焊工作',
		child: [
			{
				title: '待组焊',
				dataIndex: 'weldingToBeWelding'
			}, {
				title: '待校核',
				dataIndex: 'weldingToBeCheck'
			}
		]
	}, {
		title: '小样图工作',
		child: [
			{
				title: '待上传',
				dataIndex: 'sampleToBeUploaded'
			}, {
				title: '待校核',
				dataIndex: 'sampleToBeCheck'
			}
		]
	}, {
		title: '螺栓工作',
		child: [
			{
				title: '待制作',
				dataIndex: 'boltToBeMade'
			}, {
				title: '待校核',
				dataIndex: 'boltToBeCheck'
			}
		]
	},
]
   
export default function WorkBenchMngt(): React.ReactNode { 
	const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/workbench`)
        resole(data)
    }), {})
    const detailData: any = data;
	if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }
	
	return <Row className={ styles.all }>
	<Col span={ 18 }>
		{
			detailData.director.lenght > 0 ? directorList.map((res: IList, ind: number) => {
				return <div className={ styles.border }>
					<DetailTitle title={ res.title }></DetailTitle>
					<div>
						{ 	
							res?.child && res?.child.map((item: IList, index: number) => {
								const dataIndex: string | undefined = item.dataIndex;
								return <div className={ styles.content } key={ ind + '_' + index }>
									<p><CheckCircleOutlined />{ item.title }<span className={ styles.rightoutlined }><RightOutlined /></span></p>
									<p className={ styles.total }>{ detailData.director && detailData.director[dataIndex || ''] || 0 }</p>
									<div className={ styles.draw }>{ index >= 0 ? <Line keyIndex={ ind +'_'+index  } valueList={ [Math.ceil(Math.random()*80), Math.ceil(Math.random()*100), Math.ceil(Math.random()*150), Math.ceil(Math.random()*100), Math.ceil(Math.random()*90), Math.ceil(Math.random()*100), Math.ceil(Math.random()*100)] }/> : null }</div>
								</div>
							})
						}
					</div>
				</div>
			})
			: null
		}
		{
			detailData.leaderToDoVO.lenght > 0 ? groupLeaderList.map((res: IList, ind: number) => {
				return <div className={ styles.border }>
					<DetailTitle title={ res.title }></DetailTitle>
					<div>
						{ 	
							res?.child && res?.child.map((item: IList, index: number) => {
								const dataIndex: string | undefined = item.dataIndex;
								return <div className={ styles.content } key={ ind + '_' + index }>
									<p><CheckCircleOutlined />{ item.title }<span className={ styles.rightoutlined }><RightOutlined /></span></p>
									<p className={ styles.total }>{ detailData.leaderToDoVO && detailData.leaderToDoVO[dataIndex || ''] || 0 }</p>
									<div className={ styles.draw }>{ index >= 0 ? <Line keyIndex={ ind +'_'+index  } valueList={ [Math.ceil(Math.random()*80), Math.ceil(Math.random()*100), Math.ceil(Math.random()*150), Math.ceil(Math.random()*100), Math.ceil(Math.random()*90), Math.ceil(Math.random()*100), Math.ceil(Math.random()*100)] }/> : null }</div>
								</div>
							})
						}
					</div>
				</div>
			})
			: null
		}
		{
			detailData.staffToDoVO.lenght > 0 ? workmanList.map((res: IList, ind: number) => {
				return <div className={ styles.border }>
					<DetailTitle title={ res.title }></DetailTitle>
					<div>
						{ 	
							res?.child && res?.child.map((item: IList, index: number) => {
								const dataIndex: string | undefined = item.dataIndex;
								return <div className={ styles.content } key={ ind + '_' + index }>
									<p><CheckCircleOutlined />{ item.title }<span className={ styles.rightoutlined }><RightOutlined /></span></p>
									<p className={ styles.total }>{ detailData.staffToDoVO && detailData.staffToDoVO[dataIndex || ''] || 0 }</p>
									<div className={ styles.draw }>{ index >= 0 ? <Line keyIndex={ ind +'_'+index  } valueList={ [Math.ceil(Math.random()*80), Math.ceil(Math.random()*100), Math.ceil(Math.random()*150), Math.ceil(Math.random()*100), Math.ceil(Math.random()*90), Math.ceil(Math.random()*100), Math.ceil(Math.random()*100)] }/> : null }</div>
								</div>
							})
						}
					</div>
				</div>
			})
			: null
		}
	</Col>
	<Col span={ 6 }>
		<Row>
			
		</Row>
		<Row>
			
		</Row>
	</Col>
	</Row>
}
