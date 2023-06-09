// 原材料----计算
interface WeightParams {
    width: number | string
    length: number | string
    weightAlgorithm: number
    proportion: number | string
}

interface TotalWeightParmas extends WeightParams {
    num: number | string
}

/**
 *  含税金额 
 * 选择过磅计量时，含税金额 = 单价 × 结算重量
 * @meteringMode 计量方式
*/
export const totalTaxPrice = (
    price: any = 0,
    weight: any = 0
) => Math.round(((price * weight) + Number.EPSILON) * 100) / 100 

/** 
*  不含税金额
* 含税金额 / ( 1 + 材料税率 / 100 )
*/
export const totalUnTaxPrice = (totalTaxPrice: any = 0, taxMode: any = 0) => {
    return (totalTaxPrice / (1 + taxMode / 100)).toFixed(2)
}

/** 
 *  结算重量
 * 选择理算计算时，取理算重量
 * 选择过磅计算时，结算重量 = 过磅重量 *（ 当前原材料理重 / 收货单中所有原材料理重之和 ）
 * 可修改，修改后过磅重量同步调整
 * @meteringMode 计量方式 1:理重；2:过磅
 * @totalPonderationWeight 过磅重量
 * @allTotalWeight 收货单中所有原材料理重之和
 * @totalWeight 理算重量  选填
 */
export const balanceTotalWeight = (
    meteringMode: 1 | 2,
    weight: any = 0,
    num: any = 0,
    totalPonderationWeight: any = 0,
    allTotalWeight: any = 0,
    totalWeight?: any
) => {
    //当前理重
    const currentWeight: any = totalWeight === undefined ? (weight * num).toFixed(5) : totalWeight
    if (meteringMode === 1) {
        return currentWeight
    }
    return (totalPonderationWeight * (currentWeight / allTotalWeight)).toFixed(5) || "0"
}

/**
*  不含税单价
* 含税单价 / ( 1 + 材料税率 / 100 )
* 保留六位小数
*/
export const unTaxPrice = (taxPrice: any = 0, taxMode: any = 0) =>
    (taxPrice / (1 + taxMode / 100)).toFixed(6)

/**
 * 理重
 * @weightAlgorithm 材料计算类型
 * @proportion 比重
 */
export const weight = ({ length = 0, width = 0, weightAlgorithm, proportion = 1 }: WeightParams) => {
    const cLenght = Number(length) * 0.001
    const cWidth = Number(width) * 0.001
    if ([1, "1"].includes(weightAlgorithm)) {
        return (Number(proportion) * cLenght * 0.001).toFixed(5)
    }
    if ([2, "2"].includes(weightAlgorithm)) {
        return (Number(proportion) * cLenght * cWidth * 0.001).toFixed(5)
    }
    return (Number(proportion) * 0.001).toFixed(5)
}
/**
 * 总重量
 */
export const totalWeight = ({ length = 0, width = 0, weightAlgorithm, proportion = 1, num }: TotalWeightParmas) => {
    const cLenght = Number(length) * 0.001
    const cWidth = Number(width) * 0.001
    if ([1, "1"].includes(weightAlgorithm)) {
        return (Number(proportion) * cLenght * Number(num) * 0.001).toFixed(5)
    }
    if ([2, "2"].includes(weightAlgorithm)) {
        return (Number(proportion) * cLenght * cWidth * Number(num) * 0.001).toFixed(5)
    }
    return (Number(proportion) * Number(num) * 0.001).toFixed(5)
}
/**
* 含税运费
* 含税运费=材料所在合同的含税运费单价*结算重量
*/
export const totalTransportTaxPrice = (price: any = 0, weight: any = 0) => {
    return (weight * price).toFixed(2)
}
/**
 * 不含税运费
 * 不含税运费=含税运费/(1+运费税率/100)
 */
export const totalTransportPrice = (totalTransportTaxPrice: any = 0, taxMode: any = 0) => {
    return (totalTransportTaxPrice / (1 + taxMode / 100)).toFixed(2)
}


/**
* 含税装卸费
* 含税装卸费=材料所在合同的含税装卸费单价*结算重量
*/
export const totalUnloadTaxPrice = (price: any = 0, weight: any = 0) => {
    return (weight * price).toFixed(2)
}

/**
 * 不含税装卸费
 * 不含税装卸费=含税装卸费/(1+装卸费税率/100)
 */
export const totalUnloadPrice = (totalUnloadTaxPrice: any = 0, taxMode: any = 0) => {
    return (totalUnloadTaxPrice / (1 + taxMode / 100)).toFixed(2)
}
/**
 * 盈亏重量
 * 盈亏重量 = 盘点重量 - 账目重量 
 */
export const profitAndLossWeight = () => { }

/**
 * 品名&规格
 * 角钢/不锈钢角钢 = 宽度（第一个数字） 厚度（第二个数字）
 * 钢板/花纹钢/不锈钢钢板 = 宽度（系统上的宽度） 厚度（绝对值）
 * 钢管/无缝钢管/直缝钢管 = 厚度（第二个数字）管径（第一个数字）
 * 圆钢 = 管径（第一个数字）
 * 方管（前后数字一致） = 宽度（第一个数字） 厚度（第二个数字）
 * 方管（前后数字不一致） = 宽度（第一个数字，第二个数字） 厚度（第三个数字）
 * 平颈法兰/高颈法兰 = 宽度（第一个数字） 厚度（前面的数字-后面的数字）
 * H型钢 = 宽度（第二个数字） 厚度（第三个数字） 管径（第四个数字） 高度（第一个数字）
 * 扁铁 = 宽度（第二个数字） 厚度（第一个数字）
 */
/**
 * 宽度 
 */
export const calculateWidth = (materialName: any , structureSpec: any, width: any = 0 ) => {
    let calculateWidth: any = ``
    if(['角钢','不锈钢角钢','平颈法兰','高颈法兰'].includes(materialName)){
        calculateWidth = structureSpec?.substring(1).split('*')[0]
    }
    if(['钢板','花纹板','不锈钢钢板'].includes(materialName)){
        calculateWidth = width
    }
    if(['方管'].includes(materialName)){
        if(structureSpec.split('*')[0]===structureSpec.split('*')[1]){
            calculateWidth = structureSpec.split('*')[0]
        }else{
            calculateWidth = `${structureSpec.split('*')[0]},${structureSpec.split('*')[1]}`
        } 
    }
    if(['H型钢','扁铁'].includes(materialName)){
        calculateWidth = structureSpec.split('*')[1]
    }
    return calculateWidth
}
/**
 * 厚度 
 */
export const calculateThickness = (materialName: any , structureSpec: any,) => {
    let calculateThickness: any = ``
    if(['角钢','不锈钢角钢','钢管','无缝钢管','直缝钢管'].includes(materialName)){
        calculateThickness = structureSpec?.split('*')[1]
    }
    if(['钢板','花纹板','不锈钢钢板'].includes(materialName)){
        calculateThickness = Number(structureSpec)>0?Number(structureSpec):0-Number(structureSpec)
    }
    if(['方管','H型钢'].includes(materialName)){
        calculateThickness = structureSpec?.split('*')[2]
    }
    if(['平颈法兰','高颈法兰'].includes(materialName)){
        calculateThickness = structureSpec?.substring(1).split('*')[0]-structureSpec?.substring(1).split('*')[1]
    }
    if(['扁铁'].includes(materialName)){
        calculateThickness = Number(structureSpec?.split('*')[0])
    }
    return calculateThickness
}
/**
 * 管径
 */
export const calculatePipeDiameter = (materialName: any , structureSpec: any,) => {
    let calculatePipeDiameter: any = ``
    if(['钢管','无缝钢管','直缝钢管'].includes(materialName)){
        calculatePipeDiameter = structureSpec?.substring(1).split('*')[0]
    }
    if(['圆钢','螺纹钢'].includes(materialName)){
        calculatePipeDiameter = Number(structureSpec?.substring(1))>0?Number(structureSpec?.substring(1)):0-Number(structureSpec?.substring(1))
    }
    if(['H型钢'].includes(materialName)){
        calculatePipeDiameter = structureSpec?.split('*')[3]
    }
    return calculatePipeDiameter
}
/**
 * 高度 
 */
export const calculateHeight = (materialName: any , structureSpec: any,) => {
    let calculateHeight: any = ``
    if(['H型钢'].includes(materialName)){
        calculateHeight = structureSpec?.substring(2).split('*')[0]
    }
    if(['槽钢','不锈钢槽钢','工字钢'].includes(materialName)){
        calculateHeight = Number(structureSpec?.replace(/[^\d]/g, " "))*10
    }
    return calculateHeight
}