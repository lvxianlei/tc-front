/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-补件申请-申请
 */

import React, { useRef, useState } from 'react';
import { Input, Button, Form, Descriptions, Select, TreeSelect, DatePicker, Row, Col, Modal, InputNumber, Space, message } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import { CommonTable, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { productTypeOptions, supplyTypeOptions } from '../../../configuration/DictionaryOptions';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import styles from './PatchApplication.module.less';
import { useForm } from 'antd/es/form/Form';
import { towerTypeColumns, patchColumns } from "./patchApplication.json"
import AddPatch from './AddPatch';
import { useHistory } from 'react-router-dom';
import { format } from 'path';

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function Apply(): React.ReactNode {
    const [applyUser, setApplyUser] = useState<any[]>();
    const [form] = useForm();
    const [tableForm] = useForm();
    const [towerList, setTowerList] = useState<any>([]);
    const [patchList, setPatchList] = useState<any>([]);
    const addRef = useRef<EditRefProps>();
    const [visible, setVisible] = useState<boolean>(false);
    const [rowData, setRowData] = useState<any>()
    const [towerSelects, setTowerSelects] = useState([]);
    const history = useHistory();
    const [numbers, setNumbers] = useState<any>([]);

    const { data: department } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/tower-system/department`);
        resole(departmentData)
    }), {})

    const { data: planNums } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const nums: any = await RequestUtil.get(`/tower-science/productCategory/planNumber/list`);
        resole(nums)
    }), {})

    const renderTreeNodes = (data: any) =>
        data.map((item: any) => {
            if (item.children) {
                return (
                    <TreeNode key={item.id} title={item.name} value={item.id} className={styles.node}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} key={item.id} title={item.name} value={item.id} />;
        });

    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            } else {
                role.children = []
            }
        });
        return roles;
    }

    const planNumChange = async (e: any) => {
        const data: any = await RequestUtil.get(`/tower-science/productCategory/list/${e}`);
        setTowerSelects(data || [])
        form.setFieldsValue({
            productCategoryIds: []
        })
    }

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            const data: any = await addRef.current?.onSubmit();
            const newPatchs = [...(patchList || []), ...data]
            setPatchList([...newPatchs])
            setVisible(false)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const getTowerList = (e: any[]) => {
        const newTowerSelects: any[] = [];
        towerSelects.forEach((res: any) => {
            if (e?.indexOf(res?.productCategoryId) !== -1) {
                newTowerSelects.push(res)
            }
        })
        const newPatchList: any[] = [];
        patchList.forEach((res: any) => {
            if (e?.indexOf(res?.productCategoryId) !== -1) {
                newPatchList.push(res)
            }
        })
        setTowerList([...newTowerSelects])
        setPatchList([...newPatchList])
    }

    const productNumbers = async (productCategoryId: string) => {
        const data: any = await RequestUtil.get(`/tower-science/product/lofting?productCategoryId=${productCategoryId}&size=10000`);
        setNumbers(data?.records)
    }

    const delRow = (index: number) => {
        patchList.split(index, 1)
        setPatchList([...patchList])
    }

    const save = () => {
        if (form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true);
                const tip: Boolean[] = [];
                patchList.forEach((element: any) => {
                    if (element.basicsPartNum > 0) {
                        tip.push(true)
                    } else {
                        tip.push(false)
                    }
                });
                if (tip.indexOf(false) === -1) {
                    RequestUtil.post(`/tower-science/supplyEntry`, {
                        ...value,
                        planDeliveryTime: value?.planDeliveryTime.format('YYYY-MM-DD HH:mm:ss'),
                        supplyStructureList: [...patchList]
                    }).then(res => {
                        history.goBack();
                    });
                } else {
                    message.warning('补件数量不可为0！')
                }
            })
        }
    }

    const submit = () => {
        if (form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true);
                const tip: Boolean[] = [];
                patchList.forEach((element: any) => {
                    if (element.basicsPartNum > 0) {
                        tip.push(true)
                    } else {
                        tip.push(false)
                    }
                });
                if (tip.indexOf(false) === -1) {
                    RequestUtil.post(`/tower-science/supplyEntry/submit`, {
                        ...value,
                        planDeliveryTime: value?.planDeliveryTime.format('YYYY-MM-DD HH:mm:ss'),
                        supplyStructureList: [...patchList]
                    }).then(res => {
                        history.goBack();
                    });
                } else {
                    message.warning('补件数量不可为0！')
                }
            })
        }
    }

    return (
        <>
            <Modal
                destroyOnClose
                key='addPatch'
                visible={visible}
                title={'添加补件'}
                onOk={handleOk}
                width="80%"
                onCancel={() => setVisible(false)}>
                <AddPatch record={rowData} ref={addRef} />
            </Modal>
            <DetailContent operation={[
                <Space direction="horizontal" size="small" className={styles.bottomBtn}>
                    <Button key="save" type="primary" onClick={save}>保存并关闭</Button>
                    <Button key="saveC" type="primary" onClick={submit}>保存并发起</Button>
                    <Button key="cancel" type="ghost" onClick={() => history.goBack()}>关闭</Button>
                </Space>
            ]}>
                <Form form={form}>
                    <Descriptions bordered column={5} size="small" className={styles.description}>
                        <Descriptions.Item label="补件类型">
                            <Form.Item name="supplyType" rules={[
                                {
                                    "required": true,
                                    "message": "请选择补件类型"
                                }
                            ]}>
                                <Select placeholder="请选择补件类型">
                                    {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                                        return <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="优先级">
                            <Form.Item name="priority" rules={[
                                {
                                    "required": true,
                                    "message": "请选择优先级"
                                }
                            ]}>
                                <Select placeholder="请选择优先级">
                                    <Select.Option value={1} key={1}>紧急</Select.Option>
                                    <Select.Option value={2} key={2}>高</Select.Option>
                                    <Select.Option value={3} key={3}>中</Select.Option>
                                    <Select.Option value={4} key={4}>低</Select.Option>
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="申请部门">
                            <Form.Item name="applyUserDept" rules={[
                                {
                                    "required": true,
                                    "message": "请选择申请部门"
                                }
                            ]}>
                                <TreeSelect style={{ width: "150px" }} placeholder="请选择" onChange={async (value: any) => {
                                    const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
                                    setApplyUser(userData.records);
                                    form.setFieldsValue({
                                        applyUser: ''
                                    })
                                }}>
                                    {renderTreeNodes(wrapRole2DataNode(department))}
                                </TreeSelect>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="申请人">
                            <Form.Item name="applyUser" rules={[
                                {
                                    "required": true,
                                    "message": "请选择申请人"
                                }
                            ]}>
                                <Select placeholder="请选择申请人" style={{ width: "150px" }}>
                                    {applyUser && applyUser?.map((item: any) => {
                                        return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="计划号">
                            <Form.Item name="planNumber" rules={[
                                {
                                    "required": true,
                                    "message": "请选择计划号"
                                }
                            ]}>
                                <Select
                                    placeholder="请选择计划号"
                                    style={{ width: "150px" }}
                                    filterOption={(input, option) =>
                                        (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                    onChange={(e) => planNumChange(e)}>
                                    {planNums && planNums?.map((item: any, index: number) => {
                                        return <Select.Option key={index} value={item}>{item}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="塔型">
                            <Form.Item name="productCategoryIds" rules={[
                                {
                                    "required": true,
                                    "message": "请选择塔型"
                                }
                            ]}>
                                <Select placeholder="请选择塔型" style={{ width: "150px" }} mode="multiple" onChange={(e: any[]) => getTowerList(e)}>
                                    {towerSelects && towerSelects?.map((item: any) => {
                                        return <Select.Option key={item.productCategoryId} value={item.productCategoryId}>{item.productCategoryName}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="计划发货日期">
                            <Form.Item name="planDeliveryTime" rules={[
                                {
                                    "required": true,
                                    "message": "请选择计划发货日期"
                                }
                            ]}>
                                <DatePicker />
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="说明">
                            <Form.Item name="description">
                                <Input.TextArea maxLength={400} />
                            </Form.Item>
                        </Descriptions.Item>
                    </Descriptions>
                    <Row gutter={12}>
                        <Col span={8}>
                            <CommonTable
                                haveIndex
                                columns={[
                                    ...towerTypeColumns,
                                    {
                                        key: 'operation',
                                        title: '操作',
                                        dataIndex: 'operation',
                                        fixed: 'right' as FixedType,
                                        width: 150,
                                        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                                            <Button type="link" onClick={() => {
                                                setVisible(true);
                                                setRowData(record);
                                            }}>添加补件</Button>
                                        )
                                    }
                                ]}
                                dataSource={[...towerList || []]}
                                pagination={false}
                            />
                        </Col>
                        <Col span={16}>
                            <Form form={tableForm}>
                                <CommonTable
                                    haveIndex
                                    columns={[
                                        ...patchColumns.map(res => {
                                            if (res.dataIndex === 'basicsPartNum') {
                                                return {
                                                    ...res,
                                                    render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                                                        <InputNumber min={0} max={9999} size="small" defaultValue={record.basicsPartNum} onChange={(e) => {
                                                            const newList = patchList.map((res: any, ind: number) => {
                                                                if (ind === index) {
                                                                    return {
                                                                        ...res,
                                                                        basicsPartNum: e,
                                                                        totalWeight: Number(e) * Number(res?.basicsWeight || 0)
                                                                    }
                                                                } else {
                                                                    return res
                                                                }
                                                            })
                                                            setPatchList([...newList])
                                                        }} />
                                                    )
                                                }
                                            }
                                            if (res.dataIndex === 'productNumber') {
                                                return {
                                                    ...res,
                                                    render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                                                        <Select placeholder="请选择杆塔号" size='small' key={index} style={{ width: "150px" }} defaultValue={record.productNumber} onChange={
                                                            (e) => {

                                                                const newList = (patchList || [])?.map((res: any, ind: number) => {
                                                                    if (ind === index) {
                                                                        return {
                                                                            ...res,
                                                                            productNumber: e
                                                                        }
                                                                    } else {
                                                                        return res
                                                                    }
                                                                })
                                                                setPatchList([...newList])
                                                            }
                                                        }
                                                            onDropdownVisibleChange={(open) => {
                                                                if (open) {
                                                                    productNumbers(record?.productCategoryId)
                                                                } else {
                                                                    setNumbers([])
                                                                }
                                                            }}>
                                                            {(numbers || [])?.map((item: any) => {
                                                                return <Select.Option key={item.id} value={item.id}>{item.productNumber}</Select.Option>
                                                            })}
                                                        </Select>
                                                    )
                                                }
                                            }
                                            return res
                                        }),
                                        {
                                            key: 'operation',
                                            title: '操作',
                                            dataIndex: 'operation',
                                            fixed: 'right' as FixedType,
                                            width: 50,
                                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                                <Button type="link" onClick={() => delRow(index)}>删除</Button>
                                            )
                                        }
                                    ]}
                                    dataSource={patchList}
                                    pagination={false}
                                />
                            </Form>

                        </Col>
                    </Row>
                </Form>
            </DetailContent>
        </>
    )
}