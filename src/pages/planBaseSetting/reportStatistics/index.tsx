import React, {  useState } from "react"
import { Table,Form,Input,Button,Pagination } from "antd"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import styles from "../../common/CommonTable.module.less";


export default () => {
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({});
    const [form] = Form.useForm()
    // 表格数据源
    const [data, setDataList] = useState<any[]>([]);
    const [levelTwoData, setLevelTwoData] = useState<any[]>([]);
    const [levelThreeData, setLevelThreeData] = useState<any[]>([]);
    const [levelFourData, setLevelFourData] = useState<any[]>([]);
    // 表格展开项
    const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]);
    const [twoLevelRowKeys, setTwoLevelRowKeys] = useState<any[]>([]);
    const [threeLevelRowKeys, setThreeLevelRowKeys] = useState<any[]>([]);
    const [total,setTotal] = useState<number>(0);
    const [current,setCurrent] = useState<number>(1);
    const [size,setSize] = useState<number>(20);

    const onReset = () => {
        form.resetFields();
        setCurrent(1)
        getData(1)
    };
    // 获取表格数据请求
    // 一级表格数据
    const { data:productReport,run:getData } = useRequest<any[]>((currents= current,sizes= size) => new Promise(async (resole, reject) => {
        try {
            console.log(currents,sizes)
            const result: any = await RequestUtil.get("/tower-aps/productReport/getPlanStatistics",{
                planNumber:form.getFieldsValue()?.planNumber,
                productCategory:form.getFieldsValue()?.productCategory,
                issueOrderNumber:form.getFieldsValue()?.issueOrderNumber,
                current:currents,
                size:sizes
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }),{
        manual: false,
        onSuccess:(data:any)=>{
            console.log(data)
            setDataList(data?.records)
            setTotal(data?.total)
            // reset
            setLevelTwoData([])
            setLevelThreeData([])
            setLevelFourData([])
            setExpandedRowKeys([])
            setTwoLevelRowKeys([])
            setThreeLevelRowKeys([])
        }
    })
    // 二层表格数据
    const { data:twoLevelTableData,run:getTwoLevelTableData } = useRequest<any[]>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get("/tower-aps/productReport/getProductCategoryStatistics?planId=" + id)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }),{
        manual: true,
        onSuccess:(data:any)=>{
            console.log(data)
            setLevelTwoData(data?.map((item:any,index:number)=>{
                return {
                    ...item,
                    key:item.id + "_" + index
                }
            }))
        }
    })
    // 三层表格数据
    const { data:threeLevelTableData,run:getThreeLevelTableData } = useRequest<any[]>((issueOrderNumber: string,planNumber: string,productCategoryNumber:string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/productReport/getIssueOrderStatistics`,{
                    issueOrderNumber,
                    planNumber,
                    productCategoryNumber
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }),{
        manual: true,
        onSuccess:(data:any)=>{
            console.log(data)
            setLevelThreeData(data?.map((item:any,index:number)=>{
                return {
                    ...item,
                    key:item.id + "_" + index
                }
            }))
        }
    })
    // 四层表格数据
    const { data:fourLevelTableData,run:getFourLevelTableData } = useRequest<any[]>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get("/tower-aps/productReport/getCyclePlanStatistics?issueOrderId=" + id)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }),{
        manual: true,
        onSuccess:(data:any)=>{
            console.log(data)
            setLevelFourData(data?.map((item:any,index:number)=>{
                return {
                    ...item,
                    key:item.id + "_" + index
                }
            }))
        }
    })
    const columns = [
        {
            title: "计划号",
            width: 150,
            dataIndex: "planNumber",
        },
        {
            title: "塔型数量",
            width: 100,
            dataIndex: "productCategoryNum",
        },
        {
            title: "基数",
            width: 100,
            dataIndex: "productNum",
        },
        {
            title: "重量",
            width: 100,
            dataIndex: "weight",
        },
        {
            title: "放样下发数量",
            width: 100,
            dataIndex: "loftingNum",
        },
        {
            title: "拆分批次状态",
            width: 100,
            dataIndex: "branchStatus",
        },
        {
            title: "生产单元组状态",
            width: 120,
            dataIndex: "unitStatus",
        },
    ]
    // 表格展开事件
    const expand = (expanded:any, record:any,level:number) => {
        // console.log(expanded,record)
        if(level == 1){
            if(expanded){
                if(record?.id){
                    getTwoLevelTableData(record?.id)
                    setExpandedRowKeys([record?.id])
                    // reset
                    setLevelThreeData([])
                    setLevelFourData([])
                    setTwoLevelRowKeys([])
                    setThreeLevelRowKeys([])

                }
            }else{
                setExpandedRowKeys(expandedRowKeys.filter(item=>item.id === record?.id))
            }
        }
        if(level == 2){
            if(expanded){
                if(record?.id){
                    // productCategoryNumber
                    getThreeLevelTableData(record?.issueOrderNum,record?.planNumber,record?.productCategory)
                    setTwoLevelRowKeys([record?.key])
                    setLevelFourData([])
                    setThreeLevelRowKeys([])
                }
            }else{
                setTwoLevelRowKeys(twoLevelRowKeys.filter(item=>item.key === record?.key))
            }
        }
        if(level == 3){
            if(expanded){
                if(record?.id){
                    getFourLevelTableData(record?.key)
                    setThreeLevelRowKeys([record?.key])
                }
            }else{
                setThreeLevelRowKeys(threeLevelRowKeys.filter(item=>item.key === record?.key))
            }
        }
    }
    const showTotal = (total:number)=> `共 ${total} 条记录`;

    const currentChange = (nowCurrent:number,newSize:any) => {
        console.log(nowCurrent,newSize)
        setCurrent(nowCurrent);
        getData(nowCurrent,newSize)
    };
    const sizeChange = (nowCurrent:number,newSize:number) => {
        setSize(newSize);
        // getData(nowCurrent,newSize)
    };

    const levelTwoTable = ()=>{
        const columnTwo = [
            {
                title: "塔型",
                dataIndex: "productCategory"
            },
            {
                title: "基数",
                dataIndex: "productNum"
            },
            {
                title: "重量",
                dataIndex: "weight"
            },
            {
                title: "杆塔号",
                dataIndex: "productNumber",
                render: (text:string) => <a>{text}</a>,
            },
            {
                title: "放样下发状态",
                dataIndex: "loftingStatus"
            },
            {
                title: "拆分批次杆塔数",
                dataIndex: "branchNum"
            },
            {
                title: "分配生产单元组批次/总批次",
                dataIndex: "unitGroupNum"
            },
        ]
        return <Table columns={columnTwo}
                      dataSource={levelTwoData}
                      rowKey={(item:any)=>item?.key}
                      expandable={{ expandedRowRender:levelThreeTable}}
                      expandedRowKeys={twoLevelRowKeys}
                      onExpand={(expanded:any, record:any)=>expand(expanded, record,2)}
                      size="small"
                      pagination={false}
                      />
    }
    const levelThreeTable = ()=>{
        const columnThree = [
            {
                title: "下达单号",
                dataIndex: "issueOrderNumber"
            },
            {
                title: "周期计划号",
                dataIndex: "cyclePlanNumber"
            },
            {
                title: "杆塔号",
                dataIndex: "productNumber",
                render: (text:string) => <a>{text}</a>,
            },
            {
                title: "重量",
                dataIndex: "weight"
            },
            {
                title: "构件生产单元分配量",
                dataIndex: "partAllocationUnitNum"
            },
            {
                title: "组焊生产单元分配量",
                dataIndex: "cyclePlanRefStatus"
            },
            {
                title: "周期计划引用状态",
                dataIndex: "planNumber"
            },
            {
                title: "下发mes状态",
                dataIndex: "sendMesStatus"
            },
        ]
        return <Table columns={columnThree}
                      dataSource={levelThreeData}
                      rowKey={(item:any)=>item?.key}
                      expandedRowKeys={threeLevelRowKeys}
                      expandable={{ expandedRowRender:levelFourTable}}
                      onExpand={(expanded:any, record:any)=>expand(expanded, record,3)}
                      size="small"
                      pagination={false}
                      />
    }
    const levelFourTable = ()=>{
        const columnFour = [
            {
                title: "周期计划号",
                dataIndex: "cyclePlanNumber"
            },
            {
                title: "备料状态",
                dataIndex: "materialStatus"
            },
            {
                title: "零件下发状态",
                dataIndex: "partListStatus"
            },
            {
                title: "组焊件下发状态",
                dataIndex: "weldListStatus"
            },
            {
                title: "包装清单下发状态",
                dataIndex: "packListStatus"
            },
            {
                title: "配料清单下发状态",
                dataIndex: "materialListStatus"
            }
        ]
        return <Table columns={columnFour}
                      dataSource={levelFourData}
                      size="small"
                      rowKey={(item:any)=>item?.key}
                      pagination={false}
                      />
    }
    return <>
        <Form form={form} name="search" layout="inline" style={{marginBottom:"12px"}}>
            <Form.Item
                name="planNumber"
                label="计划号"
            >
                <Input placeholder="计划号" />
            </Form.Item>
            <Form.Item
                name="productCategory"
                label="塔型"
            >
                <Input placeholder="塔型" />
            </Form.Item>
            <Form.Item
                name="issueOrderNumber"
                label="下达单号"
            >
                <Input placeholder="下达单号" />
            </Form.Item>
            <Form.Item >
                <Button type="primary" onClick={()=>getData()}>
                    查询
                </Button>
            </Form.Item>
            <Form.Item>
                <Button htmlType="reset" onClick={onReset}>
                    重置
                </Button>
            </Form.Item>

        </Form>
        <Table
            columns={columns}
            expandable={{ expandedRowRender:levelTwoTable}}
            expandedRowKeys={expandedRowKeys}
            dataSource={data || []}
            rowKey={item=>item?.id}
            onExpand={(expanded:any, record:any)=>expand(expanded, record,1)}
            pagination={false}
            size="small"
        />
        <footer className={styles.pagenationWarp}>
        <Pagination
            size="small"
            total={total}
            showTotal={showTotal}
            showSizeChanger
            current={current}
            pageSize={size}
            onChange={currentChange}
            onShowSizeChange = {sizeChange}
        />
        </footer>
    </>


}