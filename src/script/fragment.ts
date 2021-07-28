import {appendFileSync} from "fs";
import {execSync} from "child_process";

const args = process.argv.slice(2);

interface Fragment{
  text:string
  lineNumber:number
}
interface Fragments{
  filename:string
  frags:Fragment[]
}


const contentnormalize = (content:Fragments[])=>{
  for (const i of content) {
    for (const j of i.frags) {
      console.log(j);

      // let frag
      for (const [k,line] of j.text.split('\n').entries()) {
        w:{
        // console.log(k,line.substr(2,line.length));
        // console.log(j.text.split('\n'));
        // console.log(line.trim());

          switch (k) {
            case 0:{
              let title = line.trim().substr(3,line.length).trim();
              if (title.length!==0) {
                write(title);
                write(`  > ${i.filename.replace(process.cwd()+'\\','').replace(/\\/g,'/')}:${j.lineNumber}`);
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

const write = (str:string)=>{
  appendFileSync(process.cwd()+'\\Fragments.md',str+'\n');
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
          console.log(content);
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
