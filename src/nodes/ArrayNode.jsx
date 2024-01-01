import { Handle, Position } from '@xyflow/react';

export default function ArrayNode({ id, data }) {
    const text = Array.isArray(data.values) ? data.values.join(', ') : '';

    const onChange = (event) => {
        const raw = event.target.value || '';
        const parts = raw.split(/[,\n\s]+/).filter((p) => p.length > 0);
        const vals = parts.map((p) => parseFloat(p)).filter((n) => Number.isFinite(n));
        if (data.onChange) data.onChange(id, { values: vals });
    };

    const preview = Array.isArray(data.values)
        ? `[${(data.values || []).slice(0, 5).map((v) => (Number.isFinite(v) ? v : '—')).join(', ')}] (${data.values.length})`
        : '—';

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 220, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, color: '#000', marginBottom: 6, paddingRight: 14 }}>Array</div>
            <textarea rows={3} placeholder="1, 2, 3" value={text} onChange={onChange} style={{ width: '100%', resize: 'vertical' }} />
            <div style={{ fontSize: 12, color: '#000', marginTop: 6 }}>Valores</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{preview}</div>
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


