import { Handle, Position } from '@xyflow/react';

export default function LimitNode({ id, data }) {
    const count = Number.isFinite(data.count) ? data.count : 10;
    const preview = Array.isArray(data.result)
        ? `[${(data.result || []).slice(0, 5).join(', ')}] (${data.result.length})`
        : '—';

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 200, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Limit/Head</div>
            <input type="number" min={0} value={count} onChange={(e) => data.onChange && data.onChange(id, { count: parseInt(e.target.value || '0', 10) })} />
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>{preview}</div>
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


