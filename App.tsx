
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TutorialProvider } from './context/TutorialContext'; // Import Provider
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { IdeationModule } from './pages/IdeationModule';
import { MarketResearchModule } from './pages/MarketResearchModule';
import { ProductModule } from './pages/ProductModule';
import { InvestorModule } from './pages/InvestorModule';
import { MarketingModule } from './pages/MarketingModule';
import { SalesModule } from './pages/SalesModule';
import { FinanceModule } from './pages/FinanceModule';
import { OpsModule } from './pages/OpsModule';
import { HRModule } from './pages/HRModule';
import { SupportModule } from './pages/SupportModule';
import { AnalyticsModule } from './pages/AnalyticsModule';
import { DataModule } from './pages/DataModule';
import { LabModule } from './pages/LabModule';
import { CommunityModule } from './pages/CommunityModule';
import { SupplyModule } from './pages/SupplyModule';
import { SecurityModule } from './pages/SecurityModule';
import { ModulePlaceholder } from './pages/ModulePlaceholder';
import { BillingPage } from './pages/BillingPage';
import { AgentCommandCenter } from './pages/AgentCommandCenter';
import { MarketplacePage } from './pages/MarketplacePage';
import { DeveloperPage } from './pages/DeveloperPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { MCPPage } from './pages/MCPPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { TutorialGuide } from './components/tutorial/TutorialGuide'; // Import Guide
import * as Icons from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-primary-600">
        <Icons.Loader2 size={48} className="animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TutorialProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/*" element={
              <ProtectedRoute>
                <AppLayout>
                  <TutorialGuide />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/billing" element={<BillingPage />} />
                    
                    {/* Phase 0 & 1 Routes */}
                    <Route path="/ideation" element={<IdeationModule />} />
                    <Route path="/market-research" element={<MarketResearchModule />} />
                    <Route path="/product" element={<ProductModule />} />
                    <Route path="/investor" element={<InvestorModule />} />
                    <Route path="/marketing" element={<MarketingModule />} />
                    <Route path="/sales" element={<SalesModule />} />
                    <Route path="/finance" element={<FinanceModule />} />

                    {/* Phase 2 Routes */}
                    <Route path="/ops" element={<OpsModule />} />
                    <Route path="/hr" element={<HRModule />} />
                    <Route path="/support" element={<SupportModule />} />
                    <Route path="/analytics" element={<AnalyticsModule />} />
                    <Route path="/data" element={<DataModule />} />
                    <Route path="/lab" element={<LabModule />} />
                    <Route path="/community" element={<CommunityModule />} />
                    <Route path="/supply" element={<SupplyModule />} />
                    <Route path="/security" element={<SecurityModule />} />
                    
                    {/* Phase 4+ Routes */}
                    <Route path="/agents" element={<AgentCommandCenter />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/developers" element={<DeveloperPage />} />
                    <Route path="/audit" element={<AuditLogsPage />} />
                    <Route path="/mcp" element={<MCPPage />} />
                    
                    {/* Documentation Routes */}
                    <Route path="/docs" element={<DocumentationPage />} />
                    <Route path="/docs/:slug" element={<DocumentationPage />} />

                    {/* Fallback */}
                    <Route path="/strategy" element={<ModulePlaceholder />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </HashRouter>
      </TutorialProvider>
    </AuthProvider>
  );
};

export default App;
