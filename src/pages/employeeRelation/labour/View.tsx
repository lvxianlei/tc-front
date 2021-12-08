import React from 'react'
import { Button, Spin, Space} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, BaseInfo, Attachment } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { baseInfoData } from './labour.json';
import RequestUtil from '../../../utils/RequestUtil';


export default function View(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-hr/labor/contract/detail`,{contractId: params.id})
        data.newDepartmentName = data.departmentName+'/'+data.teamName
        resole(data)
    }), {})
    const detailData: any = data;
    const tableColumns = [
        { title: '合同编号', dataIndex: 'contractNumber', key: 'contractNumber' },
        { title: '合同公司', dataIndex: 'signedCompany', key: 'signedCompany' },
        { title: '合同类型', dataIndex: 'contractType', key: 'contractType', 
            render: (contractType: number): React.ReactNode => {
                switch (contractType) {
                    case 0:
                        return '固定期限劳动合同';
                    case 1:
                        return '无固定期限劳动合同';
                    case 2:
                        return '超龄返聘合同';
                    case 3:
                        return '实习合同';
                    case 4:
                        return '其他合同';
                }
            } 
        },
        { title: '合同开始时间', dataIndex: 'contractStartDate', key: 'contractStartDate' },
        { title: '合同结束时间', dataIndex: 'contractEndDate', key: 'contractEndDate'},
        { title: '操作', dataIndex: 'operation', key: 'operation',render: (_: any, record: any, index: number): React.ReactNode => (
            <Button type='link' onClick={()=>{
                history.push(`/employeeRelation/labour/view/${params.id}/${record.id}`)
            }}>详情</Button>) 
        }
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <DetailTitle title="员工劳务合同"/>
            <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
            <Attachment dataSource={detailData?.fileVos}/>
            <DetailTitle title="劳动合同记录" />
            <CommonTable columns={tableColumns} dataSource={detailData?.statusRecordList} pagination={ false } />
            </DetailContent>
        </Spin>
    </>
}