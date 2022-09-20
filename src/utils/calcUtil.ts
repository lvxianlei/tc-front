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
) => (price * weight).toFixed(2)

/** 
*  不含税金额
* 含税金额 / ( 1 + 材料税率 / 100 )
*/
export const totalUnTaxPrice =
    (totalTaxPrice: any = 0, taxMode: any = 0) =>
        (totalTaxPrice / (1 + taxMode / 100)).toFixed(2)

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
    const currentWeight: any = totalWeight === undefined ? (weight * num).toFixed(4) : totalWeight
    if (meteringMode === 1) {
        return currentWeight
    }
    return (totalPonderationWeight * (currentWeight / allTotalWeight)).toFixed(3) || "0"
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
     */
export const weight = ({ length, width, weightAlgorithm, proportion }: WeightParams) => {
    if (weightAlgorithm === 1) {
        return ((Number(proportion || 1) * Number(length || 1)) / 1000 / 1000).toFixed(3)
    }
    if (weightAlgorithm === 2) {
        return (Number(proportion || 1) * Number(length || 1) * Number(width || 0) / 1000 / 1000 / 1000).toFixed(3)
    }
    return (Number(proportion || 1) / 1000).toFixed(3)
}
/**
 * 总重量
 */
export const totalWeight = ({ length, width, weightAlgorithm, proportion, num }: TotalWeightParmas) => {
    if (weightAlgorithm === 1) {
        return ((Number(proportion || 1) * Number(length || 1)) * Number(num || 1) / 1000 / 1000).toFixed(3)
    }
    if (weightAlgorithm === 2) {
        return (Number(proportion || 1) * Number(length || 1) * Number(width || 0) * Number(num || 1) / 1000 / 1000 / 1000).toFixed(3)
    }
    return (Number(proportion || 1) * Number(num || "1") / 1000).toFixed(3)
}
/**
* 含税运费
* 含税运费=材料所在合同的含税运费单价*结算重量
*/
export const totalTransportTaxPrice = (price: any = 0, weight: any = 0) => (weight * price).toFixed(2)
/**
 * 不含税运费
 * 不含税运费=含税运费/(1+运费税率/100)
 */
export const totalTransportPrice = (totalTransportTaxPrice: any = 0, taxMode: any = 0) =>
    (totalTransportTaxPrice / (1 + taxMode / 100)).toFixed(2)

/**
* 含税装卸费
* 含税装卸费=材料所在合同的含税装卸费单价*结算重量
*/
export const totalUnloadTaxPrice = (price: any = 0, weight: any = 0) => (weight * price).toFixed(2)

/**
 * 不含税装卸费
 *  不含税装卸费=含税装卸费/(1+装卸费税率/100)
 */
export const totalUnloadPrice = (totalUnloadTaxPrice: any = 0, taxMode: any = 0) =>
    (totalUnloadTaxPrice / (1 + taxMode / 100)).toFixed(2)

