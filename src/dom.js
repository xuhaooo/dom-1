window.log = console.log.bind(console)

// dom.create = function(){};
// 当然可以直接写在 dom 里面如下
window.dom = {
    // create: function () {}
    // 当然也可以简化成下面

    // 用于创建一个节点的 create
    // 看一下功能，接收一个标签名，返回一个标签
    create(string) {
        // return document.createElement(tagName)
        const container = document.createElement("template")
        container.innerHTML = string.trim()
        return container.content.firstChild
    },
    // 在 main.js 里面试一下

    // 用于新增一个弟弟的 after
    // 参数：在哪个节点后面加，加什么节点
    after(node, node2) {
        // 很遗憾搜不到 insertAfter 这样的接口，只有 insertBefore
        // 搜到的 ChildNode.after() 这个接口兼容性不好，是实验性的接口
        // 再搜，想一下，想在 node 后面加，是不是就是在 node 后面的节点的前面加，于是
        node.parentNode.insertBefore(node2, node.nextSibling)
        // 试一下，可以把 newDiv 加到了 test 之后
        // 总结一下，想放到 node 后面，就找到 node 的爸爸，然后调用它的 insertBefore，把 node2 插到了 node 的下个节点的前面去
        // 为什么这么长这么复杂呢，dom 就是这么反人类，你用必须还有封装一下
        // node 如果是最后一个节点，那它的下个节点就是回车，但如果修改一下把标签都凑到一块，会发现 node 最后一个节点是 null，但还是可以插到 node 后面去
    },

    // 用于新增一个哥哥的 before
    before(node, node2) {
        node.parentNode.insertBefore(node2, node)
        // 简单，可以直接用 insertBefore
    },

    // 用于新增儿子的 append
    // 接收爸爸和儿子
    append(parent, node) {
        parent.appendChild(node)
    },

    // 用于新增一个爸爸的 wrap
    wrap(node, parent) {
        dom.before(node, parent)
        dom.append(parent, node)
        // 看不懂吧，解释一下，比如 dom.wrap(div2, div3)
        // 比如 div1 > div2，我想要 div1 > div3 > div2
        // 怎么弄呢，我先在 div2 前新增 div3 哥哥，div1 > div3+div2，事实上新增成弟弟也没事
        // 然后，在 div3 里面新增儿子 div2，即把 div2 append 到 div3 里面
        // append 这个 API 使用过后之前的位置就没了，div2 直接到 div3 里面了
    },
    // 以上，”增“已经搞完了
    // 看起来几个简单的 API，里面确实肮脏的实现

    // --- 分割线 ---

    // 用于删除节点
    remove(node) {
        // 让这个节点的爸爸删除它自己的这个儿子节点
        node.parentNode.removeChild(node)
        // 在树中删了，return 一下，这样删的人还可以保留这个节点的引用
        return node 
    },

    // 用于删除该节点所有儿子节点
    empty(node) {
        // 虽然可以通过 node.innerHTML = '' 做，但是想要删掉的所有子节点的引用怎么办呢，就是说返回移除的对象，所以
        // const childNodes = node.childNodes
        // 用高级语法，记住这个能简写就行了
        // const {childNodes} = node
        const array = []
        // for (let i = 0; i < childNodes.length; i++) {
        //     // console.log(childNodes.length)，还记得之前说过吗，childNodes 的 length 会动态变化的，而我们以为它一直是那几个节点
        //     dom.remove(childNodes[i])
        //     array.push(childNodes[i])
        //     // array.push(dom.remove(childNodes[i]))，打印出来全是 text 节点，所以做上面注释的操作
        //     // 那怎么办呢，当 remove 之后 i 就不再是小于 7，而是小于 6 了，i 是不需要加的，所以不适合用 for 循环做
        // }
        // return array

        // 用 while 循环做
        // 我们要把所有的元素删掉，那我们先找到它的第一个儿子，如果存在就移除它，然后放入数组中
        // 然后再把 x 指向它的 firstChild（大儿子）
        // 迷惑？每次都是删除大儿子，然后用 x 指向新的大儿子（原来的二儿子）
        let x = node.firstChild
        while(x){
            array.push(dom.remove(node.firstChild))
            x = node.firstChild
        }
        return array
    },
    // OK，”删“搞定了

    // 好，接下来做”改"
    // 用于给元素“读写”属性的 attr
    attr(node, name, value) {
        // node.setAttribute(name, value)
        // 测试一个可以写属性了，那读取怎么弄，即 const title = dom.attr(node, name)
        // 不对啊，实现的时候是 3 个参数这里怎么可以只传 2 个参数呢
        // JS 的函数是可以接受多种参数的
        // 实现就是，在这里判断一下，3 个就设置，2 个就获取并返回
        // 如果长度为 3 就 set，如果长度为 2 就 get，这种小技巧叫重载
        // 先记住，根据参数的个数写不同的代码就是重载，JS 里只能这样重载
        if(arguments.length === 3){
            node.setAttribute(name, value)
        } else if(arguments.length === 2){
            return node.getAttribute(name)
        }
    },

    // 设置元素的文本内容
    text(node, string) {
        // node.innerText = string
        // 有一个问题，比如文本里面有标签，这么设置的话标签就没有了，比如“前面的文本<p>hi</p>后面的文本”，p 标签没有了
        // 但是这个是写库的人也没办法的事情，你就不能用 <span> 把“前面的文本“包起来，然后再改吗；于是就用这么粗暴的方式，使用者根据现象来自己调整使用
        // 那为什么不用 node.textContent = string 呢，因为上面是旧 ie，下面的是 firefox/chrome，所有的浏览器基本都支持两种，为了让代码在所有浏览器上都能跑，用上面的那种，但所以最好还是判断一下
        // 这种写代码的方法，就叫适配，110V 220V 都能转成 5V2A
        // 根据上面的经验，如果需要获取怎么办，所以还是要判断参数
        if(arguments.length === 2){
            if('innerText' in node){
                node.innerText = string
            }else{
                node.textContent = string
            }
        }else if(arguments.length === 1){
            if('innerText' in node){
                return node.innerText
            }else{
                return node.textContent
            }
        }
    },

    // 读写 HTML 内容的 html
    html(node, string) {
        // 又一次用到了重载
        if(arguments.length === 2){
            node.innerHTML = string
        }else if(arguments.length === 1){
            return node.innerHTML
        }
    },

    // 用于修改 style 属性
    // style(node, object) {
    //     for(let key in object){
    //         node.style[key] = object[key]
    //         // 因为 object 里面的 key 可能是 border/color
    //         // 正常代码应该是 node.style.border = .../node.style.color = ...
    //         // 但是现在 border、color 都是不确定的是变量，如果你用变量作为 key 的话，必须放在 [] 里，用 . （node.style.key）就会变成字符串，之前讲过
    //     }
    // }
    // 还是要分情况
    style(node, name, value) {
        if (arguments.length === 3) {
            // style(div, 'color', 'red')
            node.style[name] = value
        } else if(arguments.length === 2) {
            if(typeof name === 'string'){ // 注意判断方式
                // dom.style(div, 'color')
                return node.style[name]
            } else if(name instanceof Object) { // 注意这里的判断方式
                // dom.style(div, {color: 'red'})
                const object = name // 别名替换，看着不难受
                for(let key in object){
                    node.style[key] = object[key]
                }
            }
        }
    },
    // 难吗？不是很难吧，可以看到程序员在工作中的不在于什么算法数据结构，把需求理清楚，然后用最基本的语法把它搞定就行了

    class: {
        // 继续，用于添加 class 的 class.add
        add(node, className) {
            node.classList.add(className)
        },
        // 用于删除 class 的 class.remove
        remove(node, className) {
            node.classList.remove(className)
        },
        // 用于判断有没有 class 的 class.has
        has(node, className) {
            return node.classList.contains(className) // 记住要 return
        },
    },

    // 用于添加事件监听的 on
    // 之间添加是这样的，test.addEventListener('click')
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn)
    },

    // 用于移除事件监听的 off
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn)
    },

    // OK，”改“搞定了
    // --- 分割线 ---
    // 继续，实现”查“，之前我们都是用全局属性，test

    // 用于获取标签或标签们的 find
    find(selector, scope) {
        // return document.querySelectorAll(selector)
        // 不管你给的选择器是一个元素还是有多个元素，我全部都返回 all，也就说返回一个数组

        return (scope || document).querySelectorAll(selector)
        // 即，如果有 scope 我就在 scope 里面 queryS；如果没有 scope 我就在 document 里面来 queryS
        // 当然你也可以用一个中间变量，const x = scope || document;s.queryS;但是高手写代码写多了根本不会这么写
    },

    // 用于获取父元素的 parent
    parent(node) {
        return node.parentNode
    },

    // 用于获取子元素的 children
    children(node) {
        return node.children
    },

    // 用于获取兄弟姐妹的 siblings
    siblings(node) {
        return Array.from(node.parentNode.children).filter(n=>n!==node)
        // 记得吗，兄弟姐妹是不包括自己的
        // 用 filter（node.parentNode.children.filter）不行吗？不行，因为 node.parentNode.children 不是数组，是伪数组啊，得变成数组才行
        // 变成数组过后进行过滤，只要元素不等于当前节点，就放到这个数组里面
    },

    // 用于获取弟弟 next
    next(node) {
        // return node.nextSibling
        // 这样可以吗？可能是错的，因为可能会返回文本节点，所以需要判断
        let x = node.nextSibling
        while(x && x.nodeType === 3){
            x = x.nextSibling
        }
        return x
        // 如果 x 存在，就判断它是不是文本节点，如果是那就把它下一个节点给它，再判断，如果还是文本节点，再下一个，如果是空呢，那没得办法了，也得返回
    },

    // 用于获取哥哥的 previous，代码一样的，改成 previous 而已
    previous(node) {
        let x = node.previousSibling
        while(x && x.nodeType === 3){
            x = x.previousSibling
        }
        return x
    },

    // 用于遍历所有节点的 each
    each(nodeList, fn) {
        for(let i=0;i<nodeList.length;i++){
            fn.call(null, nodeList[i])
        }
    },

    // 用于获取一个元素排行老几的 index
    // 目前还不知道，你得问它的爸爸才能知道啊
    index(node) {
        // 不能直接用 node.parentNode.children 因为这个 children 是会变的
        const childrenList = dom.children(node.parentNode)
        let i
        for(i=0;i<childrenList.length;i++){
            if(childrenList[i] === node){
                break
                // 看每个孩子是否等于当前元素，那就别动了，返回 i
            }
        }
        return i // 合并报错 i 没有定义，因为 for 里面 let i 只在里面有效，return 拿不到，把 let 拿出去
    }
}
