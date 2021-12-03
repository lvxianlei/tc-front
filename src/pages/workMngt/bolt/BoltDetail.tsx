import { Button, message, Modal, Popconfirm, Upload, } from 'antd';
import React, { useState } from 'react';
import { useHistory, useParams, } from 'react-router-dom';
import AuthUtil from '../../../utils/AuthUtil';
import RequestUtil from '../../../utils/RequestUtil';
import { Page } from '../../common';
import { downloadTemplate } from '../setOut/downloadTemplate';
import BoltDetailAdd from './addModal';

export default function BoltCheck(): React.ReactNode {
    const params = useParams<{ id: string, boltId: string }>();
    const history = useHistory()
    const [urlVisible, setUrlVisible] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [item, setItem] = useState<any>({})
    const columns: any = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 100,
            render: (_text: any, _item: any, index: number): React.ReactNode => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '螺栓类型',
            width: 150,
            dataIndex: 'typeName',
        },
        {
            title: '名称',
            width: 150,
            dataIndex: 'name',
        },
        {
            title: '等级',
            width: 150,
            dataIndex: 'level',
        },
        {
            title: '规格',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '无扣长（mm）',
            dataIndex: 'unbuckleLength',
            width: 120,
        },
        {
            title: '小计',
            width: 150,
            dataIndex: 'subtotal',
        },
        {
            title: '合计',
            width: 150,
            dataIndex: 'total',
        },
        {
            title: '单重（kg）',
            width: 150,
            dataIndex: 'singleWeight',
        },
        {
            title: '合计重（kg）',
            width: 150,
            dataIndex: 'totalWeight',
        },
        {
            title: '备注',
            width: 150,
            dataIndex: 'description',
        },
        {
            title: '操作',
            width: 120,
            dataIndex: 'operation',
            render: (text: string, item: { id: string }) => {
                return (
                    <div className='operation'>
                        <span
                            style={{ color: '#FF8C00', marginRight: 10, cursor: 'pointer' }}
                            onClick={() => {
                                setId(item.id)
                                setIsAddModal(true)
                                setItem(item)
                            }}
                        >编辑</span>
                        <Popconfirm
                            placement="bottomRight"
                            title='确认删除?'
                            onConfirm={() => {
                                deleteItem(item.id)
                            }}
                            okText="是"
                            cancelText="否"
                        >
                            <span
                                style={{ color: '#FF8C00', marginRight: 10, cursor: 'pointer' }}
                            >删除</span>
                        </Popconfirm>
                    </div>
                )
            }
        },
    ]
    const [isAddModal, setIsAddModal] = useState<boolean>(false);//添加弹框显示
    const [refresh, setRefresh] = useState<boolean>(false);
    const [id, setId] = useState<string | null>(null)
    /**
     * 
     * @param refresh 是否刷新列表
     */
    const onCancel = (refreshList?: boolean) => {
        if (refreshList) {
            setRefresh(!refresh)
        }
        setIsAddModal(false)
    }
    /**
     * 删除
     * @param boltId 
     */
    const deleteItem = async (boltId: string) => {
        await RequestUtil.delete(`/tower-science/boltRecord/delete/${boltId}`)
        message.success('操作成功')
        setRefresh(!refresh)
    }
    return (
        <div>
            <Page
                path={`/tower-science/boltRecord/boltList`}
                requestData={{ productCategoryId: params.boltId, basicHeightId: params.id }}
                columns={columns}
                refresh={refresh}
                extraOperation={
                    <div>
                        <Button type="primary" onClick={() => downloadTemplate('/tower-science/boltRecord/exportTemplate', '螺栓导入模板')} ghost>模板下载</Button>
                        <Button type="primary" ghost onClick={() => { }} style={{ marginLeft: 10, }}>编辑/锁定</Button>
                        <Upload
                            action={() => {
                                const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                                return baseUrl + '/tower-science/boltRecord/import'
                            }}
                            headers={
                                {
                                    'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                                    'Tenant-Id': AuthUtil.getTenantId(),
                                    'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                                }
                            }
                            data={{ basicHeightId: params.id, productCategoryId: params.boltId }}
                            showUploadList={false}
                            onChange={(info) => {
                                if (info.file.response && !info.file.response?.success) {
                                    message.warning(info.file.response?.msg)
                                }
                                if (info.file.response && info.file.response?.success) {
                                    if (Object.keys(info.file.response?.data).length > 0) {
                                        setUrl(info.file.response?.data);
                                        setUrlVisible(true);
                                    } else {
                                        message.success('导入成功！');
                                        setRefresh(!refresh)
                                    }
                                }
                            }}
                        >
                            <Button type="primary" ghost onClick={() => { }} style={{ marginLeft: 10, }}>导入</Button>
                        </Upload>
                        <Button type="primary" ghost onClick={() => { setIsAddModal(true) }} style={{ marginLeft: 10, }}>添加</Button>
                        <Button type="primary" ghost onClick={() => { history.go(-1) }} style={{ marginLeft: 10, }}>返回上一级</Button>
                    </div>
                }
                headTabs={[]}
                searchFormItems={[]}
            />
            <Modal
                visible={urlVisible}
                onOk={() => {
                    window.open(url);
                    setUrlVisible(false);
                }}
                onCancel={() => { setUrlVisible(false); setUrl('') }}
                title='提示'
                okText='下载'
            >
                当前存在错误数据，请重新下载上传！
            </Modal>
            {
                isAddModal ?
                    <BoltDetailAdd
                        cancelModal={onCancel}
                        item={item}
                        id={id}
                    /> : null
            }
        </div>
    )
}