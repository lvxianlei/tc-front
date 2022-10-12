/**
 * @author zyc
 * @copyright © 2022
 * @description RD-资料管理-工程资料管理
 */

 import React, { useRef, useState } from 'react';
 import { Space, Form, Spin, Button, TablePaginationConfig, Radio, RadioChangeEvent, Row, message, Modal, InputNumber, Col, Select } from 'antd';
 import { CommonTable } from '../../common';
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
     const [boltVisible, setBoltVisible] = useState<boolean>(false);
     const [boltType, setBoltType] = useState<'edit' | 'new'>('new');
     const [boltRowData, setBoltRowData] = useState<any>();
     const [detailData, setDetailData] = useState<any>();
     const [rowData, setRowData] = useState<any>();
 
     const { loading, data, run } = useRequest<ILofting[]>((pagenation?: TablePaginationConfig) => new Promise(async (resole, reject) => {
         const result = await RequestUtil.get<any>(`/tower-science/projectPrice/list`, { current: pagenation?.current || 1, size: pagenation?.size || 15, category: status });
         setPage({ ...result })
         resole(result?.records || [])
     }), { refreshDeps: [status] })
 
     const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get(`/tower-science/performance/product/segment/${id}`);
            setDetailData(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

     const handleChangePage = (current: number, pageSize: number) => {
         setPage({ ...page, current: current, size: pageSize });
         run({ current: current, size: pageSize })
     }
 
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
 
     const delRow = (id: string) => {
         Modal.confirm({
             title: "删除",
             content: "确定删除放样定额配置？",
             okText: '确定',
             cancelText: '取消',
             onOk: () => {
                 RequestUtil.delete(`/tower-science/projectPrice?id=${id}`).then(res => {
                     message.success("删除成功！")
                     history.go(0)
                 })
             }
         })
     }
 
     const otherEdit = (record: Record<string, any>) => {
         form.setFieldsValue({ price: record?.price })
         Modal.confirm({
             title: "编辑",
             icon: null,
             closable: true,
             content: <Form form={form} labelCol={{ span: 6 }}>
                 <Form.Item
                     label="金额"
                     name="price"
                     rules={[{ required: true, message: '请输入金额' }]}
                     initialValue={record?.price}>
                     <InputNumber />
                 </Form.Item>
             </Form>,
             onOk: async () => new Promise(async (resove, reject) => {
                 try {
                     const value = await form.validateFields();
                     RequestUtil.post(`/tower-science/projectPrice/other`, { ...record, ...value }).then(res => {
                         message.success("编辑成功！")
                         form.setFieldsValue({ price: '' })
                         history.go(0)
                     })
                     resove(true)
                 } catch (error) {
                     reject(false)
                 }
             }),
             onCancel() {
                 form.setFieldsValue({ price: '' })
             }
         })
     }
 
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
             setBoltVisible(false)
             history.go(0)
             resove(true)
         } catch (error) {
             reject(false)
         }
     })
 
     const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.id);
        setRowData(record)
    }

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
         <Row className={styles.search}>
             <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                 setStatus(event.target.value);
                 run();
             }}>
                 <Radio.Button value={'1'} key="1">全部</Radio.Button>
                 <Radio.Button value={'2'} key="2">100KV及以下</Radio.Button>
                 <Radio.Button value={'3'} key="3">220KV</Radio.Button>
                 <Radio.Button value={'4'} key="4">500KV</Radio.Button>
                 <Radio.Button value={'5'} key="5">750KV</Radio.Button>
                 <Radio.Button value={'6'} key="6">800KV</Radio.Button>
                 <Radio.Button value={'7'} key="7">1000KV及以上</Radio.Button>
                 <Radio.Button value={'8'} key="8">国外工程</Radio.Button>
             </Radio.Group>
         </Row>
         <CommonTable
             haveIndex
             columns={columns}
             dataSource={data}
             pagination={{
                 current: page.current,
                 pageSize: page.size,
                 total: page?.total,
                 onChange: handleChangePage
             }}
             onRow={(record: Record<string, any>) => ({
                onClick: () => onRowChange(record),
                className: styles.tableRow
            })}
         />
         <Row className={styles.search}>
            <Col>
             <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                 setStatus(event.target.value);
                 run();
             }}>
                 <Radio.Button value={'1'} key="1">业务文件</Radio.Button>
                 <Radio.Button value={'2'} key="2">技术文件</Radio.Button>
                 <Radio.Button value={'3'} key="3">工艺文件</Radio.Button>
                 <Radio.Button value={'4'} key="4">结算文件</Radio.Button>
             </Radio.Group>
            
            </Col>
            <Col>
            <Row>
                <Form>
                <Col>
                <Form.Item label="文件类型" name="">
                <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                    {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
                        </Select>
                </Form.Item>
                </Col>
                <Col>
                <Form.Item label="计划号" name="">
                <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                    {rowData.a && rowData?.a?.map((res: any, index: number) => {
                        return <Select.Option key={index} value={res}>
                            {res}
                        </Select.Option>
                    })}
                        </Select>
                </Form.Item>
                </Col>

                </Form>
            </Row>
            </Col>
         </Row>
     </Spin>
 }