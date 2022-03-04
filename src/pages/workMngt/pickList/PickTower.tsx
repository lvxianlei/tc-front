import React, { useRef, useState } from 'react'
import { Space, DatePicker, Button, Form, Modal, Row, Col, Select, message, InputNumber, Input } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { DetailTitle, Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import styles from './pick.module.less';
import useRequest from '@ahooksjs/use-request';
import WithSection, { EditRefProps } from './WithSection';
import { registerCoordinateSystem } from 'echarts';
export interface IDetail {
    productCategory?: string;
    productCategoryName?: string;
    productId?: string;
    productNumber?: string;
    materialDrawProductSegmentList?: IMaterialDetail[];
    legWeightA?: string;
    legWeightB?: string;
    legWeightC?: string;
    legWeightD?: string;
}
export interface IMaterialDetail {
    count?: number;
    id?: string;
    segmentName?: string;
}
export default function PickTower(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const [segmentVisible, setSegmentVisible] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [matchLeader, setMatchLeader] = useState<any | undefined>([]);
    const [department, setDepartment] = useState<any | undefined>([]);
    const params = useParams<{ id: string, status: string }>()
    const history = useHistory();
    const [form] = Form.useForm();
    const [filterValue, setFilterValue] = useState({});
    const [productId, setProductId] = useState('');
    const [status, setStatus] = useState('');
    const [detail, setDetail] = useState<IDetail>({});
    const [withSectionVisible, setWithSectionVisible] = useState<boolean>(false);
    const editRef = useRef<EditRefProps>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const departmentData: any = await RequestUtil.get(`/sinzetech-user/department/tree`);
        // setDepartment(departmentData);
        resole(data)
    }), {})
    const handleModalOk = async () => {
        try {
            const data = await form.validateFields()
            const submitTableData = data.detailData.map((item: any, index: number) => {
                return {
                    segmentId: item.id,
                    ...item,
                    id: item.id === -1 ? '' : item.id,
                }
            });
            const submitData = {
                productCategoryId: params.id,
                productId: productId,
                productSegmentListDTOList: submitTableData.map((item: any) => {
                    return {
                        ...item,
                        count: item?.count !== null ? item?.count : 0
                    }
                }),
                legWeightA: data.legWeightA,
                legWeightB: data.legWeightB,
                legWeightC: data.legWeightC,
                legWeightD: data.legWeightD
            }
            RequestUtil.post(`/tower-science/product/material/segment/submit`, submitData).then(() => {
                message.success('提交成功！');
                setVisible(false);
                setProductId('');
                form.setFieldsValue({
                    legWeightA: '',
                    legWeightB: '',
                    legWeightC: '',
                    legWeightD: '',
                    detailData: []
                })
                form.resetFields()
            }).then(() => {
                setRefresh(!refresh);
            })
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalSave = async () => {
        try {
            const data = await form.validateFields();
            const saveTableData = data.detailData.map((item: any, index: number) => {
                return {
                    segmentId: item.id,
                    ...item,
                    id: item.id === -1 ? '' : item.id,
                }
            });
            const saveData = {
                productCategoryId: params.id,
                productId: productId,
                productSegmentListDTOList: saveTableData.map((item: any) => {
                    return {
                        ...item,
                        count: item?.count !== null ? item?.count : 0
                    }
                }),
                legWeightA: data.legWeightA,
                legWeightB: data.legWeightB,
                legWeightC: data.legWeightC,
                legWeightD: data.legWeightD
            }
            RequestUtil.post(`/tower-science/product/material/segment/save`, saveData).then(() => {
                message.success('保存成功！');
                setVisible(false);
                setProductId('');
                form.setFieldsValue({
                    legWeightA: '',
                    legWeightB: '',
                    legWeightC: '',
                    legWeightD: '',
                    detailData: []
                })
                form.resetFields();
            }).then(() => {
                setRefresh(!refresh);
            })
        } catch (error) {
            console.log(error)
        }
    }
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'productNumber',
            title: '杆塔号',
            width: 150,
            dataIndex: 'productNumber'
        },
        {
            key: 'productHeight',
            title: '呼高',
            width: 120,
            dataIndex: 'productHeight'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 150,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'segmentInformation',
            title: '配段信息',
            width: 200,
            dataIndex: 'segmentInformation'
        },
        {
            key: 'legWeightA',
            title: 'A',
            width: 150,
            dataIndex: 'legWeightA'
        },
        {
            key: 'legWeightB',
            title: 'B',
            width: 150,
            dataIndex: 'legWeightB'
        },
        {
            key: 'legWeightC',
            title: 'C',
            width: 150,
            dataIndex: 'legWeightC'
        },
        {
            key: 'legWeightD',
            title: 'D',
            width: 150,
            dataIndex: 'legWeightD'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 100,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type='link' onClick={async () => {
                        // setVisible(true);
                        setWithSectionVisible(true);
                        // let data: IDetail = await RequestUtil.get<IDetail>(`/tower-science/product/material/${record.id}`)
                        // const detailData: IMaterialDetail[] | undefined = data && data.materialDrawProductSegmentList && data.materialDrawProductSegmentList.map((item: IMaterialDetail) => {
                        //     return {
                        //         ...item,
                        //     }
                        // })
                        setProductId(record.id);
                        // setDetail({
                        //     ...data,
                        //     materialDrawProductSegmentList: detailData
                        // })
                        // form.setFieldsValue({
                        //     legWeightA: data?.legWeightA,
                        //     legWeightB: data?.legWeightB,
                        //     legWeightC: data?.legWeightC,
                        //     legWeightD: data?.legWeightD,
                        //     detailData: detailData
                        // });
                        setStatus(record.materialStatusName)
                    }} >配段</Button>
                    <Button type='link' onClick={() => { history.push(`/workMngt/pickList/pickTower/${params.id}/${params.status}/pickTowerDetail/${record.id}`) }} disabled={record.materialStatus !== 3}>杆塔提料明细</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => { setVisible(false); setProductId(''); form.resetFields() };
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 17 }
    };
    const onDepartmentChange = async (value: Record<string, any>) => {
        if (value) {
            const userData: any = await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
            setMatchLeader(userData.records);
        } else {

            setMatchLeader([]);
        }
    }
    const renderTreeNodes = (data: any) => data.map((item: any) => {
        if (item.children) {
            return (
                <TreeNode key={item.id} title={item.title} value={item.id} className={styles.node}>
                    {renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} key={item.id} title={item.title} value={item.id} />;
    });
    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }
    return (
        <>
            <Modal
                title="配段"
                destroyOnClose
                visible={withSectionVisible}
                width="60%"
                onOk={handleModalOk}
                okText="保存"
                onCancel={() => {
                    editRef.current?.resetFields();
                    setWithSectionVisible(false);
                }}>
                <WithSection id={productId} type={status === '已完成' ? 'detail' : 'new'} />
            </Modal>
            <Modal title='配段信息' width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
                {detail?.materialDrawProductSegmentList ?
                    <Form initialValues={{ detailData: detail.materialDrawProductSegmentList, legWeightA: detail?.legWeightA, legWeightB: detail?.legWeightB, legWeightC: detail?.legWeightC, legWeightD: detail?.legWeightD }} autoComplete="off" form={form}>
                        {/* <DetailTitle title={'塔腿配段信息'} operation={[status !== '已完成' && <Button type='primary' onClick={() => { setSegmentVisible(true) }}>快速配段</Button>,
                        <Modal
                            visible={segmentVisible}
                            title='配段信息'
                            onCancel={() => {
                                setSegmentVisible(false);
                            }}
                            onOk={async () => {
                                const segment = form.getFieldsValue()
                                const detailData = await RequestUtil.get(`/tower-science/product/quickMaterial/${productId}/${segment?.segmentList}`)
                                setSegmentVisible(false);
                                // message.success('配段成功！');
                                form.setFieldsValue({
                                    detailData: detailData,
                                    legWeightA: segment?.legWeightA,
                                    legWeightB: segment?.legWeightB,
                                    legWeightC: segment?.legWeightC,
                                    legWeightD: segment?.legWeightD
                                });
                            }}
                        >
                            <Row>
                                <Form.Item name="segmentList" label="配段"
                                    // rules={[{
                                    //     required: true,
                                    //     message:'请填写A'
                                    // }]}
                                    rules={[{
                                        pattern: /^[a-zA-Z0-9-,*()]*$/,
                                        message: '仅可输入英文字母/数字/特殊字符',
                                    }]}>
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                            </Row>
                        </Modal>]} /> */}
                        <Row>
                            <Col span={1} />
                            <Col span={5}>
                                <Form.Item name="legWeightA" label="A" rules={[{
                                    required: true,
                                    message: '请输入塔腿A'
                                }, {
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]}>
                                    <Input style={{ width: '100%' }} disabled={status === '已完成'} />
                                </Form.Item>
                            </Col>
                            <Col span={1} />
                            <Col span={5}>
                                <Form.Item name="legWeightB" label="B" rules={[{
                                    required: true,
                                    message: '请输入塔腿B'
                                }, {
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]}>
                                    <Input style={{ width: '100%' }} disabled={status === '已完成'} />
                                </Form.Item>
                            </Col>
                            <Col span={1} />
                            <Col span={5}>
                                <Form.Item name="legWeightC" label="C" rules={[{
                                    required: true,
                                    message: '请输入塔腿C'
                                }, {
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]}>
                                    <Input style={{ width: '100%' }} disabled={status === '已完成'} />
                                </Form.Item>
                            </Col>
                            <Col span={1} />
                            <Col span={5}>
                                <Form.Item name="legWeightD" label="D" rules={[{
                                    required: true,
                                    message: '请输入塔腿D'
                                }, {
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]}>
                                    <Input style={{ width: '100%' }} disabled={status === '已完成'} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <DetailTitle title={'塔身配段信息'} />
                        <Row>
                            <Col span={1} />
                            <Col span={11}>
                                <Form.Item name="productCategoryName" label="塔型">
                                    <span>{detail?.productCategoryName}</span>
                                </Form.Item>
                            </Col>
                            <Col span={1} />
                            <Col span={11}>
                                <Form.Item name="productNumber" label="杆塔号">
                                    <span>{detail?.productNumber}</span>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Form.List name="detailData">
                                {
                                    (fields, { add, remove }) => fields.map(
                                        field => (
                                            <>
                                                <Col span={1}></Col>
                                                <Col span={11}>
                                                    <Form.Item name={[field.name, 'segmentName']} label='段号'>
                                                        <span>{detail.materialDrawProductSegmentList && detail.materialDrawProductSegmentList[field.name].segmentName}</span>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1}></Col>
                                                <Col span={11}>
                                                    <Form.Item name={[field.name, 'count']} label='段数' initialValue={[field.name, 'count']} >
                                                        <InputNumber min={0} precision={0} style={{ width: '100%' }} disabled={status === '已完成'} />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        )
                                    )
                                }
                            </Form.List>
                        </Row>
                    </Form>
                    : null}
                {status !== '已完成' ? <Space style={{ position: 'relative', left: '75%' }}>
                    <Button onClick={() => handleModalCancel()}>取消</Button>
                    <Button type="primary" onClick={() => handleModalSave()}>保存</Button>
                    <Button type="primary" onClick={() => handleModalOk()}>保存并提交</Button>
                </Space> :
                    <Button type="primary" style={{ position: 'relative', left: '95%' }} ghost onClick={() => handleModalCancel()}>取消</Button>}
            </Modal>
            <Page
                path="/tower-science/materialProduct"
                columns={columns}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                refresh={refresh}
                requestData={{ productCategoryId: params.id }}
                exportPath="/tower-science/materialProduct"
                extraOperation={
                    <Space>
                        <Button type="ghost" onClick={() => history.push('/workMngt/pickList')}>返回</Button>
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'statusUpdateTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'materialStatus',
                        label: '杆塔提料状态',
                        children: <Select style={{ width: '100px' }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>待开始</Select.Option>
                            <Select.Option value={2} key={2}>待配段</Select.Option>
                            <Select.Option value={3} key={3}>已完成</Select.Option>
                        </Select>
                    },
                    // {
                    //     name: 'materialUserDepartment',
                    //     label: '配段人',
                    //     children:  <TreeSelect style={{width:'200px'}}
                    //                     allowClear
                    //                     onChange={ onDepartmentChange }
                    //                 >
                    //                     {renderTreeNodes(wrapRole2DataNode( department ))}
                    //                 </TreeSelect>
                    // },
                    // {
                    //     name: 'materialUser',
                    //     label:'',
                    //     children:   <Select style={{width:'100px'}} allowClear>
                    //                     { matchLeader && matchLeader.map((item:any)=>{
                    //                         return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    //                     }) }
                    //                 </Select>
                    // },
                ]}
            />
        </>
    )
}