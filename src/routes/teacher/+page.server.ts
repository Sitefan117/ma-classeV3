import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { addTeacherNote, getTeacherDashboardData } from '$lib/server/activity-results';
import { getTeacherSession, TEACHER_SESSION_COOKIE } from '$lib/server/teacher-auth';

function requireTeacher(cookies: Parameters<PageServerLoad>[0]['cookies']): void {
  const session = getTeacherSession(cookies.get(TEACHER_SESSION_COOKIE));
  if (!session) throw redirect(303, '/teacher/login');
}

export const load: PageServerLoad = ({ cookies }) => {
  requireTeacher(cookies);
  return getTeacherDashboardData();
};

export const actions: Actions = {
  addNote: async ({ cookies, request }) => {
    requireTeacher(cookies);
    const form = await request.formData();
    const body = String(form.get('body') ?? '').trim();
    const studentIdText = String(form.get('studentId') ?? '');
    const world = String(form.get('world') ?? '').trim();
    const studentId = studentIdText ? Number.parseInt(studentIdText, 10) : undefined;

    if (!body) return fail(400, { message: 'La note ne peut pas être vide.' });
    if (studentId !== undefined && !Number.isFinite(studentId)) {
      return fail(400, { message: 'Élève invalide.' });
    }

    addTeacherNote({ studentId, world, body });
    return { message: 'Note ajoutée.' };
  }
};
