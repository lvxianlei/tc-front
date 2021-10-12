import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, message } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory, useParams } from 'react-router-dom'
import { CommonTable, Page } from '../../../common'
import QuestionnaireModal from './QuestionnaireModal';
import { Popconfirm } from 'antd';
import RequestUtil from '../../../../utils/RequestUtil';

export default function PickCheckList(): React.ReactNode {
    const [form] = Form.useForm();
    const params = useParams<{ productSegmentId: string,id: string }>();
    const history = useHistory();
    const [ visible, setVisible ] = useState(false);
    const [ record, setRecord ] = useState({});
    const [ title, setTitle ] = useState('提交问题');

   
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', editable: true, render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '段名', dataIndex: 'segmentName', key: 'segmentName', editable: true},
        { title: '构件编号', dataIndex: 'code', key: 'code',editable: true },
        { title: '材料名称', dataIndex: 'materialName', key: 'materialName', editable: true },
        { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture', editable: true },
        { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec', editable: true },
        { title: '宽度（mm）', dataIndex: 'width', key: 'width', editable: true },
        { title: '厚度（mm）', dataIndex: 'thickness', key: 'thickness', editable: true },
        { title: '长度（mm）', dataIndex: 'length', key: 'length', editable: true },
        { title: '单基件数', dataIndex: 'basicsPartNum', key: 'basicsPartNum', editable: true },
        { title: '理算重量（kg）', dataIndex: 'basicsTheoryWeight', key: 'basicsTheoryWeight', editable: true },
        { title: '单件重量（kg）', dataIndex: 'basicsWeight', key: 'basicsWeight', editable: true },
        { title: '小计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight', editable: true },
        { title: '备注', dataIndex: 'description', key: 'description', editable: true }
    ];
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
   
    return (
        <>
            <Page
                path={`/tower-science/drawProductStructure/${params.productSegmentId}/check`}
                columns={ columnsSetting }
                extraOperation={
                    <Space>
                        <Button>导出</Button>
                        <Popconfirm
                            title="确认完成校核?"
                            onConfirm={ async () => {
                                await RequestUtil.post(`/tower-science/drawProductStructure/${params.productSegmentId}/completed/check`).then(()=>{
                                    message.success('校核成功！')
                                }).then(()=>{
                                    history.push(`/workMngt/pickList/pickTowerMessage/${params.id}`)
                                })
                            } }
                            okText="确认"
                            cancelText="取消"
                        > 
                            <Button>完成校核</Button>
                        </Popconfirm>
                        <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}`)}}>返回上一级</Button>
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
                ]}
            />
            <QuestionnaireModal visible={ visible } record={ record } title={ title } modalCancel={ () => setVisible(false) }/>
        </>
    )
}