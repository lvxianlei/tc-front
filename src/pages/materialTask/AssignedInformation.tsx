/**
 * @author zyc
 * @copyright © 2022
 * @description 提料任务-指派信息
 */

 import React, {forwardRef } from "react"
 import { Spin, Descriptions } from 'antd'
 import { CommonTable, DetailTitle } from '../common'
 import RequestUtil from '../../utils/RequestUtil'
 import useRequest from '@ahooksjs/use-request'
 import styles from './MaterialTaskList.module.less';
 import { IMaterialTask } from "./MaterialTaskList"
 
 export interface EditProps {
     id: string
 }

 
 export default forwardRef(function Edit({ id }: EditProps, ref) {
 
     const { loading, data } = useRequest<IMaterialTask>(() => new Promise(async (resole, reject) => {
         try {
             const result: IMaterialTask = await RequestUtil.get<IMaterialTask>(`/tower-aps/work/center/info/${id}`)
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { refreshDeps: [id] })
 
 
     const tableColumns = [
         {
             key: 'index',
             title: '序号',
             dataIndex: 'index',
             width: 120
         },
         {
             key: 'processId',
             title: '操作部门',
             dataIndex: 'processId',
             width: 100
         },
         {
             key: 'user',
             title: '操作人',
             dataIndex: 'user',
             width: 220,
            
         },
         {
             key: 'specificationName',
             title: '操作时间',
             dataIndex: 'specificationName',
             width: 120
         },
         {
             key: 'materialTextureName',
             title: '操作',
             dataIndex: 'materialTextureName',
             width: 150
         },
         {
             key: 'workHour',
             title: '备注',
             dataIndex: 'workHour',
             width: 180
         }
     ]
 
 
     return <Spin spinning={loading}>
         <DetailTitle title="指派信息"/>
         <Descriptions bordered column={6} className={styles.heightScroll}>
                <Descriptions.Item label="塔型">
                    塔型
                </Descriptions.Item>
                <Descriptions.Item label="模式">

                </Descriptions.Item>
                <Descriptions.Item label="提料负责人">

                </Descriptions.Item>
                <Descriptions.Item label="优先级">

                </Descriptions.Item>
                <Descriptions.Item label="计划交付时间">

                </Descriptions.Item>
                <Descriptions.Item label="备注">

</Descriptions.Item>
            </Descriptions>
         <DetailTitle title="操作信息" style={{ padding: '8px 0' }} />
             <CommonTable
                 scroll={{ x: 500 }}
                 rowKey="id"
                 dataSource={[]}
                 pagination={false}
                 columns={tableColumns}
                 className={styles.addModal} />
     </Spin>
 })