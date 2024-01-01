import { Handle, Position } from '@xyflow/react';

export default function DeduplicateNode({ id, data }) {
    const keys = data.keys || [];
    const onKeysChange = (e) => {
        const parts = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
        data.onChange && data.onChange(id, { keys: parts });
    };

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 260, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Deduplicar</div>
            <input type="text" placeholder="keys separadas por coma" value={keys.join(', ')} onChange={onKeysChange} style={{ width: '100%' }} />
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


