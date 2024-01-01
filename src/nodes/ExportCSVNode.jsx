import { Handle, Position } from '@xyflow/react';

export default function ExportCSVNode({ id, data }) {
    const filename = data.filename || 'export.csv';

    const download = () => {
        if (!data.table && !Array.isArray(data.values)) return;
        let content = '';
        if (data.table) {
            const { headers, rows } = data.table;
            const esc = (s) => {
                const str = String(s ?? '');
                return /[",\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str;
            };
            content += headers.map(esc).join(',') + '\n';
            for (const r of rows) content += r.map(esc).join(',') + '\n';
        } else if (Array.isArray(data.values)) {
            for (const v of data.values) content += String(v ?? '') + '\n';
        }
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
    };

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 220, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Exportar CSV</div>
            <input type="text" value={filename} onChange={(e) => data.onChange && data.onChange(id, { filename: e.target.value })} style={{ width: '100%', marginBottom: 6 }} />
            <button onClick={download} style={{ width: '100%' }}>Descargar</button>
            <Handle type="target" position={Position.Left} id="in" />
        </div>
    );
}


