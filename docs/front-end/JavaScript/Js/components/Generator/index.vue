<template>
  <div>
  </div>
</template>
<script setup>
  defineOptions({
    name: 'Generator'
  })
  const test1 = () => {
    function* generator() {
      yield 1
      yield 2
      yield 3
    }
    const gen = generator()
    console.log(gen.next()) // { value: 1, done: false }
    console.log(gen.next()) // { value: 2, done: false }
    console.log(gen.next()) // { value: 3, done: false }
    console.log(gen.next()) // { value: undefined, done: true }
  }

  const test2 = () => {
    function* generator() {
      return false // 有return 则done为true
      yield 1
      yield 2
      yield 3
    }
    const gen = generator()
    console.log(gen.next()) // { value: false, done: true }
    console.log(gen.next()) // { value: undefined, done: true }
    console.log(gen.next()) // { value: undefined, done: true }
  }

  const test3 = () => {
    function* generator (){
      yield 1
      yield 2
      yield 3
    }
    const gen = generator()
    console.log(gen.next()) // { value: 1, done: false }
    console.log(gen.return(false)) // { value: "false", done: true }
    console.log(gen.next()) // { value: undefined, done: true }
    console.log(gen.next()) // { value: undefined, done: true }
  }

  const test4 = () => {
    function* generator() {
      while (true) {
        try {
          yield 42;
        } catch (e) {
          console.log(e)
          console.log("捕获到错误！");
        }
      }
    }

    const gen = generator();
    console.log(gen.next())
    // { value: 42, done: false }
    gen.throw(new Error("出现了些问题"));
  }

  const test = () => {
    console.log('test1')
    test1()
    console.log('test2')
    test2()
    console.log('test3')
    test3()
    console.log('test4')
    test4()
  }
  defineExpose({
    test
  })
</script>
