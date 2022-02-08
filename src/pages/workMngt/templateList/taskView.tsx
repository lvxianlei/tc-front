import React, { useState } from 'react'
import { Space, Input, Button, Form, Modal, Row, Col, Select, DatePicker, TreeSelect, Table, InputNumber, Radio, Descriptions } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { Attachment, CommonTable, DetailTitle, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';
import { TreeNode } from 'antd/lib/tree-select';
import styles from './template.module.less';



export default function TaskView(props: any){
    const [visible, setVisible] = useState<boolean>(false);
    const [printVisible, setPrintVisible] = useState<boolean>(false);
    const [scheduleData, setScheduleData] = useState<any|undefined>({});
    const history = useHistory();
    const [form] = Form.useForm();
    const [radioValue, setRadioValue] = useState<string>('Apple');
    const [formRef] = Form.useForm();
    const [department, setDepartment] = useState<any|undefined>([]);
    const [materialUser, setMaterialUser] = useState<any|undefined>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/sinzetech-user/department/tree`);
        setDepartment(departmentData);
        resole(data)
    }), {})
    
    const tableColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            fixed: "left" as FixedType,
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'createDeptName',
            title: '操作部门',
            dataIndex: 'createDeptName',
        },
        {
            key: 'createUserName',
            title: '操作人',
            dataIndex: 'createUserName'
        },
        {
            key: 'createTime',
            title: '操作时间',
            dataIndex: 'createTime'
        },
        {
            key: 'currentStatus',
            title: '状态',
            dataIndex: 'currentStatus',
            render: (currentStatus: number): React.ReactNode => {
                switch (currentStatus) {
                    case 3:
                        return '待完成';
                    case 4:
                        return '已完成';
                }
            }
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }
    ]

    const handlePrintModalOk = async () => {
        try {
            const saveData = await formRef.validateFields();
            console.log(saveData)
            await RequestUtil.post('/tower-science/productCategory/assign', saveData).then(()=>{
                setVisible(false);
                form.setFieldsValue({});
            }).then(()=>{
            })
        
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => {setVisible(false); form.setFieldsValue({})};
    const handlePrintModalCancel = () => {setPrintVisible(false); formRef.setFieldsValue({})};
    const onDepartmentChange = async (value: Record<string, any>,title?: string) => {
        const userData: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
        switch (title) {
            case "materialLeaderDepartment":
                form.setFieldsValue({materialLeader:''});
                return setMaterialUser(userData.records);
        };
    }
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 18 }
    };
    const formItemPrintLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 }
    };
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
    const renderTreeNodes = (data:any) =>
    data.map((item:any) => {
    if (item.children) {
        return (
        <TreeNode key={item.id} title={item.title} value={item.id} className={styles.node}>
            {renderTreeNodes(item.children)}
        </TreeNode>
        );
    }
    return <TreeNode {...item} key={item.id} title={item.title} value={item.id} />;
    });
    // const plainOptions = ['全部', '自定义'];
    const plainOptions = [
        { label: '全部', value: 'Apple' },
        { label: '自定义', value: 'Pear' },
      ];
    return (
        <>
            <Modal 
                title={'查看'}  
                width={800} 
                visible={visible} 
                onCancel={handleModalCancel}
                footer={
                        <Button onClick={handleModalCancel}>关闭</Button>
                }
            >
                <DetailTitle title='基本信息'/>
                <Descriptions 
                    title="" 
                    bordered 
                    size="small" 
                    colon={ false } 
                    column={ 2 }
                >
                    <Descriptions.Item label="计划号">
                    </Descriptions.Item>
                    <Descriptions.Item label="塔型">
                       
                    </Descriptions.Item>
                    <Descriptions.Item label="产品类型">
                       
                    </Descriptions.Item>
                    <Descriptions.Item label="打印条件">
                       
                    </Descriptions.Item>
                    <Descriptions.Item label="数量">
                       
                    </Descriptions.Item>
                    <Descriptions.Item label="钢板明细">
                        <Button type='link' onClick={()=>history.push(`/workMngt/templateList/steel/${'id'}`)}>查看</Button>
                    </Descriptions.Item>
                    <Descriptions.Item label="接收人">
                       
                    </Descriptions.Item>
                    <Descriptions.Item label="备注">
                       
                    </Descriptions.Item>
                </Descriptions>
                <Attachment />
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns}  pagination={false} />
            </Modal>
            <Button type='link' onClick={()=>{
                setVisible(true)
            }}>查看</Button>
            
        </>
    )
}