// 由于 dom 直接定义在 window 上，所以
const div = dom.create("<div>newDiv</div>")
console.log(div)
// 控制台报错，dom 没有定义
// 原来是没有引入，注意引入顺序 dom.js 是应该在 main.js 之上
// 引入之后打印出了 div 标签
// 但是还是不够方便，比如我想要在 div>span>1 就需要写 3 句代码
// const span = dom.create('span')
// div.appendChild(span)
// 太麻烦，能不能这样 const div = dom.create('<div><span>1</span></div>')
// 这个怎么做呢，dom 好像没有给接口啊
// 网上搜索的经验
// 传入的参数就写成这样的与 HTML 标签一样的字符串
// create(string) {
//  const container = document.createElement("div") 
//  container.innerHTML = string
//  return container.children[0]
// }
// OK，显示出来了
// 但是试了一下 dom.create("<td>hi</td>")
// 打印出了 undefined，因为容器是一个 div，里面是不能装 td 的，td 只能出现在 table/tbody/tr 元素里面，不符合 HTML 语法
// 那怎么办呢，有什么标签是放任何元素都不出错的呢
// template 标签，它不用来显示，专门用来容纳的
// 但是如果你使用 template 的话，里面的元素你不能用 children 来获取
// 需要这样获取 return container.content.firstChild
// 另外字符串最好 trim 一下，否则之前有空格就完啦，就是把字符串两边的空格去掉
// 因为你传的字符串里面前面有空格的话，第一个元素就是文本元素，firstChild 就是那个文本
// OK，用于创建节点的 create 就写完了
dom.after(test, div)

// 实验一下 dom.wrap
const div3 = dom.create('<div id="parent"></div>')
dom.wrap(div, div3)

// 测试 empty
const nodes = dom.empty(window.empty)
console.log(nodes)
// 发现竟然打印了第4个数组元素，是 undefined，只有 3 个节点啊
// 修改过后我们发现，打印出它的 7 个儿子，其中四个回车的文本儿子
// 是对的，移除的时候，文本节点肯定也是想移除的啊

// 测试 attr
dom.attr(test, 'title', 'Hi, I am Hao')
console.log(dom.attr(test, 'title'))

// 测试 text
dom.text(test, '新的内容')
dom.text(test)

// 测试 style
dom.style(test, {border: '1px solid red', color: 'blue'})
// 这样写，比我们直接写字符串要舒服多了，后面还能追加
// 那如果只是想读属性呢，2 个参数
console.log(dom.style(test, 'border'))
// 什么参数也是 3 个的不一样的设置
dom.style(test, "border", "5px solid black")
// 继续分情况判断

// 在 HTML 页面里添加样式
// 然后，测试 class.add
dom.class.add(test, 'red')
dom.class.add(test, 'blue')
dom.class.remove(test, 'blue')
console.log(dom.class.has(test, 'blue'))

// 测试 on 和 off
// dom.on(test, 'click', ()=>{
//     console.log('点击了')
// })
const fn = () => {
    console.log('点击了')
}
dom.on(test, 'click', fn)
// 要移除的时候发现问题，你得在添加的时候给事件函数一个名字，不然没法移除啊
dom.off(test, 'click', fn)

const testDiv = dom.find('#test')[0]
log(testDiv)
// 有一个问题，我只想在 test 里面找 .red，不想在 test2 里面找 .red
// 比如 dom.find('.red', test2)，我只想在哪里找，默认是在 document 里面找的，第二个参数给一个范围
// 好，在实现函数里面加第二个参数 scope

// 注意，下面的写下面的第一句，然后后面参数改为 test2
// 是因为之前在测试 empty 的时候干掉了 test 里面的 p
// 所以我们在测试的时候，最好每个测试用单独的 div，不然相互之间会有影响的
// 因为如果没有上面的 empty 操作的影响，我们可以直接写成 log(dom.find('.red', testDiv))
const test2 = dom.find('#test2')[0]
log(dom.find('.red', test2)[0]) // 注意里面的 [0]，不然打印出来的是 NodeList 节点数组

// 测试 parent
console.log(dom.parent(dom.find('#test')[0]))

// 测试 siblings
log(dom.siblings(dom.find('#s2')[0]))

// 测试 next
// log(dom.next(s2)) // 错误，是文本节点
log(dom.next(s2))
log(dom.next(dom.find('#s3')[0]))

// 测试 previous 
log(dom.previous(s2))

// 测试 each
const t = dom.find('#travel')[0]
log(t)
dom.each(dom.children(t), (n)=>dom.style(n, 'color', 'yellow'))

// 测试 index 
log(dom.index(s2)) // 第 1 个