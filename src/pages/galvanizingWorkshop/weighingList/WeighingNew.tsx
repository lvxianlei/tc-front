/**
 * @author zyc
 * @copyright © 2021 
*/

import React, { useState } from 'react';
import { Spin, Button, Space, Form, Input, Descriptions, DatePicker } from 'antd';
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

export default function WeighingNew(): React.ReactNode {
    const history = useHistory();
    const [ form ] = Form.useForm();
    const params = useParams<{ id: string }>();
    const [ user, setUser ] = useState([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        let data = {};
        if(params.id) {
            data = await RequestUtil.get(`/tower-science/boltRecord/detail`, { productCategory: params.id })
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
            key: 'createDeptName',
            title: '内部合同号',
            dataIndex: 'createDeptName', 
        },
        {  
            key: 'createUserName', 
            title: '计划号', 
            dataIndex: 'createUserName' 
        },
        { 
            key: 'createTime', 
            title: '工程名称', 
            dataIndex: 'createTime' 
        },
        {
            key: 'currentStatus', 
            title: '关联塔型', 
            dataIndex: 'currentStatus'
        },
        {
            key: 'currentStatus', 
            title: '总基数', 
            dataIndex: 'currentStatus'
        },
        {
            key: 'currentStatus', 
            title: '电压等级', 
            dataIndex: 'currentStatus'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Button type="link" onClick={ delRow }>删除</Button>
            )
        }
    ]

    const specialColums = [
        {
            dataIndex: "materialSandard",
            title: "过磅单号",
            children: <Input placeholder="过磅编号自动生成" disabled/>,
            initialValue: detailData.materialSandard
        },
        {
            dataIndex: "materialSandard",
            title: "重量（kg）",
            rules: [{
                required: true,
                message: '请输入重量'
            }],
            
            children: <Input />
        },
        {
            dataIndex: "materialSandard",
            title: "抱杆号",
            rules: [{
                required: true,
                message: '请输入抱杆号'
            }],
            children: <Input />
        },
        {
            dataIndex: "materialSandard",
            title: "过磅类型",
            rules: [{
                required: true,
                message: '请选择过磅类型'
            }],
            // children:  <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
            //     { warehouseOptions && warehouseOptions.map(({ id, name }, index) => {
            //         return <Select.Option key={index} value={id+','+name}>
            //             {name}
            //         </Select.Option>
            //     }) }
            // </Select>
        },
        {
            dataIndex: "materialSandard",
            title: "过磅日期",
            children: <DatePicker.RangePicker />
        },
        {
            dataIndex: "materialSandard",
            title: "司磅员",
            children: <Input maxLength={ 50 } addonAfter={ <WorkshopUserSelectionComponent onSelect={ (selectedRows: IUser[] | any) => {
                setUser(selectedRows);
                form.setFieldsValue({leaderName: selectedRows[0].name});
            } } buttonType="link" buttonTitle="+选择人员" /> } disabled/>
        },
        {
            dataIndex: "materialSandard",
            title: "穿挂班组",
            children: <Input maxLength={ 50 } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                // setSelectedRows(selectedRows);
                // setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
            } }/> }  addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={ () => {
                // setSelectedRows([]);
                // setDetail({ ...detail, accountEquipmentName: '', accountEquipmentId: '' });
                // form.setFieldsValue({ accountEquipmentName: '', accountEquipmentId: '' })
            } }><CloseOutlined /></Button>}  disabled/>
        },
        {
            dataIndex: "materialSandard",
            title: "酸洗班组",
            children: <Input maxLength={ 50 } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                // setSelectedRows(selectedRows);
                // setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
            } }/> }  addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={ () => {
                // setSelectedRows([]);
                // setDetail({ ...detail, accountEquipmentName: '', accountEquipmentId: '' });
                // form.setFieldsValue({ accountEquipmentName: '', accountEquipmentId: '' })
            } }><CloseOutlined /></Button>}  disabled/>
        },
        {
            dataIndex: "materialSandard",
            title: "检修班组",
            children: <Input maxLength={ 50 } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                // setSelectedRows(selectedRows);
                // setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
            } }/> }  addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={ () => {
                // setSelectedRows([]);
                // setDetail({ ...detail, accountEquipmentName: '', accountEquipmentId: '' });
                // form.setFieldsValue({ accountEquipmentName: '', accountEquipmentId: '' })
            } }><CloseOutlined /></Button>}  disabled/>
        },
        {
            dataIndex: "materialSandard",
            title: "锌锅班组",
            children: <Input maxLength={ 50 } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                // setSelectedRows(selectedRows);
                // setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
            } }/> }  addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={ () => {
                // setSelectedRows([]);
                // setDetail({ ...detail, accountEquipmentName: '', accountEquipmentId: '' });
                // form.setFieldsValue({ accountEquipmentName: '', accountEquipmentId: '' })
            } }><CloseOutlined /></Button>}  disabled/>
        },
    ]

    const delRow = () => {

    }

    return  <DetailContent operation={ [
        <Space direction="horizontal" size="small" >
            <Button type="primary" onClick={ () => history.goBack() }>保存</Button>
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
        <TowerSelectionModal  onSelect={ (selectedRows: object[] | any) => {
            // setSelectedRows(selectedRows);
            // setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
            form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
        } } />
        <CommonTable columns={ tableColumns } dataSource={ detailData.statusRecordList } pagination={ false } />
    </DetailContent>
}