import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';
import PayPalButtonPlaceholder from '@site/src/components/PayPalButtonPlaceholder';

export default function Checkout() {
  const auth = useAuth();
  const [msg, setMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cardMsg, setCardMsg] = useState('');

  useEffect(() => {
    if (!auth || auth.loading) return;
    if (!auth.isLoggedIn) window.location.href = '/login';
  }, [auth]);

  const openPaymentMethodPicker = () => {
    setMsg('');
    setCardMsg('');
    setSelectedMethod('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMethod('');
    setCardMsg('');
  };

  const selectCard = () => {
    setSelectedMethod('card');
    setCardMsg('Card checkout coming soon');
  };

  return (
    <Layout title="Subscribe">
      <div style={wrap}>
        <div style={card}>
          <div style={headerRow}>
            <div>
              <div style={kicker}>Subscribe</div>
              <h1 style={title}>SaudiLab Pro</h1>
              <p style={sub}>Unlock all lessons and upcoming premium content.</p>
            </div>

            <div style={priceBox}>
              <div style={price}>19 SAR</div>
              <div style={per}>/ month</div>
            </div>
          </div>

          <div style={divider} />

          <div style={summaryCard}>
            <div style={summaryTitle}>Plan Summary</div>
            <ul style={list}>
              <li style={li}>Full access to HTML course</li>
              <li style={li}>Full access to CSS course</li>
              <li style={li}>Full access to JavaScript course (coming soon)</li>
            </ul>
          </div>

          <button onClick={openPaymentMethodPicker} style={cta}>
            Subscribe
          </button>

          <div style={microcopyWrap}>
            <span style={hint}>Secure checkout (placeholder)</span>
            <span style={hint}>Payment provider (placeholder)</span>
            <span style={hint}>Cancel anytime</span>
          </div>

          {msg ? <div style={error}>{msg}</div> : null}

          <div style={footerRow}>
            <Link to="/account" style={backLink}>
              Back to Account
            </Link>
          </div>
        </div>
      </div>
      {modalOpen ? (
        <div style={overlay} onClick={closeModal} role="presentation">
          <div style={modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div style={modalHeader}>
              <h2 style={modalTitle}>Choose a payment method</h2>
              <button type="button" onClick={closeModal} style={closeBtn} aria-label="Close payment method picker">
                X
              </button>
            </div>

            <div style={methodGrid}>
              <button
                type="button"
                style={{ ...methodBtn, ...(selectedMethod === 'paypal' ? methodBtnActive : null) }}
                onClick={() => {
                  setSelectedMethod('paypal');
                  setCardMsg('');
                }}
              >
                PayPal
              </button>
              <button
                type="button"
                style={{ ...methodBtn, ...(selectedMethod === 'card' ? methodBtnActive : null) }}
                onClick={selectCard}
              >
                Card
              </button>
            </div>

            {selectedMethod === 'paypal' ? <PayPalButtonPlaceholder /> : null}
            {selectedMethod === 'card' && cardMsg ? <p style={modalMsg}>{cardMsg}</p> : null}
            {!selectedMethod ? <p style={modalHint}>Select a method to continue.</p> : null}
            {msg ? <p style={error}>{msg}</p> : null}
          </div>
        </div>
      ) : null}
    </Layout>
  );
}

const wrap = {
  padding: '3.2rem 1.2rem',
  maxWidth: 900,
  margin: '0 auto',
};

const card = {
  borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(0,0,0,0.35)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 60px rgba(124, 242, 176, 0.08)',
  padding: '1.5rem',
};

const headerRow = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '1rem',
  flexWrap: 'wrap',
};

const kicker = {
  fontWeight: 900,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontSize: '0.78rem',
  opacity: 0.65,
};

const title = {
  margin: '0.35rem 0 0.35rem 0',
  fontWeight: 950,
  fontSize: '2rem',
};

const sub = {
  margin: 0,
  opacity: 0.78,
  lineHeight: 1.55,
  maxWidth: 520,
};

const priceBox = {
  textAlign: 'right',
  padding: '0.75rem 0.95rem',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.06)',
  minWidth: 170,
};

const price = {
  fontWeight: 950,
  fontSize: '1.5rem',
  lineHeight: 1.1,
};

const per = {
  marginTop: '0.2rem',
  opacity: 0.75,
  fontWeight: 800,
  fontSize: '0.9rem',
};

const divider = {
  height: 1,
  background: 'rgba(255,255,255,0.10)',
  margin: '1.2rem 0',
};

const summaryCard = {
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  padding: '0.95rem 1rem',
};

const summaryTitle = {
  fontWeight: 900,
  marginBottom: '0.55rem',
};

const list = {
  margin: 0,
  paddingLeft: '1.15rem',
  display: 'grid',
  gap: '0.5rem',
};

const li = {
  fontWeight: 800,
  opacity: 0.9,
};

const cta = {
  marginTop: '1.25rem',
  width: '100%',
  padding: '1rem',
  borderRadius: 14,
  border: 'none',
  background: '#7cf2b0',
  color: '#0b0f14',
  fontWeight: 950,
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 14px 38px rgba(124, 242, 176, 0.26)',
};

const microcopyWrap = {
  marginTop: '0.8rem',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.65rem 1rem',
};

const hint = {
  fontWeight: 800,
  opacity: 0.68,
  fontSize: '0.9rem',
};

const error = {
  marginTop: '0.85rem',
  color: '#ffb4b4',
  fontWeight: 850,
  whiteSpace: 'pre-wrap',
};

const footerRow = {
  marginTop: '1.15rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const backLink = {
  textDecoration: 'none',
  fontWeight: 900,
  color: 'rgba(255,255,255,0.9)',
  padding: '0.62rem 0.9rem',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.16)',
  background: 'rgba(255,255,255,0.05)',
};

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.7)',
  display: 'grid',
  placeItems: 'center',
  zIndex: 999,
  padding: '1rem',
};

const modal = {
  width: 'min(560px, 100%)',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.14)',
  background: '#0d1117',
  padding: '1rem',
  boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
};

const modalHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
};

const modalTitle = {
  margin: 0,
  fontSize: '1.2rem',
  fontWeight: 900,
};

const closeBtn = {
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 10,
  background: 'transparent',
  color: 'rgba(255,255,255,0.92)',
  cursor: 'pointer',
  padding: '0.35rem 0.55rem',
  fontWeight: 900,
};

const methodGrid = {
  marginTop: '1rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '0.65rem',
};

const methodBtn = {
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.16)',
  background: 'rgba(255,255,255,0.04)',
  color: '#fff',
  padding: '0.8rem',
  fontWeight: 850,
  cursor: 'pointer',
  textAlign: 'left',
};

const methodBtnActive = {
  border: '1px solid rgba(124, 242, 176, 0.8)',
  background: 'rgba(124, 242, 176, 0.12)',
};

const modalHint = {
  marginTop: '0.95rem',
  opacity: 0.75,
  fontWeight: 700,
};

const modalMsg = {
  marginTop: '0.95rem',
  fontWeight: 800,
  opacity: 0.86,
};
