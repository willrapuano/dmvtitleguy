import json,re,urllib.parse,urllib.request,copy,secrets,datetime,sys
env=open('/Users/jarvis/.openclaw/workspace/clients/dmvtitleguy/site/.env.local').read()
tok=re.search(r'^SANITY_API_TOKEN=["\']?([^"\'\n]+)',env,re.M).group(1)
def q(query):
  req=urllib.request.Request('https://4s0dloxi.api.sanity.io/v2024-01-01/data/query/production?query='+urllib.parse.quote(query),headers={'Authorization':'Bearer '+tok})
  return json.load(urllib.request.urlopen(req))['result']
posts=q('*[_type=="post" && !(_id in path("drafts.**"))]{_id,_rev,"s":slug.current,body}')
sweep=json.load(open('/Users/jarvis/.openclaw/workspace/clients/dmvtitleguy/ctr-title-test/index-sweep-2026-10-23.json'))
indexed={u.replace('https://dmvtitleguy.io',''):st for u,st,_,_ in sweep}
frozen=json.load(open('/Users/jarvis/.openclaw/workspace/clients/dmvtitleguy/seo-scripts/frozen_pages.json'))
today=datetime.date.today().isoformat()
frozen={p for p,d in frozen.items() if d>=today}
red=set(re.findall(r'\["(/[^"]*)", "/[^"]*"\]',urllib.request.urlopen('https://raw.githubusercontent.com/willrapuano/dmvtitleguy/main/config/domain-redirects.mjs').read().decode())) if False else set()
import subprocess
red=set(re.findall(r'\["(/[^"]*)", "/[^"]*"\]',subprocess.run(['git','-C','/Users/jarvis/.openclaw/workspace/clients/dmvtitleguy/site-refresh','show','origin/main:config/domain-redirects.mjs'],capture_output=True,text=True).stdout))
hidden={'ai-tools-real-estate-professionals','networking-tips-real-estate-professionals','using-zillow-traffic-data-to-close-more-deals','real-estate-investing-strategies-dmv','nova-housing-market-update-2025','nova-real-estate-market-q1-2026','spring-housing-inventory-northern-virginia-2026','reston-station-lofts'}
T=[('/blog/firpta-explained-dmv',r'\bFIRPTA\b'),
   ('/blog/what-is-a-title-settlement-fee',r'\bsettlement fees?\b'),
   ('/blog/what-is-a-title-quote',r'\btitle quotes?\b'),
   ('/blog/title-company-northern-virginia',r'\btitle compan(?:y|ies) in Northern Virginia\b'),
   ('/blog/lender-title-insurance',r"\blender['’]s (?:title )?polic(?:y|ies)\b|\blender['’]s title insurance\b"),
   ('/blog/virginia-real-estate-continuing-education-requirements',r'\bcontinuing education\b'),
   ('/blog/how-to-read-a-title-commitment',r'\btitle commitments?\b'),
   ('/blog/closing-protection-letters?' if False else '/blog/closing-protection-letter',r'\bclosing protection letters?\b'),
   ('/blog/who-pays-closing-costs-in-virginia',r'\bwho pays\b[^.]{0,40}\bVirginia\b'),
   ('/commercial-real-estate-closings',r'\bcommercial (?:closings?|transactions?|real estate closings?)\b'),
   ('/title-company-loudoun-county-va',r'\bLoudoun County\b'),
   ('/title-company-ashburn-va',r'\bAshburn\b'),
   ('/calculators',r'\bcalculators\b')]
def norm(h): return re.sub(r'^https?://(www\.)?dmvtitleguy\.(io|com)','',h).split('#')[0].split('?')[0].rstrip('/') or '/'
def links_in(post):
  out=set()
  def w(o):
    if isinstance(o,dict):
      if o.get('_type')=='link' and isinstance(o.get('href'),str): out.add(norm(o['href']))
      for v in o.values(): w(v)
    elif isinstance(o,list):
      for v in o: w(v)
  w(post['body']); return out
plans={}; proposals=[]
SKIP={('/blog/what-is-a-title-quote','title-insurance-claims-process'),('/blog/what-is-a-title-quote','what-is-a-deed-transfer'),('/blog/what-is-a-title-quote','title-and-settlement-services'),('/blog/who-pays-closing-costs-in-virginia','homeowners-insurance-vs-title-insurance'),('/blog/what-is-a-title-quote','homeowners-insurance-vs-title-insurance')}
for target,pat in T:
  n=0
  for p in posts:
    path='/blog/'+p['s']
    if n>=3: break
    if path==target or path in frozen or path in red or p['s'] in hidden: continue
    if indexed.get(path)!='Submitted and indexed': continue
    if target in links_in(p) : continue
    if (target,p['s']) in SKIP: continue
    body=plans.get(p['_id'],{}).get('body') or copy.deepcopy(p['body'])
    done=False
    for b in body:
      if done: break
      if b.get('_type')!='block' or b.get('style','normal') not in ('normal',) : continue
      for i,c in enumerate(b.get('children',[])):
        if c.get('_type')!='span' or c.get('marks'): continue
        m=re.search(pat,c.get('text',''),re.I)
        if not m: continue
        key=secrets.token_hex(6)
        t=c['text']; before,mid,after=t[:m.start()],t[m.start():m.end()],t[m.end():]
        new=[]
        if before: new.append({'_key':secrets.token_hex(6),'_type':'span','marks':[],'text':before})
        new.append({'_key':secrets.token_hex(6),'_type':'span','marks':[key],'text':mid})
        if after: new.append({'_key':secrets.token_hex(6),'_type':'span','marks':[],'text':after})
        b['children'][i:i+1]=new
        b.setdefault('markDefs',[]).append({'_key':key,'_type':'link','href':target})
        proposals.append((target,p['s'],mid,t[max(0,m.start()-50):m.end()+40]))
        plans[p['_id']]={'rev':p['_rev'],'slug':p['s'],'body':body}
        done=True; n+=1; break
for pr in proposals: print(pr[0],'<-',pr[1],'|',repr(pr[3]))
missing=[t for t,_ in T if t not in [x[0] for x in proposals]]
print('no source found:',missing)
json.dump({'plans':plans,'proposals':proposals},open('/tmp/relink3-plan.json','w'))
