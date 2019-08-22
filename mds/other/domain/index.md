## 独立域名绑定教程



## 文件域名绑定教程



1.第一步：控制台->应用设置->域名管理

>  备案域名，这里需要注意的是，一般使用二级域名例如：files.xxxx.com

![QQ20190813-175604](./QQ20190813-175604.png)





第二步：进入域名管理商，修改 CNAME 记录

登入域名的 DNS 服务商网站，修改 CNAME 记录，具体配置方法可参见如下链接：

[DNSPod CNAME 接入 CDN](https://support.dnspod.cn/Kb/showarticle/tsid/32/?spm=5176.doc27112.2.16.GAMn1f)

[新网 CNAME 接入 CDN](http://www.xinnet.com/service/cjwt/domain/guanli/1164.html?spm=5176.doc27112.2.17.GAMn1f)

[万网 CNAME 接入 CDN](https://help.aliyun.com/document_detail/29725.html?spm=5176.doc27112.2.15.jhFGwZ)



域名解析添加cname解析

![QQ20190816-094939](./QQ20190816-094939.png)



第三步：验证 CNAME 配置是否生效

因 DNS 解析记录都有缓存时间，CNAME 的生效时间一般是 600s，可通过 ping 所配置的加速域名，检验 CNAME 配置是否生效，如果后缀显示为 aicdn.com，则证明 CNAME 配置已生效，即加速业务正式开始启用。文件域名如下所示：

```
➜  ~ ping cdn.xxxxxx.com
PING nm.aicdn.com (58.222.18.2): 56 data bytes
64 bytes from 58.222.18.2: icmp_seq=0 ttl=55 time=33.468 ms
64 bytes from 58.222.18.2: icmp_seq=1 ttl=55 time=31.251 ms
64 bytes from 58.222.18.2: icmp_seq=2 ttl=55 time=32.382 ms
64 bytes from 58.222.18.2: icmp_seq=3 ttl=55 time=31.797 ms
```



## API域名绑定教程

API域名也就是restful 域名，绑定教程与文件域名完全一致，在第三步验证是否生效的操作下，可以访问自己绑定API域名与 api2.bmob.cn 内容是否一致，一致则绑定成功。



## SDK域名绑定教程

SDK域名也就是APP SDK使用域名，绑定教程与文件域名完全一致，在第三步验证是否生效的操作下，可以访问自己绑定SDK域名与 open2.bmob.cn 内容是否一致，一致则绑定成功。

SDK要让绑定的域名生效，还需要重置域名：

请直接参考：

[android重置域名设置](http://doc.bmob.cn/data/android/develop_doc/#_71)

[iOS重置域名设置](http://doc.bmob.cn/data/ios/develop_doc/#_5)

## 云函数域名绑定教程

云函数域名也就是平时使用的cloud.bmob.cn 域名，绑定教程与文件域名完全一致，在第三步验证是否生效的操作下，可以访问自己绑定SDK域名与 cloud.bmob.cn 内容是否一致，一致则绑定成功。