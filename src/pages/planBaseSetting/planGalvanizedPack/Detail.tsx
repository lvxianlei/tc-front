import React from 'react'
import { Button, Spin, Space, message, Modal, Form, Select, DatePicker} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment } from '../../common';
import useRequest from '@ahooksjs/use-request';
import styles from './GalvanizedPack.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import { FixedType } from 'rc-table/lib/interface';



export default function GalvanizedPackDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-science/drawTask/getList?drawTaskId=${params.id}`)
        resole(data)
    }), {})
    const { data: productUnitData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/productionUnit?size=10000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))
    const [form] = Form.useForm();
    const detailData: any = data;
    const handleIssue = () => {
        Modal.confirm({
            title: "下发后不可取消，是否下发镀锌包装计划？",
            onOk: async () => new Promise(async (resove, reject) => {
                try {
                    // const result = await deleteRun()
                    message.success("删除成功...")
                    // resove(result)
                    history.goBack()
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const galvanizedColumns=[
        {
            key: 'lineName',
            title: '计划号',
            width: 100,
            dataIndex: 'lineName'
        },
        {
            key: 'name',
            title: '塔型',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'productCategory',
            title: '批次号',
            width: 100,
            dataIndex: 'productCategory'
        },
        {
            key: 'steelProductShape',
            title: '角钢重量（t）',
            width: 100,
            dataIndex: 'steelProductShape'
        },
        {
            key: 'productType',
            title: '钢板重量（t）',
            width: 100,
            dataIndex: 'productType',
        },
        {
            key: 'productType',
            title: '角钢总件数',
            width: 100,
            dataIndex: 'productType',
        },
        {
            key: 'productType',
            title: '钢板总件数',
            width: 100,
            dataIndex: 'productType',
        },
        {
            key: 'productType',
            title: '* 转运开始日期',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedList', index, "A"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择开始转运日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '* 转运结束日期',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedList', index, "A"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择开始转运日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '* 镀锌单元',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedList', index, "code"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请选择试装单元'
                    }]}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '* 计划完成日期',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedList', index, "A"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择开始转运日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '镀锌单元',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedList', index, "code"]}
                    initialValue={_}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '计划完成日期',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedList', index, "A"]}
                    initialValue={record.segmentName}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '镀锌单元',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedList', index, "code"]}
                    initialValue={_}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '计划完成日期',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedList', index, "A"]}
                    initialValue={record.segmentName}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '镀锌备注',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedList', index, "cyclePlan"]}
                    initialValue={_}
                >
                    <TextArea
                        size="small"
                        rows={1}
                        showCount
                        maxLength={300}
                    />
                </Form.Item>
            )
        },
    ]


    const packColumns=[
        {
            key: 'lineName',
            title: '计划号',
            width: 100,
            dataIndex: 'lineName'
        },
        {
            key: 'name',
            title: '塔型',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'productCategory',
            title: '批次号',
            width: 100,
            dataIndex: 'productCategory'
        },
        {
            key: 'steelProductShape',
            title: '角钢重量（t）',
            width: 100,
            dataIndex: 'steelProductShape'
        },
        {
            key: 'productType',
            title: '钢板重量（t）',
            width: 100,
            dataIndex: 'productType',
        },
        {
            key: 'productType',
            title: '角钢总件数',
            width: 100,
            dataIndex: 'productType',
        },
        {
            key: 'productType',
            title: '钢板总件数',
            width: 100,
            dataIndex: 'productType',
        },
        {
            key: 'productType',
            title: '* 包装单元',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packList', index, "code"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请选择包装单元'
                    }]}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '* 计划开始日期',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packList', index, "A"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择计划开始日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '包装单元',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packList', index, "code"]}
                    initialValue={_}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '计划开始日期',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packList', index, "A"]}
                    initialValue={record.segmentName}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '* 计划完成日期',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packList', index, "A"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择计划完成日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '* 报补件日期',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packList', index, "A"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择报补件日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '* 入库日期',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packList', index, "A"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择入库日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '包装备注',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packList', index, "cyclePlan"]}
                    initialValue={_}
                >
                    <TextArea
                        size="small"
                        rows={1}
                        showCount
                        maxLength={300}
                    />
                </Form.Item>
            )
        },
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space>
                <Button type='primary' onClick={() => {
                    console.log(form.getFieldsValue(true))
                }}>保存</Button>
                <Button type='primary' onClick={handleIssue}>镀锌包装下发</Button>
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
                <Form form={form}  className={styles.descripForm}>
                    <DetailTitle title="镀锌计划"/>
                    <Space>
                        <span>合计：</span>
                        <span>角钢重量（t）：{detailData?.totalNumber}</span>
                        <span>钢板重量（t）：{detailData?.totalHoles}</span>
                        <span>角钢总件数：{detailData?.totalHoles}</span>
                        <span>钢板总件数：{detailData?.totalHoles}</span>
                    </Space>
                    <CommonTable columns={galvanizedColumns} dataSource={[{}]} pagination={false}/>
                    <DetailTitle title="包装计划"/>
                    <CommonTable columns={packColumns} dataSource={[{}]} pagination={false}/>
                </Form>
           
            </DetailContent>
        </Spin>
    </>
}