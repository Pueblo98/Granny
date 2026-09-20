/* Supporting destinations retain the existing place and conversation. All
 * data is fictional and tab-local; browser history contains opaque depth only. */
(() => {
  'use strict';
  function create(o) {
    const $ = id => document.getElementById(id), host = $('support-content'), menu = $('menu');
    const params=new URLSearchParams(location.search);
    const model = window.GrannySupportState.create({scale:o.scale(),historyFixture:params.get('supportFixture')==='history-empty'?'empty':'default'});
    let route = '', stack = [], origin = null, query = '', detail = null, overlayBack = null, dialogOrigin = null, searchReturn = null;
    let fixture = new URLSearchParams(location.search).get('supportFixture') || '';
    let onboarding = false, step = 1, notice = '', menuScroll = 0;
    const el = (tag, text, cls='') => { const e=document.createElement(tag);e.className=cls;e.textContent=text;return e; };
    const btn = (id,text,fn,cls='') => {const b=el('button',text,cls);b.type='button';b.id=id;b.addEventListener('click',fn);return b;};
    const actions = (...children) => {const d=el('div','','support-actions');d.append(...children);return d;};
    const remember = () => ({route,detail,scroll:scrollY,focus:document.activeElement?.id});
    const mark = () => history.pushState({grannySupport:true},'',location.href);
    function begin() {if(!origin) origin={focus:'menu-button',scroll:scrollY,place:o.place()};}
    function heading(text, description='') {
      const h=el('h1',text);h.id='support-heading';h.tabIndex=-1;host.append(h);
      if(description)host.append(el('p',description,'support-intro'));
    }
    function row(id,title,summary,fn) {
      const b=btn(id,'',fn,'support-row');b.append(el('strong',title),el('span',summary));return b;
    }
    function shell() {
      host.hidden=!route; document.body.dataset.support=route ? (onboarding?'onboarding':'destination') : '';
      document.body.dataset.reducedMotion=String(model.prefs.reducedMotion);
      if(route) { $('home-secondary').hidden=true; $('room-content').hidden=true; $('conversation').hidden=true; }
      document.querySelector('.composer-wrap').hidden=onboarding;
      document.querySelector('.header-actions').hidden=onboarding;
    }
    function render(focusHeading=false) {
      host.replaceChildren();shell();if(!route)return;
      host.dataset.destination=route;host.dataset.panel=route;
      if(!onboarding) host.append(btn('support-top-back','Back',writtenBack,'quiet-button'));
      if(onboarding) renderSetup();
      else if(route==='settings') renderSettings();
      else if(route==='text') renderAccessibility();
      else if(route==='privacy') renderPrivacy();
      else if(route==='history') renderHistory();
      else if(route==='summary') renderSummary();
      else if(route==='saved-conversation') renderSavedConversation();
      else if(route==='help') renderHelp();
      else if(route==='search') renderSearch();
      else if(route==='voice') renderVoice();
      else if(route==='about') renderAbout();
      else if(route==='conversation') renderConversation();
      if(notice)host.append(el('p',notice,'notice'));
      if(focusHeading) { $('support-heading')?.focus();window.scrollTo(0,0); }
    }
    function open(next, replace=false) {
      begin(); notice='';
      if(menu.open) {closeMenu(false); if(!replace)replace=true;}
      if(!replace) {stack.push(remember());mark();}
      route=next;render(true);
    }
    function closeMenu(restore=true) {
      if(menu.open)menu.close();menu.hidden=true;$('menu-button').setAttribute('aria-expanded','false');
      if(restore){$('menu-button').focus({preventScroll:true});window.scrollTo(0,menuScroll);}
    }
    function finish(typing=false) {
      const saved=origin;route='';stack=[];onboarding=false;origin=null;closeMenu(false);host.hidden=true;
      document.body.dataset.support='';o.render();shell();
      requestAnimationFrame(()=>{($(typing?'request':saved?.focus)||$('request')).focus({preventScroll:true});window.scrollTo(0,saved?.scroll||0);});
    }
    function back(fromBrowser=false) {
      if(overlayBack){const fn=overlayBack;overlayBack=null;fn();return;}
      if(menu.open){closeMenu();if(!route)origin=null;return;}
      if(searchReturn){const previous=searchReturn;searchReturn=null;$('search-origin-return').hidden=true;o.restorePlace(previous.origin.place);origin=previous.origin;route='search';render();requestAnimationFrame(()=>{$(previous.focus)?.focus({preventScroll:true});window.scrollTo(0,previous.scroll);});return;}
      if(onboarding) {if(step>1){step--;model.backSetup();render(true);}else skipSetup();return;}
      const previous=stack.pop();
      if(previous?.route){route=previous.route;detail=previous.detail;notice='';render();requestAnimationFrame(()=>{($(previous.focus)||$('support-heading')).focus({preventScroll:true});window.scrollTo(0,previous.scroll);});}
      else finish();
    }
    function writtenBack(){if(history.state?.grannySupport)history.back();else back();}
    const backButton = (label='Back') => btn('support-back',label,writtenBack);
    function showMenu() {
      begin();menuScroll=scrollY;menu.hidden=false;menu.showModal();$('menu-button').setAttribute('aria-expanded','true');mark();$('menu-heading').focus();
    }
    function confirm(title, paragraphs, affirmative, fn, danger=false, keep='Cancel') {
      dialogOrigin={id:menu.contains(document.activeElement)?'menu-button':document.activeElement?.id,scroll:scrollY};
      closeMenu(false);
      o.confirm(title,paragraphs.join('\n\n'),()=>{overlayBack=null;fn();},affirmative,danger,keep);
      overlayBack=()=>o.cancelConfirm();
      if(keep==='Keep this conversation'){
        const cancel=el('button','Cancel');cancel.value='cancel';cancel.id='support-confirm-cancel';$('confirm-dialog').querySelector('.dialog-actions').append(cancel);
      }
    }
    function newConversation() {
      if(!o.hasConversation()){finish();o.fresh();return;}
      confirm('Start a new conversation?', [
        'This moves the current conversation into Today for this tab, then returns Home to a fresh conversation.',
        'What stays\nEarlier conversations in this tab\nRooms and saved items\nAccessibility preferences\nMinimal task history',
        'Nothing is deleted from another app.'
      ],'Start new conversation',()=>{finish();o.fresh();},false,'Keep this conversation');
    }
    function clearHistory() {
      confirm('Clear history?', ['Remove prior conversation transcripts and minimal task summaries in this tab. The current conversation stays.', 'Rooms, saved items and preferences stay. Nothing in another app is deleted.'], 'Clear history',()=>{model.clearHistory();o.clearHistory();notice='History cleared.';render();o.announce(notice);},true);
    }
    const conversations = () => [...(o.conversations?.() || []), ...model.conversations];
    function renderHistory(){
      heading('Today','Open this conversation, a prior tab-memory conversation, or a clearly labelled fictional sample.');
      host.append(el('p','Nothing here is saved to browser storage. Reloading clears real conversation transcripts.','support-caption'));
      const list=el('div','','support-list');
      const chats=conversations();
      list.append(el('h2','Conversations'));
      if(!chats.length) list.append(el('p','No previous conversations in this tab.'));
      for(const conversation of chats) {
        const label = conversation.active ? 'Current conversation · Continue' : conversation.fixture
          ? `${conversation.time} · ${conversation.place} · Fictional sample`
          : `${conversation.time} · ${conversation.place} · Open transcript`;
        list.append(row('conversation-'+conversation.id,conversation.title,label,()=>{
          if(conversation.active){finish();return;}
          open('saved-conversation');detail=conversation.id;render(true);
        }));
      }
      list.append(el('h2','Activity'));
      if(fixture==='history-error')list.append(el('p','Task history could not be read. No entries have been invented.'),btn('history-retry','Try again',()=>{fixture='';render();}));
      else if(!model.records.length)list.append(el('p','No saved task history'));
      else for(const record of model.records) list.append(row('history-'+record.id,record.title,
        `${record.outcome} · ${record.time} · ${record.source} · Open summary`,()=>{open('summary');detail=record.id;render(true);}));
      const hasClearableHistory=model.records.length||chats.some(conversation=>!conversation.active);
      host.append(list,actions(...(hasClearableHistory?[btn('clear-history','Clear history',clearHistory)]:[]),backButton(o.place()==='home'?'Back to Home':'Back to conversation')));
    }
    function renderSavedConversation(){
      const conversation=conversations().find(entry=>entry.id===detail);
      heading(conversation?.title||'Conversation unavailable',conversation?.fixture
        ? 'Fictional sample conversation — it was not generated from your messages.'
        : 'Earlier conversation kept only in memory for this browser tab.');
      if(conversation){
        const transcript=el('section','','support-transcript');transcript.setAttribute('aria-label','Conversation transcript');
        let sourceCount=0;
        for(const entry of conversation.turns||[]){
          const message=el('article','',`support-chat-turn ${entry.role}`);
          message.append(el('p',entry.role==='user'?'You':'Granny','turn-label'),el('p',entry.text));
          if(entry.role==='assistant'&&entry.unverified)
            message.append(el('p','Assistant text, not a verified action result.','notice'));
          for(const source of entry.sources||[]){
            const receipt=el('aside','','support-source-receipt');
            receipt.append(el('strong','Source used for this answer'),el('p',[source.title,source.roomName,source.collectionLabel].filter(Boolean).join(' · ')));
            if(source.itemId)receipt.append(btn('saved-source-'+source.itemId+'-'+sourceCount++,'View source',()=>{finish();o.explore({kind:'saved-item',id:source.itemId});}));
            message.append(receipt);
          }
          transcript.append(message);
        }
        host.append(transcript);
      }
      host.append(actions(btn('saved-conversation-new','Start a new conversation',newConversation,'primary'),backButton('Back to Today')));
    }
    function renderSummary(){
      const record=model.summary(detail);heading(record?.title||'Summary unavailable');
      if(record){const d=el('section','','support-paper');d.append(el('h2',record.outcome||record.title),el('p',record.detail||`${record.time} · ${record.source}`),el('p','Minimal task summary — no message or item content stored. Opening this fictional summary does not repeat the action.'));host.append(d);}
      host.append(backButton('Back to Today'));
    }
    function renderSettings(){
      model.syncScale(o.scale());const p=model.prefs;
      heading('Settings','Choose a category. These preferences change Granny only.');
      const list=el('div','','support-list');
      const connection=o.connectionMode?.()||'';
      list.append(row('settings-access','Accessibility',`Text size ${size(p.scale)} · Reduced motion ${on(p.reducedMotion)}`,()=>open('text')),
        row('settings-voice','Talk and voice',`Speech speed ${p.speechSpeed} · Private content Not spoken`,()=>open('voice')),
        row('settings-privacy','Privacy and data',connection==='live'?'Live AI connected · review provider data limits':connection==='demo'?'Offline test replies connected · no cloud model':'Cloud processing Off · Minimal task history',()=>open('privacy')),
        row('settings-conversation','Conversation',`${p.explanation} · New conversation`,()=>open('conversation')),
        row('settings-about','About Granny','App information and limits',()=>open('about')));
      host.append(list,backButton(o.place()==='home'?'Back to Home':'Back to conversation'));
    }
    const size = value => ({1:'Normal',1.15:'Comfortable',1.3:'Large',1.5:'Larger'}[value]||String(value));
    const on = value=>value?'On':'Off';
    function choices(label,key,values,setup=false) {
      const current=model.prefs[key];
      const group=el('fieldset','','support-choice');group.append(el('legend',label+(setup?'':' · Current: '+(key==='scale'?size(current):typeof current==='boolean'?on(current):current))));
      const p=setup?model.setup.staged:model.staged;
      for(const value of values){const b=btn((setup?'setup-':'pref-')+key+'-'+String(value).replace(/\W/g,''),(p[key]===value?'✓ ':'')+(typeof value==='boolean'?on(value):key==='scale'?size(value):value),()=>{
        if(setup)model.stageSetup(key,value);else model.stage(key,value);const id=b.id;render();$(id)?.focus({preventScroll:true});
      });b.setAttribute('aria-pressed',String(p[key]===value));group.append(b);}
      return group;
    }
    function sample(text,p){const s=el('p',text,'support-sample');s.style.fontSize=p.scale+'em';return s;}
    function renderAccessibility(){
      heading('Accessibility','Preview your choices before applying them.');
      host.append(sample('Your next appointment is on Tuesday at 10:30.',model.staged));
      host.append(choices('Text size','scale',[1,1.15,1.3,1.5]),
        choices('Speech speed','speechSpeed',['Slower','Normal','Faster']),btn('hear-sample','Hear sample',silentSample),
        choices('Reduced motion','reducedMotion',[true,false]),
        choices('Captions','captions',[true,false]),el('p','These choices change Granny only.'),
        actions(btn('apply-preferences','Apply changes',()=>{model.apply();o.applyScale(model.prefs.scale);notice='Choices applied to Granny only.';render();$('apply-preferences').focus({preventScroll:true});o.announce(notice);},'primary'),
          btn('restore-preferences','Restore previous choices',()=>{model.restore();notice='Preview restored to your last applied choices. Nothing else changed.';render();$('restore-preferences').focus({preventScroll:true});o.announce(notice);}),backButton(stack.at(-1)?.route==='settings'?'Back to Settings':'Return to conversation')));
    }
    function silentSample(){notice=`Silent sample — ${model.staged.speechSpeed} speech: “Your next appointment is on Tuesday at 10:30.” No audio is played or recorded.`;render();$('hear-sample')?.focus({preventScroll:true});o.announce(notice);}
    function disclosure(kind){
      const data={microphone:['Microphone','Optional voice entry, only after Talk. In this browser Talk uses fictional words; no audio is captured, kept or sent. Android owns the actual grant.'],screen:['Screen help','Only a screen you choose/share or an Android-approved scope. This browser uses supplied fictional screens; no screen is captured or sent.'],cloud:['Cloud processing','Off in the static prototype. No data goes to a provider here. Some requests are unavailable. The separately authorized AI connection has its own explicit consent.']}[kind];
      confirm('Review '+data[0],[data[1],'Local simulation only. Review grants nothing. You may continue without this access.'], 'Continue without access',()=>{notice=data[0]+' remains not enabled.';render();o.announce(notice);});
    }
    function renderPrivacy(){
      heading('Privacy and data','Understand the scope before changing anything.');
      const list=el('div','','support-list');
      list.append(row('privacy-cloud','Cloud processing',o.connected()?'Connected mode has separate consent and data handling — Review':'Off · Requests stay in this tab in the static prototype · Review',()=>disclosure('cloud')),
        row('privacy-permissions','Android permissions','Microphone: Ask when you tap Talk · Browser Talk is simulated · Manage permissions',()=>disclosure('microphone')),
        row('privacy-history','Task history','Minimal results only — no message words, photos or audio · Clear history',clearHistory),
        row('privacy-delete','Local Granny data','Preferences, aliases and fictional room organization · Review deletion',()=>confirm('Reset this prototype?',[
          'This clears the current conversation, minimal history, entered words, changed aliases and preferences, and custom fictional room organization in this tab. Starter fixtures are restored.',
          'Nothing in another app or file is changed. Connected runtime drafts and provider-held data are not deleted. This is an in-memory fixture reset, not device data deletion.'
        ],'Reset everything',()=>{model.reset();finish();o.reset();},true)));
      host.append(list,el('p','Helpers do not have access in this version.'),el('p',o.privacy(),'support-caption'),backButton());
    }
    function renderHelp(){
      heading('What can I ask?','Ask in your own words. You do not need to choose a feature first.');
      const examples=el('ul','','support-examples');for(const text of ['Show me photos Sophie sent yesterday.','Explain what is on this screen.','Prepare a message to David.','Play Sinnerman by Nina Simone.','Make Granny’s text larger.'])examples.append(el('li',text));
      host.append(examples,el('h2','What Granny will tell you'));
      const rules=el('ul');for(const text of ['When a choice is needed','Before a consequential action','When a result is uncertain or unavailable'])rules.append(el('li',text));
      host.append(rules,el('p','You can always type. Talk is optional.'),actions(btn('help-ask','Ask Granny',()=>finish(true),'primary'),btn('help-menu','Back to Menu',()=>{finish();showMenu();})));
    }
    function renderVoice(){heading('Talk and voice','Talk is optional. Private content is not spoken.');host.append(el('p','Browser speech is a silent simulation. No microphone or audio is used.'),choices('Speech speed','speechSpeed',['Slower','Normal','Faster']),btn('hear-sample','Hear sample',silentSample),btn('voice-apply','Apply changes',()=>{model.apply();notice='Speech preference applied to the silent fixture.';render();},'primary'),backButton('Back to Settings'));}
    function renderAbout(){heading('About Granny','Granny is a temporary codename.');host.append(el('p','Fictional browser prototype, not the Android application. No recording, accounts, device access or sending. All tab data resets on reload.'),btn('about-setup','Review introduction',()=>startSetup()),btn('about-connection','AI connection',()=>{finish();o.legacy('connection');}),backButton('Back to Settings'));}
    function renderConversation(){heading('Conversation','The same Granny assistant is available from Home and every Room.');host.append(choices('How Granny explains','explanation',['Clear and brief','More detail']),btn('conversation-apply','Apply changes',()=>{model.apply();notice='Explanation preference applied.';render();}),btn('conversation-aliases','Names you use',()=>{finish();o.legacy('preferences');}),btn('conversation-new','Start a new conversation',newConversation),backButton('Back to Settings'));}
    function renderSearch(){
      heading('Search Granny','Saved items, Rooms, settings and minimal task summaries');
      const label=el('label','Search Granny');label.htmlFor='support-query';const input=el('input');input.id='support-query';input.type='search';input.value=query;input.autocomplete='off';
      const results=el('div','','support-results');results.id='support-results';const status=el('p','','sr-only');status.role='status';
      const update=()=>{
        results.replaceChildren();
        if(['search-error','offline','loading'].includes(fixture)){
          results.append(el('h2',fixture==='search-error'?'Search could not be read':fixture==='offline'?'Search unavailable in this offline fixture':'Loading local search…'),el('p','No external app or network search has been attempted.'),btn('search-retry','Try again',()=>{fixture='';update();}));return;
        }
        if(!query.trim()){results.append(el('p','Enter a phrase to search the admitted fictional local items.'));status.textContent='';return;}
        const matches=model.search(query,{items:o.items(),rooms:o.rooms()});status.textContent=matches.length+' local matches';
        if(!matches.length){results.append(el('h2','No saved matches'),el('p','No match in saved items, Rooms, settings or minimal task summaries.'),el('p','Asking Granny starts a new request. It does not search an external app automatically.'),actions(btn('search-ask','Ask Granny instead',()=>{const phrase=query;finish(true);o.draft(phrase);},'primary'),btn('search-another','Search another phrase',()=>{input.focus();input.select();})));}
        for(const result of matches) results.append(row('search-result-'+result.id,result.title,result.detail+(result.kind==='history'?' · Minimal task summary — no message or item content stored.':''),()=>{
          if(result.kind==='history'){open('summary');detail=result.id;render(true);}
          else if(result.kind==='setting'){open(result.route||'settings');}
          else {
            const previous={origin:{...origin},focus:'search-result-'+result.id,scroll:scrollY};
            finish();o.explore(result);searchReturn=previous;mark();$('search-origin-return').hidden=false;
          }
        }));
      };
      input.addEventListener('input',()=>{query=input.value;update();});input.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();query='';input.value='';update();}});
      host.append(label,actions(input,btn('search-clear','Clear',()=>{query='';input.value='';update();input.focus();})),status,results,el('p','Search does not look inside external apps.'),btn('search-menu','Back to Menu',()=>{finish();showMenu();}));update();
    }
    function startSetup(){begin();model.setupStep1();onboarding=true;step=1;route='onboarding';mark();render(true);}
    function skipSetup(){model.skipSetup();finish(true);o.applyScale(model.prefs.scale);}
    function renderSetup(){
      const header=el('div','','support-setup-header');
      header.append(el('p','Granny · Temporary name','support-caption'),el('p','Step '+step+' of 3'));
      if(step<3)header.append(btn('setup-skip-top','Skip for now',skipSetup));
      host.append(header);
      if(step===1){heading('A simpler place to ask for help','Ask naturally, in your own words.');host.append(el('p','Review important actions before they happen.'),el('p','Use Stop or take over whenever you need to.'),el('p','Setup uses fictional examples and requires no account.'),actions(btn('setup-start','Set up Granny',()=>{model.nextSetup();mark();step=2;render(true);},'primary'),btn('setup-skip','Skip for now',skipSetup)));}
      if(step===2){heading('Make Granny comfortable to use');host.append(sample('What would you like to do?',model.setup.staged),choices('Text size','scale',[1,1.15,1.3,1.5],true),choices('How Granny explains','explanation',['Clear and brief','More detail'],true),choices('Speech speed','speechSpeed',['Slower','Normal','Faster'],true),btn('setup-sample','Hear sample',()=>{notice='Silent example: “What would you like to do?” No audio is played or recorded.';render();$('setup-sample').focus();o.announce(notice);}),el('p','No disability or medical condition is inferred.'),actions(btn('setup-back','Back',writtenBack),btn('setup-next','Continue',()=>{model.nextSetup();mark();o.applyScale(model.prefs.scale);step=3;render(true);},'primary'),btn('setup-skip','Skip for now',skipSetup)));}
      if(step===3){heading('Choose what Granny can use','Choices are separate. Continue without them and review them later.');const list=el('div','','support-list');list.append(row('setup-mic','Microphone','Not enabled · Used only after Talk · Review microphone',()=>disclosure('microphone')),row('setup-screen','Screen help','Not enabled · Only a chosen/shared screen or Android-approved scope · Review screen help',()=>disclosure('screen')),row('setup-cloud','Cloud processing','Off · Some requests may be unavailable · Review cloud processing',()=>disclosure('cloud')));host.append(list,el('p','Android owns permission decisions. Granny cannot grant access itself.'),actions(btn('setup-complete','Continue without these',()=>{model.completeSetup();finish(true);o.applyScale(model.prefs.scale);},'primary'),btn('setup-back','Back',writtenBack),btn('setup-later','Review later in Settings',()=>{model.completeSetup();finish(true);})) );}
    }
    menu.addEventListener('cancel',event=>{event.preventDefault();writtenBack();});
    $('search-origin-return').addEventListener('click',writtenBack);
    menu.addEventListener('keydown',event=>{
      if(event.key!=='Tab')return;const targets=[...menu.querySelectorAll('button')],first=targets[0],last=targets.at(-1);
      if(event.shiftKey&&(document.activeElement===first||document.activeElement===$('menu-heading'))){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    });
    window.addEventListener('popstate',()=>back(true));
    $('confirm-dialog').addEventListener('close',()=>{
      if($('confirm-dialog').open)return;
      overlayBack=null;const previous=dialogOrigin;dialogOrigin=null;
      if(previous)requestAnimationFrame(()=>{const target=$(previous.id);if(target?.getClientRects().length){target.focus({preventScroll:true});window.scrollTo(0,previous.scroll);}});
    });
    return {model, get active(){return !!route;}, get route(){return route;}, render, shell,
      open, showMenu, closeMenu, finish, newConversation, startSetup, back:writtenBack,
      select(what){
        if(what==='return'){writtenBack();return;}
        closeMenu(false);
        if(what==='new'){newConversation();return;}
        if(what==='rooms'){finish();o.openRooms();return;}
        model.syncScale(o.scale());model.restore();open(what,true);
      },
      reset(){model.reset();finish();},
      forgetSearch(){searchReturn=null;$('search-origin-return').hidden=true;},
      boot(){if(new URLSearchParams(location.search).get('onboarding')==='1')startSetup();},
      get fixture(){return fixture;}
    };
  }
  window.GrannySupportUI={create};
})();
