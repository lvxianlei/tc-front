import React from 'react'
import { Button, Form, Input, message, Select, Space, Spin, TablePaginationConfig } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../../utils/RequestUtil';
import { useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import styles from './SetOut.module.less';

interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: [];
}

export default function LoftingTowerApplication(): React.ReactNode {
    const towerColumns = [
        { 
            title: '序号', 
            dataIndex: 'index', 
            key: 'index', 
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) 
        },
        { 
            title: '塔型', 
            dataIndex: 'productCategoryName', 
            key: 'productCategoryName'
        },
        { 
            title: '塔型钢印号', 
            dataIndex: 'steelProductShape', 
            key: 'steelProductShape' 
        },
        { 
            title: '任务单号',
            dataIndex: 'taskNum', 
            key: 'taskNum' 
            },
        { 
            title: '呼高', 
            dataIndex: 'basicHeight', 
            key: 'basicHeight' 
        },
    ]

    const paragraphColumns = [
        { 
            title: '序号', 
            dataIndex: 'index', 
            key: 'index', 
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) 
        },
        { 
            title: '段号', 
            dataIndex: 'name', 
            key: 'name'
        },
        { 
            title: '单段件号数', 
            dataIndex: 'singleNumberCount', 
            key: 'singleNumberCount' 
        },
        { 
            title: '单段件数', 
            dataIndex: 'singleCount', 
            key: 'singleCount' 
        },
        { 
            title: '单段重量', 
            dataIndex: 'singleWeight', 
            key: 'singleWeight' 
        },
        { 
            title: '备注', 
            dataIndex: 'description', 
            key: 'description' 
        },
        { 
            title: '操作', 
            dataIndex: 'operation', 
            key:'operation', 
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (<Button type='link' onClick={ () => {
                if(paragraph){
                    RequestUtil.post(`/tower-science/drawProductStructure/reuse?productSegmentGroupId=${params.productSegmentId}&productSegmentId=${paragraph}&passivityProductSegment=${record.id}`).then(() => {
                        message.success('套用成功'); 
                    }).then(()=>{
                        history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${params.productSegmentId}`)
                    });
                }else{
                    message.error('未选择段落，不可选择套用！')
                }
            } }>选择套用</Button>)
        }
    ]

    const [ form ] = useForm();
    const history = useHistory();
    const [ paragraphData, setParagraphData ] = useState([] as undefined | any);
    const params = useParams<{ id: string ,productSegmentId: string,status:string, materialLeader: string}>();
    const page = {
        current: 1,
        pageSize: 10
    };
    const [ detailData, setDetailData ] = useState<IResponseData | undefined>(undefined);
    const [ externalTaskNum, setExternalTaskNum ] = useState<string>('');
    const [ productCategoryName, setProductCategoryName ] = useState<string>('');
    const [ steelProductShape, setSteelProductShape ] = useState<string>('');
    const [ paragraph, setParagraph ] = useState<string>('');

    const getTableDataSource = (pagination: TablePaginationConfig, filterValues: Record<string, any>) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IResponseData>(`/tower-science/materialProductCategory/apply/page`, { ...pagination, ...filterValues });
        setDetailData(data);
        resole(data);
    });
    const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => { 
        const data: [] = await RequestUtil.get(`/tower-science/drawProductSegment/getSegmentBySegmentGroupId`,{segmentGroupId:params.productSegmentId});
        getTableDataSource(page, {})
        resole(data);
    }), {})
    const paragraphList: [] = data || [];

    const onFinish = (value: Record<string, any>) => {
        getTableDataSource(page, value);
        setExternalTaskNum(value.externalTaskNum);
        setProductCategoryName(value.productCategoryName);
        setSteelProductShape(value.steelProductShape);
    }

    return <>
        <Spin spinning={ loading }>
            <DetailContent operation={[
                <Button key="goback" onClick={ () => history.goBack() }>关闭</Button>
            ]}>
                <DetailTitle title="套用" />
                <Form form={ form } onFinish={ onFinish } layout="inline"  className={ styles.topForm }>
                    <Form.Item name="fuzzyMsg" label="查询">
                        <Input placeholder="放样任务单号/塔型名称/塔型钢印号" />
                    </Form.Item>
                    <Space direction="horizontal" className={ styles.btnRight }>
                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button type="ghost" htmlType="reset">重置</Button>
                    </Space>
                </Form>
                <CommonTable 
                    dataSource={ detailData?.records } 
                    columns={ towerColumns }
                    onRow={ (record: Record<string, any>, index: number) => ({
                            onClick: async () => { 
                                const resData: [] = await RequestUtil.get(`/tower-science/drawProductSegment/reuse/productCategory`, { productCategoryId: record.id });
                                setParagraphData([...resData]);
                            },
                            className: styles.tableRow
                        })
                    }
                    onChange={ (pagination: TablePaginationConfig) => { 
                        getTableDataSource(pagination, { externalTaskNum: externalTaskNum, productCategoryName: productCategoryName, steelProductShape: steelProductShape });
                    } }
                    pagination={{
                        current: detailData?.current || 0,
                        pageSize: detailData?.size || 0,
                        total: detailData?.total || 0,
                        showSizeChanger: false
                    }}
                />
                <span style={{marginRight:'10px'}}>套用至段落</span>
                <Select placeholder="请选择" onChange={ (e: string) => {
                    setParagraph(e);
                } } style={{width:'120px'}}>
                    { paragraphList.map((item: any) => {
                        return <Select.Option key={ item.id } value={ item.id }>{ item.segmentName }</Select.Option>
                    }) }
                </Select>
                <p className={ styles.title }>段落信息</p>
                <CommonTable dataSource={ paragraphData } columns={ paragraphColumns } pagination={ false }/>
            </DetailContent>
        </Spin>
    </>
}