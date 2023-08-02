import styles from './Table.module.scss';

export type Column<T> = {
  name: string;
  getColumnValue: (value: T) => React.ReactNode;
}

export type TableProps<T> = {
  columns?: Column<T>[];
  values?: T[];
}

function Table<T>({ columns, values }: TableProps<T>) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns?.map((col) => (
            <th key={col.name}>{col.name}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {values?.map((val) => (
          <tr key={JSON.stringify(val)}>
            {columns?.map((col) => (
              <td key={col.name}>{col.getColumnValue(val)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export { Table };
