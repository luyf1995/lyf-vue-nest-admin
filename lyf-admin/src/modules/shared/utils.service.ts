import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  /**
   * 是否是空值
   * @param {*} value
   */
  isEmpty(value: any) {
    return value === '' || value === undefined || value === null;
  }
  /**
   * 将数组转化为树状结构，并过滤掉以excludeId为节点的所有子孙节点
   * @param {array} arr
   * @param {number} excludeId 需要过滤的id
   * @return {array}
   */
  arrayToTree(arr, { excludeId }: { excludeId?: number } = {}) {
    const map = {};
    let node;
    const roots = [];

    // 建立哈希表并为每个节点建立子节点数组
    for (let i = 0; i < arr.length; i++) {
      node = {
        ...arr[i],
        children: []
      };
      map[node.id] = node;
    }

    // 添加每个节点到其父节点的子节点数组中
    for (let i = 0; i < arr.length; i++) {
      node = map[arr[i].id];
      if (arr[i].parentId) {
        map[arr[i].parentId].children.push(node);
      } else {
        roots.push(node);
      }
    }

    // 从根节点开始递归过滤掉excludeId 以及其所有的子节点和孙子节点
    function removeNode(node) {
      const parent = map[node.parentId];
      if (!parent) {
        roots.splice(roots.indexOf(node), 1);
      } else {
        parent.children.splice(parent.children.indexOf(node), 1);
      }
    }
    const filterNode = map[excludeId];
    if (filterNode) {
      removeNode(filterNode);
    }

    return roots;
  }
}
