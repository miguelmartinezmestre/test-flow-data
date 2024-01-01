import { Handle, Position } from '@xyflow/react';

export default function GroupByNode({ id, data }) {
    const headers = data.availableHeaders || [];
    const key = data.key || '';
    const val = data.value || '';
    const agg = data.agg || 'sum';
    const set = (p) => data.onChange && data.onChange(id, p);

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 280, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Group By</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
                <select value={key} onChange={(e) => set({ key: e.target.value })}>
                    <option value="" disabled>Clave…</option>
                    {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
                <select value={val} onChange={(e) => set({ value: e.target.value })}>
                    <option value="" disabled>Valor…</option>
                    {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 12 }}>Agregación</span>
                <select value={agg} onChange={(e) => set({ agg: e.target.value })}>
                    <option value="sum">Suma</option>
                    <option value="avg">Promedio</option>
                    <option value="min">Mínimo</option>
                    <option value="max">Máximo</option>
                    <option value="count">Conteo</option>
                </select>
            </div>
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


