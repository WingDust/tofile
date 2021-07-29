## 中断 `forof`
  > src/script/fragment.ts:91
 - A:
   - throw new Error('')
   - break
## Technical point
  > src/extension.ts:1
  - R:
   - [VSCode Open a File In a Specific Line Number Using JS](https://stackoverflow.com/questions/62453615/vscode-open-a-file-in-a-specific-line-number-using-js)
   - [Capturing keystrokes in visual studio code extension](https://stackoverflow.com/questions/36727520/capturing-keystrokes-in-visual-studio-code-extension#answer-36753622)
   - [How to open file and insert text using the VSCode API](https://stackoverflow.com/questions/38279920/how-to-open-file-and-insert-text-using-the-vscode-api)
## 只匹配空格
  > src/extension.ts:117
  ```ts
  '  \n'.match(new RegExp(String.raw`^\x20*`))
  ```
  - R:
    - [正则表达式：只匹配空格，不匹配换行等其余空白字符](https://blog.csdn.net/jsjcmq/article/details/111935641)
