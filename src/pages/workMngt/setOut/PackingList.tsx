/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-包装清单
*/

import React, { useState } from 'react';
import { Space, Button, Popconfirm, Spin } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import ExportList from '../../../components/export/list';
import { IBundle, IPackingList } from './ISetOut';

export default function PackingList(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'balesCode',
            title: '捆号',
            width: 150,
            dataIndex: 'balesCode'
        },
        {
            key: 'packageTypeName',
            title: '包类型',
            width: 150,
            dataIndex: 'packageTypeName'
        },
        {
            key: 'packageAttributeName',
            title: '包属性',
            width: 150,
            dataIndex: 'packageAttributeName'
        },
        {
            key: 'balesCount',
            title: '捆件数',
            dataIndex: 'balesCount',
            width: 120
        },
        {
            key: 'weightCount',
            title: '包重量（吨）',
            dataIndex: 'weightCount',
            width: 120
        },
        {
            key: 'createUserName',
            title: '创建人',
            width: 200,
            dataIndex: 'createUserName'
        },
        {
            key: 'createTime',
            title: '创建时间',
            width: 200,
            dataIndex: 'createTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Link to={`/workMngt/setOutList/poleInformation/${params.id}/packingList/${params.productId}/packingListSetting/${record.id}`}>
                        <Button type="link" disabled={location?.state?.status === 4}>编辑</Button>
                    </Link>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => { RequestUtil.delete(`/tower-science/packageStructure?id=${record.id}`).then(res => history.go(0)) }}
                        okText="确认"
                        cancelText="取消"
                        disabled={location?.state?.status === 4}
                    >
                        <Button type="link" disabled={location?.state?.status === 4}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const bundleColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'pieceCode',
            title: '件号',
            width: 150,
            dataIndex: 'pieceCode'
        },
        {
            key: 'materialSpec',
            title: '材料规格',
            dataIndex: 'materialSpec',
            width: 120
        },
        {
            key: 'length',
            title: '长度',
            dataIndex: 'length',
            width: 120
        },
        {
            key: 'num',
            title: '数量',
            width: 200,
            dataIndex: 'num'
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        }
    ]

    const history = useHistory();
    const params = useParams<{ id: string, productId: string }>();
    const match = useRouteMatch();
    const [isExport, setIsExport] = useState(false);
    const [bundleData, setBundleData] = useState<IBundle[]>([]);
    const location = useLocation<{ status: number }>();
    const [loading1, setLoading1] = useState(false);

    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        await RequestUtil.get(`/tower-science/packageStructure/${params.productId}`).then(res => {
            resole(res)
        }).catch(error => {
            setTimeout(() => {
                history.goBack();
            }, 500)
        });
    }), {})
    const detailData: any = data;

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const getBundleData = async (id: string) => {
        const resData: IPackingList = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/structure/list?id=${id}`);
        setBundleData([...(resData.packageRecordVOList || [])]);
    }

    return <>
        <Space direction="horizontal" size="small" className={styles?.topcontent}>
            <span>塔型：{detailData?.productCategoryName}</span>
            <span>杆号：{detailData?.productNumber}</span>
            <span>捆数: {detailData?.packageStructureCount}</span>
        </Space>
        <Space direction="horizontal" size="small" className={`${styles.padding16} ${styles.btnRight}`}>
            <Button type="primary" onClick={() => setIsExport(true)} ghost>导出</Button>
            {
                location?.state?.status === 4 ?
                    null : <>
                        <Link to={{ pathname: `/workMngt/setOutList/poleInformation/${params.id}/packingList/${params.productId}/packingListNew`, state: { productCategoryName: detailData?.productCategoryName, productNumber: detailData?.productNumber } }}><Button type="primary" ghost>添加</Button></Link>
                        <Popconfirm
                            title="确认完成?"
                            onConfirm={() => {
                                setLoading1(true);
                                RequestUtil.post(`/tower-science/packageStructure/submit?productId=${params.productId}`).then(res => history.goBack()).catch(error => {
                                    setLoading1(false);
                                })
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button loading={loading1} type="primary">完成</Button>
                        </Popconfirm>
                    </>
            }
            <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
        </Space>
        <DetailContent>
            <CommonTable columns={columns} style={{ marginBottom: '50px' }} dataSource={detailData?.packageStructureVOList} pagination={false} onRow={(record: Record<string, any>, index: number) => ({
                onClick: async () => { getBundleData(record.id); }
            })} />
            <CommonTable dataSource={[...bundleData]} columns={bundleColumns} pagination={false} />
        </DetailContent>
        {isExport ? <ExportList
            history={history}
            location={location}
            match={match}
            columnsKey={() => {
                let keys = [...columns]
                keys.pop()
                return keys
            }}
            current={detailData?.current || 1}
            size={detailData?.size || 10}
            total={detailData?.total || 0}
            url={`/tower-science/packageStructure/exportByProductId`}
            serchObj={{ productId: params.productId }}
            closeExportList={() => setIsExport(false)}
        /> : null}
    </>
}