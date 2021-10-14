import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Modal, Form, Image, message, Popconfirm } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';

export default function SampleDraw(): React.ReactNode {
    const params = useParams<{ id: string }>()
    const history = useHistory();
    const [filterValue, setFilterValue] = useState({});
    const [visible, setVisible] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [form] = Form.useForm();
    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            console.log(submitData)
            setVisible(false)
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
            key: 'partName',
            title: '段名',
            width: 50,
            dataIndex: 'partName'
        },
        {
            key: 'componentCode',
            title: '构建编号',
            width: 100,
            dataIndex: 'componentCode'
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 100,
            dataIndex: 'materialName'
        },
        {
            key: 'smallSample',
            title: '小样图名称',
            width: 100,
            dataIndex: 'smallSample'
        },
        {
            key: 'uploadTime',
            title: '上传时间',
            width: 200,
            dataIndex: 'uploadTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 50,
            // fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="要删除该条数据吗？"
                        okText="确认"
                        cancelText="取消"
                        onConfirm={async () =>  await RequestUtil.delete(`/tower-science/smallSample/${record.id}`).then(()=>{
                            message.success('删除成功！');
                        }).then(()=>{
                            setRefresh(!refresh)
                        })}
                    >
                        <Button type="link" >
                            删除
                        </Button>
                    </Popconfirm>
                    <Button type='link' onClick={async () => {
                        const url:any = await RequestUtil.get(`/tower-science/smallSample/sampleView/${record.id}`);
                        setUrl(url?.filePath);
                        setVisible(true)
                    }}>查看</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => setVisible(false);
    const onFilterSubmit = (value: any) => {
        if (value.upLoadTime) {
            const formatDate = value.upLoadTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.uploadTimeStart = formatDate[0]+ ' 00:00:00';
            value.uploadTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.upLoadTime
        }
        setFilterValue(value)
        return value
    }
    return (
        <>
            <Modal visible={visible} title="图片" footer={false}  onOk={handleModalOk} onCancel={handleModalCancel} width={800}>
                <Image 
                    src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
                    // src={url}
                    preview={false}
                />
            </Modal>
            <Page
                path="/tower-science/smallSample/sampleList"
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                requestData={{productCategoryId:params.id}}
                extraOperation={
                    <Space>
                    <Button type="primary">导出</Button>
                    <Button type="primary">导入</Button>
                    <Button type="primary">下载小样图</Button>
                    <Popconfirm
                        title="确认完成小样图?"
                        onConfirm={ async () =>  await RequestUtil.put(`/tower-science/smallSample/sampleComplete/productCategoryId=${params.id}`).then(()=>{
                            message.success('提交成功！');
                        }).then(()=>{
                            history.push('/workMngt/sampleDrawList');
                        })}
                        okText="确认"
                        cancelText="取消"
                    >   
                        <Button type="primary">完成小样图</Button>
                    </Popconfirm>
                    <Button type="primary" onClick={() => history.goBack()}>返回上一级</Button>
                    <span>小样图数：23/100</span>
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'upLoadTime',
                        label: '上传时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入段号/构件编号进行查询" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}