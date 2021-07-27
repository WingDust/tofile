## Exploer
> P: Purpose

> R: Reference

> N: Note

- 细粒监听到每个键
  - [vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples/blob/main/vim-sample/src/extension.ts)
  ```ts
   function registerCommandNice(commandId: string, run: (...args: any[]) => void): void {
     context.subscriptions.push(vscode.commands.registerCommand(commandId, run));
   }

   registerCommandNice('default:type',(args)=>{
     console.log('run bk');
     if (!vscode.window.activeTextEditor) {
      		return;
    }
     console.log('args:');
     console.log(args);
   });
  ```