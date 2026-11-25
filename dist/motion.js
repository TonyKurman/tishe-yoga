'use strict';
(() => {
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const toggle=document.querySelector('.motion-toggle');
 const breathToggle=document.querySelector('#breath-toggle');
 const pauseSection=document.querySelector('#pause');
 const scene=document.querySelector('.breathing-scene');
 const header=document.querySelector('.header');
 const heroVisual=document.querySelector('.hero-visual');
 const progress=document.querySelector('.reading-progress');
 const dot=document.querySelector('.cursor-dot');
 const ring=document.querySelector('.cursor-ring');
 let manuallyPaused=false;
 let scenePaused=false;
 let paused=reduced.matches;
 let cursorEnabled=false;
 let ringFrame=0,scrollFrame=0;
 let x=0,y=0,rx=0,ry=0,initialized=false;

 function hideCursor(){document.body.classList.remove('cursor-visible','cursor-hover','cursor-photo');}
 function configureCursor(){
  cursorEnabled=fine.matches&&!paused&&!reduced.matches;
  document.body.classList.toggle('custom-cursor',cursorEnabled);
  if(!cursorEnabled){hideCursor();cancelAnimationFrame(ringFrame);ringFrame=0;initialized=false;}
 }
 function applyMotion(){
  paused=manuallyPaused||reduced.matches;
  root.classList.toggle('motion-paused',paused);
  toggle.setAttribute('aria-pressed',String(paused));
  toggle.disabled=reduced.matches;
  toggle.setAttribute('aria-label',reduced.matches?'Анимации отключены настройками системы':paused?'Включить анимации':'Приостановить анимации');
  toggle.querySelector('span').textContent=paused?'▶':'Ⅱ';
  breathToggle.disabled=paused;
  breathToggle.setAttribute('aria-pressed',String(paused||scenePaused));
  breathToggle.innerHTML=`${paused?'Движение на паузе':scenePaused?'Продолжить движение':'Пауза в движении'} <span>${paused||scenePaused?'▶':'Ⅱ'}</span>`;
  configureCursor();
  updateScroll();
 }
 toggle.addEventListener('click',()=>{manuallyPaused=!manuallyPaused;applyMotion();});
 reduced.addEventListener('change',applyMotion);
 fine.addEventListener('change',configureCursor);
 breathToggle.addEventListener('click',()=>{
  scenePaused=!scenePaused;
  pauseSection.classList.toggle('breath-paused',scenePaused);
  applyMotion();
 });

 let revealObserver;
 if('IntersectionObserver' in window){
  revealObserver=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver.unobserve(entry.target);}
  },{threshold:.06,rootMargin:'0px 0px -15px 0px'});
  const register=(elements)=>elements.forEach((element,index)=>{
   if(element.classList.contains('reveal-ready'))return;
   element.classList.add('reveal-ready');
   if(element.matches('.gallery-item,.journal-card,.price-card'))element.style.setProperty('--reveal-delay',`${index%3*65}ms`);
   revealObserver.observe(element);
  });
  register(document.querySelectorAll('.manifesto-content,.about-images,.about-copy,.pause-copy,.section-heading,.approach-grid article,.price-card,.journal-card,.event-large,.event-small,.faq>div,.contacts>h2,.contact-grid>div,.gallery-item'));
  document.addEventListener('photos:rendered',()=>register(document.querySelectorAll('.gallery-item')));
  document.addEventListener('focusin',event=>{
   let parent=event.target;
   while(parent&&parent!==document.body){if(parent.classList?.contains('reveal-ready'))parent.classList.add('revealed');parent=parent.parentElement;}
  });
  const motionVisibility=new IntersectionObserver(entries=>{
   for(const entry of entries)entry.target.classList.toggle('motion-offscreen',!entry.isIntersecting);
  },{rootMargin:'80px'});
  document.querySelectorAll('.breathing-scene,.hero-visual,.marquee,.event-symbol,.live-dot').forEach(element=>motionVisibility.observe(element));
 }

 function updateScroll(){
  scrollFrame=0;
  const height=root.scrollHeight-innerHeight;
  progress.style.transform=`scaleX(${height>0?Math.min(1,Math.max(0,scrollY/height)):0})`;
  header.classList.toggle('scrolled',scrollY>12);
  heroVisual.style.transform=!paused&&fine.matches&&innerWidth>760?`translateY(${Math.min(scrollY*.035,16)}px)`:'none';
 }
 addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});
 addEventListener('resize',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});
 function moveRing(){
  rx+=(x-rx)*.15;ry+=(y-ry)*.15;
  ring.style.transform=`translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
  if(cursorEnabled&&(Math.abs(x-rx)+Math.abs(y-ry)>.15))ringFrame=requestAnimationFrame(moveRing);else ringFrame=0;
 }
 document.addEventListener('pointermove',event=>{
  if(!cursorEnabled||event.pointerType==='touch')return;
  const editable=event.target.closest('input,select,textarea');
  if(editable){hideCursor();return;}
  x=event.clientX;y=event.clientY;
  if(!initialized){rx=x;ry=y;initialized=true;}
  document.body.classList.add('cursor-visible');
  document.body.classList.toggle('cursor-hover',!!event.target.closest('a,button,summary'));
  document.body.classList.toggle('cursor-photo',!!event.target.closest('.photo-target'));
  ring.querySelector('span').textContent='СМОТРЕТЬ ↗';
  dot.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
  if(!ringFrame)ringFrame=requestAnimationFrame(moveRing);
 },{passive:true});
 document.addEventListener('pointerleave',hideCursor);
 addEventListener('blur',hideCursor);
 document.addEventListener('keydown',event=>{if(event.key==='Tab')hideCursor();});
 document.addEventListener('visibilitychange',()=>{
  root.classList.toggle('page-hidden',document.hidden);
  if(document.hidden){hideCursor();cancelAnimationFrame(ringFrame);ringFrame=0;}
 });
 applyMotion();
})();
