import { Handle, Position } from '@xyflow/react';

export default function TableFilterNode({ id, data }) {
    const headers = data.availableHeaders || [];
    const col = data.column || '';
    const op = data.op || '>';
    const val = data.value ?? '';

    const set = (partial) => data.onChange && data.onChange(id, partial);

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 260, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Filtro de tabla</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                <select value={col} onChange={(e) => set({ column: e.target.value })} style={{ flex: 1 }}>
                    <option value="" disabled>{headers.length ? 'Columna…' : 'Conecte tabla'}</option>
                    {headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>
                <select value={op} onChange={(e) => set({ op: e.target.value })}>
                    <option value=">">&gt;</option>
                    <option value=">=">&gt;=</option>
                    <option value="<">&lt;</option>
                    <option value="<=">&lt;=</option>
                    <option value="==">==</option>
                    <option value="!=">!=</option>
                    <option value="contains">contains</option>
                </select>
                <input type="text" value={val} onChange={(e) => set({ value: e.target.value })} placeholder="valor" />
            </div>
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


