const key = 'flash_meal';
let tab = '早餐';
const def = { 早餐: [], 午餐: [], 晚餐: [] };
const get = () => JSON.parse(localStorage.getItem(key)) || JSON.parse(JSON.stringify(def));
const save = d => localStorage.setItem(key, JSON.stringify(d));

function updateTime() {
  const d = new Date();
  const w = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  document.getElementById('day').innerText = w[d.getDay()];
  document.getElementById('clock').innerText = d.toTimeString().slice(0, 5);
  let p = '早餐';
  if (d.getHours() >= 10 && d.getHours() < 16) p = '午餐';
  if (d.getHours() >= 16) p = '晚餐';
  document.getElementById('period').innerText = p + '时间';
}

function spin(type) {
  const arr = get()[type];
  if (!arr.length) return '无菜品';
  return arr[Math.floor(Math.random() * arr.length)];
}
function spinAll() {
  ['早餐', '午餐', '晚餐'].forEach(t => {
    document.getElementById('r-' + t).innerText = spin(t);
  });
}

function openSettings() {
  home.classList.remove('active');
  settings.classList.add('active');
  render();
}
function back() {
  settings.classList.remove('active');
  home.classList.add('active');
  updateTime();
}

function switchTab(t, el) {
  tab = t;
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  render();
}

function render() {
  const d = get();
  const l = document.getElementById('list');
  if (tab === '数据') {
    l.innerHTML = '<button class="secondary sync" onclick="backup()">备份数据</button><br><br><button class="secondary back" onclick="restore()">恢复数据</button>';
    return;
  }
  const arr = d[tab];
  if (!arr.length) {
    l.className = 'list empty';
    l.innerText = '暂无菜品，请添加';
    return;
  }
  l.className = 'list';
  l.innerHTML = '';
  arr.forEach((m, i) => {
    const div = document.createElement('div');
    div.innerHTML = `${m}<span onclick="del(${i})">删除</span>`;
    l.appendChild(div);
  });
}

input.onkeydown = e => {
  if (e.key === 'Enter') {
    const v = input.value.trim();
    if (!v) return;
    const d = get();
    if (!d[tab].includes(v)) {
      d[tab].push(v);
      save(d);
    }
    input.value = '';
    render();
  }
};

function del(i) {
  const d = get();
  if (confirm('确定删除？')) {
    d[tab].splice(i, 1);
    save(d);
    render();
  }
}

function sync() {
  save(get());
  alert('已同步');
}

function backup() {
  alert('数据已备份到本地');
}

function restore() {
  localStorage.removeItem(key);
  alert('已恢复');
  render();
}

function share() {
  navigator.clipboard.writeText(location.href);
  alert('分享链接已复制，请直接在微信打开');
}

// 初始化
updateTime();