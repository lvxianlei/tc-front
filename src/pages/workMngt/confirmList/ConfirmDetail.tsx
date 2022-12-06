import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Modal, Form, Upload, message, Descriptions } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { Input, InputNumber, Popconfirm, Select } from 'antd';
import AuthUtil from '../../../utils/AuthUtil';
import { patternTypeOptions, productTypeOptions, towerStructureOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import { downloadTemplate } from '../setOut/downloadTemplate';
import styles from './confirm.module.less'
import { FixedType } from 'rc-table/lib/interface';
import { FileProps } from '../../common/Attachment';
export default function ConfirmDetail(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [rowId, setRowId] = useState('');
    const [tableDataSource, setTableDataSource] = useState<object[]>([]);
    const [weight, setWeight] = useState<string>('0');
    const [description, setDescription] = useState('');
    const [attachInfo, setAttachInfo] = useState<any[]>([]);
    const [confirmData, setConfirmData] = useState<any[]>([{
        otherWeightBg: 0,
        otherWeightPt: 0,
        otherWeightXxp: 0,
        otherWeightPat: 0,
        otherWeightFd: 0,
        otherWeightGdxg: 0,
        otherWeightXg: 0,
        otherWeightQtsm: 0,
        otherWeightDdssgkb: 0,
        otherWeightLs: 0,
        legWeightA: 0,
        legWeightB: 0,
        legWeightC: 0,
        legWeightD: 0,
        description: '',
    }]);
    const [form] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const [edit, setEdit] = useState('添加');
    const handleModalOk = async () => {
        try {
            if (edit === '添加') {
                const value = await form.validateFields();
                const submitData = value?.confirmList.map((item: any) => {
                    return {
                        ...item,
                        pattern: value?.pattern,
                        productCategory: value?.productCategory,
                        productType: value?.productType,
                        steelProductShape: value?.steelProductShape,
                        voltageLevel: value?.voltageLevel,
                        lineName: value?.lineName,
                        drawTaskId: params.id,
                        structure: value?.structure
                    }
                })
                await RequestUtil.post(`/tower-science/drawProductDetail/saveBatch`, submitData)
                form.setFieldsValue({
                    pattern: '',
                    productCategory: '',
                    productType: '',
                    steelProductShape: '',
                    voltageLevel: '',
                    lineName: '',
                    confirmList: [{
                        otherWeightBg: 0,
                        otherWeightPt: 0,
                        otherWeightXxp: 0,
                        otherWeightPat: 0,
                        otherWeightFd: 0,
                        otherWeightGdxg: 0,
                        otherWeightXg: 0,
                        otherWeightQtsm: 0,
                        otherWeightDdssgkb: 0,
                        otherWeightLs: 0,
                        legWeightA: 0,
                        legWeightB: 0,
                        legWeightC: 0,
                        legWeightD: 0,
                        bodyWeight: 0,
                        description: '',
                    }]
                })
                setConfirmData([{
                    otherWeightBg: 0,
                    otherWeightPt: 0,
                    otherWeightXxp: 0,
                    otherWeightPat: 0,
                    otherWeightFd: 0,
                    otherWeightGdxg: 0,
                    otherWeightXg: 0,
                    otherWeightQtsm: 0,
                    otherWeightDdssgkb: 0,
                    otherWeightLs: 0,
                    legWeightA: 0,
                    legWeightB: 0,
                    legWeightC: 0,
                    legWeightD: 0,
                    bodyWeight: 0,
                    description: '',
                }])
                setVisible(false)
                message.success('添加成功！')
                run();
            } else {
                const value = await form.validateFields();
                const submitData = value?.confirmList.map((item: any) => {
                    return {
                        ...item,
                        pattern: value?.pattern,
                        productCategory: value?.productCategory,
                        productType: value?.productType,
                        steelProductShape: value?.steelProductShape,
                        voltageLevel: value?.voltageLevel,
                        lineName: value?.lineName,
                        drawTaskId: params.id,
                        id: rowId,
                        structure: value?.structure
                    }
                })
                await RequestUtil.post(`/tower-science/drawProductDetail/save`, submitData[0])
                form.setFieldsValue({
                    pattern: '',
                    productCategory: '',
                    productType: '',
                    steelProductShape: '',
                    voltageLevel: '',
                    lineName: '',
                    description: '',
                    confirmList: [{
                        otherWeightBg: 0,
                        otherWeightPt: 0,
                        otherWeightXxp: 0,
                        otherWeightPat: 0,
                        otherWeightFd: 0,
                        otherWeightGdxg: 0,
                        otherWeightXg: 0,
                        otherWeightDdssgkb: 0,
                        otherWeightQtsm: 0,
                        otherWeightLs: 0,
                        legWeightA: 0,
                        legWeightB: 0,
                        legWeightC: 0,
                        legWeightD: 0,
                        bodyWeight: 0,
                        description: '',
                    }]
                })
                setConfirmData([{
                    otherWeightBg: 0,
                    otherWeightPt: 0,
                    otherWeightXxp: 0,
                    otherWeightPat: 0,
                    otherWeightFd: 0,
                    otherWeightGdxg: 0,
                    otherWeightXg: 0,
                    otherWeightQtsm: 0,
                    otherWeightDdssgkb: 0,
                    otherWeightLs: 0,
                    legWeightA: 0,
                    legWeightB: 0,
                    legWeightC: 0,
                    legWeightD: 0,
                    bodyWeight: 0,
                    description: '',
                }])
                setRowId('')
                setVisible(false)
                message.success('修改成功！')
                run();
                // value['id'] = id;
                // tableDataSource.push(value);
                // let number = '0';
                // tableDataSource.forEach((item:any)=>{
                //     number = (parseFloat(item.totalWeight)+parseFloat(number)).toFixed(2)
                // })
                // setWeight(number);
                // setTableDataSource(tableDataSource);
                // form.resetFields();
                // setVisible(false);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => {
        setVisible(false);
        form.resetFields();
        setConfirmData([{
            otherWeightBg: 0,
            otherWeightPt: 0,
            otherWeightXxp: 0,
            otherWeightPat: 0,
            otherWeightFd: 0,
            otherWeightGdxg: 0,
            otherWeightXg: 0,
            otherWeightQtsm: 0,
            otherWeightLs: 0,
            otherWeightDdssgkb: 0,
            legWeightA: 0,
            legWeightB: 0,
            legWeightC: 0,
            legWeightD: 0,
            description: '',
        }]
        )
    }
    // const handlePictureModalCancel = () => {setPictureVisible(false)}
    const [urlVisible, setUrlVisible] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const params = useParams<{ id: string, status: string, confirmId: string }>()
    const userId = AuthUtil.getUserInfo().user_id;
    const { loading, data, run } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawProductDetail/getDetailListById?drawTaskId=${params.id}`)
        setTableDataSource(data?.drawProductDetailList.map((item: any, index: number) => {
            return {
                ...item,
                key: index.toString(),
                index: index,
                legConfigurationA: item.legConfigurationA ? item.legConfigurationA : 0,
                legConfigurationB: item.legConfigurationB ? item.legConfigurationB : 0,
                legConfigurationC: item.legConfigurationC ? item.legConfigurationC : 0,
                legConfigurationD: item.legConfigurationD ? item.legConfigurationD : 0,
                otherWeightBg: item.otherWeightBg ? item.otherWeightBg : 0,
                otherWeightPt: item.otherWeightPt ? item.otherWeightPt : 0,
                otherWeightXxp: item.otherWeightXxp ? item.otherWeightXxp : 0,
                otherWeightPat: item.otherWeightPat ? item.otherWeightPat : 0,
                otherWeightFd: item.otherWeightFd ? item.otherWeightFd : 0,
                otherWeightDdssgkb: item.otherWeightDdssgkb ? item.otherWeightDdssgkb : 0,
                otherWeightGdxg: item.otherWeightGdxg ? item.otherWeightGdxg : 0,
                otherWeightXg: item.otherWeightXg ? item.otherWeightXg : 0,
                otherWeightQtsm: item.otherWeightQtsm ? item.otherWeightQtsm : 0,
                otherWeightLs: item.otherWeightLs ? item.otherWeightLs : 0,
                monomerWeight: item.monomerWeight ? item.monomerWeight : 0,
                totalWeight: item.totalWeight ? item.totalWeight : 0,
            }
        }));
        setAttachInfo([...data.fileVOList]);
        setDescription(data?.description);
        let totalNumber = '0';
        data?.drawProductDetailList.forEach((item: any) => {
            totalNumber = (parseFloat(item.totalWeight) + parseFloat(totalNumber)).toFixed(2)
        })
        setWeight(totalNumber);
        resole(data);
    }), {})
    const detailData: any = data;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const tableColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: '* 线路名称',
            dataIndex: 'lineName',
            width: 80,
            key: 'lineName',
        },
        {
            title: '* 产品类型',
            dataIndex: 'productTypeName',
            width: 100,
            key: 'productTypeName',
        },
        {
            title: '* 电压等级（kv）',
            dataIndex: 'voltageLevelName',
            width: 120,
            key: 'voltageLevelName'
        },
        {
            title: '* 塔型',
            dataIndex: 'productCategory',
            width: 80,
            key: 'productCategory'
        },
        {
            title: '* 塔型钢印号',
            dataIndex: 'steelProductShape',
            width: 100,
            key: 'steelProductShape'
        },

        {
            title: '* 杆塔号',
            dataIndex: 'name',
            width: 80,
            key: 'name'
        },
        {
            title: '* 呼高（m）',
            dataIndex: 'basicHeight',
            width: 90,
            key: 'basicHeight',
            render: (value: any) => {
                return value ? parseFloat(value).toFixed(2) : '-'
            }
        },
        {
            title: '* 模式',
            dataIndex: 'patternName',
            width: 90,
            key: 'patternName',
        },
        {
            title: '结构',
            dataIndex: 'structureName',
            width: 90,
            key: 'structureName',
        },
        {
            title: '接腿配置A',
            dataIndex: 'legConfigurationA',
            width: 80,
            key: 'legConfigurationA'
        },
        {
            title: '接腿配置B',
            dataIndex: 'legConfigurationB',
            width: 80,
            key: 'legConfigurationB'
        },
        {
            title: '接腿配置C',
            dataIndex: 'legConfigurationC',
            width: 80,
            key: 'legConfigurationC'
        },
        {
            title: '接腿配置D',
            dataIndex: 'legConfigurationD',
            width: 80,
            key: 'legConfigurationD'
        },
        {
            title: '接腿重A（kg）',
            dataIndex: 'legWeightA',
            width: 100,
            key: 'legWeightA',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '接腿重B（kg）',
            dataIndex: 'legWeightB',
            width: 100,
            key: 'legWeightB',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '接腿重C（kg）',
            dataIndex: 'legWeightC',
            width: 100,
            key: 'legWeightC',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '接腿重D（kg）',
            dataIndex: 'legWeightD',
            width: 100,
            key: 'legWeightD',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '* 本体重量（kg）',
            dataIndex: 'bodyWeight',
            width: 120,
            key: 'bodyWeight',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '* 单重（kg）',
            dataIndex: 'monomerWeight',
            width: 100,
            key: 'monomerWeight',
            render: (_: any, record: any) => {
                return <span>{record?.monomerWeight ? parseFloat(record?.monomerWeight).toFixed(2) : (parseFloat(record.legWeightA) + parseFloat(record.legWeightB) + parseFloat(record.legWeightC) + parseFloat(record.legWeightD) + parseFloat(record.bodyWeight)).toFixed(2)}</span>
            }
        },
        {
            title: '* 总重（kg）',
            dataIndex: 'totalWeight',
            width: 100,
            key: 'totalWeight',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
            //   render:(_:any,record:any)=>{
            //       return <span>{(parseFloat(record.otherWeight)+parseFloat(record.legWeightA)+parseFloat(record.legWeightB)+parseFloat(record.legWeightC)+parseFloat(record.legWeightD)+parseFloat(record.bodyWeight)).toFixed(2)}</span>
            //   } 
        },
        {
            title: '其他增重-抱箍（kg）',
            dataIndex: 'otherWeightBg',
            width: 200,
            key: 'otherWeightBg',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '其他增重-平台（kg）',
            dataIndex: 'otherWeightPt',
            width: 200,
            key: 'otherWeightPt',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '其他增重-相序牌（kg）',
            dataIndex: 'otherWeightXxp',
            width: 200,
            key: 'otherWeightXxp',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '其他增重-爬梯（kg）',
            dataIndex: 'otherWeightPat',
            width: 200,
            key: 'otherWeightPat',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '其他增重-防盗（kg）',
            dataIndex: 'otherWeightFd',
            width: 200,
            key: 'otherWeightFd',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '其他增重-兜底绳施工孔板（kg）',
            dataIndex: 'otherWeightDdssgkb',
            width: 200,
            key: 'otherWeightDdssgkb',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '其他增重-挂点修改（kg）',
            dataIndex: 'otherWeightGdxg',
            width: 200,
            key: 'otherWeightGdxg',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '其他增重-修改（kg）',
            dataIndex: 'otherWeightXg',
            width: 200,
            key: 'otherWeightXg',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '其他增重-全塔双帽（kg）',
            dataIndex: 'otherWeightQtsm',
            width: 200,
            key: 'otherWeightQtsm',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '其他增重-螺栓（kg）',
            dataIndex: 'otherWeightLs',
            width: 200,
            key: 'otherWeightLs',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '其他增重-电缆支架（kg）',
            dataIndex: 'otherWeightDlzj',
            width: 200,
            key: 'otherWeightDlzj',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '其他增重-其他（kg）',
            dataIndex: 'otherWeightOther',
            width: 200,
            key: 'otherWeightOther',
            render: (value: any) => {
                return parseFloat(value).toFixed(2)
            }
        },
        {
            title: '备注',
            dataIndex: 'description',
            width: 250,
            key: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            width: 100,
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" disabled={userId !== params.confirmId || params.status !== '3'} onClick={() => {
                        setEdit('编辑')
                        setRowId(record?.id)
                        form.setFieldsValue({
                            pattern: record?.pattern,
                            productCategory: record?.productCategory,
                            productType: record?.productType,
                            steelProductShape: record?.steelProductShape,
                            voltageLevel: record?.voltageLevel,
                            lineName: record?.lineName,
                            structure: record?.structure,
                            confirmList: [record].map((item: any) => {
                                return {
                                    ...item,
                                    A: item.name.indexOf(',') > -1 || item.name.indexOf('/') > -1 ? item.name.split(/\/|,/).filter((item: any) => item).length : 1,
                                    basicHeight: Number(item.basicHeight),
                                    bodyWeight: Number(item.bodyWeight),
                                    legWeightA: Number(item.legWeightA),
                                    legWeightB: Number(item.legWeightB),
                                    legWeightC: Number(item.legWeightC),
                                    legWeightD: Number(item.legWeightD),
                                    monomerWeight: Number(item.monomerWeight),
                                    otherWeightBg: Number(item.otherWeightBg),
                                    otherWeightDdssgkb: Number(item.otherWeightDdssgkb),
                                    otherWeightFd: Number(item.otherWeightFd),
                                    otherWeightGdxg: Number(item.otherWeightGdxg),
                                    otherWeightLs: Number(item.otherWeightLs),
                                    otherWeightPat: Number(item.otherWeightPat),
                                    otherWeightPt: Number(item.otherWeightPt),
                                    otherWeightQtsm: Number(item.otherWeightQtsm),
                                    otherWeightXg: Number(item.otherWeightXg),
                                    otherWeightXxp: Number(item.otherWeightXxp),
                                    totalWeight: Number(item.totalWeight),
                                    otherWeightDlzj: Number(item.otherWeightDlzj),
                                    otherWeightOther: Number(item.otherWeightOther),
                                }
                            }),
                            id: record?.id
                        })
                        setVisible(true)
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={async () => {
                            await RequestUtil.delete(`/tower-science/drawProductDetail?ids=${record.id}`)
                            message.success('删除成功！')
                            run()
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={userId !== params.confirmId || params.status !== '3'}
                    >
                        <Button type="link" disabled={userId !== params.confirmId || params.status !== '3'}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return <Spin spinning={loading}>
        <DetailContent operation={[
            <>
                {params.status === '3' ? <Space>
                    <Button type='primary'
                        disabled={userId !== params.confirmId}
                        onClick={async () => {
                            try {
                                const saveData: any = {
                                    drawTaskId: params.id,
                                    fileVOList: attchsRef.current.getDataSource(),
                                    drawProductDetailList: tableDataSource.map((item: any) => {
                                        return {
                                            ...item,
                                            drawTaskId: params.id,
                                        }
                                    }),
                                    description
                                }
                                if (tableDataSource.length > 0) {
                                    console.log(saveData)
                                    await RequestUtil.post('/tower-science/drawProductDetail/saveDrawProduct', saveData).then(() => {
                                        message.success('保存成功！');
                                    }).then(() => {
                                        history.push('/workMngt/confirmList')
                                    })
                                }
                                else {
                                    message.error('未添加塔信息不可保存或提交！')
                                }
                            } catch (error) {
                                console.log(error)
                            }
                        }}>保存</Button>
                    <Button type='primary'
                        disabled={userId !== params.confirmId}
                        onClick={async () => {
                            try {
                                const submitData: any = {
                                    drawTaskId: params.id,
                                    fileVOList: attchsRef.current.getDataSource(),
                                    drawProductDetailList: tableDataSource.map((item: any) => {
                                        return {
                                            ...item,
                                            drawTaskId: params.id,
                                        }
                                    }),
                                    description
                                }
                                if (tableDataSource.length > 0) {
                                    console.log(submitData)
                                    await RequestUtil.post('/tower-science/drawProductDetail/submitDrawProduct', submitData).then(() => {
                                        message.success('提交成功！');
                                    }).then(() => {
                                        history.push('/workMngt/confirmList')
                                    })
                                }
                                else {
                                    message.error('未添加塔信息不可保存或提交！')
                                }
                            } catch (error) {
                                console.log(error)
                            }
                        }}>完成确认明细</Button>
                    {tableDataSource.length > 0 || attachInfo.length > 0 || description ? <Popconfirm
                        title="是否放弃已添加信息?"
                        onConfirm={() => history.goBack()}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button key="goback">返回</Button>
                    </Popconfirm> : <Button key="goback" onClick={() => history.goBack()}>返回</Button>}

                </Space> : <Button key="goback" onClick={() => history.goBack()}>返回</Button>}
            </>]}>
            <Space style={{ paddingBottom: '16px' }}>
                <Button type='primary' onClick={() => { downloadTemplate(`/tower-science/drawProductDetail/export?drawTaskId=${params.id}`, '杆塔信息') }}>导出</Button>
                <Button type="primary" onClick={() => downloadTemplate('/tower-science/drawProductDetail/importTemplate', '确认明细模板')} ghost>模板下载</Button>
            </Space>
            <DetailTitle title="确认明细" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Space>
                    <span>总基数：{tableDataSource.length}基</span>
                    <span>总重量：{weight}kg</span>
                    <span>图纸/工程名称：{data?.projectName || '-'}</span>
                    <span>计划号：{data?.planNumber || '-'}</span>
                    <span>合同名称：{data?.contractName || '-'}</span>
                </Space>
                <Space>
                    {params.status === '3' ?
                        <Upload
                            action={() => {
                                const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                                return baseUrl + '/tower-science/drawProductDetail/import'
                            }}
                            headers={
                                {
                                    'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                                    'Tenant-Id': AuthUtil.getTenantId(),
                                    'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                                }
                            }
                            data={{ drawTaskId: params.id }}
                            showUploadList={false}
                            onChange={async (info) => {
                                if (info.file.response && !info.file.response?.success) {
                                    message.warning(info.file.response?.msg)
                                }
                                if (info.file.response && info.file.response?.success) {
                                    if (info.file.response && info.file.response?.success) {
                                        if (info.file.response?.data) {
                                            setUrl(info.file.response?.data);
                                            setUrlVisible(true);
                                        } else {
                                            message.success('导入成功！');
                                            run();
                                            //   const data: any = await RequestUtil.get(`/tower-science/drawProductDetail/getDetailListById?drawTaskId=${params.id}`)
                                            //   setTableDataSource(data?.drawProductDetailList.map(( item:any ,index: number )=>{return{ ...item, key: index.toString(),index: index,
                                            //     legConfigurationA:item.legConfigurationA? item.legConfigurationA: 0,
                                            //     legConfigurationB:item.legConfigurationB? item.legConfigurationB: 0,
                                            //     legConfigurationC:item.legConfigurationC? item.legConfigurationC: 0,
                                            //     legConfigurationD:item.legConfigurationD? item.legConfigurationD: 0,
                                            //     otherWeight:item.otherWeight? item.otherWeight: 0,
                                            //     totalWeight: item.totalWeight? item.totalWeight: 0,
                                            //   }}));
                                            //   setAttachInfo([...data.fileVOList]);
                                            //   setDescription(data?.description);
                                            //   let totalNumber = '0';
                                            //   data?.drawProductDetailList.forEach((item:any)=>{
                                            //     totalNumber = (parseFloat(item.totalWeight)+parseFloat(totalNumber)).toFixed(2)
                                            //   })
                                            //   setWeight(totalNumber);
                                        }
                                    }
                                }
                            }}
                        >
                            <Button type="primary" disabled={userId !== params.confirmId} ghost >导入</Button>
                        </Upload> : null}
                    {
                        params.status === '3' ? <Button type='primary' ghost disabled={userId !== params.confirmId} onClick={() => {
                            setEdit('添加')
                            setVisible(true)
                        }}>添加</Button>
                            : null
                    }
                    {
                        params.status === '3' ? <Button type='primary' disabled={selectedKeys.length <= 0 || userId !== params.confirmId} onClick={
                            async () => {
                                await RequestUtil.delete(`/tower-science/drawProductDetail?ids=${selectedKeys.join(',')}`,)
                                message.success('删除成功！')
                                run()
                            }
                        } ghost>批量删除</Button>
                            : null
                    }
                </Space>
            </div>
            <Modal
                visible={urlVisible}
                onOk={() => {
                    window.open(url);
                    setUrlVisible(false);
                }}
                onCancel={() => { setUrlVisible(false); setUrl('') }}
                title='提示'
                okText='下载'
            >
                当前存在错误数据，请重新下载上传！
            </Modal>
            <CommonTable columns={tableColumns} dataSource={[...tableDataSource]} pagination={false} rowSelection={{
                selectedRowKeys: selectedKeys,
                onChange: SelectChange
            }} />
            <div style={{ paddingBottom: '24px' }}>
                <DetailTitle title="备注" />
                {detailData ? <TextArea maxLength={800} defaultValue={detailData?.description} onChange={(e) => {
                    setDescription(e.target.value)
                }} disabled={params.status !== '3'} /> : null}
            </div>
            <Attachment dataSource={attachInfo} multiple isBatchDel={userId !== params.confirmId || params.status !== '3' ? false : true} edit={userId !== params.confirmId || params.status !== '3' ? false : true} title="附件信息" ref={attchsRef}
                onDoneChange={(dataInfo: FileProps[]) => {
                    setAttachInfo([...dataInfo])
                }}
            />
        </DetailContent>
        {/* <Modal visible={pictureVisible} onCancel={handlePictureModalCancel} footer={false}>
                <Image src={pictureUrl} preview={false}/>
            </Modal> */}
        <Modal visible={visible} title={edit} onOk={handleModalOk} onCancel={handleModalCancel} width={'95%'}>
            <Form form={form} {...formItemLayout} className={styles.descripForm} >
                <Descriptions title="" bordered size="small" colon={false} column={14}>
                    <Descriptions.Item label="线路名称" span={2}>
                        <Form.Item name="lineName" rules={[{
                            "required": true,
                            "message": "请输入线路名称"
                        }]} wrapperCol={{ span: 24 }}>
                            <Input maxLength={50} style={{ width: '100%' }} />
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="塔型" span={2}>
                        <Form.Item name="productCategory" rules={[{
                            "required": true,
                            "message": "请输入塔型"
                        }]} wrapperCol={{ span: 24 }}>
                            <Input maxLength={30} style={{ width: '100%' }} />
                        </Form.Item>

                    </Descriptions.Item>
                    <Descriptions.Item label="塔型钢印号" span={2}>
                        <Form.Item name="steelProductShape" wrapperCol={{ span: 24 }}>
                            <Input maxLength={30} style={{ width: '100%' }} />
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="产品类型" span={2}>
                        <Form.Item name="productType" rules={[{
                            "required": true,
                            "message": "请选择产品类型"
                        }]} wrapperCol={{ span: 24 }}>
                            <Select style={{ width: '100%' }}>
                                {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="电压等级" span={2}>
                        <Form.Item name="voltageLevel" rules={[{
                            "required": true,
                            "message": "请选择产品类型"
                        }]} wrapperCol={{ span: 24 }}>
                            <Select style={{ width: '100%' }}>
                                {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="结构" span={2}>
                        <Form.Item name="structure" style={{ width: '100%' }} wrapperCol={{ span: 24 }}>
                            <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                                {towerStructureOptions && towerStructureOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="模式" span={2}>
                        <Form.Item name="pattern" style={{ width: '100%' }} wrapperCol={{ span: 24 }}>
                            <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                                {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item children span={14}></Descriptions.Item>
                    {
                        confirmData?.map((item: any, index: number) => {
                            return <>
                                <Descriptions.Item label="杆塔号" span={2}>
                                    <Form.Item name={["confirmList", index, "name"]} wrapperCol={{ span: 24 }} rules={[{
                                        required: true,
                                        message: '请输入杆塔号'
                                        //   validator: (rule: any, value: string, callback: (error?: string) => void) => {
                                        //     checkProductNumber(value).then(res => {
                                        //           if (res>-1) {
                                        //               callback('请输入杆塔号，且同一塔型下杆塔号唯一！')
                                        //           } else {
                                        //               callback();
                                        //           }
                                        //       })
                                        //   }
                                    },
                                    {
                                        pattern: /^[^\s]*$/,
                                        message: '禁止输入空格',
                                    }]}>
                                        <Input maxLength={50} style={{ width: '100%' }} onChange={(value) => {

                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherA: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            legValueSum[index].A = legValueSum[index].name.indexOf('，') > -1 || legValueSum[index].name.indexOf(',') > -1 || legValueSum[index].name.indexOf('/') > -1
                                                ? legValueSum[index].name.split(/\/|,|，/).filter((item: any) => { return item }).length
                                                : legValueSum[index].name.indexOf('-') > -1
                                                    ? Number(legValueSum[index].name.split('-')[1].replace(/[^0-9]/ig, "")) - Number(legValueSum[index].name.split('-')[0].replace(/[^0-9]/ig, "")) + 1
                                                    : legValueSum[index].name.indexOf('~') > -1
                                                        ? Number(legValueSum[index].name.split('~')[1].replace(/[^0-9]/ig, "")) - Number(legValueSum[index].name.split('~')[0].replace(/[^0-9]/ig, "")) + 1
                                                        : 1
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherA + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL
                                            legValueSum[index].totalWeight = legValueSum[index].A * legValueSum[index].monomerWeight

                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} disabled={edit === '编辑'} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="基数" span={2}>
                                    <Form.Item name={["confirmList", index, "A"]} style={{ width: '100%' }} wrapperCol={{ span: 24 }}>
                                        <Input maxLength={50} disabled />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="呼高(m)" span={2}>
                                    <Form.Item name={["confirmList", index, "basicHeight"]} wrapperCol={{ span: 24 }} >
                                        <InputNumber precision={2} min={0} max={99.99} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="本体重量(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "bodyWeight"]} rules={[{
                                        "required": true,
                                        "message": "请输入本体重量(kg)"
                                    }]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherA: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = dataA + dataB + dataC + dataD + otherA + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                            // const dataA:number = form.getFieldValue('legWeightA')?form.getFieldValue('legWeightA'):0;
                                            // const dataB:number = form.getFieldValue('legWeightB')?form.getFieldValue('legWeightB'):0;
                                            // const dataC:number = form.getFieldValue('legWeightC')?form.getFieldValue('legWeightC'):0;
                                            // const dataD:number = form.getFieldValue('legWeightD')?form.getFieldValue('legWeightD'):0;
                                            // const data:number = form.getFieldValue('otherWeight')?form.getFieldValue('otherWeight'):0;
                                            // form.setFieldsValue({
                                            //     monomerWeight:dataA+dataB+dataC+dataD+value,
                                            //     totalWeight:data+dataA+dataB+dataC+dataD+value
                                            // })
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="接腿配置A" span={2}>
                                    <Form.Item name={["confirmList", index, "legConfigurationA"]} wrapperCol={{ span: 24 }}>
                                        <Input maxLength={10} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="接腿配置B" span={2}>
                                    <Form.Item name={["confirmList", index, "legConfigurationB"]} wrapperCol={{ span: 24 }}>
                                        <Input maxLength={10} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="接腿配置C" span={2}>
                                    <Form.Item name={["confirmList", index, "legConfigurationC"]} wrapperCol={{ span: 24 }}>
                                        <Input maxLength={10} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="接腿配置D" span={2}>
                                    <Form.Item name={["confirmList", index, "legConfigurationD"]} wrapperCol={{ span: 24 }}>
                                        <Input maxLength={10} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="接腿重A(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "legWeightA"]}
                                        initialValue={0} wrapperCol={{ span: 24 }}
                                    >
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const dataA: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherA: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = dataA + dataB + dataC + dataD + otherA + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={99999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="接腿重B(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "legWeightB"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const dataA: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataB: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherA: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = dataA + dataB + dataC + dataD + otherA + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={99999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="接腿重C(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "legWeightC"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const dataA: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataB: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataC: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherA: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = dataA + dataB + dataC + dataD + otherA + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={99999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="接腿重D(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "legWeightD"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const dataA: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataB: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataC: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataD: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const otherA: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = dataA + dataB + dataC + dataD + otherA + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={99999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="单重(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "monomerWeight"]} rules={[{
                                        "required": true,
                                        "message": "请输入单重(kg)"
                                    }]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} disabled max={9999999.99} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="总重(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "totalWeight"]} rules={[{
                                        "required": true,
                                        "message": "请输入总重(kg)"
                                    }]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} disabled style={{ width: '100%' }} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="增重-抱箍(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightBg"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="增重-平台(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightPt"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="增重-相序牌(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightXxp"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            console.log(legValueSum)
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="增重-爬梯(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightPat"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="增重-防盗(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightFd"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="增重-兜底绳施工孔板(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightDdssgkb"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="增重-挂点修改(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightGdxg"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="增重-修改(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightXg"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="增重-全塔双帽(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightQtsm"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="增重-螺栓(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightLs"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="其他增重-电缆支架(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightDlzj"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightOther ? legValueSum[index]?.otherWeightOther : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="其他增重-其他(kg)" span={2}>
                                    <Form.Item name={["confirmList", index, "otherWeightOther"]} initialValue={0} wrapperCol={{ span: 24 }}>
                                        <InputNumber precision={2} min={0} style={{ width: '100%' }} onChange={(value: number) => {
                                            const legValueSum = form.getFieldsValue(true)?.confirmList;
                                            const data: number = legValueSum[index]?.bodyWeight ? legValueSum[index]?.bodyWeight : 0;
                                            const dataA: number = legValueSum[index]?.legWeightA ? legValueSum[index]?.legWeightA : 0;
                                            const dataB: number = legValueSum[index]?.legWeightB ? legValueSum[index]?.legWeightB : 0;
                                            const dataC: number = legValueSum[index]?.legWeightC ? legValueSum[index]?.legWeightC : 0;
                                            const dataD: number = legValueSum[index]?.legWeightD ? legValueSum[index]?.legWeightD : 0;
                                            const otherB: number = legValueSum[index]?.otherWeightBg ? legValueSum[index]?.otherWeightBg : 0;
                                            const otherC: number = legValueSum[index]?.otherWeightPt ? legValueSum[index]?.otherWeightPt : 0;
                                            const otherD: number = legValueSum[index]?.otherWeightXxp ? legValueSum[index]?.otherWeightXxp : 0;
                                            const otherE: number = legValueSum[index]?.otherWeightPat ? legValueSum[index]?.otherWeightPat : 0;
                                            const otherF: number = legValueSum[index]?.otherWeightFd ? legValueSum[index]?.otherWeightFd : 0;
                                            const otherG: number = legValueSum[index]?.otherWeightDdssgkb ? legValueSum[index]?.otherWeightDdssgkb : 0;
                                            const otherH: number = legValueSum[index]?.otherWeightGdxg ? legValueSum[index]?.otherWeightGdxg : 0;
                                            const otherI: number = legValueSum[index]?.otherWeightXg ? legValueSum[index]?.otherWeightXg : 0;
                                            const otherJ: number = legValueSum[index]?.otherWeightQtsm ? legValueSum[index]?.otherWeightQtsm : 0;
                                            const otherK: number = legValueSum[index]?.otherWeightLs ? legValueSum[index]?.otherWeightLs : 0;
                                            const otherL: number = legValueSum[index]?.otherWeightDlzj ? legValueSum[index]?.otherWeightDlzj : 0;
                                            const A = legValueSum[index]?.A ? legValueSum[index]?.A : 0;
                                            legValueSum[index].monomerWeight = data + dataA + dataB + dataC + dataD + otherB + otherC + otherD + otherE + otherF + otherG + otherH + otherI + otherJ + otherK + otherL + value
                                            legValueSum[index].totalWeight = A * legValueSum[index].monomerWeight
                                            console.log(legValueSum)
                                            form.setFieldsValue({
                                                confirmList: [...legValueSum]
                                            })
                                            setConfirmData([...legValueSum])
                                        }} max={999999.99} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="备注" span={7}>
                                    <Form.Item name={["confirmList", index, "description"]} wrapperCol={{ span: 24 }}>
                                        <TextArea rows={1} maxLength={800} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item span={2}>
                                    <Space direction="horizontal">
                                        {index === confirmData.length - 1 && edit !== '编辑' && <Button type="primary" ghost size="small" onClick={() => {
                                            const value = form.getFieldsValue(true).confirmList
                                            value.push({
                                                otherWeightBg: 0,
                                                otherWeightPt: 0,
                                                otherWeightXxp: 0,
                                                otherWeightPat: 0,
                                                otherWeightFd: 0,
                                                otherWeightGdxg: 0,
                                                otherWeightXg: 0,
                                                otherWeightQtsm: 0,
                                                otherWeightLs: 0,
                                                legWeightA: 0,
                                                legWeightB: 0,
                                                legWeightC: 0,
                                                legWeightD: 0,
                                            })
                                            form.setFieldsValue({
                                                confirmList: [...value]
                                            })
                                            setConfirmData([...value])

                                        }}>添加</Button>}
                                        {confirmData.length !== 1 && <Button type="ghost" size="small" onClick={() => {
                                            confirmData.splice(index, 1)
                                            form.setFieldsValue({
                                                confirmList: [...confirmData]
                                            })
                                            setConfirmData([...confirmData])
                                        }}>删除</Button>}
                                    </Space>
                                </Descriptions.Item>
                            </>
                        })
                    }
                </Descriptions>
            </Form>
        </Modal>
    </Spin>
}
