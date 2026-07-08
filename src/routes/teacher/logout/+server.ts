import { redirect, type RequestHandler } from '@sveltejs/kit';
import { destroyTeacherSession, TEACHER_SESSION_COOKIE } from '$lib/server/teacher-auth';

export const POST: RequestHandler = ({ cookies }) => {
  destroyTeacherSession(cookies.get(TEACHER_SESSION_COOKIE));
  cookies.delete(TEACHER_SESSION_COOKIE, { path: '/' });
  throw redirect(303, '/');
};
