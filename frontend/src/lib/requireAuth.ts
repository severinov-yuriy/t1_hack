import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function requireAuth() {
  const accessToken = cookies().get('accessToken')?.value;
  if (!accessToken) {
    return redirect('/signin');
  }
  const responseAccess = await fetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      token: accessToken,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!responseAccess.ok) {
    const refreshToken = cookies().get('refreshToken')?.value;
    const responseRefresh = await fetch('/api/refresh', {
      method: 'POST',
      body: JSON.stringify({
        token: refreshToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!responseRefresh.ok) {
      return redirect('/signin');
    }
    const data = await responseRefresh.json();
    cookies().set('accessToken', data.accessToken);
    cookies().set('refreshToken', data.refreshToken, { httpOnly: true });
  }
}
