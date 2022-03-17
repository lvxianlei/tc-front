import React, { useState } from 'react'
import { Button, Form, message, Modal, Spin } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../common';
import { baseInfoData } from './question.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import AuthUtil from '../../utils/AuthUtil';

const tableColumns = [
    { 
        title: '序号', 
        dataIndex: 'index', 
        key: 'index', 
        render: (_a: any, _b: any, index: number): React.ReactNode => (
            <span>{index + 1}</span>
        ) 
    },
    { 
        title: '操作部门', 
        dataIndex: 'createDeptName', 
        key: 'createDeptName', 
    },
    { 
        title: '操作人', 
        dataIndex: 'createUserName', 
        key: 'createUserName' 
    },
    { 
        title: '操作时间', 
        dataIndex: 'createTime', 
        key: 'createTime' 
    },
    { 
        title: '任务状态', 
        dataIndex: 'status', 
        key: 'status',  
        render: (value: number, record: object): React.ReactNode => {
            const renderEnum: any = [
                {
                    value: 0,
                    label: "已拒绝"
                },
                {
                    value: 1,
                    label: "待修改"
                },
                {
                    value: 2,
                    label: "已修改"
                },
                {
                    value: 3,
                    label: "已删除"
                },
            ]
        return <>
            {
                renderEnum.find((item: any) => item.value === value).label
            }
        </>
    }},
    { 
        title: '备注', 
        dataIndex: 'description', 
        key: 'description' 
    }
]

const towerColumns = [
    // { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { 
        title: '段名', 
        dataIndex: 'segmentName', 
        key: 'segmentName', 
    },
    { 
        title: '构件编号', 
        dataIndex: 'code', 
        key: 'code' 
    },
    { 
        title: '材料名称', 
        dataIndex: 'materialName', 
        key: 'materialName' 
    },
    { 
        title: '材质', 
        dataIndex: 'structureTexture', 
        key: 'structureTexture' 
    },
    { 
        title: '规格', 
        dataIndex: 'structureSpec', 
        key: 'structureSpec' 
    },
    { 
        title: '单段件数', 
        dataIndex: 'basicsPartNum', 
        key: 'basicsPartNum' 
    },
    { 
        title: '长度（mm）', 
        dataIndex: 'length', 
        key: 'length' 
    },
    { title: '宽度（mm）', dataIndex: 'width', key: 'width' },
    { title: '厚度（mm）', dataIndex: 'thickness', key: 'thickness' },
    { 
        title: '理算重量（kg）', 
        dataIndex: 'basicsTheoryWeight', 
        key: 'basicsTheoryWeight' ,
        render: (_: number, _b: any, index: number): React.ReactNode => (
            <span>{_===-1?0:_}</span>
        )  
    },
    { 
        title: '单件重量（kg）',
        dataIndex: 'basicsWeight', 
        key: 'basicsWeight' ,
        render: (_: number, _b: any, index: number): React.ReactNode => (
            <span>{_===-1?0:_}</span>
        )
    },
    { 
        title: '小计重量（kg）', 
        dataIndex: 'totalWeight', 
        key: 'totalWeight',
        render: (_: number, _b: any, index: number): React.ReactNode => (
            <span>{_===-1?0:_}</span>
        ) 
    },
    { 
        title: '备注', 
        dataIndex: 'description', 
        key: 'description' 
    }
]

const setOutColumns = [
    // { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { 
        title: '段名', 
        dataIndex: 'segmentName', 
        key: 'segmentName', 
    },
    { 
        title: '构件编号', 
        dataIndex: 'code', 
        key: 'code' 
    },
    { 
        title: '材料名称', 
        dataIndex: 'materialName', 
        key: 'materialName' 
    },
    { 
        title: '材质', 
        dataIndex: 'structureTexture', 
        key: 'structureTexture' 
    },
    { 
        title: '规格', 
        dataIndex: 'structureSpec', 
        key: 'structureSpec' 
    },
    { 
        title: '厚度（mm）', 
        dataIndex: 'thickness', 
        key: 'thickness' 
    },
    { 
        title: '长度（mm）', 
        dataIndex: 'length', 
        key: 'length' 
    },
    { 
        title: '宽度（mm）', 
        dataIndex: 'width', 
        key: 'width' 
    },
    { 
        title: '单段件数',
        dataIndex: 'basicsPartNum', 
        key: 'basicsPartNum' 
    },
    { 
        title: '单件重量（kg）', 
        dataIndex: 'basicsWeight', 
        key: 'basicsWeight' ,
        render: (_: number, _b: any, index: number): React.ReactNode => (
            <span>{_===-1?0:_}</span>
        ) 
    },
    { 
        title: '小计重量（kg）', 
        dataIndex: 'totalWeight', 
        key: 'totalWeight' ,
        render: (_: number, _b: any, index: number): React.ReactNode => (
            <span>{_===-1?0:_}</span>
        ) 
    },
    { 
        title: '单件孔数', 
        dataIndex: 'holesNum', 
        key: 'holesNum' 
    },
    { 
        title: '备注', 
        dataIndex: 'description', 
        key: 'description' 
    },
    { 
        title: '特殊件号', 
        dataIndex: 'specialCode', 
        key: 'specialCode' 
    },
    { 
        title: '电焊', 
        dataIndex: 'electricWelding', 
        key: 'electricWelding' 
    },
    { 
        title: '火曲', 
        dataIndex: 'bend', 
        key: 'bend' 
    },
    { 
        title: '切角', 
        dataIndex: 'chamfer', 
        key: 'chamfer' 
    },
    {
        title: '铲背', 
        dataIndex: 'shovelBack', 
        key: 'shovelBack' 
    },
    { 
        title: '清根', 
        dataIndex: 'rootClear', 
        key: 'rootClear' 
    },
    { 
        title: '打扁', 
        dataIndex: 'squash', 
        key: 'squash' 
    },
    { 
        title: '开合角', 
        dataIndex: 'openCloseAngle', 
        key: 'openCloseAngle' 
    },
    { 
        title: '钻孔', 
        dataIndex: 'perforate', 
        key: 'perforate' 
    },
    { 
        title: '坡口', 
        dataIndex: 'groove', 
        key: 'groove' 
    },
    { 
        title: '割相贯线',
        dataIndex: 'intersectingLine', 
        key: 'intersectingLine' 
    },
    { 
        title: '开槽形式', 
        dataIndex: 'slottedForm', 
        key: 'slottedForm' 
    },
    { 
        title: '边数', 
        dataIndex: 'sides', 
        key: 'sides' 
    },
    { 
        title: '周长', 
        dataIndex: 'perimeter', 
        key: 'perimeter' 
    },
    { 
        title: '表面积（m²）', 
        dataIndex: 'surfaceArea', 
        key: 'surfaceArea' 
    },
    { 
        title: '各孔径孔数', 
        dataIndex: 'apertureNumber', 
        key: 'apertureNumber' 
    },
    { 
        title: '焊接边（mm）', 
        dataIndex: 'weldingEdge', 
        key: 'weldingEdge' 
    },
]

const boltColumns = [
    // { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { 
        title: '类型', 
        dataIndex: 'typeName', 
        key: 'typeName'
    },
    { 
        title: '名称', 
        dataIndex: 'name', 
        key: 'name' 
    },
    { 
        title: '等级', 
        dataIndex: 'level', 
        key: 'level' 
    },
    { 
        title: '规格', 
        dataIndex: 'specs', 
        key: 'specs' 
    },
    { 
        title: '无扣长（mm）', 
        dataIndex: 'unbuckleLength', 
        key: 'unbuckleLength' 
    },
    { 
        title: '小计', 
        dataIndex: 'subtotal', 
        key: 'subtotal',render: (_: number, _b: any, index: number): React.ReactNode => (
            <span>{_===-1?0:_}</span>
        ) 
    },
    { 
        title: '裕度', 
        dataIndex: 'wealth', 
        key: 'wealth' 
    },
    { 
        title: '合计', 
        dataIndex: 'total', 
        key: 'total',
        render: (_: number, _b: any, index: number): React.ReactNode => (
            <span>{_===-1?0:_}</span>
        ) 
    },
    { 
        title: '单重（kg）', 
        dataIndex: 'singleWeight', 
        key: 'singleWeight',
        render: (_: number, _b: any, index: number): React.ReactNode => (
            <span>{_===-1?0:_}</span>
        ) 
    },
    { 
        title: '合计重（kg）', 
        dataIndex: 'totalWeight', 
        key: 'totalWeight',
        render: (_: number, _b: any, index: number): React.ReactNode => (
            <span>{_===-1?0:_}</span>
        ) 
    },
]

export default function OtherDetail(): React.ReactNode {
    const history = useHistory();
    const location = useLocation<{ recipient:'', createUser:''}>();
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const params = useParams<{ id: string, type: string, status: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        let data:any = {};
        if(params.type==='WTD-TL'){
            data = await RequestUtil.get(`/tower-science/issue/material?id=${params.id}`);
        }
        else if(params.type==='WTD-FY'){
            data = await RequestUtil.get(`/tower-science/issue/lifting?id=${params.id}`);
        }
        else if(params.type==='WTD-LS'){
            data= await RequestUtil.get(`/tower-science/issue/bolt?id=${params.id}`);
        }
        resole(data)
    }), {})
    const detailData: any = data;
    console.log(location.state)
    console.log(AuthUtil.getUserId())
    const handleModalOk = async () => {
        try {
            const refuseData = await form.validateFields();
            refuseData.id = params.id;
            await RequestUtil.post(`/tower-science/issue/refuse`,refuseData).then(()=>{
                message.success('提交成功！')
                setVisible(false)
            }).then(()=>{
                history.goBack()
            })
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalCancel = () => setVisible(false);
    return <>
        <Spin spinning={loading}>
            <Modal 
                title='拒绝'
                visible={visible} 
                onCancel={handleModalCancel}
                onOk={handleModalOk}
                okText='提交'
                cancelText='关闭'
            >
                <Form form={form} >
                    <Form.Item name="description" label="拒绝原因" rules={[{
                        required:true, 
                        message:'请填写拒绝原因'
                    },
                    {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                    }]}>
                        <TextArea showCount maxLength={500}/>
                    </Form.Item>
                </Form>
            </Modal>
            <DetailContent operation={params.status==='1'&&AuthUtil.getUserId()===location.state.recipient && AuthUtil.getUserId()===location.state.createUser?[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    await RequestUtil.post(`/tower-science/issue/verify`,{id:params.id}).then(()=>{
                        message.success('修改成功！')
                    }).then(()=>{
                        history.goBack()
                    })
                }}>确认修改</Button>,
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => {
                    setVisible(true);
                }}>拒绝修改</Button>,
                // <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => {
                //     history.push(`/workMngt/pickList/pickTowerMessage/${params.id}`)
                // }}>跳转页面</Button>,
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    await RequestUtil.delete(`/tower-science/issue?id=${params.id}`).then(()=>{
                        message.success('删除成功！')
                    }).then(()=>{
                        history.goBack()
                    })
                }}>删除</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]:params.status==='1'&&AuthUtil.getUserId()===location.state.recipient ?[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    await RequestUtil.post(`/tower-science/issue/verify`,{id:params.id}).then(()=>{
                        message.success('修改成功！')
                    }).then(()=>{
                        history.goBack()
                    })
                }}>确认修改</Button>,
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => {
                    setVisible(true);
                }}>拒绝修改</Button>,
                // <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => {
                //     history.push(`/workMngt/pickList/pickTowerMessage/${params.id}`)
                // }}>跳转页面</Button>,
                
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]:params.status==='1'&&AuthUtil.getUserId()===location.state.createUser?[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    await RequestUtil.delete(`/tower-science/issue?id=${params.id}`).then(()=>{
                        message.success('删除成功！')
                    }).then(()=>{
                        history.goBack()
                    })
                }}>删除</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]:[<Button key="goback" onClick={() => history.goBack()}>返回</Button>]}>
                <DetailTitle title="问题信息" />
                <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
                <DetailTitle title="源数据" />
                {params.type==='WTD-TL'?<CommonTable columns={towerColumns} dataSource={[detailData?.drawProductStructure]} pagination={false}/>:null}
                {params.type==='WTD-FY'?<CommonTable columns={setOutColumns} dataSource={[detailData?.productStructureVO]} pagination={false}/>:null}
                {params.type==='WTD-LS'?<CommonTable columns={boltColumns} dataSource={[detailData?.productBoltRecordVO]} pagination={false}/>:null}
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={detailData?.issueRecordList} pagination={false}/>
            </DetailContent>
        </Spin>
    </>
}