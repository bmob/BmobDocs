## 文件/目录说明

- docs 为mkdocs生成的静态页面存放目录

由mkdocs自动生成，无需手动修改。

- mds 为相关文档的源文件存放目录

更新文档时，请找到相关文档的md文件进行修改。

- theme 为文档主题

- mkdocs.yml 为mkdocs的配置文件

当新增或删除相关文档时需要在次文件中修改pages目录树结构


现在有了新的标题需求，因此要修改mkdocs的源码。

修改处为nav.py中的Page object的__init__方法，新增了一个用于html页面显示标题的属性htmlTitle。

这块显示的对应模板是theme/bmobdocs/main.html中的<title>

mkdocs的源码要生效，需要复制到python的mkdocs的文件夹下



