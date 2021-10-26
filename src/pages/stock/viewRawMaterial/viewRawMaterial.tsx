import React, { useState } from 'react'
import { Button, TableColumnProps, Select, DatePicker, Input } from 'antd'
import { Link, } from 'react-router-dom'
import { Page } from '../../common'
//原材料类型
const projectType = [
    {
        value: 0,
        label: "焊管"
    },
    {
        value: 1,
        label: "钢板"
    },
    {
        value: 2,
        label: "圆钢"
    },
    {
        value: 3,
        label: "大角钢"
    }
]

const currentProjectStage = [
    {
        value: 0,
        label: "国网B级"
    },
    {
        value: 1,
        label: "国网C级"
    },
    {
        value: 2,
        label: "国网D\级"
    },
    {
        value: 3,
        label: "国网正公差"
    }
]

export default function ViewRawMaterial(): React.ReactNode {
    // const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
    const { RangePicker } = DatePicker;
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            // render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'projectName',
            title: '原材料名称',
            dataIndex: 'projectName',
            // render: (_a: any, _b: any) => <Link to={`/project/management/detail/base/${_b.id}`}>{_b.projectName}</Link>
        },
        // {
        //     key: 'projectNumber',
        //     title: '标准',
        //     dataIndex: 'projectNumber'
        // },
        {
            key: 'structureSpec',
            title: '规格',
            dataIndex: 'structureSpec',
            // render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{projectType.find(item => item.value === Number(_a))?.label}</span>)
        },
        {
            key: 'rawMaterialType',
            title: '原材料类型',
            dataIndex: 'rawMaterialType'
        },
        {
            key: 'materialStandard',
            title: '原材料标准',
            dataIndex: 'materialStandard'
        },
        {
            key: 'quotedPriceTime',
            title: '报价时间',
            dataIndex: 'quotedPriceTime'
        },
        {
            key: 'updateTime',
            title: '更新时间',
            dataIndex: 'updateTime',
        },
        {
            key: 'priceSource',
            title: '价格来源',
            dataIndex: 'priceSource'
        },
        {
            key: 'price',
            title: '价格',
            dataIndex: 'price'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation'
        },]


    const onFilterSubmit = (value: any) => {
        if (value.startBidBuyEndTime) {
            const formatDate = value.startBidBuyEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBidBuyEndTime = formatDate[0]
            value.endBidBuyEndTime = formatDate[1]
        }

        if (value.startBiddingEndTime) {
            const formatDate = value.startBiddingEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBiddingEndTime = formatDate[0]
            value.endBiddingEndTime = formatDate[1]
        }
        setFilterValue(value)
        return value
    }

    return (
        <Page
            path="/tower-market/projectInfo"
            columns={columns}
            filterValue={filterValue}
            extraOperation={<Link to="/project/management/new"><Button type="primary">导出</Button></Link>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'updateTime',
                    label: '更新时间',
                    children: <RangePicker />
                },
                {
                    name: 'rawMaterialType',
                    label: '原材料类型',
                    children: <Select style={{ width: "150px" }}>
                        {projectType.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'materialStandard',
                    label: '原材料标准',
                    children: <Select style={{ width: "150px" }}>
                        {currentProjectStage.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'inquire',
                    label: '查询',
                    children: <Input placeholder="原材料名称/规格" />
                },
            ]}
        />
    )
}