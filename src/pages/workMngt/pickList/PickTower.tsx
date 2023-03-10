import React, { useRef, useState } from 'react'
import { Space, DatePicker, Button, Form, Modal, Select, message } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import styles from './pick.module.less';
import useRequest from '@ahooksjs/use-request';
import WithSection, { EditRefProps } from './WithSection';
import AuthUtil from '../../../utils/AuthUtil';
export interface IDetail {
    productCategory?: string;
    productCategoryName?: string;
    productId?: string;
    productNumber?: string | any[];
    materialDrawProductSegmentList?: IMaterialDetail[];
    legNumberA?: string;
    legNumberB?: string;
    legNumberC?: string;
    legNumberD?: string;
    readonly materialSegmentList?: IMaterialDetail[];
    readonly productCategoryId?: string;
    productIdList?: any;
}
export interface IMaterialDetail {
    count?: number;
    id?: string;
    segmentName?: string;
}
export default function PickTower(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const params = useParams<{ id: string, status: string }>()
    const history = useHistory();
    const [filterValue, setFilterValue] = useState({});
    const [productId, setProductId] = useState('');
    const [withSectionVisible, setWithSectionVisible] = useState<boolean>(false);
    const editRef = useRef<EditRefProps>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit();
            message.success('配段成功');
            editRef.current?.resetFields();
            setWithSectionVisible(false);
            setRefresh(!refresh);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'productNumber',
            title: '杆塔号',
            width: 150,
            dataIndex: 'productNumber'
        },
        {
            key: 'productHeight',
            title: '呼高',
            width: 120,
            dataIndex: 'productHeight'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 150,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'segmentInformation',
            title: '配段信息',
            width: 200,
            dataIndex: 'segmentInformation'
        },
        {
            key: 'legNumberA',
            title: 'A',
            width: 150,
            dataIndex: 'legNumberA'
        },
        {
            key: 'legNumberB',
            title: 'B',
            width: 150,
            dataIndex: 'legNumberB'
        },
        {
            key: 'legNumberC',
            title: 'C',
            width: 150,
            dataIndex: 'legNumberC'
        },
        {
            key: 'legNumberD',
            title: 'D',
            width: 150,
            dataIndex: 'legNumberD'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 100,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type='link' onClick={async () => {
                        setWithSectionVisible(true);
                        setProductId(record.id);
                        // setStatus(params.status);
                        // setBatchNo(record.productionBatch && record.productionBatchNo && record.productionBatch.length > 0 && record.productionBatchNo.length > 0)
                    }} >配段</Button>
                    <Button type='link' onClick={() => { history.push(`/workMngt/pickList/pickTower/${params.id}/${params.status}/pickTowerDetail/${record.id}`) }}>杆塔提料明细</Button>
                </Space>
            )
        }
    ]

    // const onDepartmentChange = async (value: Record<string, any>) => {
    //     if (value) {
    //         const userData: any = await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
    //         setMatchLeader(userData.records);
    //     } else {

    //         setMatchLeader([]);
    //     }
    // }

    const renderTreeNodes = (data: any) => data.map((item: any) => {
        if (item.children) {
            return (
                <TreeNode key={item.id} title={item.title} value={item.id} className={styles.node}>
                    {renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} key={item.id} title={item.title} value={item.id} />;
    });

    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            } else {
                role.children = []
            }
        });
        return roles;
    }

    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }

    return (
        <>
            <Modal
                title="配段"
                destroyOnClose
                visible={withSectionVisible}
                width="60%"
                onOk={handleModalOk}
                footer={<Space>
                    <Button type='primary' loading={confirmLoading} onClick={handleModalOk}>保存</Button>
                    <Button onClick={() => {
                        editRef.current?.resetFields();
                        setWithSectionVisible(false);
                    }}>取消</Button>
                </Space>}
                okText="保存"
                onCancel={() => {
                    editRef.current?.resetFields();
                    setWithSectionVisible(false);
                }}>
                <WithSection id={productId} getLoading={(loading: boolean) => setConfirmLoading(loading)} ref={editRef} type={productId ? 'edit' : 'new'} productCategoryId={params.id} />
            </Modal>
            <Page
                path="/tower-science/materialProduct"
                columns={columns}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                refresh={refresh}
                requestData={{ productCategoryId: params.id }}
                exportPath="/tower-science/materialProduct"
                extraOperation={
                    <Space>
                        <Button type='primary' onClick={() => {
                            setWithSectionVisible(true);
                            setProductId('');
                        }}>批量配段</Button>
                        <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                    </Space>
                }
                searchFormItems={[
                    // {
                    //     name: 'statusUpdateTime',
                    //     label: '最新状态变更时间',
                    //     children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    // },
                    // {
                    //     name: 'materialStatus',
                    //     label: '杆塔提料状态',
                    //     children: <Select style={{ width: '100px' }}>
                    //         <Select.Option value={''} key={''}>全部</Select.Option>
                    //         <Select.Option value={1} key={1}>待开始</Select.Option>
                    //         <Select.Option value={2} key={2}>待配段</Select.Option>
                    //         <Select.Option value={3} key={3}>已完成</Select.Option>
                    //     </Select>
                    // },
                    // {
                    //     name: 'materialUserDepartment',
                    //     label: '配段人',
                    //     children:  <TreeSelect style={{width:'200px'}}
                    //                     allowClear
                    //                     onChange={ onDepartmentChange }
                    //                 >
                    //                     {renderTreeNodes(wrapRole2DataNode( department ))}
                    //                 </TreeSelect>
                    // },
                    // {
                    //     name: 'materialUser',
                    //     label:'',
                    //     children:   <Select style={{width:'100px'}} allowClear>
                    //                     { matchLeader && matchLeader.map((item:any)=>{
                    //                         return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    //                     }) }
                    //                 </Select>
                    // },
                ]}
            />
        </>
    )
}