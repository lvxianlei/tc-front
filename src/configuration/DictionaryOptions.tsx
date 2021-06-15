import ApplicationContext from "./ApplicationContext";
import { IDict } from "./IApplicationContext";

const dictionary: Record<string, IDict[] | undefined> | undefined = ApplicationContext.get().dictionaryOption;

export enum dictionaryEnums {
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

if(dictionary) {
    var product_type: IDict[] | undefined = dictionary[dictionaryEnums.PRODUCT_TYPE];
    var voltage_grade: IDict[] | undefined = dictionary[dictionaryEnums.VOLTAGE_GRADE];
    var price: IDict[] | undefined = dictionary[dictionaryEnums.PRICE];
    var material_standard: IDict[] | undefined = dictionary[dictionaryEnums.MATERIAL_STANDARD];
    var currency_type: IDict[] | undefined = dictionary[dictionaryEnums.CURRENCY_TYPE];
    var tax_rate: IDict[] | undefined = dictionary[dictionaryEnums.TAX_RATE];
    var refund_mode: IDict[] | undefined = dictionary[dictionaryEnums.REFUND_MODE];
    var client_type: IDict[] | undefined = dictionary[dictionaryEnums.CLIENT_TYPE];
    var win_bid_type: IDict[] | undefined = dictionary[dictionaryEnums.WIN_BID_TYPE];
    var sale_type: IDict[] | undefined = dictionary[dictionaryEnums.SALE_TYPE];
}

export const productTypeOptions = product_type;
export const voltageGradeOptions = voltage_grade;
export const priceOptions = price;
export const materialStandardOptions = material_standard;
export const currencyTypeOptions = currency_type;
export const taxrateOptions = tax_rate;
export const refundModeOptions = refund_mode;
export const clientTypeOptions = client_type;
export const winBidTypeOptions = win_bid_type;
export const saleTypeOptions = sale_type;