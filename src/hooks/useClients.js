import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// ---------- row <-> UI shape conversion ----------

function clientFromRow(row, policies = [], interactions = [], bankHistory = []) {
  return {
    id: row.id,
    name: row.name ?? '',
    email: row.email ?? '',
    phone: row.phone ?? '',
    dateOfBirth: row.date_of_birth ?? '',
    occupation: row.occupation ?? '',
    annualIncome: row.annual_income != null ? String(row.annual_income) : '',
    riskProfile: row.risk_profile ?? 'Moderate',
    notes: row.notes ?? '',
    createdDate: row.created_date ?? '',
    lastReviewDate: row.last_review_date ?? '',
    nextReviewDate: row.next_review_date ?? '',
    reviewFrequency: row.review_frequency ?? 'Annual',
    totalBankBalance: row.total_bank_balance != null ? String(row.total_bank_balance) : '0',
    cpfOA: row.cpf_oa != null ? String(row.cpf_oa) : '',
    cpfSA: row.cpf_sa != null ? String(row.cpf_sa) : '',
    cpfMA: row.cpf_ma != null ? String(row.cpf_ma) : '',
    policies,
    interactions,
    bankBalanceHistory: bankHistory,
  };
}

function policyFromRow(row, projections = []) {
  return {
    id: row.id,
    type: row.type ?? '',
    provider: row.provider ?? '',
    policyNumber: row.policy_number ?? '',
    premium: row.premium != null ? String(row.premium) : '',
    frequency: row.frequency ?? 'Annual',
    coverageAmount: row.coverage_amount != null ? String(row.coverage_amount) : '',
    tpdCoverage: row.tpd_coverage != null ? String(row.tpd_coverage) : '',
    tpdSameAsDeath: !!row.tpd_same_as_death,
    criticalIllnessCoverage:
      row.critical_illness_coverage != null ? String(row.critical_illness_coverage) : '',
    ciNotes: row.ci_notes ?? '',
    earlyCriticalIllnessCoverage:
      row.early_critical_illness_coverage != null
        ? String(row.early_critical_illness_coverage)
        : '',
    eciNotes: row.eci_notes ?? '',
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    status: row.status ?? 'Active',
    hasCashValue: !!row.has_cash_value,
    currentCashValue:
      row.current_cash_value != null ? String(row.current_cash_value) : '',
    projectedCashValue: projections.map((p) => ({ age: p.age, value: String(p.value) })),
    isInvestmentLinked: !!row.is_investment_linked,
    currentAccountValue:
      row.current_account_value != null ? String(row.current_account_value) : '',
    investmentAllocation: row.investment_allocation ?? '',
    illustratedValueAge55:
      row.illustrated_value_age_55 != null ? String(row.illustrated_value_age_55) : '',
    illustratedValueAge65:
      row.illustrated_value_age_65 != null ? String(row.illustrated_value_age_65) : '',
    ilpPremiumInclusionPercent:
      row.ilp_premium_inclusion_percent != null
        ? String(row.ilp_premium_inclusion_percent)
        : '0',
    isHospitalization: !!row.is_hospitalization,
    hospitalType: row.hospital_type ?? 'Private',
    integratedShieldCPF:
      row.integrated_shield_cpf != null ? String(row.integrated_shield_cpf) : '',
    integratedShieldCash:
      row.integrated_shield_cash != null ? String(row.integrated_shield_cash) : '',
    riderCash: row.rider_cash != null ? String(row.rider_cash) : '',
  };
}

function interactionFromRow(row) {
  return {
    id: row.id,
    date: row.date ?? '',
    type: row.type ?? 'Meeting',
    notes: row.notes ?? '',
    followUp: row.follow_up ?? '',
  };
}

function bankFromRow(row) {
  return {
    id: row.id,
    date: row.date ?? '',
    balance: row.balance != null ? String(row.balance) : '0',
    notes: row.notes ?? '',
  };
}

function clientToRow(data, userId) {
  const toNum = (v) => (v === '' || v == null ? null : Number(v));
  return {
    user_id: userId,
    name: data.name,
    email: data.email || null,
    phone: data.phone || null,
    date_of_birth: data.dateOfBirth || null,
    occupation: data.occupation || null,
    annual_income: toNum(data.annualIncome),
    risk_profile: data.riskProfile || 'Moderate',
    notes: data.notes || null,
    created_date: data.createdDate || null,
    next_review_date: data.nextReviewDate || null,
    review_frequency: data.reviewFrequency || 'Annual',
    total_bank_balance: toNum(data.totalBankBalance),
    cpf_oa: toNum(data.cpfOA),
    cpf_sa: toNum(data.cpfSA),
    cpf_ma: toNum(data.cpfMA),
  };
}

function policyToRow(data, userId, clientId) {
  const toNum = (v) => (v === '' || v == null ? null : Number(v));
  return {
    user_id: userId,
    client_id: clientId,
    type: data.type,
    provider: data.provider || null,
    policy_number: data.policyNumber || null,
    premium: toNum(data.premium) ?? 0,
    frequency: data.frequency || 'Annual',
    coverage_amount: toNum(data.coverageAmount) ?? 0,
    tpd_coverage: toNum(data.tpdCoverage) ?? 0,
    tpd_same_as_death: !!data.tpdSameAsDeath,
    critical_illness_coverage: toNum(data.criticalIllnessCoverage) ?? 0,
    ci_notes: data.ciNotes || null,
    early_critical_illness_coverage: toNum(data.earlyCriticalIllnessCoverage) ?? 0,
    eci_notes: data.eciNotes || null,
    start_date: data.startDate || null,
    end_date: data.endDate || null,
    status: data.status || 'Active',
    has_cash_value: !!data.hasCashValue,
    current_cash_value: toNum(data.currentCashValue) ?? 0,
    is_investment_linked: !!data.isInvestmentLinked,
    current_account_value: toNum(data.currentAccountValue) ?? 0,
    investment_allocation: data.investmentAllocation || null,
    illustrated_value_age_55: toNum(data.illustratedValueAge55) ?? 0,
    illustrated_value_age_65: toNum(data.illustratedValueAge65) ?? 0,
    ilp_premium_inclusion_percent: toNum(data.ilpPremiumInclusionPercent) ?? 0,
    is_hospitalization: !!data.isHospitalization,
    hospital_type: data.hospitalType || 'Private',
    integrated_shield_cpf: toNum(data.integratedShieldCPF) ?? 0,
    integrated_shield_cash: toNum(data.integratedShieldCash) ?? 0,
    rider_cash: toNum(data.riderCash) ?? 0,
  };
}

// ---------- hook ----------

export function useClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setClients([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [clientsQ, policiesQ, projectionsQ, interactionsQ, bankQ] = await Promise.all([
        supabase.from('clients').select('*').order('created_at', { ascending: true }),
        supabase.from('policies').select('*').order('created_at', { ascending: true }),
        supabase.from('projected_cash_values').select('*'),
        supabase.from('interactions').select('*').order('date', { ascending: false }),
        supabase.from('bank_balance_history').select('*').order('date', { ascending: true }),
      ]);
      const firstErr = [clientsQ, policiesQ, projectionsQ, interactionsQ, bankQ].find(
        (r) => r.error,
      );
      if (firstErr?.error) throw firstErr.error;

      const projByPolicy = new Map();
      for (const row of projectionsQ.data || []) {
        const arr = projByPolicy.get(row.policy_id) || [];
        arr.push(row);
        projByPolicy.set(row.policy_id, arr);
      }

      const policiesByClient = new Map();
      for (const row of policiesQ.data || []) {
        const arr = policiesByClient.get(row.client_id) || [];
        arr.push(policyFromRow(row, projByPolicy.get(row.id) || []));
        policiesByClient.set(row.client_id, arr);
      }

      const interactionsByClient = new Map();
      for (const row of interactionsQ.data || []) {
        const arr = interactionsByClient.get(row.client_id) || [];
        arr.push(interactionFromRow(row));
        interactionsByClient.set(row.client_id, arr);
      }

      const bankByClient = new Map();
      for (const row of bankQ.data || []) {
        const arr = bankByClient.get(row.client_id) || [];
        arr.push(bankFromRow(row));
        bankByClient.set(row.client_id, arr);
      }

      const shaped = (clientsQ.data || []).map((row) =>
        clientFromRow(
          row,
          policiesByClient.get(row.id) || [],
          interactionsByClient.get(row.id) || [],
          bankByClient.get(row.id) || [],
        ),
      );
      setClients(shaped);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ----- clients -----
  const addClient = async (data) => {
    if (!user) return;
    const row = clientToRow(data, user.id);
    if (!row.created_date) row.created_date = new Date().toISOString().split('T')[0];
    const { data: inserted, error: err } = await supabase
      .from('clients')
      .insert(row)
      .select()
      .single();
    if (err) throw err;
    if (data.totalBankBalance && Number(data.totalBankBalance) > 0) {
      await supabase.from('bank_balance_history').insert({
        user_id: user.id,
        client_id: inserted.id,
        date: row.created_date,
        balance: Number(data.totalBankBalance),
        notes: 'Initial client onboarding',
      });
    }
    await refresh();
  };

  const updateClient = async (id, data) => {
    if (!user) return;
    const row = clientToRow(data, user.id);
    const { error: err } = await supabase.from('clients').update(row).eq('id', id);
    if (err) throw err;
    await refresh();
  };

  const deleteClient = async (id) => {
    const { error: err } = await supabase.from('clients').delete().eq('id', id);
    if (err) throw err;
    await refresh();
  };

  // ----- policies -----
  const savePolicyProjections = async (policyId, projections) => {
    await supabase.from('projected_cash_values').delete().eq('policy_id', policyId);
    if (!projections || projections.length === 0) return;
    await supabase.from('projected_cash_values').insert(
      projections.map((p) => ({
        user_id: user.id,
        policy_id: policyId,
        age: Number(p.age),
        value: Number(p.value),
      })),
    );
  };

  const addPolicy = async (clientId, data) => {
    if (!user) return;
    const row = policyToRow(data, user.id, clientId);
    const { data: inserted, error: err } = await supabase
      .from('policies')
      .insert(row)
      .select()
      .single();
    if (err) throw err;
    await savePolicyProjections(inserted.id, data.projectedCashValue);
    await refresh();
  };

  const updatePolicy = async (_clientId, policyId, data) => {
    if (!user) return;
    const row = policyToRow(data, user.id, _clientId);
    const { error: err } = await supabase.from('policies').update(row).eq('id', policyId);
    if (err) throw err;
    await savePolicyProjections(policyId, data.projectedCashValue);
    await refresh();
  };

  const deletePolicy = async (_clientId, policyId) => {
    const { error: err } = await supabase.from('policies').delete().eq('id', policyId);
    if (err) throw err;
    await refresh();
  };

  // ----- interactions -----
  const addInteraction = async (clientId, data) => {
    if (!user) return;
    const { error: err } = await supabase.from('interactions').insert({
      user_id: user.id,
      client_id: clientId,
      date: data.date,
      type: data.type,
      notes: data.notes,
      follow_up: data.followUp || null,
    });
    if (err) throw err;
    await refresh();
  };

  const updateInteraction = async (_clientId, interactionId, data) => {
    const { error: err } = await supabase
      .from('interactions')
      .update({
        date: data.date,
        type: data.type,
        notes: data.notes,
        follow_up: data.followUp || null,
      })
      .eq('id', interactionId);
    if (err) throw err;
    await refresh();
  };

  const deleteInteraction = async (_clientId, interactionId) => {
    const { error: err } = await supabase
      .from('interactions')
      .delete()
      .eq('id', interactionId);
    if (err) throw err;
    await refresh();
  };

  // ----- bank balance -----
  const addBankBalance = async (clientId, record) => {
    if (!user) return;
    const { error: err } = await supabase.from('bank_balance_history').insert({
      user_id: user.id,
      client_id: clientId,
      date: record.date,
      balance: Number(record.balance),
      notes: record.notes,
    });
    if (err) throw err;
    await supabase
      .from('clients')
      .update({
        total_bank_balance: Number(record.balance),
        last_review_date: record.date,
      })
      .eq('id', clientId);
    await refresh();
  };

  const updateBankBalance = async (clientId, index, record) => {
    const client = clients.find((c) => c.id === clientId);
    const existing = client?.bankBalanceHistory?.[index];
    if (!existing) return;
    const { error: err } = await supabase
      .from('bank_balance_history')
      .update({
        date: record.date,
        balance: Number(record.balance),
        notes: record.notes,
      })
      .eq('id', existing.id);
    if (err) throw err;
    await supabase
      .from('clients')
      .update({
        total_bank_balance: Number(record.balance),
        last_review_date: record.date,
      })
      .eq('id', clientId);
    await refresh();
  };

  const deleteBankBalance = async (clientId, index) => {
    const client = clients.find((c) => c.id === clientId);
    const existing = client?.bankBalanceHistory?.[index];
    if (!existing) return;
    const { error: err } = await supabase
      .from('bank_balance_history')
      .delete()
      .eq('id', existing.id);
    if (err) throw err;
    await refresh();
  };

  return {
    clients,
    loading,
    error,
    refresh,
    addClient,
    updateClient,
    deleteClient,
    addPolicy,
    updatePolicy,
    deletePolicy,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    addBankBalance,
    updateBankBalance,
    deleteBankBalance,
  };
}
