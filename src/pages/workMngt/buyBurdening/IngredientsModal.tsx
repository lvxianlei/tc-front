import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Table, Form, Select, InputNumber, message } from 'antd';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil';
import { DetailTitle, BaseInfo, CommonTable, formatData } from '../../common'
import { BatchingScheme, alternative, ConstructionClassification, ConstructionClassificationDetail } from './IngredientsModal.json';
import "./ingredientsModal.less"
interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    structureSpec: string;
    structureTexture: string
}
interface SchemeComponentList {
    code: string;
    num: string;
    length: string;
}
interface SchemeList {
    length: string,
    lossLength: string,
    plannedSurplusLength: string,
    structureSpec: string,
    structureTexture: string,
    utilizationRate: string,
    schemeComponentList: SchemeComponentList[]
}
export default function IngredientsModal(props: any) {
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('radio');
    // 构建分类选择的集合
    const [ selectSort, setSelectSort ] = useState<any>([]);
    // 构建分类明细选择的集合
    const [ selectedRowKeysCheck, setSelectedRowKeysCheck ] = useState<any>([]);
    // 构建分类数据
    const [constructionClassification, setConstructionClassification] = useState<any[]>([]);
    // 构建分类明细数据
    const [constructionClassificationDetail, setConstructionClassificationDetail] = useState<any[]>([]);
    // 构建分类未配的数量
    const [construNumber, setConstruNumber] = useState<number>(0);
    // 构建分类明细未配的数量
    const [construNumberDetail, setConstruNumberDetail] = useState<number>(0);
    // 开数
    const [policyDetailed, setPolicyDetailed] = useState([]);
    // 米数
    const [batchingLength, setBatchingLength] = useState([]);
    // 利用率
    const [utilizationRate, setUtilizationRate] = useState([]);
    // 备料方案
    const [ preparation, setPreparation ] = useState([]);
    // 配料方案
    const [schemeData, setSchemeData] = useState<any>([]);
    let [numbers, setNumbers] = useState<any>(0);
    const [ serarchForm ] = Form.useForm();

    let map:Map<string,number> = new Map();
      
    const handleOkuseState = async() => {
        const serarchData = await serarchForm.validateFields();
        if (serarchData.num1 * 1 !== selectedRowKeysCheck.length) {
            message.error("勾选的分类明细跟开数不符！");
            return false;
        }
        if (serarchData.num3 * 1 > serarchData.num4 * 1) {
            message.error("请选择合适的米数范围！");
            return false;
        }
        // 构建分类
        const result = constructionClassification.filter((item: any) => item.key === selectSort[0]);
        // 构建分类明细
        const detail = [];
        for (let i = 0; i < selectedRowKeysCheck.length; i += 1) {
            const v = constructionClassificationDetail.filter((item: any) => item.id === selectedRowKeysCheck[i]);
            if (v && v.length > 0) {
                const detailObj = {
                    id: v[0].id,
                    notConfigured: v[0].notConfigured
                }
                detail.push(detailObj)
            }
        }
        // 调用手动配料
        purchaseBatchingScheme(serarchData, result, detail);
    }

    // 获取配料策略
    const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/angleConfigStrategy/getIngredientsConfigList`);
            setPolicyDetailed(result.openNumber.policyDetailed);
            setBatchingLength(result.batchingLength.policyDetailed);
            setUtilizationRate(result.utilizationRate.policyDetailed);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 相当于编辑获取配料方案
    const { run: purchaseListRun, data: purchaseList } = useRequest<{ [key: string]: any }>((purchaseTaskTowerId: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/purchaseBatchingScheme/batcher/scheme/${purchaseTaskTowerId}`);
            setSchemeData(result.schemeData || []);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取构建分类
    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/purchaseTaskTower/component/material/${id}`)
            result?.materialList.map((element: any, index: number) => {
                element["key"] = `${element.structureTexture}_${index}`
            });
            setConstructionClassification(result?.materialList || []);
            setConstruNumber(result.notConfigured || 0);
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
            result?.componentList.map((element: any, index: number) => {
                element["key"] = `${element.id}`
            });
            setConstructionClassificationDetail(result?.componentList || []);
            setConstruNumberDetail(result.completionProgres || 0);
            setNumbers(numbers += 1);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 手动配料
    const { run: purchaseBatchingScheme, data: purchaseBatchingSchemeData } = useRequest((serarchData: any, resultSort: any, detail: any) => new Promise(async (resole, reject) => {
        try {
            const obj = {
                openNumber: serarchData.num1, // 开数
                startMetre: serarchData.num3, // 开始米数
                endMetre: serarchData.num4, // 结束米数
                utilizationRate: serarchData.num5, // 利用率
                purchaseTowerId: props.id, // 采购塔型id
                structureSpec: resultSort[0].structureSpec,  // 规格
                structureTexture: resultSort[0].structureTexture, // 材质
                components: detail
            }
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/purchaseBatchingScheme/batcher/scheme`, obj);
            if (result && result.schemeData && result.schemeData.length > 0) {
                setPreparation(result.schemeData || []);
            } else {
                message.error("没有合适的备选方案！");
                return false;
            }
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 是否存在
    const isExistence = (schemeData: any, component: string, len: string, num: string) => {
        if (schemeData[component] && schemeData[len] && schemeData[num]) {
            return {
                code: schemeData[component],
                length: schemeData[len],
                num: schemeData[num]
            }
        }
        return false;
    }

    // 保存并提交
    const { run: purchaseSave, data: purchaseSaveData } = useRequest((serarchData: any) => new Promise(async (resole, reject) => {
        try {
            // 对数据进行处理
            const schemeList = []
            for (let i = 0; i < schemeData.length; i += 1) {
                const v: SchemeList = {
                    length: schemeData[i].length,
                    lossLength: schemeData[i].lossLength,
                    plannedSurplusLength: schemeData[i].plannedSurplusLength,
                    structureSpec: schemeData[i].structureSpec,
                    structureTexture: schemeData[i].structureTexture,
                    utilizationRate: schemeData[i].utilizationRate,
                    schemeComponentList: []
                }
                const component1 = isExistence(schemeData[i], "component1", "len1", "num1");
                const component2 = isExistence(schemeData[i], "component2", "len2", "num2");
                const component3 = isExistence(schemeData[i], "component3", "len3", "num3");
                const component4 = isExistence(schemeData[i], "component4", "len4", "num4");
                if (component1) {
                    v.schemeComponentList.push((component1 as any))
                }
                if (component2) {
                    v.schemeComponentList.push((component2 as any))
                }
                if (component3) {
                    v.schemeComponentList.push((component3 as any))
                }
                if (component4) {
                    v.schemeComponentList.push((component4 as any))
                }
                schemeList.push(v);
            }
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/purchaseBatchingScheme`, {
                purchaseTaskTowerId: props.id,
                schemeList: schemeList
            });
            resole(result);
            message.success("配料成功！")
            props.onOk();
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => {
            getUser(props.id);
            getBatchingStrategy();
            // 获取编辑配料方案信息
            purchaseListRun(props.id);
    }, [props.id && props.visible])

    const rowSelection = {
        selectedRowKeys: selectSort,
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            // 构建分类改变了，获取构建分类明细
            getSortDetail(props.id, selectedRows[0]?.structureSpec, selectedRows[0]?.structureTexture);
            setSelectSort(selectedRowKeys);
            setSelectedRowKeysCheck([]);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.notConfigured <= 0, // Column configuration not to be checked
            name: record.name,
        }),
    };
    const rowSelectionCheck = {
        selectedRowKeys: selectedRowKeysCheck,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            setSelectedRowKeysCheck(selectedRowKeys)
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.notConfigured <= 0, // Column configuration not to be checked
            name: record.name,
        }),
    };
    // 点击备选方案的选中
    const handleChecked = (record: any) => {
        setSchemeData([
            record,
            ...schemeData
        ]);
        setNumbers(numbers += 1);
        const nums = (record.num1 || 0) + (record.num2 || 0) + (record.num3 || 0) + (record.num4 || 0);
        // 构建分类
        const result = constructionClassification;
        const index = constructionClassification.findIndex((item: any) => item.structureSpec === record.structureSpec && item.structureTexture === record.structureTexture);
        result[index].notConfigured = result[index].notConfigured - nums;
        setConstructionClassification(result.slice(0));
        // 设置构建分类的数量
        const numsConstrue = (construNumber - nums <= 0 ? 0 : (construNumber - nums))
        setConstruNumber(numsConstrue);
        // 清空备选方案
        setPreparation([]);
    }

    useEffect(() => {
        map.clear();
        let numberDetail = 0; // 构建分类明细的数量
        // 循环配料方案 生成map
        for (let i = 0; i < schemeData.length; i += 1) {
            if (schemeData[i].component1) {
                if (map.has(schemeData[i].component1)) {
                    const result = map.get(schemeData[i].component1);
                    map.set(schemeData[i].component1, result + schemeData[i].num1);
                } else {
                    map.set(schemeData[i].component1, schemeData[i].num1);
                }
            }
            if (schemeData[i].component2) {
                if (map.has(schemeData[i].component2)) {
                    const result = map.get(schemeData[i].component2);
                    map.set(schemeData[i].component2, result + schemeData[i].num2);
                } else {
                    map.set(schemeData[i].component2, schemeData[i].num2);
                }
            }
            if (schemeData[i].component3) {
                if (map.has(schemeData[i].component3)) {
                    const result = map.get(schemeData[i].component3);
                    map.set(schemeData[i].component3, result + schemeData[i].num3);
                } else {
                    map.set(schemeData[i].component3, schemeData[i].num3);
                }
            }
            if (schemeData[i].component4) {
                if (map.has(schemeData[i].component4)) {
                    const result = map.get(schemeData[i].component4);
                    map.set(schemeData[i].component4, result + schemeData[i].num4);
                } else {
                    map.set(schemeData[i].component4, schemeData[i].num4);
                }
            }
        }
        // 循环构建分类明细
        let result:any = constructionClassificationDetail;
        for (let i = 0; i < result.length; i += 1) {
            if (map.has(result[i].code)) {
                // map对应存在，则需要减少
                let num:number = map.get(result[i]?.code) || 0;
                result[i].notConfigured = result[i].num - num;
                numberDetail += num;
            } else {
                result[i].notConfigured = result[i].num;
            }
        }
        setConstructionClassificationDetail(result.slice(0));
        setConstruNumberDetail(numberDetail)
    }, [numbers])

    // 移除
    const handleDelete = (record: any, idx: number) => {
        const nums = (record.num1 || 0) + (record.num2 || 0) + (record.num3 || 0) + (record.num4 || 0);
        // 构建分类
        const result = constructionClassification;
        const index = constructionClassification.findIndex((item: any) => item.structureSpec === record.structureSpec && item.structureTexture === record.structureTexture);
        result[index].notConfigured = result[index].notConfigured + nums;
        setConstructionClassification(result.slice(0));
        // 移除配料方案的数据
        const preList = schemeData;
        preList.splice(idx, 1);
        setSchemeData(schemeData.slice(0));
        setNumbers(numbers += 1);
        // 构建分类
        const numsConstrue = (construNumber + nums <= 0 ? 0 : (construNumber + nums))
        setConstruNumber(numsConstrue);
    }

    return (
        <Modal
            title={'配料'}
            visible={props.visible}
            maskClosable={false}
            width={1200}
            className='ingredientsModal'
            destroyOnClose={true}
            onCancel={() => {
                // 清空备选方案以及配料方案
                setPreparation([]);
                // 清空表单
                serarchForm.resetFields();
                props.onCancel();
            }}
            footer={[
                <Button type="primary" onClick={() => {
                    message.warning("该功能暂未开发！")
                }}>
                    自动配料
                </Button>,
                <Button key="submit" type="primary" onClick={() => handleOkuseState()}>
                    手动配料
                </Button>,
                <Button type="primary" onClick={purchaseSave}>
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
                            label="开数"
                            initialValue={policyDetailed && policyDetailed[0]}
                        >
                                <Select style={{ width: 120 }} placeholder="请选择">
                                    {policyDetailed && policyDetailed.map((item: any, index: number) => {
                                        return <Select.Option value={item} key={index}>{item}</Select.Option>
                                    })}
                                </Select>
                        </Form.Item>&nbsp;
                        <Form.Item
                            name="num3"
                            initialValue={batchingLength && batchingLength[0]}
                            label="米数"
                        >
                                <Select style={{ width: 80 }} placeholder="请选择">
                                    {batchingLength && batchingLength.map((item: any, index: number) => {
                                        return <Select.Option value={item} key={index}>{item}</Select.Option>
                                    })}
                                </Select>
                        </Form.Item>
                        <Form.Item
                            initialValue={batchingLength && batchingLength[batchingLength.length - 1]}
                            name="num4">
                                <Select style={{ width: 80 }} placeholder="请选择">
                                    {batchingLength && batchingLength.map((item: any, index: number) => {
                                        return <Select.Option value={item} key={index}>{item}</Select.Option>
                                    })}
                                </Select>
                        </Form.Item>&nbsp;
                        <Form.Item
                            name="num5"
                            initialValue={utilizationRate && utilizationRate[0]}
                            label="利用率"
                        >
                                <Select style={{ width: 80 }} placeholder="请选择">
                                    {utilizationRate && utilizationRate.map((item: any, index: number) => {
                                        return <Select.Option value={item} key={index}>{item}</Select.Option>
                                    })}
                                </Select>
                        </Form.Item>
                    </Form>
                   <div style={{display: "flex", flexWrap: "nowrap",paddingLeft: "14px", boxSizing: "border-box", lineHeight: "14px", marginBottom: 20, marginTop: 20}}>
                      <span style={{fontSize: "16px", marginRight: "4px"}}>构件分类</span>
                      <span style={{color: "#FF8C00"}}>未分配/全部：{construNumber}/{(userData as any) && (userData as any).totalNum}</span>
                   </div>
                   <Table
                        size="small"
                        rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                        }}
                        columns={ConstructionClassification}
                        dataSource={constructionClassification}
                        pagination={false}
                        scroll={{ y: 400 }}
                     />
                     <div style={{display: "flex", flexWrap: "nowrap",paddingLeft: "14px", boxSizing: "border-box", lineHeight: "14px", marginBottom: 20, marginTop: 20}}>
                      <span style={{fontSize: "16px", marginRight: "4px"}}>构件分类明细</span>
                      <span style={{color: "#FF8C00"}}>已配： {construNumberDetail} 全部： {(sortDetailList as any) && (sortDetailList as any).totalNum}</span>
                   </div>
                   <Table
                        size="small"
                        rowSelection={{
                        type: "checkbox",
                        ...rowSelectionCheck,
                        }}
                        columns={ConstructionClassificationDetail}
                        dataSource={constructionClassificationDetail}
                        pagination={false}
                        scroll={{ y: 400 }}
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
                                render: (_: any, record: any, index: number) => {
                                    return (
                                        <>
                                            <Button type="link" onClick={() => handleDelete(record, index)}>移除</Button>
                                        </>
                                    )
                                }
                            }
                        ]} dataSource={schemeData} pagination={false} scroll={{ y: 400 }}
                    />
                    <DetailTitle title="备选方案" />
                    <CommonTable
                        columns={[
                            ...alternative.map((item: any) => {
                                if (
                                    item.dataIndex === 'component1'
                                    || item.dataIndex === "num1"
                                    || item.dataIndex === "len1"
                                    || item.dataIndex === 'component2'
                                    || item.dataIndex === "num2"
                                    || item.dataIndex === "len2"
                                    || item.dataIndex === 'component3'
                                    || item.dataIndex === "num3"
                                    || item.dataIndex === "len3"
                                    || item.dataIndex === 'component4'
                                    || item.dataIndex === "num4"
                                    || item.dataIndex === "len4"
                                ) {
                                    return ({
                                        title: item.title,
                                        dataIndex: item.dataIndex,
                                        width: 50,
                                        render: (_: any, record: any): React.ReactNode => (
                                            <div style={{
                                                color: record.isHighlight.includes(item.dataIndex) ? "#fff" : "black",
                                                backgroundColor: record.isHighlight.includes(item.dataIndex) ? "green" : "",
                                                height: "32px",
                                                lineHeight: "32px"
                                            }}>{record[item.dataIndex]}</div>
                                        )
                                    })
                                }
                                if (item.dataIndex === 'utilizationRate') {
                                    return ({
                                        title: item.title,
                                        dataIndex: item.dataIndex,
                                        width: 50,
                                        render: (_: any, record: any): React.ReactNode => (
                                            <span>{record.utilizationRate}%</span>
                                        )
                                    })
                                }
                                return item;
                            }),
                            {
                                title: "操作",
                                dataIndex: "opration",
                                fixed: "right",
                                width: 100,
                                render: (_: any, record: any) => {
                                    return (
                                        <>
                                            <Button type="link" onClick={() => handleChecked(record)}>选中</Button>
                                        </>
                                    )
                                }
                            }
                        ]} dataSource={preparation} pagination={false} scroll={{ y: 400 }} className="prepartion"
                    />
                </Col>
            </Row>
        </Modal>
    )
}
