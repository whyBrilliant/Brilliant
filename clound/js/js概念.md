# js 基础

## 1.声明前置

```
console.log( fn )
var fn = 1
function fn(){}
console.log( fn )
```


```
console.log(i)
for(var i=0; i< 3; i++){
  console.log(i)
}
```

```
var a = 1
function fn(){
  a = 2
  console.log(a)
  var a = 3
  console.log(a)
}
fn()
console.log(a)
```

### explain
```
var fn
function fn(){}

console.log( fn )
fn = 1
console.log( fn )
```

```
var i

console.log(i)
for(i=0; i< 3; i++){
  console.log(i)
}
```

```
var a
function fn(){
  var a

  a = 2
  console.log(a)
  a = 3
  console.log(a)
}

a = 1
fn()
console.log(a)
```

### note:
在进入一个执行环境后，先把 var 和 function 声明的变量前置， 再去顺序执行代码.

是 var 声明在前还是 function 声明的在前？ 按先来后到，同名覆盖。当然如果一个变量已经有值，再 var 是无效的.

```
var fn
function fn(){}

console.log(fn)  //function
```

```
function fn(){}
var fn   //已经声明过 fn， 再 var 无效，并不会重置为 undefined

console.log(fn)  //function
```

```
function fn(){}
var fn = 3

console.log(fn)  //3
```


## 2.引用类型

```
var arr1 = [1, 2, 3]
var arr2 = arr1
arr1[0] = 11
console.log( arr2[0] )
```

### explain
1. 由于申明前置，在内存中开辟两个空间存放arr1、arr2
2. 在堆内存中开辟不连续的空间来存放数组对象[1, 2, 3],并将其地址赋值给arr1
3. 将arr1中的地址赋值给arr2
4. 找到arr1[0]对应的地址，修改值为11

## 引用类型：数组、对象、函数、正则…… ##


### example

```
var count = 1
var obj1 = {count: 10}

incNumber(count)
console.log( count )  // ?

incObject( obj1 )
console.log( obj1.count )

var obj2 = {count}
incObject( obj2 )
console.log( count )

function incNumber(count){
  return ++count
}
function incObject(obj){
  obj.count++
}
```

```
function incNumber(count){
  return ++count
}
//相当于
function incNumber(){
  // 在函数的上下文创建临时变量
  var count = arguments[0]   //count 里面存的是内容，拷贝的也是内容
  return ++count
}

function incObject(obj){
  obj.count++
}
//相当于
function incObject(){
  var obj = arguments[0]  //obj里面存储的是地址，拷贝的也是地址， 操作的是同一地址指向的那片区域
  obj.count++
}
```

## 3.函数作用域链

```
var a = 1
function fn1(){
  function fn2(){
    console.log(a)
  }
  var a = 2
  return fn2
}
var fn = fn1()
fn() //输出多少
```

```
var a = 1
function fn1(){
  var a = 2
  return fn2
}
function fn2(){
  console.log(a)
}
var fn = fn1()
fn() //输出多少
```

### explain

    函数在执行的过程中，先从自己内部找变量
    如果找不到，再从创建当前函数所在的作用域去找, 以此往上


## 4.闭包

    A closure is the combination of a function and the lexical environment within which that function was declared.  -- from MDN

闭包就是一个函数及其词法环境的集合。如下方return的函数及其执行环境。

```
function bindName(name){
  return function(action){
    console.log(`${name} is ${action}ing`)
  }
}

var doing = bindName('jirengu')
doing('work')
doing('play') 

// 以上代码相当于
function bindName(){
  var name = arguments[0]
  function fn(action){
    console.log(`${name} is ${action}ing`)
  }
  return fn
}
var doing = bindName('jirengu')

```

## explain
因为 doing 在全局作用域永远无法被释放，导致 bindName 里声明的fn 和 name 一直存在， 执行 doing 时会从创建 fn 所在的作用域获取 name



## 5.跨域

同域是指： 同协议  同域名  同端口

浏览器禁止访问的场景：

    1.js 里发送 ajax 请求，如果请求的 url 和当前页面的 url 非同域，则浏览器拒绝提供接受的数据并报错
    2.当前页面下引入iframe，如果 iframe 里的页面和当前页面的 url 非同域， 则浏览器禁止当前页面的 js 获取或者操作 iframe下页面的 DOM

对于禁止访问的场景1， 有两种方法能绕过浏览器的限制，一种是 JSONP，另外一种是 CORS

对于禁止访问的场景2， 如果两个页面拥有相同的一级域名(a.jirengu.com 和 b.jirengu.com)可通过降域的方式。 如果是不同域名，可使用
PostMessage

### 5.1 JSONP
假设用户想调用 http://api.jirengu.com/weather.php 这个接口获取天气数据，但直接通过 ajax 获取数据会报错。

可以创建一个script 标签`<script src="http://api.jirengu.com/weathr.php?callback=showData"></script>`
这个请求到达后端后，后端会去解析callback这个参数获取到字符串showData，在发送 天气数据做如下处理：

    之前后端返回数据： {"city": "hangzhou", "weather": "晴天"}
    现在后端返回数据： showData({"city": "hangzhou", "weather": "晴天"})

前端script标签在加载数据后会把 showData({"city": "hangzhou", "weather": "晴天"})做为 js 来执行，这实际上就是调用showData这个函数，同时参数是 {"city": "hangzhou", "weather": "晴天"}

用户只需要在加载提前在页面定义好showData这个全局函数，在函数内部处理参数即可

总结：JSONP是通过 script 标签加载数据的方式去获取数据当做 JS 代码来执行
提前在页面上声明一个函数，函数名通过接口传参的方式传给后台，后台解析到函数名后在原始数据上包裹这个函数名，发送给前端。换句话说，JSONP 需要对应接口的后端的配合才能实现。


### 5.2 CORS

CORS 全称是跨域资源共享（Cross-Origin Resource Sharing），是一种 ajax 跨域请求资源的方式，支持现代浏览器，IE支持10以上。 实现方式很简单，当你使用 XMLHttpRequest 发送请求时，浏览器发现该请求不符合同源策略，会给该请求加一个请求头：Origin，后台进行一系列处理，如果确定接受请求则在返回结果中加入一个响应头：Access-Control-Allow-Origin; 浏览器判断该相应头中是否包含 Origin 的值，如果有则浏览器会处理响应，我们就可以拿到响应数据，如果不包含浏览器直接驳回，这时我们无法拿到响应数据。所以 CORS 的表象是让你觉得它与同源的 ajax 请求没啥区别，代码完全一样。