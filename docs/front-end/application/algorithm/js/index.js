// #region childArrIsSame
// 判断数组中子数组是否全部相同
function childArrIsSame (value) {
  const arr = value.map((item) => item.sort())
  const first = JSON.stringify(arr[0])
  return arr.every((item) => JSON.stringify(item) === first) ? arr[0] : []
}
// #endregion childArrIsSame

// #region hasDuplicates
// 判断数组中是否出现重复元素
function  hasDuplicates(array) {
  const seen = {};
  for (const element of array) {
    if (seen[element]) {
      console.log("hasDuplicates", element)
      return true;
    }
    seen[element] = true;
  }
  console.log("noDuplicates")
  return false;
}
// #endregion hasDuplicates
export {
  childArrIsSame,
  hasDuplicates
}
