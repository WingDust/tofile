import {appendFileSync,existsSync,unlinkSync,readFileSync} from "fs";
import {execSync,} from "child_process";
import { posix } from "path";

const args = process.argv.slice(2);

if (args.length===0) {
  process.exit(0);
}
const fragmentfile = posix.join(process.cwd().replace(/\\/g,'/'),args[0]+'-Fragments.md');

interface Fragment{
  text:string
  lineNumber:number
}
interface Fragments{
  filename:string
  frags:Fragment[]
}


/** 判断文件内容是否为空
 * @param path 
 * @returns boolean
 */
export const isEmptyContent = (path:string):boolean=>{
  if (existsSync(path)&&readFileSync(path).length===0){return true;};
  return false;
};

const write = (str:string)=>{
  appendFileSync(fragmentfile,str+'\n');
};

const contentnormalize = (content:Fragments[])=>{
  for (const [i,fragment] of content.entries()) {
    // 文件写入检查
    if (i === 0 && isEmptyContent(fragmentfile)) {unlinkSync(fragmentfile);};

    for (const j of fragment.frags) {
      for (const [k,line] of j.text.split('\n').entries()) {
        w:{
          switch (k) {
            case 0:{ 

              let title = line.trim().substr(3,line.length).trim();
              if (title.length!==0) {
                write(title);
                write(`  > ${fragment.filename.replace(process.cwd()+'\\','').replace(/\\/g,'/')}:${j.lineNumber}`);
                break;
              }
              // console.log(1);
              // console.log(JSON.stringify(title));
              break w;
            }
            default:{
              if (line.trim().substr(3,line.length).trim()==='') {break;}
              write(line.trim().substr(3,line.length));
              break;
            }
          }
        }
    }
    }
  }
};


export const lsfiles = () => {

  let content:Fragments[] = [];

  let comp:Fragments = Object.create(null);
  comp.frags=[];

  const multiline = '-U';
  const jsonoutput = '--json';
  const regex = String.raw`-P '(?<=^|\n)(?P<i>\s*)/\*\\.*(\n\k<i>\|\*\|.*)+\n\k<i>\\\*/'`;
  const ignoremdorg = "-g '!*.md' -g '!*.org'";
  const ignorereult = "-g '!**/Fragments.md'";
  const workspace = process.cwd();
  // const resultfile = '-i' + process.cwd() + '\\Fragments.md';
  
  const run = `rg ${jsonoutput} ${multiline} ${regex} ${ignoremdorg} ${ignorereult} ${workspace} `;
  
  // const run = String.raw`rg --json -U -P '(?<=^|\n)(?P<i>\s*)/\*\\.*(\n\k<i>\|\*\|.*)+\n\k<i>\\\*/' -g '!*.md' -g '!*.org' ${process.cwd()} -i ${process.cwd()+'\\Fragments.md'}`;
  
  const re =  execSync(run,{shell:'pwsh',encoding:'utf-8'});
  // console.log(re);
  
    /*\ ## 中断 `forof`
    |*| - A:
    |*|   - throw new Error('')
    |*|   - break
    \*/ 
    let err;//记录 JSON.parse 有误的信息
    try {
      for (const i of re.split('\n')) {
        err = i;
        if(i===''||i==='\r') {break;};
        let ctx = JSON.parse(i);
        if (ctx?.type ==='summary') {
          // console.log(content);
          contentnormalize(content);
          break;
        }
        if (ctx?.type==='begin') {
          comp.filename = ctx.data.path.text;
        }
        if (ctx?.type==='match') {
          comp.frags.push({text:ctx.data.lines.text,lineNumber:ctx.data.line_number});
        }
        if (ctx?.type==='end'){
          content.push(Object.assign({},comp));
          // 清空 comp
          comp.filename = '';
          comp.frags = [];
        }
      }
    }
    // 
    catch (error) {
      if((<string>error.message).includes('JSON')){
        console.log('JSON:',JSON.stringify(err));
      }
      else{
        // console.log(error);
      }
    }
  

};
lsfiles();
