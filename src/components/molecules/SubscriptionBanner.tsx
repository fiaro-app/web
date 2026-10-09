import { Link } from '@/components/atoms/Link';
import { Alert } from '@/components/molecules/Alert';
import { SUBSCRIPTION_TEXT } from '@/content/subscription';
import type { SubscriptionNotice } from '@/features/subscription/subscription-view-model';

/** Aviso del plan arriba del panel (prueba por terminar, en gracia o en solo lectura), con el atajo a ventas. Solo presentación. */
export function SubscriptionBanner({ notice }: Readonly<{ notice: SubscriptionNotice }>) {
  const text = SUBSCRIPTION_TEXT.banner;

  return (
    <Alert tone={notice.tone} className="flex flex-wrap items-center justify-between gap-3">
      <span>{notice.message}</span>
      <Link href={text.actionHref} className="font-semibold underline">
        {text.action}
      </Link>
    </Alert>
  );
}
