import React, { useState } from 'react';
import { Space, Input, DatePicker, Modal } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './DrawTower.module.less';
import { Link } from 'react-router-dom';
import DeliverablesListing from './DeliverablesListing';
import WithSection from './WithSection';

export default function DrawTowerMngt(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [visible,setVisible] = useState(false);

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'name',
            title: '图纸工程名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 150,
            dataIndex: 'planNumber'
        },
        {
            key: 'saleOrderNumber',
            title: '业主单位',
            dataIndex: 'saleOrderNumber',
            width: 200
        },
        {
            key: 'name',
            title: '设计院',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'saleOrderNumber',
            title: '塔型',
            dataIndex: 'saleOrderNumber',
            width: 200
        },
        {
            key: 'steelProductShape',
            title: '塔型钢印号',
            dataIndex: 'steelProductShape',
            width: 120
        },
        {
            key: 'patternName',
            title: '模式',
            width: 200,
            dataIndex: 'patternName'
        },

        {
            key: 'structureCount',
            title: '件号数',
            width: 200,
            dataIndex: 'structureCount',
            render: (_: number): React.ReactNode => (
                <span>{_ === -1 ? undefined : _}</span>
            )
        },
        {
            key: 'steelAngleCount',
            title: '角钢件号数',
            width: 200,
            dataIndex: 'steelAngleCount',
            render: (_: number): React.ReactNode => (
                <span>{_ === -1 ? undefined : _}</span>
            )
        },
        {
            key: 'steelPlateCount',
            title: '钢板件号数',
            width: 200,
            dataIndex: 'steelPlateCount',
            render: (_: number): React.ReactNode => (
                <span>{_ === -1 ? undefined : _}</span>
            )
        },
        {
            key: 'updateUserName',
            title: '最后更新人',
            width: 200,
            dataIndex: 'updateUserName'
        },
        {
            key: 'updateTime',
            title: '最后更新时间',
            width: 200,
            dataIndex: 'updateTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Link to={`/drawTower/drawTowerMngt/towerInformation/${record.id}`}>塔型信息</Link>
                    {/* <Link to={`/drawTower/drawTowerMngt/componentInformation/${record.id}/${record.structureCount === -1 ? 0 : record.structureCount}`}>塔型构件</Link> */}
                    <DeliverablesListing id={record.id} />
                    <Link to={``}>配段信息</Link>
                </Space>
            )
        }
    ]

    return <>
    <Modal
                destroyOnClose
                visible={visible}
                width="40%"
                title="技术下达"
                onCancel={() => {
                    setVisible(false);
                    setRefresh(!refresh);
                }}>
                <WithSection dataSource={[]} />
            </Modal>
            <Page
        path="/tower-science/productCategory/draw/page"
        exportPath={`/tower-science/productCategory/draw/page`}
        columns={columns}
        headTabs={[]}
        refresh={refresh}
        searchFormItems={[
            // {
            //     name: 'pattern',
            //     label: '模式',
            //     children: <Select style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
            //         {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
            //             return <Select.Option key={index} value={id}>
            //                 {name}
            //             </Select.Option>
            //         })}
            //     </Select>
            // },
            {
                name: 'time',
                label: '时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input style={{ width: '500px' }} placeholder="图纸工程名称/内部合同编号/计划号/业主单位/设计院/塔型/塔型钢印号" />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            if (values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                values.creationTimeStart = formatDate[0] + ' 00:00:00';
                values.creationTimeEnd = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        }}
    />
    </>
}