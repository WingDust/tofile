
import {appendFileSync} from "fs";
import { exec} from "child_process";

const args = process.argv;

console.log(args);

interface Fragment{
  text:string
  lineNumber:number
}
interface Fragments{
  filename:string
  frags:Fragment[]
}

export const lsfiles = async () => {

  let content:Fragments[] = [];

  const run = String.raw`rg --json -U -P '(?<=^|\n)(?P<i>\s*)/\*\\.*(\n\k<i>\|\*\|.*)+\n\k<i>\\\*/' ${process.cwd()} -i ${process.cwd()+'\\Fragments.md'}`;

  const re = exec(run,{shell:'pwsh',encoding:'utf-8'});
  re.stdout!.on('data',(data:string)=>{
    console.count('out');
    console.log(data);

    // 通过 throw new Error('') 来中断 `forof`
    let err;
    try {
      let comp:Fragments = Object.create(null);
      comp.frags=[];
      for (const i of data.split('\n')) {
        err = i;
        if(i===''||i==='\r') {break;};
        let ctx = JSON.parse(i);
        // console.log(1);
        // console.log(ctx);
        // console.log(2);
        if (ctx.type ==='summary') {
          contentnormalize(content);
          throw new Error("end");
        }
        if (ctx?.type==='begin') {
          comp.filename = ctx.data.path.text;
        }
        if (ctx?.type==='match') {
        comp.frags.push({text:ctx.data.lines.text,lineNumber:ctx.data.lineNumber});
        }
      }
      if (comp.frags.length!==0){
        content.push(comp);
      }
    } catch (error) {
      if((<string>error.message).includes('JSON')){
        console.log('JSON:',JSON.stringify(err));
      }
      else{
        // console.log(error);
      }
    }
  });

  re.stderr!.on('data',(data:any)=>{
    console.log(data);
  });
  re.on('close',(code:any)=>{
    // console.log(code);
  });

};
lsfiles();

const contentnormalize = (content:Fragments[])=>{
  for (const i of content) {
    for (const j of i.frags) {
      // console.log(j);

      // let frag
      for (const [k,line] of j.text.split('\n').entries()) {w:{
        // console.log(k,line.substr(2,line.length));
        // console.log(j.text.split('\n'));
        // console.log(line.trim());

        switch (k) {
          case 0:{
            let title = line.trim().substr(3,line.length).trim();
            if (title.length!==0) {
              write(title);
              write(`  > ${i.filename}#L${j.lineNumber}`);
              break;
            }
            // console.log(1);
            // console.log(JSON.stringify(title));
            break w;
          }
          default:{
            if (line.trim().substr(3,line.length).trim()==='') {break;}
            write(line.trim().substr(3,line.length).trim());
            break;
          }
        }
      }}
    }
  }
};

const write = (str:string)=>{
  appendFileSync(process.cwd()+'\\Fragments.md',str+'\n');
};