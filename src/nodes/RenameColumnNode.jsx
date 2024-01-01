import { Handle, Position } from '@xyflow/react';
import { normalizeHeader } from '../utils/csv.js';

export default function RenameColumnNode({ id, data }) {
    const headers = data.availableHeaders || [];
    const mapping = data.mapping || {};

    const setFrom = (from, to) => {
        const next = { ...mapping, [from]: to };
        data.onChange && data.onChange(id, { mapping: next });
    };

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 260, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Renombrar columnas</div>
            <div style={{ display: 'grid', gap: 6 }}>
                {headers.map((h) => (
                    <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 120, fontSize: 12 }}>{h}</div>
                        <input
                            type="text"
                            value={mapping[h] ?? ''}
                            onChange={(e) => setFrom(h, normalizeHeader(e.target.value))}
                            placeholder="nuevo_nombre"
                            style={{ flex: 1 }}
                        />
                    </div>
                ))}
            </div>
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


