export default function Sidebar() {
    const items = [
        { type: 'csv', label: 'CSV' },
        { type: 'tableview', label: 'Vista Tabla' },
        { type: 'cleantable', label: 'Limpieza tabla' },
        { type: 'selectcolumns', label: 'Seleccionar columnas' },
        { type: 'renamecolumn', label: 'Renombrar columnas' },
        { type: 'fillnull', label: 'Rellenar nulos' },
        { type: 'dropnull', label: 'Eliminar nulos' },
        { type: 'deduplicate', label: 'Deduplicar' },
        { type: 'column', label: 'Columna' },
        { type: 'number', label: 'Número' },
        { type: 'compute', label: 'Operación' },
        { type: 'filter', label: 'Filtro' },
        { type: 'aggregate', label: 'Agregación' },
        { type: 'array', label: 'Array' },
        { type: 'pastecsv', label: 'Pegar CSV' },
        { type: 'sort', label: 'Ordenar' },
        { type: 'normalize', label: 'Normalizar' },
        { type: 'barchart', label: 'Bar Chart' },
        { type: 'linechart', label: 'Line Chart' },
        { type: 'histogram', label: 'Histograma' },
        { type: 'scatter', label: 'Dispersión' },
        { type: 'distinct', label: 'Distinct' },
        { type: 'limit', label: 'Limit' },
        { type: 'sample', label: 'Sample' },
        { type: 'tablefilter', label: 'Filtro tabla' },
        { type: 'tablesort', label: 'Ordenar tabla' },
        { type: 'groupby', label: 'Group By' },
        { type: 'exportcsv', label: 'Exportar CSV' },
    ];

    const onDragStart = (event, item) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(item));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside style={{ width: 220, borderRight: '1px solid #e5e5e5', background: '#fafafa', padding: 12, boxSizing: 'border-box' }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: '#000' }}>Componentes</div>
            <div style={{ display: 'grid', gap: 8 }}>
                {items.map((item) => (
                    <div
                        key={item.type}
                        draggable
                        onDragStart={(e) => onDragStart(e, item)}
                        style={{ cursor: 'grab', userSelect: 'none', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6, background: '#fff', color: '#000' }}
                        title={`Arrastra para crear un nodo ${item.label}`}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        </aside>
    );
}


