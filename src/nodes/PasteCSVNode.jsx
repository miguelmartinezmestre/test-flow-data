import { Handle, Position } from '@xyflow/react';
import { parseCsvText } from '../utils/csv.js';

export default function PasteCSVNode({ id, data }) {
    const text = data.text || '';

    const onChange = (event) => {
        const next = event.target.value;
        const table = parseCsvText(next);
        if (data.onChange) data.onChange(id, { text: next, table });
    };

    const headers = (data.table && data.table.headers) || [];
    const rows = (data.table && data.table.rows) || [];
    const sample = rows.slice(0, 3);

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 260, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, color: '#000', marginBottom: 6, paddingRight: 14 }}>Pegar CSV</div>
            <textarea rows={6} placeholder="col1,col2\n1,2" value={text} onChange={onChange} style={{ width: '100%', resize: 'vertical' }} />
            <div style={{ fontSize: 11, marginTop: 6 }}>Columnas: {headers.join(', ')}</div>
            {headers.length > 0 && sample.length > 0 && (
                <div style={{ maxHeight: 120, overflow: 'auto', border: '1px solid #eee', borderRadius: 4, marginTop: 6 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                        <thead>
                            <tr>
                                {headers.map((h) => (
                                    <th key={h} style={{ textAlign: 'left', padding: '4px 6px', borderBottom: '1px solid #eee', color: '#000' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sample.map((r, i) => (
                                <tr key={i}>
                                    {headers.map((_, j) => (
                                        <td key={j} style={{ padding: '4px 6px', borderBottom: '1px solid #f3f3f3', color: '#000' }}>{String(r[j] ?? '')}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Handle type="source" position={Position.Right} id="table" />
        </div>
    );
}


