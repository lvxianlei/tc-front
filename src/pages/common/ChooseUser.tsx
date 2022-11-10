import React, { FC, useEffect, useState } from "react"
import { Col, Input, Modal, Row, Select, Spin, TransferProps, Tree, Transfer } from "antd"
import { PlusOutlined, ApartmentOutlined } from "@ant-design/icons"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import CommonTable from "./CommonTable"
import { TransferItem } from "antd/lib/transfer"
import Table, { ColumnsType } from "antd/lib/table"
import { difference } from "@antv/util"
const userColumns: any[] = [
    {
        "title": "部门",
        "dataIndex": "deptName"
    },
    {
        "title": "姓名",
        "dataIndex": "name"
    }
]

const formatTreeData: ((treeData: any[], type?: "group") => any[]) = (treeData = [], type) => {
    return treeData?.map((item: any) => {
        if (item.children) {
            return ({
                ...item,
                title: type === "group" ? `${item.name}-${item.type}` : item.name,
                key: type === "group" ? item.employeeId : item.id,
                icon: <ApartmentOutlined />,
                children: formatTreeData(item.children)
            })
        }
        return ({
            ...item,
            title: type === "group" ? `${item.name}-${item.type}` : item.name,
            key: type === "group" ? item.employeeId : item.id,
            icon: <ApartmentOutlined />,
        })
    })
}

export interface ChooseUserData {
    [key: string]: any
}

interface PagenationProps {
    current: number
    size: number
}

interface TableTransferProps {
    [key: string]: any
}

const TableTransfer = ({ targetKeys, ...restProps }: TableTransferProps) => {
    const [chooseType, setChooseType] = useState<"dept" | "group">("dept")
    const [filterId, setFilterId] = useState<string>("")
    const [rightDataSource, setRightDataSource] = useState<any[]>([])
    const [pagenation, setPagenation] = useState<PagenationProps>({
        current: 1,
        size: 20
    })

    const [groupPagenation, setGroupPagenation] = useState<PagenationProps>({
        current: 1,
        size: 20
    })

    const { loading: deptLoading, data: deptData } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const deptTree: any = await RequestUtil.get<{ data: any }>("/tower-system/department")
            resolve(deptTree)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: groupLoading, data: groupData } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const deptTree: any = await RequestUtil.get<{ data: any }>("/tower-system/noticeGroup")
            resolve(deptTree)
        } catch (error) {
            reject(error)
        }
    }), {
        ready: chooseType === "group",
        refreshDeps: [JSON.stringify(groupPagenation)]
    })

    const { loading, data: userData } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const result: any = await RequestUtil.get<{ data: any }>("/tower-system/employee", { dept: filterId })
            resolve({
                ...result,
                records: result?.records?.map((item: any) => ({
                    ...item,
                    key: item.id
                }))
            })
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [pagenation.current, pagenation.size, filterId] })

    const handleSelect = (event: any) => setFilterId(event)

    return (
        <Transfer targetKeys={targetKeys} {...restProps}>
            {({
                direction,
                onItemSelectAll,
                onItemSelect,
                selectedKeys: listSelectedKeys,
                disabled: listDisabled
            }) => {

                const rightDataSource = userData?.records?.filter((item: any) =>
                    targetKeys.includes(item.id)
                )

                const leftDataSource = userData?.records?.map((item: any) => ({
                    ...item,
                    disabled: targetKeys.includes(item.id)
                }))

                return <>
                    {direction === "left" && <Row>
                        <Col span={9} style={{ maxHeight: 600, overflowY: "auto" }}>
                            <div>
                                <span>选择方式：</span>
                                <Select
                                    value={chooseType}
                                    style={{ width: 160, height: 32 }}
                                    onChange={(value: "dept" | "group") => setChooseType(value)}
                                >
                                    <Select.Option key="dept" value="dept">按部门</Select.Option>
                                    <Select.Option key="group" value="group">按分组</Select.Option>
                                </Select>
                            </div>
                            <Spin spinning={deptLoading || groupLoading}>
                                {chooseType === "dept" && <Tree.DirectoryTree
                                    showIcon
                                    defaultExpandAll
                                    onSelect={handleSelect}
                                    treeData={formatTreeData(deptData)}
                                />}
                                {chooseType === "group" && <Tree.DirectoryTree
                                    showIcon
                                    defaultExpandAll
                                    onSelect={handleSelect}
                                    treeData={formatTreeData(groupData?.records || [], "group")}
                                />}
                            </Spin>
                        </Col>
                        <Col span={15}>
                            <Table
                                bordered={false}
                                rowSelection={{
                                    getCheckboxProps: (item) => ({
                                        disabled: listDisabled || item.disabled
                                    }),
                                    onSelectAll(selected, selectedRows) {
                                       console.log(selectedRows)
                                    },
                                    onSelect(selectedRows, selected) {
                                        onItemSelect(selectedRows, selected);
                                    },
                                    selectedRowKeys: listSelectedKeys.map((item: any) => item.id),
                                }}
                                size="small"
                                columns={userColumns}
                                dataSource={direction === "left" ? leftDataSource : rightDataSource}
                            />
                        </Col>
                    </Row>}
                </>
            }}
        </Transfer>
    )
}

const ChooseUserContent: FC<{ [key: string]: any }> = ({ }) => {
    const [targetRows, setTargetRows] = useState<any[]>([]);

    const handleTransferChange = (nextTargetRows: any[]) => setTargetRows(nextTargetRows)

    return (<TableTransfer
        targetKeys={targetRows.map((item: any) => item.id)}
        showSelectAll={false}
        listStyle={({ direction }: any) => ({
            flex: direction === "left" ? "1 1 65%" : "1 1 35%",
        })}
        onChange={handleTransferChange} />)
}

const ChooseUser: FC<ChooseUserData> = ({ data, ...props }) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [value, setValue] = useState<{ id: string, value: string, records: any }>({ value: (props as any).value, id: "", records: [] })

    useEffect(() => {
        setValue(props.value || ({ value: (props as any).value, id: "", records: [] }))
    }, [JSON.stringify(props.value || "")])

    const handleOk = () => {
        setVisible(false)
    }

    const formatValue = () => typeof props.value === "string" ? props.value : value?.value
    return <>
        <Modal
            width={1101}
            title={`选择${data.title}`}
            destroyOnClose
            visible={visible}
            onOk={handleOk}
            onCancel={() => setVisible(false)}>
            <ChooseUserContent />
        </Modal>
        <Input
            {...props}
            disabled={data.disabled}
            style={{ width: "100%", height: "100%", ...props.style }}
            onClick={(data.readOnly === undefined || data.readOnly) ? (() => !data.disabled && setVisible(true)) : (() => { })}
            readOnly={data.readOnly === undefined ? true : data.readOnly}
            value={formatValue()}
            suffix={<PlusOutlined onClick={() => !data.disabled && setVisible(true)} />} />
    </>
}

export default ChooseUser