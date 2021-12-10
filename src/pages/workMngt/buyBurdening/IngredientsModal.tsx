import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Table, Form, Select, InputNumber } from 'antd';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil';
import { DetailTitle, BaseInfo, CommonTable, formatData } from '../../common'
import { BatchingScheme, alternative, ConstructionClassification, ConstructionClassificationDetail } from './IngredientsModal.json';
interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    structureSpec: string;
    structureTexture: string
}
export default function IngredientsModal(props: any) {
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('radio');
    // 构建分类选择的集合
    const [ selectSort, setSelectSort ] = useState<any>([]);
    // 构建分类明细选择的集合
    const [ selectedRowKeysCheck, setSelectedRowKeysCheck ] = useState<any>([]);
    const [ serarchForm ] = Form.useForm();
      
    const handleOkuseState = () => {
        console.log(selectedRowKeysCheck, "selectedRowKeysCheck")
    }

    // 获取构建分类
    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/purchaseTaskTower/component/material/${id}`)
            result?.materialList.map((element: any, index: number) => {
                element["key"] = `${element.structureTexture}_${index}`
            });
            resole(result);
            if (result?.materialList.length > 0) {
                // 默认选中第一条
                setSelectSort([result?.materialList[0].key])
                // 获取构建分类明细
                getSortDetail(props.id, result?.materialList[0]?.structureSpec, result?.materialList[0]?.structureTexture);
            }
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取构建分类明细
    const { run: getSortDetail, data: sortDetailList } = useRequest<{ [key: string]: any }>((purchaseTowerId: string, spec: string, texture: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/purchaseTaskTower/component/${purchaseTowerId}/${spec}/${texture}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => {
        getUser(props.id);
    }, [props.id && props.visible])

    const rowSelection = {
        selectedRowKeys: selectSort,
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            // 构建分类改变了，获取构建分类明细
            getSortDetail(props.id, selectedRows[0]?.structureSpec, selectedRows[0]?.structureTexture);
            setSelectSort(selectedRowKeys);
        }
    };
    const rowSelectionCheck = {
        selectedRowKeys: selectedRowKeysCheck,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeysCheck(selectedRowKeys)
        }
    };
    return (
        <Modal
            title={'配料'}
            visible={props.visible}
            maskClosable={false}
            width={1200}
            onCancel={() => {
                props.onCancel();
            }}
            footer={[
                <Button type="primary">
                    手动配料
                </Button>,
                <Button key="submit" type="primary">
                    保存
                </Button>,
                <Button type="primary" onClick={() => handleOkuseState()}>
                    保存并提交
                </Button>,
                <Button key="back" onClick={() => {
                    props.onCancel();
                }}>
                   取消
                </Button>
            ]}
        >
            <Row>
                {/* 左右布局 */}
                <Col span={12}>
                   <DetailTitle title="配料策略" />
                   {/* 配料策略 */}
                   <Form form={serarchForm} style={{paddingLeft: "14px", display: "flex", flexWrap: "nowrap"}}>
                        <Form.Item
                            name="num1"
                            label="开数">
                                <Select style={{ width: 120 }} placeholder="请选择">
                                    <Select.Option value="jack">Jack</Select.Option>
                                    <Select.Option value="lucy">Lucy</Select.Option>
                                    <Select.Option value="Yiminghe">yiminghe</Select.Option>
                                </Select>
                        </Form.Item>&nbsp;
                        <Form.Item
                            name="num3"
                            label="米数">
                                <InputNumber
                                    min="0"
                                    step="0.01"
                                    precision={2}
                                />&nbsp;
                        </Form.Item>
                        <Form.Item
                            name="num4">
                                <InputNumber
                                    min="0"
                                    step="0.01"
                                    precision={2}
                                />
                        </Form.Item>&nbsp;
                        <Form.Item
                            name="num5"
                            label="利用率">
                                <InputNumber
                                    min="0"
                                    step="0.01"
                                    precision={2}
                                />
                        </Form.Item>
                    </Form>
                   <div style={{display: "flex", flexWrap: "nowrap",paddingLeft: "14px", boxSizing: "border-box", lineHeight: "14px", marginBottom: 20, marginTop: 20}}>
                      <span style={{fontSize: "16px", marginRight: "4px"}}>构件分类</span>
                      <span style={{color: "#FF8C00"}}>未分配/全部：{(userData as any) && (userData as any).notConfigured}/{(userData as any) && (userData as any).totalNum}</span>
                   </div>
                   <Table
                        size="small"
                        rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                        }}
                        columns={ConstructionClassification}
                        dataSource={(userData as any) && (userData as any).materialList ? (userData as any).materialList : []}
                        pagination={false}
                     />
                     <div style={{display: "flex", flexWrap: "nowrap",paddingLeft: "14px", boxSizing: "border-box", lineHeight: "14px", marginBottom: 20, marginTop: 20}}>
                      <span style={{fontSize: "16px", marginRight: "4px"}}>构件分类明细</span>
                      <span style={{color: "#FF8C00"}}>{(sortDetailList as any) && (sortDetailList as any).completionProgres} 全部： {(sortDetailList as any) && (sortDetailList as any).totalNum}</span>
                   </div>
                   <Table
                        size="small"
                        rowSelection={{
                        type: "checkbox",
                        ...rowSelectionCheck,
                        }}
                        columns={[
                            {
                                key: 'index',
                                title: '件号',
                                dataIndex: 'index',
                                width: 50,
                                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                            },
                            ...ConstructionClassificationDetail
                        ]}
                        dataSource={(sortDetailList as any) && (sortDetailList as any).componentList ? (sortDetailList as any).componentList : []}
                        pagination={false}
                     />
                </Col>
                <Col span={12}>
                    <DetailTitle title="配料方案" />
                    <CommonTable
                        columns={[
                            ...BatchingScheme,
                            {
                                title: "操作",
                                dataIndex: "opration",
                                fixed: "right",
                                width: 100,
                                render: (_: any, record: any) => {
                                    return (
                                        <>
                                            <Button type="link">移除</Button>
                                        </>
                                    )
                                }
                            }
                        ]} dataSource={[]} pagination={false} 
                    />
                    <DetailTitle title="备选方案" />
                    <CommonTable
                        columns={[
                            ...alternative,
                            {
                                title: "操作",
                                dataIndex: "opration",
                                fixed: "right",
                                width: 100,
                                render: (_: any, record: any) => {
                                    return (
                                        <>
                                            <Button type="link">选中</Button>
                                        </>
                                    )
                                }
                            }
                        ]} dataSource={[]} pagination={false} 
                    />
                </Col>
            </Row>
        </Modal>
    )
}
