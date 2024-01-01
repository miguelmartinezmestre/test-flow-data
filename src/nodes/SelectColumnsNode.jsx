import { Handle, Position } from '@xyflow/react';

export default function SelectColumnsNode({ id, data }) {
    const headers = data.availableHeaders || [];
    const selected = Array.isArray(data.keep) ? data.keep : [];

    const toggle = (h) => {
        const set = new Set(selected);
        if (set.has(h)) set.delete(h); else set.add(h);
        data.onChange && data.onChange(id, { keep: Array.from(set) });
    };

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 220, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Seleccionar columnas</div>
            <div style={{ display: 'grid', gap: 4, maxHeight: 140, overflow: 'auto', border: '1px solid #eee', padding: 6, borderRadius: 4 }}>
                {headers.map((h) => (
                    <label key={h} style={{ fontSize: 12 }}>
                        <input type="checkbox" checked={selected.includes(h)} onChange={() => toggle(h)} style={{ marginRight: 6 }} />{h}
                    </label>
                ))}
            </div>
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


