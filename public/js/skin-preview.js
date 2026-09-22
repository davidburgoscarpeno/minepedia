(function(){
const F={head:{top:[8,0,8,8],bottom:[16,0,8,8],right:[0,8,8,8],front:[8,8,8,8],left:[16,8,8,8],back:[24,8,8,8]},
hat:{top:[40,0,8,8],bottom:[48,0,8,8],right:[32,8,8,8],front:[40,8,8,8],left:[48,8,8,8],back:[56,8,8,8]},
body:{top:[20,16,8,4],bottom:[28,16,8,4],right:[16,20,4,12],front:[20,20,8,12],left:[28,20,4,12],back:[32,20,8,12]},
jacket:{top:[20,32,8,4],bottom:[28,32,8,4],right:[16,36,4,12],front:[20,36,8,12],left:[28,36,4,12],back:[32,36,8,12]},
rarm:{top:[44,16,4,4],bottom:[48,16,4,4],right:[40,20,4,12],front:[44,20,4,12],left:[48,20,4,12],back:[52,20,4,12]},
rarm2:{top:[44,32,4,4],bottom:[48,32,4,4],right:[40,36,4,12],front:[44,36,4,12],left:[48,36,4,12],back:[52,36,4,12]},
rleg:{top:[4,16,4,4],bottom:[8,16,4,4],right:[0,20,4,12],front:[4,20,4,12],left:[8,20,4,12],back:[12,20,4,12]},
rleg2:{top:[4,32,4,4],bottom:[8,32,4,4],right:[0,36,4,12],front:[4,36,4,12],left:[8,36,4,12],back:[12,36,4,12]},
larm:{top:[36,48,4,4],bottom:[40,48,4,4],right:[32,52,4,12],front:[36,52,4,12],left:[40,52,4,12],back:[44,52,4,12]},
larm2:{top:[52,48,4,4],bottom:[56,48,4,4],right:[48,52,4,12],front:[52,52,4,12],left:[56,52,4,12],back:[60,52,4,12]},
lleg:{top:[20,48,4,4],bottom:[24,48,4,4],right:[16,52,4,12],front:[20,52,4,12],left:[24,52,4,12],back:[28,52,4,12]},
lleg2:{top:[4,48,4,4],bottom:[8,48,4,4],right:[0,52,4,12],front:[4,52,4,12],left:[8,52,4,12],back:[12,52,4,12]}};
function drawFace(ctx,img,part,face,dx,dy,s){const r=F[part][face];ctx.drawImage(img,r[0],r[1],r[2],r[3],dx*s,dy*s,r[2]*s,r[3]*s);}
window.renderSkin=function(canvas,img,view,s){const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,canvas.width,canvas.height);
if(view==='front'||view==='back'){const f=view;
const armL=view==='front'?['rarm','rarm2']:['larm','larm2'],armR=view==='front'?['larm','larm2']:['rarm','rarm2'];
const legL=view==='front'?['rleg','rleg2']:['lleg','lleg2'],legR=view==='front'?['lleg','lleg2']:['rleg','rleg2'];
drawFace(ctx,img,'head',f,4,0,s);drawFace(ctx,img,'body',f,4,8,s);
drawFace(ctx,img,armL[0],f,0,8,s);drawFace(ctx,img,armR[0],f,12,8,s);
drawFace(ctx,img,legL[0],f,4,20,s);drawFace(ctx,img,legR[0],f,8,20,s);
drawFace(ctx,img,'hat',f,4,0,s);drawFace(ctx,img,'jacket',f,4,8,s);
drawFace(ctx,img,armL[1],f,0,8,s);drawFace(ctx,img,armR[1],f,12,8,s);
drawFace(ctx,img,legL[1],f,4,20,s);drawFace(ctx,img,legR[1],f,8,20,s);
}else{drawFace(ctx,img,'head','left',4,0,s);drawFace(ctx,img,'body','left',6,8,s);drawFace(ctx,img,'larm','left',6,8,s);drawFace(ctx,img,'lleg','left',6,20,s);
drawFace(ctx,img,'hat','left',4,0,s);drawFace(ctx,img,'jacket','left',6,8,s);drawFace(ctx,img,'larm2','left',6,8,s);drawFace(ctx,img,'lleg2','left',6,20,s);}};
function init(){document.querySelectorAll('canvas.skinview').forEach(c=>{const img=new Image();img.onload=()=>window.renderSkin(c,img,c.dataset.view||'front',+c.dataset.scale||4);img.src=c.dataset.src;});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
