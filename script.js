(function(){
  "use strict";

  /* ---------------------------------------------------------
     1. CANVAS IMAGE GENERATION
  --------------------------------------------------------- */
  const W = 1080, H = 1600;

  function makeCanvas(){
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    return c;
  }

  function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  function drawBird(ctx, x, y, scale, color){
    ctx.strokeStyle = color;
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(x - 14*scale, y);
    ctx.quadraticCurveTo(x - 5*scale, y - 10*scale, x, y);
    ctx.quadraticCurveTo(x + 5*scale, y - 10*scale, x + 14*scale, y);
    ctx.stroke();
  }

  function drawTree(ctx, x, baseY, w, h, color){
    roundRect(ctx, x - w/2, baseY - h, w, h, w*0.35);
    ctx.fillStyle = color;
    ctx.fill();
  }

  // ---- Image: Seca (dry / warm tones) ----
  function genSeca(opts){
    const c = makeCanvas();
    const ctx = c.getContext('2d');
    opts = opts || {};
    const skyTop = opts.skyTop || '#3a2410';
    const skyMid = opts.skyMid || '#CD853F';
    const skyHorizon = opts.skyHorizon || '#F2C14E';
    const groundNear = opts.groundNear || '#8B4513';
    const groundFar = opts.groundFar || '#D2691E';
    const treeColor = opts.treeColor || '#2b1a0e';
    const horizonY = H * 0.62;

    // sky
    let g = ctx.createLinearGradient(0,0,0,horizonY);
    g.addColorStop(0, skyTop);
    g.addColorStop(0.55, skyMid);
    g.addColorStop(1, skyHorizon);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,horizonY);

    // sun glow
    let sun = ctx.createRadialGradient(W*0.7, horizonY*0.85, 0, W*0.7, horizonY*0.85, 260);
    sun.addColorStop(0, 'rgba(255,230,150,0.9)');
    sun.addColorStop(1, 'rgba(255,230,150,0)');
    ctx.fillStyle = sun;
    ctx.fillRect(0,0,W,horizonY);

    // ground
    let gg = ctx.createLinearGradient(0,horizonY,0,H);
    gg.addColorStop(0, groundFar);
    gg.addColorStop(1, groundNear);
    ctx.fillStyle = gg;
    ctx.fillRect(0,horizonY,W,H-horizonY);

    // cracked dry texture lines
    ctx.strokeStyle = 'rgba(60,30,10,0.25)';
    ctx.lineWidth = 2;
    for(let i=0;i<14;i++){
      ctx.beginPath();
      const sx = Math.random()*W, sy = horizonY + Math.random()*(H-horizonY);
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (Math.random()-0.5)*120, sy + (Math.random())*80);
      ctx.stroke();
    }

    // trees along horizon
    for(let i=0;i<10;i++){
      const x = (i+0.5) * (W/10) + (Math.random()-0.5)*30;
      const h = 60 + Math.random()*70;
      drawTree(ctx, x, horizonY + 10, 24 + Math.random()*14, h, treeColor);
    }

    // birds
    for(let i=0;i<6;i++){
      drawBird(ctx, 80 + Math.random()*(W-160), 60 + Math.random()*(horizonY*0.5), 1 + Math.random()*0.8, 'rgba(20,10,5,0.8)');
    }

    return c.toDataURL();
  }

  // ---- Image: Cheia (flood / cool tones) ----
  function genCheia(opts){
    const c = makeCanvas();
    const ctx = c.getContext('2d');
    opts = opts || {};
    const skyTop = opts.skyTop || '#0d2630';
    const skyMid = opts.skyMid || '#2d6a7a';
    const skyHorizon = opts.skyHorizon || '#a9d8d4';
    const waterNear = opts.waterNear || '#1a3a4a';
    const waterFar = opts.waterFar || '#4a9a8a';
    const treeColor = opts.treeColor || '#0e2a1c';
    const horizonY = H * 0.58;

    // sky
    let g = ctx.createLinearGradient(0,0,0,horizonY);
    g.addColorStop(0, skyTop);
    g.addColorStop(0.6, skyMid);
    g.addColorStop(1, skyHorizon);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,horizonY);

    // clouds
    for(let i=0;i<8;i++){
      const cx = Math.random()*W, cy = Math.random()*horizonY*0.6, rw = 60+Math.random()*120, rh = 18+Math.random()*22;
      ctx.fillStyle = 'rgba(255,255,255,'+(0.12+Math.random()*0.18).toFixed(2)+')';
      ctx.beginPath();
      ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI*2);
      ctx.fill();
    }

    // water
    let gg = ctx.createLinearGradient(0,horizonY,0,H);
    gg.addColorStop(0, waterFar);
    gg.addColorStop(1, waterNear);
    ctx.fillStyle = gg;
    ctx.fillRect(0,horizonY,W,H-horizonY);

    // ripple lines
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2;
    for(let i=0;i<16;i++){
      const y = horizonY + 20 + i*((H-horizonY-20)/16);
      ctx.beginPath();
      ctx.moveTo(0, y);
      for(let x=0;x<=W;x+=40){
        ctx.lineTo(x, y + Math.sin(x*0.02 + i)*4);
      }
      ctx.stroke();
    }

    // dense trees along horizon
    for(let i=0;i<14;i++){
      const x = (i+0.5) * (W/14) + (Math.random()-0.5)*20;
      const h = 80 + Math.random()*90;
      drawTree(ctx, x, horizonY + 8, 20 + Math.random()*16, h, treeColor);
    }

    // birds
    for(let i=0;i<5;i++){
      drawBird(ctx, 80 + Math.random()*(W-160), 50 + Math.random()*(horizonY*0.45), 1 + Math.random()*0.8, 'rgba(10,20,15,0.75)');
    }

    // capybaras in water
    for(let i=0;i<5;i++){
      const x = 100 + Math.random()*(W-200);
      const y = horizonY + 60 + Math.random()*(H-horizonY-120);
      ctx.fillStyle = 'rgba(101,67,33,0.85)';
      ctx.beginPath();
      ctx.ellipse(x, y, 34, 16, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x-30, y-4, 12, 9, 0, 0, Math.PI*2);
      ctx.fill();
    }

    return c.toDataURL();
  }

  // ---- Image: Cerrado seca (ocher) ----
  function genCerradoSeca(){
    return genSeca({
      skyTop:'#2a1a08', skyMid:'#C98A3E', skyHorizon:'#E8B84B',
      groundNear:'#7a5230', groundFar:'#b9863f',
      treeColor:'#241608'
    });
  }

  // ---- Image: Cerrado chuvas (dark green) ----
  function genCerradoChuvas(){
    return genCheia({
      skyTop:'#0a1f1a', skyMid:'#1f4a3a', skyHorizon:'#8fc2a0',
      waterNear:'#13261c', waterFar:'#2f6b4a',
      treeColor:'#0a1c10'
    });
  }

  const candidates = ORDEM;

  function imageExists(src){
    return new Promise(resolve => {
      const img = new Image();
      img.onload  = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  /* ---------------------------------------------------------
     2. DOM SETUP
  --------------------------------------------------------- */
  const sliderArea = document.getElementById('sliderArea');
  const divider = document.getElementById('divider');
  const handle = document.getElementById('handle');
  const pairIndicator = document.getElementById('pairIndicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let pairs = [];
  let currentIndex = 0;
  let splitPercent = 50;
  let wraps = [];

  function buildPairDom(pair){
    const wrap = document.createElement('div');
    wrap.className = 'pair-wrap';

    const top = document.createElement('div');
    top.className = 'layer layer-top';
    top.style.backgroundImage = "url('" + pair.imgTop + "')";

    const bottom = document.createElement('div');
    bottom.className = 'layer layer-bottom';
    bottom.style.backgroundImage = "url('" + pair.imgBottom + "')";

    wrap.appendChild(top);
    wrap.appendChild(bottom);

    sliderArea.insertBefore(wrap, divider);

    return { wrap, top, bottom };
  }

  let dragging = false;
  let dragStartX = 0;
  let dragStartPercent = 50;
  let idleTimer = null;

  function buildIndicator(){
    pairIndicator.innerHTML = '';
    pairs.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === currentIndex ? ' active' : '');
      pairIndicator.appendChild(dot);
    });
  }

  function applySplit(percent, instant){
    splitPercent = Math.max(0, Math.min(100, percent));
    wraps.forEach(w => {
      w.top.style.clipPath = 'inset(0 0 ' + (100 - splitPercent) + '% 0)';
      w.bottom.style.clipPath = 'inset(' + splitPercent + '% 0 0 0)';
    });
    divider.style.top = splitPercent + '%';
    handle.style.top = splitPercent + '%';
    if(instant){
      [divider, handle].forEach(el => el.style.transition = 'none');
      wraps.forEach(w => { w.top.style.transition='none'; w.bottom.style.transition='none'; });
      requestAnimationFrame(()=>{
        [divider, handle].forEach(el => el.style.transition = '');
        wraps.forEach(w => { w.top.style.transition=''; w.bottom.style.transition=''; });
      });
    }
  }

  function showPair(index){
    wraps.forEach((w, i) => {
      w.wrap.style.zIndex = (i === index) ? 2 : 1;
      w.wrap.classList.toggle('fade-out', i !== index);
    });
    buildIndicator();
  }

  function resetIdleTimer(){
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => applySplit(50), 30000);
  }

  function goTo(index){
    currentIndex = (index + pairs.length) % pairs.length;
    applySplit(50, true);
    showPair(currentIndex);
    resetIdleTimer();
  }

  function startDrag(clientX){ dragging = true; dragStartX = clientX; dragStartPercent = splitPercent; }
  function moveDrag(clientX){
    if(!dragging) return;
    const rect = sliderArea.getBoundingClientRect();
    applySplit(dragStartPercent + ((dragStartX - clientX) / rect.width) * 100);
  }
  function endDrag(){ if(!dragging) return; dragging = false; }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  handle.addEventListener('pointerdown', e => {
    handle.setPointerCapture(e.pointerId);
    sliderArea.classList.add('dragging');
    startDrag(e.clientX);
    e.preventDefault();
  });
  handle.addEventListener('pointermove', e => { moveDrag(e.clientX); });
  handle.addEventListener('pointerup',          () => { sliderArea.classList.remove('dragging'); endDrag(); resetIdleTimer(); });
  handle.addEventListener('pointercancel',       () => { sliderArea.classList.remove('dragging'); endDrag(); resetIdleTimer(); });
  handle.addEventListener('lostpointercapture',  () => { sliderArea.classList.remove('dragging'); endDrag(); resetIdleTimer(); });

  Promise.all(candidates.map(c => imageExists(c.imgTop).then(ok => ok ? c : null)))
    .then(results => {
      pairs = results.filter(Boolean);
      pairs.forEach(p => wraps.push(buildPairDom(p)));
      applySplit(50, true);
      showPair(0);
      resetIdleTimer();
    });

})();
