import { ref } from 'vue'

export default function Test(){
  const component = ref(null)
  const test = ()=>{
    component.value.test()
  }
  return {
    component,
    test
  }
}
