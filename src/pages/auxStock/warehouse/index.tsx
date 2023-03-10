import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Input, Select, message, Button, Upload, Radio, TreeSelect, DatePicker, Modal } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import { SearchTable as Page, SearchTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { exportDown } from '../../../utils/Export';
import AuthUtil from '../../../utils/AuthUtil';
import { stock, stockDetail } from "./data.json";
import { FixedType } from 'rc-table/lib/interface'
import '../StockPublicStyle.less';

export default function RawMaterialStock(): React.ReactNode {
    const history = useHistory()
    const [tabs, setTabs] = useState<1 | 2>(2)
    const [visible, setVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>('')
    const [warehouseId, setWarehouseId] = useState<string | undefined>()
    const [pagePath, setPagePath] = useState<string>("/tower-storage/materialStock/auxiliary/details")
    const [filterValue, setFilterValue] = useState({})
    const { data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const [warehouseList, classify] = await Promise.all<any>([
                RequestUtil.get(`/tower-storage/warehouse/tree?type=0`),
                RequestUtil.get(`/tower-system/materialCategory`, {
                    materialDataType: 2
                })
            ])
            resole({
                warehouseList,
                classify: classify.map((item: any) => ({
                    value: item.name,
                    label: item.name,
                    children: item.children.map((cItem: any) => ({
                        value: cItem.name,
                        label: cItem.name
                    }))
                }))
            })
        } catch (error) {
            reject(error)
        }
    }))

    const { run, data: count } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const askPrice:any = await RequestUtil.get(`/tower-storage/materialStock/auxiliary/count`, { ...filterValue })
            resole({ num: askPrice?.num, totalTaxPrice:askPrice?.totalTaxPrice, weight:askPrice?.weight, totalPrice:askPrice?.totalPrice})
        } catch (error) {
            reject(error)
        }
    }))
    const inStockDetails = [
        ...stockDetail,
        {
            title: '操作',
            dataIndex: 'key',
            width: 100,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <>
                    <Button type="link"
                        onClick={() => { setDetailId(record.id); setVisible(true) }}
                    >出入库明细</Button>
                </>
            )
        }
    ]
    //库区库位
    const { data: locatorData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/tree/${warehouseId}`)
            resole(result?.map((item: any) => ({
                label: item.name,
                value: item.id,
                key: item.id,
                disabled: true,
                children: item.children?.map((cItem: any) => ({
                    label: cItem.name,
                    value: `${item.id}-${cItem.id}`,
                    key: `${item.id}-${cItem.id}`
                }) || [])
            })) || [])
        } catch (error) {
            reject(error)
        }
    }), { ready: !!warehouseId, refreshDeps: [warehouseId] })

    const handleDownload = () => {
        exportDown(
            `/tower-storage/materialStock/auxiliary/masterplate/export`,
            "POST",
            {},
            undefined,
            "辅材库存模版"
        )
    }

    const handleRadioChange = (event: any) => {
        if (event.target.value === 1) {
            setTabs(1)
            setPagePath("/tower-storage/materialStock/auxiliary")
            return
        }
        if (event.target.value === 2) {
            setTabs(2)
            setPagePath("/tower-storage/materialStock/auxiliary/details")
            return
        }
    }

    return (<>
        <Modal
            title="出入库明细"
            visible={visible}
            width={1101}
            destroyOnClose
            onCancel={() => {
                setDetailId('')
                setVisible(false)
            }}
            footer={[]}
        >
            <SearchTable
                path={`/tower-storage/materialStock/optLogs/${detailId}`}
                filterValue={{ id: detailId }}
                columns={[
                    {
                        title: "序号",
                        dataIndex: "staffName",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    {
                        title: "入库数量",
                        dataIndex: "inStockNum",
                    },
                    {
                        title: "入库重量",
                        dataIndex: "totalInStockWeight",
                    },
                    {
                        title: "出库数量",
                        dataIndex: "outStockNum",
                    },
                    {
                        title: "出库重量",
                        dataIndex: "totalOutStockWeight",
                    },
                    {
                        title: "更新时间",
                        dataIndex: "updateTime",
                        type: "date",
                        format: "YYYY-MM-DD"
                    },
                    {
                        title: "操作人",
                        dataIndex: "createUserName",
                    },
                    {
                        title: "更新类型",
                        dataIndex: "operationTypeName"
                    }
                ] as any}
                // modal
                searchFormItems={[]}
                pagination={false}
            />
        </Modal>
        <Page
            path={pagePath}
            exportPath={pagePath}
            columns={[{
                title: '序号',
                dataIndex: 'index',
                width: 50,
                fixed: "left",
                render: (text: any, item: any, index: any) => <span>{index + 1}</span>
            },
            ...(tabs === 1 ? stock : inStockDetails),
            ]}
            extraOperation={<>
                <Upload
                    accept=".xls,.xlsx"
                    action={() => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl + '/tower-storage/materialStock/auxiliary/masterplate/import'
                    }}
                    headers={
                        {
                            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    showUploadList={false}
                    onChange={(info) => {
                        if (info.file.response && !info.file.response?.success) {
                            message.warning(info.file.response?.msg)
                        } else if (info.file.response && info.file.response?.success) {
                            message.success('导入成功！');
                            history.go(0)
                        }
                    }}
                >
                    <Button type="primary" ghost>导入</Button>
                </Upload>
                <Button type="primary" ghost onClick={handleDownload}>模版下载</Button>
                <span>
                    <span >数量合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{count?.num||0}</span></span>
                    <span >重量合计（吨）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{count?.weight||0}</span></span>
                    <span >含税金额合计（元）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{count?.totalTaxPrice||0}</span></span>
                    <span >不含税金额合计（元）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{count?.totalPrice||0}</span></span>
                </span>
                <div style={{ width: "2000px" }}>
                    <Radio.Group defaultValue={tabs} onChange={handleRadioChange}>
                        <Radio.Button value={1}>库存列表</Radio.Button>
                        <Radio.Button value={2}>详细库存</Radio.Button>
                    </Radio.Group>
                </div>
            </>
            }
            filterValue={filterValue}
            onFilterSubmit={(value: any) => {
                if (value.date) {
                    const formatDate = value.date.format("YYYY-MM-DD")
                    value.balanceTime = `${formatDate} 23:59:59`
                    delete value.date
                }
                if (value.length) {
                    value.lengthMin = value.length.lengthMin
                    value.lengthMax = value.length.lengthMax
                }
                if (value.locatorId) {
                    const locator = value.locatorId.split("-")
                    value.reservoirId = locator[0]
                    value.locatorId = locator[1]
                }
                // setFilterValue(value)
                run(value)
                return value
            }}
            searchFormItems={[
                {
                    name: 'warehouseId',
                    label: '仓库',
                    children: <Select
                        style={{ width: 100 }}
                        defaultValue={""}
                        onChange={(value: any) => {
                            console.log(value)
                            setWarehouseId(value)
                        }}
                    >
                        <Select.Option value='' key={'aa'}>全部</Select.Option>
                        {
                            data?.warehouseList?.map((item: { id: string, name: string }) => <Select.Option
                                value={item.id}
                                key={item.id}>{item.name}</Select.Option>)
                        }
                    </Select>
                },
                {
                    name: 'materialName',
                    label: '品名',
                    children: <Input width={100} maxLength={200} placeholder="请输入品名" />
                },
                {
                    name: 'materialCategoryName',
                    label: '类型',
                    children: <TreeSelect
                        style={{ width: 180 }}
                        treeData={data?.classify || []}
                    />
                },
                {
                    name: "locatorId",
                    label: "库位/区位",
                    children: <TreeSelect
                        style={{ width: 130 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择"
                        showCheckedStrategy="SHOW_ALL"
                        treeDefaultExpandAll
                        treeData={locatorData}
                    />
                },
                {
                    name: 'structureSpec',
                    label: '规格',
                    children: <Input width={100} maxLength={200} placeholder="请输入规格" />
                },
                {
                    name: 'date',
                    label: '结存日期',
                    children: <DatePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                },
                {
                    name: 'fuzzyQuery',
                    label: '模糊查询项',
                    children: <Input width={100} maxLength={200} placeholder="请输入规格/品名" />
                }
            ]}
        />
    </>)
}

