const childArrIsSame = (value) => {
  const arr = value.map((item) => item.sort())
  const first = JSON.stringify(arr[0])
  return arr.every((item) => JSON.stringify(item) === first) ? arr[0] : []
}
module.exports = {childArrIsSame}
