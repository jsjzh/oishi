# oishi

> oishi 是日语「好好次」的发音，日语写作「おいしい」。

## 项目介绍

这个项目中会结合一些好用的库为工具，写一些爬虫代码，具体的项目介绍可以看各 packages 下的介绍

另外，项目管理工具用的是 lerna，谁用谁知道，特好使！

## packages/fund-shared

整合了很多在写爬虫代码的时候通用的一些包装过的代码，比如网络请求库，打日志的库，以及队列库等等。

> 特地拆开为 fund-shared 和 fund-ttjj 有「为了用 lerna 而用」的嫌疑。。。

## packages/fund-ttjj

第一个爬虫库，在写该爬虫库的时候，修修改改很多次，为了实现一些功能，不得不对已经写好的代码进行再改造，现在初版已经完成，当然还有很多可以优化的地方，后面还会继续更新，因为远远还没写完～～

该库也可以直接使用，后面还有一些想要改造的点，所以暂时没有上传 npm，如果想要使用的话可以先 git clone 到本地 npm install 使用。

### 使用手册

#### 前置

1. 要保证 config/srcret.json 中有所需的数据，需要什么的数据可以看 core/service/index.ts，里面有写，而获取这些数据的方法也很简单，打开你的 charles。。。
2. 爬虫爬下来的代码会在 output 中，还未处理，后续想要结合操作 excel 的 node 第三方库做处理

#### 用法

编译的命令行直接打开 package.json 查看即可

TaskController
...

Task
...

callback
...
