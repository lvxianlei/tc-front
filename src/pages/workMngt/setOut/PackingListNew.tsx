/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-包装清单-添加
*/

import React, { useState } from 'react';
import { Space, Button, Popconfirm, Input, Col, Row, message, Form, Checkbox, Spin, InputNumber, Descriptions, Modal, Select } from 'antd';
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styles from './SetOut.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { IMaterialTree } from '../../system-mngt/material/IMaterial';

export interface IBundle {
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
    readonly structureNum?: number;
    readonly structureCount?: number;
    readonly materialSpec?: string;
    readonly structureId?: string;
    readonly topId?: string;
    readonly pieceCode?: string;
    readonly basicsWeight?: number;
}

export interface IPackingList {
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
    let [ packagingData, setPackagingData ] = useState<IBundle[]>([]);
    const [ stayDistrict, setStayDistrict ] = useState<IBundle[]>([]);
    const location = useLocation<{productCategoryName: string, productNumber: string}>();
    const [ balesCode, setBalesCode ] = useState<string>();
    const [ visible, setVisible ] = useState<boolean>(false);
    const [ userList, setUserList ] = useState([]);
    const [ materialList, setMaterialList ] = useState<IMaterialTree[]>([]);

    const getTableDataSource = (filterValues: Record<string, any>) => new Promise(async (resole, reject) => {
        if(!location.state) {
            const data = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/structure/list?id=${ params.packId }`);
            setPackagingData(data?.packageRecordVOList || []);
            setBalesCode(data?.balesCode || '');
            resole(data);
        } else {
            resole({ productCategoryName: location.state.productCategoryName, productNumber:location.state.productNumber });
        }
        const list = await RequestUtil.get<IBundle[]>(`/tower-science/packageStructure/structureList`, { productId: params.productId, ...filterValues, packageStructureId: params.packId });
        const newData = list.filter((item: IBundle) => !packagingData.some((ele: IBundle) => ele.id !== item.id))
        setStayDistrict(newData);
        const data: any = await RequestUtil.get<[]>(`/tower-science/productSegment/distribution?productId=${params.productId}`);
        setUserList(data?.loftingProductSegmentList);
        const resData: IMaterialTree[] = await RequestUtil.get<IMaterialTree[]>('/tower-system/materialCategory/tree');
        setMaterialList(resData);
    });

    const { loading, data } = useRequest<IPackingList>(() => getTableDataSource({}), {})

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
            key: 'segmentName',
            title: '段名',
            width: 150,
            dataIndex: 'segmentName'
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
            key: 'structureNum',
            title: '单段件数',
            width: 150,
            dataIndex: 'structureNum'
        },
        {
            key: 'width',
            title: '宽度',
            width: 150,
            dataIndex: 'width'
        },
        {
            key: 'thickness',
            title: '厚度',
            width: 150,
            dataIndex: 'thickness'
        },
        {
            key: 'length',
            title: '长度',
            width: 150,
            dataIndex: 'length'
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
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Button type="link" onClick={ () => packaging(record, index) }>添加</Button>
            )
        }
    ]

    const packingColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'pieceCode',
            title: '构件编号',
            width: 150,
            dataIndex: 'pieceCode'
        },
        {
            key: 'materialSpec',
            title: '规格',
            width: 150,
            dataIndex: 'materialSpec'
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
                    key={ record.structureId } 
                    bordered={false} 
                    defaultValue={ record.num } 
                    min={ 1 }
                    max={ record.structureCount }
                    onChange={ (e) => numChange(e, record.structureCount, index) }
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
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Popconfirm
                    title="确认移除?"
                    onConfirm={ () => remove(record, index) }
                    okText="确认"
                    cancelText="取消"
                >
                    <Button type="link">移除</Button>
                </Popconfirm>
            )
        }
    ]

    const remove = async (value: Record<string, any>, index: number) => {
        packagingData.splice(index, 1)
        setPackagingData([...packagingData]); 
        if(value.id) {
            const newValue = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/delRecord?packageRecordId=${ value.id }`);
            setStayDistrict([ ...stayDistrict, newValue ]);
        } else {
            setStayDistrict([ ...stayDistrict, value ]);
        }
    }
    
    const packaging = (record: IBundle, index: number) => {
        const data: IBundle = {
            ...record,
            description: record.description,
            length: record.length,
            pieceCode: record.code,
            num: record.structureNum,
            materialSpec: record.structureSpec,
            productCategoryId: detailData.productCategoryId,
            productId: detailData.productId,
            structureId: record.id,
            structureCount: record.structureNum,
            topId: record.id,
            id: ''
        }
        setPackagingData([ data, ...packagingData ]);
        stayDistrict.splice(index, 1);
        setStayDistrict(stayDistrict);
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

    const numChange = (e: number, structureCount: number, index: number) => {
        packagingData[index] = {
            ...packagingData[index],
            num: e
        }
        setPackagingData([ ...packagingData ])
    }

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <> 
        <DetailContent operation={ [
            <Space direction="horizontal" size="small" >
                <Button type="primary" onClick={ () => setVisible(true) }>创建包</Button>
                <Button type="ghost" onClick={ () => history.goBack() }>关闭</Button>
            </Space>
        ] }>
            <DetailTitle title="包装信息" />             
            <Form form={ form } className={ styles.topPadding } onFinish={ (value: Record<string, any>) => onFinish(value) }>
                <Descriptions style={{ width: '40%', position: 'absolute' }} title="" bordered size="small" column={ 2 }>
                    <Descriptions.Item label="塔型">
                        { detailData?.productCategoryName }
                    </Descriptions.Item>
                    <Descriptions.Item label="杆塔号">
                        { detailData?.productNumber }
                    </Descriptions.Item>
                </Descriptions>   
                <Form.Item name="checkList">
                    <Checkbox.Group style={ { width: '50%', position: 'absolute', right: '1%' } }> 
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
                        <Form.Item name="materialSpec" label="材料名称" className={ styles.rightPadding5 }>
                            <Input placeholder="请输入" maxLength={20}/>
                        </Form.Item>
                    </Col>
                    <Col offset={ 1 } span={ 4 }>
                        <Form.Item name="segmentId" label="段名">
                           <Select placeholder="请选择" style={{width:'120px'}}>
                                { userList && userList.map((item: any) => {
                                    return <Select.Option key={ item.id } value={ item.segmentId }>{ item.segmentName }</Select.Option>
                                }) }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col offset={ 1 } span={ 3 }>
                        <Form.Item name="minLength" label="长度范围" className={ styles.rightPadding5 }>
                           <Input type="number" min={0} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={ 2 }>
                        <Form.Item name="maxLength">
                           <Input type="number" min={0} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col offset={ 1 } span={ 4 }>
                        <Form.Item name="code" label="查询">
                           <Input placeholder="请输入" maxLength={50}/>
                        </Form.Item>
                    </Col>
                    <Col  offset={ 1 } span={ 3 }>
                        <Space direction="horizontal">
                            <Button type="primary" htmlType="submit">搜索</Button>
                            <Button type="ghost" htmlType="reset">重置</Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
            <p className={ styles.title }>待选区<span className={ styles.description }>未分配：{ stayDistrict.length }</span></p>
            <CommonTable 
                columns={ chooseColumns } 
                pagination={ false } 
                dataSource={ [...stayDistrict] } 
            />
            <p className={ styles.title }>包装区<span className={ styles.description }>已选择构件数：{ packagingData.length }</span><span className={ styles.description }>已选择构件总重量：{ eval(packagingData.map(item => { return Number(item.num) * Number(item.basicsWeight) }).join('+')) || 0 }吨</span></p>
            <CommonTable columns={ packingColumns } pagination={ false } dataSource={ packagingData } />
        </DetailContent>
        <Modal visible={ visible } title="创建包" onCancel={ () => setVisible(false) } onOk={ () => {
            if(balesCode&&/^[^\s]*$/.test(balesCode)&&/^[0-9a-zA-Z-]*$/.test(balesCode)) {
                const value = {
                    balesCode: balesCode,
                    id: params.packId,
                    productCategoryId: params.id,
                    productCategoryName: detailData.productCategoryName,
                    productId: params.productId,
                    productNumber: detailData.productNumber,
                    packageRecordSaveDTOList: packagingData,
                };
                RequestUtil.post(`/tower-science/packageStructure/save`, value).then(res => {
                    message.success('包装清单保存成功');
                    setVisible(false);
                    history.goBack();
                })
            } else {
                message.warning('请输入捆号');
            }   
        } }>
            <Row>
                <Col span={ 4 }>捆号</Col>   
                <Col span={ 19 } offset={ 1 }>
                    <Input placeholder="请输入捆号" defaultValue={ detailData?.balesCode } onChange={ (e) => balesCodeChange(e) } maxLength={10}/> 
                </Col>  
            </Row>  
        </Modal>
    </>
}