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