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


## 引用类型

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

## 函数作用域链

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

## explain

    函数在执行的过程中，先从自己内部找变量
    如果找不到，再从创建当前函数所在的作用域去找, 以此往上