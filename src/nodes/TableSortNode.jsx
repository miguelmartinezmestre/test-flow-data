import { Handle, Position } from '@xyflow/react';

export default function TableSortNode({ id, data }) {
    const headers = data.availableHeaders || [];
    const col = data.column || '';
    const dir = data.dir || 'asc';
    const set = (p) => data.onChange && data.onChange(id, p);

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 240, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Ordenar tabla</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <select value={col} onChange={(e) => set({ column: e.target.value })} style={{ flex: 1 }}>
                    <option value="" disabled>{headers.length ? 'Columna…' : 'Conecte tabla'}</option>
                    {headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>
                <select value={dir} onChange={(e) => set({ dir: e.target.value })}>
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


