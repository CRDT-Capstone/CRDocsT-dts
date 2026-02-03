export type CursorPaginatedResponse<P> = {
    data: P,
    nextCursor: string,
    hasNext: boolean
}