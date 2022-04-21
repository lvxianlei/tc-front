/**
 * 迭代配料重写
 * author: mschange
 * time: 2022/4/21
 */
import { Button, Descriptions, Divider, Form, message, Modal, Radio, Select, Table, Tabs } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import { StockColumn, ConstructionDetailsColumn, BatchingScheme } from "./IngredientsList.json";

import InheritOneIngredient from "./BatchingRelatedPopFrame/InheritOneIngredient"; // 继承一次配料
import AllocatedScheme from "./BatchingRelatedPopFrame/AllocatedScheme"; // 已配方案
import SelectMeters from "./BatchingRelatedPopFrame/SelectMeters"; // 选择米数
import ComparisonOfSelectedSchemes from "./BatchingRelatedPopFrame/ComparisonOfSelectedSchemes"; // 已选方案对比
import SelectWarehouse from "./BatchingRelatedPopFrame/SelectWarehouse"; // 选择仓库

import "./ingredientsList.less"

interface Panes {
    title?: string
    key?: string
    closable?: boolean
    [key: string]: any
}

interface BtnList {
    key: string
    value: string
    type?: "link" | "text" | "ghost" | "primary" | "default" | "dashed" | undefined
}

const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

export default function IngredientsList(): React.ReactNode {
    const history = useHistory()
    const [ serarchForm ] = Form.useForm();
    // 传递的参数
    const params = useParams<{ id: string, status: string }>();
    console.log(params, "=========>>>>>")

    // 切换tab数据
    const [panes, setPanes] = useState<Panes[]>([
        { title: "方案1", key: "fangan1", closable: false },
        { title: "方案2", key: "fangan2" }
    ])

    // 按钮
    const btnList: BtnList[] = [
        { key: "inherit", value: "继承一次方案" },
        { key: "fast", value: "快速配料" },
        { key: "programme", value: "已配方案" },
        { key: "save", value: "保存" },
        { key: "generate", value: "生成配料" },
        { key: "goback", value: "返回", type: "default" }
    ]

    // tab选中的项
    const [activeKey, setActiveKey] = useState<string>("fangan1");
    // 库存单选
    const [value, setValue] = useState<string>("1");
    // 构建分类明细选择的集合
    const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any>([]);
    // 控制继承一次方案
    const [visible, setVisible] = useState<boolean>(false);
    // 控制已配方案
    const [visibleAllocatedScheme, setVisibleAllocatedScheme] = useState<boolean>(false);
    // 控制选择米数
    const [visibleSelectMeters, setVisibleSelectMeters] = useState<boolean>(false);
    // 控制已选方案对比
    const [visibleComparisonOfSelectedSchemes, setVisibleComparisonOfSelectedSchemes] = useState<boolean>(false);
    // 控制选择仓库
    const [visibleSelectWarehouse, setVisibleSelectWarehouse] = useState<boolean>(false);
    // 操作按钮
    const handleBtnClick = (options: BtnList) => {
        switch (options.key) {
            case "goback":
                history.go(-1);
                break;
            case "inherit":
                setVisible(true);
                break;
            case "programme":
                setVisibleAllocatedScheme(true);
                break;
            case "fast":
                message.error("暂未不支持该功能");
                break;
            default:
                break;
        }
    }

    // 新增/删除
    const onEdit = (targetKey: any, action: any) => {
        console.log(targetKey, "====>>>", action);
        action === "remove" ?
            remove(targetKey)
            : add();
    }

    // 方案tab切换
    const onTabChange = (activeKey: string) => {
        console.log(activeKey, "====>>")
        setActiveKey(activeKey);
    }

    // 新增tab
    const add = () => {
        if (panes.length >= 5) {
            message.error("方案最多增加五套！")
            return false;
        }
        const newPanes = [...panes, { title: `方案${+(panes[panes.length - 1].key?.split("fangan")[1] as any) + 1}`, key: `fangan${+(panes[panes.length - 1].key?.split("fangan")[1] as any) + 1}` }];
        setPanes(newPanes);
        setActiveKey(`fangan${+(panes[panes.length - 1].key?.split("fangan")[1] as any) + 1}`);
    };

    // 移除
    const remove = (targetKey: string) => {
        // const { panes, activeKey } = this.state;
        let newActiveKey: any = activeKey;
        let lastIndex: any;
        panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = panes.filter(pane => pane.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        console.log(newPanes, "=====>>>新增")
        setPanes(newPanes);
        setActiveKey(newActiveKey);
        console.log(targetKey, "targetKey")
    };

    // 库存单选改变
    const onRaioChange = (e: any) => {
        setValue(e.target.value);
    }

    // 构建明细多选触发
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
    console.log(document.documentElement.clientWidth, "widht")
    return (
        <div className='ingredientsListWrapper'>
            <DetailContent operation={
                btnList.map((item: BtnList) => {
                    return <Button key={item.key} type={item.type ? item.type : "primary"} style={{marginRight: 16}} onClick={() => handleBtnClick(item)}>{ item.value }</Button>
                })
            }>
                <DetailTitle title="配料信息" key={"ingre"}/>
                <Descriptions bordered>
                    <Descriptions.Item label="批次号">33432432234</Descriptions.Item>
                    <Descriptions.Item label="塔型">TX-A025</Descriptions.Item>
                    <Descriptions.Item label="标准">国标</Descriptions.Item>
                </Descriptions>
                <div className='content_wrapper'>
                    <div className='contentWrapperLeft'>
                        {/* 构建list */}
                        <div className='contentWrapperLeftlist'>
                            <div className='color'></div>
                            <div className='structure_wrapper'>
                                <p>Q235B</p>
                                <p>∠50×5</p>
                            </div>
                        </div>
                    </div>
                    <div className='content_wrapper_ringht'>
                        <div style={{width: "100%"}}>
                            <Tabs
                                type="editable-card"
                                addIcon={<>新增方案</>}
                                onChange={onTabChange}
                                activeKey={activeKey}
                                onEdit={(targetKey, action) => onEdit(targetKey, action)}
                            >
                                {
                                    panes?.map((item: Panes) => {
                                        return <TabPane tab={item.title} key={item.key} closable={item.closable}>
                                            <div className='ingredients_content_wrapper'>
                                                <div className='ingredients_content_wrapper_left'>
                                                    <DetailTitle title="配料策略" key={"strategy"}  operation={[
                                                        <Button></Button>
                                                    ]}/>
                                                    <Form {...formItemLayout} form={serarchForm} style={{border: "1px solid #eee", padding: "12px 16px", boxSizing: "border-box", marginBottom: 18}}>
                                                        <Form.Item
                                                            name="num1"
                                                            label="开数"
                                                        >
                                                                <Select placeholder="请选择">
                                                                    <Select.Option value="red">Red</Select.Option>
                                                                    <Select.Option value="green">Green</Select.Option>
                                                                </Select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            name="num3"
                                                            label="刀口"
                                                        >
                                                                <Select placeholder="请选择">
                                                                    <Select.Option value="red">Red</Select.Option>
                                                                    <Select.Option value="green">Green</Select.Option>
                                                                </Select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="端口"
                                                            name="num4">
                                                                <Select placeholder="请选择">
                                                                    <Select.Option value="red">Red</Select.Option>
                                                                    <Select.Option value="green">Green</Select.Option>
                                                                </Select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="余量"
                                                            name="num4">
                                                                <Select placeholder="请选择">
                                                                    <Select.Option value="red">Red</Select.Option>
                                                                    <Select.Option value="green">Green</Select.Option>
                                                                </Select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            name="num5"
                                                            label="利用率"
                                                        >
                                                                <Select placeholder="请选择">
                                                                    <Select.Option value="red">Red</Select.Option>
                                                                    <Select.Option value="green">Green</Select.Option>
                                                                </Select>
                                                        </Form.Item>
                                                    </Form>
                                                    <DetailTitle title="库存" key={"stock"} operation={[
                                                        <Button disabled={value === "1"} type="primary" ghost key="add" style={{ marginRight: 8 }} onClick={() => setVisibleSelectWarehouse(true)}>选择仓库</Button>,
                                                        <Button type="primary" ghost key="choose" onClick={() => setVisibleSelectMeters(true)}>选择米数</Button>
                                                    ]} />
                                                    <Radio.Group onChange={onRaioChange} value={value} style={{marginBottom: 8}}>
                                                        <Radio value={"1"}>理想库存</Radio>
                                                        <Radio value={"2"}>可用库存</Radio>
                                                    </Radio.Group>
                                                    <Table
                                                        size="small"
                                                        columns={StockColumn}
                                                        dataSource={[]}
                                                        pagination={false}
                                                        scroll={{ y: 600 }}
                                                    />
                                                </div>
                                                <div className='ingredients_content_wrapper_right'>
                                                    <div className='ingredients_content_wrapper_right_detail'>
                                                        <DetailTitle key={"detail"} title="构建明细" operation={[
                                                            <Button type="primary" ghost key="add" style={{ marginRight: 8 }}>自动配料</Button>,
                                                            <Button type="primary" ghost key="choose">手动配料</Button>
                                                        ]} />
                                                        <Table
                                                            size="small"
                                                            rowSelection={{
                                                                type: "radio",
                                                                ...rowSelectionCheck,
                                                            }}
                                                            columns={ConstructionDetailsColumn}
                                                            dataSource={[]}
                                                            pagination={false}
                                                            scroll={{ y: 590 }}
                                                        />
                                                    </div>
                                                    <div className='ingredients_content_wrapper_right_programme'>
                                                        <div className='title_wrapper marginTop'>
                                                            <div>已选方案
                                                                <span className='textLabel'>已选米数：</span><span className='textValue'>900、1000</span>
                                                                <span className='textLabel'>总数量：</span><span className='textValue'>12</span>
                                                                <span className='textLabel'>拆号数：</span><span className='textValue'>9</span>
                                                                <span className='textLabel'>余料总长：</span><span className='textValue'>567mm</span>
                                                                <span className='textLabel'>总利用率：</span><span className='textValue'>90%</span>
                                                            </div>
                                                        </div>
                                                        <div style={{width: 800}}>
                                                            <Table
                                                                size="small"
                                                                columns={[
                                                                    ...BatchingScheme,
                                                                    {
                                                                        title: "操作",
                                                                        dataIndex: "opration",
                                                                        fixed: "right",
                                                                        width: 80,
                                                                        render: (_: any, record: any, index: number) => {
                                                                            return (
                                                                                <>
                                                                                    <Button type="link">移除</Button>
                                                                                </>
                                                                            )
                                                                        }
                                                                    }
                                                                ]}
                                                                dataSource={[]}
                                                                pagination={false}
                                                                scroll={{ x: 1200, y: 590 }}
                                                            />
                                                        </div>
                                                        <div className='title_wrapper'>
                                                            <div>备选方案</div>
                                                            <div>
                                                                <span>排序</span>
                                                                <Select placeholder="请选择" style={{width: 150}}>
                                                                    <Select.Option value="">全部</Select.Option>
                                                                    <Select.Option value="jack">完全下料优先</Select.Option>
                                                                    <Select.Option value="lucy">利用率<ArrowDownOutlined /></Select.Option>
                                                                    <Select.Option value="Yiminghe">利用率<ArrowUpOutlined /></Select.Option>
                                                                    <Select.Option value="jack1">余料长度<ArrowDownOutlined /></Select.Option>
                                                                    <Select.Option value="jack2">余料长度<ArrowUpOutlined /></Select.Option>
                                                                    <Select.Option value="jack3">零件1<ArrowDownOutlined /></Select.Option>
                                                                    <Select.Option value="jack3">零件1<ArrowUpOutlined /></Select.Option>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div style={{width: 800}}>
                                                            <Table
                                                                size="small"
                                                                columns={[
                                                                    ...BatchingScheme,
                                                                    {
                                                                        title: "操作",
                                                                        dataIndex: "opration",
                                                                        fixed: "right",
                                                                        width: 80,
                                                                        render: (_: any, record: any, index: number) => {
                                                                            return (
                                                                                <>
                                                                                    <Button type="link">选中</Button>
                                                                                </>
                                                                            )
                                                                        }
                                                                    }
                                                                ]}
                                                                dataSource={[]}
                                                                pagination={false}
                                                                scroll={{ x: 1200 }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPane>
                                    })
                                }
                            </Tabs>
                        </div>
                        <div className='operation_button'>
                            <Button ghost type="primary" onClick={() => setVisibleComparisonOfSelectedSchemes(true)}>方案对比</Button>
                        </div>
                    </div>
                </div>
            </DetailContent>
            {/* 继承一次方案 */}
            <InheritOneIngredient visible={visible} hanleInheritSure={(res) => {
                console.log(res);
                setVisible(false);
            }}/>
            {/* 已配方案 */}
            <AllocatedScheme visible={visibleAllocatedScheme} hanleInheritSure={(res) => {
                setVisibleAllocatedScheme(false);
            }} />
            {/* 选择米数 */}
            <SelectMeters visible={visibleSelectMeters} hanleInheritSure={(res) => {
                setVisibleSelectMeters(false);
            }} />
            {/* 已选方案对比 */}
            <ComparisonOfSelectedSchemes visible={visibleComparisonOfSelectedSchemes} hanleInheritSure={(res) => {
                setVisibleComparisonOfSelectedSchemes(false);
            }} />
            {/* 选择仓库 */}
            <SelectWarehouse visible={visibleSelectWarehouse} hanleInheritSure={(res) => {
                setVisibleSelectWarehouse(false);
            }} />
        </div>
    )
}