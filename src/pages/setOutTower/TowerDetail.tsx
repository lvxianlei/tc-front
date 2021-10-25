import React, { useState } from 'react'
import { Button, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../common';
import { baseInfoData } from './setOut.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import Modal from 'antd/lib/modal/Modal';

const componentColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '段号', dataIndex: 'partName', key: 'partName', },
    { title: '构件编号', dataIndex: 'code', key: 'code' },
    { title: '材料', dataIndex: 'materialName', key: 'materialName' },
    { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture' },
    { title: '规格', dataIndex: 'specName', key: 'specName', render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
    { title: '宽度（mm）', dataIndex: 'width', key: 'width', render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
    { title: '厚度（mm）', dataIndex: 'thickness', key: 'thickness',render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
    { title: '长度（mm）', dataIndex: 'length', key: 'length' ,render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
    { title: '单件理算重量（kg）', dataIndex: 'basicsPartWeight', key: 'basicsPartWeight' ,render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
    { title: '单件图纸重量（kg）', dataIndex: 'drawBasicsWeight', key: 'drawBasicsWeight' ,render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
    { title: '单段数量', dataIndex: 'basicsPartNum', key: 'basicsPartNum', render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
    { title: '单段理算重量（kg）', dataIndex: 'basicsPartWeight', key: 'basicsPartWeight', render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
    { title: '单段图纸重量（kg）', dataIndex: 'drawPartWeight', key: 'drawPartWeight' , render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
    { title: '备注', dataIndex: 'description', key: 'description' },
]
export default function TowerDetail(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false);
    const params = useParams<{ id: string }>();
    const [tableData, setTableData] = useState([]);
    const [tableDataTop, setTableDataTop] = useState({
        singleNumberCount:'',
        singleCount:'',
        singleWeight:''
    });
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/productCategory/getLoftingDetail?productCategoryId=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '段号', dataIndex: 'name', key: 'name', },
        { title: '单段件号数', dataIndex: 'singleNumberCount', key: 'singleNumberCount' , render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
        { title: '单段件数', dataIndex: 'singleCount', key: 'singleCount' , render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
        { title: '单段重量（kg）', dataIndex: 'singleWeight', key: 'singleWeight', render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
        { title: '备注', dataIndex: 'description', key: 'description' },
        { 
            key: 'operation', 
            title: '操作', 
            dataIndex: 'operation', 
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={async ()=>{
                        const data:any = await RequestUtil.get(`/tower-science/productStructure/getSegmentDetailList`,{
                            segmentId: record.id,
                            productCategoryId: params.id
                        })
                        setTableDataTop({
                            singleNumberCount: record.singleNumberCount,
                            singleCount: record.singleCount,
                            singleWeight: record.singleWeight,
                        })
                        setTableData(data)
                        setVisible(true)
                    }}>构件详情</Button>
                </Space>
            ) 
        }
    ]
    const handleModalCancel = () =>{ setVisible(false); setTableData([]) }
    return <>
        <Modal title='构件详情'  width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
            <Space>
                <span>单段件号数：{tableDataTop.singleNumberCount}</span>
                <span>单段件数：{tableDataTop.singleCount}</span>
                <span>单段重量：{tableDataTop.singleWeight}kg</span>
            </Space>
            <CommonTable columns={componentColumns} dataSource={tableData} pagination={false}/>
        </Modal>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="塔型信息" />
                <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
                <DetailTitle title="段落信息" />
                <CommonTable columns={columns} dataSource={detailData?.drawProductSegmentMergeList} pagination={false}/>
            </DetailContent>
        </Spin>
    </>
}