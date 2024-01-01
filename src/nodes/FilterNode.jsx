import { Handle, Position } from '@xyflow/react';

export default function FilterNode({ id, data }) {
    const op = data.op || '>';
    const threshold = Number.isFinite(data.threshold) ? data.threshold : 0;
    const display = Array.isArray(data.result)
        ? `[${(data.result || []).slice(0, 5).map((v) => (Number.isFinite(v) ? v : '—')).join(', ')}] (${data.result.length})`
        : '—';

    const onOpChange = (event) => {
        if (data.onChange) data.onChange(id, { op: event.target.value });
    };
    const onThresholdChange = (event) => {
        const next = parseFloat(event.target.value);
        const safeNext = Number.isFinite(next) ? next : 0;
        if (data.onChange) data.onChange(id, { threshold: safeNext });
    };

    return (
        <div style={{ padding: 8, background: '#fff', border: '1px solid #ddd', borderRadius: 6, minWidth: 240, position: 'relative', color: '#000' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, paddingRight: 14 }}>
                <div style={{ fontSize: 12, color: '#000' }}>Filtro</div>
                <select value={op} onChange={onOpChange}>
                    <option value=">">&gt;</option>
                    <option value=">=">&gt;=</option>
                    <option value="<">&lt;</option>
                    <option value="<=">&lt;=</option>
                    <option value="==">==</option>
                    <option value="!=">!=</option>
                </select>
                <input type="number" step="any" value={threshold} onChange={onThresholdChange} style={{ width: 100 }} />
            </div>
            <div style={{ fontSize: 12, color: '#000', marginBottom: 4 }}>Valores</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{display}</div>
            <Handle type="target" position={Position.Left} id="in" style={{ top: 24 }} />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


