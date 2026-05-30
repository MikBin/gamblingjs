/**
 * Makes all `<th class="sortable">` columns in a table clickable for sorting.
 *
 * Expects `<td data-value="X">` attributes for numeric sort values.
 * Re-sequences the first column (rank `#`) after sorting.
 */
export function makeSortable(table: HTMLTableElement): void {
  const headers = table.querySelectorAll('thead th.sortable');
  let currentSort: { colIndex: number; dir: 'asc' | 'desc' } | null = null;

  headers.forEach((th, colIndex) => {
    th.addEventListener('click', () => {
      const dir: 'asc' | 'desc' =
        currentSort?.colIndex === colIndex && currentSort.dir === 'desc' ? 'asc' : 'desc';
      currentSort = { colIndex, dir };

      // Update header indicators
      headers.forEach((h, i) => {
        const span = h.querySelector('.sort-indicator');
        if (i === colIndex) {
          h.classList.add('sort-active');
          if (span) span.textContent = dir === 'desc' ? ' ▼' : ' ▲';
        } else {
          h.classList.remove('sort-active');
          if (span) span.textContent = ' ↕';
        }
      });

      const tbody = table.querySelector('tbody')!;
      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.sort((a, b) => {
        const aCell = a.querySelectorAll('td')[colIndex] as HTMLTableCellElement | undefined;
        const bCell = b.querySelectorAll('td')[colIndex] as HTMLTableCellElement | undefined;
        const aVal = aCell ? parseFloat(aCell.dataset.value ?? '') : NaN;
        const bVal = bCell ? parseFloat(bCell.dataset.value ?? '') : NaN;

        // NaN values (e.g. "—" cells with no data-value) always sort to the bottom
        const aNaN = isNaN(aVal);
        const bNaN = isNaN(bVal);
        if (aNaN && bNaN) return 0;
        if (aNaN) return 1;
        if (bNaN) return -1;

        return dir === 'desc' ? bVal - aVal : aVal - bVal;
      });

      // Re-attach sorted rows and re-sequence rank column
      rows.forEach((row, index) => {
        tbody.appendChild(row);
        const rankCell = row.querySelector('td') as HTMLTableCellElement;
        if (rankCell) rankCell.textContent = String(index + 1);
      });
    });
  });
}