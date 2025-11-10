console.log('[mgr] manager.js loaded');

const $ = (s, c=document) => c.querySelector(s);
const EMPLOYEES = [
    { id:1, name:'Ava Chen',   role:0, schedule:'0' },
    { id:2, name:'Ben Nguyen', role:0, schedule:'0' },
    { id:3, name:'Maya Torres',role:1, schedule:'0' },
    { id:4, name:'Luis Park',  role:0, schedule:'0' },
    { id:5, name:'Zoe Tran',   role:0, schedule:'0' }
];
const roleLabel = n => Number(n) === 1 ? 'Manager' : 'Employee';

function render(rows){
    const tb = $('#empTable tbody');
    tb.innerHTML = '';
    rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.id}</td><td>${r.name}</td><td>${roleLabel(r.role)}</td><td>${r.schedule}</td>`;
        tb.appendChild(tr);
    });
}

function toCSV(rows){
    const head = ['id','name','role','schedule'];
    const body = rows.map(r => head.map(h => JSON.stringify(r[h] ?? '')).join(','));
    return [head.join(','), ...body].join('\n');
}

let cache = [...EMPLOYEES];
render(cache);

$('#refreshEmp')?.addEventListener('click', () => render(cache));
$('#exportEmp')?.addEventListener('click', () => {
    const blob = new Blob([toCSV(cache)], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'employees.csv';
    a.click();
    URL.revokeObjectURL(url);
});
