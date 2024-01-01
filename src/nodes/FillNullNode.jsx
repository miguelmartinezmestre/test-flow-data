import { Handle, Position } from '@xyflow/react';

export default function FillNullNode({ id, data }) {
    const value = data.value ?? '';

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 220, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Rellenar nulos</div>
            <input type="text" value={value} onChange={(e) => data.onChange && data.onChange(id, { value: e.target.value })} placeholder="valor" style={{ width: '100%' }} />
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


