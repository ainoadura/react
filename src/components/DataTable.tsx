interface Column<T> {
  key: keyof T; 
  header: string;
}

// Interfaz de las Props del componente usando el genérico T
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onDelete?: (item: T) => void;
}

// Componente funcional con Genéricos
export const DataTable = <T,>({ data, columns, onDelete  }: DataTableProps<T>) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
              {col.header}
            </th>
          ))}
            {onDelete && <th style={{ borderBottom: '2px solid #ccc' }}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={String(col.key)} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                {String(item[col.key])}
              </td>
            ))}

            {onDelete && (
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                <button onClick={() => onDelete(item)} style={{ backgroundColor: '#b71c1c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
