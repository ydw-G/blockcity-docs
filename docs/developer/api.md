# API列表

## API签名

### 令牌签名

为了防止API调用过程中被黑客恶意篡改，调用任何一个API都需要携带签名，服务端会根据请求参数，对签名进行验证，签名不合法的请求将会被拒绝。


> <font size="2">对所有API请求参数（加上client\_secret，除去sign），根据参数名称的ASCII码表的顺序排序。如：foo:1, bar:2, foo\_bar:3, secret:4排序后的顺序是bar:2, foo:1, foo\_bar:3, secret:4。</font>
>
> <font size="2">将排序好的参数名和参数值拼装在一起，根据上面的示例得到的结果为：bar2foo1foo\_bar3foobar4。</font>
>
> <font size="2">把拼装好的字符串采用utf-8编码，使用MD5算法md5\(bar2foo1foo\_bar3 secret4\)；</font>

#### 签名示例

* 设置参数值

```
method = "user.baseinfo"
client_id = "2wE3tlWcRdVRaHhi"
access_token = "d12fd13rf3f"
timestamp = "1524714213828"
```

* 按ASCII顺序排序

```
access_token = "d12fd13rf3f"
client_id = "2wE3tlWcRdVRaHhi"
client_secret = "bapi1V1FqvOkPHDMUWdBtzYD83sY0nsN"
method = "user.baseinfo"
timestamp = "1524714213828"
```

* 拼接参数名与参数值

```
access_tokend12fd13rf3fclient_id2wE3tlWcRdVRaHhiclient_secretbapi1V1FqvOkPHDMUWdBtzYD83sY0nsNmethoduser.baseinfotimestamp1524714213828
```

* 生成签名， md5\(拼接的参数\)

```
sign = 5f6e14cbc5326347a3c4c7f87960d64b
```

#### JAVA代码示例

```java
 <dependency>
    <groupId>commons-codec</groupId>
    <artifactId>commons-codec</artifactId>
    <version>1.10</version>
</dependency>


Map<String,String> params = new HashMap<>();
params.put("client_id",appId);
params.put("method",method);
params.put("access_token",accessToken);
params.put("timestamp",timestamp);
params.put("client_secret",appSecret);

public static String signRequest(Map<String, String> params) throws IOException {
    // 第一步：对参数进行ASCII排序
    String[] keys = params.keySet().toArray(new String[0]);
    Arrays.sort(keys);
    // 第二步：把所有参数名和参数值串在一起
    StringBuilder query = new StringBuilder();
    for (String key : keys) {
        String value = params.get(key);
        query.append(key).append(value);
    }
    // 第三步：md5加密
    return DigestUtils.md5Hex(query.toString());
}
```

### 支付签名

为了防止API调用过程中被黑客恶意篡改，调用任何一个API都需要携带签名，服务端会根据请求参数，对签名进行验证，签名不合法的请求将会被拒绝。

开发者需提供一对RSA(2048位)公私钥，公钥上传给布洛克城，在小应用服务端用私钥加密签名串，传在sign字段里。公私钥可以通过[在线生成工具](http://web.chacuo.net/netrsakeypair)生成，密钥位数请选择2048位，加密格式为PKCS#8。

加密内容 ： rsa\(biz\_content+timestamp\)

#### 签名示例

```java
PayCommonParam param = new PayCommonParam();
param.setApp_id("");
param.setMethod("");
param.setNotify_url("");
param.setTimestamp(System.currentTimeMillis());
param.setVersion("1.0.0");
InitPayParam initPayParam = new InitPayParam();
initPayParam.setCurrency("GXS");
initPayParam.setOut_trade_no("商户订单号");
initPayParam.setSubject("测试");
initPayParam.setTotal_amount(new BigDecimal(10));
param.setBiz_content(JSON.toJSONString(initPayParam));
param.setSign(RsaSignature.rsaSign(param.getBiz_content()+param.getTimestamp(), "rsa私钥"));
System.out.println(JSON.toJSONString(param));
```

#### 代码下载

[JAVA代码示例下载](http://gxb-doc.oss-cn-hangzhou.aliyuncs.com/blockpay/paydemo.zip)

## 授权API

### 获取令牌

开发者可通过获取到的授权code换取access\_token，授权code作为换取access\_token的票据，每次用户授权完成，回调地址中的授权code将不一样，授权code只能使用一次，授权code5分钟失效。

#### 请求地址

| 环境 | HTTPS请求地址 |
| :--- | :--- |
| 沙箱环境 | [https://sandbox.blockcity.gxb.io/auth/oauth/access\_token](https://sandbox.blockcity.gxb.io/auth/oauth/access_token) |
| 正式环境 | [https://open.blockcity.gxb.io/oauth/access\_token](https://open.blockcity.gxb.io/oauth/access_token) |

#### 公共请求参数

| 字段 | 是否必选 | 最大长度 | 描述 |
| :--- | :--- | :--- | :--- |
| client\_id | 是 | 16 | 等同于appid，创建应用时获得 |
| client\_secret | 是 | 32 | appid对应的密钥，即app\_secret |
| code | 是 | 16 | 用户授权后生成的授权code |

#### 公共响应参数

| 参数 | 类型 | 是否必填 | 最大长度 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| success | boolean | 是 | - | 请求结果 | true |
| data | object | 否 | - | 返回的数据内容 | {} |

#### 响应参数

| 参数名称 | 参数类型 | 最大长度 | 参数描述 |
| :--- | :--- | :--- | :--- |
| access\_token | string | 32 | 访问令牌 |
| refresh\_token | string | 32 | 刷新令牌 |
| expires\_date | long | - | 令牌有效期 |

#### 请求示例

* 组装HTTP请求 将所有参数名和参数值采用utf-8进行URL编码，然后通过GET发起请求，如：

> <font size="2">正式环境 ：[https://open.blockcity.gxb.io/oauth/access\_token?client\_id=2wE3tlWcRdVRaHhi&client\_secret=4eARMt0lCCQGyLP7ubVLxCJUaQ7Y77EN&code=1234](https://open.blockcity.gxb.io/oauth/access_token?client_id=2wE3tlWcRdVRaHhi&client_secret=4eARMt0lCCQGyLP7ubVLxCJUaQ7Y77EN&code=1234)</font>
>
> <font size="2">沙箱环境 ：[https://sandbox.blockcity.gxb.io/auth/oauth/access\_token?client\_id=2wE3tlWcRdVRaHhi&client\_secret=4eARMt0lCCQGyLP7ubVLxCJUaQ7Y77EN&code=1234](https://sandbox.blockcity.gxb.io/auth/oauth/access_token?client_id=2wE3tlWcRdVRaHhi&client_secret=4eARMt0lCCQGyLP7ubVLxCJUaQ7Y77EN&code=1234)</font>

#### 响应示例

``` json
{
    "success": true,
    "data": {
        "access_token": "f23t1g13g13g",
        "refresh_token": "12323g2gg4g4",
        "expires_date": 1527248284900
    }
}
```

### 业务错误码

| code | 描述 |
| :--- | :--- |
| app.appid.invalid | appid不存在 |
| auth.request.expire | 授权请求过期 |
| auth.request.status.error | 授权code已经授权得到access_token，不能重复请求 |
| auth.request.code.error | 授权code不存在 |
| auth.token.status.error | access_token状态已过期 |


### 刷新令牌

每个access\_token目前有效期为30天，可调用refresh接口刷新时长，再次刷新有效期为30天，只能刷新一次。

#### 请求地址

| 环境 | HTTPS请求地址 |
| :--- | :--- |
| 沙箱环境 | [https://sandbox.blockcity.gxb.io/auth/oauth/refresh\_token](https://sandbox.blockcity.gxb.io/auth/oauth/refresh_token) |
| 正式环境 | [https://open.blockcity.gxb.io/oauth/refresh\_token](https://open.blockcity.gxb.io/oauth/refresh_token) |

#### 公共请求参数

| 字段 | 是否必选 | 最大长度 | 描述 |
| :--- | :--- | :--- | :--- |
| client\_id | 是 | 16 | 等同于appid，创建应用时获得 |
| client\_secret | 是 | 32 | appid对应的密钥，即app\_secret |
| refresh\_token | 是 | 32 | 刷新令牌 |

#### 公共响应参数

| 参数 | 类型 | 是否必填 | 最大长度 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| success | boolean | 是 | - | 请求结果 | true |
| data | object | 否 | - | 返回的数据内容 | {} |

#### 响应参数

| 参数名称 | 参数类型 | 最大长度 | 参数描述 |
| :--- | :--- | :--- | :--- |
| expires\_date | long | - | 令牌有效期 |

#### 请求示例

* 组装HTTP请求 将所有参数名和参数值采用utf-8进行URL编码，然后通过GET发起请求，如：

> <font size="2">正式环境 ：https://open.blockcity.gxb.io/oauth/refresh\_token?client\_id=2wE3tlWcRdVRaHhi&client\_secret=4eARMt0lCCQGyLP7ubVLxCJUaQ7Y77EN&refresh\_token=12323g2gg4g4</font>
>
> <font size="2">沙箱环境 ：https://sandbox.blockcity.gxb.io/auth/oauth/refresh\_token?client\_id=2wE3tlWcRdVRaHhi&client\_secret=4eARMt0lCCQGyLP7ubVLxCJUaQ7Y77EN&refresh\_token=12323g2gg4g4</font>

#### 响应示例

``` json
{
    "success": true,
    "data": {
        "expires_date": 1527248284900
    }
}
```

## 用户数据API

### 用户基本信息

开发者除了可以拿到布洛克用户唯一编号（uuid），还能获取更多的信息，包括昵称，居民号、是否是创世居民、注册时间、是否通过二要素实名认证、是否通过KYC实名认证、布洛克城头像。

#### 请求地址

| 环境 | HTTPS请求地址 |
| :--- | :--- |
| 沙箱环境 | [https://sandbox.blockcity.gxb.io/openapi/user/baseinfo](https://sandbox.blockcity.gxb.io/openapi/user/baseinfo) |
| 正式环境 | [https://open.blockcity.gxb.io/api/user/baseinfo](https://open.blockcity.gxb.io/api/user/baseinfo) |

#### 公共请求参数

| 参数名称 | 参数类型 | 是否必须 | 最大长度 | 参数描述 |
| :--- | :--- | :--- | :--- | :--- |
| client\_id | string | 是 | 16 | appId |
| method | string | 是 | - | 调用的接口，user.baseinfo |
| access\_token | string | 是 | 32 | 用户访问令牌 |
| timestamp | string | 是 | - | 13位时间戳（精确到毫秒），与服务器时间相差在5分钟以内才有效 |
| sign | string | 是 | - | 接口签名，[令牌签名算法](api.html#令牌签名) |

#### 公共响应参数

| 参数 | 类型 | 是否必填 | 最大长度 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| code | String | 是 | - | 网关返回码,[详见文档](api.html#业务错误码) | 0 |
| msg | String | 否 | - | 网关返回错误描述 | 系统内部错误 |
| data | object | 否 | - | 返回的数据内容 | {} |

#### 响应参数

| 参数名称 | 参数类型 | 最大长度 | 参数描述 |
| :--- | :--- | :--- | :--- |
| uuid | string | 32 | G-ID |
| nickName | string | 64 | 昵称 |
| memberNumber | int | - | 居民号 |
| founder | int | - | 是否创始居民，1是0否 |
| registerDate | long | - | 注册时间 |
| isKyc | boolean | - | 是否人脸识别kyc |
| isTwoElement | boolean | - | 是否实名 |
| heads | string | 512 | 头像 |

#### 请求示例

* 组装HTTP请求 将所有参数名和参数值采用utf-8进行URL编码，然后通过GET或POST发起请求，如：

  > <font size="2">正式环境 ：[https://open.blockcity.gxb.io/api/user/baseinfo?client\_id=2wE3tlWcRdVRaHhi&method=user.baseinfo&access\_token=d12fd13rf3f&timestamp=1524658239010&sign=3d73f456febfa81a97f626c56d7a6419](https://open.blockcity.gxb.io/api/user/baseinfo?client_id=2wE3tlWcRdVRaHhi&method=user.baseinfo&access_token=d12fd13rf3f&timestamp=1524658239010&sign=3d73f456febfa81a97f626c56d7a6419)</font>
  >
  > <font size="2">沙箱环境 ： [https://sandbox.blockcity.gxb.io/openapi/user/baseinfo?client\_id=2wE3tlWcRdVRaHhi&method=user.baseinfo&access\_token=d12fd13rf3f&timestamp=1524658239010&sign=3d73f456febfa81a97f626c56d7a6419](http://sandbox.blockcity.gxb.io/openapi/user/baseinfo?client_id=2wE3tlWcRdVRaHhi&method=user.baseinfo&access_token=d12fd13rf3f&timestamp=1524658239010&sign=3d73f456febfa81a97f626c56d7a6419)</font>

#### 响应示例

``` json
{
    "code": "0",
    "data": {
        "uuid": "124124342",
        "nickName": "布洛克昵称",
        "memberNumber": 1,
        "founder": 1,
        "registerDate": 138594839384,
        "isKyc": true,
        "isTwoElement": true,
        "heads": ""
    }
}
```

#### 异常示例

``` json
{
    "code": "0",
    "msg": "错误信息提示",
    "data": {}
}
```

#### 业务错误码

| code | 描述 |
| :--- | :--- |
| 0 | 表示接口成功 |
| param.sign.invalid | 签名错误 |
| param.timestamp.invalid | 时间戳无效 |
| param.appid.invalid | app\_id无效 |
| param.invalid | 非法参数 |
| default.error | 服务异常 |


## 支付API

### 预创建支付

预先创建支付订单接口，对应的method请求参数为：blockpay.trade.app.pay

#### 请求地址

| 环境 | HTTPS请求地址 |
| :--- | :--- |
| 沙箱环境 | [https://sandbox.blockcity.gxb.io/api/blockpay/api/gateway](http://sandbox.blockcity.gxb.io/api/blockpay/api/gateway) |
| 正式环境 | [https://blockcity.gxb.io/api/blockpay/api/gateway](https://blockcity.gxb.io/api/blockpay/api/gateway) |

#### 请求方式

> <font size="2">method: POST</font>
>
> <font size="2">Content-Type: application/json</font>

#### 公共请求参数

| 参数名称 | 参数类型 | 是否必须 | 最大长度 | 参数描述 |
| :--- | :--- | :--- | :--- | :--- |
| app\_id | string | 是 | 16 | 商户的appid |
| method | string | 是 | - | 调用的接口，blockpay.trade.app.pay |
| timestamp | long | 是 | - | 13位时间戳（精确到毫秒） |
| version | string | 是 | - | 调用的接口版本，固定为：1.0 |
| notify\_url | string | 否 | 256 | 支付回调地址 |
| biz\_content | string | 是 | - | 业务请求参数的集合 ，json格式 |
| sign | string | 是 | - | 接口签名，[签名算法](#支付签名) |

#### 请求参数

| 参数 | 类型 | 是否必须 | 最大长度 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| subject | string | 是 | 256 | 商品的标题 |
| out\_trade\_no | string | 是 | 32 | 商户唯一订单号 |
| pay\_expire | string | 否 | - | 该笔订单允许的最晚付款时间，逾期将关闭交易，默认30m。取值范围：1m～1d，m-分钟，h-小时，d-天 |
| total\_amount | double | 是 | - | 订单总金额，单位为元，精确到小数点后五位，取值范围\[0.00001,100000000\] |
| seller\_id | string | 否 | 32 | 收款方的用户uuid，不传代表应用对应商户 |
| currency | string | 是 | 32 | 支付币种，例：GXS |
| callback\_params | string | 否 | 512 | 支付回调时传的参数 |

#### 公共响应参数

| 参数 | 类型 | 是否必填 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- | :--- |
| success | boolean | 是 | 响应结果 | true |
| errorCode | String | 否 | [错误码](#错误码：) | pay.method.no-exist |
| errorMsg | String | 否 | 错误说明 | 接口不存在 |
| data | object | 否 | 返回的数据内容 | {} |

#### 错误码：

| 错误码 | 描述 |
| :--- | :--- |
| pay.method.no-exist | 接口不存在 |
| pay.remote.service.error | 服务异常 |
| pay.appid.not.exist | appid不存在 |
| pay.param.sign.error | 签名错误 |
| pay.param.currency.not\_support | 不支持的币种 |
| pay.param.notify\_url.empty | 回调地址不能为空 |
| pay.param.invalid | 参数不合法 |

#### 响应参数

| 参数 | 类型 | 是否必须 | 最大长度 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| out\_trade\_no | string | 是 | 32 | 商户网站唯一订单号 |
| trade\_no | string | 是 | 32 | 交易流水号 |
| total\_amount | double | 是 | - | 该笔订单的资金总额 |
| currency | string | 是 | 32 | 支付币种，GXS |

#### 请求示例

#### 响应示例

``` json
{
    "success":true,
    "data":{
        "out_trade_no":"out1526393667695",
        "trade_no":"201805152202010145729234957",
        "total_amount":10,
        "currency":"GXS"
    }
}
```

#### 异常示例

``` json
{
    "success":false,
    "errorCode":"pay.remote.service.error",
    "errorMsg":"服务错误"
}
```

### 转账

商户对用户进行直接转账，接口调用完成后直接转账成功，商户收银台收款账户即为转出账户。

对应的method请求参数为：blockpay.trade.transfer

#### 请求地址

| 环境 | HTTPS请求地址 |
| :--- | :--- |
| 沙箱环境 | [https://sandbox.blockcity.gxb.io/api/blockpay/api/gateway](http://sandbox.blockcity.gxb.io/api/blockpay/api/gateway) |
| 正式环境 | [https://blockcity.gxb.io/api/blockpay/api/gateway](https://blockcity.gxb.io/api/blockpay/api/gateway) |

#### 请求方式

> <font size="2">method: POST</font>
>
> <font size="2">Content-Type: application/json</font>

#### 公共请求参数

| 参数名称 | 参数类型 | 是否必须 | 最大长度 | 参数描述 |
| :--- | :--- | :--- | :--- | :--- |
| app\_id | string | 是 | 16 | 商户的appid |
| method | string | 是 | - | 调用的接口，blockpay.trade.transfer |
| timestamp | long | 是 | - | 13位时间戳（精确到毫秒） |
| version | string | 是 | - | 调用的接口版本，固定为：1.0 |
| notify\_url | string | 否 | 256 | 支付回调地址 |
| biz\_content | string | 是 | - | 业务请求参数的集合 ，json格式 |
| sign | string | 是 | - | 接口签名，[签名算法](#支付签名) ||

#### 请求参数

| 参数 | 类型 | 是否必须 | 最大长度 | 描述 |
| :--- | :--- | :--- | :---| :--- |
| to\_user | string | 是 | 32 | 转入方的用户uuid，可根据交易详情查询buyer\_id，也可通过auth的/user/baseinfo接口获取用户的uuid |
| amount | double | 是 | - | 转账金额 |
| currency | string | 是 | 32 | 币种 |
| remark | string | 否 | 256 | 备注 |
| pswd | string | 是 | - | 商户绑定布洛克城账号的交易密码，，加密方式，md5\(md5\(密码\)+timestamp\) |
| outTransferNo | string | 是 | 32 | 商户外部转账no，请传唯一id，一个外部转账no只能转账一次 |

#### 公共响应参数

| 参数 | 类型 | 是否必填 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- | :--- |
| success | boolean | 是 | 响应结果 | true |
| errorCode | String | 否 | [错误码](#错误码：) | pay.method.no-exist |
| errorMsg | String | 否 | 错误说明 | 接口不存在 |
| data | object | 否 | 返回的数据内容 | {} |

#### 错误码：

| 错误码 | 描述 |
| :--- | :--- |
| pay.method.no-exist | 接口不存在 |
| pay.remote.service.error | 服务异常 |
| pay.appid.not.exist | appid不存在 |
| pay.param.sign.error | 签名错误 |
| pay.param.currency.not\_support | 不支持的币种 |
| pay.param.notify\_url.empty | 回调地址不能为空 |
| pay.param.invalid | 参数不合法 |
| pay.api.transfer.out_transfer_no.exist | 外部转账流水号已存在 |
| pay.api.transfer.to_user.not_exist | 转入方不存在 |
| pay.error.balance.lack | 账户余额不足 |
| pay.error.failed | 支付异常，请重试 |

#### 响应参数

| 参数 | 类型 | 是否必须 | 最大长度 | 描述 |
| :--- | :--- | :--- | :---| :--- |
| transfer\_no | string | 是 | 32 | 转账订单号 |

#### 请求示例

#### 响应示例

``` json
{
    "success":true,
    "data":{
        "transfer_no":"20180515220201014572927220"
    }
}
```

#### 异常示例

``` json
{
    "success":false,
    "errorCode":"pay.remote.service.error",
    "errorMsg":"服务错误"
}
```

### 查询交易

交易状态主动查询接口，对应的method请求参数为：blockpay.trade.detail

#### 请求地址

| 环境 | HTTPS请求地址 |
| :--- | :--- |
| 沙箱环境 | [https://sandbox.blockcity.gxb.io/api/blockpay/api/gateway](http://sandbox.blockcity.gxb.io/api/blockpay/api/gateway) |
| 正式环境 | [https://blockcity.gxb.io/api/blockpay/api/gateway](https://blockcity.gxb.io/api/blockpay/api/gateway) |

#### 请求方式

> <font size="2">method: POST</font>
>
> <font size="2">Content-Type: application/json</font>

#### 公共请求参数

| 参数名称 | 参数类型 | 是否必须 | 最大长度 | 参数描述 |
| :--- | :--- | :--- | :---| :--- |
| app\_id | string | 是 | 16 | 商户的appid |
| method | string | 是 | - | 调用的接口，blockpay.trade.detail |
| timestamp | long | 是 | - | 13位时间戳（精确到毫秒） |
| version | string | 是 | - | 调用的接口版本，固定为：1.0 |
| notify\_url | string | 否 | 256 | 支付回调地址 |
| biz\_content | string | 是 | - | 业务请求参数的集合 ，json格式 |
| sign | string | 是 | - | 接口签名，[签名算法](#支付签名) |

#### 请求参数

| 参数 | 类型 | 是否必须 | 最大长度 | 描述 |
| :--- | :--- | :--- | :---| :--- |
| out\_trade\_no | string | 可选 | 32 | 订单支付时传入的商户订单号,和交易号不能同时为空 |
| trade\_no | string | 可选 | 32 | 交易流水号 |

#### 公共响应参数

| 参数 | 类型 | 是否必填 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- | :--- |
| success | boolean | 是 | 响应结果 | true |
| errorCode | String | 否 | [错误码](#错误码：) | pay.method.no-exist |
| errorMsg | String | 否 | 错误说明 | 接口不存在 |
| data | object | 否 | 返回的数据内容 | {} |

#### 错误码：

| 错误码 | 描述 |
| :--- | :--- |
| pay.method.no-exist | 接口不存在 |
| pay.remote.service.error | 服务异常 |
| pay.appid.not.exist | appid不存在 |
| pay.param.sign.error | 签名错误 |
| pay.param.currency.not\_support | 不支持的币种 |
| pay.param.notify\_url.empty | 回调地址不能为空 |
| pay.param.invalid | 参数不合法 |

#### 响应参数

| 参数 | 类型 | 是否必须 | 最大长度 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| trade\_no | string | 是 | 32 | 平台交易号 |
| out\_trade\_no | string | 是 | 32 | 商家订单号 |
| trade\_status | string | 是 | 64 | 支付状态WAIT\_BUYER\_PAY（交易创建，等待买家付款）、PAY\_SUCCESS\(支付成功,可退款\)TRADE\_CLOSED（未付款交易超时关闭）、TRADE\_FINISHED（交易成功，不可退款） |
| total\_amount | double | 是 | - | 总金额 |
| currency | string | 是 | 32 | 币种 |
| pay\_amount | double | 否 | - | 实际支付金额 |
| subject | string | 是 | 256 | 商品标题 |
| create\_time | date | 是 | - | 创建时间 |
| pay\_time | date | 否 | - | 支付时间 |
| seller\_id | string | 是 | 32 | 卖家uuid |
| buyer\_id | string | 否 | 32 | 买家uuid |

#### 请求示例

#### 响应示例

``` json
{
    "success":true,
    "data":{
        "trade_no":"",
        "out_trade_no":"",
        "trade_status":"",
        "total_amount":10,
        "currency":"GXS",
        "pay_amount":10,
        "subject":"布洛克城支付",
        "create_time":1534559335937,
        "pay_time":1534559335937,
        "seller_id":"eccbc87e4b5ce2fe28308fd9f2a7bh29",
        "buyer_id":"6f4922f45568161a8cdf4ad2299289jj"
    }
}
```

#### 异常示例

``` json
{
    "success":false,
    "errorCode":"pay.remote.service.error",
    "errorMsg":"服务错误"
}
```

### 退款接口

发起交易退款接口，对应的method请求参数为：blockpay.trade.refund

#### 请求地址

| 环境 | HTTPS请求地址 |
| :--- | :--- |
| 沙箱环境 | [https://sandbox.blockcity.gxb.io/api/blockpay/api/gateway](http://sandbox.blockcity.gxb.io/api/blockpay/api/gateway) |
| 正式环境 | [https://blockcity.gxb.io/api/blockpay/api/gateway](https://blockcity.gxb.io/api/blockpay/api/gateway) |

#### 请求方式

> <font size="2">method: POST</font>
>
> <font size="2">Content-Type: application/json</font>

#### 公共请求参数

| 参数名称 | 参数类型 | 是否必须 | 最大长度 | 参数描述 |
| :--- | :--- | :--- | :---| :--- |
| app\_id | string | 是 | 16 | 商户的appid |
| method | string | 是 | - | 调用的接口，blockpay.trade.refund |
| timestamp | long | 是 | - | 13位时间戳（精确到毫秒） |
| version | string | 是 | - | 调用的接口版本，固定为：1.0 |
| notify\_url | string | 否 | 256 | 支付回调地址
| biz\_content | string | 是 | - | 业务请求参数的集合 ，json格式 |
| sign | string | 是 | - | 接口签名，[签名算法](#支付签名) |

#### 请求参数

| 参数 | 类型 | 是否必须 | 最大长度 | 描述 |
| :--- | :--- | :--- | :---| :--- |
| out\_trade\_no | string | 可选 | 32 | 订单支付时传入的商户订单号,和交易号不能同时为空 |
| trade\_no | string | 可选 | 32 | 交易流水号 |
| refund\_reason | string | 否 | 256 | 退款说明 |
| refund\_amount | double | 是 | - | 退款金额，不能大于支付金额 |

#### 公共响应参数

| 参数 | 类型 | 是否必填 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- | :--- |
| success | boolean | 是 | 响应结果 | true |
| errorCode | String | 否 | [错误码](#错误码：) | pay.method.no-exist |
| errorMsg | String | 否 | 错误说明 | 接口不存在 |
| data | object | 否 | 返回的数据内容 | {} |

#### 错误码：

| 错误码 | 描述 |
| :--- | :--- |
| pay.method.no-exist | 接口不存在 |
| pay.remote.service.error | 服务异常 |
| pay.appid.not.exist | appid不存在 |
| pay.param.sign.error | 签名错误 |
| pay.param.currency.not\_support | 不支持的币种 |
| pay.param.notify\_url.empty | 回调地址不能为空 |
| pay.param.invalid | 参数不合法 |

#### 响应参数

| 参数 | 类型 | 是否必须 | 最大长度 | 描述 |
| :--- | :--- | :--- | :---| :--- |
| refund\_no | string | 是 | 32 | 退款流水号 |

#### 请求示例

#### 响应示例

``` json
{
    "success":true,
    "data":{
        "refund_no":"201805152202010145729284619"
    }
}
```

#### 异常示例

``` json
{
    "success":false,
    "errorCode":"pay.remote.service.error",
    "errorMsg":"服务错误"
}
```

### 查询退款

交易退款状态查询接口，对应的method请求参数为：blockpay.trade.refund.query

#### 请求地址

| 环境 | HTTPS请求地址 |
| :--- | :--- |
| 沙箱环境 | [https://sandbox.blockcity.gxb.io/api/blockpay/api/gateway](http://sandbox.blockcity.gxb.io/api/blockpay/api/gateway) |
| 正式环境 | [https://blockcity.gxb.io/api/blockpay/api/gateway](https://blockcity.gxb.io/api/blockpay/api/gateway) |

#### 请求方式

> <font size="2">method: POST</font>
>
> <font size="2">Content-Type: application/json</font>

#### 公共请求参数

| 参数名称 | 参数类型 | 是否必须 | 最大长度 | 参数描述 |
| :--- | :--- | :--- | :---| :--- |
| app\_id | string | 是 | 16 | 商户的appid |
| method | string | 是 | - | 调用的接口，blockpay.trade.refund.query |
| timestamp | long | 是 | - | 13位时间戳（精确到毫秒） |
| version | string | 是 | - | 调用的接口版本，固定为：1.0 |
| notify\_url | string | 否 | 256 | 支付回调地址
| biz\_content | string | 是 | - | 业务请求参数的集合 ，json格式 |
| sign | string | 是 | - | 接口签名，[签名算法](#支付签名) |

#### 请求参数

| 参数 | 类型 | 是否必须 | 最大长度 | 描述 |
| :--- | :--- | :--- | :---| :--- |
| refund\_no | string | 是 | 32 | 退款流水号 |

#### 公共响应参数

| 参数 | 类型 | 是否必填 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- | :--- |
| success | boolean | 是 | 响应结果 | true |
| errorCode | String | 否 | [错误码](#错误码：) | pay.method.no-exist |
| errorMsg | String | 否 | 错误说明 | 接口不存在 |
| data | object | 否 | 返回的数据内容 | {} |

#### 错误码：

| 错误码 | 描述 |
| :--- | :--- |
| pay.method.no-exist | 接口不存在 |
| pay.remote.service.error | 服务异常 |
| pay.appid.not.exist | appid不存在 |
| pay.param.sign.error | 签名错误 |
| pay.param.currency.not\_support | 不支持的币种 |
| pay.param.notify\_url.empty | 回调地址不能为空 |
| pay.param.invalid | 参数不合法 |

#### 响应参数

| 参数 | 类型 | 是否必须 | 最大长度 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| refund\_no | string | 是 | 32 | 退款流水号 |
| trade\_no | string | 是 | 32 | 平台交易号 |
| out\_trade\_no | string | 是 | 32 | 商家订单号 |
| seller\_id | string | 是 | 32 | 卖家uuid |
| buyer\_id | string | 否 | 32 | 买家uuid |
| refund\_amount | double | 是 | - | 退款金额 |
| refund\_reason | string | 否 | 256 | 退款说明 |
| refund\_date | date | 是 | - | 退款时间 |

#### 请求示例

#### 响应示例

``` json
{
    "success":true,
    "data":{
        "refund_no":"20180515180202050488776281",
        "trade_no":"2018051621020105048872795",
        "out_trade_no":"out1526478037171",
        "seller_id":"NL4j7MFnHZnCbuj8vEp009165",
        "buyer_id":"HNxoJwimRjyoFitXQas008494",
        "refund_amount":10,
        "refund_reason":"付错了",
        "refund_date":1534559335937
    }
}
```

#### 异常示例

``` json
{
    "success":false,
    "errorCode":"pay.remote.service.error",
    "errorMsg":"服务错误"
}
```

### 关闭交易

关闭指定的支付订单接口，对应的method请求参数为：blockpay.trade.close

#### 请求地址

| 环境 | HTTPS请求地址 |
| :--- | :--- |
| 沙箱环境 | [https://sandbox.blockcity.gxb.io/api/blockpay/api/gateway](http://sandbox.blockcity.gxb.io/api/blockpay/api/gateway) |
| 正式环境 | [https://blockcity.gxb.io/api/blockpay/api/gateway](https://blockcity.gxb.io/api/blockpay/api/gateway) |

#### 请求方式


> <font size="2">method: POST</font>
>
> <font size="2">Content-Type: application/json</font>

#### 公共请求参数

| 参数名称 | 参数类型 | 是否必须 | 最大长度 | 参数描述 |
| :--- | :--- | :--- | :--- | :--- |
| app\_id | string | 是 | 16 | 商户的appid |
| method | string | 是 | - | 调用的接口，blockpay.trade.close |
| timestamp | long | 是 | - | 13位时间戳（精确到毫秒） |
| version | string | 是 | - | 调用的接口版本，固定为：1.0 |
| notify\_url | string | 否 | 256 | 支付回调地址
| biz\_content | string | 是 | - | 业务请求参数的集合 ，json格式 |
| sign | string | 是 | - | 接口签名，[签名算法](#支付签名) |

#### 请求参数

| 参数 | 类型 | 是否必须 | 最大长度 | 描述 |
| :--- | :--- | :--- | :--- |
| out\_trade\_no | string | 可选 | 订单支付时传入的商户订单号,和交易号不能同时为空 |
| trade\_no | string | 可选 | 交易流水号 |

#### 公共响应参数

| 参数 | 类型 | 是否必填 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- | :--- |
| success | boolean | 是 | 响应结果 | true |
| errorCode | String | 否 | [错误码](#错误码：) | pay.method.no-exist |
| errorMsg | String | 否 | 错误说明 | 接口不存在 |
| data | object | 否 | 返回的数据内容 | {} |

#### 错误码：

| 错误码 | 描述 |
| :--- | :--- |
| pay.method.no-exist | 接口不存在 |
| pay.remote.service.error | 服务异常 |
| pay.appid.not.exist | appid不存在 |
| pay.param.sign.error | 签名错误 |
| pay.param.currency.not\_support | 不支持的币种 |
| pay.param.notify\_url.empty | 回调地址不能为空 |
| pay.param.invalid | 参数不合法 |

#### 响应参数

#### 请求示例

#### 响应示例

``` json
{
    "success":true
}
```

#### 异常示例

``` json
{
    "success":false,
    "errorCode":"pay.remote.service.error",
    "errorMsg":"服务错误"
}
```

### 支持支付币种

拉取支持的所有支付币种接口，对应的method请求参数为：blockpay.currency.list

#### 请求地址

| 环境 | HTTPS请求地址 |
| :--- | :--- |
| 沙箱环境 | [https://sandbox.blockcity.gxb.io/api/blockpay/api/gateway](http://sandbox.blockcity.gxb.io/api/blockpay/api/gateway) |
| 正式环境 | [https://blockcity.gxb.io/api/blockpay/api/gateway](https://blockcity.gxb.io/api/blockpay/api/gateway) |

#### 请求方式

> <font size="2">method: POST</font>
>
> <font size="2">Content-Type: application/json</font>

#### 公共请求参数

| 参数名称 | 参数类型 | 是否必须 | 最大长度 | 参数描述 |
| :--- | :--- | :--- | :--- | :--- |
| app\_id | string | 是 | 16 | 商户的appid |
| method | string | 是 | - | 调用的接口，blockpay.currency.list |
| timestamp | long | 是 | - | 13位时间戳（精确到毫秒） |
| version | string | 是 | - | 调用的接口版本，固定为：1.0 |
| notify\_url | string | 否 | 256 | 支付回调地址
| biz\_content | string | 是 | - | 业务请求参数的集合 ，json格式 |
| sign | string | 是 | - | 接口签名，[签名算法](#支付签名) |
#### 请求参数

#### 公共响应参数

| 参数 | 类型 | 是否必填 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- | :--- |
| success | boolean | 是 | 响应结果 | true |
| errorCode | String | 否 | [错误码](#错误码：) | pay.method.no-exist |
| errorMsg | String | 否 | 错误说明 | 接口不存在 |
| data | object | 否 | 返回的数据内容 | {} |

#### 错误码：

| 错误码 | 描述 |
| :--- | :--- |
| pay.method.no-exist | 接口不存在 |
| pay.remote.service.error | 服务异常 |
| pay.appid.not.exist | appid不存在 |
| pay.param.sign.error | 签名错误 |
| pay.param.currency.not\_support | 不支持的币种 |
| pay.param.notify\_url.empty | 回调地址不能为空 |
| pay.param.invalid | 参数不合法 |

#### 响应参数

#### 请求示例

#### 响应示例

``` json
{
    "success":true,
    "data":["GXS","BTC"]
}
```

#### 异常示例

``` json
{
    "success":false,
    "errorCode":"pay.remote.service.error",
    "errorMsg":"服务错误"
}
```
