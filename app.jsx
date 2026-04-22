const { useState, useEffect } = React;

// Initial sample data
const sampleClients = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+65 9123 4567",
    dateOfBirth: "1985-03-15",
    occupation: "Software Engineer",
    annualIncome: "120000",
    riskProfile: "Moderate",
    notes: "Interested in comprehensive life coverage and investment-linked policies",
    createdDate: "2023-01-10",
    lastReviewDate: "2024-04-10",
    nextReviewDate: "2024-10-10",
    totalBankBalance: "75000",
    cpfOA: "45000",
    cpfSA: "38000",
    cpfMA: "25000",
    bankBalanceHistory: [
      { date: "2023-01-10", balance: "50000", notes: "Initial client onboarding" },
      { date: "2024-04-10", balance: "75000", notes: "Annual review - increased savings" }
    ],
    policies: [
      {
        id: 1,
        type: "Life Insurance",
        provider: "AIA",
        policyNumber: "L-2023-001234",
        premium: "2400",
        frequency: "Annual",
        coverageAmount: "500000",
        criticalIllnessCoverage: "250000",
        earlyCriticalIllnessCoverage: "50000",
        startDate: "2023-01-15",
        endDate: "2048-01-15",
        status: "Active",
        hasCashValue: true,
        currentCashValue: "12000",
        projectedCashValue: [
          { age: 55, value: "85000" },
          { age: 65, value: "180000" }
        ]
      },
      {
        id: 2,
        type: "Critical Illness",
        provider: "Prudential",
        policyNumber: "CI-2023-005678",
        premium: "1800",
        frequency: "Annual",
        coverageAmount: "250000",
        criticalIllnessCoverage: "250000",
        earlyCriticalIllnessCoverage: "50000",
        startDate: "2023-03-01",
        endDate: "2053-03-01",
        status: "Active",
        hasCashValue: false
      },
      {
        id: 4,
        type: "Hospitalization",
        provider: "NTUC Income",
        policyNumber: "H-2023-112233",
        premium: "0",
        frequency: "Annual",
        coverageAmount: "0",
        startDate: "2023-01-01",
        endDate: "2024-01-01",
        status: "Active",
        isHospitalization: true,
        hospitalType: "Private",
        integratedShieldCPF: "500",
        integratedShieldCash: "200",
        riderCash: "300"
      }
    ],
    interactions: [
      {
        id: 1,
        date: "2024-04-10",
        type: "Meeting",
        notes: "Annual policy review. Client satisfied with current coverage. Discussed adding hospitalization plan.",
        followUp: "2024-10-10"
      },
      {
        id: 2,
        date: "2024-01-15",
        type: "Phone Call",
        notes: "Policy anniversary reminder sent. Client confirmed premium payment.",
        followUp: ""
      }
    ]
  },
  {
    id: 2,
    name: "Michael Tan",
    email: "michael.tan@business.com",
    phone: "+65 8234 5678",
    dateOfBirth: "1978-07-22",
    occupation: "Business Owner",
    annualIncome: "250000",
    riskProfile: "Aggressive",
    notes: "High net worth individual. Focus on wealth accumulation and estate planning.",
    createdDate: "2022-05-15",
    lastReviewDate: "2024-03-20",
    nextReviewDate: "2024-09-20",
    totalBankBalance: "180000",
    cpfOA: "62000",
    cpfSA: "55000",
    cpfMA: "35000",
    bankBalanceHistory: [
      { date: "2022-05-15", balance: "150000", notes: "Initial assessment" },
      { date: "2023-05-20", balance: "165000", notes: "Annual review" },
      { date: "2024-03-20", balance: "180000", notes: "Q1 review - business profits" }
    ],
    policies: [
      {
        id: 3,
        type: "Investment-Linked Policy",
        provider: "Great Eastern",
        policyNumber: "ILP-2022-009876",
        premium: "12000",
        frequency: "Annual",
        coverageAmount: "1000000",
        criticalIllnessCoverage: "500000",
        earlyCriticalIllnessCoverage: "100000",
        startDate: "2022-06-01",
        endDate: "2072-06-01",
        status: "Active",
        isInvestmentLinked: true,
        currentAccountValue: "28000",
        investmentAllocation: "70% Equity, 30% Bonds",
        illustratedValueAge55: "485000",
        illustratedValueAge65: "892000"
      }
    ],
    interactions: [
      {
        id: 3,
        date: "2024-03-20",
        type: "Meeting",
        notes: "Discussed business succession planning and key person insurance.",
        followUp: "2024-06-20"
      }
    ]
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [showBankAccountForm, setShowBankAccountForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [editingBankBalance, setEditingBankBalance] = useState(null);
  const [editingInteraction, setEditingInteraction] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [clientReportData, setClientReportData] = useState(null);

  useEffect(() => {
    window.generateClientReport = (client) => {
      setClientReportData(client);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('insuranceCRM');
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      setClients(sampleClients);
      localStorage.setItem('insuranceCRM', JSON.stringify(sampleClients));
    }
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem('insuranceCRM', JSON.stringify(clients));
    }
  }, [clients]);

  const addClient = (clientData) => {
    const newClient = {
      ...clientData,
      id: Date.now(),
      policies: [],
      interactions: [],
      createdDate: clientData.createdDate || new Date().toISOString().split('T')[0],
      lastReviewDate: '',
      nextReviewDate: '',
      totalBankBalance: clientData.totalBankBalance || '0',
      bankBalanceHistory: clientData.totalBankBalance ? [{
        date: clientData.createdDate || new Date().toISOString().split('T')[0],
        balance: clientData.totalBankBalance,
        notes: 'Initial client onboarding'
      }] : []
    };
    setClients([...clients, newClient]);
    setShowClientForm(false);
  };

  const updateClient = (clientData) => {
    setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...clientData } : c));
    setEditingClient(null);
    setShowClientForm(false);
  };

  const deleteClient = (id) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const addPolicy = (policyData) => {
    const newPolicy = { ...policyData, id: Date.now() };
    setClients(clients.map(c =>
      c.id === selectedClient.id
        ? { ...c, policies: [...c.policies, newPolicy] }
        : c
    ));
    setShowPolicyForm(false);
    setSelectedClient(null);
  };

  const updatePolicy = (policyData) => {
    setClients(clients.map(c =>
      c.id === selectedClient.id
        ? { ...c, policies: c.policies.map(p => p.id === editingPolicy.id ? { ...policyData, id: p.id } : p) }
        : c
    ));
    setShowPolicyForm(false);
    setEditingPolicy(null);
    setSelectedClient(null);
  };

  const deletePolicy = (clientId, policyId) => {
    if (confirm('Are you sure you want to delete this policy?')) {
      setClients(clients.map(c =>
        c.id === clientId ? { ...c, policies: c.policies.filter(p => p.id !== policyId) } : c
      ));
    }
  };

  const addInteraction = (interactionData) => {
    const newInteraction = { ...interactionData, id: Date.now() };
    setClients(clients.map(c =>
      c.id === selectedClient.id
        ? { ...c, interactions: [...c.interactions, newInteraction] }
        : c
    ));
    setShowInteractionForm(false);
    setSelectedClient(null);
  };

  const addBankAccount = (balanceData) => {
    const newRecord = { date: balanceData.date, balance: balanceData.balance, notes: balanceData.notes };
    setClients(clients.map(c =>
      c.id === selectedClient.id
        ? {
            ...c,
            totalBankBalance: balanceData.balance,
            bankBalanceHistory: [...(c.bankBalanceHistory || []), newRecord],
            lastReviewDate: balanceData.date
          }
        : c
    ));
    setShowBankAccountForm(false);
    setSelectedClient(null);
    setEditingBankBalance(null);
  };

  const updateBankBalance = (balanceData) => {
    setClients(clients.map(c =>
      c.id === selectedClient.id
        ? {
            ...c,
            totalBankBalance: balanceData.balance,
            bankBalanceHistory: c.bankBalanceHistory.map((record, idx) =>
              idx === editingBankBalance.index ? {
                date: balanceData.date,
                balance: balanceData.balance,
                notes: balanceData.notes
              } : record
            ),
            lastReviewDate: balanceData.date
          }
        : c
    ));
    setShowBankAccountForm(false);
    setSelectedClient(null);
    setEditingBankBalance(null);
  };

  const deleteBankBalance = (clientId, balanceIndex) => {
    if (confirm('Are you sure you want to delete this balance record?')) {
      setClients(clients.map(c =>
        c.id === clientId
          ? {
              ...c,
              bankBalanceHistory: c.bankBalanceHistory.filter((_, idx) => idx !== balanceIndex),
              totalBankBalance: c.bankBalanceHistory.length > 1
                ? c.bankBalanceHistory[c.bankBalanceHistory.length - 2]?.balance || '0'
                : '0'
            }
          : c
      ));
    }
  };

  const updateInteraction = (interactionData) => {
    setClients(clients.map(c =>
      c.id === selectedClient.id
        ? { ...c, interactions: c.interactions.map(i => i.id === editingInteraction.id ? { ...interactionData, id: i.id } : i) }
        : c
    ));
    setShowInteractionForm(false);
    setEditingInteraction(null);
    setSelectedClient(null);
  };

  const deleteInteraction = (clientId, interactionId) => {
    if (confirm('Are you sure you want to delete this interaction?')) {
      setClients(clients.map(c =>
        c.id === clientId ? { ...c, interactions: c.interactions.filter(i => i.id !== interactionId) } : c
      ));
    }
  };

  const generateReport = () => {
    const totalClients = clients.length;
    const totalPolicies = clients.reduce((sum, c) => sum + c.policies.length, 0);
    const totalPremium = clients.reduce((sum, c) => sum + c.policies.reduce((pSum, p) => pSum + parseFloat(p.premium || 0), 0), 0);
    const activePolicies = clients.reduce((sum, c) => sum + c.policies.filter(p => p.status === 'Active').length, 0);
    const totalCoverage = clients.reduce((sum, c) => sum + c.policies.reduce((pSum, p) => pSum + parseFloat(p.coverageAmount || 0), 0), 0);

    setReportData({
      generatedDate: new Date().toLocaleString(),
      totalClients, totalPolicies, activePolicies,
      totalPremium: totalPremium.toFixed(2),
      totalCoverage: totalCoverage.toFixed(2),
      clients: clients
    });
    setActiveTab('reports');
  };

  const stats = {
    totalClients: clients.length,
    activePolicies: clients.reduce((sum, c) => sum + c.policies.filter(p => p.status === 'Active').length, 0),
    totalPremium: clients.reduce((sum, c) => sum + c.policies.reduce((pSum, p) => pSum + parseFloat(p.premium || 0), 0), 0).toFixed(0),
    upcomingFollowUps: clients.reduce((sum, c) => sum + c.interactions.filter(i => i.followUp && new Date(i.followUp) > new Date()).length, 0)
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Insurance Advisor CRM</h1>
        <p>Manage your clients, policies, and generate comprehensive reports</p>
      </div>

      <div className="nav-tabs no-print">
        <button className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`nav-tab ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>Clients</button>
        <button className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Reports</button>
      </div>

      <div className="content-card">
        {activeTab === 'dashboard' && <Dashboard stats={stats} generateReport={generateReport} />}
        {activeTab === 'clients' && (
          <Clients
            clients={clients}
            onAddClient={() => setShowClientForm(true)}
            onEditClient={(client) => { setEditingClient(client); setShowClientForm(true); }}
            onDeleteClient={deleteClient}
            onAddPolicy={(client) => { setSelectedClient(client); setShowPolicyForm(true); }}
            onEditPolicy={(client, policy) => { setSelectedClient(client); setEditingPolicy(policy); setShowPolicyForm(true); }}
            onDeletePolicy={deletePolicy}
            onAddInteraction={(client) => { setSelectedClient(client); setShowInteractionForm(true); }}
            onEditInteraction={(client, interaction) => { setSelectedClient(client); setEditingInteraction(interaction); setShowInteractionForm(true); }}
            onDeleteInteraction={deleteInteraction}
            onAddBankAccount={(client) => { setSelectedClient(client); setShowBankAccountForm(true); }}
            onEditBankBalance={(client, record, idx) => { setSelectedClient(client); setEditingBankBalance({ data: record, index: idx }); setShowBankAccountForm(true); }}
            onDeleteBankBalance={deleteBankBalance}
          />
        )}
        {activeTab === 'reports' && <Reports reportData={reportData} />}
      </div>

      {showClientForm && <ClientForm client={editingClient} onSubmit={editingClient ? updateClient : addClient} onCancel={() => { setShowClientForm(false); setEditingClient(null); }} />}
      {showPolicyForm && <PolicyForm policy={editingPolicy} onSubmit={editingPolicy ? updatePolicy : addPolicy} onCancel={() => { setShowPolicyForm(false); setEditingPolicy(null); setSelectedClient(null); }} />}
      {showInteractionForm && <InteractionForm interaction={editingInteraction} onSubmit={editingInteraction ? updateInteraction : addInteraction} onCancel={() => { setShowInteractionForm(false); setSelectedClient(null); setEditingInteraction(null); }} />}
      {showBankAccountForm && <BankAccountForm balance={editingBankBalance} onSubmit={editingBankBalance ? updateBankBalance : addBankAccount} onCancel={() => { setShowBankAccountForm(false); setSelectedClient(null); setEditingBankBalance(null); }} />}
      {clientReportData && <ClientReport client={clientReportData} onClose={() => setClientReportData(null)} />}
    </div>
  );
}

function Dashboard({ stats, generateReport }) {
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total clients</div><div className="stat-value">{stats.totalClients}</div></div>
        <div className="stat-card"><div className="stat-label">Active policies</div><div className="stat-value">{stats.activePolicies}</div></div>
        <div className="stat-card"><div className="stat-label">Total annual premium</div><div className="stat-value">${stats.totalPremium}</div></div>
        <div className="stat-card"><div className="stat-label">Upcoming follow-ups</div><div className="stat-value">{stats.upcomingFollowUps}</div></div>
      </div>
      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>Quick actions</h2>
        <button className="btn btn-success" onClick={generateReport}>Generate comprehensive report</button>
      </div>
    </div>
  );
}

function Clients({ clients, onAddClient, onEditClient, onDeleteClient, onAddPolicy, onEditPolicy, onDeletePolicy, onAddInteraction, onEditInteraction, onDeleteInteraction, onAddBankAccount, onEditBankBalance, onDeleteBankBalance }) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <input type="text" className="form-input" placeholder="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ maxWidth: '300px', flex: '1 1 auto' }} />
        <button className="btn btn-primary" onClick={onAddClient}>Add new client</button>
      </div>
      {filteredClients.length === 0 ? (
        <div className="empty-state"><p>No clients found. Add your first client to get started.</p></div>
      ) : (
        <div className="client-list">
          {filteredClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={() => onEditClient(client)}
              onDelete={() => onDeleteClient(client.id)}
              onAddPolicy={() => onAddPolicy(client)}
              onEditPolicy={(policy) => onEditPolicy(client, policy)}
              onDeletePolicy={(policyId) => onDeletePolicy(client.id, policyId)}
              onAddInteraction={() => onAddInteraction(client)}
              onEditInteraction={(interaction) => onEditInteraction(client, interaction)}
              onDeleteInteraction={(interactionId) => onDeleteInteraction(client.id, interactionId)}
              onAddBankAccount={() => onAddBankAccount(client)}
              onEditBankBalance={(record, idx) => onEditBankBalance(client, record, idx)}
              onDeleteBankBalance={(idx) => onDeleteBankBalance(client.id, idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ClientCard({ client, onEdit, onDelete, onAddPolicy, onEditPolicy, onDeletePolicy, onAddInteraction, onEditInteraction, onDeleteInteraction, onAddBankAccount, onEditBankBalance, onDeleteBankBalance }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="client-card">
      <div style={{ flex: 1 }}>
        <div className="client-info">
          <h3>{client.name}</h3>
          <p>{client.email} | {client.phone}</p>
          <p>{client.occupation} | ${parseInt(client.annualIncome).toLocaleString()}/year</p>
          <p>Risk profile: {client.riskProfile}</p>
        </div>

        {expanded && (
          <div>
            <div className="policy-list">
              <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>Policies ({client.policies.length})</h4>
              {client.policies.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#666' }}>No policies yet</p>
              ) : (
                client.policies.map(policy => (
                  <div key={policy.id} className="policy-item" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                      <button className="btn btn-secondary btn-small" onClick={() => onEditPolicy(policy)} style={{ padding: '4px 8px', fontSize: '11px' }}>Edit</button>
                      <button className="btn btn-danger btn-small" onClick={() => onDeletePolicy(policy.id)} style={{ padding: '4px 8px', fontSize: '11px' }}>Delete</button>
                    </div>
                    <h4>{policy.type} - {policy.provider}</h4>
                    <p>Policy: {policy.policyNumber} | Premium: ${policy.premium}/{policy.frequency}</p>
                    {!policy.isHospitalization && (
                      <p>Coverage: ${parseInt(policy.coverageAmount).toLocaleString()}
                        <span className={`badge ${policy.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{policy.status}</span>
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>Recent interactions ({client.interactions.length})</h4>
              {client.interactions.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#666' }}>No interactions logged yet</p>
              ) : (
                client.interactions.slice(0, 3).map(interaction => (
                  <div key={interaction.id} style={{ fontSize: '13px', marginBottom: '12px', padding: '8px', background: '#f8f9fa', borderRadius: '6px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                      <button className="btn btn-secondary btn-small" onClick={() => onEditInteraction(interaction)} style={{ padding: '4px 8px', fontSize: '11px' }}>Edit</button>
                      <button className="btn btn-danger btn-small" onClick={() => onDeleteInteraction(interaction.id)} style={{ padding: '4px 8px', fontSize: '11px' }}>Delete</button>
                    </div>
                    <div style={{ marginBottom: '4px', paddingRight: '120px' }}><strong>{interaction.date}</strong> - {interaction.type}</div>
                    <div style={{ color: '#666', marginBottom: '4px' }}>{interaction.notes}</div>
                    {interaction.followUp && <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '500', marginTop: '4px' }}>Follow-up: {interaction.followUp}</div>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <button className="btn btn-secondary btn-small" style={{ marginTop: '12px' }} onClick={() => setExpanded(!expanded)}>{expanded ? 'Show less' : 'Show more'}</button>
      </div>

      <div className="client-actions">
        <button className="btn btn-success btn-small" onClick={() => window.generateClientReport(client)}>Generate report</button>
        <button className="btn btn-secondary btn-small" onClick={onAddPolicy}>Add policy</button>
        <button className="btn btn-secondary btn-small" onClick={onAddBankAccount}>Update bank balance</button>
        <button className="btn btn-secondary btn-small" onClick={onAddInteraction}>Log interaction</button>
        <button className="btn btn-secondary btn-small" onClick={onEdit}>Edit</button>
        <button className="btn btn-danger btn-small" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

function ClientForm({ client, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(client || {
    name: '', email: '', phone: '', dateOfBirth: '', occupation: '',
    annualIncome: '', riskProfile: 'Moderate', notes: '',
    totalBankBalance: '', cpfOA: '', cpfSA: '', cpfMA: '',
    nextReviewDate: '', reviewFrequency: 'Annual', createdDate: ''
  });

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">{client ? 'Edit client' : 'Add new client'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Full name *</label><input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
            <div className="form-group"><label className="form-label">Phone *</label><input type="tel" className="form-input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date of birth</label><input type="date" className="form-input" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Occupation</label><input type="text" className="form-input" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Annual income ($)</label><input type="number" className="form-input" value={formData.annualIncome} onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Risk profile</label><select className="form-select" value={formData.riskProfile} onChange={(e) => setFormData({ ...formData, riskProfile: e.target.value })}><option>Conservative</option><option>Moderate</option><option>Aggressive</option></select></div>
          </div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}></textarea></div>
          <div className="form-group"><label className="form-label">Total bank balance ($)</label><input type="number" className="form-input" value={formData.totalBankBalance} onChange={(e) => setFormData({ ...formData, totalBankBalance: e.target.value })} /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">CPF OA ($)</label><input type="number" className="form-input" value={formData.cpfOA} onChange={(e) => setFormData({ ...formData, cpfOA: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">CPF SA ($)</label><input type="number" className="form-input" value={formData.cpfSA} onChange={(e) => setFormData({ ...formData, cpfSA: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">CPF MA ($)</label><input type="number" className="form-input" value={formData.cpfMA} onChange={(e) => setFormData({ ...formData, cpfMA: e.target.value })} /></div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">{client ? 'Update client' : 'Add client'}</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PolicyForm({ policy, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(policy || {
    type: '', provider: '', policyNumber: '', premium: '', frequency: 'Annual',
    coverageAmount: '', criticalIllnessCoverage: '', earlyCriticalIllnessCoverage: '',
    startDate: '', endDate: '', status: 'Active',
    hasCashValue: false, currentCashValue: '',
    isInvestmentLinked: false, currentAccountValue: '',
    isHospitalization: false, hospitalType: 'Private'
  });

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div className="modal-header">{policy ? 'Edit policy' : 'Add new policy'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Policy type *</label>
              <select className="form-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required>
                <option value="">Select type</option>
                <option>Life Insurance</option>
                <option>Critical Illness</option>
                <option>Early Critical Illness</option>
                <option>Whole Life</option>
                <option>Term Life</option>
                <option>Investment-Linked Policy</option>
                <option>Hospitalization</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Provider *</label><input type="text" className="form-input" value={formData.provider} onChange={(e) => setFormData({ ...formData, provider: e.target.value })} required /></div>
          </div>
          <div className="form-group"><label className="form-label">Policy number *</label><input type="text" className="form-input" value={formData.policyNumber} onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })} required /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Premium ($) *</label><input type="number" className="form-input" value={formData.premium} onChange={(e) => setFormData({ ...formData, premium: e.target.value })} required /></div>
            <div className="form-group"><label className="form-label">Frequency *</label><select className="form-select" value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}><option>Monthly</option><option>Quarterly</option><option>Semi-Annual</option><option>Annual</option></select></div>
          </div>
          <div className="form-group"><label className="form-label">Coverage amount ($) *</label><input type="number" className="form-input" value={formData.coverageAmount} onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })} required /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Critical illness coverage ($)</label><input type="number" className="form-input" value={formData.criticalIllnessCoverage} onChange={(e) => setFormData({ ...formData, criticalIllnessCoverage: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Early CI coverage ($)</label><input type="number" className="form-input" value={formData.earlyCriticalIllnessCoverage} onChange={(e) => setFormData({ ...formData, earlyCriticalIllnessCoverage: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Start date *</label><input type="date" className="form-input" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required /></div>
            <div className="form-group"><label className="form-label">End date</label><input type="date" className="form-input" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}><option>Active</option><option>Pending</option><option>Lapsed</option><option>Cancelled</option></select></div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">{policy ? 'Update policy' : 'Add policy'}</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InteractionForm({ interaction, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(interaction || {
    date: new Date().toISOString().split('T')[0],
    type: 'Meeting', notes: '', followUp: ''
  });

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">{interaction ? 'Edit interaction' : 'Log client interaction'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date *</label><input type="date" className="form-input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required /></div>
            <div className="form-group"><label className="form-label">Type *</label><select className="form-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}><option>Meeting</option><option>Phone Call</option><option>Email</option><option>Follow-up</option><option>Policy Review</option></select></div>
          </div>
          <div className="form-group"><label className="form-label">Notes *</label><textarea className="form-textarea" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} required></textarea></div>
          <div className="form-group"><label className="form-label">Follow-up date</label><input type="date" className="form-input" value={formData.followUp} onChange={(e) => setFormData({ ...formData, followUp: e.target.value })} /></div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">Log interaction</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BankAccountForm({ balance, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(balance?.data || {
    balance: '', notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">{balance ? 'Edit bank balance' : 'Update bank balance'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Date of update *</label><input type="date" className="form-input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Current total bank balance ($) *</label><input type="number" className="form-input" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Notes *</label><input type="text" className="form-input" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} required /></div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">Update balance</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Reports({ reportData }) {
  if (!reportData) {
    return (
      <div className="empty-state">
        <p>No report generated yet. Go to Dashboard and click "Generate comprehensive report".</p>
      </div>
    );
  }

  return (
    <div>
      <div className="no-print" style={{ marginBottom: '24px' }}>
        <button className="btn btn-primary" onClick={() => window.print()}>Print / Save as PDF</button>
      </div>
      <div className="report-section">
        <h2>Insurance Portfolio Review Report</h2>
        <p style={{ fontSize: '13px', color: '#666' }}>Generated: {reportData.generatedDate}</p>
        <div className="stats-grid" style={{ marginTop: '24px' }}>
          <div className="stat-card"><div className="stat-label">Total clients</div><div className="stat-value">{reportData.totalClients}</div></div>
          <div className="stat-card"><div className="stat-label">Total policies</div><div className="stat-value">{reportData.totalPolicies}</div></div>
          <div className="stat-card"><div className="stat-label">Active policies</div><div className="stat-value">{reportData.activePolicies}</div></div>
          <div className="stat-card"><div className="stat-label">Total coverage</div><div className="stat-value">${parseInt(reportData.totalCoverage).toLocaleString()}</div></div>
        </div>
      </div>
      <div className="report-section">
        <h2>Client details</h2>
        {reportData.clients.map(client => (
          <div key={client.id} style={{ marginBottom: '32px' }}>
            <h3>{client.name}</h3>
            <p>{client.email} | {client.phone} | {client.occupation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientReport({ client, onClose }) {
  const income = parseFloat(client.annualIncome || 0);
  const totalCoverage = client.policies.reduce((sum, p) => sum + parseFloat(p.coverageAmount || 0), 0);
  const totalCICoverage = client.policies.reduce((sum, p) => sum + parseFloat(p.criticalIllnessCoverage || 0), 0);
  const currentAge = client.dateOfBirth ? new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear() : 40;

  return (
    <div className="modal" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-content" style={{ maxWidth: '1000px', maxHeight: '95vh' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '500', margin: 0, color: '#1e40af' }}>Personalized Insurance Report</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary btn-small" onClick={() => window.print()}>Print / Save PDF</button>
            <button className="btn btn-secondary btn-small" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="report-section">
          <h2>{client.name}'s Financial Protection Plan</h2>
          <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <div><strong>Email:</strong> {client.email}</div>
              <div><strong>Phone:</strong> {client.phone}</div>
              <div><strong>Age:</strong> {currentAge}</div>
              <div><strong>Occupation:</strong> {client.occupation}</div>
              <div><strong>Annual Income:</strong> ${income.toLocaleString()}</div>
              <div><strong>Risk Profile:</strong> {client.riskProfile}</div>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h2>Coverage Summary</h2>
          <table className="report-table">
            <thead>
              <tr>
                <th>Coverage Type</th>
                <th style={{ textAlign: 'right' }}>Current Coverage</th>
                <th style={{ textAlign: 'right' }}>Ratio to Income</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Death Benefit</strong></td>
                <td style={{ textAlign: 'right' }}>${totalCoverage.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>{income > 0 ? (totalCoverage / income).toFixed(1) : 0}x</td>
              </tr>
              <tr>
                <td><strong>Critical Illness</strong></td>
                <td style={{ textAlign: 'right' }}>${totalCICoverage.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>{income > 0 ? (totalCICoverage / income).toFixed(1) : 0}x</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="report-section">
          <h2>Policy Portfolio</h2>
          {client.policies.length === 0 ? <p>No policies on record.</p> : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Provider</th>
                  <th>Policy #</th>
                  <th>Premium</th>
                  <th>Coverage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {client.policies.map(policy => (
                  <tr key={policy.id}>
                    <td>{policy.type}</td>
                    <td>{policy.provider}</td>
                    <td>{policy.policyNumber}</td>
                    <td>${policy.premium}/{policy.frequency}</td>
                    <td>${parseInt(policy.coverageAmount).toLocaleString()}</td>
                    <td>{policy.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
