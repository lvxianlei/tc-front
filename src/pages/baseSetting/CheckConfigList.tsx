/**
 * @author zyc
 * @copyright © 2022 
 * @description 审核配置
 */

 import React, { useRef, useState } from 'react';
 import { Space, Button, message, Modal } from 'antd';
 import { Page } from '../common';
 import { FixedType } from 'rc-table/lib/interface';
 import RequestUtil from '../../utils/RequestUtil';
 import { useHistory } from 'react-router-dom';
import CheckConfigSetting from './CheckConfigSetting';
 
 export interface EditRefProps {
     onSubmit: () => void
     resetFields: () => void
 }
 
 export default function CheckConfigList(): React.ReactNode {
     const columns = [
         {
             key: 'index',
             title: '序号',
             fixed: "left" as FixedType,
             dataIndex: 'index',
             width: 100,
             render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
         },
         {
             key: 'productTypeName',
             title: '业务项',
             width: 150,
             dataIndex: 'productTypeName'
         },
         {
             key: 'country',
             title: '审批类型',
             dataIndex: 'country',
             width: 120
         },
         {
             key: 'areaNames',
             title: '审批层级1',
             width: 200,
             dataIndex: 'areaNames'
         },
         {
             key: 'towerStructureNames',
             title: '审批层级2',
             width: 200,
             dataIndex: 'towerStructureNames'
         },
         {
             key: 'voltageGradeNames',
             title: '审批层级3',
             width: 200,
             dataIndex: 'voltageGradeNames'
         },
         {
             key: 'number',
             title: '审批层级4',
             width: 200,
             dataIndex: 'number'
         },
         {
             key: 'segmentModeNames',
             title: '审批层级5',
             width: 200,
             dataIndex: 'segmentModeNames'
         },
         {
             key: 'weldingTypeNames',
             title: '审批层级6',
             width: 200,
             dataIndex: 'weldingTypeNames'
         },
         {
             key: 'weldingTypeNames',
             title: '审批层级7',
             width: 200,
             dataIndex: 'weldingTypeNames'
         },
         {
             key: 'weldingTypeNames',
             title: '审批层级8',
             width: 200,
             dataIndex: 'weldingTypeNames'
         },
         {
             key: 'weldingTypeNames',
             title: '审批层级9',
             width: 200,
             dataIndex: 'weldingTypeNames'
         },
         {
             key: 'operation',
             title: '操作',
             dataIndex: 'operation',
             fixed: 'right' as FixedType,
             width: 150,
             render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                 <Space direction="horizontal" size="small">
                     <Button type="link" onClick={() => {
                         setVisible(true);
                         setRowData(record);
                     }}>编辑</Button>
                 </Space>
             )
         }
     ]
 
     const [refresh, setRefresh] = useState(false);
     const newRef = useRef<EditRefProps>();
     const [visible, setVisible] = useState<boolean>(false);
     const [rowData, setRowData] = useState<any>();
     const history = useHistory();
 
     const handleOk = () => new Promise(async (resove, reject) => {
         try {
             await newRef.current?.onSubmit()
             message.success("保存成功！")
             setVisible(false)
             history.go(0)
             resove(true)
         } catch (error) {
             reject(false)
         }
     })
 
     return (
         <>
             <Modal
                 destroyOnClose
                 key='TryAssembleNew'
                 visible={visible}
                 title={'编辑'}
                 width='60%'
                 onOk={handleOk}
                 onCancel={() => setVisible(false)}>
                 <CheckConfigSetting record={rowData} ref={newRef} />
             </Modal>
             <Page
                 path="/tower-science/trial/list"
                 columns={columns}
                 headTabs={[]}
                 refresh={refresh}
                 searchFormItems={[]}
             />
         </>
     )
 }