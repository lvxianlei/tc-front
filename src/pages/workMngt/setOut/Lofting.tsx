/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-放样
*/

import React, { useState } from 'react';
import { Space, Button, Popconfirm, Input, Form, Upload, message } from 'antd';
import { Page } from '../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './TowerLoftingAssign.module.less';
import { Link, useHistory, useParams } from 'react-router-dom';
import UploadModal from './UploadModal';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import { downloadTemplate } from './downloadTemplate';

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
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<><span>{ index + 1 }</span><Form.Item name={['data',index, "id"]} initialValue={ _ } style={{ display: "none" }}>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item></>)
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 150,
            editable: true,
            dataIndex: 'segmentName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "segmentName"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "code"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "materialName"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "structureTexture"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "structureSpec"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "width"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "thickness"]} initialValue={ _ === -1  ? undefined : _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "length"]} initialValue={ _ === -1  ? undefined : _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "basicsPartNum"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "basicsWeight"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "totalWeight"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item>
            )
        },
        {
            key: 'ncName',
            title: 'NC程序名称',
            width: 200,
            dataIndex: 'ncName',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "ncName"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "description"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "electricWelding"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "bend"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "chamfer"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "shovelBack"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "rootClear"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "squash"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "openCloseAngle"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "perforate"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "groove"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "intersectingLine"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "slottedForm"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "sides"]} initialValue={ _ === -1  ? undefined : _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "perimeter"]} initialValue={ _ === -1  ? undefined : _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "surfaceArea"]} initialValue={ _ === -1  ? undefined : _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "apertureNumber"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "weldingEdge"]} initialValue={ _ === -1  ? undefined : _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item>
            )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            editable: true,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Button type="link" disabled>删除</Button>
            )
        }
    ]

    const columnsSetting: Column[] = columns.map((col: Column) => {
        if (!col.editable) {
            return col;
        }
        if(col.dataIndex === 'operation') {
            return {
                ...col,
                render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={ () => RequestUtil.delete(`/tower-science/productStructure?productStructureId=${ record.id }`).then(res => {
                                message.success('删除成功');
                                history.go(0);
                            }) }
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="link">删除</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        } else {
            return {
                ...col,
                render:(_: number, record: Record<string, any>, index: number): React.ReactNode => (
                    <span>{ _ === -1  ? undefined : _ }</span>
                )
            }
        }
    })

    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);    
    }

    const history = useHistory();
    const params = useParams<{ id: string, productSegmentId: string }>();
    const [ editorLock, setEditorLock ] = useState('编辑');
    const [ rowChangeList, setRowChangeList ] = useState<number[]>([]);
    const [ tableColumns, setColumns ] = useState(columnsSetting);
    const [ form ] = Form.useForm();
    const [ refresh, setRefresh ] = useState(false);

    return <Form form={ form } className={ styles.descripForm }>  
        <Page
            path="/tower-science/productStructure/list"
            columns={ tableColumns }
            headTabs={ [] }
            tableProps={{ pagination: false }}
            refresh={ refresh }
            requestData={{ productSegmentId: params.productSegmentId }}
            extraOperation={ <Space direction="horizontal" size="small">
                {/* <Button type="primary" ghost>导出</Button> */}
                <Button type="primary" onClick={ () => downloadTemplate('/tower-science/productStructure/exportTemplate', '模板') } ghost>模板下载</Button>
                <Popconfirm
                    title="确认完成放样?"
                    onConfirm={ () => RequestUtil.post(`/tower-science/productSegment/complete?productSegmentId=${ params.productSegmentId }`).then(res => {
                        history.goBack();
                    }) }
                    okText="确认"
                    cancelText="取消"
                >
                    <Button type="primary" ghost>完成放样</Button>
                </Popconfirm>
                <Upload 
                    action={ () => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl+'/tower-science/productStructure/import'
                    } } 
                    headers={
                        {
                            'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    data={ { productSegmentId: params.productSegmentId } }
                    showUploadList={ false }
                    onChange={ (info) => {
                        if(info.file.response && !info.file.response?.success) {
                            message.warning(info.file.response?.msg)
                        } 
                        if(info.file.response && info.file.response?.success){
                            setRefresh(!refresh);
                        }
                    } }
                >
                    <Button type="primary" ghost>导入</Button>
                </Upload>
                <Link to={ `/workMngt/setOutList/towerInformation/${ params.id }/lofting/${ params.productSegmentId }/loftingTowerApplication` }><Button type="primary" ghost>放样塔型套用</Button></Link>
                <Button type="primary" ghost onClick={ () => { 
                    if(editorLock === '编辑') {
                        setColumns(columns);
                        setEditorLock('锁定');   
                    } else {
                        const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
                        let values = form.getFieldsValue(true).data;
                        if(values) {
                            let changeValues = values.filter((item: any, index: number) => {
                                return newRowChangeList.indexOf(index) !== -1;
                            })
                            RequestUtil.post(`/tower-science/productStructure/save`, [ ...changeValues ]).then(res => {
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
                } }>{ editorLock }</Button>
                <UploadModal id={ params.productSegmentId } path={ `/tower-science/productSegment/segmentModelDetail?productSegmentId=${ params.productSegmentId }` } requestData={ { productSegmentId: params.productSegmentId } } uploadUrl="/tower-science/productSegment/segmentModelUpload" btnName="模型上传" delPath="/tower-science/productSegment/segmentModelDelete" />
                <UploadModal id={ params.productSegmentId } path={ `/tower-science/productSegment/segmentDrawDetail?productSegmentId=${ params.productSegmentId }` } requestData={ { productSegmentId: params.productSegmentId } } uploadUrl="/tower-science/productSegment/segmentDrawUpload" btnName="样图上传"  delPath="/tower-science/productSegment/segmentDrawDelete"/>
                <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
            </Space> }
            searchFormItems={ [
                {
                    name: 'materialName',
                    label: '材料名称',
                    children: <Input placeholder="请输入"/>
                },
                {
                    name: 'structureTexture',
                    label: '材质',
                    children: <Input placeholder="请输入"/>
                }
            ] }
            onFilterSubmit = { (values: Record<string, any>) => { return values; } }
        />
    </Form>
}