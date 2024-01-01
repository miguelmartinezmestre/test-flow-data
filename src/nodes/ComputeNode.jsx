import { Handle, Position } from '@xyflow/react';

export default function ComputeNode({ id, data }) {
    const op = data.op || '+';
    const display = Array.isArray(data.result)
        ? `[${(data.result || []).slice(0, 5).map((v) => (Number.isFinite(v) ? v : '—')).join(', ')}]${Array.isArray(data.result) ? ` (${data.result.length})` : ''}`
        : Number.isFinite(data.result)
            ? String(data.result)
            : '—';

    const onOpChange = (event) => {
        if (data.onChange) data.onChange(id, { op: event.target.value });
    };

    return (
        <div style={{ padding: 8, background: '#fff', border: '1px solid #ddd', borderRadius: 6, minWidth: 180, position: 'relative', color: '#000' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 12, color: '#000' }}>Operación</div>
                <select value={op} onChange={onOpChange}>
                    <option value="+">Suma</option>
                    <option value="-">Resta</option>
                    <option value="*">Multiplica</option>
                    <option value="/">Divide</option>
                </select>
            </div>
            <div style={{ fontSize: 12, color: '#000', marginBottom: 4 }}>Resultado</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#000' }}>{display}</div>
            <Handle type="target" position={Position.Left} id="a" style={{ top: 14 }} />
            <Handle type="target" position={Position.Left} id="b" style={{ top: 44 }} />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


