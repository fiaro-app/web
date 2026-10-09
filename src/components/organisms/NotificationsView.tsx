import { ButtonLink } from "@/components/atoms/ButtonLink";
import { StateIcon } from "@/components/atoms/StateIcon";
import { FilterPillLink } from "@/components/atoms/FilterPillLink";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { PaginationNav } from "@/components/molecules/PaginationNav";
import { NotificationList } from "@/components/organisms/NotificationList";
import { NOTIFICATIONS_TEXT } from "@/content/notifications";
import type { NotificationsViewModel } from "@/features/notifications/notifications-view-model";
import { UNREAD_FILTER } from "@/features/notifications/unread-filter";
import { pageHref } from "@/lib/pagination";

export interface NotificationsViewProps {
  readonly notifications: NotificationsViewModel;
}

/** Notificaciones: título, filtro "todas / no leídas" (enlaces `?filtro=`) y la lista. Solo presentación. */
export function NotificationsView({
  notifications,
}: Readonly<NotificationsViewProps>) {
  const { items, total, page, pageSize, unreadOnly } = notifications;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <Text variant="title" as="h1" weight="bold" className="text-foreground">
        {NOTIFICATIONS_TEXT.title}
      </Text>

      <nav
        aria-label={NOTIFICATIONS_TEXT.filters.label}
        className="flex flex-wrap gap-2"
      >
        <FilterPillLink href="/notificaciones" selected={!unreadOnly}>
          {NOTIFICATIONS_TEXT.filters.all}
        </FilterPillLink>
        <FilterPillLink
          href={pageHref("/notificaciones", 1, { filtro: UNREAD_FILTER })}
          selected={unreadOnly}
        >
          {NOTIFICATIONS_TEXT.filters.unread}
        </FilterPillLink>
      </nav>

      {items.length === 0 ? (
        <EmptyState
          icon={<StateIcon name="bell" />}
          {...(unreadOnly
            ? NOTIFICATIONS_TEXT.emptyUnread
            : NOTIFICATIONS_TEXT.empty)}
          action={
            unreadOnly ? (
              <ButtonLink href="/notificaciones" variant="outline">
                {NOTIFICATIONS_TEXT.filters.all}
              </ButtonLink>
            ) : undefined
          }
        />
      ) : (
        <>
          <NotificationList items={items} />
          <PaginationNav
            page={page}
            pages={pages}
            summary={NOTIFICATIONS_TEXT.pagination.summary(page, pages, total)}
            hrefFor={(target) =>
              pageHref("/notificaciones", target, {
                filtro: unreadOnly ? UNREAD_FILTER : undefined,
              })
            }
          />
        </>
      )}
    </>
  );
}
