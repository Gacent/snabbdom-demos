// commonjs方式导入
// const snabbdom=require('snabbdom')

// ES6方式导入，因为文件内是用export导出的，所以需要用这种按需引入的方式导入
// h:返回虚拟节点vnode，这个函数在vuejs有见过
// init：高阶函数，返回patch（）
// thunk：是一种优化策略，可以在处理不变的数据时候使用
import {h,thunk,init} from 'snabbdom'
// console.log(h,thunk,init)

// 案例1：hello world
// 参数:数组，模块
// 返回值：patch函数，作用对比两个vnode的差异更新到真实DOM
let patch=init([])

// 第一个参数：标签+选择器
// 第二个参数：如果是字符串的话就是标签中的内容
let vnode=h('div#container.cls','hello world')

let app=document.querySelector('#app')

// 第一个参数：可以是DOM元素，内部会把DOM元素转换成VNODE
// 第二个参数：VNODE
// 返回值：VNODE
let oldVnode=patch(app,vnode)

// 假设的时刻
vnode=h('div','hello snabbdom')
patch(oldVnode,vnode)