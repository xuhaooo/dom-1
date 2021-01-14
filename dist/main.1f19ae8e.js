// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
// 由于 dom 直接定义在 window 上，所以
var div = dom.create("<div>newDiv</div>");
console.log(div); // 控制台报错，dom 没有定义
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

dom.after(test, div); // 实验一下 dom.wrap

var div3 = dom.create('<div id="parent"></div>');
dom.wrap(div, div3); // 测试 empty

var nodes = dom.empty(window.empty);
console.log(nodes); // 发现竟然打印了第4个数组元素，是 undefined，只有 3 个节点啊
// 修改过后我们发现，打印出它的 7 个儿子，其中四个回车的文本儿子
// 是对的，移除的时候，文本节点肯定也是想移除的啊
// 测试 attr

dom.attr(test, 'title', 'Hi, I am Hao');
console.log(dom.attr(test, 'title')); // 测试 text

dom.text(test, '新的内容');
dom.text(test); // 测试 style

dom.style(test, {
  border: '1px solid red',
  color: 'blue'
}); // 这样写，比我们直接写字符串要舒服多了，后面还能追加
// 那如果只是想读属性呢，2 个参数

console.log(dom.style(test, 'border')); // 什么参数也是 3 个的不一样的设置

dom.style(test, "border", "5px solid black"); // 继续分情况判断
// 在 HTML 页面里添加样式
// 然后，测试 class.add

dom.class.add(test, 'red');
dom.class.add(test, 'blue');
dom.class.remove(test, 'blue');
console.log(dom.class.has(test, 'blue')); // 测试 on 和 off
// dom.on(test, 'click', ()=>{
//     console.log('点击了')
// })

var fn = function fn() {
  console.log('点击了');
};

dom.on(test, 'click', fn); // 要移除的时候发现问题，你得在添加的时候给事件函数一个名字，不然没法移除啊

dom.off(test, 'click', fn);
var testDiv = dom.find('#test')[0];
log(testDiv); // 有一个问题，我只想在 test 里面找 .red，不想在 test2 里面找 .red
// 比如 dom.find('.red', test2)，我只想在哪里找，默认是在 document 里面找的，第二个参数给一个范围
// 好，在实现函数里面加第二个参数 scope
// 注意，下面的写下面的第一句，然后后面参数改为 test2
// 是因为之前在测试 empty 的时候干掉了 test 里面的 p
// 所以我们在测试的时候，最好每个测试用单独的 div，不然相互之间会有影响的
// 因为如果没有上面的 empty 操作的影响，我们可以直接写成 log(dom.find('.red', testDiv))

var test2 = dom.find('#test2')[0];
log(dom.find('.red', test2)[0]); // 注意里面的 [0]，不然打印出来的是 NodeList 节点数组
// 测试 parent

console.log(dom.parent(dom.find('#test')[0])); // 测试 siblings

log(dom.siblings(dom.find('#s2')[0])); // 测试 next
// log(dom.next(s2)) // 错误，是文本节点

log(dom.next(s2));
log(dom.next(dom.find('#s3')[0])); // 测试 previous 

log(dom.previous(s2)); // 测试 each

var t = dom.find('#travel')[0];
log(t);
dom.each(dom.children(t), function (n) {
  return dom.style(n, 'color', 'yellow');
}); // 测试 index 

log(dom.index(s2)); // 第 1 个
},{}],"../../../.config/yarn/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63946" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.config/yarn/global/node_modules/parcel/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map