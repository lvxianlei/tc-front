/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-包装清单-添加
*/

import React, { useState } from 'react';
import { Space, Button, Popconfirm, Input, Col, Row, message, Form, Checkbox, Spin, InputNumber, Descriptions } from 'antd';
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styles from './SetOut.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

interface IBundle {
    readonly id?: string;
    readonly towerStructureId?: string;
    readonly productCategoryId?: string;
    readonly balesCode?: string;
    readonly productId?: string;
    readonly num?: number;
    readonly code?: string;
    readonly structureSpec?: string;
    readonly length?: string;
    readonly description?: string;
    readonly basicsPartNum?: number;
    readonly allNum?: number;
    readonly materialSpec?: string;
}

interface IPackingList {
    readonly balesCode?: string;
    readonly productCategoryId?: string;
    readonly productCategoryName?: string;
    readonly productId?: string;
    readonly productNumber?: string;
    readonly packageRecordVOList?: IBundle[];
    readonly toChooseList?: IBundle[];
    readonly id?: string;
    readonly description?: string;
}

export default function PackingListNew(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productId: string, packId: string }>();
    const [ form ] = Form.useForm();
    const [ selectedRows, setSelectedRows ] = useState([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useState([]);
    const [ packagingData, setPackagingData ] = useState<IBundle[]>([]);
    const [ stayDistrict, setStayDistrict ] = useState<IBundle[]>([]);
    const [ balesCode, setBalesCode ] = useState<string>();
    const [ description, setDescription ] = useState("");
    const location = useLocation<{productCategoryName: string, productNumber: string}>()

    const getTableDataSource = (filterValues: Record<string, any>) => new Promise(async (resole, reject) => {
        if(!location.state) {
            const data = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/structure/list?id=${ params.packId }`);
            setPackagingData(data?.packageRecordVOList || []);
            resole(data);
        } else {
            resole({ productCategoryName: location.state.productCategoryName, productNumber:location.state.productNumber });
        }
        const list = await RequestUtil.get<IBundle[]>(`/tower-science/packageStructure/structureList`, { productId: params.productId, ...filterValues })
        setStayDistrict(list);
    });

    const { loading, data } = useRequest<IPackingList>(() => getTableDataSource({}));

    const detailData: IPackingList = data || {};

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
            key: 'partName',
            title: '段名',
            width: 150,
            dataIndex: 'partName'
        },
        {
            key: 'code',
            title: '构件编号',
            width: 150,
            dataIndex: 'code'
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 150,
            dataIndex: 'materialName'
        },
        {
            key: 'structureTexture',
            title: '材质',
            width: 150,
            dataIndex: 'structureTexture'
        },
        {
            key: 'structureSpec',
            title: '规格',
            width: 150,
            dataIndex: 'structureSpec'
        },
        {
            key: 'basicsPartNum',
            title: '单段件数',
            width: 150,
            dataIndex: 'basicsPartNum'
        },
        {
            key: 'length',
            title: '长度',
            width: 150,
            dataIndex: 'length'
        },
        {
            key: 'width',
            title: '宽度',
            width: 150,
            dataIndex: 'width'
        },
        {
            key: 'basicsWeight',
            title: '重量',
            width: 150,
            dataIndex: 'basicsWeight'
        },
        {
            key: 'electricWelding',
            title: '电焊',
            width: 150,
            dataIndex: 'electricWelding'
        },
        {
            key: 'bend',
            title: '火曲',
            width: 150,
            dataIndex: 'bend'
        },
        {
            key: 'rootClear',
            title: '清根',
            width: 150,
            dataIndex: 'rootClear'
        },
        {
            key: 'shovelBack',
            title: '铲背',
            width: 150,
            dataIndex: 'shovelBack'
        },
        {
            key: 'description',
            title: '备注',
            width: 150,
            dataIndex: 'description'
        }
    ]

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
            key: 'balesCode',
            title: '捆号',
            width: 150,
            dataIndex: 'balesCode'
        },
        {
            key: 'pieceCode',
            title: '构件编号',
            width: 150,
            dataIndex: 'pieceCode'
        },
        {
            key: 'structureSpec',
            title: '规格',
            width: 150,
            dataIndex: 'structureSpec'
        },
        {
            key: 'length',
            title: '长度',
            width: 150,
            dataIndex: 'length'
        },
        {
            key: 'num',
            title: '数量',
            width: 150,
            dataIndex: 'num',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <InputNumber
                    key={ record.id } 
                    bordered={false} 
                    defaultValue={ record.num } 
                    min={ 1 }
                    max={ record.allNum }
                    onChange={ (e) => numChange(e, record.allNum, index) }
                />
            )
        },
        {
            key: 'description',
            title: '备注',
            width: 150,
            dataIndex: 'description'
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
            return item.id !== value.id;
        })
        setPackagingData(newPackagingData);
        stayDistrict.forEach((item: IBundle, ind: number) => {
            if(item.id === value.id) {
                stayDistrict[ind] = {
                    ...item,
                    basicsPartNum: value.allNum
                }  
                setStayDistrict([...stayDistrict])
            } else {
                setStayDistrict([ ...stayDistrict, value ]);
            }
        })
    }
    
    const packaging = () => {
        const data: IBundle[] = selectedRows.map((item: IBundle) => {
            return {
                ...item,
                balesCode: balesCode,
                description: item.description,
                id: item.id,
                length: item.length,
                pieceCode: item.code,
                num: item.basicsPartNum,
                materialSpec: item.structureSpec,
                productCategoryId: detailData.productCategoryId,
                productId: detailData.productId,
                structureId: item.id,
                allNum: item.basicsPartNum
            }
        })
        setPackagingData([ ...data, ...packagingData ]);
        let newStayDistrict: IBundle[] = stayDistrict?.filter((item: IBundle) => {
            return selectedRows.every((items: IBundle) => {
                return item.id !== items.id;
            })
        })
        setStayDistrict(newStayDistrict);
        setSelectedRows([]);
        setSelectedRowKeys([]);
    }

    const onFinish = (value: Record<string, any>) => {
        if(value.checkList?.indexOf('electricWelding') >= 0) {
            value.electricWelding = 1
        }
        if(value.checkList?.indexOf('bend') >= 0) {
            value.bend = 1
        }
        if(value.checkList?.indexOf('rootClear') >= 0) {
            value.rootClear = 1
        }
        if(value.checkList?.indexOf('shovelBack') >= 0) {
            value.shovelBack = 1
        }
        getTableDataSource({ ...value });
    }

    const balesCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBalesCode(e.target.value);
        const data: IBundle[] = packagingData.map((item: IBundle) => {
            return {
                ...item,
                balesCode: e.target.value,
            }
        })
        setPackagingData([...data]);
    } 

    const numChange = (e: number, allNum: number, index: number) => {
        if(e < allNum) {
            stayDistrict.forEach((item: IBundle, ind: number) => {
                if(item.id === packagingData[index].id) {
                    stayDistrict[ind] = {
                        ...item,
                        basicsPartNum: (packagingData[index]?.allNum || 0) - (e || 0)
                    }  
                    setStayDistrict([...stayDistrict])
                } else {
                    setStayDistrict([...stayDistrict, { ...packagingData[index], basicsPartNum: (packagingData[index]?.allNum || 0) - (e || 0) }])
                }
            })
        } else {
            const data = stayDistrict.filter((item: IBundle) => {
                return item.id !== packagingData[index].id;
            })
            setStayDistrict([ ...data ])
        }
    }

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <> 
        <DetailContent operation={ [
            <Space direction="horizontal" size="small" >
                <Button type="primary" onClick={ () => {
                    const value = {
                        balesCode: balesCode,
                        id: params.packId,
                        productCategoryId: params.id,
                        productCategoryName: detailData.productCategoryName,
                        productId: params.productId,
                        productNumber: detailData.productNumber,
                        packageRecordSaveDTOList: packagingData,
                        description: description
                    };
                    RequestUtil.post(`/tower-science/packageStructure/save`, value).then(res => {
                        message.success('包装清单保存成功');
                        history.goBack();
                    })
                } }>保存</Button>
                <Button type="ghost" onClick={ () => history.goBack() }>关闭</Button>
            </Space>
        ] }>
            <DetailTitle title="包装信息" />
            <Descriptions title="" bordered size="small" column={ 4 }>
                <Descriptions.Item label="塔型">
                    { detailData?.productCategoryName }
                </Descriptions.Item>
                <Descriptions.Item label="杆塔号">
                    { detailData?.productNumber }
                </Descriptions.Item>
                <Descriptions.Item label="捆号">
                    <Input placeholder="请输入捆号" defaultValue={ detailData?.balesCode } bordered={ false } onChange={ (e) => balesCodeChange(e) } />   
                </Descriptions.Item>
                <Descriptions.Item label="备注">
                    <Input placeholder="请输入备注" defaultValue={ detailData?.description } bordered={ false } onChange={ (e) => setDescription(e.target.value) } />   
                </Descriptions.Item>
            </Descriptions>                
            <Form form={ form } className={ styles.topPadding } onFinish={ (value: Record<string, any>) => onFinish(value) }>
                <Form.Item name="checkList">
                    <Checkbox.Group style={ { width: '100%' } }> 
                        <Row>
                            <Col span={6}>
                                <Checkbox value="electricWelding" key="1">是否电焊</Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="bend" key="2">是否火曲</Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="rootClear" key="3">是否清根</Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="shovelBack" key="4">是否铲背</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Row>
                    <Col span={ 3 }>
                        <Form.Item name="materialSpec" label="规格范围" className={ styles.rightPadding5 }>
                           <Input placeholder="请输入"/>
                        </Form.Item>
                    </Col>
                    <Col offset={ 1 } span={ 3 }>
                        <Form.Item name="minLength" label="长度范围" className={ styles.rightPadding5 }>
                           <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={ 2 }>
                        <Form.Item name="maxLength">
                           <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col offset={ 1 } span={ 5 }>
                        <Form.Item name="segmentName" label="段名">
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
            <DetailTitle title="待选区" operation={[ <Button type="primary" onClick={ () => packaging() } ghost disabled={ selectedRows.length === 0 }>添加</Button> ]}/>
            <CommonTable 
                columns={ chooseColumns } 
                pagination={ false } 
                rowSelection={ { selectedRowKeys, onChange: (selectedKeys: [], selectedRows: []) => {
                    setSelectedRows(selectedRows);
                    setSelectedRowKeys(selectedKeys);
                } } } 
                dataSource={ [...stayDistrict] } 
            />
            <DetailTitle title="包装区" />
            <CommonTable columns={ PackingColumns } pagination={ false } dataSource={ packagingData } />
        </DetailContent>
    </>
}