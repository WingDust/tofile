## Design
- 划分开多行 Fragment 
  - 对于对于单行应该只有一个 Link
- 默认排除 `md` `org` 文件
- 提供一个文件后缀名参数，只对特定文件生成 Fragments.md
  > 将多种语言分开产出文件
- 每次重新生成，将覆盖原文件

## 注意
> 由于 vscode 不支持多个扩展注册 'type' 命令 而 VSCodeVim 这个扩展已经注册这个， 所以不能细粒知道 Enter 与 Vim 的 o 触发
> [Multiple extensions registering the 'type' command](https://github.com/microsoft/vscode/issues/13441)
> [im extension should also follow the command dynamicly register and release patern. otherwise other extension could not use the 'type' command](https://github.com/VSCodeVim/Vim/issues/1500) 
- 