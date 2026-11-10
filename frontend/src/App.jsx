import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useStore } from './store/useStore';
import { NavySidebar } from './components/layout/NavySidebar';
import { TopBreadcrumb } from './components/layout/TopBreadcrumb';
import { MultiFloorDashboard } from './components/multifloor/MultiFloorDashboard';
import { RoomDrawer } from './components/room/RoomDrawer';
import { IntelligencePanel } from './components/intelligence/IntelligencePanel';
import { FaultInjectorModal } from './components/alerts/FaultInjectorModal';
import { AlertsFeed } from './components/alerts/AlertsFeed';
import { 
  SiteOverviewPage, 
  SecurityHubPage, 
  EnvironmentalPage, 
  AssetManagementPage, 
  SustainabilityPage, 
  ReportsPage 
} from './components/pages/OtherPages';

const BACKEND_URL = 'http://localhost:5001';

export default function App() {
  const { 
    activeNav, 
    fetchInitialData, 
    updateTelemetry 
  } = useStore();

  useEffect(() => {
    // 1. Fetch initial building and room topology
    fetchInitialData();

    // 2. Parse URL query params for demo script deep-linking
    const params = new URLSearchParams(window.location.search);
    const floorParam = params.get('floor');
    const roomParam = params.get('room');
    const navParam = params.get('nav');
    const intelParam = params.get('intel');
    const simParam = params.get('sim');

    if (floorParam) {
      useStore.getState().setSelectedFloor(floorParam === 'all' ? null : parseInt(floorParam));
    }
    if (roomParam) {
      useStore.getState().setSelectedRoom(roomParam);
    }
    if (navParam) {
      useStore.getState().setActiveNav(navParam);
    }
    if (intelParam) {
      useStore.getState().setActiveIntelTab(intelParam);
    }
    if (simParam) {
      useStore.getState().runSimulation(simParam, floorParam ? parseInt(floorParam) : 5);
    }

    // 3. Connect to Socket.io real-time telemetry stream
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10
    });

    socket.on('connect', () => {
      console.log('🔌 Connected to BuildingOS backend WebSocket stream');
    });

    socket.on('building:telemetry', (data) => {
      updateTelemetry(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Determine current page view
  const renderCurrentView = () => {
    switch (activeNav) {
      case 'multifloor':
        return <MultiFloorDashboard />;
      case 'site_overview':
        return <SiteOverviewPage />;
      case 'security':
        return <SecurityHubPage />;
      case 'environmental':
        return <EnvironmentalPage />;
      case 'assets':
        return <AssetManagementPage />;
      case 'sustainability':
        return <SustainabilityPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <MultiFloorDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans">
      {/* 1. Left Navy Sidebar */}
      <NavySidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Breadcrumb Navigation & Loop Indicator */}
        <TopBreadcrumb />

        {/* Dynamic Page View */}
        <main className="flex-1 overflow-auto bg-background">
          {renderCurrentView()}
        </main>
      </div>

      {/* 3. Slide-Over Drawers & Modals */}
      <RoomDrawer />
      <IntelligencePanel />
      <FaultInjectorModal />
      <AlertsFeed />
    </div>
  );
}
