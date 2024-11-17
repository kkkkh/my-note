你的猜测是正确的，因为vue组件inheritattrs属性默认是false，如果此时赋值attrs属性，div上边会绑定一个 attrs="[object Object]" 标记，如果inheritattrs设置为true，则 attrs="[object Object]" 标记会消失，对应的属性会继承在div上

Your guess is correct, because the inheritattrs attribute of the vue component is false by default. If the attrs attribute is assigned at this time, an attrs="[object Object]" tag will be bound to the div. If inheritattrs is set to true, the attrs="[object Object]" tag will disappear, and the corresponding attributes will be inherited on the div.

我不认为这是一个bug，只是属性继承的问题，你是想要支持属性继承到div上边吗？

I don't think this is a bug, it's just a problem of attribute inheritance. Do you want to support attribute inheritance on the div?

我的1、2回答是不准确的，这个issue与属性继承无关，并且inheritattrs默认是true，attrs是vue2赋值方式，我在此重新做了处理

My answers 1 and 2 are inaccurate. This issue has nothing to do with attribute inheritance, and inheritattrs is true by default. Attrs is the value assignment method of vue2. I have re-processed it here.
