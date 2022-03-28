/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-包装清单
*/

import React, { useRef, useState } from 'react';
import { Space, Button, Popconfirm, Spin, Modal, message } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import ExportList from '../../../components/export/list';
import { IBundle, IPackingList } from './ISetOut';
import { bundleColumns, columns } from './SetOutInformation.json';
import ApplyPacking, { EditProps } from './ApplyPacking';

export default function PackingList(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productId: string }>();
    const match = useRouteMatch();
    const [isExport, setIsExport] = useState(false);
    const [bundleData, setBundleData] = useState<IBundle[]>([]);
    const location = useLocation<{ status: number }>();
    const [loading1, setLoading1] = useState(false);
    const editRef = useRef<EditProps>();
    const [visible, setVisible] = useState<boolean>(false);

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

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit();
            message.success('复用成功');
            setVisible(false);
            history.go(0);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    return <>
        <Modal
            destroyOnClose
            visible={visible}
            title="套用包"
            width='70%'
            footer={<Space>
                <Button key="back" onClick={() => {
                    setVisible(false);
                }}>
                    关闭
                </Button>
                <Button type='primary' onClick={handleModalOk} ghost>复制</Button>
            </Space>}
            className={styles.tryAssemble}
            onCancel={() => {
                setVisible(false);
            }}>
            <ApplyPacking id={'1'} ref={editRef} />
        </Modal>
        <Space direction="horizontal" size="small" className={styles.titleContent}>
            <span>塔型：
                <span className={styles.content}>{detailData?.productCategoryName}</span>
            </span>
            <span>杆号：
                <span className={styles.content}>{detailData?.productNumber}</span>
            </span>
            <span>已打包捆数:
                <span className={styles.content}>{detailData?.packageStructureCount}</span>
            </span>
            <span>总件数:
                <span className={styles.content}>{ }</span>
            </span>
            <span>未打包件数:
                <span className={styles.content}>{ }</span>
            </span>
        </Space>
        <Space direction="horizontal" size="small" className={`${styles.padding16} ${styles.btnRight}`}>
            <Button type="primary" onClick={() => setIsExport(true)} ghost>导出</Button>
            {
                location?.state?.status === 4 ?
                    null : <>
                        <Button type="primary" ghost onClick={() => setVisible(true)}>套用包</Button>
                        <Button type="primary" ghost>自动打包</Button>
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
        <DetailContent key="packinglist">
            <CommonTable
                haveIndex
                columns={[
                    ...columns,
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
                ]}
                style={{ marginBottom: '50px' }}
                dataSource={detailData?.packageStructureVOList}
                pagination={false}
                onRow={(record: Record<string, any>, index: number) => ({
                    onClick: async () => { getBundleData(record.id); }
                })} />
            <CommonTable
                dataSource={[...bundleData]}
                haveIndex
                columns={bundleColumns}
                pagination={false}
            />
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