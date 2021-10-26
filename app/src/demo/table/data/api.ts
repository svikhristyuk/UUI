import { LazyDataSourceApi, normalizeDataQueryFilter } from "@epam/uui";
import { svc } from "../../../services";
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId, PersonNormalizedTable } from "../types";

const mapFilter = <TFilter extends PersonTableFilter>(filter: TFilter) => {
    return Object.keys(filter).reduce<PersonNormalizedTable<TFilter>>((acc, key) => ({
        ...acc,
        [key]: normalizeDataQueryFilter({ in: filter[key] })
    }), {});
};

export const api: LazyDataSourceApi<PersonTableRecord, PersonTableRecordId, PersonTableFilter> = (request, ctx) => {
    const { ids: clientIds, filter: { groupBy, ...filter }, ...rq } = request;
    const ids = clientIds?.map(clientId => Number(clientId[1]));

    if (groupBy && !ctx.parent) {
        return svc.api.demo.personGroups({
            ...rq,
            filter: { groupBy },
            search: null,
            itemsRequest: { filter, search: rq.search },
            ids,
        });
    } else {
        const parentFilter = ctx.parent && { [groupBy + 'Id']: ctx.parent.id };
        const mappedFilter = mapFilter(filter);
        return svc.api.demo.persons({ ...rq, filter: { ...mappedFilter, ...parentFilter }, ids });
    }
};