// 案例2：div放置子元素h1，p，并在两秒之后删除
import {h,init} from 'snabbdom'
let patch=init([])

let vnode=h('div#container',[
  h('h1','这是一个H1标签'),
  h('p','这是一个p标签'),
])

let app=document.querySelector('#app')
let oldVnode=patch(app,vnode)
setTimeout(() => {
  // 变更
  vnode=h('div#container',[
    h('h1','这是一个更新后的H1标签'),
    h('p','这是一个更新后的p标签'),
  ])
  patch(oldVnode,vnode)
  // 清空
  setTimeout(() => {
    patch(oldVnode,h('!'))
  }, 2000);
}, 2000);