import { useEffect, useState } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const OLD_KEY = 'insuranceCRM';

const toNum = (v) => (v === '' || v == null ? null : Number(v));
const toNumOr0 = (v) => {
  const n = toNum(v);
  return n == null ? 0 : n;
};

function readLegacyClients() {
  try {
    const raw = localStorage.getItem(OLD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function LocalStorageImporter({ onImported }) {
  const { user } = useAuth();
  const [legacy, setLegacy] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | running | done | error
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLegacy(readLegacyClients());
  }, []);

  if (!user || !legacy) return null;

  const handleDismiss = () => {
    const raw = localStorage.getItem(OLD_KEY);
    if (raw) {
      localStorage.setItem(`${OLD_KEY}.dismissed.${Date.now()}`, raw);
      localStorage.removeItem(OLD_KEY);
    }
    setLegacy(null);
  };

  const handleImport = async () => {
    setStatus('running');
    setError(null);
    setProgress(0);
    try {
      for (let i = 0; i < legacy.length; i++) {
        const c = legacy[i];
        const clientRow = {
          user_id: user.id,
          name: c.name || 'Unnamed',
          email: c.email || null,
          phone: c.phone || null,
          date_of_birth: c.dateOfBirth || null,
          occupation: c.occupation || null,
          annual_income: toNum(c.annualIncome),
          risk_profile: c.riskProfile || 'Moderate',
          notes: c.notes || null,
          created_date: c.createdDate || new Date().toISOString().split('T')[0],
          last_review_date: c.lastReviewDate || null,
          next_review_date: c.nextReviewDate || null,
          review_frequency: c.reviewFrequency || 'Annual',
          total_bank_balance: toNumOr0(c.totalBankBalance),
          cpf_oa: toNumOr0(c.cpfOA),
          cpf_sa: toNumOr0(c.cpfSA),
          cpf_ma: toNumOr0(c.cpfMA),
        };
        const { data: inserted, error: cErr } = await supabase
          .from('clients')
          .insert(clientRow)
          .select()
          .single();
        if (cErr) throw cErr;
        const clientId = inserted.id;

        for (const p of c.policies || []) {
          const policyRow = {
            user_id: user.id,
            client_id: clientId,
            type: p.type || 'Unknown',
            provider: p.provider || null,
            policy_number: p.policyNumber || null,
            premium: toNumOr0(p.premium),
            frequency: p.frequency || 'Annual',
            coverage_amount: toNumOr0(p.coverageAmount),
            tpd_coverage: toNumOr0(p.tpdCoverage),
            tpd_same_as_death: !!p.tpdSameAsDeath,
            critical_illness_coverage: toNumOr0(p.criticalIllnessCoverage),
            ci_notes: p.ciNotes || null,
            early_critical_illness_coverage: toNumOr0(p.earlyCriticalIllnessCoverage),
            eci_notes: p.eciNotes || null,
            start_date: p.startDate || null,
            end_date: p.endDate || null,
            status: p.status || 'Active',
            has_cash_value: !!p.hasCashValue,
            current_cash_value: toNumOr0(p.currentCashValue),
            is_investment_linked: !!p.isInvestmentLinked,
            current_account_value: toNumOr0(p.currentAccountValue),
            investment_allocation: p.investmentAllocation || null,
            illustrated_value_age_55: toNumOr0(p.illustratedValueAge55),
            illustrated_value_age_65: toNumOr0(p.illustratedValueAge65),
            ilp_premium_inclusion_percent: toNumOr0(p.ilpPremiumInclusionPercent),
            is_hospitalization: !!p.isHospitalization,
            hospital_type: p.hospitalType || 'Private',
            integrated_shield_cpf: toNumOr0(p.integratedShieldCPF),
            integrated_shield_cash: toNumOr0(p.integratedShieldCash),
            rider_cash: toNumOr0(p.riderCash),
          };
          const { data: insertedPolicy, error: pErr } = await supabase
            .from('policies')
            .insert(policyRow)
            .select()
            .single();
          if (pErr) throw pErr;

          const projections = (p.projectedCashValue || [])
            .filter((pcv) => pcv && pcv.age !== '' && pcv.value !== '')
            .map((pcv) => ({
              user_id: user.id,
              policy_id: insertedPolicy.id,
              age: Number(pcv.age),
              value: Number(pcv.value),
            }));
          if (projections.length > 0) {
            const { error: pcvErr } = await supabase
              .from('projected_cash_values')
              .insert(projections);
            if (pcvErr) throw pcvErr;
          }
        }

        const interactions = (c.interactions || []).map((it) => ({
          user_id: user.id,
          client_id: clientId,
          date: it.date || new Date().toISOString().split('T')[0],
          type: it.type || 'Meeting',
          notes: it.notes || null,
          follow_up: it.followUp || null,
        }));
        if (interactions.length > 0) {
          const { error: iErr } = await supabase.from('interactions').insert(interactions);
          if (iErr) throw iErr;
        }

        const bankHistory = (c.bankBalanceHistory || []).map((b) => ({
          user_id: user.id,
          client_id: clientId,
          date: b.date || new Date().toISOString().split('T')[0],
          balance: Number(b.balance || 0),
          notes: b.notes || null,
        }));
        if (bankHistory.length > 0) {
          const { error: bErr } = await supabase
            .from('bank_balance_history')
            .insert(bankHistory);
          if (bErr) throw bErr;
        }

        setProgress(i + 1);
      }

      const raw = localStorage.getItem(OLD_KEY);
      if (raw) {
        localStorage.setItem(`${OLD_KEY}.imported.${Date.now()}`, raw);
        localStorage.removeItem(OLD_KEY);
      }
      setStatus('done');
      setLegacy(null);
      onImported?.();
    } catch (e) {
      setError(e.message || String(e));
      setStatus('error');
    }
  };

  if (status === 'done') return null;

  return (
    <Alert variant="info" className="d-flex flex-wrap align-items-center gap-2 mb-3">
      <div className="flex-grow-1 small">
        <strong>{legacy.length}</strong> client{legacy.length === 1 ? '' : 's'} found in this
        browser from before the migration.{' '}
        {status === 'running' && (
          <span className="text-muted">
            Importing {progress}/{legacy.length}…
          </span>
        )}
        {status === 'error' && <span className="text-danger d-block">Error: {error}</span>}
      </div>
      <div className="d-flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleImport}
          disabled={status === 'running'}
        >
          {status === 'running' ? <Spinner animation="border" size="sm" /> : 'Import'}
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleDismiss}
          disabled={status === 'running'}
        >
          Dismiss
        </Button>
      </div>
    </Alert>
  );
}
