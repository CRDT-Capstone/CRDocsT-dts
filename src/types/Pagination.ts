export type CursorPaginatedResponse<P> = {
    data: P,
    nextCursor: string | undefined,
    hasNext: boolean
}