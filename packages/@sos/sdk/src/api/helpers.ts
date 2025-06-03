import type { QueryParams } from '../api';

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_ORDER_DIRECTION = 'desc';

// A normalized version of query params, including computed values like offset and totalPages
type NormalizedQueryParams<F> = Required<QueryParams<F> & { offset: number; totalPages: number }>;

/**
 * Normalizes and validates query parameters for pagination and sorting.
 *
 * @param orderByFields - List of allowed fields to sort by
 * @param overrides - Raw query parameters passed in by the caller
 * @param totalItems - Total number of items available in the dataset
 * @param maxPageSize - Optional upper limit for page size (default: 100)
 * @returns Normalized and safe query parameters
 */
export const getQueryParams = <F>(
  orderByFields: readonly F[],
  overrides: QueryParams<F> = {},
  totalItems: number,
  maxPageSize = MAX_PAGE_SIZE,
): NormalizedQueryParams<F> => {
  const {
    page = DEFAULT_PAGE, // Default to page 1 if not provided
    pageSize = DEFAULT_PAGE_SIZE, // Default to 50 items per page
    orderDirection = DEFAULT_ORDER_DIRECTION, // Default sort direction is descending
    orderBy, // Optional field to sort by
  } = overrides;

  // Clamp pageSize between 1 and maxPageSize to prevent abuse
  const boundedPageSize = Math.max(1, Math.min(pageSize, maxPageSize));

  // Calculate total number of pages available
  const totalPages = Math.ceil(totalItems / boundedPageSize);

  // Clamp page number between 1 and totalPages to stay within bounds
  const safePage = Math.max(1, Math.min(page, totalPages));

  // Calculate the offset for pagination
  const offset = (safePage - 1) * boundedPageSize;

  // Validate orderBy field; fallback to the 'created_at' field
  const validOrderBy = orderBy && orderByFields.includes(orderBy) ? orderBy : ('created_at' as F);

  return {
    page: safePage,
    pageSize: boundedPageSize,
    orderBy: validOrderBy,
    orderDirection,
    offset,
    totalPages,
  };
};
