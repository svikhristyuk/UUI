import { DataSourceState, IDataSource } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';

export type PersonTableRecord = Person | PersonGroup;

export type PersonTableRecordId = [PersonTableRecord['__typename'], string | number];

// type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: string };
export type PersonTableFilter = { [key: string]: any, groupBy?: string };

export interface ITableFilter {
    title: string;
    id: string;
    field?: string;
    selectionMode: 'single' | 'multi';
    dataSource: IDataSource<any, any, any>;
}

export interface PersonsTableState extends DataSourceState {
    isFolded?: boolean;
}

export type PersonNormalizedTable<TFilter> = {
    [TKey in keyof TFilter]?: { in: TFilter[TKey] }
};