const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
window.matchMedia('(min-width:881px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

const inquiryTabs=[...document.querySelectorAll('[data-inquiry-tab]')];
const inquiryPanels=[...document.querySelectorAll('[data-inquiry-panel]')];
function showInquiry(kind,{focus=false}={}){
  inquiryTabs.forEach(tab=>{const active=tab.dataset.inquiryTab===kind;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus();});
  inquiryPanels.forEach(panel=>panel.hidden=panel.dataset.inquiryPanel!==kind);
}
inquiryTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>showInquiry(tab.dataset.inquiryTab));tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const next=event.key==='ArrowRight'?(index+1)%inquiryTabs.length:(index-1+inquiryTabs.length)%inquiryTabs.length;showInquiry(inquiryTabs[next].dataset.inquiryTab,{focus:true});});});
document.querySelectorAll('a[href="#buy"],a[href="#sell"]').forEach(link=>link.addEventListener('click',()=>showInquiry(link.hash==='#sell'?'seller':'buyer')));
if(location.hash==='#sell')showInquiry('seller');

if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('waiting');observer.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('waiting');observer.observe(el);});
}

document.querySelectorAll('form[data-kind]').forEach(form=>{
  const status=form.querySelector('.form-status');
  const show=(message,error=true)=>{status.textContent=message;status.className='form-status '+(error?'error':'success');};
  function validate(input){
    input.setCustomValidity('');
    if(input.type!=='file'&&input.required&&!input.value.trim())input.setCustomValidity('Please complete this field.');
    if(input.name==='phone'&&input.value&&!/^[+\d\s().-]{7,25}$/.test(input.value))input.setCustomValidity('Enter a valid phone number.');
    if(input.type==='file'){
      const files=[...input.files];
      if(files.length>5)input.setCustomValidity('Choose up to 5 photos.');
      else if(files.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)))input.setCustomValidity('Use JPG, PNG, or WebP images.');
      else if(files.some(f=>f.size>5*1024*1024))input.setCustomValidity('Each photo must be smaller than 5 MB.');
    }
    const old=input.parentElement.querySelector('.field-error');if(old)old.remove();
    input.removeAttribute('aria-describedby');
    input.setAttribute('aria-invalid',String(!input.validity.valid));
    if(!input.validity.valid){const error=document.createElement('span');error.className='field-error';error.id=form.dataset.kind+'-'+input.name+'-error';error.textContent=input.validationMessage;input.setAttribute('aria-describedby',error.id);input.after(error);}
    return input.validity.valid;
  }
  form.querySelectorAll('input:not([type=hidden]),select,textarea').forEach(input=>{
    input.addEventListener('blur',()=>validate(input));
    input.addEventListener('input',()=>{if(input.getAttribute('aria-invalid')==='true')validate(input);});
    input.addEventListener('change',()=>validate(input));
  });
  form.addEventListener('submit',async e=>{
    e.preventDefault();status.textContent='';
    const inputs=[...form.querySelectorAll('input:not([type=hidden]),select,textarea')];
    const results=inputs.map(validate);if(results.some(valid=>!valid)){inputs.find(input=>!input.validity.valid).focus();show('Please check the highlighted fields.');return;}
    const endpoint=window.SHIKHAR_CONFIG?.[form.dataset.kind+'Endpoint'];
    if(!endpoint){show('Online inquiries are not connected yet. Please email shikharpropertiesagency@gmail.com with your details.');return;}
    let url;try{url=new URL(endpoint);if(url.protocol!=='https:')throw new Error();}catch{show('Online inquiries are currently unavailable. Please contact us by email.');return;}
    const button=form.querySelector('button[type=submit]');const label=button.textContent;button.disabled=true;button.textContent='Sending…';form.setAttribute('aria-busy','true');
    try{const data=new FormData(form);const photos=form.querySelector('[type=file]');if(photos&&!photos.files.length)data.delete('photos');const response=await fetch(url,{method:'POST',body:data,headers:{Accept:'application/json'},signal:AbortSignal.timeout(30000)});if(!response.ok)throw new Error();show('Your inquiry has been received. Thank you for contacting Shikhar.',false);form.reset();inputs.forEach(i=>i.removeAttribute('aria-invalid'));}
    catch{show('We could not confirm your submission. Please try again or email our team directly.');}
    finally{button.disabled=false;button.textContent=label;form.removeAttribute('aria-busy');}
  });
});
