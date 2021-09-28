/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-校核
*/


import React, { useState } from 'react';
import { Space, Select, Button } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory } from 'react-router-dom';
import QuestionnaireModal from './QuestionnaireModal';


const columns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        editable: false,
        fixed: 'left' as FixedType,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => { 
            return <span>{ index + 1 }</span>
        }
    },
    {
        key: 'projectName',
        title: '段名',
        width: 150,
        dataIndex: 'bidBuyEndTime',
        editable: false
    },
    {
        key: 'projectNumber',
        title: '构件编号',
        dataIndex: 'projectNumber',
        editable: true,
        width: 120
    },
    {
        key: 'bidBuyEndTime',
        title: '材料名称',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'biddingEndTime',
        title: '材质',
        editable: true,
        width: 150,
        dataIndex: 'biddingEndTime',
    },
    {
        key: 'biddingPerson',
        title: '规格',
        dataIndex: 'biddingPerson',
        editable: true,
        width: 200,
    },
    {
        key: 'bidBuyEndTime',
        title: '宽度（mm）',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '厚度（mm）',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '长度（mm）',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '单基件数',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '单件重量（kg）',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '小计重量（kg）',
        width: 200,
        editable: false,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: 'NC程序名称',
        width: 200,
        editable: false,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '备注',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '电焊',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '火曲',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '切角',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '铲背',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '清根',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '打扁',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '开合角',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '钻孔',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '坡口',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '割相贯线',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '开槽形式',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '边数',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '周长',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '表面积',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '各孔径孔数',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '焊接边（mm）',
        editable: true,
        width: 200,
        dataIndex: 'bidBuyEndTime'
    }
]

export default function TowerCheck(): React.ReactNode {
    const history = useHistory();
    const [ visible, setVisible ] = useState(false);
    const [ record, setRecord ] = useState({});
    const [ title, setTitle ] = useState('提交问题');

    const questionnaire = (_: undefined, record: Record<string,  any>, index: number, e: any) => {
        setVisible(true);
        setRecord({ ...record, problemField: e, originalData: _ });
    }
    
    const columnsSetting = columns.map(col => {
        return {
            ...col,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            col.dataIndex === 'index' ? index + 1 : !col.editable? _ :  <span onDoubleClick={ (e) => { questionnaire( _ , record,  index, col.title) } }>{ _ }</span>)
        }  
    })
    
    return<> 
        <Page
            path="/tower-market/bidInfo"
            columns={ columnsSetting }
            headTabs={ [] }
            extraOperation={ <Space direction="horizontal" size="small">
                <Button type="primary" ghost>导出</Button>
                <Button type="primary" ghost>完成校核</Button>
                <Button type="primary" ghost>模型下载</Button>
                <Button type="primary" ghost>样图下载</Button>
                <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
            </Space>}
            searchFormItems={ [
                {
                    name: 'startBidBuyEndTime',
                    label: '材料名称',
                    children: <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value="0" key="0">11111</Select.Option>
                        <Select.Option value="1" key="1">22222222</Select.Option>
                        <Select.Option value="2" key="2">3333</Select.Option>
                        <Select.Option value="3" key="3">4444444</Select.Option>
                    </Select>
                },
                {
                    name: 'startBidBuyEndTime',
                    label: '材质',
                    children: <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value="0" key="0">放样人</Select.Option>
                    </Select>
                }
            ] }
        />
        <QuestionnaireModal visible={ visible } record={ record } title={ title } modalCancel={ () => setVisible(false) }/>
    </>
}