import React, { useState } from 'react';
import { Space, Input, Button, Form, Select, message, Modal, Row, Col, Spin, InputNumber, Radio } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { PlusOutlined } from "@ant-design/icons"
import styles from './release.module.less';

export default function Release(): React.ReactNode {
    const history = useHistory();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
    const [tableDataSource, setTableDataSource] = useState<any[]>([]);
    const [aTableDataSource, setATableDataSource] = useState<any[]>([]);
    const [bTableDataSource, setBTableDataSource] = useState<any[]>([]);
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const params = useParams<{ id: string }>()
    const [check, setCheck] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [visible, setVisible] = useState<boolean>(false);
    const [releaseData, setReleaseData] = useState<any | undefined>({});
    const [saveLoading, setSaveLoading] = useState<boolean>(false);

    const [formTable] = Form.useForm()
    const columnsCommon: any[] = [
        {
            title: "批次号",
            dataIndex: "productionBatchNo",
            width: 150
        },
        {
            title: "杆塔号",
            dataIndex: "productNumber",
            width: 150
        },
        {
            title: "呼高",
            dataIndex: "basicHeight",
            width: 150
        },
        {
            title: "状态",
            dataIndex: "status",
            width: 150,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_ === 0 ? '正常' : _ === 1 ? '暂停' : _ === 2 ? '恢复' : '-'}</span>
            )
        }
    ]
    const [columns, setColumns] = useState<any>(columnsCommon)
    const [cancelList, setCancelList] = useState<any[]>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/loftingBatch/${params.id}`);
        const value = data?.loftingBatchProductVOList.filter((item: any) => {
            return item.isAll === 0 || item.isAll === '0'
        })
        setColumns([...columnsCommon, ...data?.segmentNameList?.map(((item: any) => ({
            title: item,
            align: "center",
            key: item,
            dataIndex: item
            // children: columnsCommon.map((head: any) => {
            //     return ({
            //         ...head,
            //         dataIndex: `${item.productionLinkIds}-${head.code}`,
            //         render: (value: any, records: any) => records.unitData[item.productionLinkIds]?.[head.code] || ""
            //     })
            // })
        })))])
        form.setFieldsValue({
            ...data,
            isPerforate: 0,
            cancelIssuedNumber: data?.cancelIssuedNumber && data?.cancelIssuedNumber !== null && data?.cancelIssuedNumber.indexOf(',') > -1 ? data?.cancelIssuedNumber.split(',') : undefined
            // loftingBatchProductDTOList:value.map((item:any)=>{
            //     return{
            //         ...item,
            //         batchNum:0
            //     }
            // }),
            // loftingBatchProductDTOList:[{id:1,segmentName:1,segmentNum:10,issuedNum:null},{id:2,segmentName:2,segmentNum:5,issuedNum:1},{id:3,segmentName:3,segmentNum:5,issuedNum:5}],
        })
        formRef.setFieldsValue({
            trialAssembleSegments: [],
        })
        setDisabled(data?.trialAssemble === 1)
        setTableDataSource(value.map((item: any) => {
            return {
                ...item,
                batchNum: 0,
                loftingBatchSegmentVOList: item?.loftingBatchSegmentVOList.map((itemItem: any) => {
                    return {
                        ...itemItem,
                        productId: item?.productId
                    }
                })
            }
        }))
        setBTableDataSource(data?.loftingStatisticsVOList.map((item: any) => {
            return {
                ...item,
                batchNum: 0
            }
        }))
        setReleaseData(data)
        const cancelData: any[] = await RequestUtil.get(`/tower-science/loftingBatch/canceled/batch/list/${params.id}`);
        setCancelList(cancelData)
    }), {})
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }
    return (
        <Spin spinning={false}>
            <Modal
                title='试装信息'
                width={'40%'}
                visible={visible}
                onCancel={() => {
                    formRef.resetFields()
                    form.setFieldsValue({
                        trialAssembleSegment: ''
                    })
                    setVisible(false)
                }}
                onOk={async () => {
                    await formRef.validateFields();
                    const value = formRef.getFieldsValue(true).trialAssembleSegments
                    const warnValue = value.filter((item: any) => {
                        return item.trialAssembleNum > 0
                    })
                    if (!(warnValue.length > 0)) {
                        return message.error(`至少存在一条非0的试装数量数据！`)
                    }
                    form.setFieldsValue({
                        trialAssembleSegment: warnValue.map((item: any) => {
                            return item.segmentName + '*' + item.trialAssembleNum
                        }).join(',')
                    })
                    setATableDataSource(value)
                    formRef.setFieldsValue({
                        trialAssembleSegments: value
                    })
                    setVisible(false)
                }}
            >
                <Form form={formRef} className={styles.descripForm}>
                    <CommonTable
                        columns={[
                            {
                                title: "序号",
                                dataIndex: "index",
                                width: 50,
                                render: (_a: any, _b: any, index: number) => <>{index + 1}</>
                            },
                            {
                                title: "段号",
                                dataIndex: "segmentName",
                                width: 50,
                            },
                            {
                                title: "试装数量",
                                dataIndex: "trialAssembleNum",
                                width: 100,
                                render: (number: number, record: any, index: number) => {
                                    return <Form.Item name={['trialAssembleSegments', index, 'trialAssembleNum']} initialValue={number} rules={[
                                        //     {
                                        //     required:true,
                                        //     message:'请输入试装数量'
                                        // },
                                        {
                                            validator: (rule, value, callback) => {
                                                let maxPrice = record.batchNum; //拿到最大值
                                                if (value > maxPrice) {
                                                    callback(`不能大于下达数量${maxPrice}`);
                                                }
                                                else {
                                                    callback();
                                                }
                                            },
                                        },
                                    ]}>
                                        <InputNumber precision={0} min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                }
                            }
                        ]}
                        dataSource={aTableDataSource}
                        pagination={false}
                        rowKey={'id'}
                    />
                </Form>
            </Modal>
            <DetailContent operation={[
                <Space>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                    <Button type='primary' loading={saveLoading} onClick={async () => {
                        setSaveLoading(true)
                        form.validateFields().then(res => {
                            const value = form.getFieldsValue(true)
                            if (value.trialAssemble === 1) {
                                if (!value.trialAssembleSegment) {
                                    message.error('未填写试装段，不可保存！')
                                    setSaveLoading(false)
                                }
                            }
                            const trialValue = formRef.getFieldsValue(true)?.trialAssembleSegments ? formRef.getFieldsValue(true)?.trialAssembleSegments.map((item: any) => {
                                return {
                                    id: item.id,
                                    productCategoryId: params.id,
                                    segmentId: item.segmentId,
                                    segmentName: item.segmentName,
                                    trialAssembleNum: item.trialAssembleNum ? item.trialAssembleNum : 0,
                                }
                            }) : []
                            let arr: any[] = [];
                            tableDataSource.forEach((item: any) => {
                                const value = item.loftingBatchSegmentVOList.map((itemItem: any) => {
                                    return {
                                        ...itemItem,
                                        productId: itemItem?.productId,
                                        productNumber: item?.productNumber,
                                        batchNum: itemItem?.batchNum ? String(itemItem?.batchNum) : '0'
                                    }
                                })
                                arr.push(...value)
                            })
                            const submitValue = {
                                galvanizeDemand: value.galvanizeDemand,
                                machiningDemand: value.machiningDemand,
                                implementStandardName: value.implementStandardName,
                                implementStandard: value.implementStandard,
                                packDemand: value.packDemand,
                                cancelIssuedNumber: value.cancelIssuedNumber ? value.cancelIssuedNumber.join(',') : "",
                                planNumber: releaseData?.productCategoryVOList[0].voltageLevel,
                                productCategoryId: params.id,
                                trialAssemble: value.trialAssemble,
                                trialAssembleDemand: value.trialAssembleDemand,
                                voltageLevel: releaseData?.productCategoryVOList[0].voltageLevel,
                                weldingDemand: value.weldingDemand,
                                isPerforate: value.isPerforate,
                                description: value.description,
                                trialAssembleSegments: trialValue,
                                loftingBatchProductDTOList: arr,
                                loftingBatchStatisticsDTOList: bTableDataSource.map((item: any) => {
                                    return {
                                        ...item,
                                        batchNum: item?.batchNum ? String(item?.batchNum) : '0'
                                    }
                                })
                            }
                            RequestUtil.post(`/tower-science/loftingBatch/save`, submitValue).then(() => {
                                message.success('保存成功');
                                history.push(`/workMngt/releaseList`)
                                setSaveLoading(false)
                            }).catch(e => {

                                console.log(e)
                                setSaveLoading(false)
                            })
                        }).catch(e => {
                            console.log(e)
                        })

                    }}>保存</Button>
                </Space>
            ]}>
                <DetailTitle title='基础信息' />
                <CommonTable columns={[
                    {
                        title: "塔型",
                        dataIndex: "name",
                        width: 50,
                    },
                    {
                        title: "钢印号",
                        dataIndex: "steelProductShape",
                        width: 150
                    },
                    {
                        title: "计划号",
                        dataIndex: "planNumber",
                        width: 150
                    },
                    {
                        title: "试装",
                        dataIndex: "trialAssembleName",
                        width: 150
                    },
                    {
                        title: "电压等级",
                        dataIndex: "voltageGradeName",
                        width: 150
                    },
                    {
                        title: "材料标准",
                        dataIndex: "materialStandardName",
                        width: 150
                    },
                    {
                        title: "产品类型",
                        dataIndex: "productTypeName",
                        width: 150
                    }
                ]}
                    dataSource={releaseData?.productCategoryVOList} pagination={false} />
                {/* <DetailTitle title='批次信息'/>
                    <CommonTable
                        columns={[
                            {
                                title: "批次号",
                                dataIndex: "productionBatchNo",
                            },
                            {
                                title: "基数",
                                dataIndex: "num",
                            },
                            {
                                title: "杆塔号",
                                dataIndex: "productNames",
                            }
                        ]}
                        pagination={false}
                        dataSource={ releaseData?.loftingBatchDetailVOList}
                    /> */}

                <Form form={form} labelCol={{ span: 4 }}>
                    <DetailTitle title='下达信息' />
                    <Row >
                        <Col span={12}>
                            <Form.Item name="machiningDemand" label="加工要求">
                                <Input.TextArea placeholder="请输入" maxLength={800} showCount rows={1} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="weldingDemand" label="电焊说明">
                                <Input.TextArea placeholder="请输入" maxLength={800} showCount rows={1} />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="galvanizeDemand" label="镀锌要求">
                                <Input.TextArea placeholder="请输入" maxLength={800} showCount rows={1} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="packDemand" label="包装说明">
                                <Input.TextArea placeholder="请输入" maxLength={800} showCount rows={1} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="cancelIssuedNumber" label="已取消下达单号">
                                <Select style={{ width: "100%" }} showSearch allowClear mode="multiple">
                                    {cancelList && cancelList.map(({ id, issuedNumber }, index) => {
                                        return <Select.Option key={index} value={issuedNumber}>
                                            {issuedNumber}
                                        </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="description" label="备注">
                                <Input.TextArea placeholder="请输入" maxLength={800} showCount rows={1} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="isPerforate" label="是否钻孔特殊要求">
                                <Radio.Group style={{ paddingLeft: "12px", width: "100%" }} defaultValue={0}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="implementStandardName" label="执行标准">
                                <Input.TextArea maxLength={800} showCount rows={1} disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <DetailTitle title='试装信息' />
                    <Row>
                        <Col span={12}>
                            <Form.Item name="trialAssemble" label="试装类型" rules={[{
                                "required": true,
                                "message": "请选择试装类型"
                            },
                            {
                                pattern: /^[^\s]*$/,
                                message: '禁止输入空格',
                            }]}>
                                <Select style={{ width: "100%" }} onChange={(value) => {
                                    form.setFieldsValue({
                                        trialAssembleSegment: '',
                                        trialAssembleDemand: ''
                                    })
                                    formRef.setFieldsValue({
                                        trialAssembleSegments: []
                                    })
                                    setDisabled(value === 1)
                                }}>
                                    <Select.Option value={1} key={1}>试组装</Select.Option>
                                    <Select.Option value={0} key={0}>免试组</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="trialAssembleSegment" label="试装段">
                                <Input
                                    disabled
                                    addonAfter={<PlusOutlined onClick={async () => {
                                        await form.validateFields()
                                        form.getFieldsValue(true).trialAssemble === 1 && setVisible(true);
                                        const value = bTableDataSource.filter((item: any, index: number) => {
                                            return item.batchNum && item.batchNum !== null && item.batchNum !== '0' && item.batchNum !== 0
                                        });
                                        let newArr: any[] = [];
                                        const arr = JSON.parse(JSON.stringify(value))
                                        for (var i = 0; i < arr.length; i++) {
                                            const res = newArr.findIndex(ol => {
                                                return arr[i].segmentName === ol.segmentName;
                                            });
                                            if (res !== -1) {
                                                newArr[res].batchNum = newArr[res].batchNum + arr[i].batchNum;
                                            } else {
                                                newArr.push(arr[i]);
                                            }
                                        }
                                        setATableDataSource(newArr)
                                        formRef.setFieldsValue({
                                            trialAssembleSegments: newArr
                                        })
                                    }} />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="trialAssembleDemand" label="试装说明">
                                <Input.TextArea placeholder="请输入" maxLength={200} showCount rows={1} disabled={!disabled} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <DetailTitle title='杆塔信息' operation={[<Checkbox checked={check} onChange={(e: { target: { checked: any; }; }) => {
                    if (e.target.checked) {
                        form.setFieldsValue({
                            // loftingBatchProductDTOList:releaseData?.loftingBatchProductVOList.map((item:any)=>{
                            //     return{
                            //         ...item,
                            //         batchNum:0
                            //     }
                            // }),
                            trialAssembleSegment: ''
                        })
                        formRef.setFieldsValue({
                            trialAssembleSegments: [],
                        })
                        setTableDataSource(releaseData?.loftingBatchProductVOList.map((item: any) => {
                            return {
                                ...item,
                                batchNum: 0,
                                productId: item?.productId,
                            }
                        }))
                        setSelectedKeys([])

                    } else {
                        const value = releaseData?.loftingBatchProductVOList.filter((item: any) => {
                            return item.isAll === 0 || item.isAll === '0'
                        })
                        form.setFieldsValue({
                            // loftingBatchProductDTOList:value.map((item:any)=>{
                            //     return{
                            //         ...item,
                            //         batchNum:0
                            //     }
                            // }),
                            trialAssembleSegment: ''
                        })
                        formRef.setFieldsValue({
                            trialAssembleSegments: [],
                        })
                        setTableDataSource(value.map((item: any) => {
                            return {
                                ...item,
                                batchNum: 0,
                                productId: item?.productId,
                            }
                        }))
                        setSelectedKeys([])
                    }
                    setCheck(e.target.checked)

                }}>显示已全部下达</Checkbox>, <Button type="primary" onClick={() => {
                    const value = tableDataSource.map((item: any, index: number) => {
                        const segmentItem = item?.loftingBatchSegmentVOList.map((itemItem: any) => {
                            return {
                                [itemItem?.segmentName]: selectedKeys.includes(index.toString()) ? itemItem.releaseNum : 0
                            }
                        })
                        const finalItem = Object.assign({}, item, ...segmentItem)
                        return {
                            ...finalItem,
                            loftingBatchSegmentVOList: item?.loftingBatchSegmentVOList.map((itemItem: any) => {
                                return {
                                    ...itemItem,
                                    productId: item?.productId,
                                    batchNum: selectedKeys.includes(index.toString()) ? itemItem.releaseNum : '0'
                                }
                            })
                        }
                    })
                    form.setFieldsValue({
                        // loftingBatchProductDTOList:value,
                        trialAssembleSegments: ''
                    })
                    setTableDataSource(value)
                    setBTableDataSource(bTableDataSource.map((item: any) => {
                        const getDataIndex = columns.filter((itemItem: any) => {
                            return item.segmentName === itemItem.title
                        })
                        const valueArr = getDataIndex.length > 0 ? value.map((item: any) => {
                            return item[getDataIndex[0].dataIndex]
                        }) : []
                        return {
                            ...item,
                            batchNum: valueArr.reduce((pre: any, cur: any) => {
                                console.log(parseFloat(pre && pre !== null ? pre : 0) + parseFloat(cur && cur !== null ? cur : 0))
                                return parseFloat(pre && pre !== null ? pre : 0) + parseFloat(cur && cur !== null ? cur : 0)
                            }, 0)
                        }
                    }))
                }} disabled={!(selectedKeys.length > 0)}>输入全部</Button>]} />
                <Form form={form} className={styles.descripForm}>
                    <CommonTable columns={[...columns,
                    {
                        key: "operation",
                        title: "操作",
                        dataIndex: "operation",
                        align: "center",
                        width: 80,
                        fixed: "right",
                        render: (
                            _: undefined,
                            records: any, index: number): React.ReactNode => {
                            return (
                                <Space direction="horizontal" size="small">
                                    <Button type='link' onClick={async () => {
                                        await formTable.setFieldsValue({
                                            ...records,
                                        })
                                        Modal.confirm({
                                            title: "编辑",
                                            icon: null,
                                            width: '60%',
                                            content: <Form form={formTable} labelCol={{ span: 4 }}>
                                                <Form.Item name='id' style={{ display: 'none' }}>
                                                    <Input type="hidden" />
                                                </Form.Item>
                                                <Form.Item name='id' style={{ display: 'none' }}>
                                                    <Input type="hidden" />
                                                </Form.Item>
                                                <Row>
                                                    {
                                                        [...columns].map((item: any, index: number) => {
                                                            const maxNum = records?.loftingBatchSegmentVOList.filter((items: any) => { return items.segmentName === item.title })
                                                            // const maxNum=[{releaseNum: 100}];
                                                            return <Col span={12}>
                                                                <Form.Item label={item.title} name={item.dataIndex} >
                                                                    {
                                                                        index < 4 ? index === 3 ? <Select style={{ width: "100%" }} disabled>
                                                                            <Select.Option key={0} value={0}>正常</Select.Option>
                                                                            <Select.Option key={1} value={1}>暂停</Select.Option>
                                                                            <Select.Option key={2} value={2}>恢复</Select.Option>
                                                                        </Select> : <InputNumber disabled={index < 4} precision={0} min={0} style={{ width: "100%" }} /> :
                                                                            <InputNumber disabled={index < 4} precision={0} max={maxNum[0]?.releaseNum || 0} min={0} style={{ width: "100%" }} />
                                                                    }

                                                                </Form.Item>
                                                            </Col>
                                                        })
                                                    }
                                                </Row>
                                            </Form>,
                                            onOk: () => new Promise(async (resolve, reject) => {
                                                try {
                                                    const value = await formTable.validateFields()
                                                    // await run(selectedKeys.map((item: any) => ({
                                                    //     id: item,
                                                    //     loftingCompleteTime: loftingCompleteTime.loftingCompleteTime.format("YYYY-MM-DD") + " 00:00:00"
                                                    // })))
                                                    const loftingBatchSegmentVOListData: any = tableDataSource[index]?.loftingBatchSegmentVOList
                                                    const tableData: any = {
                                                        isAll: 0,
                                                        ...value,
                                                        loftingBatchSegmentVOList: loftingBatchSegmentVOListData.map((itemItem: any) => {
                                                            return {
                                                                ...itemItem,
                                                                productId: tableDataSource[index]?.productId,
                                                                batchNum: typeof value[itemItem?.segmentName] === 'number' ? JSON.stringify(value[itemItem?.segmentName]) : value[itemItem?.segmentName]
                                                            }
                                                        })
                                                    }
                                                    tableDataSource.splice(index, 1, tableData)
                                                    const arrNew = tableDataSource.filter((item: any) => {
                                                        return item.productionBatchNo === value?.productionBatchNo && item.isAll === 0
                                                    })
                                                    setBTableDataSource(bTableDataSource.map((item: any) => {
                                                        const getDataIndex = columns.filter((itemItem: any) => {
                                                            return item.segmentName === itemItem.title
                                                        })
                                                        const valueArr = getDataIndex.length > 0 ? arrNew.map((item: any) => {
                                                            return item[getDataIndex[0].dataIndex]
                                                        }) : []
                                                        return {
                                                            ...item,
                                                            batchNum: item.productionBatchNo == value?.productionBatchNo ? valueArr.reduce((pre: any, cur: any) => {
                                                                console.log(parseFloat(pre && pre !== null ? pre : 0) + parseFloat(cur && cur !== null ? cur : 0))
                                                                return parseFloat(pre && pre !== null ? pre : 0) + parseFloat(cur && cur !== null ? cur : 0)
                                                            }, 0) : item?.batchNum
                                                        }
                                                    }))
                                                    resolve(true)
                                                    setSelectedRows([])
                                                    formTable.resetFields()
                                                    message.success("编辑成功！")

                                                } catch (error) {
                                                    reject(false)
                                                }
                                            }),
                                            onCancel() {
                                                formTable.resetFields()
                                            }
                                        })
                                    }}
                                        disabled={records?.isAll !== 0}
                                    >编辑</Button>
                                </Space>
                            );
                        }
                    }]}
                        dataSource={[...tableDataSource]}
                        pagination={false}
                        rowSelection={{
                            selectedRowKeys: selectedKeys,
                            onChange: SelectChange,
                            getCheckboxProps: (record: Record<string, any>) => ({
                                disabled: record?.isAll === 1
                            })
                        }}
                        rowKey={(item: any, index: number) => `${index}`}
                    // rowKey = {'index'}
                    />
                    <DetailTitle title='统计信息' />
                    <CommonTable
                        columns={[
                            {
                                title: "序号",
                                dataIndex: "index",
                                width: 50,
                                render: (_a: any, _b: any, index: number) => <>{index + 1}</>
                            },
                            {
                                title: "段号",
                                dataIndex: "segmentName",
                            },
                            {
                                title: "批次号",
                                dataIndex: "productionBatchNo",
                            },
                            {
                                title: "总段数",
                                dataIndex: "segmentNum",
                            },
                            {
                                title: "已下达数量",
                                dataIndex: "issuedNum",
                            },
                            {
                                title: "本次下达数量",
                                dataIndex: "batchNum",
                            }
                        ]}
                        pagination={false}
                        dataSource={[...bTableDataSource]}
                    />
                </Form>
            </DetailContent>
        </Spin>
    )
}
