# 小应用开发准备

## 应用开发对接

导航栏点击“文档”，查看对接文档，并开发自身应用服务；注：AppID、AppSecret可在“详情”中查看。

![img](/blockcity/img/d-3-1.png)

点击详情:

![img](/blockcity/img/d-3-2.png)

获取AppID和AppSecret:

![img](/blockcity/img/d-3-3.png)

配置应用入口地址（应用在布洛克城点击后进入的地址）：

![img](/blockcity/img/d-3-4.png)

配置应用支付交互接口加签RSA公钥（RSA签名算法公钥，接入布洛克城支付时需提供，详见[BlockPay支付](capacity.html#blockpay支付)）：

![img](/blockcity/img/d-3-5.png)

授权回调地址当前可不配置，在授权接口直接传入即可（详见[GID授权](capacity.html#gid授权)）。

## 下载沙箱环境

在应用管理页，找到刚创建的沙箱应用，点击操作栏的[下载沙箱环境](https://fir.im/blockcitysandbox)，下载布洛克城沙箱Dapp，安装运行；并前往用户中心，绑定布洛克城账号（请直接绑定生产环境的账号，沙箱环境可直接用生产账号登录，如之前已绑定则略过）；绑定成功后，可在沙箱Dapp的创新应用区中直接查看刚创建的应用。

下载沙箱环境：

![img](/blockcity/img/d-3-6.png)

查看应用：

![img](/blockcity/img/d-3-7.png)

## 沙箱环境联调测试

在沙箱环境，完成所有相关功能测试。
