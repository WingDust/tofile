## Explore
> P: Purpose

> R: Reference

> N: Note

## 细粒监听到每个键
- [vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples/blob/main/vim-sample/src/extension.ts)
```ts
  function registerCommandNice(commandId: string, run: (...args: any[]) => void): void {
    context.subscriptions.push(vscode.commands.registerCommand(commandId, run));
  }

  registerCommandNice('type',(args)=>{
    console.log('run bk');
    if (!vscode.window.activeTextEditor) {
        return;
  }
    console.log('args:');
    console.log(args);
  });
  ```
> 由于 vscode 不支持多个扩展注册 'type' 命令 而 VSCodeVim 这个扩展已经注册这个， 所以不能细粒知道 Enter 与 Vim 的 o 触发
> [Multiple extensions registering the 'type' command](https://github.com/microsoft/vscode/issues/13441)
> [im extension should also follow the command dynamicly register and release patern. otherwise other extension could not use the 'type' command](https://github.com/VSCodeVim/Vim/issues/1500) 