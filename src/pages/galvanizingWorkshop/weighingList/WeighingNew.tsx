/**
 * @author zyc
 * @copyright © 2021 
*/

import React, { useState } from 'react';
import { Spin, Button, Space, Form, Input, Descriptions, DatePicker, Select, message, InputNumber, Row, Col } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './WeighingList.module.less';
import TeamSelectionModal from '../../../components/TeamSelectionModal';
import { CloseOutlined } from '@ant-design/icons';
import TowerSelectionModal from './TowerSelectionModal';
import { FixedType } from 'rc-table/lib/interface';
import { weighingtypeOptions } from '../../../configuration/DictionaryOptions';
import { IWeighingList } from '../IGalvanizingWorkshop';
import moment from 'moment';
import UserSelectedModal, { IUser } from '../../../components/UserSelectedModal';

export default function WeighingNew(): React.ReactNode {
    const history = useHistory();
    const [form] = Form.useForm();
    const [relationProducts, setRelationProducts] = useState<IWeighingList[]>([]);
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        let data: IWeighingList = {};
        if (params.id) {
            data = await RequestUtil.get<IWeighingList>(`/tower-production/weighing/detail/${params.id}`);
            setRelationProducts(data?.relationProducts || [])
            form.setFieldsValue({ ...data, weighingDate: data.weighingDate ? moment(data?.weighingDate) : '' })
        }
        resole(data)
    }), {})
    const detailData: any = data
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const tableColumns = [
        {
            key: 'internalNumber',
            title: '内部合同号',
            dataIndex: 'internalNumber',
        },
        {
            key: 'planNo',
            title: '计划号',
            dataIndex: 'planNo'
        },
        {
            key: 'orderName',
            title: '工程名称',
            dataIndex: 'orderName'
        },
        {
            key: 'productCategoryName',
            title: '关联塔型',
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productNum',
            title: '总基数',
            dataIndex: 'productNum'
        },
        {
            key: 'voltageGrade',
            title: '电压等级',
            dataIndex: 'voltageGrade'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Button type="link" onClick={() => delRow(index)}>删除</Button>
            )
        }
    ]

    const specialColums = [
        {
            dataIndex: "weighingNo",
            title: "过磅单号",
            children: <Input placeholder="过磅编号自动生成" disabled />,
            initialValue: detailData.weighingNo
        },
        {
            dataIndex: "weight",
            title: "重量（kg）",
            rules: [{
                required: true,
                message: '请输入重量'
            }],
            initialValue: detailData.weight,
            children: <InputNumber style={{ width: '100%' }} min={0} maxLength={20} />
        },
        {
            dataIndex: "derrickNo",
            title: "抱杆号",
            rules: [{
                required: true,
                message: '请输入抱杆号'
            }],
            initialValue: detailData.derrickNo,
            children: <Input maxLength={20} />
        },
        {
            dataIndex: "weighingTypeId",
            title: "过磅类型",
            rules: [{
                required: true,
                message: '请选择过磅类型'
            }],
            initialValue: detailData.weighingTypeId,
            children: <Select>
                {weighingtypeOptions?.map((item: any, index: number) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)}
            </Select>
        },
        {
            dataIndex: "weighingDate",
            title: "过磅日期",
            initialValue: detailData.weighingDate ? moment(detailData.weighingDate) : '',
            format: 'YYYY-MM-DD',
            children: <DatePicker style={{ width: '100%' }} />
        },
        {
            dataIndex: "weighManName",
            title: "司磅员",
            initialValue: detailData.weighManName,
            children: <Input
                maxLength={50}
                addonAfter={
                    <UserSelectedModal
                        onSelect={(selectedRows: IUser[] | any) => {
                            form.setFieldsValue({ weighManName: selectedRows[0].name, weighManId: selectedRows[0].id });
                        }}
                        buttonType="link"
                        buttonTitle="+选择人员"
                    />
                }
                disabled />
        },
        {
            dataIndex: "wearHangTeamName",
            title: "穿挂班组",
            initialValue: detailData.wearHangTeamName,
            children: <Input
                maxLength={50}
                addonBefore={
                    <TeamSelectionModal
                        onSelect={(selectedRows: object[] | any) => {
                            form.setFieldsValue({ wearHangTeamName: selectedRows[0].name, wearHangTeamId: selectedRows[0].id })
                        }}
                    />
                }
                addonAfter={
                    <Button
                        type="link"
                        style={{ padding: '0', lineHeight: 1, height: 'auto' }}
                        onClick={() => {
                            form.setFieldsValue({ wearHangTeamName: '', wearHangTeamId: '' })
                        }}><CloseOutlined />
                    </Button>
                }
                disabled
            />
        },
        {
            dataIndex: "picklingTeamName",
            title: "酸洗班组",
            initialValue: detailData.picklingTeamName,
            children: <Input
                maxLength={50}
                addonBefore={
                    <TeamSelectionModal
                        onSelect={(selectedRows: object[] | any) => {
                            form.setFieldsValue({ picklingTeamName: selectedRows[0].name, picklingTeamId: selectedRows[0].id })
                        }} />
                }
                addonAfter={
                    <Button
                        type="link"
                        style={{ padding: '0', lineHeight: 1, height: 'auto' }}
                        onClick={() => {
                            form.setFieldsValue({ picklingTeamName: '', picklingTeamId: '' })
                        }}><CloseOutlined />
                    </Button>
                }
                disabled
            />
        },
        {
            dataIndex: "maintenanceTeamName",
            title: "检修班组",
            initialValue: detailData.maintenanceTeamName,
            children: <Input
                maxLength={50}
                addonBefore={
                    <TeamSelectionModal
                        onSelect={(selectedRows: object[] | any) => {
                            form.setFieldsValue({ maintenanceTeamName: selectedRows[0].name, maintenanceTeamId: selectedRows[0].id })
                        }} />
                }
                addonAfter={
                    <Button
                        type="link"
                        style={{ padding: '0', lineHeight: 1, height: 'auto' }}
                        onClick={() => {
                            form.setFieldsValue({ maintenanceTeamName: '', maintenanceTeamId: '' })
                        }}><CloseOutlined /></Button>}
                disabled
            />
        },
        {
            dataIndex: "zincPotTeamName",
            title: "锌锅班组",
            initialValue: detailData.zincPotTeamName,
            children: <Input
                maxLength={50}
                addonBefore={
                    <TeamSelectionModal
                        onSelect={(selectedRows: object[] | any) => {
                            form.setFieldsValue({ zincPotTeamName: selectedRows[0].name, zincPotTeamId: selectedRows[0].id })
                        }} />
                }
                addonAfter={
                    <Button
                        type="link"
                        style={{ padding: '0', lineHeight: 1, height: 'auto' }}
                        onClick={() => {
                            form.setFieldsValue({ zincPotTeamName: '', zincPotTeamId: '' })
                        }}><CloseOutlined /></Button>
                }
                disabled
            />
        }
    ]

    const delRow = (index: number) => {
        relationProducts.splice(index, 1);
        setRelationProducts([...relationProducts]);
    }

    const save = () => {
        if (form) {
            if (relationProducts.length > 0) {
                form.validateFields().then(res => {
                    const values = form.getFieldsValue(true);
                    RequestUtil.post(`/tower-production/weighing`, {
                        ...values,
                        weighingDate: values?.weighingDate && values?.weighingDate.format('YYYY-MM-DD'),
                        relationProducts: relationProducts,
                        id: params.id
                    }).then(res => {
                        message.success("保存成功");
                        history.goBack();
                    });
                })
            } else {
                message.warning("请新增塔型信息");
            }

        }
    }

    return <DetailContent operation={[
        <Space direction="horizontal" size="small" >
            <Button type="primary" onClick={save}>保存</Button>
            <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
        </Space>
    ]}>
        <Form form={form}><Row gutter={24}>
            {
                specialColums.map((item: Record<string, any>, index: number) => {
                    return <Col span={6}>
                        <Form.Item key={item.dataIndex + '_' + index} name={item.dataIndex} label={item.title} rules={item.rules || []} initialValue={item.initialValue} style={{ width: "100%" }}>
                            {item.children}
                        </Form.Item>
                    </Col>


                })
            }</Row>
        </Form>
        <DetailTitle title="塔型信息" />
        <TowerSelectionModal selectKey={[...relationProducts].map((res: any) => { return res.dailyPlanId })} onSelect={(selectedRows: object[] | any) => {
            const list = [...relationProducts, ...selectedRows.map((res: any) => { return { ...res, dailyPlanId: res.id, id: '', weighingId: params.id } })]
            setRelationProducts(list)
        }} />
        <CommonTable columns={tableColumns} dataSource={[...relationProducts]} pagination={false} />
    </DetailContent>
}