/**
 * @author zyc
 * @copyright © 2021 
*/

import React, { useState } from 'react';
import { Spin, Button, Space, Form, Input, Descriptions, DatePicker, Select, message } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './WeighingList.module.less';
import WorkshopUserSelectionComponent, { IUser } from '../../../components/WorkshopUserModal';
import TeamSelectionModal from '../../../components/TeamSelectionModal';
import { CloseOutlined } from '@ant-design/icons';
import TowerSelectionModal from './TowerSelectionModal';
import { FixedType } from 'rc-table/lib/interface';
import { weighingtypeOptions } from '../../../configuration/DictionaryOptions';
import { IWeighingList } from '../IGalvanizingWorkshop';

export default function WeighingNew(): React.ReactNode {
    const history = useHistory();
    const [ form ] = Form.useForm();
    const [ relationProducts, setRelationProducts ] = useState<IWeighingList[]>([]);
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        let data: IWeighingList = {};
        if(params.id) {
            data = await RequestUtil.get<IWeighingList>(`/tower-production/weighing/detail/${ params.id }`);
            setRelationProducts(data?.relationProducts || [])
        }
        resole(data)
    }), {})
    const detailData: any = data
    if (loading) {
        return <Spin spinning={ loading }>
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
                <Button type="link" onClick={ () => delRow(index) }>删除</Button>
            )
        }
    ]

    const specialColums = [
        {
            dataIndex: "weighingNo",
            title: "过磅单号",
            children: <Input placeholder="过磅编号自动生成" disabled/>,
            initialValue: detailData.weighingNo
        },
        {
            dataIndex: "weight",
            title: "* 重量（kg）",
            rules: [{
                required: true,
                message: '请输入重量'
            }],
            initialValue: detailData.weight,
            children: <Input maxLength={50}/>
        },
        {
            dataIndex: "derrickNo",
            title: "* 抱杆号",
            rules: [{
                required: true,
                message: '请输入抱杆号'
            }],
            initialValue: detailData.derrickNo,
            children: <Input />
        },
        {
            dataIndex: "weighingTypeId",
            title: "* 过磅类型",
            rules: [{
                required: true,
                message: '请选择过磅类型'
            }],
            initialValue: detailData.weighingTypeId,
            children:  <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                { weighingtypeOptions && weighingtypeOptions.map(({ id, name }, index) => {
                    return <Select.Option key={index} value={id}>
                        {name}
                    </Select.Option>
                }) }
            </Select>
        },
        {
            dataIndex: "weighingDate",
            title: "过磅日期",
            initialValue: detailData.weighingDate,
            format: 'YYYY-MM-DD',
            children: <DatePicker style={{ width: '100%' }} />
        },
        {
            dataIndex: "weighManName",
            title: "司磅员",
            initialValue: detailData.weighManName,
            children: <Input maxLength={ 50 } addonAfter={ <WorkshopUserSelectionComponent onSelect={ (selectedRows: IUser[] | any) => {
                form.setFieldsValue({weighManName: selectedRows[0].name, weighManId: selectedRows[0].id});
            } } buttonType="link" buttonTitle="+选择人员" /> } disabled/>
        },
        {
            dataIndex: "wearHangTeamName",
            title: "穿挂班组",
            initialValue: detailData.wearHangTeamName,
            children: <Input maxLength={ 50 } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                form.setFieldsValue({ wearHangTeamName: selectedRows[0].name, wearHangTeamId: selectedRows[0].id})
            } }/> }  addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={ () => {
                form.setFieldsValue({ wearHangTeamName: '', wearHangTeamId: '' })
            } }><CloseOutlined /></Button>} disabled/>
        },
        {
            dataIndex: "picklingTeamName",
            title: "酸洗班组",
            initialValue: detailData.picklingTeamName,
            children: <Input maxLength={ 50 } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                form.setFieldsValue({ picklingTeamName: selectedRows[0].name, picklingTeamId: selectedRows[0].id })
            } }/> }  addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={ () => {
                form.setFieldsValue({ picklingTeamName: '', picklingTeamId: '' })
            } }><CloseOutlined /></Button>} disabled/>
        },
        {
            dataIndex: "maintenanceTeamName",
            title: "检修班组",
            initialValue: detailData.maintenanceTeamName,
            children: <Input maxLength={ 50 } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                form.setFieldsValue({ maintenanceTeamName: selectedRows[0].name, maintenanceTeamId: selectedRows[0].id })
            } }/> }  addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={ () => {
                form.setFieldsValue({ maintenanceTeamName: '', maintenanceTeamId: '' })
            } }><CloseOutlined /></Button>} disabled/>
        },
        {
            dataIndex: "zincPotTeamName",
            title: "锌锅班组",
            initialValue: detailData.zincPotTeamName,
            children: <Input maxLength={ 50 } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                form.setFieldsValue({ zincPotTeamName: selectedRows[0].name, zincPotTeamId: selectedRows[0].id })
            } }/> }  addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={ () => {
                form.setFieldsValue({ zincPotTeamName: '', zincPotTeamId: '' })
            } }><CloseOutlined /></Button>} disabled/>
        },
    ]

    const delRow = (index: number) => {
        relationProducts.splice(index, 1);
        setRelationProducts(relationProducts);
    }

    const save = () => {
        if(form) {
            form.validateFields().then(res => {
                const values = form.getFieldsValue(true);
                console.log(values)
                RequestUtil.post(`/tower-production/galvanized/daily/plan/dispatching`, { 
                    ...values,
                    relationProducts: relationProducts.map((res: any) => ( { ...res, weighingId: params.id} )),
                    id: params.id 
                }).then(res => {
                    message.success("保存成功");
                    history.goBack();
                });
            })
        }
    }

    return  <DetailContent operation={ [
        <Space direction="horizontal" size="small" >
            <Button type="primary" onClick={ save }>保存</Button>
            <Button type="ghost" onClick={ () => history.goBack() }>关闭</Button>
        </Space>
    ] }>
        <Form form={ form }>
            <Descriptions title="" bordered size="small" column={ 2 }>
                {
                    specialColums.map((item: Record<string, any>, index: number) => {
                        return <Descriptions.Item key={ index } label={ item.title } className={ styles.detailItem }>
                            <Form.Item key={ item.dataIndex + '_' + index } name={ item.dataIndex } label="" rules={ item.rules || [] } initialValue={ item.initialValue }>
                                { item.children }
                            </Form.Item>
                        </Descriptions.Item>
                    })
                }
            </Descriptions>    
        </Form>
        <DetailTitle title="塔型信息"/>
        <TowerSelectionModal onSelect={ (selectedRows: object[] | any) => {
            console.log(selectedRows)
            setRelationProducts(selectedRows)
        } } />
        <CommonTable columns={ tableColumns } dataSource={[...relationProducts]} pagination={ false } />
    </DetailContent>
}