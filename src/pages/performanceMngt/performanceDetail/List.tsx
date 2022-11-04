/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-绩效奖励明细
 */

 import React, { useState } from 'react';
 import { Space, Input, DatePicker, Button, Form, TablePaginationConfig, Modal } from 'antd';
 import styles from './PerformanceDetail.module.less';
 import { IResponseData } from '../../common/Page';
 import RequestUtil from '../../../utils/RequestUtil';
 import { CommonTable } from '../../common';
 import useRequest from '@ahooksjs/use-request';
import RewardDetailsConfiguration from './RewardDetailsConfiguration';
 
 export default function List(): React.ReactNode {
     const [detailData, setDetailData] = useState<any>();
     const [form] = Form.useForm();
     const [filterValues, setFilterValues] = useState<Record<string, any>>();
     const [visible, setVisible] = useState<boolean>(false);

     const columns= [
        {
            "key": "loftingTaskNumber",
            "title": "奖励简称",
            "width": 120,
            "dataIndex": "loftingTaskNumber"
        },
        {
            "key": "productCategoryName",
            "title": "奖励条目",
            "dataIndex": "productCategoryName",
            "width": 80
        },
        {
            "key": "productTypeName",
            "title": "奖励金额",
            "dataIndex": "productTypeName",
            "width": 80
        },
        {
            "key": "wasteStructureNum",
            "title": "奖励人数",
            "dataIndex": "wasteStructureNum",
            "width": 120
        },
        {
            "key": "wasteNum",
            "title": "符合奖励人员",
            "dataIndex": "wasteNum",
            "width": 120,
            "type": "number"
        },
        {
            "key": "penaltyAmount",
            "title": "奖励金额-总",
            "dataIndex": "penaltyAmount",
            "width": 120,
            "type": "number"
        },
        {
            "key": "rejectWeight",
            "title": "备注",
            "dataIndex": "rejectWeight",
            "width": 120,
            "type": "number"
        }
    ]

    const detailColumns= [
        {
            "key": "planNumber",
            "title": "姓名",
            "width": 80,
            "dataIndex": "planNumber"
        },
        {
            "key": "loftingTaskNumber",
            "title": "工程名称",
            "width": 120,
            "dataIndex": "loftingTaskNumber"
        },
        {
            "key": "productCategoryName",
            "title": "计划号",
            "dataIndex": "productCategoryName",
            "width": 80
        },
        {
            "key": "productTypeName",
            "title": "产品类型",
            "dataIndex": "productTypeName",
            "width": 80
        },
        {
            "key": "wasteStructureNum",
            "title":"电压等级",
            "dataIndex": "wasteStructureNum",
            "width": 120
        },
        {
            "key": "wasteNum",
            "title": "塔型",
            "dataIndex": "wasteNum",
            "width": 120
        },
        {
            "key": "penaltyAmount",
            "title": "段类型",
            "dataIndex": "penaltyAmount",
            "width": 120,
            "type": "number"
        },
        {
            "key": "rejectWeight",
            "title": "件号数",
            "dataIndex": "rejectWeight",
            "width": 120,
        },
        {
            "key": "rejectAmount",
            "title": "正确率%",
            "dataIndex": "rejectAmount",
            "width": 120
        }
    ]
 
     const { loading, data, run } = useRequest<any[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
         const data: IResponseData = await RequestUtil.get<IResponseData>(`/tower-science/wasteProductReceipt`, { ...filterValue });
         if (data.records.length > 0 && data.records[0]?.id) {
             detailRun(data.records[0]?.id)
         } else {
             setDetailData([]);
         }
         resole(data?.records);
     }), {})
 
     const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
         try {
             const result = await RequestUtil.get<any>(`/tower-science/wasteProductReceipt/structure/list/${id}`);
             setDetailData(result);
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onRowChange = async (record: Record<string, any>) => {
         detailRun(record.id)
     }

     const onSearch = (values: Record<string, any>) => {
         if (values.updateStatusTime) {
             const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
             values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
             values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
         }
         setFilterValues(values);
         run({ ...values });
     }
 
     return <>
     <Modal
             destroyOnClose
             key='ApplyTrial'
             visible={visible}
             title={'奖励明细配置'}
             footer={
                 <Button onClick={() => {
                     setVisible(false);
                 }}>关闭</Button>}
             width="60%"
             onCancel={() => {
                 setVisible(false);
             }}>
             <RewardDetailsConfiguration />
         </Modal>
         <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
             <Form form={form} layout="inline" onFinish={onSearch}>
                 <Form.Item label='日期' name="updateStatusTime">
                     <DatePicker.RangePicker />
                 </Form.Item>
                 <Form.Item>
                     <Space direction="horizontal">
                         <Button type="primary" htmlType="submit">搜索</Button>
                         <Button htmlType="reset">重置</Button>
                     </Space>
                 </Form.Item>
             </Form>
             <Button type='primary' ghost>奖励条目配置</Button>
             <p><span>**年**月</span>奖励明细</p>
             <CommonTable
                 haveIndex
                 columns={columns}
                 dataSource={data}
                 pagination={false}
                 onRow={(record: Record<string, any>) => ({
                     onClick: () => onRowChange(record),
                     className: styles.tableRow
                 })}
             />
             <p><span>奖励条目</span><span>奖励明细</span></p>
             <CommonTable
                 haveIndex
                 columns={detailColumns}
                 dataSource={detailData || []}
                 pagination={false} />
         </Space>
     </>
 }