import { Handle, Position } from '@xyflow/react';

export default function ColumnNode({ id, data }) {
    const headers = data.availableHeaders || [];
    const selected = data.column || '';
    const display = Array.isArray(data.values)
        ? `[${(data.values || []).slice(0, 5).map((v) => (Number.isFinite(v) ? v : '—')).join(', ')}] (${data.values.length})`
        : '—';

    const onColChange = (event) => {
        if (data.onChange) data.onChange(id, { column: event.target.value });
    };

    return (
        <div style={{ padding: 8, background: '#fff', border: '1px solid #ddd', borderRadius: 6, minWidth: 220, position: 'relative', color: '#000' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, paddingRight: 14 }}>
                <div style={{ fontSize: 12, color: '#000' }}>Columna</div>
                <select value={selected} onChange={onColChange} style={{ flex: 1 }}>
                    <option value="" disabled>{headers.length ? 'Seleccione…' : 'Conecte un CSV'}</option>
                    {headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 11 }}>Locale
                    <select value={data.locale || 'dot'} onChange={(e) => data.onChange && data.onChange(id, { locale: e.target.value })} style={{ marginLeft: 4 }}>
                        <option value="dot">1,234.56</option>
                        <option value="comma">1.234,56</option>
                    </select>
                </label>
            </div>
            <div style={{ fontSize: 12, color: '#000', marginBottom: 4 }}>Valores</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{display}</div>
            <Handle type="target" position={Position.Left} id="csv" style={{ top: 24 }} />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


