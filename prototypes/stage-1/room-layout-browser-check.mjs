// Responsive regression checks for the shared room shell and bubble contour.
import assert from 'node:assert/strict';
import {browser} from './browser-driver.mjs';
const b = await browser();
let checks = 0;
const check = (value, label) => { assert.ok(value, label); checks++; };
const settle = () => b.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
const room = async id => {
  await b.navigate('/'); await b.click('#rooms-button'); await b.click('#library-room-' + id);
  await b.waitFor('[...document.images].every(image=>image.complete)'); await settle();
};
const geometry = async label => {
  check(await b.evaluate(`(()=>{
    const surface=document.querySelector('#room-content').getBoundingClientRect();
    const wrap=document.querySelector('.composer-wrap'), c=wrap.getBoundingClientRect();
    const style=getComputedStyle(wrap), em=parseFloat(getComputedStyle(document.body).fontSize);
    return style.position==='relative' && c.top>=surface.bottom-1 && c.top-surface.bottom<=em*1.5 &&
      document.documentElement.scrollWidth<=innerWidth+1;
  })()`), label + ' composer follows content without overlap, auto spacer or page overflow');
  check(await b.evaluate(`(()=>{
    const form=document.querySelector('#composer'), path=document.querySelector('#composer-outline-path');
    const r=parseFloat(getComputedStyle(form).borderTopLeftRadius), x=form.offsetLeft+r*1.75,
      y=form.offsetTop+form.offsetHeight;
    return getComputedStyle(form).borderBottomColor==='rgba(0, 0, 0, 0)' &&
      path.getAttribute('d').endsWith('Z') && path.isPointInFill(new DOMPoint(x,y)) &&
      !path.isPointInStroke(new DOMPoint(x,y)) && path.getBBox().height>form.offsetHeight;
  })()`), label + ' one filled contour joins body and pointer without a border crossing the mouth');
  for (const selector of ['#request', '#talk', '#composer button[type=submit]']) {
    check(await b.evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})()`), label + ' reachable ' + selector);
  }
};
try {
  for (const [width,height,scale] of [[1440,900,1],[1440,1200,1],[1280,480,1],[840,600,1],[600,480,1],[360,640,1],[840,700,2]]) {
    await b.viewport(width,height); await room('kitchen');
    await b.evaluate(`document.documentElement.style.setProperty('--review-scale','${scale}');dispatchEvent(new Event('resize'))`); await settle();
    await geometry(`${width}x${height}@${scale}`);
    if (width>700 && scale===1) check(await b.evaluate(`(()=>{const a=document.querySelector('.room-atmosphere').getBoundingClientRect(),s=document.querySelector('.app-shell').getBoundingClientRect(),i=document.querySelector('.room-backdrop img').getBoundingClientRect();return Math.abs(a.width-s.width)<1&&Math.abs(a.top-s.top)<1&&a.height>=innerHeight*.7&&i.width>=s.width*1.1&&getComputedStyle(document.querySelector('.room-backdrop')).maskImage!=='none';})()`),'hero artwork is full-bleed, viewport-scaled and independently masked '+width+'x'+height);
    if (width===1440 && height===900) { await b.evaluate('scrollTo(0,0);document.activeElement?.blur()'); await b.screenshot('kitchen-hero'); }
    if (width===1280) { await b.evaluate('scrollTo(0,document.body.scrollHeight)'); await b.screenshot('kitchen-short-composer'); }
    await b.click('#room-continue'); await geometry('detail '+width+'@'+scale);
    await b.click('#ask-room-item'); await b.click('#composer button[type=submit]'); await settle();
    await geometry('chat '+width+'@'+scale);
    if (width>700 && scale===1) check(await b.evaluate(`(()=>{const i=document.querySelector('.room-chat-portrait img'),r=i.getBoundingClientRect(),s=document.querySelector('.app-shell').getBoundingClientRect();return r.width>=s.width*.55&&getComputedStyle(i).objectFit==='contain' && Math.abs(r.width/r.height-i.naturalWidth/i.naturalHeight)<.01;})()`),'chat has a substantial footprint and complete portrait aspect ratio '+width+'x'+height);
    if (width===1440 && height===900) { await b.evaluate('scrollTo(0,0);document.activeElement?.blur()'); await b.screenshot('kitchen-chat'); }
  }
  await b.viewport(1440,900);
  // Compare against each room's own declared fixture reference, never a global recent item.
  for (const id of ['kitchen','fitness','trips','garden','reading','projects']) {
    await room(id);
    check(await b.evaluate(`(()=>{const r=GrannyRoomFixtures.rooms.find(r=>r.id===${JSON.stringify(id)}),c=r.collections.find(c=>c.id===r.continuation?.collectionId),i=c?.items.find(i=>i.id===r.continuation.itemId);return document.querySelector('#home-secondary').hidden&&document.querySelector('.room-continuation h2')?.textContent===i?.title;})()`),id+' continuation belongs to active room');
    if(id!=='kitchen')check(await b.evaluate("!document.querySelector('#room-content').textContent.includes('Vegetable soup')"),id+' has no Kitchen continuation');
  }
  for (const width of [1440,840,360]) {
    await b.viewport(width,900); await b.navigate('/');
    await b.evaluate("document.querySelector('#room-viewport').scrollLeft=160");
    await b.click('#hide-continuation'); await settle();
    check(await b.evaluate(`(()=>{const r=document.querySelector('#rooms').getBoundingClientRect(),s=document.querySelector('#home-secondary').getBoundingClientRect();return Math.abs(r.x-s.x)<1&&Math.abs(r.width-s.width)<1&&document.activeElement.id==='request';})()`),'Hide reclaims full available width from the normal outer margin '+width);
    if(width>700) check(await b.evaluate(`(()=>{const v=document.querySelector('#room-viewport'),b=v.getBoundingClientRect(),cards=[...v.querySelectorAll('.room-entry')].slice(0,3),controls=document.querySelector('#room-controls').getBoundingClientRect();return v.scrollLeft===0&&cards.every(e=>{const r=e.getBoundingClientRect();return r.left>=b.left&&r.right<=b.right})&&controls.right<=b.right;})()`),'Hide fits three complete entries and contained controls '+width);
    if(width===1440){await b.evaluate('scrollTo(0,0);document.activeElement?.blur()');await b.screenshot('home-hidden');}
  }
  await b.evaluate("document.querySelector('#request').focus()"); await settle();
  check(await b.evaluate("getComputedStyle(document.querySelector('.composer-focus-frame')).opacity==='1'&&document.querySelector('#composer-focus-path').getBBox().height>document.querySelector('#composer-outline-path').getBBox().height"),'focus encloses complete bubble including pointer');
  await b.screenshot('narrow-composer-focus');
  check(b.errors.length===0,'no browser exceptions');
  check(b.network.every(url=>url.startsWith(b.base+'/')),'only loopback assets requested');
  console.log(JSON.stringify({checks,screenshots:b.output},null,2));
} finally {await b.close();}
