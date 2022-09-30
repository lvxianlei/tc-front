import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { useHistory } from 'react-router';
import { Input, Select, Modal, message, Spin, Button, Upload, InputNumber, Radio } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import { materialStandardOptions, materialTextureOptions } from '../../../configuration/DictionaryOptions';
import { Attachment, AttachmentRef, SearchTable as Page } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { exportDown } from '../../../utils/Export';
import AuthUtil from '../../../utils/AuthUtil';
import { stock, stockDetail } from "./data.json"
import '../StockPublicStyle.less';

export default function RawMaterialStock(): React.ReactNode {
    const history = useHistory()
    const [tabs, setTabs] = useState<1 | 2>(1)
    const [pagePath, setPagePath] = useState<string>("/tower-storage/materialStock")
    const [filterValue, setFilterValue] = useState({})
    const { data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const [warehouseList, askPrice, classify] = await Promise.all<any>([
                RequestUtil.get(`/tower-storage/warehouse/tree?type=0`),
                RequestUtil.get(`/tower-storage/materialStock/getMaterialStockStatics`),
                RequestUtil.get(`/tower-system/materialCategory/category`)
            ])
            resole({ warehouseList, ...askPrice, classify })
        } catch (error) {
            reject(error)
        }
    }))

    const handleDownload = () => {
        exportDown(`/tower-storage/materialStock/masterplate/export`)
    }

    const handleRadioChange = (event: any) => {
        if (event.target.value === 1) {
            setTabs(1)
            setPagePath("/tower-storage/materialStock")
            return
        }
        if (event.target.value === 2) {
            setTabs(2)
            setPagePath("/tower-storage/outStock")
            return
        }
    }

    return (<Page
        path={pagePath}
        exportPath={pagePath}
        columns={[{
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left",
            render: (text: any, item: any, index: any) => <span>{index + 1}</span>
        },
        ...(tabs === 1 ? stock : stockDetail),
        ]}
        extraOperation={<>
            <Upload
                accept=".xls,.xlsx"
                action={() => {
                    const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                    return baseUrl + '/tower-storage/materialStock/masterplate/import'
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
            <div>数量合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{data?.num}</span> 重量合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{data?.weight}</span></div>
            <div style={{ width: "2000px" }}>
                <Radio.Group defaultValue={1} onChange={handleRadioChange}>
                    <Radio.Button value={1}>出库单列表</Radio.Button>
                    <Radio.Button value={2}>出库明细</Radio.Button>
                </Radio.Group>
            </div>
        </>
        }
        filterValue={filterValue}
        onFilterSubmit={(value: any) => {
            if (value.length) {
                value.lengthMin = value.length.lengthMin
                value.lengthMax = value.length.lengthMax
            }
            setFilterValue(value)
            return value
        }}
        searchFormItems={[
            {
                name: 'warehouseId',
                label: '仓库',
                children: <Select style={{ width: "100px" }} defaultValue={""}>
                    <Select.Option value='' key={'aa'}>全部</Select.Option>
                    {
                        data?.warehouseList?.map((item: { id: string, name: string }) => <Select.Option
                            value={item.id}
                            key={item.id}>{item.name}</Select.Option>)
                    }
                </Select>
            },
            {
                name: 'structureTexture',
                label: '材质',
                children: <Select style={{ width: "100px" }} defaultValue={""}>
                    <Select.Option value='' key={'aa'}>全部</Select.Option>
                    {
                        materialTextureOptions?.map((item: { id: string, name: string }) => <Select.Option
                            value={item.name}
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
                name: 'materialStandard',
                label: '标准',
                children: <Select style={{ width: "100px" }} defaultValue={""}>
                    <Select.Option value='' key={'aa'}>全部</Select.Option>
                    {
                        materialStandardOptions?.map((item: { id: string, name: string }) => <Select.Option
                            value={item.id}
                            key={item.id}>{item.name}</Select.Option>)
                    }
                </Select>
            },
            {
                name: 'classifyId',
                label: '分类',
                children: <Select style={{ width: "100px" }} defaultValue={""}>
                    <Select.Option value='' key={'aa'}>全部</Select.Option>
                    {
                        data?.classify?.map((item: { materialCategoryId: string, materialCategoryName: string }) => <Select.Option
                            value={item.materialCategoryId}
                            key={item.materialCategoryId}>{item.materialCategoryName}</Select.Option>)
                    }
                </Select>
            },
            {
                name: 'length',
                label: '长度',
                children: <InputNumber />
            },
            {
                name: 'width',
                label: '宽度',
                children: <InputNumber />
            },
            {
                name: 'fuzzyQuery',
                label: '模糊查询项',
                children: <Input width={100} maxLength={200} placeholder="请输入规格/品名" />
            }
        ]}
    />)
}

