import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, TablePaginationConfig, Card } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useForm } from 'antd/lib/form/Form';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from '../workshop.module.less';

export default function ProcessingTaskList(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});
    const history = useHistory();
    const [ form ] = useForm();
    const [ paragraphData, setParagraphData ] = useState([] as undefined | any);
    const params = useParams<{ id: string ,productSegmentId: string,status:string}>();
    const page = {
        current: 1,
        pageSize: 10
    };

    const getTableDataSource = (pagination: TablePaginationConfig, filterValues: Record<string, any>) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<any>(`/tower-science/productCategory`, { ...pagination, ...filterValues });
        // setDetailData(data);
        resole(data);
    });
    const { loading } = useRequest<any>(() => getTableDataSource(page, {}), {});
    const onFinish = (value: Record<string, any>) => {
        getTableDataSource(page, value);
    }

    return <>
    <Card style={{marginBottom:'8px'}}>
        <Form form={ form } onFinish={ onFinish } layout="inline" className={ styles.topForm }>
            <Form.Item name="status" label="工序">
                <Select style={{width:'100px'}}>
                    <Select.Option value={''} key ={''}>全部</Select.Option>
                    <Select.Option value={1} key={1}>流水线</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="status" label="产线">
                <Select style={{width:'100px'}}>
                    <Select.Option value={''} key ={''}>全部</Select.Option>
                    <Select.Option value={1} key={1}>A产线</Select.Option>
                    <Select.Option value={2} key={2}>B产线</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="time" label="时间范围">
                <DatePicker.RangePicker/>
            </Form.Item>
            {/* <Form.Item name="productCategoryName" label="模糊查询项">
                <Input placeholder="请输入塔型/构件号进行查询"/>
            </Form.Item> */}
            <Space direction="horizontal">
                <Button type="primary" htmlType="submit">搜索</Button>
                <Button type="ghost" htmlType="reset">重置</Button>
            </Space>
        </Form>
    </Card>
    <Card>
        <Button type='primary' onClick={()=>{history.push(`/packagingWorkshop/processingTask/dispatch/new`)}}>派工</Button>
    </Card>
    </>
}