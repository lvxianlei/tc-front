import ApplicationContext from "./ApplicationContext";
import { IDict } from "./IApplicationContext";

const dictionary: Record<string, IDict[] | undefined> | undefined = ApplicationContext.get().dictionaryOption;

export enum DictionaryEnums {
    PRODUCT_TYPE = 101,
    VOLTAGE_GRADE = 102,
    UNIT = 103,
    MATERIAL_STANDARD = 104,
    CURRENCY_TYPE = 111,
    TAX_RATE = 112,
    REFUND_MODE = 113,
    CLIENT_TYPE = 121,
    WIN_BID_TYPE = 122,
    SALE_TYPE = 123,
    BOLT_TYPE = 105
}

let productType: IDict[] | undefined = [];
let voltageGrade: IDict[] | undefined = [];
let unit: IDict[] | undefined = [];
let materialStandard: IDict[] | undefined = [];
let currencyType: IDict[] | undefined = [];
let taxRate: IDict[] | undefined = [];
let refundMode: IDict[] | undefined = [];
let clientType: IDict[] | undefined = [];
let winBidType: IDict[] | undefined = [];
let saleType: IDict[] | undefined = [];
let boltType: IDict[] | undefined = [];
if (dictionary) {
    productType = dictionary[DictionaryEnums.PRODUCT_TYPE];
    voltageGrade = dictionary[DictionaryEnums.VOLTAGE_GRADE];
    unit = dictionary[DictionaryEnums.UNIT];
    materialStandard = dictionary[DictionaryEnums.MATERIAL_STANDARD];
    currencyType = dictionary[DictionaryEnums.CURRENCY_TYPE];
    taxRate = dictionary[DictionaryEnums.TAX_RATE];
    refundMode = dictionary[DictionaryEnums.REFUND_MODE];
    clientType = dictionary[DictionaryEnums.CLIENT_TYPE];
    winBidType = dictionary[DictionaryEnums.WIN_BID_TYPE];
    saleType = dictionary[DictionaryEnums.SALE_TYPE];
    boltType = dictionary[DictionaryEnums.BOLT_TYPE];
}

export const productTypeOptions = productType;  //产品类型
export const voltageGradeOptions = voltageGrade;  //电压等级
export const unitOptions = unit; //计量单位
export const materialStandardOptions = materialStandard; //材料标准
export const currencyTypeOptions = currencyType; //币种
export const taxRateOptions = taxRate; //税率
export const refundModeOptions = refundMode; //来款方式
export const clientTypeOptions = clientType; //客户类型
export const winBidTypeOptions = winBidType; //中标类型
export const saleTypeOptions = saleType; //销售类型
export const boltTypeOptions = boltType; //螺栓类型