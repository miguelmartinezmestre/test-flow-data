import { Handle, Position } from '@xyflow/react';

export default function SortNode({ id, data }) {
    const dir = data.dir || 'asc';
    const preview = Array.isArray(data.result)
        ? `[${(data.result || []).slice(0, 5).map((v) => (Number.isFinite(v) ? v : '—')).join(', ')}] (${data.result.length})`
        : '—';

    const onDirChange = (event) => {
        if (data.onChange) data.onChange(id, { dir: event.target.value });
    };

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 200, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, paddingRight: 14 }}>
                <div style={{ fontSize: 12 }}>Ordenar</div>
                <select value={dir} onChange={onDirChange}>
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Valores</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{preview}</div>
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


