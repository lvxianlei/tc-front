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



export default function TaskView(props: any) {
    const [visible, setVisible] = useState<boolean>(false);
    const [printVisible, setPrintVisible] = useState<boolean>(false);
    const [specialData, setSpecialData] = useState<any | undefined>({});
    const history = useHistory();
    const [form] = Form.useForm();
    const [radioValue, setRadioValue] = useState<string>('Apple');
    const [formRef] = Form.useForm();
    const [department, setDepartment] = useState<any | undefined>([]);
    const [materialUser, setMaterialUser] = useState<any | undefined>([]);
    const [steelVisible, setSteelVisible] = useState<boolean>(false);
    const [steelData, setSteelData] = useState<any | undefined>([]);
    const steelColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 150,
            dataIndex: 'segmentName'
        },
        {
            key: 'repeatNum',
            title: '段重复数',
            width: 150,
            dataIndex: 'repeatNum'
        },
        {
            key: 'code',
            title: '构件编号',
            dataIndex: 'code',
            width: 120
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 200,
            dataIndex: 'materialName'
        },
        {
            key: 'structureTexture',
            title: '材质',
            width: 150,
            dataIndex: 'structureTexture',
        },
        {
            key: 'structureSpec',
            title: '规格',
            dataIndex: 'structureSpec',
            width: 200,
        },
        {
            key: 'width',
            title: '宽度（mm）',
            width: 200,
            dataIndex: 'width'
        },
        {
            key: 'thickness',
            title: '厚度（mm）',
            width: 200,
            dataIndex: 'thickness'
        },
        {
            key: 'length',
            title: '长度（mm）',
            width: 200,
            dataIndex: 'length'
        },
        {
            key: 'basicsPartNum',
            title: '单段件数',
            width: 200,
            dataIndex: 'basicsPartNum'
        },
        {
            key: 'basicsWeight',
            title: '单件重量（kg）',
            width: 200,
            dataIndex: 'basicsWeight'
        },
        {
            key: 'totalWeight',
            title: '小计重量（kg）',
            width: 200,
            dataIndex: 'totalWeight'
        }, {
            key: 'totalWeight',
            title: '总计重量（kg）',
            width: 200,
            dataIndex: 'totalWeight'
        },
        {
            key: 'holesNum',
            title: '单件孔数',
            width: 200,
            dataIndex: 'holesNum'
        },
        {
            key: 'ncName',
            title: 'NC程序名称',
            width: 200,
            dataIndex: 'ncName'
        },
        {
            key: 'specialCode',
            title: '特殊件号',
            width: 200,
            dataIndex: 'specialCode'
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'electricWelding',
            title: '电焊',
            width: 200,
            dataIndex: 'electricWelding'
        },
        {
            key: 'bend',
            title: '火曲',
            width: 200,
            dataIndex: 'bend'
        },
        {
            key: 'chamfer',
            title: '切角',
            width: 200,
            dataIndex: 'chamfer'
        },
        {
            key: 'shovelBack',
            title: '铲背',
            width: 200,
            dataIndex: 'shovelBack'
        },
        {
            key: 'rootClear',
            title: '清根',
            width: 200,
            dataIndex: 'rootClear'
        },
        {
            key: 'squash',
            title: '打扁',
            width: 200,
            dataIndex: 'squash'
        },
        {
            key: 'openCloseAngle',
            title: '开合角',
            width: 200,
            dataIndex: 'openCloseAngle'
        },
        {
            key: 'perforate',
            title: '钻孔',
            width: 200,
            dataIndex: 'perforate'
        },
        {
            key: 'groove',
            title: '坡口',
            width: 200,
            dataIndex: 'groove'
        },
        {
            key: 'intersectingLine',
            title: '割相贯线',
            width: 200,
            dataIndex: 'intersectingLine'
        },
        {
            key: 'slottedForm',
            title: '开槽形式',
            width: 200,
            dataIndex: 'slottedForm'
        },
        {
            key: 'sides',
            title: '边数',
            width: 200,
            dataIndex: 'sides',
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_ === -1 ? undefined : _}</span>
            )
        },
        {
            key: 'perimeter',
            title: '周长',
            width: 200,
            dataIndex: 'perimeter',
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_ === -1 ? undefined : _}</span>
            )
        },
        {
            key: 'surfaceArea',
            title: '表面积',
            width: 200,
            dataIndex: 'surfaceArea',
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_ === -1 ? undefined : _}</span>
            )
        },
        {
            key: 'apertureNumber',
            title: '各孔径孔数',
            width: 200,
            dataIndex: 'apertureNumber'
        },
        {
            key: 'weldingEdge',
            title: '焊接边（mm）',
            width: 200,
            dataIndex: 'weldingEdge',
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_ === -1 ? undefined : _}</span>
            )
        }
    ]
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
                    case 1:
                        return '待完成';
                    case 2:
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
            await RequestUtil.post('/tower-science/productCategory/assign', saveData).then(() => {
                setVisible(false);
                form.setFieldsValue({});
            }).then(() => {
            })

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => { setVisible(false); form.setFieldsValue({}) };
    const handlePrintModalCancel = () => { setPrintVisible(false); formRef.setFieldsValue({}) };
    const onDepartmentChange = async (value: Record<string, any>, title?: string) => {
        const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
        switch (title) {
            case "materialLeaderDepartment":
                form.setFieldsValue({ materialLeader: '' });
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
            } else {
                role.children = []
            }
        });
        return roles;
    }
    const renderTreeNodes = (data: any) =>
        data.map((item: any) => {
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
                <DetailTitle title='基本信息' />
                <Descriptions
                    title=""
                    bordered
                    size="small"
                    colon={false}
                    column={2}
                >
                    <Descriptions.Item label="计划号">
                        {specialData?.planNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="塔型">
                        {specialData?.productCategoryName}
                    </Descriptions.Item>
                    <Descriptions.Item label="产品类型">
                        {specialData?.productTypeName}
                    </Descriptions.Item>
                    <Descriptions.Item label="打印条件">
                        {specialData?.printSpecifications !== null && specialData?.printSpecialProcess !== null ? specialData?.printSpecifications + ',' + specialData?.printSpecialProcess : specialData?.printSpecialProcess !== null ? specialData?.printSpecialProcess : specialData?.printSpecifications !== null ? specialData?.printSpecifications : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label="放样员">
                        {specialData?.loftingUserName}
                    </Descriptions.Item>
                    <Descriptions.Item label="编程负责人">
                        {specialData?.programmingLeaderName}
                    </Descriptions.Item>
                    <Descriptions.Item label="数量">
                        {specialData?.structureNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="钢板明细">
                        <Button type='link' onClick={async () => {
                            const data: any = await RequestUtil.post(`/tower-science/loftingTemplate/plate/list`, {
                                productCategoryId: specialData?.productCategoryId,
                                printSpecifications: specialData?.printSpecifications,
                                printSpecialProcess: specialData?.printSpecialProcess,
                                productTypeName: specialData?.productTypeName
                            });
                            setSteelData(data)
                            setSteelVisible(true)
                        }}>查看</Button>
                    </Descriptions.Item>
                    <Descriptions.Item label="接收人">
                        {specialData?.drawLeaderDepartmentName + '-' + specialData?.drawLeaderName}
                    </Descriptions.Item>
                    <Descriptions.Item label="备注">
                        {specialData?.description}
                    </Descriptions.Item>
                </Descriptions>
                <Attachment dataSource={specialData?.fileVOList} />
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} pagination={false} dataSource={specialData?.statusRecordList} />
            </Modal>
            <Button type='link' onClick={async () => {
                setVisible(true)
                const departmentData: any = await RequestUtil.get(`/tower-system/department`);
                setDepartment(departmentData);
                const sampleData: any = await RequestUtil.get(`/tower-science/loftingTemplate/${props?.record?.id}`);
                setSpecialData(sampleData);
            }}>查看</Button>
            <Modal
                title='钢板明细'
                visible={steelVisible}
                onCancel={() => {
                    setSteelVisible(false)
                    setSteelData([])
                }}
                width={1500}
                footer={false}
            >
                <CommonTable columns={steelColumns} dataSource={steelData || []} />
            </Modal>
        </>
    )
}