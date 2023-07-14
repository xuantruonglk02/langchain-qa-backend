import { OrderDirection } from './constants';

export interface ICommonListQuery {
    page?: number;
    limit?: number;
    keyword?: string;
    orderBy?: string;
    orderDirection?: OrderDirection;
}
