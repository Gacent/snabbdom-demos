import {init,h,styleModule,eventListenersModule} from 'snabbdom'
// 1. 导入模块
// import style from 'snabbdom/build/modules/style'
// import eventlisteners from 'snabbdom/build/modules/eventlisteners'
// 2. 注册模块
let patch=init([
  styleModule,
  eventListenersModule
])
// 3. 使用h()函数的第二个参数传入模块需要的数据对象
let vnode=h('div',{
  style:{
    backgroundColor:'red',
    color:'blue'
  },
  on:{
    click:eventHandler
  }
},[
  h('h1','这是H1标签'),
  h('p','这是p标签')
])

function eventHandler(){
  console.log('点击了')
}

let app=document.querySelector('#app')
let oldVnode=patch(app,vnode)
console.log(oldVnode)