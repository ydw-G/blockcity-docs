# 常见问题

## 证书相关

#### Q1：javax.net.ssl.SSLHandshakeException

全部接口均支持HTTPS证书，所使用的证书来自于Let’s Encrypt。由于证书来源问题，JDK 8u101之前的版本调用公信宝接口时可能出现SSLHandshakeException：sun.security.validator.ValidatorException: PKIX path building failed:
sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target。以下两种方式都可以获取有效的访问证书，并不会对商户其他的访问业务产生影响。

* 解决方案1：对证书没有特殊需求的商户可直接使用[JDK 8u101的默认可信证书](http://gxb-doc.oss-cn-hangzhou.aliyuncs.com/dcdoc/cacerts)，无需升级java版本。

* 解决方案2：对当前版本的jdk证书，进行合并。教程：[https://gist.github.com/hedefalk/9442c224e7de4739e8cee6b7e88c4d7f](https://gist.github.com/hedefalk/9442c224e7de4739e8cee6b7e88c4d7f) （需翻墙）把获得的有效证书更新让jvm能获取到，即可解决这个问题

* 证书更新方案1：显示设置可信证书

> <font size="2">System.setProperty("javax.net.ssl.trustStore", new File("cacerts").getAbsolutePath());</font>

* 证书更新方案2：把证书直接覆盖系统证书，路径： $JAVA_HOME/jre/lib/security/cacerts
