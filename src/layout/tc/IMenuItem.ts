/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */

export default interface IMenuItem {
    readonly label: string;
    readonly path: string;
    readonly icon?: string;
    readonly authority: string;
    readonly items?: IMenuItem[];
}
