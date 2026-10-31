"use client";

import type { ReactNode } from "react";
import { Pagination, Table } from "antd";
import type { TableProps } from "antd";
import type { BaseRecord } from "@refinedev/core";

export type ResponsiveColumn<T extends object> = {
  key: string;
  title: string;
  dataIndex?: keyof T & string;
  width?: number;
  /** Shown as card title on mobile (first `primary` wins). */
  primary?: boolean;
  /** Shown under title on mobile (first `secondary` wins). */
  secondary?: boolean;
  /** Hidden in mobile card body rows. */
  mobileHidden?: boolean;
  render?: (value: unknown, record: T, index: number) => ReactNode;
};

type ResponsiveTableProps<T extends object> = {
  tableProps: TableProps<BaseRecord>;
  columns: ResponsiveColumn<T>[];
  rowKey: keyof T & string;
  onRowClick?: (record: T) => void;
  /** Extra content at bottom of each mobile card (e.g. inline controls). */
  mobileActions?: (record: T) => ReactNode;
  /** Expandable section on mobile (e.g. nested variants). */
  mobileExpand?: (record: T) => ReactNode;
  className?: string;
};

function cellValue<T extends object>(col: ResponsiveColumn<T>, record: T, index: number) {
  const raw = col.dataIndex ? (record[col.dataIndex] as unknown) : undefined;
  return col.render ? col.render(raw, record, index) : (raw as ReactNode);
}

export function ResponsiveTable<T extends object>({
  tableProps,
  columns,
  rowKey,
  onRowClick,
  mobileActions,
  mobileExpand,
  className,
}: ResponsiveTableProps<T>) {
  const data = (tableProps.dataSource ?? []) as T[];
  const primaryCol = columns.find((c) => c.primary) ?? columns[0];
  const secondaryCol = columns.find((c) => c.secondary);

  const antColumns = columns.map((c) => ({
    key: c.key,
    title: c.title,
    dataIndex: c.dataIndex,
    width: c.width,
    render: c.render
      ? (value: unknown, record: BaseRecord, index: number) =>
          c.render!(value, record as T, index)
      : undefined,
  }));

  const pagination = tableProps.pagination;
  const pagProps =
    pagination && typeof pagination === "object"
      ? pagination
      : pagination === false
        ? null
        : {};

  return (
    <>
      <Table<BaseRecord>
        {...tableProps}
        className={`admin-desktop-table-only ${className ?? ""}`.trim()}
        rowKey={rowKey}
        columns={antColumns}
        onRow={
          onRowClick
            ? (record) => ({
                onClick: () => onRowClick(record as T),
                style: { cursor: "pointer" },
              })
            : tableProps.onRow
        }
      />

      <div className="admin-mobile-card-list">
        {data.map((record, index) => {
          const id = String(record[rowKey]);
          const bodyCols = columns.filter(
            (c) =>
              c.key !== primaryCol?.key &&
              c.key !== secondaryCol?.key &&
              !c.mobileHidden,
          );
          return (
            <div
              key={id}
              className="admin-mobile-card"
              role={onRowClick ? "button" : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(record) : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(record);
                      }
                    }
                  : undefined
              }
            >
              <div className="admin-mobile-card-title">
                {primaryCol ? cellValue(primaryCol, record, index) : id}
              </div>
              {secondaryCol ? (
                <div className="admin-mobile-card-meta">
                  {cellValue(secondaryCol, record, index)}
                </div>
              ) : null}
              {bodyCols.length > 0 ? (
                <div className="admin-mobile-card-rows">
                  {bodyCols.map((col) => (
                    <div key={col.key} className="admin-mobile-card-row">
                      <span className="admin-mobile-card-row-label">{col.title}</span>
                      <span className="text-right">{cellValue(col, record, index)}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              {mobileExpand ? <div className="mt-3">{mobileExpand(record)}</div> : null}
              {mobileActions ? (
                <div
                  className="admin-mobile-card-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  {mobileActions(record)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {pagProps && (pagProps as { total?: number }).total !== undefined ? (
        <div className="admin-mobile-pagination mt-4 flex justify-center lg:hidden">
          <Pagination
            size="small"
            current={(pagProps as { current?: number }).current}
            pageSize={(pagProps as { pageSize?: number }).pageSize}
            total={(pagProps as { total?: number }).total}
            onChange={(page, pageSize) => {
              const onChange = (pagProps as { onChange?: (p: number, ps: number) => void })
                .onChange;
              onChange?.(page, pageSize);
            }}
            showSizeChanger={false}
          />
        </div>
      ) : null}
    </>
  );
}
