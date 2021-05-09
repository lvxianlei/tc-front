/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';

import AsyncComponent from '../../components/AsyncComponent';

export interface ITCHeaderProps {}
export interface ITCHeaderState {}

/**
 * @TODO Describe the class
 */
export default class TCHeader extends AsyncComponent<ITCHeaderProps, ITCHeaderState> {

    /**
     * @description Renders TCHeader
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <>Header</>
        );
    }
}