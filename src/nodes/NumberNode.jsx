import { Handle, Position } from '@xyflow/react';

export default function NumberNode({ id, data }) {
    const value = Number.isFinite(data.value) ? data.value : 0;

    const onChange = (event) => {
        const next = parseFloat(event.target.value);
        const safeNext = Number.isFinite(next) ? next : 0;
        if (data.onChange) data.onChange(id, { value: safeNext });
    };

    return (
        <div style={{ padding: 8, background: '#fff', border: '1px solid #ddd', borderRadius: 6, minWidth: 140, color: '#000', position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, color: '#000', marginBottom: 6, paddingRight: 14 }}>Número</div>
            <input
                type="number"
                step="any"
                value={value}
                onChange={onChange}
                style={{ width: '100%' }}
            />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


