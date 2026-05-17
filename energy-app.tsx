import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ReferenceLine, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";

const G="#4CAF50", R="#EF5350", BG="#efefef", W="#fff", DK="#1a1a1a", GR="#888", OR="#f5a623";

// ── DATA ──────────────────────────────────────────────────────────────────
const ladeD = {
  gestern:[{t:"02",l:100,e:0},{t:"04",l:65,e:0},{t:"06",l:55,e:0},{t:"08",l:185,e:0},{t:"10",l:490,e:0},{t:"12",l:1150,e:0},{t:"14",l:1490,e:0},{t:"16",l:0,e:-150},{t:"18",l:0,e:-560},{t:"20",l:0,e:-720},{t:"22",l:0,e:-610}],
  heute:  [{t:"02",l:120,e:0},{t:"04",l:80,e:0},{t:"06",l:60,e:0},{t:"08",l:220,e:0},{t:"10",l:580,e:0},{t:"12",l:1350,e:0},{t:"14",l:1750,e:0},{t:"16",l:0,e:-180},{t:"18",l:0,e:-620},{t:"20",l:0,e:-850},{t:"22",l:0,e:-720}],
  morgen: [{t:"02",l:130,e:0},{t:"04",l:95,e:0},{t:"06",l:70,e:0},{t:"08",l:255,e:0},{t:"10",l:640,e:0},{t:"12",l:1480,e:0},{t:"14",l:1920,e:0},{t:"16",l:0,e:-140},{t:"18",l:0,e:-500},{t:"20",l:0,e:-680},{t:"22",l:0,e:-580}],
};
const verbD = {
  gestern:[{t:"02",v:180},{t:"04",v:150},{t:"06",v:200},{t:"08",v:320},{t:"10",v:410},{t:"12",v:680},{t:"14",v:520},{t:"16",v:480},{t:"18",v:610},{t:"20",v:720},{t:"22",v:390}],
  heute:  [{t:"02",v:160},{t:"04",v:130},{t:"06",v:180},{t:"08",v:290},{t:"10",v:370},{t:"12",v:610},{t:"14",v:470},{t:"16",v:440},{t:"18",v:570},{t:"20",v:680},{t:"22",v:350}],
  morgen: [{t:"02",v:140},{t:"04",v:110},{t:"06",v:160},{t:"08",v:260},{t:"10",v:340},{t:"12",v:560},{t:"14",v:430},{t:"16",v:400},{t:"18",v:520},{t:"20",v:620},{t:"22",v:310}],
};
const PD = {
  gestern:{verbrauch:8.2,preis:22.1,kosten:1.81,em:1456,ei:312,sl:4.8,se:0.9,strom:2.4,haus:0.8,sp:1.6},
  heute:  {verbrauch:7.5,preis:24.2,kosten:1.82,em:1177,ei:424,sl:5.5,se:1.1,strom:2.1,haus:0.6,sp:1.5},
  morgen: {verbrauch:6.8,preis:19.8,kosten:1.35,em:890, ei:580,sl:6.2,se:0.7,strom:1.8,haus:0.5,sp:1.3},
};
const priceD=[{t:"02",p:18,avg:29,lo:12},{t:"04",p:16,avg:29,lo:12},{t:"06",p:22,avg:29,lo:12},{t:"08",p:28,avg:29,lo:12},{t:"10",p:32,avg:29,lo:12},{t:"12",p:48,avg:29,lo:12},{t:"14",p:38,avg:29,lo:12},{t:"16",p:26,avg:29,lo:12},{t:"18",p:22,avg:29,lo:12},{t:"20",p:20,avg:29,lo:12},{t:"22",p:17,avg:29,lo:12}];
const kostenD=[{t:"02",k:2,e:1},{t:"04",k:1.5,e:0.8},{t:"06",k:2.2,e:0.9},{t:"08",k:3.5,e:1.5},{t:"10",k:4,e:2},{t:"12",k:8,e:3.5},{t:"14",k:6,e:2.8},{t:"16",k:5,e:2.2},{t:"18",k:4.5,e:1.8},{t:"20",k:5.5,e:2},{t:"22",k:3,e:1.2}];
const spVerb=[{d:"3",sp:3.8,st:2.2},{d:"4",sp:4.2,st:1.8},{d:"5",sp:3.5,st:2.0},{d:"6",sp:4.8,st:2.2},{d:"7",sp:3.9,st:1.6},{d:"8",sp:4.5,st:2.0},{d:"9",sp:1.5,st:0.8}];
const co2W=[{d:"3",v:623},{d:"4",v:481},{d:"5",v:581},{d:"6",v:612},{d:"7",v:311},{d:"8",v:424},{d:"9",v:202}];

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────
function Tog({opts,val,onChange,sm}) {
  return (
    <div style={{display:"flex",background:"#e0e0e0",borderRadius:24,padding:3,flex:1}}>
      {opts.map(o=>(
        <button key={o.v} onClick={()=>onChange(o.v)} style={{
          flex:1,border:"none",padding:sm?"5px 6px":"8px 10px",borderRadius:21,
          background:val===o.v?DK:"transparent",color:val===o.v?W:GR,
          fontWeight:val===o.v?600:400,cursor:"pointer",fontSize:sm?11:13,
          whiteSpace:"nowrap",transition:"background .18s"
        }}>{o.l}</button>
      ))}
    </div>
  );
}
const Crd=({children,s})=><div style={{background:W,borderRadius:16,padding:16,...s}}>{children}</div>;
const Row=({children,s})=><div style={{display:"flex",alignItems:"center",...s}}>{children}</div>;
function DateNav({label}) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:W,borderRadius:12,padding:"10px 16px"}}>
      <button style={{border:"none",background:"none",fontSize:20,cursor:"pointer",color:DK,fontWeight:300}}>‹</button>
      <span style={{fontWeight:500,fontSize:15}}>{label}</span>
      <button style={{border:"none",background:"none",fontSize:20,cursor:"pointer",color:DK,fontWeight:300}}>›</button>
    </div>
  );
}
function PeriodBar({val,onChange}) {
  return (
    <div style={{display:"flex",gap:4}}>
      {["Tage","Monate","Jahr","Individuell"].map(p=>(
        <button key={p} onClick={()=>onChange(p)} style={{
          flex:1,border:"none",padding:"7px 2px",borderRadius:20,fontSize:11,
          background:val===p?DK:W,color:val===p?W:GR,fontWeight:val===p?600:400,cursor:"pointer"
        }}>{p}</button>
      ))}
    </div>
  );
}
function ProfileAvatar() {
  return <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#e8a87c,#c76b3a)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>👤</div>;
}
const chartAxis = {tick:{fontSize:10,fill:GR},axisLine:false,tickLine:false};

// ── HOME ──────────────────────────────────────────────────────────────────
function HomeScreen() {
  const [per,setPer]=useState("heute");
  const [ct,setCt]=useState("laden");
  const d=PD[per];
  const cd=ct==="laden"?ladeD[per]:verbD[per];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10,padding:16,paddingBottom:4}}>
      {/* Header */}
      <Row s={{justifyContent:"space-between",marginBottom:2}}>
        <div>
          <Row s={{gap:6,marginBottom:5}}><span style={{fontSize:16}}>📍</span><span style={{fontWeight:600,fontSize:17}}>Würzburg</span></Row>
          <Row s={{gap:6,marginBottom:5}}><span style={{color:OR,fontWeight:700,fontSize:15}}>€</span><span style={{fontSize:13,color:GR}}>16 Cent/kWh</span></Row>
          <Row s={{gap:6}}><span style={{color:G,fontSize:15}}>🍃</span><span style={{fontSize:13,color:GR}}>52 Gramm CO₂eq/kWh</span></Row>
        </div>
        <ProfileAvatar/>
      </Row>

      {/* Energy Flow */}
      <Crd s={{padding:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 36px 1fr",gap:6,alignItems:"center"}}>
          <div style={{textAlign:"center",padding:"6px 0"}}>
            <div style={{fontSize:22,marginBottom:2}}>⚡</div>
            <div style={{color:R,fontWeight:700,fontSize:20}}>{d.strom} kW</div>
            <div style={{color:GR,fontSize:12,marginTop:1}}>Stromnetz</div>
          </div>
          <div style={{textAlign:"center",color:G,fontSize:24,fontWeight:700}}>→</div>
          <div style={{textAlign:"center",padding:"6px 0"}}>
            <div style={{fontSize:22,marginBottom:2}}>🏠</div>
            <div style={{color:G,fontWeight:700,fontSize:20}}>{d.haus} kW</div>
            <div style={{color:GR,fontSize:12,marginTop:1}}>Haushalt</div>
          </div>
          <div style={{textAlign:"center",color:G,fontSize:24,fontWeight:700,lineHeight:1}}>↓</div>
          <div/>
          <div style={{height:60}}>
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={ladeD.heute} barSize={4} barGap={1}>
                <Bar dataKey="l" fill={G}/><Bar dataKey="e" fill={R}/>
                <ReferenceLine y={0} stroke="#ddd"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{textAlign:"center",padding:"6px 0"}}>
            <div style={{fontSize:22,marginBottom:2}}>🔋</div>
            <div style={{color:G,fontWeight:700,fontSize:20}}>{d.sp} kW</div>
            <div style={{color:GR,fontSize:12,marginTop:1}}>Speicher</div>
          </div>
          <div/><div/>
        </div>
      </Crd>

      {/* Gestern / Heute / Morgen */}
      <Crd s={{padding:"5px 6px"}}>
        <div style={{display:"flex",gap:2}}>
          {["gestern","heute","morgen"].map(p=>(
            <button key={p} onClick={()=>setPer(p)} style={{
              flex:1,border:"none",padding:"10px 4px",borderRadius:24,cursor:"pointer",
              background:per===p?DK:"transparent",color:per===p?W:DK,
              fontWeight:per===p?600:400,fontSize:15,lineHeight:1.2
            }}>
              <div>{p.charAt(0).toUpperCase()+p.slice(1)}</div>
              {p==="morgen"&&<div style={{fontSize:10,color:per===p?"#ccc":GR}}>Prognose</div>}
            </button>
          ))}
        </div>
      </Crd>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {[{i:"🏠",v:`${d.verbrauch} kWh`,l:"Verbrauch"},{i:"€",v:`${d.preis} Cent/kWh`,l:"Preis"},{i:"🏛",v:`${d.kosten.toFixed(2)} Euro`,l:"Kosten"}].map(s=>(
          <Crd key={s.l} s={{padding:10,textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:3}}>{s.i}</div>
            <div style={{fontWeight:700,fontSize:11,lineHeight:1.3}}>{s.v}</div>
            <div style={{color:GR,fontSize:11,marginTop:2}}>{s.l}</div>
          </Crd>
        ))}
      </div>

      {/* CO2 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={{borderRadius:16,height:88,background:"linear-gradient(160deg,#8b5e3c,#c97d4e)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:W}}>
          <div style={{fontSize:24,fontWeight:700}}>{d.em}</div>
          <div style={{fontSize:11,textAlign:"center",opacity:.9,marginTop:2,lineHeight:1.3}}>Gramm CO₂eq<br/>Emissionen</div>
        </div>
        <div style={{borderRadius:16,height:88,background:"linear-gradient(160deg,#1a3a1a,#2d6030)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:W}}>
          <div style={{fontSize:24,fontWeight:700}}>{d.ei}</div>
          <div style={{fontSize:11,textAlign:"center",opacity:.9,marginTop:2,lineHeight:1.3}}>Gramm CO₂eq<br/>Einsparungen</div>
        </div>
      </div>

      {/* Chart */}
      <Crd s={{padding:12}}>
        <Row s={{marginBottom:10,gap:8,justifyContent:"space-between"}}>
          <Tog opts={[{v:"laden",l:"Ladeverhalten"},{v:"verbrauch",l:"Verbrauch"}]} val={ct} onChange={setCt}/>
          <span style={{fontSize:15,color:GR}}>ⓘ</span>
        </Row>
        <div style={{fontSize:11,color:"#bbb",textAlign:"right",marginBottom:2}}>14:01</div>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={cd} barSize={ct==="laden"?8:10} barGap={1}>
            <XAxis dataKey="t" {...chartAxis}/>
            <YAxis {...chartAxis} domain={ct==="laden"?[-2000,2000]:undefined} ticks={ct==="laden"?[-2000,-1000,0,1000,2000]:undefined}/>
            {ct==="laden"&&<ReferenceLine y={0} stroke="#e0e0e0"/>}
            <Tooltip formatter={v=>`${v} Wh`} labelFormatter={l=>`${l}:00 Uhr`}/>
            {ct==="laden"?<><Bar dataKey="l" fill={G} radius={[2,2,0,0]}/><Bar dataKey="e" fill={R} radius={[2,2,0,0]}/></>:<Bar dataKey="v" fill={OR} radius={[2,2,0,0]}/>}
          </BarChart>
        </ResponsiveContainer>
        <div style={{fontSize:11,color:GR,textAlign:"center",marginTop:2}}>Uhrzeit</div>
        {ct==="laden"&&(
          <Row s={{gap:14,justifyContent:"center",marginTop:8,flexWrap:"wrap"}}>
            <Row s={{gap:4}}><div style={{width:10,height:10,background:G,borderRadius:2}}/><span style={{fontSize:11,color:GR}}>{d.sl} kWh Speicherladung</span></Row>
            <Row s={{gap:4}}><div style={{width:10,height:10,background:R,borderRadius:2}}/><span style={{fontSize:11,color:GR}}>{d.se} kWh Speicherentladung</span></Row>
          </Row>
        )}
      </Crd>
    </div>
  );
}

// ── SPEICHER ──────────────────────────────────────────────────────────────
function BatteryScreen() {
  const [per,setPer]=useState("Tage");
  const [ct,setCt]=useState("laden");
  const [pct,setPct]=useState("preis");
  const [kct,setKct]=useState("kosten");
  const [act,setAct]=useState("anlagen");
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10,padding:16,paddingBottom:4}}>
      <Row s={{justifyContent:"space-between"}}>
        <Row s={{gap:8}}><span style={{fontSize:22}}>🔋</span><h2 style={{margin:0,fontSize:20,fontWeight:700}}>Speicher</h2></Row>
        <ProfileAvatar/>
      </Row>
      <PeriodBar val={per} onChange={setPer}/>
      <DateNav label="Heute"/>
      <Row s={{justifyContent:"space-between",alignItems:"center"}}>
        <button style={{background:DK,color:W,border:"none",borderRadius:24,padding:"10px 22px",fontSize:15,fontWeight:600,cursor:"pointer"}}>Status</button>
        <span style={{fontSize:16,color:GR}}>ⓘ</span>
      </Row>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8}}>
        <div style={{borderRadius:16,background:"#e8a090",padding:"14px 16px"}}>
          <div style={{fontWeight:700,fontSize:18}}>5.4 kWh</div>
          <div style={{fontWeight:700,fontSize:18}}>83.1 %</div>
          <div style={{fontSize:13,marginTop:4}}>Verfügbar</div>
        </div>
        <div style={{borderRadius:16,background:"#f0c8c0",padding:"14px 12px"}}>
          <div style={{fontWeight:700,fontSize:15}}>1.1 kWh</div>
          <div style={{fontWeight:700,fontSize:15}}>16.9 %</div>
          <div style={{fontSize:12,marginTop:4}}>Entladen</div>
        </div>
      </div>

      <Crd s={{padding:12}}>
        <Row s={{marginBottom:10,gap:8}}>
          <Tog opts={[{v:"laden",l:"Ladeverhalten"},{v:"verbrauch",l:"Verbrauch"}]} val={ct} onChange={setCt}/>
          <span style={{fontSize:15,color:GR}}>ⓘ</span>
        </Row>
        <div style={{fontSize:11,color:"#bbb",textAlign:"right",marginBottom:2}}>14:01</div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={ct==="laden"?ladeD.heute:spVerb} barSize={ct==="laden"?8:16} barGap={1}>
            <XAxis dataKey={ct==="laden"?"t":"d"} {...chartAxis}/>
            <YAxis {...chartAxis} domain={ct==="laden"?[-2000,2000]:undefined}/>
            {ct==="laden"&&<ReferenceLine y={0} stroke="#e0e0e0"/>}
            <Tooltip/>
            {ct==="laden"?<><Bar dataKey="l" fill={G} radius={[2,2,0,0]}/><Bar dataKey="e" fill={R} radius={[2,2,0,0]}/></>:<><Bar dataKey="sp" stackId="a" fill="#c0392b"/><Bar dataKey="st" stackId="a" fill="#f5d76e" radius={[2,2,0,0]}/></>}
          </BarChart>
        </ResponsiveContainer>
        <div style={{fontSize:11,color:GR,textAlign:"center"}}>Uhrzeit</div>
        <Row s={{gap:12,justifyContent:"center",marginTop:6,flexWrap:"wrap"}}>
          <Row s={{gap:4}}><div style={{width:10,height:10,background:G,borderRadius:2}}/><span style={{fontSize:11,color:GR}}>5.5 kWh Speicherladung</span></Row>
          <Row s={{gap:4}}><div style={{width:10,height:10,background:R,borderRadius:2}}/><span style={{fontSize:11,color:GR}}>1.1 kWh Speicherentladung</span></Row>
        </Row>
      </Crd>

      <Crd s={{padding:12}}>
        <Row s={{marginBottom:10,gap:8}}>
          <Tog opts={[{v:"preis",l:"Strompreis"},{v:"em",l:"Emissionen"}]} val={pct} onChange={setPct}/>
          <span style={{fontSize:15,color:GR}}>ⓘ</span>
        </Row>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={priceD}>
            <XAxis dataKey="t" {...chartAxis}/><YAxis {...chartAxis}/>
            <Tooltip formatter={v=>`${v} Cent/kWh`}/>
            <Line type="monotone" dataKey="p" stroke={R} strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="avg" stroke={GR} strokeWidth={1} strokeDasharray="4 2" dot={false}/>
            <Line type="monotone" dataKey="lo" stroke={G} strokeWidth={1} strokeDasharray="4 2" dot={false}/>
          </LineChart>
        </ResponsiveContainer>
        <div style={{fontSize:11,color:GR,textAlign:"center"}}>Uhrzeit</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginTop:8,fontSize:11,color:GR}}>
          <Row s={{gap:4}}><span style={{color:G}}>●</span><span>16 Cent/kWh Aktueller Preis</span></Row>
          <span>29 Cent/kWh Ø Preis</span>
          <Row s={{gap:4}}><span style={{color:R}}>—</span><span>48 Cent/kWh Höchster Preis</span></Row>
          <Row s={{gap:4}}><span style={{color:G}}>—</span><span>12 Cent/kWh Niedrigster Preis</span></Row>
        </div>
      </Crd>

      <Crd s={{padding:12}}>
        <Row s={{marginBottom:10,gap:8}}>
          <Tog opts={[{v:"kosten",l:"Kosten"},{v:"ersparnis",l:"Ersparnis"}]} val={kct} onChange={setKct}/>
          <span style={{fontSize:15,color:GR}}>ⓘ</span>
        </Row>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={kostenD} barSize={12}>
            <XAxis dataKey="t" {...chartAxis}/><YAxis {...chartAxis}/>
            <Tooltip/>
            <Bar dataKey={kct==="kosten"?"k":"e"} fill={kct==="kosten"?"#f5d76e":G} radius={[2,2,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
        <div style={{fontSize:11,color:GR,textAlign:"center"}}>Uhrzeit</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:8,fontSize:12,color:GR}}>
          <span>⚡ 19 Cent Preis pro kWh</span>
          <span style={{color:G}}>💚 9 Cent Ersparnis pro kWh</span>
          <span>🏛 1.43 Euro Kosten</span>
          <span style={{color:G}}>💰 0.48 Euro Ersparnis</span>
        </div>
      </Crd>

      <Crd s={{padding:12}}>
        <Row s={{justifyContent:"space-between",marginBottom:10}}>
          <Tog opts={[{v:"anlagen",l:"Anlagen"},{v:"karte",l:"Karte"}]} val={act} onChange={setAct}/>
          <span style={{fontSize:15,color:GR,marginLeft:8}}>ⓘ</span>
        </Row>
        {[{icon:"☀️",label:"Solarenergie",pct:45,color:OR},{icon:"💨",label:"Windenergie",pct:35,color:"#5b9bd5"},{icon:"⚡",label:"Fossil",pct:20,neg:-12,color:"#a0522d"}].map(a=>(
          <div key={a.label} style={{marginBottom:12}}>
            <Row s={{justifyContent:"space-between",marginBottom:4,fontSize:13}}>
              <span>{a.icon} {a.label}</span>
              <span style={{color:a.neg?R:DK,fontWeight:600}}>{a.pct}%{a.neg?` / ${a.neg}%`:""}</span>
            </Row>
            <div style={{height:8,background:"#eee",borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${a.pct}%`,background:a.color,borderRadius:4,transition:"width .4s"}}/>
            </div>
          </div>
        ))}
        <p style={{fontSize:12,color:GR,margin:"8px 0 0",lineHeight:1.5}}>Der Speicher hat den Anteil der fossilen Energien am Stromverbrauch um 12% gesenkt.</p>
      </Crd>
    </div>
  );
}

// ── INSIGHTS ──────────────────────────────────────────────────────────────
function InsightsScreen() {
  const [per,setPer]=useState("Monate");
  const [view,setView]=useState("kategorien");
  const cats=[
    {icon:"🌀",label:"Haushalt",pct:42,kwh:20.2,color:"#ffd6d8"},
    {icon:"📺",label:"Unterhaltung",pct:24,kwh:11.6,color:"#ffe8c4"},
    {icon:"💻",label:"Kommunikation",pct:16,kwh:7.7,color:"#c8e6ff"},
    {icon:"💡",label:"Beleuchtung",pct:10,kwh:4.8,color:"#c8f0d0"},
    {icon:"📦",label:"Sonstiges",pct:8,kwh:3.9,color:"#e4d0ff"},
  ];
  const geraete=[{icon:"🧺",label:"Waschmaschine",kwh:9.4,s:76},{icon:"❄️",label:"Kühlschrank",kwh:12.2,s:84},{icon:"📺",label:"Fernseher",kwh:6.9,s:68},{icon:"🍽️",label:"Mikrowelle",kwh:7.3,s:70},{icon:"💻",label:"Laptop",kwh:3.6,s:56},{icon:"📱",label:"Handy",kwh:2.2,s:48},{icon:"💡",label:"Beleuchtung",kwh:3.1,s:52}];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10,padding:16,paddingBottom:4}}>
      <Row s={{justifyContent:"space-between"}}>
        <Row s={{gap:8}}><span style={{fontSize:22}}>📈</span><h2 style={{margin:0,fontSize:20,fontWeight:700}}>Insights</h2></Row>
        <ProfileAvatar/>
      </Row>
      <Crd>
        <Row s={{justifyContent:"space-between",marginBottom:6}}><span style={{fontWeight:600,fontSize:15}}>Entdecke deine Energiedaten</span><span style={{fontSize:18}}>💬</span></Row>
        <p style={{color:GR,fontSize:12,margin:"0 0 8px",fontWeight:500}}>Vorschläge</p>
        {["Wie viel Strom hat meine Waschmaschine diese Woche verbraucht?","Wann ist die günstige Zeit um die Spülmaschine anzuschalten?","Welche Geräte haben die meisten Emissionen diesen Monat verursacht?"].map(q=>(
          <div key={q} style={{background:BG,borderRadius:10,padding:"8px 12px",marginBottom:6,fontSize:12,color:GR,cursor:"pointer"}}>{q}</div>
        ))}
        <div style={{textAlign:"center",fontSize:13,fontWeight:600,marginTop:4,cursor:"pointer"}}>Weitere Vorschläge entdecken ›</div>
      </Crd>
      <Crd>
        <p style={{margin:"0 0 2px",fontWeight:600,fontSize:14}}>Empfehlungen</p>
        <p style={{color:GR,fontSize:12,margin:"0 0 8px"}}>Personalisierte Ideen um Verbrauch und Kosten zu optimieren</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {["Nutze die niedrigen Preise morgen zwischen 14:00 und 15:45 Uhr","Reduziere deinen Verbrauch heute zwischen 18:00 und 20:30 Uhr"].map(r=>(
            <div key={r} style={{background:BG,borderRadius:10,padding:"10px 12px",fontSize:12}}>{r}</div>
          ))}
        </div>
        <div style={{textAlign:"center",fontSize:13,fontWeight:600,marginTop:10,cursor:"pointer"}}>Weitere Empfehlungen anzeigen ›</div>
      </Crd>
      <PeriodBar val={per} onChange={setPer}/>
      <DateNav label="März 2025"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {[{i:"🏠",v:"48.2 kWh",l:"Verbrauch"},{i:"€",v:"19.1 Cent/kWh",l:"Preis"},{i:"🏛",v:"3.45 Euro",l:"Kosten"}].map(s=>(
          <Crd key={s.l} s={{padding:10,textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:3}}>{s.i}</div>
            <div style={{fontWeight:700,fontSize:11,lineHeight:1.3}}>{s.v}</div>
            <div style={{color:GR,fontSize:11,marginTop:2}}>{s.l}</div>
          </Crd>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={{borderRadius:16,height:84,background:"linear-gradient(160deg,#8b5e3c,#c97d4e)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:W}}>
          <div style={{fontSize:22,fontWeight:700}}>9611</div>
          <div style={{fontSize:11,textAlign:"center",opacity:.9,marginTop:2,lineHeight:1.3}}>Gramm CO₂eq<br/>Emissionen</div>
        </div>
        <div style={{borderRadius:16,height:84,background:"linear-gradient(160deg,#1a3a1a,#2d6030)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:W}}>
          <div style={{fontSize:22,fontWeight:700}}>3234</div>
          <div style={{fontSize:11,textAlign:"center",opacity:.9,marginTop:2,lineHeight:1.3}}>Gramm CO₂eq<br/>Einsparungen</div>
        </div>
      </div>
      <Crd s={{padding:12}}>
        <Row s={{marginBottom:12,gap:8}}>
          <Tog opts={[{v:"kategorien",l:"Kategorien"},{v:"geraete",l:"Geräte"}]} val={view} onChange={setView}/>
          <span style={{fontSize:15,color:GR}}>ⓘ</span>
        </Row>
        {view==="kategorien"?(
          <div>
            {cats.map(c=>(
              <Row key={c.label} s={{gap:8,marginBottom:8,cursor:"pointer"}}>
                <span style={{fontSize:11,color:GR,width:30,textAlign:"right",flexShrink:0}}>{c.kwh}</span>
                <div style={{flex:1,background:c.color,borderRadius:10,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:20}}>{c.icon}</span>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:700,fontSize:15}}>{c.pct} %</div>
                    <div style={{fontSize:12}}>{c.label}</div>
                  </div>
                </div>
              </Row>
            ))}
          </div>
        ):(
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",padding:"8px 0"}}>
            {geraete.map(g=>(
              <div key={g.label} style={{width:g.s,height:g.s,borderRadius:"50%",background:"#ffd6d8",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                <div style={{fontSize:g.s>60?18:14}}>{g.icon}</div>
                <div style={{fontSize:g.s>60?11:9,fontWeight:700}}>{g.kwh} kWh</div>
              </div>
            ))}
          </div>
        )}
        <p style={{fontSize:12,color:GR,textAlign:"center",margin:"8px 0 0"}}>Klicke auf eine Kategorie für Details</p>
      </Crd>
      <button style={{background:DK,color:W,border:"none",borderRadius:24,padding:"13px",fontSize:14,fontWeight:600,cursor:"pointer"}}>💡 Geräte automatisieren</button>
      <button style={{background:W,color:DK,border:"1px solid #ddd",borderRadius:24,padding:"13px",fontSize:14,fontWeight:600,cursor:"pointer"}}>⬇️ Insights herunterladen</button>
    </div>
  );
}

// ── AUTOMATION ────────────────────────────────────────────────────────────
function AutomationScreen() {
  const [view,setView]=useState("automationen");
  const autos=[
    {icon:"🧺",label:"Waschmaschine",desc:"Schaltet die Waschmaschine zu niedrigen Preisen ein",color:"#ffd6d8"},
    {icon:"📺",label:"Fernseher",desc:"Schaltet den Fernseher in der Nacht vollständig aus",color:"#ffe8c4"},
    {icon:"👔",label:"Trockner",desc:"Lässt den Trockner zur Mittagszeit starten",color:"#c8dcff"},
    {icon:"💡",label:"Küchenlampe",desc:"Schaltet die Lampen nach dem Verlassen der Küche aus",color:"#d4c8ff"},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10,padding:16,paddingBottom:4}}>
      <Row s={{justifyContent:"space-between"}}>
        <Row s={{gap:8}}><span style={{fontSize:22}}>💡</span><h2 style={{margin:0,fontSize:20,fontWeight:700}}>Automation</h2></Row>
        <ProfileAvatar/>
      </Row>
      <Crd>
        <Row s={{justifyContent:"space-between"}}>
          <span style={{color:GR,fontSize:14}}>Formuliere dein Ziel</span>
          <span style={{fontSize:18}}>💬</span>
        </Row>
      </Crd>
      <Crd>
        <p style={{margin:"0 0 4px",fontWeight:600,fontSize:14}}>Vorschläge</p>
        <p style={{color:GR,fontSize:12,margin:"0 0 8px"}}>Verwende einen der Vorschläge oder formuliere selbst</p>
        {["Ich möchte meine Waschmaschine nur zu den günstigsten Zeiten nutzen","Ich möchte, dass sich alle Standby Geräte 3 Stunden nach Sonnenuntergang ausschalten","Ich möchte alle meine Lichter ausschalten, wenn niemand mehr Zuhause ist"].map(s=>(
          <div key={s} style={{background:BG,borderRadius:10,padding:"8px 12px",marginBottom:6,fontSize:12,color:GR,cursor:"pointer"}}>{s}</div>
        ))}
        <div style={{textAlign:"center",fontSize:13,fontWeight:600,marginTop:4,cursor:"pointer"}}>Weitere Vorschläge entdecken ›</div>
      </Crd>
      <Crd>
        <p style={{margin:"0 0 4px",fontWeight:600,fontSize:14}}>Empfehlungen</p>
        <p style={{color:GR,fontSize:12,margin:"0 0 8px"}}>Automationen mit denen du richtig Geld sparen kannst</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {["Wasche wenn Strom zu mind. 95 Prozent aus erneuerbaren Energien kommt","Schalte die Beleuchtung automatisch aus, sobald die letzte Person das Zuhause verlassen hat"].map(r=>(
            <div key={r} style={{background:BG,borderRadius:10,padding:"10px 12px",fontSize:12}}>{r}</div>
          ))}
        </div>
        <div style={{textAlign:"center",fontSize:13,fontWeight:600,marginTop:10,cursor:"pointer"}}>Weitere Empfehlungen entdecken ›</div>
      </Crd>
      <Crd s={{padding:12}}>
        <Row s={{marginBottom:12,gap:8}}>
          <Tog opts={[{v:"automationen",l:"Automationen"},{v:"szenen",l:"Szenen"}]} val={view} onChange={setView}/>
          <span style={{fontSize:15,color:GR}}>ⓘ</span>
        </Row>
        {autos.map(a=>(
          <Row key={a.label} s={{gap:12,marginBottom:12,cursor:"pointer"}}>
            <div style={{width:48,height:48,borderRadius:14,background:a.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{a.icon}</div>
            <div>
              <div style={{fontWeight:600,fontSize:14}}>{a.label}</div>
              <div style={{fontSize:12,color:GR,marginTop:2}}>{a.desc}</div>
            </div>
          </Row>
        ))}
        <div style={{textAlign:"center",fontSize:13,fontWeight:600,cursor:"pointer"}}>Weitere Automationen anzeigen ›</div>
      </Crd>
      <Crd s={{padding:12}}>
        <Row s={{justifyContent:"space-between",marginBottom:12}}>
          <button style={{background:DK,color:W,border:"none",borderRadius:24,padding:"8px 20px",fontWeight:600,cursor:"pointer",fontSize:14}}>Galerie</button>
          <span style={{fontSize:15,color:GR}}>ⓘ</span>
        </Row>
        <p style={{margin:"0 0 2px",fontWeight:600,fontSize:13}}>Automationen</p>
        <p style={{color:GR,fontSize:12,margin:"0 0 8px"}}>Geräte smarter steuern</p>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {["Smarte Beleuchtung","Standby Modus"].map(s=>(
            <div key={s} style={{flex:1,background:BG,borderRadius:12,padding:"12px",fontSize:12,fontWeight:600,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
              {s}<span style={{fontSize:18,color:G}}>+</span>
            </div>
          ))}
        </div>
        <p style={{margin:"0 0 2px",fontWeight:600,fontSize:13}}>Szenen</p>
        <p style={{color:GR,fontSize:12,margin:"0 0 8px"}}>Kosten und Emissionen im Haushalt sparen</p>
        <div style={{display:"flex",gap:8}}>
          {["Günstig Waschen","Clever Kühlen"].map(s=>(
            <div key={s} style={{flex:1,background:BG,borderRadius:12,padding:"12px",fontSize:12,fontWeight:600,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
              {s}<span style={{fontSize:18,color:G}}>+</span>
            </div>
          ))}
        </div>
      </Crd>
      <button style={{background:DK,color:W,border:"none",borderRadius:24,padding:"14px",fontSize:14,fontWeight:600,cursor:"pointer"}}>⚡ Impact anzeigen</button>
    </div>
  );
}

// ── IMPACT ────────────────────────────────────────────────────────────────
function ImpactScreen() {
  const [per,setPer]=useState("Tage");
  const [mil,setMil]=useState("meilensteine");
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10,padding:16,paddingBottom:4}}>
      <Row s={{justifyContent:"space-between"}}>
        <Row s={{gap:8}}><span style={{fontSize:22}}>🍃</span><h2 style={{margin:0,fontSize:20,fontWeight:700}}>Impact</h2></Row>
        <ProfileAvatar/>
      </Row>
      <PeriodBar val={per} onChange={setPer}/>
      <DateNav label="Heute"/>
      <div style={{borderRadius:16,height:100,background:"linear-gradient(160deg,#1a3a1a,#2d6030)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:W}}>
        <div style={{fontSize:34,fontWeight:700}}>424</div>
        <div style={{fontSize:13,opacity:.9}}>Gramm CO₂eq Einsparungen</div>
      </div>
      <Crd s={{padding:12}}>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={co2W} barSize={22}>
            <XAxis dataKey="d" {...chartAxis}/><YAxis {...chartAxis}/>
            <Tooltip formatter={v=>`${v} g CO₂eq`}/>
            <Bar dataKey="v" fill={G} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
        <div style={{fontSize:11,color:GR,textAlign:"center"}}>Tage</div>
      </Crd>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={{borderRadius:16,height:88,background:"linear-gradient(160deg,#2c3e50,#3498db)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:W}}>
          <div style={{fontSize:28,fontWeight:700}}>80</div>
          <div style={{fontSize:11,textAlign:"center",opacity:.9,lineHeight:1.3}}>Prozent<br/>Erneuerbare Energien</div>
        </div>
        <div style={{borderRadius:16,height:88,background:"linear-gradient(160deg,#1a3a1a,#27ae60)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:W}}>
          <div style={{fontSize:28,fontWeight:700}}>12</div>
          <div style={{fontSize:11,textAlign:"center",opacity:.9,lineHeight:1.3}}>Prozent<br/>Energieeinsparung</div>
        </div>
      </div>
      <DateNav label="März 2025"/>
      <Crd s={{padding:12}}>
        <Row s={{justifyContent:"space-between",marginBottom:12,alignItems:"center"}}>
          <button style={{background:DK,color:W,border:"none",borderRadius:24,padding:"8px 20px",fontWeight:600,cursor:"pointer",fontSize:14}}>Vergleich</button>
          <span style={{fontSize:15,color:GR}}>ⓘ</span>
        </Row>
        {[
          {icon:"🏁",label:"10% Nachhaltigsten",val:"6.456 Gramm CO₂eq",bg:"#e8ffe8"},
          {icon:"🏠",label:"Dein Zuhause",val:"6.856 Gramm CO₂eq",bg:"#f0f8ff"},
          {icon:"👥",label:"Energized Community",val:"7.301 Gramm CO₂eq",bg:"#fffbe8"},
          {icon:"🌍",label:"Durchschnitt in Deutschland",val:"8.747 Gramm CO₂eq",bg:"#fff0f0"},
        ].map(v=>(
          <div key={v.label} style={{background:v.bg,borderRadius:12,padding:"11px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>{v.icon}</span>
            <div><div style={{fontWeight:600,fontSize:13}}>{v.label}</div><div style={{fontSize:12,color:GR,marginTop:1}}>{v.val}</div></div>
          </div>
        ))}
      </Crd>
      <Crd s={{padding:12}}>
        <Row s={{marginBottom:12,gap:8}}>
          <Tog opts={[{v:"meilensteine",l:"Meilensteine"},{v:"badges",l:"Badges"}]} val={mil} onChange={setMil}/>
          <span style={{fontSize:15,color:GR,marginLeft:8}}>ⓘ</span>
        </Row>
        {mil==="meilensteine"?[
          {icon:"☀️",bg:"#fff8e1",label:"Erneuerbare Energien nutzen",sub:"> 80 Prozent EE pro Tag",right:"5/8 Tage"},
          {icon:"⚡",bg:"#e8f5e9",label:"Energie einsparen",sub:"-10 Prozent ggü. Vorjahresmonat",right:"-7 Prozent"},
          {icon:"💰",bg:"#e3f2fd",label:"Kosten reduzieren",sub:"< 16 Cent pro kWh",right:"19.1 Cent"},
          {icon:"🌿",bg:"#fce4ec",label:"Emissionen minimieren",sub:"< 180 Gramm CO₂eq pro kWh",right:"192 g CO₂eq"},
        ].map(m=>(
          <div key={m.label} style={{background:m.bg,borderRadius:12,padding:"11px 14px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
            <Row s={{gap:10}}>
              <span style={{fontSize:22}}>{m.icon}</span>
              <div><div style={{fontWeight:600,fontSize:13}}>{m.label}</div><div style={{fontSize:11,color:GR,marginTop:1}}>{m.sub}</div></div>
            </Row>
            <div style={{fontSize:11,color:GR,textAlign:"right",flexShrink:0,whiteSpace:"nowrap"}}>{m.right}</div>
          </div>
        )):(
          <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",padding:"8px 0"}}>
            {["🏆","🌱","⚡","💧","🌍","🔋","☀️","🏅"].map((b,i)=>(
              <div key={i} style={{width:60,height:60,borderRadius:"50%",background:i%2===0?"#fff8e1":"#e8f5e9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,opacity:i<5?1:0.35}}>{b}</div>
            ))}
          </div>
        )}
        <div style={{textAlign:"center",fontSize:13,fontWeight:600,cursor:"pointer",marginTop:4}}>Weitere Meilensteine anzeigen ›</div>
      </Crd>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────────────────
function BottomNav({tab,setTab}) {
  const tabs=[{id:"home",icon:"🏠",l:"Zuhause"},{id:"battery",icon:"🔋",l:"Speicher"},{id:"insights",icon:"📈",l:"Insights"},{id:"automation",icon:"💡",l:"Automation"},{id:"impact",icon:"🍃",l:"Impact"}];
  return (
    <div style={{position:"sticky",bottom:0,background:W,borderTop:"1px solid #e0e0e0",display:"flex",zIndex:100,marginTop:"auto"}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,border:"none",background:"none",padding:"10px 2px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <span style={{fontSize:21,filter:tab===t.id?"none":"grayscale(1)",opacity:tab===t.id?1:0.45,transition:"opacity .2s"}}>{t.icon}</span>
          <span style={{fontSize:10,color:tab===t.id?DK:GR,fontWeight:tab===t.id?600:400}}>{t.l}</span>
        </button>
      ))}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]=useState("home");
  const screens={home:<HomeScreen/>,battery:<BatteryScreen/>,insights:<InsightsScreen/>,automation:<AutomationScreen/>,impact:<ImpactScreen/>};
  return (
    <div style={{maxWidth:400,margin:"0 auto",background:BG,minHeight:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",display:"flex",flexDirection:"column",overflowX:"hidden"}}>
      <div style={{flex:1,overflowY:"auto"}}>{screens[tab]}</div>
      <BottomNav tab={tab} setTab={setTab}/>
    </div>
  );
}
