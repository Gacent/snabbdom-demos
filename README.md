# snabbdom-demo学习笔记
> virtualDOM的最好的库之一

## src
1. 01-02为基础使用
2. 03是snabbdom的模块使用方法

## 源码解析
### 核心执行流程
1. 使用h()函数创建js对象（VNODE）描述真实DOM
2. init()设置模块，创建patch()
3. patch()比较新旧VNODE
4. 把变化的内容更新到真实DOM上

> 核心模块：h.ts  vnode.ts  init.ts

### h.ts
> 函数重载概念
返回vnode

### vnode.ts
返回js对象，描述节点的信息

### init.ts
#### vnode渲染成真实DOM的过程：
1. patch(oldVnode,newVnode)
2. 打补丁，把新节点变化的内容渲染到真实DOM，最后返回新节点作为下一次处理的旧节点

#### patch执行的整体过程：
1. 对比新旧vnode是否是相同节点（节点的key（唯一标识）和sel（选择器）相同）
2. 如果不是相同节点，直接删除，重新渲染
3. 如果是相同节点，再判断新的vnode是否有text，如果有并且和oldVNode的text不同，直接更新文本内容
4. 如果新的vnode有children，判断子节点是否有变化，判断子节点的过程使用的就是diff算法
5. diff过程只会进行同层级比较

* init的高阶函数：init函数内部返回patch函数，patch访问外部函数成员的时候，形成了闭包，init函数的modules参数和DOMAPI参数在内存中只存在一份
* 每个模块都有钩子函数，init内部遍历hooks数组，并放置进cbs内，作用在于以后patch的时候在合适的时间执行
* patchVnode是相同节点找差异的函数
* 如果是不同节点，调用parentNode并把旧节点删除，createElm替换新节点
  ```typeScript
  elm = oldVnode.elm!;
  parent = api.parentNode(elm) as Node;

  createElm(vnode, insertedVnodeQueue); // 将VNODE转换成真实DOM，返回的是真实的DOM，但是并没有渲染到页面上

  if (parent !== null) {
    api.insertBefore(parent, vnode.elm!, api.nextSibling(elm));
    removeVnodes(parent, [oldVnode], 0, 0);
  }
  ```
* createElm执行环节：
  * 先触发用户定义的钩子函数
  * 判断sel，并解析sel，将vnode转换成真实DOM，如果有children，执行相同处理转换
* addVnodes和removeVnodes
  * 批量删除或添加节点
* patchVnode（是相同节点的情况下，key，sel都相同）
  * 第一阶段，钩子函数的执行
    * 触发prepatch、update钩子函数，差别在于，update是判断了两个节点不是完全相同的节点之下才执行的，prepatch是无论怎么样进来都会先执行
  * 第二阶段，两个vnode的对比
    * 新节点中是否有**text属性**，且不等于旧节点的text属性
      * 如果老节点有children，移除老节点对应的DOM属性，设置新节点DOM元素的textContent
    * 新节点有**children**，且不相等
      * 调用updateChildren，对比新旧节点的的子节点，并且更新子节点的差异
    * 只有**新节点有children属性**
      * 如果老节点有text属性，清空DOM元素的textContent，添加所有的子节点
    * 只有**旧节点有children属性**
      * 移除所有的老节点
    * 只有**老节点有text属性**
      * 清空对应DOM元素的textContent
  * 第三阶段，钩子函数的执行
    * 触发postpatch钩子函数

#### updateChildren 
1. 对比新旧节点的children，更新DOM
2. 执行过程
   1. 同层比较深度优先遍历，时间复杂度O(n)
   2. 在进行同级别节点比较的时候，首先会对新老节点数组的开始和结尾节点设置标记索引，遍历的过程中移动索引
   3. 新旧节点两两比较
      1. oldStartVnode/newStartVnode
      2. oldEndVnode/newEndVnode
      3. oldStartVnode/newEndVnode
      4. oldEndVnode/newStartVnode
3. 新旧节点两两比较算法过程
   1. oldStartVnode和newStartVnode是sameVnode
      1. 调用patchVnode对比更新节点
      2. oldStartIdx++/newStartIdx++
   2. oldStartVnode和newEndVnode是sameVnode
      1. 调用patchVnode对比更新节点
      2. 把oldStartVnode对应的DOM移动到右边
      3. 更新索引
   3. oldEndVnode和newStartVnode是sameVnode
      1. 调用patchVnode对比更新节点
      2. 把oldEndVnode对应的DOM移动到左边
      3. 更新索引
   4. 如果都不是上面的情况
      1. 遍历新节点，使用newStartVnode的key在老节点数组中找相同节点
      2. 如果没有找到，说明newStartVnode是新节点
         1. 创建新节点对应的DOM对象，插入到DOM树中
      3. 如果找到了
         1. 判断新节点和找到的老节点sel选择器是否相同
         2. 如果不相同，说明节点修改了
            1. 重新创建对应的DOM插入到DOM树中
         3. 如果相同，把elmToMove对应的DOM元素，移动到左边
   5. 循环结束
      1. oldStartIdx>oldEndIdx
      2. newStartIdx>newEndIdx
   6. 如果老节点数组先遍历完，说明新节点有剩余，被剩余节点批量插入到右边
   7. 如果新节点数组先遍历完，说明老节点有剩余，把剩余节点批量删除

## 调试快捷键
第一个按钮是继续执行到下一个断点
F10:跳过函数执行
F11:进入函数执行