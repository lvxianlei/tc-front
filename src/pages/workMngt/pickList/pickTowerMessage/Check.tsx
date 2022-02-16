import React, { useState } from 'react'
import { Space, Input, Button, Form, message } from 'antd';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../../common'
import QuestionnaireModal from './QuestionnaireModal';
import { Popconfirm } from 'antd';
import RequestUtil from '../../../../utils/RequestUtil';
import styles from './SetOut.module.less';

export default function PickCheckList(): React.ReactNode {
    const params = useParams<{ productSegmentId: string, id: string, materialLeaderId: string,status: string, materialLeader: string}>();
    const history = useHistory();
    const [ visible, setVisible ] = useState(false);
    const [ refresh, setRefresh] = useState(false);
    const [ record, setRecord ] = useState({});
    const [filterValue, setFilterValue] = useState({});
    const [ title, setTitle ] = useState('创建问题单');

   
    const columns = [
        { 
            title: '序号', 
            dataIndex: 'index', 
            key: 'index', 
            editable: true, 
            render: (_a: any, _b: any, index: number): React.ReactNode => (
                <span>{index + 1}</span>
            ) 
        },
        { 
            title: '段号', 
            dataIndex: 'segmentName', 
            key: 'segmentName', 
            editable: false
        },
        { 
            title: '模式', 
            dataIndex: 'patternName', 
            key: 'patternName', 
            editable: false
        },
        {
            title: '构件编号', 
            dataIndex: 'code', 
            key: 'code',
            editable: true 
        },
        { 
            title: '材料名称', 
            dataIndex: 'materialName', 
            key: 'materialName', 
            editable: true 
        },
        { 
            title: '材质', 
            dataIndex: 'structureTexture', 
            key: 'structureTexture',
            editable: true 
        },
        { 
            title: '规格', 
            dataIndex: 'structureSpec', 
            key: 'structureSpec', 
            editable: true 
        },
        { 
            title: '长度（mm）', 
            dataIndex: 'length', 
            key: 'length', 
            editable: true 
        },
        { 
            title: '单段件数', 
            dataIndex: 'basicsPartNum', 
            key: 'basicsPartNum', 
            editable: true 
        },
        { 
            title: '理算重量（kg）', 
            dataIndex: 'basicsTheoryWeight', 
            key: 'basicsTheoryWeight', 
            editable: false 
        },
        { 
            title: '单件重量（kg）', 
            dataIndex: 'basicsWeight', 
            key: 'basicsWeight', 
            editable: true 
        },
        { 
            title: '小计重量（kg）', 
            dataIndex: 'totalWeight', 
            key: 'totalWeight', 
            editable: false,  
            render:(_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{((record.basicsWeight&&record.basicsWeight!==-1?record.basicsWeight:0)*(record.basicsPartNum&&record.basicsPartNum!==-1?record.basicsPartNum:0)).toFixed(2)}</span>
            )
        },
        { 
            title: '备注', 
            dataIndex: 'description', 
            key: 'description', 
            editable: true 
        }
    ];
    const questionnaire = async (_: undefined, record: Record<string, any>, col: Record<string, any>, tip: string) => {
        setVisible(true);
        if(tip === 'normal'||tip === 'brown'|| tip==='blue') {
            setRecord({ problemFieldName: col.title, currentValue: _, problemField: col.dataIndex, rowId: record.id });
            setTitle('创建问题单');
        } else {
            const data: any = await RequestUtil.get(`/tower-science/drawProductStructure/issue/${ record.id }/${col.dataIndex}`);
            if(tip==='red'){ 
                setTitle('查看问题单') 
            }
            else{
                setTitle('创建问题单');
            }
            setRecord({ problemFieldName: col.title, currentValue: _, problemField: col.dataIndex, rowId: record.id, ...data,issueRecordList: data.issueRecordList,  });
           
        }
    }

    const checkColor = (record: Record<string, any>, dataIndex: string) => {
        const red: number = record.redColumn.indexOf(dataIndex);
        const green: number = record.greenColumn.indexOf(dataIndex);
        const yellow: number = record.yellowColumn.indexOf(dataIndex);
        const blueColumn: number = record.blueColumn.indexOf(dataIndex);
        const brownColumn: number = record.brownColumn.indexOf(dataIndex);
        if(red !== -1) {
            return 'red';
        } else if(green !== -1) {
            return 'green';
        } else if(yellow !== -1) {
            return 'yellow';
        } else if(blueColumn !== -1){
            return 'blue';
        } else if(brownColumn !== -1){
            return 'brown';
        }else {
            return 'normal'
        }
    }
    
    const columnsSetting = columns.map(col => {
        return {
            ...col,
            render: col.dataIndex==='totalWeight'? col.render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                col.dataIndex === 'index' ? index + 1 
                : !col.editable ? _ 
                : <p onDoubleClick={ (e) => { questionnaire( _, record, col, checkColor(record, col.dataIndex)) }} className={ checkColor(record, col.dataIndex) === 'red' ? styles.red : checkColor(record, col.dataIndex) === 'green' ? styles.green : checkColor(record, col.dataIndex) === 'yellow' ? styles.yellow :  checkColor(record, col.dataIndex) === 'blue' ? styles.blue: checkColor(record, col.dataIndex) === 'brown' ? styles.brown:'' }>{ _ }</p>
            )  
        }     
    })
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    return (
        <>
            <Page
                path={`/tower-science/drawProductStructure/check`}
                requestData={{segmentGroupId:params.productSegmentId}}
                columns={ columnsSetting }
                onFilterSubmit={onFilterSubmit}
                refresh={refresh}
                filterValue={ filterValue }
                exportPath="/tower-science/drawProductStructure/check"
                extraOperation={
                    <Space>
                        <Popconfirm
                            title="确认完成校核?"
                            onConfirm={ async () => {
                                await RequestUtil.post(`/tower-science/drawProductStructure/completed/check?productSegmentId=${params.productSegmentId}`).then(()=>{
                                    message.success('校核成功！')
                                }).then(()=>{
                                    history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}`)
                                })
                            } }
                            okText="确认"
                            cancelText="取消"
                        > 
                            <Button type='primary' ghost >完成校核</Button>
                        </Popconfirm>
                        <Button type='ghost' onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}`)}}>返回</Button>
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'materialName',
                        label: '材料名称',
                        children: <Input maxLength={200} />
                    },
                    {
                        name: 'structureTexture',
                        label: '材质',
                        children: <Input  maxLength={200} />
                    },
                    {
                        name: 'segmentName',
                        label: '段号',
                        children: <Input  maxLength={200} />
                    },
                ]}
            />
            <QuestionnaireModal visible={ visible } record={ record } title={ title } modalCancel={ () => {setVisible(false);setRefresh(!refresh)} } materialLeaderId={params.materialLeaderId} productCategoryId={params.id}/>
        </>
    )
}