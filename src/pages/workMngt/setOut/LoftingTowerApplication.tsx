/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-放样-放样塔型套用
*/

import React from 'react'
import { Button, Form, Input, Space, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import styles from './SetOut.module.less';

const towerColumns = [
    { 
        title: '序号', 
        dataIndex: 'index', 
        key: 'index', 
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) 
    },
    { 
        title: '塔型', 
        dataIndex: 'partBidNumber', 
        key: 'partBidNumber'
    },
    { 
        title: '塔型钢印号', 
        dataIndex: 'amount', 
        key: 'amount' 
    },
    { 
        title: '任务单号',
         dataIndex: 'goodsType', 
         key: 'goodsType' 
        },
    { 
        title: '呼高', 
        dataIndex: 'unit', 
        key: 'unit' 
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
        dataIndex: 'partBidNumber', 
        key: 'partBidNumber'
    },
    { 
        title: '单段件号数', 
        dataIndex: 'amount', 
        key: 'amount' 
    },
    { 
        title: '单段件数', 
        dataIndex: 'goodsType', 
        key: 'goodsType' 
    },
    { 
        title: '单段重量', 
        dataIndex: 'packageNumber', 
        key: 'packgeNumber' 
    },
    { 
        title: '备注', 
        dataIndex: 'amount', 
        key: 'amount' 
    },
    { 
        title: '操作', 
        dataIndex: 'operation', 
        key:'operation', 
        render: (_a: any, _b: any, index: number): React.ReactNode => (<Button type='link' >选择套用</Button>)
    }
]

export default function LoftingTowerApplication(): React.ReactNode {
    const [ form ] = useForm();
    const history = useHistory();
    const [ paragraphData, setParagraphData ] = useState([] as undefined | any);
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;

    const onFinish = (value: Record<string, any>) => {

    }

    return <>
        <Spin spinning={ loading }>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>关闭</Button>
            ]}>
                <DetailTitle title="套用" />
                <Form form={ form } onFinish={ (value: Record<string, any>) => onFinish(value) } layout="inline"  className={ styles.topForm }>
                    <Form.Item name="v" label="放样任务单号">
                        <Input placeholder="请输入"/>
                    </Form.Item>
                    <Form.Item name="d" label="塔型名称">
                        <Input placeholder="请输入"/>
                    </Form.Item>
                    <Form.Item name="v" label="塔型钢印号">
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Space direction="horizontal" className={ styles.btnRight }>
                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button type="ghost" htmlType="reset">重置</Button>
                    </Space>
                </Form>
                <CommonTable 
                    dataSource={ [{partBidNumber:2}] } 
                    columns={ towerColumns }
                    onRow={ (record:any,index:number) => ({
                            onClick:()=>{ setParagraphData([{},{}]) }
                        })
                    }
                />
                <CommonTable dataSource={ paragraphData } columns={ paragraphColumns }/>
            </DetailContent>
        </Spin>
    </>
}