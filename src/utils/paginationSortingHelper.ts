type PaginationSortingResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
};

type QueryType = {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
};

const paginationSortingHelper = (query: QueryType): PaginationSortingResult => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    return { page, limit, skip, sortBy, sortOrder };
};

export default paginationSortingHelper;
