import React from 'react'
import styles from '../rd/WorkBench.module.less'
import RequestUtil from '../../../utils/RequestUtil'
import { DetailTitle } from '../../common'
import { swWork } from "./sw.json"
import { CheckCircleOutlined, RightOutlined, SoundOutlined } from '@ant-design/icons'
import useRequest from '@ahooksjs/use-request'
import { Spin, Table } from 'antd'
import Line from '../rd/Line'
import ApplicationContext from '../../../configuration/ApplicationContext'
import { useHistory } from 'react-router-dom'
export default function SWWorkBench(): React.ReactNode {
    const history = useHistory()
    const authorities = ApplicationContext.get().authorities
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const data: { [key: string]: any } = await RequestUtil.get(`/tower-supply/workbench/getWorkbenchData`);
        resole(data)
    }))

    return <Spin spinning={loading}>
        <div className={styles.all}>
            <div className={styles.left}>
                {swWork.map((item: any, ind: number) => <div key={ind} className={item.col !== 2 ? styles.border : styles.border2}>
                    <DetailTitle title={item.title}></DetailTitle>
                    {item.workbenchItemVos?.filter((itemVos: any) => authorities?.includes(itemVos.authority)).map((workbenchItem: any, index: number) => {
                        return <div key={index} className={item.col !== 2 ? styles.content : styles.content2}>
                            <div style={{ cursor: "pointer" }} onClick={() => history.push(workbenchItem.path)}>
                                <p><CheckCircleOutlined style={{ paddingRight: "8px" }}/>{workbenchItem.title}<span className={styles.rightoutlined}><RightOutlined /></span></p>
                                <p className={styles.total}>{data?.[item.dataIndex]?.[workbenchItem.dataIndex] || 0}</p>
                                <div className={styles.draw}>
                                    <Line keyIndex={`${ind}${index}`}
                                        valueList={[
                                            Math.ceil(Math.random() * 80),
                                            Math.ceil(Math.random() * 100),
                                            Math.ceil(Math.random() * 150),
                                            Math.ceil(Math.random() * 100),
                                            Math.ceil(Math.random() * 90),
                                            Math.ceil(Math.random() * 100),
                                            Math.ceil(Math.random() * 100)
                                        ]} />
                                </div>
                            </div>
                        </div>
                    })}
                </div>)}
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
    </Spin>
}