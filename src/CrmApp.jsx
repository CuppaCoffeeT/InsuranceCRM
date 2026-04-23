import { useState } from 'react';
import { Alert, Button, Nav, Spinner, Tab } from 'react-bootstrap';
import { useClients } from './hooks/useClients';
import { useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import ClientsPanel from './components/ClientsPanel';
import Reports from './components/Reports';
import ClientFormModal from './components/modals/ClientFormModal';
import PolicyFormModal from './components/modals/PolicyFormModal';
import InteractionFormModal from './components/modals/InteractionFormModal';
import BankAccountFormModal from './components/modals/BankAccountFormModal';
import ClientReportModal from './components/ClientReportModal';

export default function CrmApp() {
  const { user, signOut } = useAuth();
  const crm = useClients();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [portfolioReport, setPortfolioReport] = useState(null);

  const [editingClient, setEditingClient] = useState(null);
  const [clientFormOpen, setClientFormOpen] = useState(false);

  const [policyClient, setPolicyClient] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [policyFormOpen, setPolicyFormOpen] = useState(false);

  const [interactionClient, setInteractionClient] = useState(null);
  const [editingInteraction, setEditingInteraction] = useState(null);
  const [interactionFormOpen, setInteractionFormOpen] = useState(false);

  const [bankClient, setBankClient] = useState(null);
  const [editingBank, setEditingBank] = useState(null);
  const [bankFormOpen, setBankFormOpen] = useState(false);

  const [reportClient, setReportClient] = useState(null);

  const openAddClient = () => {
    setEditingClient(null);
    setClientFormOpen(true);
  };
  const openEditClient = (client) => {
    setEditingClient(client);
    setClientFormOpen(true);
  };
  const handleSubmitClient = (data) => {
    if (editingClient) crm.updateClient(editingClient.id, data);
    else crm.addClient(data);
    setClientFormOpen(false);
    setEditingClient(null);
  };

  const openAddPolicy = (client) => {
    setPolicyClient(client);
    setEditingPolicy(null);
    setPolicyFormOpen(true);
  };
  const openEditPolicy = (client, policy) => {
    setPolicyClient(client);
    setEditingPolicy(policy);
    setPolicyFormOpen(true);
  };
  const handleSubmitPolicy = (data) => {
    if (editingPolicy) crm.updatePolicy(policyClient.id, editingPolicy.id, data);
    else crm.addPolicy(policyClient.id, data);
    setPolicyFormOpen(false);
    setPolicyClient(null);
    setEditingPolicy(null);
  };

  const openAddInteraction = (client) => {
    setInteractionClient(client);
    setEditingInteraction(null);
    setInteractionFormOpen(true);
  };
  const openEditInteraction = (client, interaction) => {
    setInteractionClient(client);
    setEditingInteraction(interaction);
    setInteractionFormOpen(true);
  };
  const handleSubmitInteraction = (data) => {
    if (editingInteraction)
      crm.updateInteraction(interactionClient.id, editingInteraction.id, data);
    else crm.addInteraction(interactionClient.id, data);
    setInteractionFormOpen(false);
    setInteractionClient(null);
    setEditingInteraction(null);
  };

  const openAddBank = (client) => {
    setBankClient(client);
    setEditingBank(null);
    setBankFormOpen(true);
  };
  const openEditBank = (client, record, index) => {
    setBankClient(client);
    setEditingBank({ data: record, index });
    setBankFormOpen(true);
  };
  const handleSubmitBank = (data) => {
    if (editingBank) crm.updateBankBalance(bankClient.id, editingBank.index, data);
    else crm.addBankBalance(bankClient.id, data);
    setBankFormOpen(false);
    setBankClient(null);
    setEditingBank(null);
  };

  const handleGeneratePortfolioReport = () => {
    const totalPolicies = crm.clients.reduce((s, c) => s + c.policies.length, 0);
    const activePolicies = crm.clients.reduce(
      (s, c) => s + c.policies.filter((p) => p.status === 'Active').length,
      0,
    );
    const totalPremium = crm.clients.reduce(
      (s, c) => s + c.policies.reduce((ps, p) => ps + parseFloat(p.premium || 0), 0),
      0,
    );
    const totalCoverage = crm.clients.reduce(
      (s, c) => s + c.policies.reduce((ps, p) => ps + parseFloat(p.coverageAmount || 0), 0),
      0,
    );

    setPortfolioReport({
      generatedDate: new Date().toLocaleString(),
      totalClients: crm.clients.length,
      totalPolicies,
      activePolicies,
      totalPremium,
      totalCoverage,
      clients: crm.clients,
    });
    setActiveTab('reports');
  };

  const stats = {
    totalClients: crm.clients.length,
    activePolicies: crm.clients.reduce(
      (s, c) => s + c.policies.filter((p) => p.status === 'Active').length,
      0,
    ),
    totalPremium: crm.clients
      .reduce((s, c) => s + c.policies.reduce((ps, p) => ps + parseFloat(p.premium || 0), 0), 0)
      .toFixed(0),
    upcomingFollowUps: crm.clients.reduce(
      (s, c) =>
        s +
        c.interactions.filter((i) => i.followUp && new Date(i.followUp) > new Date()).length,
      0,
    ),
  };

  return (
    <div className="app-shell">
      <div className="page-header d-flex justify-content-between align-items-center gap-2">
        <div className="min-w-0">
          <h1>Insurance Advisor CRM</h1>
          <p className="d-none d-sm-block">
            Manage your clients, policies, and generate comprehensive reports
          </p>
        </div>
        <div className="text-end small flex-shrink-0">
          {user && (
            <div className="text-muted mb-1 d-none d-sm-block">Signed in as {user.email}</div>
          )}
          <Button variant="outline-secondary" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>

      {crm.error && (
        <Alert variant="danger" className="no-print">
          Failed to load data: {crm.error}
        </Alert>
      )}
      {crm.loading && crm.clients.length === 0 && (
        <div className="text-center py-4">
          <Spinner animation="border" size="sm" /> Loading clients…
        </div>
      )}

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="pills" className="mb-3 no-print gap-2">
          <Nav.Item>
            <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="clients">Clients</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="reports">Reports</Nav.Link>
          </Nav.Item>
        </Nav>

        <div className="content-card">
          <Tab.Content>
            <Tab.Pane eventKey="dashboard">
              <Dashboard stats={stats} onGenerateReport={handleGeneratePortfolioReport} />
            </Tab.Pane>
            <Tab.Pane eventKey="clients">
              <ClientsPanel
                clients={crm.clients}
                onAddClient={openAddClient}
                onEditClient={openEditClient}
                onDeleteClient={crm.deleteClient}
                onAddPolicy={openAddPolicy}
                onEditPolicy={openEditPolicy}
                onDeletePolicy={crm.deletePolicy}
                onAddInteraction={openAddInteraction}
                onEditInteraction={openEditInteraction}
                onDeleteInteraction={crm.deleteInteraction}
                onAddBank={openAddBank}
                onEditBank={openEditBank}
                onDeleteBank={crm.deleteBankBalance}
                onGenerateClientReport={setReportClient}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="reports">
              <Reports report={portfolioReport} />
            </Tab.Pane>
          </Tab.Content>
        </div>
      </Tab.Container>

      <ClientFormModal
        show={clientFormOpen}
        client={editingClient}
        onSubmit={handleSubmitClient}
        onCancel={() => {
          setClientFormOpen(false);
          setEditingClient(null);
        }}
      />
      <PolicyFormModal
        show={policyFormOpen}
        policy={editingPolicy}
        onSubmit={handleSubmitPolicy}
        onCancel={() => {
          setPolicyFormOpen(false);
          setPolicyClient(null);
          setEditingPolicy(null);
        }}
      />
      <InteractionFormModal
        show={interactionFormOpen}
        interaction={editingInteraction}
        onSubmit={handleSubmitInteraction}
        onCancel={() => {
          setInteractionFormOpen(false);
          setInteractionClient(null);
          setEditingInteraction(null);
        }}
      />
      <BankAccountFormModal
        show={bankFormOpen}
        balance={editingBank}
        onSubmit={handleSubmitBank}
        onCancel={() => {
          setBankFormOpen(false);
          setBankClient(null);
          setEditingBank(null);
        }}
      />
      <ClientReportModal client={reportClient} onClose={() => setReportClient(null)} />
    </div>
  );
}
