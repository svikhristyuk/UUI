import React, { CSSProperties, ReactNode, useMemo, useState } from "react";
import { DataColumnProps } from "@epam/uui";
import { Panel, Text } from "@epam/promo";
import * as css from "./ReworkTable.scss";
import type { Product, FeatureClass } from '@epam/uui-docs';
import { demoData } from './data';

const TableCell = ({ children, style }: { children : ReactNode, style: CSSProperties }) => (
    <td style={style} className={css.Table__Body__Cell}>
        <Text font='sans' size='36'>{children}</Text>
    </td>
);

export function ReworkTable() {
    const [products] = useState<Product[]>(demoData as Product[]);
    const [tableShadows, setTableShadows] = useState({ top: false, bottom: false });

    const updateScroll = (e: React.UIEvent<HTMLTableSectionElement, UIEvent>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (!tableShadows.top && scrollTop > 0) setTableShadows({ ...tableShadows, top: true });
        else if (tableShadows.top && scrollTop === 0) setTableShadows({ ...tableShadows, top: true });

        const needsBottomShadow = scrollHeight - clientHeight > scrollTop;

        if (!tableShadows.bottom && needsBottomShadow) setTableShadows({ ...tableShadows, bottom: true });
        else if (tableShadows.bottom && !needsBottomShadow) setTableShadows({ ...tableShadows, bottom: false });
    };

    const productColumns: DataColumnProps<FeatureClass>[] = useMemo(() => [
        {
            key: 'id',
            caption: 'Id',
            width: 100,
            grow: 0,
            shrink: 0,
        }, {
            key: 'name',
            caption: 'Name',
            grow: 1,
            minWidth: 300,
        },
        {
            key: 'productNumber',
            caption: 'Product Number',
            grow: 1,
            shrink: 0,
            width: 300,
        },
        {
            key: 'color',
            caption: 'Color',
            grow: 0,
            shrink: 0,
            width: 156,
        },
    ], []);

    const productCells = useMemo(() => [
        {
            key: 'ProductID',
            grow: 0,
            shrink: 0,
            width: 100
        },
        {
            key: 'Name',
            grow: 1,
            minWidth: 300,
        },
        {
            key: 'ProductNumber',
            grow: 1,
            shrink: 0,
            width: 300,
        },
        {
            key: 'Color',
            grow: 0,
            shrink: 0,
            width: 156,
        },
    ], []);

    return (
        <Panel background="white" cx={css.Wrapper} shadow>
            <table className={css.Table}>
                <thead className={css.Table__Header}>
                    <tr className={css.Table__Header__Row}>
                        { productColumns.map(column => (
                            <th key={column.key} className={css.Table__Header__Cell} style={{
                                '--cell-min-width': column.minWidth ? `${column.minWidth}px` : undefined,
                                '--cell-width': column.width ? `${column.width}px` : undefined,
                                '--cell-grow': column.grow,
                                '--cell-shrink': column.shrink
                            } as CSSProperties}>
                                <Text size='36' font='sans-semibold' color='gray60'>{column.caption}</Text>
                            </th>
                        ))}
                    </tr>
                    <div style={{ opacity: tableShadows.top ? 1 : 0 }} className='uui-scroll-shadow-top' />
                </thead>
                <tbody className={css.Table__Body} onScroll={updateScroll}>
                    {products.map(product => (
                        <tr key={product.ModifiedDate.concat(product.Class).concat(String(product.ProductID))} className={css.Table__Body__Row}>
                            {productCells.map(cell => (
                                <TableCell style={ {
                                    '--cell-min-width': cell.minWidth ? `${cell.minWidth}px` : undefined,
                                    '--cell-width': cell.width ? `${cell.width}px` : undefined,
                                    '--cell-grow': cell.grow,
                                    '--cell-shrink': cell.shrink
                                } as CSSProperties}>
                                    {product[cell.key as keyof Product]}
                                </TableCell>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <div style={{ opacity: tableShadows.bottom ? 1 : 0 }} className='uui-scroll-shadow-bottom' />
            </table>
        </Panel>
    );
}
