export const calcObj = {
    /**
     *  含税金额 
     * 选择过磅计量时，含税金额 = 单价 × 结算重量
     * @meteringMode 计量方式
    */
    totalTaxPrice: (
        price: any = 0,
        weight: any = 0
    ) => (price * weight).toFixed(2),
    /** 
     *  不含税金额
     * 含税金额 / ( 1 + 材料税率 / 100 )
     */
    totalUnTaxPrice: (totalTaxPrice: any = 0, taxMode: any = 0) =>
        (totalTaxPrice / (1 + taxMode / 100)).toFixed(2),
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
    balanceTotalWeight: (
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
        return (totalPonderationWeight * (currentWeight / allTotalWeight)) || "0"
    },
    /**
     *  不含税单价
     * 含税单价 / ( 1 + 材料税率 / 100 )
     * 保留六位小数
     */
    unTaxPrice: (taxPrice: any = 0, taxMode: any = 0) =>
        (taxPrice / (1 + taxMode / 100)).toFixed(6),
    /**
     *  理算总重量
     * 单重 * 数量
     */
    totalWeight: (weight: any = 0, num: any = 0) => (weight * num).toFixed(4)
}