import React from 'react'
import styles from './WorkBench.module.less'
import RequestUtil from '../../../utils/RequestUtil'
import { DetailTitle } from '../../common'
import { scWork }  from "./sc.json"
import Icon, { SoundOutlined } from '@ant-design/icons'
import useRequest from '@ahooksjs/use-request'
import { Spin, Table } from 'antd'
import ApplicationContext from '../../../configuration/ApplicationContext'
import { useHistory } from 'react-router-dom'
export default function SWWorkBench(): React.ReactNode {
    const history = useHistory()
    const authorities = ApplicationContext.get().authorities
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const data: { [key: string]: any } = await RequestUtil.get(`/tower-market/workbench`);
        resole(data)
    }))

    return <Spin spinning={loading}>
        <div className={styles.all}>
            <div className={styles.left}>
                {scWork.map((item: any, ind: number) => <div key={ind} className={styles.workItem}>
                    <DetailTitle title={<>
                        <Icon component={() => <img
                            src={item.icon}
                            style={{
                                display: "inline-block",
                                width: 30,
                                height: 30,
                                marginRight: 14,
                                verticalAlign: "center"
                            }} />} />
                        <span style={{ verticalAlign: "sub" }}>{item.title}</span>
                    </>} style={{ background: "#f8f8f8", padding: "10px" }} />
                    {item.workbenchItemVos?.filter((itemVos: any) => authorities?.includes(itemVos.authority)).map((workbenchItem: any, index: number) => {
                        return <div key={index} className={styles.content}>
                            <div style={{ cursor: "pointer" }} onClick={() => history.push(workbenchItem.path)}>
                                <p className={styles.total}>{ typeof(data?.[item.dataIndex]) == "string"?data?.[item.dataIndex] : data?.[item.dataIndex]?.[workbenchItem.dataIndex] || 0}</p>
                                <p style={{ textAlign: "center" }}>{workbenchItem.title}</p>
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