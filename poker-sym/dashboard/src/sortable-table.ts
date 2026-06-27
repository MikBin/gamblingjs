/**
 * Makes a results table sortable by clicking numeric column headers.
 * Expects th.sortable headers and td[data-value] on sortable columns.
 * Re-sequences the first column (#) after each sort.
 */
export const makeSortable = (table: HTMLTableElement): void => {
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  if (!thead || !tbody) return;

  const headers = [...thead.querySelectorAll('th.sortable')];

  headers.forEach((th, colIndex) => {
    const header = th as HTMLElement;
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const rows = [...tbody.querySelectorAll('tr')];
      const indicator = header.querySelector('.sort-indicator');
      const current = header.dataset.sortDir === 'asc' ? 'asc' : header.dataset.sortDir === 'desc' ? 'desc' : null;
      const nextDir = current === 'desc' ? 'asc' : 'desc';

      headers.forEach((h) => {
        const el = h as HTMLElement;
        el.dataset.sortDir = '';
        const ind = el.querySelector('.sort-indicator');
        if (ind) ind.textContent = ' ↕';
      });

      header.dataset.sortDir = nextDir;
      if (indicator) indicator.textContent = nextDir === 'asc' ? ' ▲' : ' ▼';

      const sortColIndex = colIndex + 1;

      rows.sort((a, b) => {
        const aCell = a.children[sortColIndex] as HTMLElement | undefined;
        const bCell = b.children[sortColIndex] as HTMLElement | undefined;
        const aVal = parseFloat(aCell?.dataset.value ?? aCell?.textContent?.replace('%', '') ?? '0');
        const bVal = parseFloat(bCell?.dataset.value ?? bCell?.textContent?.replace('%', '') ?? '0');
        return nextDir === 'asc' ? aVal - bVal : bVal - aVal;
      });

      rows.forEach((row, i) => {
        const rankCell = row.children[0] as HTMLElement | undefined;
        if (rankCell) {
          rankCell.textContent = String(i + 1);
        }
        tbody.appendChild(row);
      });
    });
  });
};
