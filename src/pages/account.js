import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useAuth } from '@site/src/utils/authState';
import RequireAuth from '@site/src/components/RequireAuth';
import PageContainer from '@site/src/components/layout/PageContainer';
import Section from '@site/src/components/layout/Section';
import CardGrid from '@site/src/components/layout/CardGrid';
import { getCourseProgress, COURSE_EVENT } from '@site/src/utils/progress';
import { getLesson } from '@site/src/course/courseMap';
import { HOMEPAGE_COURSES } from '@site/src/course/courseCatalog';
import { getSupabaseConfigStatus, supabase } from '@site/src/utils/supabaseClient';
import styles from './account.module.css';

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

const COURSE_TABS = [
  { id: 'in_progress', label: 'In progress' },
  { id: 'not_started', label: 'Not started' },
  { id: 'completed', label: 'Completed' },
];

function resolveCourseStatus(completedLessons, totalLessons) {
  if (completedLessons <= 0) return 'not_started';
  if (completedLessons >= totalLessons) return 'completed';
  return 'in_progress';
}

export default function Account() {
  const { siteConfig } = useDocusaurusContext();
  const auth = useAuth();
  const [progressTick, setProgressTick] = useState(0);
  const [activeTab, setActiveTab] = useState('in_progress');
  const [summaryState, setSummaryState] = useState({
    loading: false,
    username: '',
    email: '',
    profileCreatedAt: null,
    lastUsernameChangeAt: null,
    lastEmailChangeAt: null,
  });
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailConfirmChecked, setEmailConfirmChecked] = useState(false);
  const [newEmailDraft, setNewEmailDraft] = useState('');
  const [emailModalSuccess, setEmailModalSuccess] = useState('');
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [nameConfirmChecked, setNameConfirmChecked] = useState(false);
  const [newNameDraft, setNewNameDraft] = useState('');
  const [savingUsername, setSavingUsername] = useState(false);
  const [sendingEmailConfirmation, setSendingEmailConfirmation] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [accountDeletedToast, setAccountDeletedToast] = useState('');
  const [summaryMsg, setSummaryMsg] = useState({ type: '', text: '' });
  const supabaseConfig = getSupabaseConfigStatus();
  const apiBaseUrl = String(siteConfig?.customFields?.API_BASE_URL || '').replace(/\/$/, '');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bump = () => setProgressTick((t) => t + 1);
    const onStorage = (e) => {
      if (!e?.key) return;
      if (e.key.includes('saudilab_') && e.key.includes('progress')) bump();
      if (e.key === 'saudilab_completed_lessons') bump();
    };

    window.addEventListener(COURSE_EVENT, bump);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', bump);

    return () => {
      window.removeEventListener(COURSE_EVENT, bump);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', bump);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      if (!supabase || !supabaseConfig.ok || !auth?.user?.id) return;
      setSummaryState((prev) => ({ ...prev, loading: true }));
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, created_at, last_username_change_at, last_email_change_at')
        .eq('id', auth.user.id)
        .maybeSingle();

      if (!active) return;
      if (error) {
        setSummaryState((prev) => ({ ...prev, loading: false }));
        return;
      }

      const nextUsername = data?.username || auth.profile?.username || auth.user?.user_metadata?.username || '';
      const nextEmail = data?.email || auth.user?.email || '';
      setSummaryState({
        loading: false,
        username: nextUsername,
        email: nextEmail,
        profileCreatedAt: data?.created_at || null,
        lastUsernameChangeAt: data?.last_username_change_at || null,
        lastEmailChangeAt: data?.last_email_change_at || null,
      });
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [auth?.user?.id, auth?.profile?.username, auth?.user?.email, supabaseConfig.ok]);

  const usernameRemainingDays = getRemainingDays(summaryState.lastUsernameChangeAt);
  const emailRemainingDays = getRemainingDays(summaryState.lastEmailChangeAt);
  const currentName = (summaryState.username || '').trim();
  const nextName = newNameDraft.trim();
  const currentEmail = (summaryState.email || auth.user?.email || '').trim();
  const nextEmail = newEmailDraft.trim().toLowerCase();
  const nameValidationError = validateName(nextName);
  const emailValidationError = validateEmail(nextEmail);
  const canSaveUsername = usernameRemainingDays === 0
    && !savingUsername
    && nameConfirmChecked
    && !nameValidationError
    && nextName
    && nextName !== currentName;
  const canSendEmailConfirmation = emailRemainingDays === 0
    && !sendingEmailConfirmation
    && emailConfirmChecked
    && !emailValidationError
    && nextEmail
    && nextEmail !== currentEmail.toLowerCase();
  const memberSince = formatMemberSince(summaryState.profileCreatedAt || auth?.user?.created_at || null);
  const canConfirmDelete = deleteConfirmText.trim() === 'DELETE' && !deletingAccount;

  const onResetPassword = async () => {
    if (sendingReset) return;
    if (!supabase || !supabaseConfig.ok) {
      setSummaryMsg({ type: 'error', text: 'Supabase is not configured.' });
      return;
    }
    if (!auth?.user?.email) {
      setSummaryMsg({ type: 'error', text: 'No email found on your account.' });
      return;
    }

    setSendingReset(true);
    setSummaryMsg({ type: '', text: '' });
    const { error } = await supabase.auth.resetPasswordForEmail(auth.user.email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    setSendingReset(false);

    if (error) {
      setSummaryMsg({ type: 'error', text: error.message || 'Failed to send password reset email.' });
      return;
    }
    setSummaryMsg({ type: 'success', text: 'Password reset email sent.' });
  };

  const onDeleteAccount = async () => {
    if (!canConfirmDelete) return;
    if (!supabase || !supabaseConfig.ok) {
      setSummaryMsg({ type: 'error', text: 'Supabase is not configured.' });
      return;
    }
    if (!apiBaseUrl) {
      setSummaryMsg({ type: 'error', text: 'API base URL is not configured.' });
      return;
    }

    setDeletingAccount(true);
    setSummaryMsg({ type: '', text: '' });

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.access_token) {
        throw new Error('Could not get authenticated session token.');
      }

      const response = await fetch(`${apiBaseUrl}/api/account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || 'Failed to delete account.');
      }

      await supabase.auth.signOut();
      setAccountDeletedToast('Account deleted.');
      window.setTimeout(() => {
        window.location.href = '/';
      }, 800);
    } catch (err) {
      setSummaryMsg({ type: 'error', text: err?.message || 'Failed to delete account.' });
      setDeletingAccount(false);
    }
  };

  const onSaveUsername = async () => {
    if (!canSaveUsername || !auth?.user?.id) return;
    if (!supabase || !supabaseConfig.ok) {
      setSummaryMsg({ type: 'error', text: 'Supabase is not configured.' });
      return;
    }

    setSavingUsername(true);
    setSummaryMsg({ type: '', text: '' });

    const nowIso = new Date().toISOString();
    const trimmed = nextName;
    const { data, error } = await supabase
      .from('profiles')
      .update({
        username: trimmed,
        last_username_change_at: nowIso,
      })
      .eq('id', auth.user.id)
      .select('username, email, last_username_change_at, last_email_change_at')
      .single();

    setSavingUsername(false);
    if (error) {
      setSummaryMsg({ type: 'error', text: error.message || 'Could not update username.' });
      return;
    }

    setSummaryState((prev) => ({
      ...prev,
      username: data?.username || trimmed,
      email: data?.email || prev.email,
      profileCreatedAt: prev.profileCreatedAt,
      lastUsernameChangeAt: data?.last_username_change_at || nowIso,
      lastEmailChangeAt: data?.last_email_change_at || prev.lastEmailChangeAt,
    }));

    if (supabase && supabaseConfig.ok && typeof window !== 'undefined') {
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { display_name: data?.username || trimmed },
      });
      if (metadataError) {
        setSummaryMsg({ type: 'error', text: metadataError.message || 'Name saved, but metadata sync failed.' });
        return;
      }
    }

    setNameModalOpen(false);
    resetNameModalState();
    setSummaryMsg({ type: 'success', text: 'Username updated.' });
    auth.refresh?.();
  };

  const resetNameModalState = () => {
    setNameConfirmChecked(false);
    setNewNameDraft('');
  };

  const openNameModal = () => {
    setNameModalOpen(true);
    resetNameModalState();
  };

  const closeNameModal = () => {
    setNameModalOpen(false);
    resetNameModalState();
  };

  const resetEmailModalState = () => {
    setEmailConfirmChecked(false);
    setNewEmailDraft('');
    setEmailModalSuccess('');
  };

  const openEmailModal = () => {
    setEmailModalOpen(true);
    resetEmailModalState();
  };

  const closeEmailModal = () => {
    setEmailModalOpen(false);
    resetEmailModalState();
  };

  const openDeleteModal = () => {
    setDeleteOpen(true);
    setDeleteConfirmText('');
  };

  const closeDeleteModal = () => {
    if (deletingAccount) return;
    setDeleteOpen(false);
    setDeleteConfirmText('');
  };

  const onSendEmailConfirmation = async () => {
    if (!canSendEmailConfirmation || !auth?.user?.id) return;
    if (!supabase || !supabaseConfig.ok) {
      setSummaryMsg({ type: 'error', text: 'Supabase is not configured.' });
      return;
    }

    setSendingEmailConfirmation(true);
    setSummaryMsg({ type: '', text: '' });
    const { error } = await supabase.auth.updateUser(
      { email: nextEmail },
      { emailRedirectTo: `${window.location.origin}/auth/callback` },
    );
    setSendingEmailConfirmation(false);
    if (error) {
      setSummaryMsg({ type: 'error', text: error.message || 'Could not send email confirmation.' });
      return;
    }

    setEmailModalSuccess(`Confirmation sent to ${nextEmail}. Check your inbox to complete the change.`);
  };

  const availableCourses = useMemo(
    () => HOMEPAGE_COURSES.filter((course) => course.active && course.ctaHref),
    [],
  );

  const courseCards = useMemo(
    () =>
      availableCourses.map((course) => {
        const progress = getCourseProgress(course.courseId);
        const totalLessons = Number(progress.total) || 0;
        const completedLessons = Number(progress.completedCount) || 0;
        const firstLessonPath = getLesson(course.courseId, 'lesson1')?.permalink || `${course.ctaHref}/lesson1`;
        const continuePath = progress.nextLessonId
          ? getLesson(course.courseId, progress.nextLessonId)?.permalink || firstLessonPath
          : firstLessonPath;
        const status = resolveCourseStatus(completedLessons, totalLessons);
        const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        const ctaText = status === 'not_started' ? 'Start' : status === 'completed' ? 'Review' : 'Continue';
        const ctaHref = status === 'not_started' ? firstLessonPath : status === 'completed' ? firstLessonPath : continuePath || firstLessonPath;

        return {
          id: course.courseId,
          title: course.title,
          totalLessons,
          completedLessons,
          status,
          percent,
          ctaHref,
          ctaText,
        };
      }),
    [availableCourses, progressTick],
  );

  const filteredCards = useMemo(
    () => courseCards.filter((course) => course.status === activeTab),
    [courseCards, activeTab],
  );

  return (
    <Layout title="Account">
      <RequireAuth>
        <PageContainer className={styles.pageWrap}>
          <header className={styles.headerBlock}>
            <div className={styles.headerTopRow}>
              <h1 className={styles.pageTitle}>Account Dashboard</h1>
              {auth?.profile?.role === 'admin' ? (
                <Link to="/admin/feedback" className="sl-btn-ghost">
                  Admin: Feedback
                </Link>
              ) : null}
            </div>
            <p className={styles.pageSub}>Account details and course progress in one place.</p>
          </header>

          <Section className={styles.summaryCard}>
            <div className={styles.panelHeader}>
              <h2 className={styles.sectionTitle}>Account Summary</h2>
            </div>
            <div className={styles.panelDivider} aria-hidden="true" />

            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <div className={styles.label}>Username</div>
                <div className={styles.value}>{summaryState.username || auth.profile?.username || auth.user?.user_metadata?.username || '-'}</div>
                <button
                  type="button"
                  className={`sl-btn-ghost ${styles.summaryBtn}`}
                  onClick={openNameModal}
                  disabled={summaryState.loading || savingUsername || usernameRemainingDays > 0}
                  title={usernameRemainingDays > 0 ? `You can change your name again in ${usernameRemainingDays} day(s).` : 'Change name'}
                >
                  Change name
                </button>
                {usernameRemainingDays > 0 ? (
                  <div className={styles.cooldownText}>You can change your name again in {usernameRemainingDays} day(s).</div>
                ) : null}
              </div>

              <div className={styles.summaryItem}>
                <div className={styles.label}>Email</div>
                <div className={styles.value}>{summaryState.email || auth.user?.email || '-'}</div>
                <button
                  type="button"
                  className={`sl-btn-ghost ${styles.summaryBtn}`}
                  onClick={openEmailModal}
                  disabled={summaryState.loading || sendingEmailConfirmation || emailRemainingDays > 0}
                  title={emailRemainingDays > 0 ? `You can change your email again in ${emailRemainingDays} day(s).` : 'Change email'}
                >
                  Change email
                </button>
                {emailRemainingDays > 0 ? (
                  <div className={styles.cooldownText}>You can change your email again in {emailRemainingDays} day(s).</div>
                ) : null}
              </div>
            </div>

            <div className={styles.memberSinceRow}>
              <span className={styles.memberSinceLabel}>Member since:</span>
              <span className={styles.memberSinceValue}>{memberSince || '-'}</span>
            </div>

            <div className={styles.summaryActions}>
              <button
                type="button"
                className={`sl-btn-ghost ${styles.summaryBtn}`}
                onClick={onResetPassword}
                disabled={sendingReset}
              >
                {sendingReset ? 'Sending...' : 'Reset password'}
              </button>
            </div>

            {summaryMsg.text ? (
              <div className={`${styles.message} ${summaryMsg.type === 'error' ? styles.messageError : styles.messageSuccess}`}>
                {summaryMsg.text}
              </div>
            ) : null}
          </Section>

          <ChangeNameModal
            open={nameModalOpen}
            onClose={closeNameModal}
            currentName={currentName || '-'}
            nameConfirmChecked={nameConfirmChecked}
            onToggleConfirm={setNameConfirmChecked}
            newNameDraft={newNameDraft}
            onChangeDraft={setNewNameDraft}
            nameValidationError={nameValidationError}
            canSave={Boolean(canSaveUsername)}
            saving={savingUsername}
            onSave={onSaveUsername}
            remainingDays={usernameRemainingDays}
          />
          <ChangeEmailModal
            open={emailModalOpen}
            onClose={closeEmailModal}
            currentEmail={currentEmail || '-'}
            emailConfirmChecked={emailConfirmChecked}
            onToggleConfirm={setEmailConfirmChecked}
            newEmailDraft={newEmailDraft}
            onChangeDraft={setNewEmailDraft}
            emailValidationError={emailValidationError}
            canSend={Boolean(canSendEmailConfirmation)}
            sending={sendingEmailConfirmation}
            onSend={onSendEmailConfirmation}
            remainingDays={emailRemainingDays}
            successMessage={emailModalSuccess}
          />
          <DeleteAccountModal
            open={deleteOpen}
            onClose={closeDeleteModal}
            confirmText={deleteConfirmText}
            onChangeConfirmText={setDeleteConfirmText}
            onConfirmDelete={onDeleteAccount}
            canConfirmDelete={canConfirmDelete}
            deleting={deletingAccount}
          />
          {accountDeletedToast ? (
            <div className={styles.accountDeletedToast} role="status" aria-live="polite">
              {accountDeletedToast}
            </div>
          ) : null}

          <Section className={styles.coursesSection}>
            <h2 className={styles.sectionTitle}>Courses and Progress</h2>
            <div className={styles.filtersWrap}>
              <div className={styles.courseFilters} role="tablist" aria-label="Course progress filters">
                {COURSE_TABS.map((tab) => {
                  const active = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={`${styles.filterTab} ${active ? styles.filterTabActive : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <p className={styles.filterSummary}>Showing {filteredCards.length} of {courseCards.length} courses</p>
            </div>

            <CardGrid className={styles.coursesGrid} columns="four">
              {filteredCards.map((courseCard) => (
                <CourseCard
                  key={courseCard.id}
                  title={courseCard.title}
                  completedLessons={courseCard.completedLessons}
                  totalLessons={courseCard.totalLessons}
                  percent={courseCard.percent}
                  ctaHref={courseCard.ctaHref}
                  ctaText={courseCard.ctaText}
                />
              ))}
            </CardGrid>
          </Section>

          <Section className={styles.dangerCard}>
            <h2 className={styles.sectionTitle}>Danger Zone</h2>
            <p className={styles.dangerText}>
              Permanently delete your account and profile data. This action cannot be undone.
            </p>
            <button
              type="button"
              className={`sl-btn-ghost ${styles.dangerBtn}`}
              onClick={openDeleteModal}
              disabled={deletingAccount}
            >
              Delete account
            </button>
          </Section>
        </PageContainer>
      </RequireAuth>
    </Layout>
  );
}

function CourseCard({ title, completedLessons, totalLessons, percent, ctaHref, ctaText }) {
  return (
    <div className={styles.courseCard}>
      <div>
        <div className={styles.courseTitleClamp}>{title}</div>
        <div className={styles.courseSubtitle}>{completedLessons} / {totalLessons} lessons</div>
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <div className={styles.progressFill} style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
      </div>

      <div className={styles.cardActions}>
        <Link to={ctaHref} className={`${styles.cardBtn} sl-btn-primary`}>
          {ctaText}
        </Link>
      </div>
    </div>
  );
}

function getRemainingDays(lastChangeAt) {
  if (!lastChangeAt) return 0;
  const stamp = new Date(lastChangeAt).getTime();
  if (!Number.isFinite(stamp)) return 0;
  const remainingMs = FIVE_DAYS_MS - (Date.now() - stamp);
  if (remainingMs <= 0) return 0;
  return Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
}

function formatMemberSince(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function validateName(value) {
  if (!value) return '';
  if (value.length < 2) return 'Name must be at least 2 characters.';
  if (value.length > 30) return 'Name must be 30 characters or less.';
  if (!/^[A-Za-z0-9_ ]+$/.test(value)) return 'Use letters, numbers, spaces, or underscore only.';
  return '';
}

function validateEmail(value) {
  if (!value) return '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
  return '';
}

function ChangeNameModal({
  open,
  onClose,
  currentName,
  nameConfirmChecked,
  onToggleConfirm,
  newNameDraft,
  onChangeDraft,
  nameValidationError,
  canSave,
  saving,
  onSave,
  remainingDays,
}) {
  if (!open) return null;

  return (
    <div className="sl-modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="sl-change-name-title">
      <div className={`sl-modal ${styles.nameModal}`}>
        <div className="sl-modalHead">
          <div>
            <h2 id="sl-change-name-title" className="sl-modalTitle">Change name</h2>
            <p className={`${styles.modalHelp} sl-modalMsg`}>You can change your name once every 5 days.</p>
          </div>
          <button type="button" className="sl-modalX" onClick={onClose} aria-label="Close change name modal">x</button>
        </div>

        <label className={styles.modalLabel} htmlFor="sl-current-name">Current name</label>
        <input id="sl-current-name" className={styles.summaryInput} value={currentName} disabled />

        <label className={styles.modalCheck}>
          <input
            type="checkbox"
            checked={nameConfirmChecked}
            onChange={(e) => onToggleConfirm(e.target.checked)}
          />
          <span>I understand and want to change my name</span>
        </label>

        {nameConfirmChecked ? (
          <>
            <label className={styles.modalLabel} htmlFor="sl-new-name">New name</label>
            <input
              id="sl-new-name"
              className={styles.summaryInput}
              value={newNameDraft}
              onChange={(e) => onChangeDraft(e.target.value)}
              placeholder="Enter new name"
              disabled={saving}
            />
            {nameValidationError ? <div className={styles.modalError}>{nameValidationError}</div> : null}
          </>
        ) : null}

        {remainingDays > 0 ? (
          <div className={styles.cooldownText}>You can change your name again in {remainingDays} day(s).</div>
        ) : null}

        <div className={styles.modalActions}>
          <button type="button" className={`sl-btn-ghost ${styles.modalBtn}`} onClick={onClose} disabled={saving}>Cancel</button>
          <button type="button" className={`sl-btn-primary ${styles.modalBtn}`} onClick={onSave} disabled={!canSave || saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChangeEmailModal({
  open,
  onClose,
  currentEmail,
  emailConfirmChecked,
  onToggleConfirm,
  newEmailDraft,
  onChangeDraft,
  emailValidationError,
  canSend,
  sending,
  onSend,
  remainingDays,
  successMessage,
}) {
  if (!open) return null;

  const disableInputs = Boolean(successMessage) || sending;

  return (
    <div className="sl-modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="sl-change-email-title">
      <div className={`sl-modal ${styles.nameModal}`}>
        <div className="sl-modalHead">
          <div>
            <h2 id="sl-change-email-title" className="sl-modalTitle">Change email</h2>
            <p className={`${styles.modalHelp} sl-modalMsg`}>
              You&apos;ll need to confirm the new email address before the change takes effect.
            </p>
          </div>
          <button type="button" className="sl-modalX" onClick={onClose} aria-label="Close change email modal">x</button>
        </div>

        <label className={styles.modalLabel} htmlFor="sl-current-email">Current email</label>
        <input id="sl-current-email" className={styles.summaryInput} value={currentEmail} disabled />

        <label className={styles.modalCheck}>
          <input
            type="checkbox"
            checked={emailConfirmChecked}
            onChange={(e) => onToggleConfirm(e.target.checked)}
            disabled={disableInputs}
          />
          <span>I understand I must confirm the new email</span>
        </label>

        {emailConfirmChecked ? (
          <>
            <label className={styles.modalLabel} htmlFor="sl-new-email">New email</label>
            <input
              id="sl-new-email"
              className={styles.summaryInput}
              value={newEmailDraft}
              onChange={(e) => onChangeDraft(e.target.value)}
              placeholder="Enter new email"
              type="email"
              disabled={disableInputs}
            />
            {emailValidationError ? <div className={styles.modalError}>{emailValidationError}</div> : null}
          </>
        ) : null}

        {remainingDays > 0 ? (
          <div className={styles.cooldownText}>You can change your email again in {remainingDays} day(s).</div>
        ) : null}
        {successMessage ? <div className={styles.messageSuccess}>{successMessage}</div> : null}

        <div className={styles.modalActions}>
          <button type="button" className={`sl-btn-ghost ${styles.modalBtn}`} onClick={onClose} disabled={sending}>Cancel</button>
          <button type="button" className={`sl-btn-primary ${styles.modalBtn}`} onClick={onSend} disabled={!canSend || disableInputs}>
            {sending ? 'Sending...' : 'Send confirmation'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteAccountModal({
  open,
  onClose,
  confirmText,
  onChangeConfirmText,
  onConfirmDelete,
  canConfirmDelete,
  deleting,
}) {
  if (!open) return null;

  return (
    <div className="sl-modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="sl-delete-account-title">
      <div className={`sl-modal ${styles.nameModal}`}>
        <div className="sl-modalHead">
          <div>
            <h2 id="sl-delete-account-title" className="sl-modalTitle">Delete your account?</h2>
            <p className={`${styles.modalHelp} sl-modalMsg`}>
              This will permanently delete your account and your profile data. This cannot be undone.
            </p>
          </div>
          <button type="button" className="sl-modalX" onClick={onClose} aria-label="Close delete account modal" disabled={deleting}>
            x
          </button>
        </div>

        <label className={styles.modalLabel} htmlFor="sl-delete-confirm">Type DELETE to confirm</label>
        <input
          id="sl-delete-confirm"
          className={styles.summaryInput}
          value={confirmText}
          onChange={(e) => onChangeConfirmText(e.target.value)}
          placeholder="DELETE"
          disabled={deleting}
        />

        <div className={styles.modalActions}>
          <button type="button" className={`sl-btn-ghost ${styles.modalBtn}`} onClick={onClose} disabled={deleting}>Cancel</button>
          <button
            type="button"
            className={`sl-btn-ghost ${styles.modalBtn} ${styles.modalDeleteBtn}`}
            onClick={onConfirmDelete}
            disabled={!canConfirmDelete || deleting}
          >
            {deleting ? 'Deleting...' : 'Delete account'}
          </button>
        </div>
      </div>
    </div>
  );
}
