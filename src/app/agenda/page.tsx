import { redirect } from 'next/navigation';

export default function AgendaRedirectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // We can pass along the selected strategy in the URL, although the new SPA handles it differently.
  // This redirect gracefully deprecates the /agenda route.
  if (searchParams.estrategia) {
    redirect(`/dashboard?estrategia=${searchParams.estrategia}`);
  } else {
    redirect('/dashboard');
  }
}
