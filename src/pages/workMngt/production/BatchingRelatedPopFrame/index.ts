export interface EditProps {
    id?: string
    visible: boolean
    hanleInheritSure: (data: any) => void
    meterNumber?: List[] // 选择米数
    schemeComparison?: SchemeComparisonList[] // 对比方案数据
    allocatedScheme?: any[] // 已配方案的数据
    inheritScheme?: any[] // 继承一次方案
}

interface List {
    meterNumber: string
}

interface SchemeComparisonList {
    key?: string
    calculation?: string
    disassemblyNumber?: number
    meterNumber?: string
    numberAll?: number
    surplusMaaterial?: number
    [key: string]: any
}