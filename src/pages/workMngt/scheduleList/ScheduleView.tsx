import React, { useState } from 'react'
import { Space, Input, Button, Form, Modal, Row, Col, Select, DatePicker, TreeSelect, Spin, message } from 'antd'
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
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [scheduleData, setScheduleData] = useState<any|undefined>({});
    const history = useHistory();
    const [form] = Form.useForm();
    // const [department, setDepartment] = useState<any|undefined>([]);
    const [user, setUser] = useState<any|undefined>([]);
    const [planData, setPlanData] = useState<any|undefined>([]);
    const params = useParams<{ id: string, status: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const departmentData: any = await RequestUtil.get(`/tower-system/department`);
        // setDepartment(departmentData);
        const userData: any = await RequestUtil.get(`/tower-system/employee?current=1&size=1000&deptName=技术部`);
        setUser(userData?.records);
        const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
        setPlanData(planData);
        resole(data)
    }), {})
    
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
        console.log(selectedRows)
    }
    const handleModalOk = async () => {
        try {
            await form.validateFields();
            const saveData = await form.getFieldsValue(true);
            saveData.id = scheduleData.id;
            saveData.assignPlanId = scheduleData.assignPlanId;
            saveData.idList = selectedKeys.length>0?selectedKeys:[scheduleData.productCategoryId];
            saveData.boltDeliverTime= moment(saveData.boltDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.weldingDeliverTime= moment(saveData.weldingDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.loftingDeliverTime= moment(saveData.loftingDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.loftingPartDeliverTime= moment(saveData.loftingPartDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.programmingDeliverTime= moment(saveData.programmingDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.smallSampleDeliverTime= moment(saveData.smallSampleDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.deliveryDrawDeliverTime= moment(saveData.deliveryDrawDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.drawDeliverTime= moment(saveData.drawDeliverTime).format('YYYY-MM-DD HH:mm:ss');
           

            if( saveData.loftingUser&&Array.isArray(saveData.loftingMutualReview)&&saveData.loftingMutualReview.length>0){
                let user:any = []
                if(saveData.loftingMutualReview.indexOf('0')>-1){
                    saveData.loftingMutualReview.splice(saveData.loftingMutualReview.indexOf('0'),1)
                    console.log(saveData.loftingMutualReview)
                    console.log(saveData.loftingUser)
                    user = saveData.loftingMutualReview.length>0?saveData.loftingMutualReview.concat(saveData.loftingUser):saveData.loftingUser
                    saveData.loftingMutualReview = Array.from(new Set(user))
                    console.log(Array.from(new Set(user)))
                }
            }else{
                saveData.loftingMutualReview='';
            }
            if(saveData.loftingMutualReview&&Array.isArray(saveData.loftingMutualReview)&&Array.isArray(saveData.weldingUser)&&saveData.weldingUser.length>0){
                let user:any = []
                if(saveData.weldingUser.indexOf('0')>-1){
                    saveData.weldingUser.splice(saveData.weldingUser.indexOf('0'),1)
                    user = saveData.loftingMutualReview.length>0?saveData.loftingMutualReview.concat(saveData.weldingUser):saveData.weldingUser
                    saveData.weldingUser = Array.from(new Set(user))
                   
                }
            }else{
                saveData.weldingUser='';
            }
            saveData.loftingMutualReview = saveData.loftingMutualReview.join(',')
            saveData.weldingUser=saveData.weldingUser.join(',')
            saveData.loftingUser= Array.isArray(saveData.loftingUser)&&saveData.loftingUser.length>0?saveData.loftingUser.join(','):'';
            console.log(saveData.loftingMutualReview)
           
            // saveData.loftingMutualReview= Array.isArray(saveData.loftingMutualReview)&&saveData.loftingMutualReview.length>0?saveData.loftingMutualReview.join(','):'';
            // saveData.weldingUser= Array.isArray(saveData.weldingUser)&&saveData.weldingUser.length>0?saveData.weldingUser.join(','):'';
            
            saveData.ncUser = saveData?.ncUser.indexOf('0')>-1?saveData?.programmingLeader:saveData?.ncUser;
            saveData.productPartUser = saveData?.productPartUser.indexOf('0')>-1?saveData?.ncUser:saveData?.productPartUser;
            saveData.packageUser = saveData?.packageUser.indexOf('0')>-1?saveData?.productPartUser:saveData?.packageUser;
           
            saveData.boltPlanCheckUser = saveData?.ncUser.indexOf('0')>-1?saveData?.boltLeader:saveData?.boltPlanCheckUser;
            saveData.boltCheckUser = saveData?.boltCheckUser.indexOf('0')>-1?saveData?.boltPlanCheckUser:saveData?.boltCheckUser;
            saveData.boltUser = saveData?.boltUser.indexOf('0')>-1?saveData?.productPartUser:saveData?.boltUser;

            saveData.deliveryDrawLeader = saveData?.deliveryDrawLeader.indexOf('0')>-1?saveData?.drawLeader:saveData?.deliveryDrawLeader;
  
           
            await RequestUtil.post('/tower-science/productCategory/assign', saveData).then(()=>{

                setVisible(false);
                message.success('指派成功！')
                form.resetFields([
                    'pattern',
                    'boltCheckUser',
                    // 'boltDeliverTime',
                    'boltLeader',
                    'boltPlanCheckUser',
                    'boltUser',
                    // 'deliveryDrawDeliverTime',
                    'deliveryDrawLeader',
                    // 'drawDeliverTime',
                    'drawLeader',
                    'hangLineBoardCheckUser',
                    'legConfigurationCheckUser',
                    'legConfigurationUser',
                    'legProgrammingUser',
                    // 'loftingDeliverTime',
                    'loftingLeader',
                    'loftingMutualReview',
                    'loftingUser',
                    'ncUser',
                    'packageUser',
                    'productPartUser',
                    // 'programmingDeliverTime',
                    'programmingLeader',
                    // 'smallSampleDeliverTime',
                    'weldingUser',
                    'smallSampleLeader',
                    'description'
                ]);
                form.setFieldsValue({
                    boltDeliverTime:'',
                    deliveryDrawDeliverTime:'',
                    drawDeliverTime:'',
                    loftingDeliverTime: '',
                    programmingDeliverTime:'',
                    loftingPartDeliverTime: '',
                    smallSampleDeliverTime:'',
                });
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
        // {
        //     key: 'materialLeaderName',
        //     title: '提料负责人',
        //     width: 200,
        //     dataIndex: 'materialLeaderName'
        // },
        // {
        //     key: 'materialPartLeaderName',
        //     title: '提料配段负责人',
        //     width: 100,
        //     dataIndex: 'materialPartLeaderName'
        // },
        {
            key: 'loftingLeaderName',
            title: '放样负责人',
            width: 100,
            dataIndex: 'loftingLeaderName'
        },
        {
            key: 'loftingUserName',
            title: '放样员',
            width: 100,
            dataIndex: 'loftingUserName'
        },
        {
            key: 'legConfigurationUserName',
            title: '放样高低腿配置编制',
            width: 130,
            dataIndex: 'legConfigurationUserName'
        },
        {
            key: 'legConfigurationCheckUserName',
            title: '放样高低腿配置校核',
            width: 130,
            dataIndex: 'legConfigurationCheckUserName'
        },
        {
            key: 'hangLineBoardCheckUserName',
            title: '放样挂线板校核',
            width: 100,
            dataIndex: 'hangLineBoardCheckUserName'
        },
        {
            key: 'loftingMutualReviewName',
            title: '审图校卡',
            width: 100,
            dataIndex: 'loftingMutualReviewName'
        },
        {
            key: 'programmingLeaderName',
            title: '校核人',
            width: 100,
            dataIndex: 'programmingLeaderName'
        },
        // {
        //     key: 'weldingLeaderName',
        //     title: '编程负责人',
        //     width: 100,
        //     dataIndex: 'weldingLeaderName'
        // },
        {
            key: 'smallSampleLeaderName',
            title: '小样图上传',
            width: 100,
            dataIndex: 'smallSampleLeaderName'
        },
        {
            key: 'boltUserName',
            title: '螺栓清单',
            width: 100,
            dataIndex: 'boltUserName'
        },
        {
            key: 'boltCheckUserName',
            title: '螺栓清单校核',
            width: 100,
            dataIndex: 'boltCheckUserName'
        },
        {
            key: 'boltLeaderName',
            title: '螺栓计划',
            width: 100,
            dataIndex: 'boltLeaderName'
        },
        {
            key: 'boltPlanCheckUserName',
            title: '螺栓计划校核',
            width: 100,
            dataIndex: 'boltPlanCheckUserName'
        },
        {
            key: 'weldingUserName',
            title: '组焊清单',
            width: 100,
            dataIndex: 'weldingUserName'
        },
        {
            key: 'productPartUserName',
            title: '杆塔配段',
            width: 100,
            dataIndex: 'productPartUserName'
        },
        {
            key: 'ncUserName',
            title: 'NC程序',
            width: 100,
            dataIndex: 'ncUserName'
        },
        {
            key: 'packageUserName',
            title: '包装清单',
            width: 100,
            dataIndex: 'packageUserName'
        },
        {
            key: 'deliveryDrawLeaderName',
            title: '发货图纸',
            width: 100,
            dataIndex: 'deliveryDrawLeaderName'
        },
        {
            key: 'drawLeaderName',
            title: '组装图纸',
            width: 100,
            dataIndex: 'drawLeaderName'
        },
        {
            key: 'legProgrammingUserName',
            title: '编程高低腿',
            width: 100,
            dataIndex: 'legProgrammingUserName'
        },
        {
            key: 'programmingLeaderName',
            title: '生产下达',
            width: 100,
            dataIndex: 'programmingLeaderName'
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
                  
                        // // if(resData?.assignConfigVO?.materialWithSectionCompletionTime && resData?.materialDeliverTime){
                        // //     const day = Number(resData.assignConfigVO.materialWithSectionCompletionTime);
                        // //     let uom = new Date(resData.materialDeliverTime);
                        // //     let newDate =new Date(uom.setHours(uom.getHours() + day));
                        // //     resData.materialPartDeliverTime = newDate
                        // // }
                        if(resData?.assignConfigVO?.weldingCompletionTime 
                            && resData?.assignConfigVO?.loftingWithSectionCompletionTime 
                            && resData?.assignConfigVO.smallSampleCompletionTime 
                            && resData?.assignConfigVO.boltCompletionTime
                            && resData?.assignConfigVO.drawDeliverTime
                            && resData?.assignConfigVO.blotDrawDeliverTime 
                            && resData?.loftingDeliverTime){
                                
                            const weldingCompletionTime = Number(resData.assignConfigVO.weldingCompletionTime);
                            const loftingWithSectionCompletionTime = Number(resData.assignConfigVO.loftingWithSectionCompletionTime);
                            const smallSampleCompletionTime = Number(resData.assignConfigVO.smallSampleCompletionTime);
                            const boltCompletionTime = Number(resData.assignConfigVO.boltCompletionTime);
                            const weldingDrawTime = Number(scheduleData.assignConfigVO.blotDrawDeliverTime);
                            const boltDrawTime = Number(scheduleData.assignConfigVO.weldingDrawDeliverTime);
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
                            resData.deliveryDrawDeliverTime=newBoltDrawTime
                            resData.drawDeliverTime=newWeldingDrawTime
                        }
                        form.setFieldsValue({
                            ...resData,
                            boltLeader:resData.boltLeader&& resData.boltLeader!==-1?resData.boltLeader:'',
                            weldingLeader:resData.weldingLeader&& resData.weldingLeader!==-1?resData.weldingLeader:'',
                            loftingLeader:resData.loftingLeader&& resData.loftingLeader!==-1?resData.loftingLeader:'',
                            drawLeader:resData.drawLeader&& resData.drawLeader!==-1?resData.drawLeader:'',
                            loftingUser: resData.loftingUser&&resData.loftingUser!==null ? resData.loftingUser.indexOf(',')>-1?resData.loftingUser.split(','):[resData.loftingUser]:[],
                            loftingMutualReview: resData.loftingMutualReview&&resData.loftingMutualReview!==null ? resData.loftingMutualReview.indexOf(',')>-1?resData.loftingMutualReview.split(','):[resData.loftingMutualReview]:['0'],
                            weldingUser: resData.weldingUser&&resData.weldingUser!==null ? resData.weldingUser.indexOf(',')>-1?resData.weldingUser.split(','):[resData.weldingUser]:['0'],
                            smallSampleLeader:resData.smallSampleLeader&& resData.smallSampleLeader!==-1?resData.smallSampleLeader:'',
                            ncUser:resData.ncUser?resData.ncUser:'0',
                            packageUser:resData.packageUser?resData.packageUser:'0',
                            productPartUser:resData.productPartUser?resData.productPartUser:'0',
                            boltCheckUser:resData.boltCheckUser?resData.boltCheckUser:'0',
                            boltPlanCheckUser:resData.boltPlanCheckUser?resData.boltPlanCheckUser:'0',
                            boltUser:resData.boltUser?resData.boltUser:'0',
                            deliveryDrawLeader:resData.deliveryDrawLeader?resData.deliveryDrawLeader:'0',
                           
                            boltDeliverTime:resData.boltDeliverTime?moment(resData.boltDeliverTime):'',
                            weldingDeliverTime: resData.weldingDeliverTime?moment(resData.weldingDeliverTime):'',
                            loftingDeliverTime: resData.loftingDeliverTime?moment(resData.loftingDeliverTime):'',
                            loftingPartDeliverTime: resData.loftingPartDeliverTime?moment(resData.loftingPartDeliverTime):'',
                            programmingDeliverTime: resData.programmingDeliverTime?moment(resData.programmingDeliverTime):'',
                            smallSampleDeliverTime:resData.smallSampleDeliverTime? moment(resData.smallSampleDeliverTime):'',
                            deliveryDrawDeliverTime:resData.deliveryDrawDeliverTime? moment(resData.deliveryDrawDeliverTime):'',
                            drawDeliverTime:resData.drawDeliverTime? moment(resData.drawDeliverTime):'',
                        });
                        setLoad(false)
                    }} disabled={record.loftingStatus===5&&record.boltStatus===4&&record.weldingStatus===4&&record.smallSampleStatus===2&&record.templateLoftingStatus===2}>指派</Button>
                    <Button type='link' onClick={async ()=>{
                        setEdit(true);
                        setVisible(true);
                        setLoad(true)
                        const resData: any = await RequestUtil.get(`/tower-science/productCategory/${record.id}`);
                        setScheduleData(resData);
                     
                        // if(resData?.assignConfigVO?.materialWithSectionCompletionTime && resData?.materialDeliverTime){
                        //     const day = Number(resData.assignConfigVO.materialWithSectionCompletionTime);
                        //     let uom = new Date(resData.materialDeliverTime);
                        //     let newDate =new Date(uom.setHours(uom.getHours() + day));
                        //     resData.materialPartDeliverTime = newDate
                        // }
                        if(resData?.assignConfigVO?.weldingCompletionTime 
                            && resData?.assignConfigVO?.loftingWithSectionCompletionTime 
                            && resData?.assignConfigVO.smallSampleCompletionTime 
                            && resData?.assignConfigVO.boltCompletionTime
                            && resData?.assignConfigVO.drawDeliverTime
                            && resData?.assignConfigVO.blotDrawDeliverTime 
                            && resData?.loftingDeliverTime){
                            const weldingCompletionTime = Number(resData.assignConfigVO.weldingCompletionTime);
                            const loftingWithSectionCompletionTime = Number(resData.assignConfigVO.loftingWithSectionCompletionTime);
                            const smallSampleCompletionTime = Number(resData.assignConfigVO.smallSampleCompletionTime);
                            const boltCompletionTime = Number(resData.assignConfigVO.boltCompletionTime);
                            const weldingDrawTime = Number(resData.assignConfigVO.drawDeliverTime);
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
                            resData.deliveryDrawDeliverTime=newBoltDrawTime
                            resData.drawDeliverTime=newWeldingDrawTime
                        }
                        form.setFieldsValue({
                            ...resData,
                            // materialLeader:resData.materialLeader && resData.materialLeader!==-1 ?resData.materialLeader:'',
                            // materialLeaderDepartment:resData.materialLeaderDepartment && resData.materialLeaderDepartment!==-1?resData.materialLeaderDepartment:'',
                            boltLeader:resData.boltLeader&& resData.boltLeader!==-1?resData.boltLeader:'',
                            boltLeaderDepartment:resData.boltLeaderDepartment&& resData.boltLeaderDepartment!==-1?resData.boltLeaderDepartment:'',
                            weldingLeader:resData.weldingLeader&& resData.weldingLeader!==-1?resData.weldingLeader:'',
                            weldingLeaderDepartment:resData.weldingLeaderDepartment&& resData.weldingLeaderDepartment!==-1?resData.weldingLeaderDepartment:'',
                            loftingLeader:resData.loftingLeader&& resData.loftingLeader!==-1?resData.loftingLeader:'',
                            loftingLeaderDepartment:resData.loftingLeaderDepartment&& resData.loftingLeaderDepartment!==-1?resData.loftingLeaderDepartment:'',
                            drawLeader:resData.drawLeader&& resData.drawLeader!==-1?resData.drawLeader:'',
                            drawLeaderDepartment:resData.drawLeaderDepartment&& resData.drawLeaderDepartment!==-1?resData.drawLeaderDepartment:'',
                            // materialPartLeader:resData.materialPartLeader&& resData.materialPartLeader!==-1?resData.materialPartLeader:'',
                            // materialPartLeaderDepartment:resData.materialPartLeaderDepartment&& resData.materialPartLeaderDepartment!==-1?resData.materialPartLeaderDepartment:'',
                            smallSampleLeader:resData.smallSampleLeader&& resData.smallSampleLeader!==-1?resData.smallSampleLeader:'',
                            smallSampleLeaderDepartment:resData.smallSampleLeaderDepartment&& resData.smallSampleLeaderDepartment!==-1?resData.smallSampleLeaderDepartment:'',
                            boltDeliverTime:resData.boltDeliverTime?moment(resData.boltDeliverTime):'',
                            weldingDeliverTime: resData.weldingDeliverTime?moment(resData.weldingDeliverTime):'',
                            loftingDeliverTime: resData.loftingDeliverTime?moment(resData.loftingDeliverTime):'',
                            loftingPartDeliverTime: resData.loftingPartDeliverTime?moment(resData.loftingPartDeliverTime):'',
                            // materialDeliverTime:resData.materialDeliverTime?moment(resData.materialDeliverTime):'',
                            // materialPartDeliverTime: resData.materialPartDeliverTime?moment(resData.materialPartDeliverTime):'',
                            programmingDeliverTime: resData.programmingDeliverTime?moment(resData.programmingDeliverTime):'',
                            smallSampleDeliverTime:resData.smallSampleDeliverTime? moment(resData.smallSampleDeliverTime):'',
                            deliveryDrawDeliverTime:resData.deliveryDrawDeliverTime? moment(resData.deliveryDrawDeliverTime):'',
                            drawDeliverTime:resData.drawDeliverTime? moment(resData.drawDeliverTime):'',
                        });
                        
                        setLoad(false)
                    }} disabled={!record.loftingLeaderName}>详情</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => {setVisible(false);setEdit(false);form.resetFields([
            'pattern',
            'boltCheckUser',
            'boltLeader',
            'boltPlanCheckUser',
            'boltUser',
            'deliveryDrawLeader',
            'drawLeader',
            'hangLineBoardCheckUser',
            'legConfigurationCheckUser',
            'legConfigurationUser',
            'legProgrammingUser',
            'loftingLeader',
            'loftingMutualReview',
            'loftingUser',
            'ncUser',
            'packageUser',
            'productPartUser',
            'programmingLeader',
            'smallSampleLeader',
            'description'
        ]);
        form.setFieldsValue({
            boltDeliverTime:'',
            deliveryDrawDeliverTime:'',
            drawDeliverTime:'',
            loftingDeliverTime: '',
            programmingDeliverTime:'',
            loftingPartDeliverTime: '',
            smallSampleDeliverTime:'',
        });
    };
    
    const formItemLayout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 24 }
    };
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    
  
    return (
        <>
            <Modal 
                title='指派信息'  
                width={'90%'} 
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
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="name" label="塔型" >
                                        <span>{scheduleData.name}</span>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
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
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="priority" label="优先级" rules={[{required: true,message:'请选择优先级'}]} > 
                                        <Select disabled={edit}>
                                            <Select.Option value={1} key={1}>紧急</Select.Option>
                                            <Select.Option value={2} key={2}>高</Select.Option>
                                            <Select.Option value={3} key={3}>中</Select.Option>
                                            <Select.Option value={4} key={4}>低</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="assignName" label="指派方案"> 
                                        <Select disabled={edit} allowClear  onClear={()=>{
                                            console.log('-------clear-scheduleView-plan-------')
                                        }} onChange={async (value)=>{
                                            if(value){

                                                setLoad(true)
                                                const resData: any = await RequestUtil.get(`/tower-science/assignPlan/planDetailById/${value}`)
                                                resData.name = form.getFieldsValue(true).name
                                                setScheduleData({
                                                    ...scheduleData,
                                                    // assignPlanId: resData.id,
                                                    ...resData,
                                                    name:form.getFieldsValue().name,
                                                });
                                                form.setFieldsValue({
                                                    ...resData
                                                });
                                                setLoad(false)
                                            }
                                        }}>
                                            { planData && planData.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.assignName}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="loftingLeader" label="放样负责人" rules={[{required: true,message:'请选择放样负责人'}]} >
                                        <Select disabled={edit||scheduleData?.loftingStatus===5}>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="loftingDeliverTime" label="" rules={[{required: true,message:'请选择放样交付时间'}]} >
                                        <DatePicker  style={{width:'100%'}} format={'YYYY-MM-DD HH:mm:ss'} showTime onChange={(date: any)=>{
                                            const weldingCompletionTime = Number(scheduleData.assignConfigVO.weldingCompletionTime);
                                            const loftingWithSectionCompletionTime = Number(scheduleData.assignConfigVO.loftingWithSectionCompletionTime);
                                            const smallSampleCompletionTime = Number(scheduleData.assignConfigVO.smallSampleCompletionTime);
                                            const boltCompletionTime = Number(scheduleData.assignConfigVO.boltCompletionTime);
                                            const weldingDrawTime = Number(scheduleData.assignConfigVO.blotDrawDeliverTime);
                                            const boltDrawTime = Number(scheduleData.assignConfigVO.weldingDrawDeliverTime);
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
                                                deliveryDrawDeliverTime: moment(newBoltDrawTime),
                                                drawDeliverTime: moment(newWeldingDrawTime)
                                            })
                                
                                        }} disabled={edit||scheduleData?.loftingStatus===5}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="programmingLeader" label="编程负责人" rules={[{required: true,message:'请选择编程负责人'}]} >
                                        <Select disabled={edit||scheduleData?.weldingStatus===4}> 
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="programmingDeliverTime" label="" rules={[{required: true,message:'请选择编程时间'}]} >
                                        <DatePicker disabled={edit||scheduleData?.weldingStatus===4}  style={{width:'100%'}} showTime  format={'YYYY-MM-DD HH:mm:ss'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="boltLeader" label="螺栓清单负责人" rules={[{required: true,message:'请选择螺栓清单负责人'}]} >
                                        <Select disabled={edit||scheduleData?.boltStatus===4}>
                                            { user &&user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="boltDeliverTime" label="" rules={[{required: true,message:'请选择螺栓清单交付时间'}]} >
                                        <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="drawLeader" label="图纸负责人" rules={[{required: true,message:'请选择图纸负责人'}]} >
                                        <Select disabled={edit||scheduleData?.templateLoftingStatus===2}>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="drawDeliverTime" label="" rules={[{required: true,message:'请选择组装图纸计划交付时间 '}]} >
                                        <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="loftingUser" label="放样员"> 
                                        <Select disabled={edit||scheduleData?.smallSampleStatus===2} mode='multiple' allowClear>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="ncUser" label="NC程序"> 
                                        <Select disabled={edit||scheduleData?.loftingStatus===5} allowClear>
                                            <Select.Option key={'0'} value={'0'}>同上</Select.Option>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="boltPlanCheckUser" label="螺栓计划校核"> 
                                        <Select disabled={edit||scheduleData?.boltStatus===4} allowClear>
                                            <Select.Option key={'0'} value={'0'}>同上</Select.Option>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="deliveryDrawLeader" label="发货图纸" rules={[{required: true,message:'请选择发货图纸负责人'}]}> 
                                        <Select disabled={edit||scheduleData?.smallSampleStatus===2}>
                                            <Select.Option key={'0'} value={'0'}>同上</Select.Option>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="deliveryDrawDeliverTime" label="" rules={[{required: true,message:'请选择发货图纸计划交付时间'}]} >
                                        <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="loftingMutualReview" label="审图校卡"> 
                                        <Select disabled={edit||scheduleData?.smallSampleStatus===2} mode='multiple' allowClear>
                                            <Select.Option key={'0'} value={'0'}>同上</Select.Option>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="productPartUser" label="杆塔配段"> 
                                        <Select disabled={edit||scheduleData?.smallSampleStatus===2} allowClear>
                                            <Select.Option key={'0'} value={'0'}>同上</Select.Option>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="boltUser" label="螺栓清单"> 
                                        <Select disabled={edit||scheduleData?.boltStatus===4} allowClear>
                                            <Select.Option key={'0'} value={'0'}>同上</Select.Option>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="smallSampleLeader" label="小样图上传" rules={[{required: true,message:'请选择小样图负责人'}]} >
                                        <Select disabled={edit||scheduleData?.smallSampleStatus===2}>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="smallSampleDeliverTime" label="" rules={[{required: true,message:'请选择小样图交付时间'}]}>
                                        <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="weldingUser" label="组焊清单"> 
                                        <Select disabled={edit||scheduleData?.weldingStatus===4} mode='multiple' allowClear>
                                            <Select.Option key={'0'} value={'0'}>同上</Select.Option>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="packageUser" label="包装清单"> 
                                        <Select disabled={edit||scheduleData?.smallSampleStatus===2} allowClear>
                                            <Select.Option key={'0'} value={'0'}>同上</Select.Option>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="boltCheckUser" label="螺栓清单校核"> 
                                        <Select disabled={edit||scheduleData?.smallSampleStatus===2} allowClear>
                                            <Select.Option key={'0'} value={'0'}>同上</Select.Option>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="description" label="备注"  >
                                        <TextArea rows={1} disabled={edit} showCount maxLength={400} style={{width:'100%'}}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="legConfigurationUser" label="高低腿配置编制"> 
                                        <Select disabled={edit||scheduleData?.smallSampleStatus===2} allowClear>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="legProgrammingUser" label="编程高低腿"> 
                                        <Select disabled={edit||scheduleData?.smallSampleStatus===2} allowClear>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}/>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="legConfigurationCheckUser" label="高低腿配置校核"> 
                                        <Select disabled={edit||scheduleData?.smallSampleStatus===2} allowClear>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={18}/>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="hangLineBoardCheckUser" label="挂线板校核"> 
                                        <Select disabled={edit||scheduleData?.smallSampleStatus===2} allowClear>
                                            { user && user.map((item:any)=>{
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={18}/>
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
                        <Button type="primary" ghost onClick={ async () => {
                            setVisible(true);
                            setLoad(true)
                            const resData: any = await RequestUtil.get(`/tower-science/productCategory/${selectedKeys.join(',')}`);
                            setScheduleData(resData);
                            if(resData?.assignConfigVO?.weldingCompletionTime 
                                && resData?.assignConfigVO?.loftingWithSectionCompletionTime 
                                && resData?.assignConfigVO.smallSampleCompletionTime 
                                && resData?.assignConfigVO.boltCompletionTime
                                && resData?.assignConfigVO.drawDeliverTime
                                && resData?.assignConfigVO.blotDrawDeliverTime 
                                && resData?.loftingDeliverTime){
                                    
                                const weldingCompletionTime = Number(resData.assignConfigVO.weldingCompletionTime);
                                const loftingWithSectionCompletionTime = Number(resData.assignConfigVO.loftingWithSectionCompletionTime);
                                const smallSampleCompletionTime = Number(resData.assignConfigVO.smallSampleCompletionTime);
                                const boltCompletionTime = Number(resData.assignConfigVO.boltCompletionTime);
                                const weldingDrawTime = Number(scheduleData.assignConfigVO.blotDrawDeliverTime);
                                const boltDrawTime = Number(scheduleData.assignConfigVO.weldingDrawDeliverTime);
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
                                resData.deliveryDrawDeliverTime=newBoltDrawTime
                                resData.drawDeliverTime=newWeldingDrawTime
                            }
                            form.setFieldsValue({
                                ...resData,
                                boltLeader:resData.boltLeader&& resData.boltLeader!==-1?resData.boltLeader:'',
                                weldingLeader:resData.weldingLeader&& resData.weldingLeader!==-1?resData.weldingLeader:'',
                                loftingLeader:resData.loftingLeader&& resData.loftingLeader!==-1?resData.loftingLeader:'',
                                drawLeader:resData.drawLeader&& resData.drawLeader!==-1?resData.drawLeader:'',
                                loftingMutualReview: resData.loftingMutualReview&&resData.loftingMutualReview!==null ? resData.loftingMutualReview.indexOf(',')>-1?resData.loftingMutualReview.split(','):[resData.loftingMutualReview]:[],
                                loftingUser: resData.loftingUser&&resData.loftingUser!==null ? resData.loftingUser.indexOf(',')>-1?resData.loftingUser.split(','):[resData.loftingUser]:[],
                                weldingUser: resData.weldingUser&&resData.weldingUser!==null ? resData.weldingUser.indexOf(',')>-1?resData.weldingUser.split(','):[resData.weldingUser]:[],
                                smallSampleLeader:resData.smallSampleLeader&& resData.smallSampleLeader!==-1?resData.smallSampleLeader:'',
                                boltDeliverTime:resData.boltDeliverTime?moment(resData.boltDeliverTime):'',
                                weldingDeliverTime: resData.weldingDeliverTime?moment(resData.weldingDeliverTime):'',
                                loftingDeliverTime: resData.loftingDeliverTime?moment(resData.loftingDeliverTime):'',
                                loftingPartDeliverTime: resData.loftingPartDeliverTime?moment(resData.loftingPartDeliverTime):'',
                                programmingDeliverTime: resData.programmingDeliverTime?moment(resData.programmingDeliverTime):'',
                                smallSampleDeliverTime:resData.smallSampleDeliverTime? moment(resData.smallSampleDeliverTime):'',
                                deliveryDrawDeliverTime:resData.deliveryDrawDeliverTime? moment(resData.deliveryDrawDeliverTime):'',
                                drawDeliverTime:resData.drawDeliverTime? moment(resData.drawDeliverTime):'',
                            });
                            setLoad(false)
                        } } disabled={!(selectedKeys.length>0)}>批量指派</Button>
                        <Button type="ghost" onClick={ () => history.goBack() }>返回</Button>
                    </Space>
                }
                requestData={{ loftingTaskId: params.id }}
                onFilterSubmit={ onFilterSubmit }
                refresh={ refresh }
                tableProps={{
                    rowSelection: {
                        type: "checkbox",
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange,
                    }
                }}
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
                                        <Select.Option value='1' key='1'>紧急</Select.Option>
                                        <Select.Option value='2' key='2'>高</Select.Option>
                                        <Select.Option value='3' key='3'>中</Select.Option>
                                        <Select.Option value='4' key='4'>低</Select.Option>
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