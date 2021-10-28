import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { Panel, Text, IconButton } from "@epam/promo";
import { useUuiContext } from "@epam/uui";
import * as UpArrow from '@epam/assets/icons/common/navigation-arrow-up-24.svg';
import * as css from "./ReworkTable.scss";
import { useVirtual } from 'react-virtual';
import type { Product, FeatureClass } from '@epam/uui-docs';
import type { CSSProperties, ReactNode } from 'react';
import type { DataColumnProps, UuiContexts } from "@epam/uui";
import type { TApi } from '../../data';

const TableCell = ({ children, style }: { children : ReactNode, style: CSSProperties }) => (
    <td style={style} className={css.Table__Body__Cell}>
        <Text font='sans' size='36'>{children}</Text>
    </td>
);

export function ReworkTable() {
    const svc = useUuiContext<TApi, UuiContexts>();
    const [products, setProducts] = useState([]);
    const bodyRef = useRef<HTMLTableSectionElement>();

    const { virtualItems, totalSize, scrollToOffset } = useVirtual({
      size: products.length,
      parentRef: bodyRef,
      overscan: 20,
      estimateSize: useCallback(() => 48, []),
    });

    useEffect(() => {
        svc.api.demo.products({}).then(r => r.items).then(setProducts);
    }, []);

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

    const needsTopShadow = bodyRef.current && (bodyRef.current.scrollTop > 0);
    const needsBottomShadow = bodyRef.current && (bodyRef.current.scrollHeight - bodyRef.current.clientHeight > bodyRef.current.scrollTop);
    const needsScrollTopButton = bodyRef.current && (bodyRef.current.scrollTop > bodyRef.current.clientHeight)

    if (!products) return null;

    return (
        <Panel background="white" cx={css.Wrapper} shadow>
            <table className={css.Table}>
                <thead className={css.Table__Header}>
                    <tr className={css.Table__Header__Row}>
                        {productColumns.map(column => (
                            <th
                                key={column.key}
                                className={css.Table__Header__Cell}
                                style={{
                                    '--cell-min-width': column.minWidth ? `${column.minWidth}px` : undefined,
                                    '--cell-width': column.width ? `${column.width}px` : undefined,
                                    '--cell-grow': column.grow,
                                    '--cell-shrink': column.shrink
                                } as CSSProperties}>
                                <Text size='36' font='sans-semibold' color='gray60'>{column.caption}</Text>
                            </th>
                        ))}
                    </tr>
                    <tr aria-hidden className={css.Table__Header__Row}>
                        <td className={css.Table__Header__Row} aria-hidden>
                            <hr
                                style={{ '--scroll-shadow-top': needsTopShadow ? 1 : 0 } as CSSProperties }
                                className='uui-scroll-shadow-top'
                            />
                        </td>
                    </tr>
                </thead>
                <tbody
                    style={{ '--body-height': `${totalSize}px` } as CSSProperties}
                    className={css.Table__Body}
                    ref={bodyRef}
                >
                  {virtualItems.map(({ index, start, size, end }) => (
                    <tr
                        key={index}
                        className={css.Table__Body__Row}
                        style={{
                            '--body-row-height': `${size}px`,
                            '--body-row-offset': `${start}px`
                        } as CSSProperties}>
                        {productCells.map(cell => (
                            <TableCell key={products[index][cell.key as keyof Product] + end} style={ {
                                '--cell-min-width': cell.minWidth ? `${cell.minWidth}px` : undefined,
                                '--cell-width': cell.width ? `${cell.width}px` : undefined,
                                '--cell-grow': cell.grow,
                                '--cell-shrink': cell.shrink,
                            } as CSSProperties}>
                                {products[index][cell.key as keyof Product]}
                            </TableCell>
                        ))}
                    </tr>
                ))}
                </tbody>
                <tfoot className={css.Table__Footer}>
                    <tr className={css.Table__Footer__Row}>
                        <td aria-hidden className={css.Table__Footer__Row}>
                            <hr
                                style={{ '--scroll-shadow-bottom': needsBottomShadow ? 1 : 0 } as CSSProperties}
                                className='uui-scroll-shadow-bottom'
                            />
                        </td>
                        { needsScrollTopButton && (
                            <td aria-hidden className={css.Table__Footer__Row}>
                                <IconButton
                                    icon={UpArrow}
                                    iconPosition='right'
                                    tabIndex={ -1 }
                                    rawProps={{ 'aria-hidden': true }}
                                    onClick={() => scrollToOffset(0, { align: 'start' })}
                                    cx={css.Table__Scroll__Top}
                                />
                            </td>
                        ) }
                    </tr>
                </tfoot>
            </table>
        </Panel>
    );
}
