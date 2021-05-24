import React from "react";

/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
export interface ITabableComponent {

    /**
     * @interface
     * @description 
     * @returns tab items 
     */
    getTabItems(): ITabItem[];
}

export interface ITabItem {
    readonly label: string;
    readonly key: string | number;
    readonly content?: React.ReactNode | React.ReactNode;
}