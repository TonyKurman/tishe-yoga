'use strict';
const $ = s => document.querySelector(s);
const modal = $('#modal');
const body = $('#modal-body');
let returnFocus;
function openModal(html,photo=false) {
 if(!modal.open) returnFocus=document.activeElement;
 modal.classList.toggle('photo-dialog',photo);
 body.innerHTML=html;
 document.body.classList.add('modal-open');
 if(!modal.open) modal.showModal();
}
function closeModal(){modal.close();if(returnFocus?.isConnected)returnFocus.focus();}
$('.close-modal').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
modal.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(returnFocus?.isConnected)returnFocus.focus();});
const escapeHtml = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let format='all';
function renderSchedule(){
 const classes=window.YOGA_CONTENT.classes.filter(c=>(format==='all'||c.format===format)&&($('#style-filter').value==='all'||c.style===$('#style-filter').value)&&($('#level-filter').value==='all'||c.level===$('#level-filter').value));
 $('#schedule-list').innerHTML=classes.length?classes.map(c=>`<article class="class-row"><div class="class-day">${escapeHtml(c.day)}<span>${escapeHtml(c.date)}</span></div><div class="class-time">${escapeHtml(c.time)}<small>${c.duration} минут</small></div><div class="class-name"><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.style)} · ${c.level==='beginner'?'Для начинающих':'Для всех уровней'}</p></div><span class="format-tag">${c.format==='online'?'Онлайн':'В зале · адрес скоро'}</span><button class="button outline" data-book="${escapeHtml(c.title+' · '+c.date+' · '+c.time)}">Записаться ↗</button></article>`).join(''):'<p class="empty">Для этих фильтров занятий нет. Попробуйте другое направление или формат.</p>';
}
for(const chip of document.querySelectorAll('[data-format]'))chip.addEventListener('click',()=>{format=chip.dataset.format;document.querySelectorAll('[data-format]').forEach(b=>{const active=b===chip;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderSchedule();});
$('#style-filter').addEventListener('change',renderSchedule);$('#level-filter').addEventListener('change',renderSchedule);renderSchedule();
const menu=$('.menu-toggle');
function setMenu(open){
 $('#nav').classList.toggle('open',open);
 menu.setAttribute('aria-expanded',String(open));
 menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
}
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
$('#nav').addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus();}});
function book(title){openModal(`<div class="modal-eyebrow">ВАШ ПЕРВЫЙ ШАГ</div><h2 id="modal-title">Место для практики</h2><p>${escapeHtml(title)}</p><p class="notice">Это демонстрация записи. Данные никуда не отправляются и не сохраняются. Используйте вымышленные данные для проверки.</p><form class="booking"><label>Как к вам обращаться<input name="name" autocomplete="off" placeholder="Например, гость" required maxlength="80"></label><label>Email для связи<input type="email" name="email" autocomplete="off" placeholder="guest@example.com" required maxlength="160"></label><label class="check"><input type="checkbox" required><span>Я понимаю, что это демонстрация, и ознакомился с <a href="privacy.html" target="_blank" rel="noopener">описанием конфиденциальности</a>.</span></label><button class="button" type="submit">Проверить форму <span>↗</span></button></form>`);$('.booking').addEventListener('submit',e=>{e.preventDefault();body.innerHTML='<div class="modal-eyebrow">ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА</div><h2 id="modal-title">Так будет выглядеть запись.</h2><p>Форма заполнена корректно. Заявка не отправлялась, оплата не списывалась, место не бронировалось.</p><p>После подключения системы записи здесь появится подтверждение и информация о занятии.</p><button class="button" id="done">Понятно ↗</button>';$('#done').addEventListener('click',closeModal);$('#done').focus();});}
const information={
 teacher:['Йога с Викой','Фотографии на сайте — из съёмки преподавателя, предоставленной для проекта.','Подробную биографию, обучение и сертификаты добавим после уточнения.'],
 contacts:['Будем на связи','Реальные телефон, email, Telegram и WhatsApp появятся после согласования с преподавателем.','Сейчас кнопки не ведут к чужим аккаунтам. После добавления контактов телефон будет доступен для звонка с мобильного.'],
 map:['Пространство для практики','Город, адрес зала и маршрут пока не указаны.','Когда адрес будет подтверждён, сюда добавим карту, ближайшее метро, ориентиры и инструкции для первого визита.'],
 legal:['Реквизиты проекта','ФИО / наименование: будет добавлено владельцем.','Статус, ИНН, ОГРНИП или другие применимые реквизиты, юридические документы и условия оплаты будут заполнены до начала реальных продаж. Сейчас сайт является демонстрацией и не принимает оплату.']
};
document.addEventListener('click',e=>{
 const booking=e.target.closest('[data-book]');if(booking){book(booking.dataset.book);return;}
 const article=e.target.closest('[data-article]');if(article){const a=window.YOGA_CONTENT.articles[article.dataset.article];openModal(`<div class="modal-eyebrow">${escapeHtml(a.category)}</div><h2 id="modal-title">${escapeHtml(a.title)}</h2>${a.paragraphs.map(p=>`<p>${escapeHtml(p)}</p>`).join('')}<p class="caption">Редакционный материал для макета. Перед публикацией преподаватель проверит текст.</p>`);return;}
 const info=e.target.closest('[data-info]');if(info){const [title,...paragraphs]=information[info.dataset.info];openModal(`<h2 id="modal-title">${title}</h2>${paragraphs.map(p=>`<p>${p}</p>`).join('')}`);return;}
 const photo=e.target.closest('[data-photo]');if(photo){openPhoto(photo.dataset.photo,photo.closest('#photo-grid')?filteredPhotos():window.YOGA_PHOTOS);return;}
 const event=e.target.closest('[data-event]');if(event){const retreat=event.dataset.event==='retreat';openModal(`<div class="modal-eyebrow">ПРИМЕР ПРОГРАММЫ · СОБЫТИЕ НЕ НАЗНАЧЕНО</div><h2 id="modal-title">${retreat?'Ближе к тишине':'Искусство замедляться'}</h2><p>${retreat?'Идея выездной встречи, чтобы сменить привычный темп и уделить внимание практике.':'Встреча для знакомства с мягким движением и спокойным вниманием к себе.'}</p><h3>Идея программы</h3><ul>${(retreat?['Утренняя практика в комфортном темпе','Прогулки и свободное время','Вечерняя мягкая йога','Общение и время для отдыха']:['Знакомство и вопросы преподавателю','Мягкая практика с простыми вариантами','Спокойный отдых и обсуждение ощущений']).map(p=>`<li>${p}</li>`).join('')}</ul><p>Даты, место, стоимость и условия участия уточняются. Это пример будущего анонса.</p><button class="button" data-book="${retreat?'Интерес к ретриту':'Интерес к мастер-классу'}">Пример заявки ↗</button>`);}
});

let galleryFilter='all';
let showEntireSeries=false;
const categoryNames={practice:'Практика',portrait:'Портрет',detail:'Детали'};
function filteredPhotos(){return window.YOGA_PHOTOS.filter(p=>galleryFilter==='all'||p.category===galleryFilter);}
function renderGallery(){
 const photos=filteredPhotos();
 const visible=galleryFilter==='all'&&!showEntireSeries?photos.slice(0,9):photos;
 $('#photo-grid').innerHTML=visible.map((p,index)=>`<button class="gallery-item photo-target" data-photo="${p.id}" aria-label="Открыть фотографию: ${escapeHtml(p.title)}"><img src="assets/photos/${p.id}-640.webp" width="${p.width}" height="${p.height}" alt="${escapeHtml(p.alt)}" loading="lazy" decoding="async"><span class="gallery-caption"><span>${escapeHtml(p.title)}</span><span>${String(index+1).padStart(2,'0')} ↗</span></span></button>`).join('');
 $('.gallery-count').textContent=`${String(visible.length).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')} КАДРОВ`;
 let more=$('#gallery-more');
 if(!more){more=document.createElement('button');more.id='gallery-more';more.className='button outline gallery-more';$('#photo-grid').after(more);more.addEventListener('click',()=>{showEntireSeries=true;renderGallery();$('#photo-grid').querySelectorAll('[data-photo]')[9]?.focus({preventScroll:true});});}
 more.hidden=visible.length===photos.length;
 more.textContent=`Посмотреть всю серию · ещё ${photos.length-visible.length} ↗`;
 document.dispatchEvent(new CustomEvent('photos:rendered'));
}
for(const button of document.querySelectorAll('[data-gallery-filter]'))button.addEventListener('click',()=>{
 galleryFilter=button.dataset.galleryFilter;
 document.querySelectorAll('[data-gallery-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 renderGallery();
});
let photoCollection=[];
let photoIndex=0;
function openPhoto(id,collection){
 photoCollection=collection;photoIndex=collection.findIndex(p=>p.id===id);
 if(photoIndex<0)return;
 renderPhoto();
}
function renderPhoto(focusDirection){
 const photo=photoCollection[photoIndex];
 openModal(`<h2 id="modal-title" class="sr-only">${escapeHtml(photo.title)}</h2><figure class="photo-viewer"><img class="modal-photo" src="assets/photos/${photo.id}.webp" width="${photo.width}" height="${photo.height}" alt="${escapeHtml(photo.alt)}"><figcaption><div><p>${escapeHtml(photo.title)}</p><small>${categoryNames[photo.category]} · съёмка преподавателя</small></div><div class="photo-navigation"><span aria-live="polite">${String(photoIndex+1).padStart(2,'0')} / ${String(photoCollection.length).padStart(2,'0')}</span><button id="photo-prev" aria-label="Предыдущая фотография" ${photoIndex===0?'disabled':''}>←</button><button id="photo-next" aria-label="Следующая фотография" ${photoIndex===photoCollection.length-1?'disabled':''}>→</button></div></figcaption></figure>`,true);
 $('#photo-prev').addEventListener('click',()=>changePhoto(-1));
 $('#photo-next').addEventListener('click',()=>changePhoto(1));
 if(focusDirection){const button=$(focusDirection>0?'#photo-next':'#photo-prev');(button.disabled?$('.close-modal'):button).focus({preventScroll:true});}
 // Preload a single neighbouring image; originals are never sent to the website.
 if(photoCollection[photoIndex+1]){const next=new Image();next.src=`assets/photos/${photoCollection[photoIndex+1].id}.webp`;}
 const image=$('.modal-photo');let startX=0;
 image.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')startX=e.clientX;});
 image.addEventListener('pointerup',e=>{if(e.pointerType==='touch'&&Math.abs(e.clientX-startX)>65)changePhoto(e.clientX<startX?1:-1);});
}
function changePhoto(direction){const next=photoIndex+direction;if(next>=0&&next<photoCollection.length){photoIndex=next;renderPhoto(direction);}}
modal.addEventListener('keydown',e=>{if(modal.classList.contains('photo-dialog')&&['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();changePhoto(e.key==='ArrowRight'?1:-1);}});
renderGallery();

// If a CDN request fails, try the second local export once instead of leaving a broken image.
function recoverPhoto(image){
 if(!(image instanceof HTMLImageElement)||image.dataset.fallbackAttempted)return;
 const source=(image.getAttribute('src')||'').split('?')[0];
 if(!/^assets\/photos\/[a-z0-9-]+\.webp$/.test(source))return;
 image.dataset.fallbackAttempted='true';
 image.removeAttribute('srcset');
 image.removeAttribute('sizes');
 image.src=source.endsWith('-640.webp')?source.replace('-640.webp','.webp'):source.replace('.webp','-640.webp');
}
document.addEventListener('error',event=>recoverPhoto(event.target),true);
document.querySelectorAll('img').forEach(image=>{if(image.complete&&!image.naturalWidth)recoverPhoto(image);});
