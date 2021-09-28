/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-包装清单-添加
*/

import React, { useState } from 'react';
import { Space, Button, Popconfirm, Modal, Input, Col, Row, message, Form, Checkbox } from 'antd';
import { BaseInfo, CommonTable, DetailContent, DetailTitle } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory } from 'react-router-dom';
import styles from './SetOut.module.less';

interface IBundle {
    readonly id?: string;
    readonly projectName?: string;
}



const baseColumns= [
    {
        "dataIndex": "projectName",
        "title": "塔型"
    },
    {
        "dataIndex": "projectNumber",
        "title": "杆塔号"
    }
]

const chooseColumns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        fixed: 'left' as FixedType,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
    },
    {
        key: 'projectName',
        title: '段名',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '构件编号',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '材料名称',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '材质',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '规格',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '单段件数',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '长度',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '宽度',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '重量',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '电焊',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '火曲',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '清根',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '铲背',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '备注',
        width: 150,
        dataIndex: 'projectName'
    }
]

export default function PackingListNew(): React.ReactNode {

    const PackingColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'bundle',
            title: '捆号',
            width: 150,
            dataIndex: 'bundle'
        },
        {
            key: 'projectName',
            title: '构件编号',
            width: 150,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '规格',
            width: 150,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '长度',
            width: 150,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '数量',
            width: 150,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '备注',
            width: 150,
            dataIndex: 'projectName'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Popconfirm
                    title="确认移除?"
                    onConfirm={ () => remove(record) }
                    okText="确认"
                    cancelText="取消"
                >
                    <Button type="link">移除</Button>
                </Popconfirm>
            )
        }
    ]

    const remove = (value: Record<string, any>) => {
        const newPackagingData = packagingData.filter((item: IBundle) => {
            return item.id !== (value.id).toString();
        })
        setPackagingData(newPackagingData);
        setStayDistrict([ ...stayDistrict, value ])
    }
    
    const history = useHistory();
    const [ form ] = Form.useForm();
    const [ selectedRows, setSelectedRows ] = useState([]);
    const [ visible, setVisible ] = useState(false);
    const [ bundle, setBundle ] = useState('');
    const [ packagingData, setPackagingData ] = useState<IBundle[]>([]);
    const [ stayDistrict, setStayDistrict ] = useState<IBundle[]>([{ id: '121212', projectName: '111' }, { id: '13421212', projectName: '34234434' } ]);

    const packaging = () => {
        if(bundle) {
            const data: IBundle[] = selectedRows.map((item: IBundle) => {
                return {
                    ...item,
                    bundle: bundle
                }
            })
            setPackagingData([ ...data, ...packagingData ]);
            setVisible(false);
            setBundle('');
            let newStayDistrict = stayDistrict.filter((item: IBundle) => {
                return selectedRows.every((items: IBundle) => {
                    return item.id !== items.id;
                })
            })
            setStayDistrict(newStayDistrict);
        } else {
            message.warning("请输入捆号");
        }
    }

    const onFinish = (value: Record<string, any>) => {
        console.log(value)
    }

    return <> 
        <DetailContent operation={ [
            <Space direction="horizontal" size="small" >
                <Button type="primary" >保存</Button>
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
            </Space>
        ] }>
            <DetailTitle title="包装信息" />
            <BaseInfo columns={ baseColumns } dataSource={ {} } col={ 2 }/>
            <Form form={ form } className={ styles.topPadding } onFinish={ (value: Record<string, any>) => onFinish(value) }>
                <Form.Item name="aaaa">
                    <Checkbox.Group style={ { width: '100%' } }> 
                        <Row>
                            <Col span={6}>
                                <Checkbox value="A">是否电焊</Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="B">是否火曲</Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="c">是否清根</Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="d">是否铲背</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Row>
                    <Col span={ 3 }>
                        <Form.Item name="v" label="规格范围" className={ styles.rightPadding5 }>
                           <Input placeholder="请输入"/>
                        </Form.Item>
                    </Col>
                    <Col span={ 2 }>
                        <Form.Item name="d">
                           <Input placeholder="请输入"/>
                        </Form.Item>
                    </Col>
                    
                    <Col offset={ 1 } span={ 3 }>
                        <Form.Item name="v" label="长度范围" className={ styles.rightPadding5 }>
                           <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={ 2 }>
                        <Form.Item name="d">
                           <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    
                    <Col offset={ 1 } span={ 5 }>
                        <Form.Item name="v" label="段名">
                           <Input placeholder="示例：1-10或1,10" />
                        </Form.Item>
                    </Col>
                    <Col  offset={ 1 } span={ 5 }>
                        <Space direction="horizontal">
                            <Button type="primary" htmlType="submit">搜索</Button>
                            <Button type="ghost" htmlType="reset">重置</Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
            <DetailTitle title="待选区" operation={[ <Button type="primary" onClick={ () => {
                setVisible(true);
            } } ghost disabled={ selectedRows.length === 0 }>选择</Button> ]}/>
            <CommonTable 
                columns={ chooseColumns } 
                pagination={ false } 
                rowSelection={ { onChange: (selectedKeys: [], selectedRows: []) => {
                    setSelectedRows(selectedRows);
                } } } 
                dataSource={ stayDistrict } 
            />
            <DetailTitle title="包装区" />
            <CommonTable columns={ PackingColumns } pagination={ false } dataSource={ packagingData } />
        </DetailContent>
        <Modal title="选择" visible={ visible } okText="保存" cancelText="关闭" onCancel={ () => setVisible(false) } onOk={ () => packaging() }>
            <Row>
                <Col span={ 4 }><p>捆号</p></Col>
                <Col span={ 20 }><Input onChange={ (e) => setBundle(e.target.value) } value={ bundle } placeholder="请输入"/></Col>
            </Row>
        </Modal>
    </>
}