/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-放样
*/

import React, { useRef, useState } from 'react';
import { Space, Button, Popconfirm, Input, Form, Upload, message, Modal } from 'antd';
import { Page } from '../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './TowerLoftingAssign.module.less';
import { Link, useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import { downloadTemplate } from './downloadTemplate';
import { ILofting, PdmModalProps } from './ISetOut';
import PdmModal from './PdmModal';

interface Column extends ColumnType<object> {
    editable?: boolean;
}

export default function Lofting(): React.ReactNode {
    const columns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<><span>{index + 1}</span><Form.Item name={['data', index, "id"]} initialValue={_} style={{ display: "none" }}>
                <Input size="small" onChange={() => rowChange(index)} />
            </Form.Item></>)
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 150,
            editable: true,
            dataIndex: 'segmentName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "segmentName"]} initialValue={_}>
                    <Input size="small" onChange={() => rowChange(index)} disabled />
                </Form.Item>
            )
        },
        {
            key: 'code',
            title: '构件编号',
            dataIndex: 'code',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "code"]} initialValue={_}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 200,
            dataIndex: 'materialName',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "materialName"]} initialValue={_}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'structureTexture',
            title: '材质',
            width: 150,
            dataIndex: 'structureTexture',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "structureTexture"]} initialValue={_}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'structureSpec',
            title: '规格',
            dataIndex: 'structureSpec',
            width: 200,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "structureSpec"]} initialValue={_}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'width',
            title: '宽度（mm）',
            width: 200,
            dataIndex: 'width',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "width"]} initialValue={_}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'thickness',
            title: '厚度（mm）',
            width: 200,
            dataIndex: 'thickness',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "thickness"]} initialValue={_ === -1 ? undefined : _}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'length',
            title: '长度（mm）',
            width: 200,
            dataIndex: 'length',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "length"]} initialValue={_ === -1 ? undefined : _}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'basicsPartNum',
            title: '单段件数',
            width: 200,
            dataIndex: 'basicsPartNum',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "basicsPartNum"]} initialValue={_}>
                    <Input type="number" min={0} size="small" onChange={(e) => {
                        const data = form.getFieldsValue(true).data;
                        data[index] = {
                            ...data[index],
                            totalWeight: Number(e.target.value) * Number(data[index].basicsWeight)
                        }
                        form.setFieldsValue({ data: [...data] })
                        rowChange(index);
                    }} />
                </Form.Item>
            )
        },
        {
            key: 'basicsWeight',
            title: '单件重量（kg）',
            width: 200,
            dataIndex: 'basicsWeight',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "basicsWeight"]} initialValue={_}>
                    <Input type="number" min={0} size="small" onChange={(e) => {
                        const data = form.getFieldsValue(true).data;
                        data[index] = {
                            ...data[index],
                            totalWeight: Number(e.target.value) * Number(data[index].basicsPartNum)
                        }
                        form.setFieldsValue({ data: [...data] })
                        rowChange(index);
                    }} />
                </Form.Item>
            )
        },
        {
            key: 'totalWeight',
            title: '小计重量（kg）',
            width: 200,
            dataIndex: 'totalWeight',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "totalWeight"]} initialValue={_}>
                    <Input size="small" disabled />
                </Form.Item>
            )
        },
        {
            key: 'holesNum',
            title: '单件孔数',
            width: 200,
            dataIndex: 'holesNum',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "holesNum"]} initialValue={_}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "description"]} initialValue={_}>
                    <Input size="small" maxLength={50} onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'specialCode',
            title: '特殊件号',
            width: 200,
            dataIndex: 'specialCode',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "specialCode"]} initialValue={_}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'electricWelding',
            title: '电焊',
            width: 200,
            dataIndex: 'electricWelding',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "electricWelding"]} initialValue={_} rules={[{
                        pattern: /^[1-2\s]*$/,
                        message: '仅可输入1/2',
                }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={1}/>
                </Form.Item>
            )
        },
        {
            key: 'bend',
            title: '火曲',
            width: 200,
            dataIndex: 'bend',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "bend"]} initialValue={_} rules={[{
                    pattern: /^[1-2\s]*$/,
                    message: '仅可输入1/2',
            }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={1}/>
                </Form.Item>
            )
        },
        {
            key: 'chamfer',
            title: '切角',
            width: 200,
            dataIndex: 'chamfer',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "chamfer"]} initialValue={_} rules={[{
                    pattern: /^[1-2\s]*$/,
                    message: '仅可输入1/2',
            }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
                </Form.Item>
            )
        },
        {
            key: 'shovelBack',
            title: '铲背',
            width: 200,
            dataIndex: 'shovelBack',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "shovelBack"]} initialValue={_} rules={[{
                    pattern: /^[1-2\s]*$/,
                    message: '仅可输入1/2',
            }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
                </Form.Item>
            )
        },
        {
            key: 'rootClear',
            title: '清根',
            width: 200,
            dataIndex: 'rootClear',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "rootClear"]} initialValue={_} rules={[{
                    pattern: /^[1-2\s]*$/,
                    message: '仅可输入1/2',
            }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
                </Form.Item>
            )
        },
        {
            key: 'squash',
            title: '打扁',
            width: 200,
            dataIndex: 'squash',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "squash"]} initialValue={_} rules={[{
                    pattern: /^[1-2\s]*$/,
                    message: '仅可输入1/2',
            }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
                </Form.Item>
            )
        },
        {
            key: 'openCloseAngle',
            title: '开合角',
            width: 200,
            dataIndex: 'openCloseAngle',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "openCloseAngle"]} initialValue={_} rules={[{
                    pattern: /^[1-2\s]*$/,
                    message: '仅可输入1/2',
            }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
                </Form.Item>
            )
        },
        {
            key: 'perforate',
            title: '钻孔',
            width: 200,
            dataIndex: 'perforate',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "perforate"]} initialValue={_} rules={[{
                    pattern: /^[1-2\s]*$/,
                    message: '仅可输入1/2',
            }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
                </Form.Item>
            )
        },
        {
            key: 'groove',
            title: '坡口',
            width: 200,
            dataIndex: 'groove',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "groove"]} initialValue={_} rules={[{
                    pattern: /^[1-2\s]*$/,
                    message: '仅可输入1/2',
            }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
                </Form.Item>
            )
        },
        {
            key: 'intersectingLine',
            title: '割相贯线',
            width: 200,
            dataIndex: 'intersectingLine',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "intersectingLine"]} initialValue={_} rules={[{
                    pattern: /^[1-2\s]*$/,
                    message: '仅可输入1/2',
            }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
                </Form.Item>
            )
        },
        {
            key: 'slottedForm',
            title: '开槽形式',
            width: 200,
            dataIndex: 'slottedForm',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "slottedForm"]} initialValue={_} rules={[{
                    pattern: /^[1-2\s]*$/,
                    message: '仅可输入1/2',
            }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
                </Form.Item>
            )
        },
        {
            key: 'type',
            title: '类型',
            width: 200,
            dataIndex: 'type',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "type"]} initialValue={_}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'sides',
            title: '边数',
            width: 200,
            dataIndex: 'sides',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "sides"]} initialValue={_ === -1 ? undefined : _}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'perimeter',
            title: '周长',
            width: 200,
            dataIndex: 'perimeter',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "perimeter"]} initialValue={_ === -1 ? undefined : _}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'surfaceArea',
            title: '表面积',
            width: 200,
            dataIndex: 'surfaceArea',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "surfaceArea"]} initialValue={_ === -1 ? undefined : _}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'apertureNumber',
            title: '各孔径孔数',
            width: 200,
            dataIndex: 'apertureNumber',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "apertureNumber"]} initialValue={_}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'weldingEdge',
            title: '焊接边（mm）',
            width: 200,
            dataIndex: 'weldingEdge',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "weldingEdge"]} initialValue={_ === -1 ? undefined : _}>
                    <Input size="small" onChange={() => rowChange(index)} />
                </Form.Item>
            )
        }
    ]

    const columnsSetting: Column[] = columns.map((col: Column) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_ === -1 ? undefined : _}</span>
            )
        }
    })

    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: ILofting[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit();
            message.success('提交成功');
            setPdmVisible(false);
            setRefresh(!refresh);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    const history = useHistory();
    const params = useParams<{ id: string, productSegmentId: string }>();
    const [editorLock, setEditorLock] = useState('编辑');
    const [rowChangeList, setRowChangeList] = useState<number[]>([]);
    const [tableColumns, setColumns] = useState(columnsSetting);
    const [form] = Form.useForm();
    const [refresh, setRefresh] = useState(false);
    const [urlVisible, setUrlVisible] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [filterValue, setFilterValue] = useState({});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<ILofting[]>([]);
    const [loading1, setLoading1] = useState(false);
    const editRef = useRef<PdmModalProps>();
    const [pdmVisible, setPdmVisible] = useState<boolean>(false);
    const [loading2, setLoading2] = useState(false);

    return <>
        {/* <Modal
            destroyOnClose
            visible={pdmVisible}
            width="30%"
            title="PDM同步"
            onOk={handleModalOk}
            className={styles.tryAssemble}
            onCancel={() => {
                setPdmVisible(false);
                setRefresh(!refresh);
            }}>
            <PdmModal id={''} ref={editRef} />
        </Modal> */}
        <Form layout="inline" style={{ margin: '20px' }} onFinish={(value: Record<string, any>) => {
            setFilterValue(value)
            setRefresh(!refresh);
        }}>
            <Form.Item label='材料名称' name='materialName'>
                <Input maxLength={50} />
            </Form.Item>
            <Form.Item label='材质' name='structureTexture'>
                <Input maxLength={50} />
            </Form.Item>
            <Form.Item label='段名' name='segmentName'>
                <Input maxLength={50} />
            </Form.Item>
            <Form.Item label='查询' name='code'>
                <Input placeholder="请输入构件编号查询" maxLength={50} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">查询</Button>
            </Form.Item>
            <Form.Item>
                <Button htmlType="reset">重置</Button>
            </Form.Item>
        </Form>
        <Form form={form} className={styles.descripForm}>
            <Page
                path="/tower-science/productStructure/list"
                exportPath={`/tower-science/productStructure/list`}
                columns={tableColumns}
                headTabs={[]}
                refresh={refresh}
                tableProps={{
                    pagination: false,
                    rowSelection: {
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }
                }}
                requestData={{ productSegmentGroupId: params.productSegmentId, ...filterValue }}
                extraOperation={<Space direction="horizontal" size="small">
                    <Button type="primary" onClick={() => downloadTemplate('/tower-science/productStructure/exportTemplate', '模板')} ghost>模板下载</Button>
                    <Popconfirm
                        title="确认完成放样?"
                        onConfirm={() => {
                            setLoading1(true);
                            RequestUtil.post(`/tower-science/productSegment/complete?productSegmentGroupId=${params.productSegmentId}`).then(res => {
                                history.goBack();
                            }).catch(error => {
                                setLoading1(false);
                            })
                        }
                        }
                        okText="确认"
                        cancelText="取消"
                        disabled={editorLock === '锁定'}
                    >
                        <Button type="primary" loading={loading1} disabled={editorLock === '锁定'} ghost>完成放样</Button>
                    </Popconfirm>
                    <Upload
                        action={() => {
                            const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                            return baseUrl + '/tower-science/productStructure/import'
                        }}
                        headers={
                            {
                                'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                                'Tenant-Id': AuthUtil.getTenantId(),
                                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                            }
                        }
                        data={{ productSegmentGroupId: params.productSegmentId }}
                        showUploadList={false}
                        disabled={editorLock === '锁定'}
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
                                    setRefresh(!refresh);
                                }
                            }
                        }}
                    >
                        <Button type="primary" disabled={editorLock === '锁定'} ghost>导入</Button>
                    </Upload>
                    <Link to={`/workMngt/setOutList/towerInformation/${params.id}/lofting/${params.productSegmentId}/loftingTowerApplication`}><Button type="primary" ghost>放样塔型套用</Button></Link>
                    <Button type="primary" ghost onClick={() => {
                        if (editorLock === '编辑') {
                            setColumns(columns);
                            setEditorLock('锁定');
                        } else {
                            const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
                            let values = form.getFieldsValue(true).data;
                            let changeValues = values.filter((item: any, index: number) => {
                                return newRowChangeList.indexOf(index) !== -1;
                            })
                            if (changeValues && changeValues.length > 0) {
                                RequestUtil.post(`/tower-science/productStructure/save`, [...changeValues]).then(res => {
                                    setColumns(columnsSetting);
                                    setEditorLock('编辑');
                                    setRowChangeList([]);
                                    form.resetFields();
                                    setRefresh(!refresh);
                                });
                            } else {
                                setColumns(columnsSetting);
                                setEditorLock('编辑');
                                setRowChangeList([]);
                                form.resetFields();
                            }
                        }
                    }}>{editorLock}</Button>
                    <Button type="primary" loading={loading2} onClick={() => {
                        setLoading2(true);
                        RequestUtil.post(`/tower-science/productStructure/pdmSynchronous/${params.productSegmentId}`).then(res => {
                            setLoading2(false);
                            message.success('PDM同步成功');
                            history.go(0);
                        }).catch(error => {
                            setLoading2(false);
                        })
                    }} disabled={editorLock === '锁定'} ghost>PDM同步</Button>
                    {/* <Button type="primary" onClick={() => setPdmVisible(true)} ghost>PDM同步</Button> */}
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            if (selectedKeys.length > 0) {
                                if (selectedKeys.length > 100) {
                                    message.warning('删除项不可大于100')
                                } else {
                                    RequestUtil.delete(`/tower-science/productStructure?productStructureIdList=${selectedKeys.join(',')}`).then(res => {
                                        message.success('删除成功');
                                        history.go(0);
                                    })
                                }
                            } else {
                                message.warning('请选择要删除的数据')
                            }
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={editorLock === '锁定'}
                    >
                        <Button type="primary" disabled={editorLock === '锁定'} ghost>删除</Button>
                    </Popconfirm>
                    <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                </Space>}
                searchFormItems={[]}
            />
        </Form>
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
    </>
}