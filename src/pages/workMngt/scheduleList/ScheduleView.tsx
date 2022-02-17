import React, { useState } from 'react'
import { Space, Input, Button, Form, Modal, Row, Col, Select, DatePicker, TreeSelect, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { CommonTable, DetailTitle, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';
import { TreeNode } from 'antd/lib/tree-select';
import styles from './scheduleList.module.less';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';
import SchedulePlan from './SchedulePlan';


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
        title: '操作', 
        dataIndex: 'status', 
        key: 'status', 
        render: (value: number, record: object): React.ReactNode => {
            const renderEnum: any = [
                {
                    value: 1,
                    label: "指派"
                },
                {
                    value: 2,
                    label: "编辑"
                },
                {
                    value: null,
                    label: "-"
                },
            ]
            return <>{value!==-1&&value?renderEnum.find((item: any) => item.value === value).label:''}</>
        }
    },
    { 
        title: '备注', 
        dataIndex: 'description', 
        key: 'description' 
    }
]

export default function ScheduleView(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [scheduleData, setScheduleData] = useState<any|undefined>({});
    const history = useHistory();
    const [form] = Form.useForm();
    const [department, setDepartment] = useState<any|undefined>([]);
    const [boltUser, setBoltUser] = useState<any|undefined>([]);
    const [weldingUser, setWeldingUser] = useState<any|undefined>([]);
    const [loftingUser, setLoftingUser] = useState<any|undefined>([]);
    const [drawUser, setDrawUser] = useState<any|undefined>([]);
    const [materialUser, setMaterialUser] = useState<any|undefined>([]);
    const [materialPartUser, setMaterialPartUser] = useState<any|undefined>([]);
    const [smallSampleUser, setSmallSampleUser] = useState<any|undefined>([]);
    const [planData, setPlanData] = useState<any|undefined>([]);
    const params = useParams<{ id: string, status: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/sinzetech-user/department/tree`);
        setDepartment(departmentData);
        const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
        setPlanData(planData);
        
        resole(data)
    }), {})
    
    
    const handleModalOk = async () => {
        try {
            const saveData = await form.validateFields();
            saveData.id = scheduleData.id;
            saveData.assignPlanId = scheduleData.assignPlanId;
            saveData.boltDeliverTime= moment(saveData.boltDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.weldingDeliverTime= moment(saveData.weldingDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.loftingDeliverTime= moment(saveData.loftingDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.loftingPartDeliverTime= moment(saveData.loftingPartDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.materialDeliverTime=moment(saveData.materialDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.materialPartDeliverTime= moment(saveData.materialPartDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.smallSampleDeliverTime= moment(saveData.smallSampleDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.boltDrawDeliverTime= moment(saveData.boltDrawDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.weldingDrawDeliverTime= moment(saveData.weldingDrawDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.materialLeaderDepartment= Array.isArray(saveData.materialLeaderDepartment)?saveData.materialLeaderDepartment[0]:saveData.materialLeaderDepartment;
            saveData.materialPartLeaderDepartment= Array.isArray(saveData.materialPartLeaderDepartment)?saveData.materialPartLeaderDepartment[0]:saveData.materialPartLeaderDepartment;
            saveData.boltLeaderDepartment= Array.isArray(saveData.boltLeaderDepartment)?saveData.boltLeaderDepartment[0]:saveData.boltLeaderDepartment;
            saveData.weldingLeaderDepartment= Array.isArray(saveData.weldingLeaderDepartment)?saveData.weldingLeaderDepartment[0]:saveData.weldingLeaderDepartment;
            saveData.loftingLeaderDepartment=  Array.isArray(saveData.loftingLeaderDepartment)?saveData.loftingLeaderDepartment[0]:saveData.loftingLeaderDepartment;
            saveData.drawLeaderDepartment= Array.isArray(saveData.drawLeaderDepartment)?saveData.drawLeaderDepartment[0]:saveData.drawLeaderDepartment;
            saveData.smallSampleLeaderDepartment= Array.isArray(saveData.smallSampleLeaderDepartment)?saveData.smallSampleLeaderDepartment[0]:saveData.smallSampleLeaderDepartment;

            await RequestUtil.post('/tower-science/productCategory/assign', saveData).then(()=>{
                setVisible(false);
                form.setFieldsValue({});
            }).then(()=>{
                setRefresh(!refresh);
            })
        
        } catch (error) {
            console.log(error)
        }
    }
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'name',
            title: '塔型',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'steelProductShape',
            title: '塔型钢印号',
            width: 100,
            dataIndex: 'steelProductShape'
        },
        {
            key: 'patternName',
            title: '模式',
            width: 100,
            dataIndex: 'patternName',
        },
        {
            key: 'priorityName',
            title: '优先级',
            width: 100,
            dataIndex: 'priorityName',
        },
        {
            key: 'materialLeaderName',
            title: '提料负责人',
            width: 200,
            dataIndex: 'materialLeaderName'
        },
        {
            key: 'materialPartLeaderName',
            title: '提料配段负责人',
            width: 100,
            dataIndex: 'materialPartLeaderName'
        },
        {
            key: 'loftingLeaderName',
            title: '放样负责人',
            width: 100,
            dataIndex: 'loftingLeaderName'
        },
        {
            key: 'weldingLeaderName',
            title: '编程负责人',
            width: 100,
            dataIndex: 'weldingLeaderName'
        },
        {
            key: 'smallSampleLeaderName',
            title: '小样图负责人',
            width: 100,
            dataIndex: 'smallSampleLeaderName'
        },
        {
            key: 'boltLeaderName',
            title: '螺栓清单负责人',
            width: 100,
            dataIndex: 'boltLeaderName'
        },
        {
            key: 'drawLeaderName',
            title: '图纸上传负责人',
            width: 100,
            dataIndex: 'drawLeaderName'
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={async ()=>{
                        
                        setVisible(true);
                        setLoad(true)
                        const resData: any = await RequestUtil.get(`/tower-science/productCategory/${record.id}`);
                        setScheduleData(resData);
                        if(resData.materialLeaderDepartment){
                            const materialLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.materialLeaderDepartment}&size=1000`);
                            setMaterialUser(materialLeaderDepartment.records);
                        }
                        if(resData.materialPartLeaderDepartment){
                            const materialPartLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.materialPartLeaderDepartment}&size=1000`);
                            setMaterialPartUser(materialPartLeaderDepartment.records);
                        }
                        if(resData.smallSampleLeaderDepartment){
                            const smallSampleLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.smallSampleLeaderDepartment}&size=1000`);
                            setSmallSampleUser(smallSampleLeaderDepartment.records);
                        }
                        if(resData.drawLeaderDepartment){
                            const drawLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.drawLeaderDepartment}&size=1000`);
                            setDrawUser(drawLeaderDepartment.records);
                        }
                        if(resData.loftingLeaderDepartment){
                            const loftingLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.loftingLeaderDepartment}&size=1000`);
                            setLoftingUser(loftingLeaderDepartment.records);
                        }
                        if(resData.weldingLeaderDepartment){
                            const weldingLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.weldingLeaderDepartment}&size=1000`);
                            setWeldingUser(weldingLeaderDepartment.records);
                        }
                        if(resData.boltLeaderDepartment){
                            const boltLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.boltLeaderDepartment}&size=1000`);
                            setBoltUser(boltLeaderDepartment.records);
                        }
                        if(resData?.assignConfigVO?.materialWithSectionCompletionTime && resData?.materialDeliverTime){
                            const day = Number(resData.assignConfigVO.materialWithSectionCompletionTime);
                            let uom = new Date(resData.materialDeliverTime);
                            let newDate =new Date(uom.setHours(uom.getHours() + day));
                            resData.materialPartDeliverTime = newDate
                        }
                        if(resData?.assignConfigVO?.weldingCompletionTime 
                            && resData?.assignConfigVO?.loftingWithSectionCompletionTime 
                            && resData?.assignConfigVO.smallSampleCompletionTime 
                            && resData?.assignConfigVO.boltCompletionTime
                            && resData?.assignConfigVO.weldingDrawDeliverTime
                            && resData?.assignConfigVO.blotDrawDeliverTime 
                            && resData?.loftingDeliverTime){
                            const weldingCompletionTime = Number(resData.assignConfigVO.weldingCompletionTime);
                            const loftingWithSectionCompletionTime = Number(resData.assignConfigVO.loftingWithSectionCompletionTime);
                            const smallSampleCompletionTime = Number(resData.assignConfigVO.smallSampleCompletionTime);
                            const boltCompletionTime = Number(resData.assignConfigVO.boltCompletionTime);
                            const weldingDrawTime = Number(resData.assignConfigVO.weldingDrawDeliverTime);
                            const boltDrawTime = Number(resData.assignConfigVO.blotDrawDeliverTime);
                            let newWeldingCompletionTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + weldingCompletionTime));
                            let newLoftingWithSectionCompletionTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + loftingWithSectionCompletionTime));
                            let newSmallSampleCompletionTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + smallSampleCompletionTime));
                            let newBoltCompletionTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + boltCompletionTime + loftingWithSectionCompletionTime));
                            let newWeldingDrawTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + weldingCompletionTime + boltDrawTime));
                            let newBoltDrawTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + boltCompletionTime + weldingDrawTime));
                            resData.weldingDeliverTime=newWeldingCompletionTime
                            resData.boltDeliverTime=newBoltCompletionTime
                            resData.smallSampleDeliverTime=newSmallSampleCompletionTime
                            resData.loftingPartDeliverTime=newLoftingWithSectionCompletionTime
                            resData.boltDrawDeliverTime=newBoltDrawTime
                            resData.weldingDrawDeliverTime=newWeldingDrawTime
                        }
                        form.setFieldsValue({
                            ...resData,
                            materialLeader:resData.materialLeader && resData.materialLeader!==-1 ?resData.materialLeader:'',
                            materialLeaderDepartment:resData.materialLeaderDepartment && resData.materialLeaderDepartment!==-1?resData.materialLeaderDepartment:'',
                            boltLeader:resData.boltLeader&& resData.boltLeader!==-1?resData.boltLeader:'',
                            boltLeaderDepartment:resData.boltLeaderDepartment&& resData.boltLeaderDepartment!==-1?resData.boltLeaderDepartment:'',
                            weldingLeader:resData.weldingLeader&& resData.weldingLeader!==-1?resData.weldingLeader:'',
                            weldingLeaderDepartment:resData.weldingLeaderDepartment&& resData.weldingLeaderDepartment!==-1?resData.weldingLeaderDepartment:'',
                            loftingLeader:resData.loftingLeader&& resData.loftingLeader!==-1?resData.loftingLeader:'',
                            loftingLeaderDepartment:resData.loftingLeaderDepartment&& resData.loftingLeaderDepartment!==-1?resData.loftingLeaderDepartment:'',
                            drawLeader:resData.drawLeader&& resData.drawLeader!==-1?resData.drawLeader:'',
                            drawLeaderDepartment:resData.drawLeaderDepartment&& resData.drawLeaderDepartment!==-1?resData.drawLeaderDepartment:'',
                            materialPartLeader:resData.materialPartLeader&& resData.materialPartLeader!==-1?resData.materialPartLeader:'',
                            materialPartLeaderDepartment:resData.materialPartLeaderDepartment&& resData.materialPartLeaderDepartment!==-1?resData.materialPartLeaderDepartment:'',
                            smallSampleLeader:resData.smallSampleLeader&& resData.smallSampleLeader!==-1?resData.smallSampleLeader:'',
                            smallSampleLeaderDepartment:resData.smallSampleLeaderDepartment&& resData.smallSampleLeaderDepartment!==-1?resData.smallSampleLeaderDepartment:'',
                            boltDeliverTime:resData.boltDeliverTime?moment(resData.boltDeliverTime):'',
                            weldingDeliverTime: resData.weldingDeliverTime?moment(resData.weldingDeliverTime):'',
                            loftingDeliverTime: resData.loftingDeliverTime?moment(resData.loftingDeliverTime):'',
                            loftingPartDeliverTime: resData.loftingPartDeliverTime?moment(resData.loftingPartDeliverTime):'',
                            materialDeliverTime:resData.materialDeliverTime?moment(resData.materialDeliverTime):'',
                            materialPartDeliverTime: resData.materialPartDeliverTime?moment(resData.materialPartDeliverTime):'',
                            smallSampleDeliverTime:resData.smallSampleDeliverTime? moment(resData.smallSampleDeliverTime):'',
                            boltDrawDeliverTime:resData.boltDrawDeliverTime? moment(resData.boltDrawDeliverTime):'',
                            weldingDrawDeliverTime:resData.weldingDrawDeliverTime? moment(resData.weldingDrawDeliverTime):'',
                        });
                        setLoad(false)
                    }} >指派</Button>
                    }} disabled={params.status!=='2'||record.materialLeaderName}>指派</Button>
                    <Button type='link' onClick={async ()=>{
                        setEdit(true);
                        setVisible(true);
                        setLoad(true)
                        const resData: any = await RequestUtil.get(`/tower-science/productCategory/${record.id}`);
                        setScheduleData(resData);
                        if(resData.materialLeaderDepartment){
                            const materialLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.materialLeaderDepartment}&size=1000`);
                            setMaterialUser(materialLeaderDepartment.records);
                        }
                        if(resData.materialPartLeaderDepartment){
                            const materialPartLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.materialPartLeaderDepartment}&size=1000`);
                            setMaterialPartUser(materialPartLeaderDepartment.records);
                        }
                        if(resData.smallSampleLeaderDepartment){
                            const smallSampleLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.smallSampleLeaderDepartment}&size=1000`);
                            setSmallSampleUser(smallSampleLeaderDepartment.records);
                        }
                        if(resData.drawLeaderDepartment){
                            const drawLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.drawLeaderDepartment}&size=1000`);
                            setDrawUser(drawLeaderDepartment.records);
                        }
                        if(resData.loftingLeaderDepartment){
                            const loftingLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.loftingLeaderDepartment}&size=1000`);
                            setLoftingUser(loftingLeaderDepartment.records);
                        }
                        if(resData.weldingLeaderDepartment){
                            const weldingLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.weldingLeaderDepartment}&size=1000`);
                            setWeldingUser(weldingLeaderDepartment.records);
                        }
                        if(resData.boltLeaderDepartment){
                            const boltLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.boltLeaderDepartment}&size=1000`);
                            setBoltUser(boltLeaderDepartment.records);
                        }
                        if(resData?.assignConfigVO?.materialWithSectionCompletionTime && resData?.materialDeliverTime){
                            const day = Number(resData.assignConfigVO.materialWithSectionCompletionTime);
                            let uom = new Date(resData.materialDeliverTime);
                            let newDate =new Date(uom.setHours(uom.getHours() + day));
                            resData.materialPartDeliverTime = newDate
                        }
                        if(resData?.assignConfigVO?.weldingCompletionTime 
                            && resData?.assignConfigVO?.loftingWithSectionCompletionTime 
                            && resData?.assignConfigVO.smallSampleCompletionTime 
                            && resData?.assignConfigVO.boltCompletionTime
                            && resData?.assignConfigVO.weldingDrawDeliverTime
                            && resData?.assignConfigVO.blotDrawDeliverTime 
                            && resData?.loftingDeliverTime){
                            const weldingCompletionTime = Number(resData.assignConfigVO.weldingCompletionTime);
                            const loftingWithSectionCompletionTime = Number(resData.assignConfigVO.loftingWithSectionCompletionTime);
                            const smallSampleCompletionTime = Number(resData.assignConfigVO.smallSampleCompletionTime);
                            const boltCompletionTime = Number(resData.assignConfigVO.boltCompletionTime);
                            const weldingDrawTime = Number(resData.assignConfigVO.weldingDrawDeliverTime);
                            const boltDrawTime = Number(resData.assignConfigVO.blotDrawDeliverTime);
                            let newWeldingCompletionTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + weldingCompletionTime));
                            let newLoftingWithSectionCompletionTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + loftingWithSectionCompletionTime));
                            let newSmallSampleCompletionTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + smallSampleCompletionTime));
                            let newBoltCompletionTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + boltCompletionTime + loftingWithSectionCompletionTime));
                            let newWeldingDrawTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + weldingCompletionTime + boltDrawTime));
                            let newBoltDrawTime =new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + boltCompletionTime + weldingDrawTime));
                            resData.weldingDeliverTime=newWeldingCompletionTime
                            resData.boltDeliverTime=newBoltCompletionTime
                            resData.smallSampleDeliverTime=newSmallSampleCompletionTime
                            resData.loftingPartDeliverTime=newLoftingWithSectionCompletionTime
                            resData.boltDrawDeliverTime=newBoltDrawTime
                            resData.weldingDrawDeliverTime=newWeldingDrawTime
                        }
                        form.setFieldsValue({
                            ...resData,
                            materialLeader:resData.materialLeader && resData.materialLeader!==-1 ?resData.materialLeader:'',
                            materialLeaderDepartment:resData.materialLeaderDepartment && resData.materialLeaderDepartment!==-1?resData.materialLeaderDepartment:'',
                            boltLeader:resData.boltLeader&& resData.boltLeader!==-1?resData.boltLeader:'',
                            boltLeaderDepartment:resData.boltLeaderDepartment&& resData.boltLeaderDepartment!==-1?resData.boltLeaderDepartment:'',
                            weldingLeader:resData.weldingLeader&& resData.weldingLeader!==-1?resData.weldingLeader:'',
                            weldingLeaderDepartment:resData.weldingLeaderDepartment&& resData.weldingLeaderDepartment!==-1?resData.weldingLeaderDepartment:'',
                            loftingLeader:resData.loftingLeader&& resData.loftingLeader!==-1?resData.loftingLeader:'',
                            loftingLeaderDepartment:resData.loftingLeaderDepartment&& resData.loftingLeaderDepartment!==-1?resData.loftingLeaderDepartment:'',
                            drawLeader:resData.drawLeader&& resData.drawLeader!==-1?resData.drawLeader:'',
                            drawLeaderDepartment:resData.drawLeaderDepartment&& resData.drawLeaderDepartment!==-1?resData.drawLeaderDepartment:'',
                            materialPartLeader:resData.materialPartLeader&& resData.materialPartLeader!==-1?resData.materialPartLeader:'',
                            materialPartLeaderDepartment:resData.materialPartLeaderDepartment&& resData.materialPartLeaderDepartment!==-1?resData.materialPartLeaderDepartment:'',
                            smallSampleLeader:resData.smallSampleLeader&& resData.smallSampleLeader!==-1?resData.smallSampleLeader:'',
                            smallSampleLeaderDepartment:resData.smallSampleLeaderDepartment&& resData.smallSampleLeaderDepartment!==-1?resData.smallSampleLeaderDepartment:'',
                            boltDeliverTime:resData.boltDeliverTime?moment(resData.boltDeliverTime):'',
                            weldingDeliverTime: resData.weldingDeliverTime?moment(resData.weldingDeliverTime):'',
                            loftingDeliverTime: resData.loftingDeliverTime?moment(resData.loftingDeliverTime):'',
                            loftingPartDeliverTime: resData.loftingPartDeliverTime?moment(resData.loftingPartDeliverTime):'',
                            materialDeliverTime:resData.materialDeliverTime?moment(resData.materialDeliverTime):'',
                            materialPartDeliverTime: resData.materialPartDeliverTime?moment(resData.materialPartDeliverTime):'',
                            smallSampleDeliverTime:resData.smallSampleDeliverTime? moment(resData.smallSampleDeliverTime):'',
                            boltDrawDeliverTime:resData.boltDrawDeliverTime? moment(resData.boltDrawDeliverTime):'',
                            weldingDrawDeliverTime:resData.weldingDrawDeliverTime? moment(resData.weldingDrawDeliverTime):'',
                        });
                        
                        setLoad(false)
                    }} disabled={!record.materialLeaderName}>详情</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => {setVisible(false); form.setFieldsValue({});setEdit(false);};
    const onDepartmentChange = async (value: Record<string, any>,title?: string) => {
        const userData: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
        switch (title) {
            case "materialLeaderDepartment":
                form.setFieldsValue({materialLeader:''});
                return setMaterialUser(userData.records);
            case "materialPartLeaderDepartment":
                form.setFieldsValue({materialPartLeader:''});
                return setMaterialPartUser(userData.records);
            case "smallSampleLeaderDepartment":
                form.setFieldsValue({smallSampleLeader:''});
                return setSmallSampleUser(userData.records);
            case "drawLeaderDepartment":
                form.setFieldsValue({drawLeader:''});
                return setDrawUser(userData.records);
            case "loftingLeaderDepartment":
                form.setFieldsValue({loftingLeader:''});
                return setLoftingUser(userData.records);
            case "weldingLeaderDepartment":
                form.setFieldsValue({weldingLeader:''});
                return setWeldingUser(userData.records);
            case "boltLeaderDepartment":
                form.setFieldsValue({boltLeader:''});
                return setBoltUser(userData.records);
        };
    }
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 24 }
    };
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }
    const renderTreeNodes = (data:any) =>
    data.map((item:any) => {
    if (item.children) {
        return (
        <TreeNode key={item.id} title={item.title} value={item.id} className={styles.node}>
            {renderTreeNodes(item.children)}
        </TreeNode>
        );
    }
    return <TreeNode {...item} key={item.id} title={item.title} value={item.id} />;
    });
    return (
        <>
            <Modal 
                title='指派信息'  
                width={1200} 
                visible={visible} 
                onCancel={handleModalCancel}
                footer={
                    edit?null:<>
                        <SchedulePlan plan={setPlanData}/>
                        <Button onClick={handleModalCancel}>取消</Button>
                        <Button type='primary' onClick={handleModalOk}>保存并提交</Button>
                    </>
                }
            >
                <Spin spinning={load}>
                <Form form={form} {...formItemLayout} initialValues={scheduleData||{}}>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="name" label="塔型" >
                                        <span>{scheduleData.name}</span>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="pattern" label="模式" rules={[{required: true,message:'请选择模式'}]}>
                                <Select style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode} disabled={edit}>
                                    { patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                        return <Select.Option key={ index } value={ id }>
                                            { name }
                                        </Select.Option>
                                    }) }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="assignName" label="指派方案"> 
                                        <Select disabled={edit} onChange={async (value)=>{
                                            setLoad(true)
                                            const resData: any = await RequestUtil.get(`/tower-science/assignPlan/planDetailById/${value}`)
                                            resData.name = form.getFieldsValue().name
                                            setScheduleData({
                                                ...scheduleData,
                                                assignPlanId: resData.id,
                                                name:form.getFieldsValue().name,
                                                materialLeader:resData.materialLeader && resData.materialLeader!==-1 ?resData.materialLeader:'',
                                                materialLeaderDepartment:resData.materialLeaderDepartment && resData.materialLeaderDepartment!==-1?resData.materialLeaderDepartment:'',
                                                boltLeader:resData.boltLeader&& resData.boltLeader!==-1?resData.boltLeader:'',
                                                boltLeaderDepartment:resData.boltLeaderDepartment&& resData.boltLeaderDepartment!==-1?resData.boltLeaderDepartment:'',
                                                weldingLeader:resData.weldingLeader&& resData.weldingLeader!==-1?resData.weldingLeader:'',
                                                weldingLeaderDepartment:resData.weldingLeaderDepartment&& resData.weldingLeaderDepartment!==-1?resData.weldingLeaderDepartment:'',
                                                loftingLeader:resData.loftingLeader&& resData.loftingLeader!==-1?resData.loftingLeader:'',
                                                loftingLeaderDepartment:resData.loftingLeaderDepartment&& resData.loftingLeaderDepartment!==-1?resData.loftingLeaderDepartment:'',
                                                drawLeader:resData.drawLeader&& resData.drawLeader!==-1?resData.drawLeader:'',
                                                drawLeaderDepartment:resData.drawLeaderDepartment&& resData.drawLeaderDepartment!==-1?resData.drawLeaderDepartment:'',
                                                materialPartLeader:resData.materialPartLeader&& resData.materialPartLeader!==-1?resData.materialPartLeader:'',
                                                materialPartLeaderDepartment:resData.materialPartLeaderDepartment&& resData.materialPartLeaderDepartment!==-1?resData.materialPartLeaderDepartment:'',
                                                smallSampleLeader:resData.smallSampleLeader&& resData.smallSampleLeader!==-1?resData.smallSampleLeader:'',
                                                smallSampleLeaderDepartment:resData.smallSampleLeaderDepartment&& resData.smallSampleLeaderDepartment!==-1?resData.smallSampleLeaderDepartment:'',
                                            });
                                            if(resData.materialLeaderDepartment){
                                                const materialLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.materialLeaderDepartment}&size=1000`);
                                                setMaterialUser(materialLeaderDepartment.records);
                                            }
                                            if(resData.materialPartLeaderDepartment){
                                                const materialPartLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.materialPartLeaderDepartment}&size=1000`);
                                                setMaterialPartUser(materialPartLeaderDepartment.records);
                                            }
                                            if(resData.smallSampleLeaderDepartment){
                                                const smallSampleLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.smallSampleLeaderDepartment}&size=1000`);
                                                setSmallSampleUser(smallSampleLeaderDepartment.records);
                                            }
                                            if(resData.drawLeaderDepartment){
                                                const drawLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.drawLeaderDepartment}&size=1000`);
                                                setDrawUser(drawLeaderDepartment.records);
                                            }
                                            if(resData.loftingLeaderDepartment){
                                                const loftingLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.loftingLeaderDepartment}&size=1000`);
                                                setLoftingUser(loftingLeaderDepartment.records);
                                            }
                                            if(resData.weldingLeaderDepartment){
                                                const weldingLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.weldingLeaderDepartment}&size=1000`);
                                                setWeldingUser(weldingLeaderDepartment.records);
                                            }
                                            if(resData.boltLeaderDepartment){
                                                const boltLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.boltLeaderDepartment}&size=1000`);
                                                setBoltUser(boltLeaderDepartment.records);
                                            }
                                            // const name = form.getFieldsValue().name;
                                            form.setFieldsValue({
                                                // name: name,
                                                assignName: resData.assignName,
                                                materialLeader:resData.materialLeader && resData.materialLeader!==-1 ?resData.materialLeader:'',
                                                materialLeaderDepartment:resData.materialLeaderDepartment && resData.materialLeaderDepartment!==-1?resData.materialLeaderDepartment:'',
                                                boltLeader:resData.boltLeader&& resData.boltLeader!==-1?resData.boltLeader:'',
                                                boltLeaderDepartment:resData.boltLeaderDepartment&& resData.boltLeaderDepartment!==-1?resData.boltLeaderDepartment:'',
                                                weldingLeader:resData.weldingLeader&& resData.weldingLeader!==-1?resData.weldingLeader:'',
                                                weldingLeaderDepartment:resData.weldingLeaderDepartment&& resData.weldingLeaderDepartment!==-1?resData.weldingLeaderDepartment:'',
                                                loftingLeader:resData.loftingLeader&& resData.loftingLeader!==-1?resData.loftingLeader:'',
                                                loftingLeaderDepartment:resData.loftingLeaderDepartment&& resData.loftingLeaderDepartment!==-1?resData.loftingLeaderDepartment:'',
                                                drawLeader:resData.drawLeader&& resData.drawLeader!==-1?resData.drawLeader:'',
                                                drawLeaderDepartment:resData.drawLeaderDepartment&& resData.drawLeaderDepartment!==-1?resData.drawLeaderDepartment:'',
                                                materialPartLeader:resData.materialPartLeader&& resData.materialPartLeader!==-1?resData.materialPartLeader:'',
                                                materialPartLeaderDepartment:resData.materialPartLeaderDepartment&& resData.materialPartLeaderDepartment!==-1?resData.materialPartLeaderDepartment:'',
                                                smallSampleLeader:resData.smallSampleLeader&& resData.smallSampleLeader!==-1?resData.smallSampleLeader:'',
                                                smallSampleLeaderDepartment:resData.smallSampleLeaderDepartment&& resData.smallSampleLeaderDepartment!==-1?resData.smallSampleLeaderDepartment:'',
                                            });
                                            setLoad(false)
                                        }}>
                                            { planData && planData.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.assignName}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="priority" label="优先级" rules={[{required: true,message:'请选择优先级'}]} > 
                                <Select disabled={edit}>
                                    <Select.Option value={0} key={0}>紧急</Select.Option>
                                    <Select.Option value={1} key={1}>高</Select.Option>
                                    <Select.Option value={2} key={2}>中</Select.Option>
                                    <Select.Option value={3} key={3}>低</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="materialLeaderDepartment" label="提料负责人" rules={[{required: true,message:'请选择提料负责人部门'}]}>
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'materialLeaderDepartment')}  }
                                            disabled={edit}>
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialLeader" label="" rules={[{required: true,message:'请选择提料负责人'}]} >
                                        <Select disabled={edit}>
                                            { materialUser && materialUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="materialDeliverTime" label="提料交付时间" rules={[{required: true,message:'请选择提料交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} format={'YYYY-MM-DD HH:mm:ss'} showTime onChange={(date: any)=>{
                                    const day = Number(scheduleData.assignConfigVO.materialWithSectionCompletionTime);
                                    let uom = new Date(date);
                                    let newDate =new Date(uom.setHours(uom.getHours() + day));
                                    form.setFieldsValue({ materialPartDeliverTime: moment(newDate) })
                                }} disabled={edit}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="materialPartLeaderDepartment" label="提料配段负责人" rules={[{required: true,message:'请选择提料配段负责人部门'}]} >
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'materialPartLeaderDepartment')}  }
                                            disabled={edit}>
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialPartLeader" label="" rules={[{required: true,message:'请选择提料配段负责人'}]} >
                                        <Select disabled={edit}>
                                            { materialPartUser && materialPartUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="materialPartDeliverTime" label="提料配段交付时间" rules={[{required: true,message:'请选择提料配段交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'} showTime />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="loftingLeaderDepartment" label="放样负责人" rules={[{required: true,message:'请选择放样负责人部门'}]}>
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'loftingLeaderDepartment')}  }
                                            disabled={edit}>
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="loftingLeader" label="" rules={[{required: true,message:'请选择放样负责人'}]} >
                                        <Select disabled={edit}>
                                            { loftingUser && loftingUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="loftingDeliverTime" label="放样交付时间" rules={[{required: true,message:'请选择放样交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} format={'YYYY-MM-DD HH:mm:ss'} showTime onChange={(date: any)=>{
                                    const weldingCompletionTime = Number(scheduleData.assignConfigVO.weldingCompletionTime);
                                    const loftingWithSectionCompletionTime = Number(scheduleData.assignConfigVO.loftingWithSectionCompletionTime);
                                    const smallSampleCompletionTime = Number(scheduleData.assignConfigVO.smallSampleCompletionTime);
                                    const boltCompletionTime = Number(scheduleData.assignConfigVO.boltCompletionTime);
                                    const weldingDrawTime = Number(scheduleData.assignConfigVO.weldingDrawDeliverTime);
                                    const boltDrawTime = Number(scheduleData.assignConfigVO.blotDrawDeliverTime);
                                    let newWeldingCompletionTime =new Date(new Date(date).setHours(new Date(date).getHours() + weldingCompletionTime));
                                    let newLoftingWithSectionCompletionTime =new Date(new Date(date).setHours(new Date(date).getHours() + loftingWithSectionCompletionTime));
                                    let newSmallSampleCompletionTime =new Date(new Date(date).setHours(new Date(date).getHours() + smallSampleCompletionTime));
                                    let newBoltCompletionTime =new Date(new Date(date).setHours(new Date(date).getHours() + boltCompletionTime + loftingWithSectionCompletionTime));
                                    let newWeldingDrawTime =new Date(new Date(date).setHours(new Date(date).getHours() + weldingCompletionTime + boltDrawTime));
                                    let newBoltDrawTime =new Date(new Date(date).setHours(new Date(date).getHours() + boltCompletionTime + weldingDrawTime));
                            
                                    form.setFieldsValue({ 
                                        weldingDeliverTime: moment(newWeldingCompletionTime),
                                        boltDeliverTime: moment(newBoltCompletionTime), 
                                        smallSampleDeliverTime: moment(newSmallSampleCompletionTime), 
                                        loftingPartDeliverTime: moment(newLoftingWithSectionCompletionTime),  
                                        boltDrawDeliverTime: moment(newBoltDrawTime),
                                        weldingDrawDeliverTime: moment(newWeldingDrawTime)
                                    })
                           
                                }} disabled={edit}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="weldingLeaderDepartment" label="编程负责人" rules={[{required: true,message:'请选择编程负责人部门'}]}>
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'weldingLeaderDepartment')}  }
                                            disabled={edit}>
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="weldingLeader" label="" rules={[{required: true,message:'请选择编程负责人'}]} >
                                        <Select disabled={edit}> 
                                            { weldingUser && weldingUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                        </Col>
                        <Col span={12}>
                            <Form.Item name="weldingDeliverTime" label="组焊计划交付时间" rules={[{required: true,message:'请选择组焊清单交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}/>
                        <Col span={12}>
                            <Form.Item name="loftingPartDeliverTime" label="配段计划交付时间" rules={[{required: true,message:'请选择配段计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="smallSampleLeaderDepartment" label="小样图负责人" rules={[{required: true,message:'请选择小样图负责人部门'}]} >
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'smallSampleLeaderDepartment')}  }
                                            disabled={edit}>
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="smallSampleLeader" label="" rules={[{required: true,message:'请选择小样图负责人'}]} >
                                        <Select disabled={edit}>
                                            { smallSampleUser && smallSampleUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="smallSampleDeliverTime" label="小样图交付时间" rules={[{required: true,message:'请选择小样图交付时间'}]}>
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="boltLeaderDepartment" label="螺栓清单负责人" rules={[{required: true,message:'请选择螺栓清单负责人部门'}]} >
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'boltLeaderDepartment')}  }
                                            disabled={edit}>
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="boltLeader" label="" rules={[{required: true,message:'请选择螺栓清单负责人'}]} >
                                        <Select disabled={edit}>
                                            { boltUser &&boltUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                        </Col>
                        <Col span={12}>
                            <Form.Item name="boltDeliverTime" label="螺栓清单交付时间" rules={[{required: true,message:'请选择螺栓清单交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="drawLeaderDepartment" label="图纸上传负责人" rules={[{required: true,message:'请选择图纸上传负责人部门'}]} >
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'drawLeaderDepartment')}  }
                                            disabled={edit}>
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="drawLeader" label="" rules={[{required: true,message:'请选择图纸上传负责人'}]} >
                                        <Select disabled={edit}>
                                            { drawUser && drawUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="weldingDrawDeliverTime" label="组装图纸计划交付时间 " rules={[{required: true,message:'请选择组装图纸计划交付时间 '}]} >
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}/>
                        <Col span={12}>
                            <Form.Item name="boltDrawDeliverTime" label="发货图纸计划交付时间 " rules={[{required: true,message:'请选择发货图纸计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                            </Form.Item>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="description" label="备注"  >
                                        <TextArea rows={1} disabled={edit} showCount maxLength={400} style={{width:'100%'}}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
                </Spin>
                {edit&&<>
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={scheduleData?.assignLogList} pagination={ false } />
                </>}
            </Modal>
            <Page
                path={ `/tower-science/productCategory/taskPage` }
                columns={ columns }
                exportPath={`/tower-science/productCategory/taskPage`}
                extraOperation={
                    <Space>
                        <Button type="ghost" onClick={ () => history.goBack() }>返回</Button>
                    </Space>
                }
                requestData={{ loftingTaskId: params.id }}
                onFilterSubmit={ onFilterSubmit }
                refresh={ refresh }
                filterValue={ filterValue }
                searchFormItems={[
                    {
                        name: 'pattern',
                        label: '模式',
                        children:   <Select style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                            { patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={ index } value={ id }>
                                    { name }
                                </Select.Option>
                            }) }
                        </Select>
                    },
                    {
                        name: 'priority',
                        label:'优先级',
                        children:   <Select style={{width:"100px"}}>
                                        <Select.Option value={''} key ={''}>全部</Select.Option>
                                        <Select.Option value='0' key='0'>紧急</Select.Option>
                                        <Select.Option value='1' key='1'>高</Select.Option>
                                        <Select.Option value='2' key='2'>中</Select.Option>
                                        <Select.Option value='3' key='3'>低</Select.Option>
                                    </Select>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入塔型/钢印塔型进行查询" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}