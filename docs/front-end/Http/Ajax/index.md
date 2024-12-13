## Ajax
### XMLHttpRequest
- 参考：[使用 XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest)
### FormData
```js
var formData = new FormData(); // 当前为空
formData.append(name, value, filename); // filename 文件名称
formData.append("username", "Chris1"); // 添加到集合
formData.append("username", "Chris2"); // 添加到集合
formData.get("username"); // Returns "Chris1"，返回第一个和 "username" 关联的值
formData.getAll("username"); // Returns ["Chris1", "Chris2"]
formData.set("username", "Chris3"); // 覆盖已有的值
formData.delete("username");
// formData。keys()、formData。value()
for (var pair of formData.entries()) {
  console.log(pair[0] + ", " + pair[1]);
}
```
- \<form\>标签使用
```html
<form id="myForm" name="myForm">
  <div>
    <label for="username">Enter name:</label>
    <input type="text" id="username" name="username" />
  </div>
  <div>
    <label for="useracc">Enter account number:</label>
    <input type="text" id="useracc" name="useracc" />
  </div>
  <div>
    <label for="userfile">Upload file:</label>
    <input type="file" id="userfile" name="userfile" />
  </div>
  <input type="submit" value="Submit!" />
</form>
```
```js
var myForm = document.getElementById("myForm");
formData = new FormData(myForm);
```
- 参考：
  - [FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)
  - [ajax FormData 对象的使用](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects)
### Blob
- 参考：[ajax 发送和接收二进制数据](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest_API/Sending_and_Receiving_Binary_Data)

