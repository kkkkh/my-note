// hello.cc
// #include <node.h>

// namespace demo {

// using v8::FunctionCallbackInfo;
// using v8::Isolate;
// using v8::Local;
// using v8::NewStringType;
// using v8::Object;
// using v8::String;
// using v8::Value;

// void Method(const FunctionCallbackInfo<Value>& args) {
//   Isolate* isolate = args.GetIsolate();
//   args.GetReturnValue().Set(String::NewFromUtf8(
//       isolate, "world", NewStringType::kNormal).ToLocalChecked());
// }

// void Initialize(Local<Object> exports) {
//   NODE_SET_METHOD(exports, "hello", Method);
// }

// NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

// }  // namespace demo

// hello.cc using Node-API
#include <node_api.h>

namespace demo {

napi_value Method(napi_env env, napi_callback_info args) {
  napi_value greeting;
  napi_status status;

  status = napi_create_string_utf8(env, "world1", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) return nullptr;
  return greeting;
}

napi_value init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, nullptr, 0, Method, nullptr, &fn);
  if (status != napi_ok) return nullptr;

  status = napi_set_named_property(env, exports, "hello", fn);
  if (status != napi_ok) return nullptr;
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo 
