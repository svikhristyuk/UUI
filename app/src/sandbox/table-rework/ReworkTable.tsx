import React from "react";
import { Panel } from "@epam/promo";
import * as css from "./ReworkTable.scss";

interface TableRow {
    rowsCount: number;
    minRowWidth: number | string;
    maxRowWidth: number | string;
}

interface TableProps {
    caption: string;
    header: TableRow;
    body: TableRow;
}

const teams = [
    "Boston Red Sox",
    "Milwaukee Brewers",
    "Los Angles Dodgers",
    "New York Mets",
    "St. Louis Cardinals",
    "Houston Astros",
    "Toronto Blue Jays",
    "Philadelphia Phillies",
    "Chicago Cubs",
    "San Diego Padres",
    "San Francisco Cows",
    "Arcansas Coyotes"
];

const BodyItem = ({ count }: { count: number }) => {
    const getBodyCells = () => {
        const bodyItemDataElements = [];
        for (let j = 0; j < count; j++) {
            bodyItemDataElements.push(
                <td key={Math.random() * j * count} className={css.Table__Body__Cell}>
                    {Math.ceil(Math.random() * j * count)}
                </td>
            );
        }
        return bodyItemDataElements;
    }

    return (
        <tr className={css.Table__Body__Row}>
            { ...getBodyCells() }
        </tr>
    );
};

const generateTable = ({
    caption = 'Baseball numbers',
    header,
    body
}: TableProps) => {
    const generateHeader = () => {
        const headerRows = [];

        for (let i = 0; i < header.rowsCount; i++) {
            headerRows.push(<th className={css.Table__Header__Cell}>{teams[i]}</th>);
        };

        return (
            <thead
                className={css.Table__Header}
                style={{
                    '--min-cell-width': header.minRowWidth,
                    '-max-cell-width': header.maxRowWidth,
                } as React.CSSProperties}>
                <tr className={css.Table__Header__Row}>
                    { ...headerRows }
                </tr>
            </thead>
        );
    };

    const generateBody = () => {
        const bodyRows = [];

        for (let i = 0; i < body.rowsCount * 2; i++) {
            bodyRows.push(<BodyItem key={body.rowsCount} count={body.rowsCount} />);
        };

        return (
            <tbody
                className={css.Table__Body}
                style={{
                    '--min-cell-width': header.minRowWidth,
                    '-max-cell-width': header.maxRowWidth,
                } as React.CSSProperties}>
                { ...bodyRows }
            </tbody>
        );
    }

    return {
        caption,
        header: generateHeader(),
        body: generateBody(),
    }
};

export function ReworkTable() {
    const { header, body, caption } = generateTable({
        caption: 'Baseball scores',
        body: { minRowWidth: '200px', maxRowWidth: '1fr', rowsCount: 11 },
        header: { minRowWidth: '200px', maxRowWidth: '1fr', rowsCount: 11 }
    });

    return (
        <Panel
            background="white"
            rawProps={{ role: 'region', tabIndex: 0, "aria-labelledby": 'caption' }}
            cx={css.Wrapper}
            shadow
        >
            <table className={css.Table}>
                <caption className={css.Table__Caption} id='caption'>{caption}</caption>
                { header }
                { body }
            </table>
        </Panel>
    );
}
