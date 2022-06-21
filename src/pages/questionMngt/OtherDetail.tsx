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
    { title: '大头', dataIndex: 'bigHead', key: 'bigHead' },
    { title: '小头', dataIndex: 'smallHead', key: 'smallHead' },
    { 
        title: '理算重量（kg）', 
        dataIndex: 'basicsTheoryWeight', 
        key: 'basicsTheoryWeight' ,
        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
            <span >{_ === -1 ? 0 : (parseFloat(record?.basicsTheoryWeight)*parseFloat(record?.basicsPartNum)).toFixed(2)}</span>
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
        key: 'segmentName',
        title: '段名',
        width: 150,
        dataIndex: 'segmentName'
    },
    // {
    //     key: 'repeatNum',
    //     title: '段重复数',
    //     width: 150,
    //     dataIndex: 'repeatNum'
    // },
    {
        key: 'code',
        title: '构件编号',
        dataIndex: 'code',
        width: 120
    },
    {
        key: 'structureTexture',
        title: '材质',
        width: 150,
        dataIndex: 'structureTexture',
    },
    {
        key: 'materialName',
        title: '材料名称',
        width: 200,
        dataIndex: 'materialName'
    },
    {
        key: 'structureSpec',
        title: '规格',
        dataIndex: 'structureSpec',
        width: 200,
    },
    {
        key: 'length',
        title: '长度（mm）',
        width: 200,
        dataIndex: 'length'
    },
    {
        key: 'width',
        title: '宽度（mm）',
        width: 200,
        dataIndex: 'width'
    },
    {
        key: 'thickness',
        title: '厚度（mm）',
        width: 200,
        dataIndex: 'thickness'
    },
    {
        key: 'basicsPartNum',
        title: '单段件数',
        width: 200,
        dataIndex: 'basicsPartNum'
    },
    {
        key: 'apertureNumber',
        title: '各孔径孔数',
        width: 200,
        dataIndex: 'apertureNumber'
    },
    {
        key: 'holesNum',
        title: '单件孔数',
        width: 200,
        dataIndex: 'holesNum'
    },
    {
        key: 'electricWelding',
        title: '电焊',
        width: 200,
        dataIndex: 'electricWelding'
    },
    {
        key: 'groove',
        title: '坡口',
        width: 200,
        dataIndex: 'groove'
    },
    {
        key: 'chamfer',
        title: '切角',
        width: 200,
        dataIndex: 'chamfer'
    },
    {
        key: 'openCloseAngle',
        title: '开合角',
        width: 200,
        dataIndex: 'openCloseAngle'
    },
    {
        key: 'bend',
        title: '火曲',
        width: 200,
        dataIndex: 'bend'
    },
    {
        key: 'shovelBack',
        title: '铲背',
        width: 200,
        dataIndex: 'shovelBack'
    },
    {
        key: 'rootClear',
        title: '清根',
        width: 200,
        dataIndex: 'rootClear'
    },
    {
        key: 'squash',
        title: '打扁',
        width: 200,
        dataIndex: 'squash'
    },
    {
        key: 'specialCode',
        title: '特殊件号',
        width: 200,
        dataIndex: 'specialCode'
    },
    {
        key: 'grooveMeters',
        title: '坡口米数（米）',
        width: 200,
        dataIndex: 'grooveMeters'
    },
    {
        key: 'suppress',
        title: '压制',
        width: 200,
        dataIndex: 'suppress'
    },
    {
        key: 'spellNumber',
        title: '拼数',
        width: 200,
        dataIndex: 'spellNumber'
    },
    {
        key: 'slottedForm',
        title: '开槽形式',
        width: 200,
        dataIndex: 'slottedForm'
    },
    {
        key: 'intersectingLine',
        title: '割相贯线',
        width: 200,
        dataIndex: 'intersectingLine'
    },
    {
        key: 'type',
        title: '零件类型',
        width: 200,
        dataIndex: 'type'
    },
    {
        key: 'description',
        title: '备注',
        width: 200,
        dataIndex: 'description'
    },
    {
        key: 'arcContaining',
        title: '含弧',
        width: 200,
        dataIndex: 'arcContaining'
    },
    {
        key: 'perforate',
        title: '钻孔',
        width: 200,
        dataIndex: 'perforate'
    },
    {
        key: 'perforateNumber',
        title: '钻孔孔径孔数',
        width: 200,
        dataIndex: 'perforateNumber'
    },
    {
        key: 'withReaming',
        title: '扩孔',
        width: 200,
        dataIndex: 'withReaming'
    },
    {
        key: 'reamingNumber',
        title: '扩孔孔径孔数',
        width: 200,
        dataIndex: 'reamingNumber'
    },
    {
        key: 'gasCutting',
        title: '气割孔（0/1）',
        width: 200,
        dataIndex: 'gasCutting'
    },
    {
        key: 'gasCuttingNumber',
        title: '气割孔径孔数',
        width: 200,
        dataIndex: 'gasCuttingNumber'
    },
    {
        key: 'basicsWeight',
        title: '单件重量（kg）',
        width: 200,
        dataIndex: 'basicsWeight'
    },
    {
        key: 'totalWeight',
        title: '总重（kg）',
        width: 200,
        dataIndex: 'totalWeight'
    },
    {
        key: 'craftName',
        title: '工艺列（核对）',
        width: 200,
        dataIndex: 'craftName'
    },
    {
        key: 'sides',
        title: '边数',
        width: 200,
        dataIndex: 'sides',
        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
            <span>{_ === -1 ? undefined : _}</span>
        )
    },
    {
        key: 'perimeter',
        title: '周长',
        width: 200,
        dataIndex: 'perimeter',
        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
            <span>{_ === -1 ? undefined : _}</span>
        )
    },
    {
        key: 'surfaceArea',
        title: '表面积',
        width: 200,
        dataIndex: 'surfaceArea',
        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
            <span>{_ === -1 ? undefined : _}</span>
        )
    },
    {
        key: 'weldingEdge',
        title: '焊接边（mm）',
        width: 200,
        dataIndex: 'weldingEdge',
        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
            <span>{_ === -1 ? undefined : _}</span>
        )
    }
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