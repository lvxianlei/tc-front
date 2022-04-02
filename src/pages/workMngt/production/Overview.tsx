import React, { useState, useRef } from "react"
import { Button, message, Spin, Modal } from 'antd'
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom'
import { DetailContent, DetailTitle, CommonTable } from '../../common'
import Ingredients from "./Ingredients"
import { ConstructionDetails, ProductionIngredients } from "./productionData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
// 引入配料
import IngredientsModal from "./ingredientsLayer/IngredientsModal";
import ExportList from '../../../components/export/list';

interface IngredientsRef {
    onSubmit: (type: "save" | "saveAndSubmit") => void
}
export default function Overview() {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const params = useParams<{ id: string, materialTaskCode: string, productCategoryName: string, loftingState: string }>()
    const ingredientRef = useRef<IngredientsRef>({ onSubmit: () => { } })
    const [ingredientsvisible, setIngredientsvisible] = useState<boolean>(false);
    const [isExport, setIsExportStoreList] = useState(false)
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const { loading, data } = useRequest<{ detail: any[], programme: any[] }>(() => new Promise(async (resole, reject) => {
        try {
            const detail: any[] = await RequestUtil.get(`/tower-supply/produceIngredients/detail/${params.id}`)
            const programme: any[] = await RequestUtil.get(`/tower-supply/produceIngredients/programme/${params.id}`)
            resole({ detail, programme })
        } catch (error) {
            reject(error)
        }
    }))

    const handleModelOk = async (type: "save" | "saveAndSubmit") => {
        await ingredientRef.current.onSubmit(type)
        message.success("配料成功...")
        setVisible(false)
    }

    return <>
        <Modal title="配料" width={1011} footer={[
            <Button key="close" type="primary" ghost onClick={() => setVisible(false)}>关闭</Button>,
            <Button key="save" type="primary" onClick={() => handleModelOk("save")}>保存</Button>,
            <Button key="saveAndSubmit" type="primary" onClick={() => handleModelOk("saveAndSubmit")}>保存并提交</Button>
        ]} visible={visible} onCancel={() => setVisible(false)}>
            <Ingredients ref={ingredientRef} />
        </Modal>
        {/* 新增配料 */}
        <IngredientsModal
            id={params.id}
            materialTaskCode={params.materialTaskCode}
            productCategoryName={params.productCategoryName}
            visible={ingredientsvisible}
            onOk={() => {
                history.go(0);
                setIngredientsvisible(false)
            }}
            onCancel={() => setIngredientsvisible(false)}
        />
        <div style={{marginTop: 20, paddingLeft: 20, boxSizing: "border-box"}}>
            <Button key="export" type="primary" onClick={() => {
                    setIsExportStoreList(true)
                }} ghost style={{ marginRight: 16 }}>导出</Button>
            {
                (params.loftingState as any) * 1 === 1 && <Button key="peiliao" type="primary" ghost onClick={() => setIngredientsvisible(true)} style={{ marginRight: 16 }}>配料</Button>
            }
            
        </div>
        <DetailContent title={[]} operation={[
            <Button type="ghost" key="cancel" onClick={() => history.go(-1)}>返回</Button>
        ]}>
            <Spin spinning={loading}>
                <CommonTable haveIndex columns={ConstructionDetails.map((item: any) => {
                    // if (item.dataIndex === "alreadyIngredients") {
                    //     return ({
                    //         ...item,
                    //         render: (text: any, records: any) => {
                    //             const formatText = [-1, "-1", 0, "0"].includes(text) ? "0" : text
                    //             const formatNoIngredients = [-1, "-1", 0, "0"].includes(records.noIngredients) ? "0" : records.noIngredients
                    //             return <>{formatText} / {formatNoIngredients}</>
                    //         }
                    //     })
                    // }
                    return item
                })} dataSource={data?.detail || []} />
                <DetailTitle title="生产配料方案" />
                <CommonTable haveIndex columns={ProductionIngredients} dataSource={data?.programme || []} />
            </Spin>
        </DetailContent>
        {isExport ? <ExportList
            history={history}
            location={location}
            match={match}
            columnsKey={() => ConstructionDetails as any[]}
            current={1}
            size={data?.programme.length || 0}
            total={data?.programme.length || 0}
            url={`/tower-supply/produceIngredients/detail/${params.id}`}
            serchObj={{}}
            closeExportList={() => { setIsExportStoreList(false) }}
        /> : null}
    </>
}