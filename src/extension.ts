/*\ ## Technical point
|*| - [Capturing keystrokes in visual studio code extension](https://stackoverflow.com/questions/36727520/capturing-keystrokes-in-visual-studio-code-extension#answer-36753622)
|*| - [How to open file and insert text using the VSCode API](https://stackoverflow.com/questions/38279920/how-to-open-file-and-insert-text-using-the-vscode-api)
\*/


// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { existsSync } from "fs";
import { join } from "path";


const linkto = (txt:string):string[]|null=>{
    /*\ ## 正则表达匹配一个词
    |*| - [词边界：\b](https://zh.javascript.info/regexp-boundary)
    \*/
    const re = /\b[^\?\*:\"\<\>\\\/\|\']+\b(\/\b[^\?\*:\"\<\>\\\/\|\']+\b)*\.[A-Za-z]+(:\d+)?(:\d+)?/;
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
      let link = txt.match(re);
      if (link) {
        if (link[0].includes(':')){
          let linkf =link[0].split(':');
          linkf[0] = join(workspaceFolders[0].uri.fsPath,linkf[0]);
          if (existsSync(linkf[0])) {return linkf;}
          vscode.window.showInformationMessage(`Link file don't exist.`);
        }
        else{
          let linkf = join(workspaceFolders[0].uri.fsPath,link[0]);
          if (existsSync(linkf)) {return [linkf];}
          vscode.window.showInformationMessage(`Link file don't exist.`);
        }
        vscode.window.showInformationMessage(`Not have link sting.`);
        return null;
      }
      else{
        if (vscode.env.language) {
          console.log(vscode.env.language);
          vscode.window.showInformationMessage(`Link file don't exist.`);
        }
        return null;
      }
    }
    return null;
};


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tofile" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('tofile.tofile', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const activeEditor = vscode.window.activeTextEditor;
    //   console.log(activeEditor?.document.getText());
      const position = activeEditor?.selection.active;
      // console.log(position);
      const curlinestart = new vscode.Position(position?.line!,0);
      const nextlinestart = new vscode.Position(position?.line!+1,0);
      const rangewith = new vscode.Range(curlinestart,nextlinestart);
      const curtxt =  activeEditor?.document.getText(rangewith);
      // console.log(JSON.stringify(curtxt));
      const findpath = vscode.workspace.workspaceFolders;
      // console.log(findpath);
      if (curtxt) {
        let path = linkto(curtxt);
        if (path) {
          vscode.workspace.openTextDocument(path[0])
          .then(document => { 
            vscode.window.showTextDocument(document)
            .then((editor)=>{

              /*\ ## 在 VSCode 中打开文件并跳转指定行
              |*| - [VSCode Open a File In a Specific Line Number Using JS](https://stackoverflow.com/questions/62453615/vscode-open-a-file-in-a-specific-line-number-using-js)
              |*| - [Extensibility API command for moving cursor to line](https://github.com/Microsoft/vscode/issues/6695)
              |*| - [Vscode open file with showTextDocument at specified line](https://stackoverflow.com/questions/62313150/vscode-open-file-with-showtextdocument-at-specified-line)
              \*/ 

              if (path?.length===1){
                let r = activeEditor?.document.lineAt(0).range;
                editor.selection = new vscode.Selection(r?.start!,r?.end!);
                editor?.revealRange(r!);
              }
              if (path?.length===2){
                let l = Number(path[1])-1;
                let pos1 = new vscode.Position(l,0);
                editor.selections = [new vscode.Selection(pos1,pos1)];
                let r = new vscode.Range(pos1,pos1);
                editor?.revealRange(r!);
              }
              if (path?.length===3){
                let l = Number(path[1])-1;
                let c = Number(path[2]);
                let pos1 = new vscode.Position(l,c);
                editor.selections = [new vscode.Selection(pos1,pos1)];
                let r = new vscode.Range(pos1,pos1);
                activeEditor?.revealRange(r!);
              }
            });
          
          });
        }
      }

		// vscode.window.showInformationMessage('Hello World from tofile!');
	});

  let len: number | undefined;

	vscode.window.onDidChangeTextEditorSelection((event)=>{
		console.log("Change in the text editor");
    const activeEditor = vscode.window.activeTextEditor;
		// const selection = event.selections[i];
    // vscode.TextEditorSelectionChangeKind;
    // console.log(event);
    // 
    // console.log(activeEditor?.document.getText());
    if (activeEditor?.document.getText().length===len) {return;};
    len = activeEditor?.document.getText().length;

    if (event.selections.length===1) {
      let selection = event.selections[0];
      // 处理重复触发
      let preiousline = new vscode.Position(selection.start.line,0);
      let nextline = new vscode.Position(selection.start.line+1,0);
      let range = new vscode.Range(preiousline,nextline);
      const curtxt =  activeEditor?.document.getText(range);

      // console.log(JSON.stringify(curtxt?.trimLeft().substr(0,3)));
      if (curtxt?.trimLeft().substr(0,3)==="|*|") {return;};

      if(selection.start.line===selection.end.line&&selection.start.character===selection.end.character){
        let preiousline = new vscode.Position(selection.start.line-1,0);
        let nextline = new vscode.Position(selection.start.line,0);
        let range = new vscode.Range(preiousline,nextline);
        const pretxt =  activeEditor?.document.getText(range);
        if (pretxt?.trimLeft().substr(0,3)!=='|*|'){return;}
        // 修正缩进不对
        /*\ ## 只匹配空格
        |*| - [正则表达式：只匹配空格，不匹配换行等其余空白字符](https://blog.csdn.net/jsjcmq/article/details/111935641)
        \*/

        let spa = /^\x20*/;
        // let num = (curtxt?.length!-curtxt?.trimLeft().length!)-(pretxt?.length!-pretxt?.trimLeft().length!);
        // let num = pretxt?.match(spa)![0].length!-curtxt?.match(spa)![0].length!;
        // console.log(num);
        // console.log('curtxt.trim:',curtxt?.trimLeft());
        // console.log('pretxt:',pretxt);
        // console.log('pretxt.trim:',pretxt?.trimLeft());
        // console.log(curtxt?.match(spa)![0]);

        console.log((curtxt?.match(spa)![0].length));
        console.log((pretxt?.match(spa)![0].length));
        console.log(JSON.stringify(curtxt?.match(spa)![0]));
        console.log(JSON.stringify(pretxt?.match(spa)![0]));
        let n = pretxt?.match(spa)![0].length!-selection.start.character;
        // console.log(n);
        // console.log(JSON.stringify(curtxt?.trimLeft().substr(0,3)));
        if (curtxt?.trimLeft().substr(0,3)==="\\*/"){
          return;
        }
        if (n>0){
          console.log('spa');
          vscode.window.showTextDocument(activeEditor?.document!)
          .then(e=>{
            e.edit(edit=>{
              edit.insert(new vscode.Position(selection.start.line,selection.start.character)," ".repeat(n));
            });
          });
        }
        if (pretxt?.trimLeft().substr(0,3)==="|*|"&&curtxt?.trimLeft().substr(0,3)==="") {
          console.log(selection.start.line,selection.start.character);
          vscode.window.showTextDocument(activeEditor?.document!)
          .then(e=>{
            e.edit(edit=>{
              edit.insert(new vscode.Position(selection.start.line,selection.start.character),"|*|");
            });
          });
        }

      }
    }
		// for(var i = 0;i < event.selections.length;i++)
		// {
		// 	var selection = event.selections[i];
		// 	console.log("Start- Line: (" + selection.start.line + ") Col: (" + selection.start.character + ") End- Line: (" + selection.end.line + ") Col: (" + selection.end.character + ")");
		// }
		// console.log(event);

	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
