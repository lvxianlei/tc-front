/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-校核
*/

import React, { useState } from 'react';
import { Space, Button, Input } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory, useParams } from 'react-router-dom';
import QuestionnaireModal from './QuestionnaireModal';
import RequestUtil from '../../../utils/RequestUtil';
import { downloadTemplate } from './downloadTemplate';


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
        key: 'partName',
        title: '段名',
        width: 150,
        dataIndex: 'partName',
        editable: false
    },
    {
        key: 'code',
        title: '构件编号',
        dataIndex: 'code',
        editable: true,
        width: 120
    },
    {
        key: 'materialName',
        title: '材料名称',
        editable: true,
        width: 200,
        dataIndex: 'materialName'
    },
    {
        key: 'structureTexture',
        title: '材质',
        editable: true,
        width: 150,
        dataIndex: 'structureTexture',
    },
    {
        key: 'specName',
        title: '规格',
        dataIndex: 'specName',
        editable: true,
        width: 200,
    },
    {
        key: 'width',
        title: '宽度（mm）',
        editable: true,
        width: 200,
        dataIndex: 'width'
    },
    {
        key: 'thickness',
        title: '厚度（mm）',
        editable: true,
        width: 200,
        dataIndex: 'thickness'
    },
    {
        key: 'length',
        title: '长度（mm）',
        editable: true,
        width: 200,
        dataIndex: 'length'
    },
    {
        key: 'basicsPartNum',
        title: '单段件数',
        editable: true,
        width: 200,
        dataIndex: 'basicsPartNum'
    },
    {
        key: 'basicsWeight',
        title: '单件重量（kg）',
        editable: true,
        width: 200,
        dataIndex: 'basicsWeight'
    },
    {
        key: 'totalWeight',
        title: '小计重量（kg）',
        width: 200,
        editable: false,
        dataIndex: 'totalWeight'
    },
    {
        key: 'ncName',
        title: 'NC程序名称',
        width: 200,
        editable: false,
        dataIndex: 'ncName'
    },
    {
        key: 'description',
        title: '备注',
        editable: true,
        width: 200,
        dataIndex: 'description'
    },
    {
        key: 'electricWelding',
        title: '电焊',
        editable: true,
        width: 200,
        dataIndex: 'electricWelding'
    },
    {
        key: 'bend',
        title: '火曲',
        editable: true,
        width: 200,
        dataIndex: 'bend'
    },
    {
        key: 'chamfer',
        title: '切角',
        editable: true,
        width: 200,
        dataIndex: 'chamfer'
    },
    {
        key: 'shovelBack',
        title: '铲背',
        editable: true,
        width: 200,
        dataIndex: 'shovelBack'
    },
    {
        key: 'rootClear',
        title: '清根',
        editable: true,
        width: 200,
        dataIndex: 'rootClear'
    },
    {
        key: 'squash',
        title: '打扁',
        editable: true,
        width: 200,
        dataIndex: 'squash'
    },
    {
        key: 'openCloseAngle',
        title: '开合角',
        editable: true,
        width: 200,
        dataIndex: 'openCloseAngle'
    },
    {
        key: 'perforate',
        title: '钻孔',
        editable: true,
        width: 200,
        dataIndex: 'perforate'
    },
    {
        key: 'groove',
        title: '坡口',
        editable: true,
        width: 200,
        dataIndex: 'groove'
    },
    {
        key: 'intersectingLine',
        title: '割相贯线',
        editable: true,
        width: 200,
        dataIndex: 'intersectingLine'
    },
    {
        key: 'slottedForm',
        title: '开槽形式',
        editable: true,
        width: 200,
        dataIndex: 'slottedForm'
    },
    {
        key: 'sides',
        title: '边数',
        editable: true,
        width: 200,
        dataIndex: 'sides'
    },
    {
        key: 'perimeter',
        title: '周长',
        editable: true,
        width: 200,
        dataIndex: 'perimeter'
    },
    {
        key: 'surfaceArea',
        title: '表面积',
        editable: true,
        width: 200,
        dataIndex: 'surfaceArea'
    },
    {
        key: 'apertureNumber',
        title: '各孔径孔数',
        editable: true,
        width: 200,
        dataIndex: 'apertureNumber'
    },
    {
        key: 'weldingEdge',
        title: '焊接边（mm）',
        editable: true,
        width: 200,
        dataIndex: 'weldingEdge'
    }
]

export default function TowerCheck(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productSegmentId: string }>();
    const [ visible, setVisible ] = useState(false);
    const [ record, setRecord ] = useState({});
    const [ title, setTitle ] = useState('提交问题');
    const [ refresh, setRefresh ] = useState(false);

    const questionnaire = async (_: undefined, record: Record<string, any>, col: Record<string, any>, tip: string) => {
        setVisible(true);
        if(tip !== 'normal') {
            const data: {} = await RequestUtil.get<{}>(`/tower-science/productStructure/issue/detail?id=${ params.productSegmentId }`);
            setRecord({ problemFieldName: col.title, currentValue: _, problemField: col.dataIndex, rowId: record.id, ...data });
            setTitle('查看问题');
        } else {
            setRecord({ problemFieldName: col.title, currentValue: _, problemField: col.dataIndex, rowId: record.id });
        }
    }

    const checkColor = (record: Record<string, any>, dataIndex: string) => {
        const red: number = record.redColumn.indexOf(dataIndex);
        const green: number = record.greenColumn.indexOf(dataIndex);
        const yellow: number = record.yellowColumn.indexOf(dataIndex);
        if(red !== -1) {
            return 'red';
        } else if(green !== -1) {
            return 'green';
        } else if(yellow !== -1) {
            return 'yellow';
        } else {
            return 'normal'
        }
    }
    
    const columnsSetting = columns.map(col => {
        return {
            ...col,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                col.dataIndex === 'index' ? index + 1 
                : !col.editable ? _ 
                : <p onDoubleClick={ (e) => { questionnaire( _, record, col, checkColor(record, col.dataIndex)) }} className={ checkColor(record, col.dataIndex) === 'red' ? styles.red : checkColor(record, col.dataIndex) === 'green' ? styles.green : checkColor(record, col.dataIndex) === 'yellow' ? styles.yellow : '' }>{ _ }</p>
            )  
        }     
    })
    
    return<> 
        <Page
            path="/tower-science/productStructure/list"
            columns={ columnsSetting }
            requestData={{ productSegmentId: params.productSegmentId }}
            headTabs={ [] }
            refresh={ refresh }
            extraOperation={ <Space direction="horizontal" size="small">
                {/* <Button type="primary" ghost>导出</Button> */}
                <Button type="primary" onClick={ () => { 
                    RequestUtil.get<{}>(`/tower-science/productSegment/completed/check?productSegmentId=${ params.productSegmentId }`).then(res => {
                        history.goBack();
                    }) 
                } } ghost>完成校核</Button>
                <Button type="primary" onClick={ () => downloadTemplate('/tower-science/productSegment/segmentModelDownload', '模型', { productSegmentId: params.productSegmentId }) } ghost>模型下载</Button>
                <Button type="primary" onClick={ () => downloadTemplate('/tower-science/productSegment/segmentDrawDownload', '样图', { productSegmentId: params.productSegmentId }) } ghost>样图下载</Button>
                <Button type="primary" onClick={ () => history.goBack() } ghost>返回上一级</Button>
            </Space>}
            searchFormItems={ [
                {
                    name: 'materialName',
                    label: '材料名称',
                    children: <Input placeholder="请输入"/>
                },
                {
                    name: 'structureTexture',
                    label: '材质',
                    children: <Input placeholder="请输入"/>
                }
            ] }
        />
        <QuestionnaireModal visible={ visible } record={ record } title={ title } modalCancel={ () => { setVisible(false); setRefresh(!refresh); } }/>
    </>
}