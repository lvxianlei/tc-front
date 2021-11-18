import React from 'react'
import { useHistory } from 'react-router'
import styles from '../WorkBench.module.less'
import RequestUtil from '../../../utils/RequestUtil'
import { DetailTitle } from '../../common'
import { swWork } from "./sw.json"
import { CheckCircleOutlined, RightOutlined, SoundOutlined } from '@ant-design/icons'
import useRequest from '@ahooksjs/use-request'
import { Spin, Table } from 'antd'
export default function SWWorkBench(): React.ReactNode {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const data: { [key: string]: any } = await RequestUtil.get(`/tower-supply/workbench/getWorkbenchData`);
        resole(data)
    }))
    {/* <div className={item.col !== 2 ? styles.content : styles.content2} > */ }
    // <p ><CheckCircleOutlined />{item.title}<span className={styles.rightoutlined}><RightOutlined /></span></p>
    {/* <p className={styles.total}>2</p> */ }
    {/* <div className={styles.draw}><Line keyIndex={dataIndex + '_' + index} valueList={[Math.ceil(Math.random() * 80), Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 150), Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 90), Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 100)]} /></div> */ }
    {/* </div> */ }
    console.log(data)
    return <Spin spinning={loading}>
        <div className={styles.all}>
            <div className={styles.left}>
                {swWork.map((item: any, ind: number) => <div key={ind} className={item.col !== 2 ? styles.border : styles.border2}>
                    <DetailTitle title={item.title}></DetailTitle>
                    {item.dataIndex}
                    <div>{data?.[item.dataIndex].workbenchItemVos.map((workbenchItem: any) => {

                    })}
                    </div>
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