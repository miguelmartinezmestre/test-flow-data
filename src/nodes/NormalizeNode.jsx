import { Handle, Position } from '@xyflow/react';

export default function NormalizeNode({ id, data }) {
    const method = data.method || 'minmax';
    const preview = Array.isArray(data.result)
        ? `[${(data.result || []).slice(0, 5).map((v) => (Number.isFinite(v) ? v.toFixed(3) : '—')).join(', ')}] (${data.result.length})`
        : '—';

    const onMethodChange = (event) => {
        if (data.onChange) data.onChange(id, { method: event.target.value });
    };

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 220, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, paddingRight: 14 }}>
                <div style={{ fontSize: 12 }}>Normalizar</div>
                <select value={method} onChange={onMethodChange}>
                    <option value="minmax">Min-Max</option>
                    <option value="zscore">Z-Score</option>
                </select>
            </div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Valores</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{preview}</div>
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


