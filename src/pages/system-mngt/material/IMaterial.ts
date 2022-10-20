/**
 * @author lixy
 * @copyright © 2021 Cory. All rights reserved
 * More info please see {@link http://47.111.254.114:3001/project/41/interface/api/6860}
 */

import { StringMap } from "i18next";

 export interface IMaterial {
    readonly weightAlgorithm?: string;
    readonly clientId?: string;
    readonly spec?: string;
    readonly smallCategory?: string;
    readonly shortcutCode?: string;
    readonly rowMaterial?: string;
    readonly id?: string;
    readonly proportion?: number;
    readonly materialName?: string;
    readonly middleCategory?: string;
    readonly materialTexture?: string;
    readonly materialCode?: string;
    readonly materialCategory?: string;
    readonly materialCategoryName?: string;
    readonly roleIds?: string;
    readonly field_3?: number;
    readonly description?: string;
    readonly unit?: string;
    readonly material?: string;
    readonly materialType?: string;
    readonly materialTypeName?: string;
    readonly directMaterialType?: string;
    readonly directMaterialTypeName?: string;
}


export interface IMaterialType {
    name?: string;
    code?: string;
    level?: number;
    parentId?: string;
    id?: string;
    readonly treeName?: string;
    readonly children?: IMaterialType[]
    readonly ruleFront?: string;
    readonly unit?: string;
    readonly firstCode?: string;
    readonly sonName?: string;
}



export interface IMaterialTree {
    readonly id: number;
    readonly parentId: number|string;
    readonly treeName: string;
    readonly checked: boolean;
    readonly level: string;
    readonly code: number;
    readonly name: string;
    readonly children: IMaterialTree[];
}