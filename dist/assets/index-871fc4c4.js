(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function s(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(e){if(e.ep)return;e.ep=!0;const i=s(e);fetch(e.href,i)}})();function v(c,t,s){const o=[];for(let e=0;e<s;e++){const i=c.r+(t.r-c.r)*e/(s-1),l=c.g+(t.g-c.g)*e/(s-1),n=c.b+(t.b-c.b)*e/(s-1);o.push(`rgb(${Math.round(i)}, ${Math.round(l)}, ${Math.round(n)})`)}return o}class L{constructor(t,s){this.svgElement=t,this.end=null;const o={r:93,g:181,b:213},e={r:21,g:65,b:81};this.backgroundColormap=v(o,e,128);const i={r:66,g:66,b:61},l={r:28,g:28,b:26};this.noteColormap=v(i,l,128),this.svgElement.setAttribute("viewBox","0 0 1 1"),this.svgElement.setAttribute("preserveAspectRatio","none"),this.drawPianoRoll(s)}timeToX(t){return t/this.end}drawPianoRoll(t){this.start=t[0].start,this.end=t[t.length-1].end-this.start;const s=t.map(n=>n.pitch);let o=Math.min(...s),e=Math.max(...s),i=e-o;if(i<24){const n=24-i,r=Math.ceil(n/2),d=Math.floor(n/2);o-=r,e+=d}o-=3,e+=3,i=e-o,this.note_height=1/i,this.drawEmptyPianoRoll(o,e);let l=0;t.forEach(n=>{l++;const r=document.createElementNS("http://www.w3.org/2000/svg","rect"),d=this.timeToX(n.start-this.start),h=this.timeToX(n.end-n.start);r.setAttribute("x",`${d}`),r.setAttribute("width",`${h}`);const u=1-(n.pitch-o)/i;r.setAttribute("y",`${u}`),r.setAttribute("height",`${this.note_height}`);const m=this.noteColormap[n.velocity];r.setAttribute("fill",m),r.classList.add("note-rectangle"),r.setAttribute("id",`${l}`),this.svgElement.appendChild(r)})}drawEmptyPianoRoll(t,s){const o=s-t;for(let i=t;i<=s+1;i++){if([1,3,6,8,10].includes(i%12)){const r=document.createElementNS("http://www.w3.org/2000/svg","rect"),d=1-(i-t)/o,h=0,u=1/o,m=1;r.setAttribute("fill",this.backgroundColormap[12]),r.setAttribute("fill-opacity","0.666"),r.setAttribute("x",`${h}`),r.setAttribute("y",`${d}`),r.setAttribute("width",`${m}`),r.setAttribute("height",`${u}`),this.svgElement.appendChild(r)}var e=document.createElementNS("http://www.w3.org/2000/svg","line");const l=1-(i-t)/o+1/o;e.setAttribute("x1","0"),e.setAttribute("y1",`${l}`),e.setAttribute("x2","2"),e.setAttribute("y2",`${l}`);let n;i%12===0?n=.003:n=.001,e.setAttribute("stroke-width",`${n}`),e.setAttribute("stroke","black"),this.svgElement.appendChild(e)}}}const w=document.querySelector(".pianoRollContainer"),g=document.querySelector(".pianoroll-main"),f=document.querySelector(".pianoroll-list"),p=document.querySelector(".exitButton");class x{constructor(t){this.csvURL=t,this.data=null,this.isSelecting=!1,this.selectionEnd=!1,this.selectionStartPosition=null,this.selectionEndPosition=null,this.noteCount=[]}async loadPianoRollData(){try{const t=await fetch("https://pianoroll.ai/random_notes");if(!t.ok)throw new Error(`HTTP error! Status: ${t.status}`);this.data=await t.json()}catch(t){console.error("Error loading data:",t)}}async generateSVGs(){if(this.data||await this.loadPianoRollData(),!!this.data){f.innerHTML="";for(let t=0;t<20;t++){const s=t*60,o=s+60,e=this.data.slice(s,o),{cardDiv:i,svg:l}=this.preparePianoRollCard(t);f.appendChild(i),new L(l,e)}}}preparePianoRollCard(t){const s=document.createElement("div");s.classList.add("piano-roll-card"),s.setAttribute("id",`${t}`);const o=document.createElement("div");o.classList.add("description"),o.textContent=`Piano Roll: ${t}`,s.addEventListener("click",()=>{this.openPianoRoll(t),this.resetSelection()}),s.appendChild(o);const e=document.createElementNS("http://www.w3.org/2000/svg","svg");return e.setAttribute("width","80%"),e.setAttribute("height","150"),e.classList.add("piano-roll-svg"),s.appendChild(e),{cardDiv:s,svg:e}}openPianoRoll(t){const s=Array.from(f.querySelectorAll(".piano-roll-card"));p.classList.remove("hide"),g.innerHTML="",s.forEach(i=>i.classList.remove("active")),f.classList.add("column"),s.find(i=>{if(Number(i.getAttribute("id"))===t){const n=i.cloneNode(!0),r=n.querySelector("svg");r.setAttribute("draggable",!0),r.setAttribute("height",500),g.append(n),i.classList.add("active"),i.scrollIntoView()}}),window.scroll(0,0),g.classList.remove("hide"),w.classList.add("grid");const o=g.querySelector("svg");o.addEventListener("mousedown",i=>{i.preventDefault(),this.startSelection(i,o)}),o.addEventListener("mousemove",i=>this.drawSelection(i,o)),o.addEventListener("mouseup",i=>this.endSelection(i,o));function e(){s.forEach(i=>i.classList.remove("active")),g.classList.add("hide"),g.innerHTML="",w.classList.remove("grid"),f.classList.remove("column"),p.classList.add("hide")}p.addEventListener("click",e)}getMousePosition(t,s){let{clientX:o,clientY:e}=t;const i=s.getBoundingClientRect(),l=Math.max(o-i.left,0),n=Math.max(e-i.top,0);return{x:l,y:n}}startSelection(t,s){if(this.noteCount=[],this.selectionEnd&&this.resetSelection(),this.isSelecting)return;this.isSelecting=!0;const o=this.getMousePosition(t,s);this.selectionStartPosition=o}endSelection(t,s){if(!this.isSelecting)return;this.isSelecting=!1,this.selectionEnd=!0;const o=this.getMousePosition(t,s);this.selectionEndPosition=o,console.log(`Start Position: x: ${this.selectionStartPosition.x}`),console.log(`Start Position: y: ${this.selectionStartPosition.y}`),console.log(`End Position: x: ${this.selectionEndPosition.x}`),console.log(`End Position: y: ${this.selectionEndPosition.y}`),this.noteCount.length>0?console.log(`Selected Notes: ${this.noteCount.length}`):console.log("Selected Notes: 0")}drawSelection(t,s){if(!this.isSelecting)return;let o=document.getElementById("selection");o||(o=document.createElementNS("http://www.w3.org/2000/svg","rect"),o.id="selection",s.appendChild(o));const e=s.getBoundingClientRect(),i=this.getMousePosition(t,s),l=Math.min(this.selectionStartPosition.y,i.y),n=Math.min(this.selectionStartPosition.x,i.x),r=Math.max(this.selectionStartPosition.y,i.y),d=Math.max(this.selectionStartPosition.x,i.x),h=l/e.height,u=n/e.width,m=(r-l)/e.height,b=(d-n)/e.width;o.setAttribute("fill","rgba(4, 4, 4, 0.4)"),o.setAttribute("x",u),o.setAttribute("y",h),o.setAttribute("height",m),o.setAttribute("width",b),this.resetNotesToDefaultColor(),Array.from(s.children).filter(a=>a.classList.contains("note-rectangle")).forEach(a=>{const S=a.x.baseVal.value,y=a.y.baseVal.value,E=a.height.baseVal.value,P=a.width.baseVal.value;if(this.checkIfInSelection(S,y,y+E,S+P,u,h,h+m,u+b)){a.classList.add("selected"),a.setAttribute("fill","rgb(226,132,19)");const A=s.querySelectorAll('[fill*="rgb(226,132,19)"]');this.noteCount=A}})}checkIfInSelection(t,s,o,e,i,l,n,r){if(t<r&&e>i&&s<n&&o>l)return!0}resetSelection(){this.selectionEnd=!1,this.isSelecting=!1,this.resetNotesToDefaultColor();const t=document.getElementById("selection");t&&t.remove(),this.selectionEndPosition=null,this.selectionStartPosition=null}resetNotesToDefaultColor(){const t=Array.from(g.querySelectorAll(".note-rectangle"));t.filter(s=>s.classList.contains("selected")),t.forEach(s=>{s.setAttribute("fill","rgb(46, 46, 43)")})}}document.getElementById("loadCSV").addEventListener("click",async()=>{await new x().generateSVGs()});
