import { Handle, Position } from '@xyflow/react';

export default function AggregateNode({ id, data }) {
    const agg = data.agg || 'sum';
    const display = Number.isFinite(data.result) ? String(data.result) : '—';

    const onAggChange = (event) => {
        if (data.onChange) data.onChange(id, { agg: event.target.value });
    };

    return (
        <div style={{ padding: 8, background: '#fff', border: '1px solid #ddd', borderRadius: 6, minWidth: 200, position: 'relative', color: '#000' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, paddingRight: 14 }}>
                <div style={{ fontSize: 12, color: '#000' }}>Agregación</div>
                <select value={agg} onChange={onAggChange}>
                    <option value="sum">Suma</option>
                    <option value="avg">Promedio</option>
                    <option value="min">Mínimo</option>
                    <option value="max">Máximo</option>
                    <option value="count">Conteo</option>
                </select>
            </div>
            <div style={{ fontSize: 12, color: '#000', marginBottom: 4 }}>Resultado</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#000' }}>{display}</div>
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


