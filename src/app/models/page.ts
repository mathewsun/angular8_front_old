export interface Page<T = any> {
  items: T[],
  itemsCount: number,
  pageNumber: number,
  itemsPerPage: number
}
