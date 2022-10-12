/**
 * @author zyc
 * @copyright © 2022
 * @description RD-资料管理-资料存档管理
 */

 import React, { useRef, useState } from 'react';
 import { Space, Form, Spin, Button, TablePaginationConfig, Radio, RadioChangeEvent, Row, message, Modal, InputNumber, Col, Select, Input } from 'antd';
 import { CommonTable, Page } from '../../common';
 import { FixedType } from 'rc-table/lib/interface';
 import styles from './EngineeringData.module.less';
 import useRequest from '@ahooksjs/use-request';
 import RequestUtil from '../../../utils/RequestUtil';
 import { useHistory, useParams } from 'react-router-dom';
 import { useForm } from 'antd/es/form/Form';
import { supplyTypeOptions } from '../../../configuration/DictionaryOptions';
 
 export interface ILofting {
     readonly id?: string;
 }
 
 export interface EditRefProps {
     onSubmit: () => void
     resetFields: () => void
 }
 
 export default function List(): React.ReactNode {
     const columns = [
         {
             key: 'productTypeName',
             title: '合同编号',
             width: 50,
             dataIndex: 'productTypeName'
         },
         {
             key: 'projectEntries',
             title: '项目名称',
             dataIndex: 'projectEntries',
             width: 80
         },
         {
             key: 'voltageGradePriceFirst',
             title: '工程名称',
             width: 100,
             dataIndex: 'voltageGradePriceFirst'
         },
         {
             key: 'voltageGradePriceSecond',
             title: '客户名称',
             width: 100,
             dataIndex: 'voltageGradePriceSecond'
         },
         {
             key: 'voltageGradePriceThird',
             title: '电压等级',
             width: 80,
             dataIndex: 'voltageGradePriceThird'
         },
         {
             key: 'specialPrice',
             title: '产品类型',
             width: 80,
             dataIndex: 'specialPrice'
         },
         {
             key: 'specialPrice',
             title: '计划号',
             width: 80,
             dataIndex: 'specialPrice'
         },
         {
             key: 'specialPrice',
             title: '备注',
             width: 80,
             dataIndex: 'specialPrice'
         }
     ]
 
     const [page, setPage] = useState({
         current: 1,
         size: 15,
         total: 0
     })
 
     const [status, setStatus] = useState<string>('1');
     const history = useHistory();
     const newRef = useRef<EditRefProps>();
     const [nowColumns, setNowColumns] = useState<any>(columns);
     const [visible, setVisible] = useState<boolean>(false);
     const [type, setType] = useState<'edit' | 'new'>('new');
     const [form] = useForm();
     const materialRef = useRef<EditRefProps>();
     const [materialVisible, setMaterialVisible] = useState<boolean>(false);
     const [materialType, setMaterialType] = useState<'edit' | 'new'>('new');
     const [materialRowData, setMaterialRowData] = useState<any>();
     const boltRef = useRef<EditRefProps>();
     const [filterValue, setFilterValue] = useState();
     const [ refresh, setRefresh ] = useState<boolean>(false);
 
     const { loading, data, run } = useRequest<ILofting[]>((pagenation?: TablePaginationConfig) => new Promise(async (resole, reject) => {
         const result = await RequestUtil.get<any>(`/tower-science/projectPrice/list`, { current: pagenation?.current || 1, size: pagenation?.size || 15, category: status });
         setPage({ ...result })
         resole(result?.records || [])
     }), { refreshDeps: [status] })

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
 
     const materialHandleOk = () => new Promise(async (resove, reject) => {
         try {
             await materialRef.current?.onSubmit()
             message.success("保存成功！")
             setMaterialVisible(false)
             history.go(0)
             resove(true)
         } catch (error) {
             reject(false)
         }
     })
 
     const boltHandleOk = () => new Promise(async (resove, reject) => {
         try {
             await boltRef.current?.onSubmit()
             message.success("保存成功！")
             history.go(0)
             resove(true)
         } catch (error) {
             reject(false)
         }
     })


     return <Spin spinning={loading}>
         {/* <Modal
             destroyOnClose
             key='LoftQuotaNew'
             visible={visible}
             title={type === 'new' ? '新增' : '编辑'}
             onOk={handleOk}
             onCancel={() => setVisible(false)}>
             <LoftQuotaNew type={type} record={rowData} ref={newRef} />
         </Modal> */}
         <Page
            path=""
            filterValue={filterValue}
            columns={columns}
            extraOperation={<Row>
                <Col>
                <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                 setStatus(event.target.value);
                 run();
             }}>
                 <Radio.Button value={'1'} key="1">全部</Radio.Button>
                 <Radio.Button value={'2'} key="2">正常</Radio.Button>
                 <Radio.Button value={'3'} key="3">变更</Radio.Button>
                 <Radio.Button value={'4'} key="4">无效</Radio.Button>
             </Radio.Group>
                </Col>
                <Col>
             <Button type="primary" ghost>上传</Button>
                </Col>
            </Row>}
            searchFormItems={[
                {
                    name: "issueName",
                    label: '资料室',
                    children: 
                    <Select placeholder="请选择">
                        {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "deptId",
                    label: "资料类型",
                    children:  <Select placeholder="请选择">
                        {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "deptId",
                    label: "产品类型",
                    children:  <Select placeholder="请选择">
                        {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "fuzzyQuery",
                    label: '模糊查询',
                    children: <Input placeholder="客户名称/工程名称/计划号/塔型名称" style={{ width: 150 }} />
                }
            ]}
            refresh={refresh}
            onFilterSubmit={(values: any) => {
                if (values.date) {
                    const formatDate = values.date.map((item: any) => item.format("YYYY-MM-DD"))
                    values.startTime = formatDate[0] + ' 00:00:00';
                    values.endTime = formatDate[1] + ' 23:59:59';
                    delete values.date
                }
                setFilterValue(values)
                return values;
            }}
        />
     </Spin>
 }