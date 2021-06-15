import ApplicationContext from "./ApplicationContext";
import { IDict } from "./IApplicationContext";

const dictionary: Record<string, IDict[] | undefined> | undefined = ApplicationContext.get().dictionaryOption;

export enum DictionaryEnums {
    PRODUCT_TYPE = 101,
    VOLTAGE_GRADE = 102,
    PRICE = 103,
    MATERIAL_STANDARD = 104,
    CURRENCY_TYPE = 111,
    TAX_RATE = 112,
    REFUND_MODE = 113,
    CLIENT_TYPE = 121,
    WIN_BID_TYPE = 122,
    SALE_TYPE = 123,
}

let productType: IDict[] | undefined = [];
let voltageGrade: IDict[] | undefined = [];
let price: IDict[] | undefined = [];
let materialStandard: IDict[] | undefined = [];
let currencyType: IDict[] | undefined = [];
let taxRate: IDict[] | undefined = [];
let refundMode: IDict[] | undefined = [];
let clientType: IDict[] | undefined = [];
let winBidType: IDict[] | undefined = [];
let saleType: IDict[] | undefined = [];
if(dictionary) {
    productType = dictionary[DictionaryEnums.PRODUCT_TYPE];
    voltageGrade = dictionary[DictionaryEnums.VOLTAGE_GRADE];
    price = dictionary[DictionaryEnums.PRICE];
    materialStandard = dictionary[DictionaryEnums.MATERIAL_STANDARD];
    currencyType = dictionary[DictionaryEnums.CURRENCY_TYPE];
    taxRate = dictionary[DictionaryEnums.TAX_RATE];
    refundMode = dictionary[DictionaryEnums.REFUND_MODE];
    clientType = dictionary[DictionaryEnums.CLIENT_TYPE];
    winBidType = dictionary[DictionaryEnums.WIN_BID_TYPE];
    saleType = dictionary[DictionaryEnums.SALE_TYPE];
}

export const productTypeOptions = productType;
export const voltageGradeOptions = voltageGrade;
export const priceOptions = price;
export const materialStandardOptions = materialStandard;
export const currencyTypeOptions = currencyType;
export const taxRateOptions = taxRate;
export const refundModeOptions = refundMode;
export const clientTypeOptions = clientType;
export const winBidTypeOptions = winBidType;
export const saleTypeOptions = saleType;