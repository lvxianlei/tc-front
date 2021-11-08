import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';

/**
 * @protected
 * @description 部门处理
 */

export function wrapRole2DataNode (roles: (any & SelectDataNode)[] = []): SelectDataNode[] {
    roles && roles.forEach((role: any & SelectDataNode): void => {
        role.value = role.id;
        role.isLeaf = false;
        if (role.children && role.children.length > 0) {
            wrapRole2DataNode(role.children);
        }
    });
    return roles;
}