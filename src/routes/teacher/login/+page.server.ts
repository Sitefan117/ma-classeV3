import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
  createTeacherSession,
  getTeacherSession,
  TEACHER_SESSION_COOKIE,
  TEACHER_SESSION_MAX_AGE_SECONDS
} from '$lib/server/teacher-auth';

export const load: PageServerLoad = ({ cookies }) => {
  const existing = getTeacherSession(cookies.get(TEACHER_SESSION_COOKIE));
  if (existing) throw redirect(303, '/teacher');
  return {};
};

export const actions: Actions = {
  default: async ({ cookies, request, url }) => {
    const form = await request.formData();
    const password = String(form.get('password') ?? '');
    const result = createTeacherSession(password);

    if (!result.ok) {
      return fail(result.reason === 'missing_configuration' ? 503 : 401, {
        message:
          result.reason === 'missing_configuration'
            ? 'Accès enseignant non configuré côté serveur. Configurez TEACHER_PASSWORD_HASH.'
            : 'Mot de passe enseignant incorrect.'
      });
    }

    cookies.set(TEACHER_SESSION_COOKIE, result.sessionId, {
      httpOnly: true,
      sameSite: 'strict',
      secure: url.protocol === 'https:',
      path: '/',
      maxAge: TEACHER_SESSION_MAX_AGE_SECONDS
    });

    throw redirect(303, '/teacher');
  }
};
