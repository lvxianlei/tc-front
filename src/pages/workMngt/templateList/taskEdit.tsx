import React, { useRef, useState } from 'react'
import { Space, Input, Button, Form, Modal, Row, Col, Select, DatePicker, TreeSelect, Table, InputNumber, Radio, message, Checkbox } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { Attachment, AttachmentRef, CommonTable, DetailTitle, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import styles from './template.module.less';
import { SelectValue } from 'antd/lib/select';
import { FileProps } from '../../common/Attachment';
import SelectUser from '../../common/SelectUser';

export default function TaskNew(props: any) {
    const [visible, setVisible] = useState<boolean>(false);
    const [read, setRead] = useState<boolean>(false);
    const [printVisible, setPrintVisible] = useState<boolean>(false);
    const [sampleData, setSampleData] = useState<any | undefined>({});
    const history = useHistory();
    const attachRef = useRef<AttachmentRef>()
    const [form] = Form.useForm();
    const [radioValue, setRadioValue] = useState<string>('Apple');
    const [formRef] = Form.useForm();
    const [department, setDepartment] = useState<any | undefined>([]);
    const [planData, setPlanData] = useState<any | undefined>([]);
    const [specialData, setSpecialData] = useState<any | undefined>([]);
    const [tower, setTower] = useState<any | undefined>([]);
    const [printData, setPrintData] = useState<any | undefined>({});
    const [materialUser, setMaterialUser] = useState<any | undefined>([]);
    const [steelVisible, setSteelVisible] = useState<boolean>(false);
    const [steelData, setSteelData] = useState<any | undefined>([]);
    const [fileData, setFileData] = useState<any | undefined>([]);
    const unique = (arr: any, key: any) => {
        let result: any = {};
        for (let item of arr) {
            result[item[key]] = item;
        }
        console.log(result);
        return Object.values(result); // 再转化为数组
    }
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
    // const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {


    //     resole(data)
    // }), {})


    const handleModalOk = async () => {
        try {
            console.log(printData)
            const saveData = await form.validateFields();
            if (saveData?.structureNumber === 0 || saveData?.structureNumber === '0') {
                message.error('数量为0，不可保存并提交！')
                return
            }
            saveData.id = printData.id;
            saveData.drawLeaderDepartment = Array.isArray(saveData.drawLeaderDepartment) ? saveData.drawLeaderDepartment[0] : saveData.drawLeaderDepartment;
            saveData.productCategoryId = printData?.productCategoryId;
            saveData.type = 3;
            saveData.printSpecifications = printData?.printSpecifications;
            saveData.printSpecialProcess = printData?.printSpecialProcess;
            if (attachRef.current?.getDataSource() && attachRef.current?.getDataSource().length < 1) {
                message.error('未上传附件，不可保存并提交！')
                return
            } else {
                saveData.templateFiles = attachRef.current?.getDataSource().map((item: any) => {
                    return {
                        templateId: printData.id,
                        productCategoryId: printData?.productCategoryId,
                        name: item.originalName,
                        fileId: item.id,
                    }

                });
            }
            await RequestUtil.post('/tower-science/loftingTemplate', saveData).then(() => {
                setVisible(false);
                form.resetFields();
                formRef.resetFields();
                props?.freshF(!props?.fresh)
            }).then(() => {
            })

        } catch (error) {
            console.log(error)
        }
    }
    const handlePrintModalOk = async () => {
        try {
            const saveData = await formRef.validateFields();
            if (saveData?.print?.printSpecifications || saveData?.print?.printSpecialProcess) {
                if (saveData?.print?.printSpecifications === '全部') {
                    if (saveData?.printSpecialProcess && saveData?.printSpecialProcess?.length > 0) {
                        form.setFieldsValue({
                            print: '全部,' + saveData?.printSpecialProcess?.join(',')
                        })
                    } else {
                        form.setFieldsValue({
                            print: '全部'
                        })
                    }

                }
                else if (saveData?.print?.printSpecifications === '自定义') {
                    if (!saveData?.print?.before) {
                        message.error('未填写规格，不可保存并提交！')
                        return
                    }
                    if (!saveData?.print?.after) {
                        message.error('未填写规格，不可保存并提交！')
                        return
                    }
                    if (saveData?.printSpecialProcess && saveData?.printSpecialProcess?.length > 0) {
                        form.setFieldsValue({
                            print: saveData?.print?.before + '-' + saveData?.print?.after + ',' + saveData?.printSpecialProcess?.join(',')
                        })
                    }
                    else {
                        form.setFieldsValue({
                            print: saveData?.print?.before + '-' + saveData?.print?.after
                        })
                    }

                } else {
                    form.setFieldsValue({
                        print: saveData?.printSpecialProcess?.join(',')
                    })
                }
                setPrintData({
                    ...printData,
                    printSpecifications: saveData?.print?.printSpecifications === '全部' ? '全部' : saveData?.print?.printSpecifications === '自定义' ? saveData?.print?.before + '-' + saveData?.print?.after : '',
                    printSpecialProcess: saveData?.printSpecialProcess?.join(',')
                })
                const data: any = await RequestUtil.post(`/tower-science/loftingTemplate/plate/list`, {
                    productCategoryId: printData?.productCategoryId,
                    printSpecifications: saveData?.print?.printSpecifications === '全部' ? '全部' : saveData?.print?.printSpecifications === '自定义' ? saveData?.print?.before + '-' + saveData?.print?.after : '',
                    printSpecialProcess: saveData?.printSpecialProcess?.join(','),
                    productTypeName: printData?.productTypeName
                });
                form.setFieldsValue({
                    structureNumber: data?.length
                })
            }

            setPrintVisible(false);

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => { setRead(false); setVisible(false); form.resetFields(); formRef.resetFields() };
    const handlePrintModalCancel = () => {
        setPrintVisible(false);
        const type: any = form.getFieldValue('print');
        if (type && type.indexOf("全部") != -1) {
            console.log(type.length)
            setRadioValue('全部')
            if (type?.indexOf(',') != -1) {
                formRef.setFieldsValue({
                    print: {
                        printSpecifications: '全部'
                    },
                    printSpecialProcess: type?.substring(type?.indexOf(',') + 1, type?.length)?.split(',')
                })
            } else {
                formRef.setFieldsValue({
                    print: {
                        printSpecifications: '全部'
                    },
                    printSpecialProcess: ''
                })
            }

        }
        else if (type && type.indexOf("-") != -1) {
            setRadioValue('自定义')
            if (type?.indexOf(',') != -1) {
                formRef.setFieldsValue({
                    print: {
                        printSpecifications: '自定义',
                        before: type.split('-')[0],
                        after: type?.substring(type?.indexOf('-') + 1, type?.indexOf(','))
                    },
                    printSpecialProcess: type?.substring(type?.indexOf(',') + 1, type?.length)?.split(',')
                })
            } else {
                formRef.setFieldsValue({
                    print: {
                        printSpecifications: '自定义',
                        before: type.split('-')[0],
                        after: type?.substring(type?.indexOf('-') + 1, type?.indexOf(','))
                    },
                    printSpecialProcess: ''
                })
            }

        } else {
            setRadioValue('')
            formRef.setFieldsValue({
                print: {
                    printSpecifications: ''
                },
                printSpecialProcess: type?.split(',')
            })
        }
    };
    const onDepartmentChange = async (value: Record<string, any>, title?: string) => {
        const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
        switch (title) {
            case "drawLeaderDepartment":
                form.setFieldsValue({ drawLeader: '' });
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
                    <TreeNode key={item.id} title={item.name} value={item.id} className={styles.node}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} key={item.id} title={item.name} value={item.id} />;
        });
    const plainOptions = ['全部', '自定义'];
    return (
        <>
            <Modal
                title={'编辑'}
                width={800}
                visible={visible}
                onCancel={handleModalCancel}
                footer={
                    <>
                        <Button onClick={handleModalCancel}>关闭</Button>
                        <Button type='primary' onClick={handleModalOk}>保存并提交</Button>
                    </>
                }
            >
                <DetailTitle title='基本信息' />
                <Form form={form} {...formItemLayout} initialValues={printData || {}}>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name="planNumber" label="计划号" rules={[{ required: true, message: '请选择计划号' }]}>
                                <Select
                                    style={{ width: '100%' }}
                                    filterOption={(input, option) =>
                                        option?.props?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                                    }
                                    showSearch
                                    onChange={async (value) => {
                                        const towerData: any = await RequestUtil.get(`/tower-science/loftingTask/list/${value}`);
                                        setTower(towerData);
                                        setRead(false)
                                        formRef.setFieldsValue({
                                            print: {
                                                printSpecifications: ''
                                            },
                                            printSpecialProcess: ''
                                        });
                                        form.setFieldsValue({
                                            planNumber: value,
                                            productCategoryId: '',
                                            productTypeName: '',
                                            print: '',
                                            structureNumber: '',
                                            drawLeaderDepartment: '',
                                            drawLeader: ''
                                        })
                                    }}>
                                    {planData && planData.map(({ planNumber }: any, index: string | number | undefined) => {
                                        return <Select.Option key={index} value={planNumber}>
                                            {planNumber}
                                        </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="productCategoryId" label="塔型" rules={[{ required: true, message: '请选择塔型' }]}>
                                <Select style={{ width: '100%' }} onChange={async (value) => {
                                    formRef.setFieldsValue({
                                        print: {
                                            printSpecifications: ''
                                        },
                                        printSpecialProcess: ''
                                    });
                                    const formValue = tower.filter((item: { productCategoryId: SelectValue; }) => { return item.productCategoryId === value })
                                    if (formValue[0].drawLeader) {
                                        form.setFieldsValue({
                                            drawLeaderName: formValue[0]?.drawLeaderName,
                                            drawLeader: formValue[0]?.drawLeader,
                                        })
                                    }
                                    const type: any = formValue[0]?.productTypeName;
                                    if (type === '四管塔' || type === '管塔' || type === '架构' || type === '架构塔' || type === '钢架构') {
                                        setRadioValue('自定义')
                                        setPrintData({
                                            ...printData,
                                            productTypeName: formValue[0]?.productTypeName,
                                            productCategoryId: value,
                                            printSpecifications: '全部'
                                        })
                                        form.setFieldsValue({
                                            print: '全部'
                                        })
                                        formRef.setFieldsValue({
                                            print: {
                                                printSpecifications: '全部'
                                            }
                                        })
                                    }
                                    else if (type === '钢管杆') {
                                        setRadioValue('自定义')
                                        form.setFieldsValue({
                                            print: '1-12'
                                        })
                                        setPrintData({
                                            ...printData,
                                            printSpecifications: '1-12',
                                            productTypeName: formValue[0]?.productTypeName,
                                            productCategoryId: value,

                                        })
                                        formRef.setFieldsValue({
                                            print: {
                                                printSpecifications: '自定义',
                                                before: 1,
                                                after: 12
                                            }
                                        })
                                    }
                                    else if (type === '角钢塔') {
                                        form.setFieldsValue({
                                            print: '火曲,钻孔,铆焊'
                                        })
                                        setPrintData({
                                            ...printData,
                                            productTypeName: formValue[0]?.productTypeName,
                                            productCategoryId: value,
                                            printSpecialProcess: '火曲,钻孔,铆焊'
                                        })
                                        formRef.setFieldsValue({
                                            printSpecialProcess: ['火曲', '钻孔', '铆焊']
                                        })
                                    }
                                    form.setFieldsValue({
                                        ...formValue[0],
                                        loftingUserName: tower?.filter((e: any) => e?.productCategoryId === value)[0]?.loftingUserName,
                                        programmingLeaderName: tower?.filter((e: any) => e?.productCategoryId === value)[0]?.programmingLeaderName
                                    
                                    })
                                    setRead(true)
                                }}>
                                    {tower && tower.map(({ productCategoryId, productCategoryName }: any, index: string | number | undefined) => {
                                        return <Select.Option key={index} value={productCategoryId}>
                                            {productCategoryName}
                                        </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="productTypeName" label="产品类型" >
                                {/* <Select style={{width:'100%'}} disabled>
                                            {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                                return <Select.Option key={index} value={name}>
                                                    {name}
                                                </Select.Option>
                                            })}
                                        </Select> */}
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="print" label="打印条件" >
                                <Input addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={() => {
                                    setPrintVisible(true)
                                }}>+编辑</Button>} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="loftingUserName" label="放样员" >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="programmingLeaderName" label="编程负责人" >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="structureNumber" label="数量" rules={[{ required: true, message: '请输入数量' }]}>
                                <InputNumber min={1} max={9999} precision={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="detail" label="钢板明细" >
                                <Button type='link' onClick={async () => {
                                    const data: any = await RequestUtil.post(`/tower-science/loftingTemplate/plate/list`, {
                                        productCategoryId: printData?.productCategoryId,
                                        printSpecifications: printData?.printSpecifications,
                                        printSpecialProcess: printData?.printSpecialProcess,
                                        productTypeName: printData?.productTypeName
                                    });
                                    setSteelData(data)
                                    setSteelVisible(true)
                                }} disabled={!read}>查看</Button>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="drawLeaderName" label="接收人" rules={[{ required: true, message: '请选择接收人' }]} >
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'drawLeader'} selectedKey={[form?.getFieldsValue(true)?.drawLeader]} onSelect={(selectedRows: Record<string, any>) => {
                                        form?.setFieldsValue({
                                            drawLeader: selectedRows[0]?.userId,
                                            drawLeaderName: selectedRows[0]?.name
                                        })
                                    }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="description" label="备注">
                                <TextArea maxLength={200} showCount rows={1} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <Attachment ref={attachRef} edit onDoneChange={
                    (attachs: FileProps[]) => {
                        setFileData([...attachs]);
                    }
                } dataSource={fileData} maxCount={1} />
            </Modal>
            <Modal
                title='样板打印条件'
                width={500}
                visible={printVisible}
                onCancel={handlePrintModalCancel}
                footer={
                    <>
                        <Button onClick={handlePrintModalCancel}>关闭</Button>
                        <Button type='primary' onClick={handlePrintModalOk}>保存并提交</Button>
                    </>
                }
            >
                <Form form={formRef} {...formItemPrintLayout} initialValues={printData || {}}>
                    <Form.Item label="规格">
                        <Input.Group>
                            <Form.Item
                                name={['print', 'printSpecifications']}
                                noStyle
                            >
                                <Checkbox.Group options={plainOptions} onChange={(e: any) => {
                                    if (e.length > 1) {
                                        setRadioValue(e.filter((item: any) => { return item !== radioValue })[0])
                                        formRef.setFieldsValue({
                                            print: {
                                                printSpecifications: e.filter((item: any) => { return item !== radioValue })[0],
                                                before: undefined,
                                                after: undefined
                                            }
                                        })
                                    }
                                    else {
                                        setRadioValue(e[0])
                                        formRef.setFieldsValue({
                                            print: {
                                                printSpecifications: e[0],
                                                before: undefined,
                                                after: undefined
                                            }
                                        })
                                    }

                                }} value={[radioValue]} />
                            </Form.Item>
                            {radioValue === '自定义' && <Form.Item
                                name={['print', 'before']}
                                noStyle
                            >
                                <InputNumber style={{ width: '25%' }} min={1} />
                            </Form.Item>}
                            {radioValue === '自定义' && <Form.Item
                                name={['print', 'after']}
                                noStyle
                            >
                                <InputNumber style={{ width: '25%' }} min={1} />
                            </Form.Item>}
                        </Input.Group>
                    </Form.Item>
                    <Form.Item name="printSpecialProcess" label="特殊工艺">
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                        >
                            {specialData && specialData.map(({ name }: any, index: string | number | undefined) => {
                                return <Select.Option key={index} value={name}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
            <Button type='link' onClick={async () => {
                setVisible(true)
                const planData: any = await RequestUtil.get(`/tower-science/loftingTemplate?current=1&size=1000&type=`);
                // const arr:any[] = planData?.records.filter((item: { uploadStatus: number; })=>{
                //     return item.uploadStatus === 1
                // })
                setPlanData(unique(planData?.records, 'planNumber'));
                const specialData: any = await RequestUtil.get(`/tower-aps/product/process?current=1&size=1000&type=`);
                setSpecialData(specialData?.records);
                const departmentData: any = await RequestUtil.get(`/tower-system/department`);
                setDepartment(departmentData);
                const sampleData: any = await RequestUtil.get(`/tower-science/loftingTemplate/${props?.record?.id}`);
                if (sampleData?.drawLeaderDepartment) {
                    const drawLeaderDepartment: any = await RequestUtil.get(`/tower-system/employee?dept=${sampleData?.drawLeaderDepartment}&size=1000`);
                    setMaterialUser(drawLeaderDepartment?.records);
                }
                const towerData: any = await RequestUtil.get(`/tower-science/loftingTask/list/${sampleData?.planNumber}`);
                setTower(towerData);
                setPrintData(sampleData)
                form.setFieldsValue({
                    ...sampleData,
                    print: sampleData?.printSpecifications && sampleData?.printSpecifications !== null ? sampleData?.printSpecifications + ',' + sampleData?.printSpecialProcess : sampleData?.printSpecialProcess
                })
                if (sampleData?.printSpecifications && sampleData?.printSpecifications.indexOf("全部") != -1) {
                    setRadioValue('全部')
                    formRef.setFieldsValue({
                        print: {
                            printSpecifications: '全部'
                        },
                        printSpecialProcess: sampleData?.printSpecialProcess?.split(',')
                    })
                }
                else if (sampleData?.printSpecifications && sampleData?.printSpecifications.indexOf("-") != -1) {
                    setRadioValue('自定义')
                    formRef.setFieldsValue({
                        print: {
                            printSpecifications: '自定义',
                            before: sampleData?.printSpecifications.split('-')[0],
                            after: sampleData?.printSpecifications.split('-')[1],
                        },
                        printSpecialProcess: sampleData?.printSpecialProcess?.split(',')
                    })
                } else {
                    setRadioValue('')
                    formRef.setFieldsValue({
                        print: {
                            printSpecifications: ''
                        },
                        printSpecialProcess: sampleData?.printSpecialProcess?.split(',')
                    })
                }
                setFileData(sampleData?.fileVOList)
                setRead(true)
            }}>编辑</Button>
            <Modal
                title='钢板明细'
                visible={steelVisible}
                width={1500}
                onCancel={() => {
                    setSteelVisible(false)
                    setSteelData([])
                }}
                footer={false}
            >
                <CommonTable columns={steelColumns} dataSource={steelData || []} />
            </Modal>
        </>
    )
}