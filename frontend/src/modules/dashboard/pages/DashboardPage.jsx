import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AddDeviceModal from "../../equipos/components/AddDeviceModal";
import api from "../../../shared/services/api";
import styles from "../styles/dashboard.module.css";

const DashboardPage = () => {
  const {searchTerm, setSearchTerm} = useDashboard();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const handleAddDevice = () => {
    setIsAddModalOpen(true);
  };

  const handleDeviceAdded = useCallback(() => {
    setIsAddModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleRefreshStatus = async () => {
    try {
      setRefreshing(true);
      await api.updateDeviceStatus();
      setRefreshKey((prev) => prev + 1);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error al actualizar estados:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const outletContext = {
    refreshKey,
    searchTerm,
    clearSearch: () => setSearchTerm(""),
  };

  return (
    <div className={styles.homeContenedor}>
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className={styles.mainLayout}>
        <Sidebar 
          onAddDevice={handleAddDevice}
          onRefreshStatus={handleRefreshStatus}
          refreshing={refreshing}
          lastUpdate={lastUpdate}
        />

        <main className={styles.contenido}>
          <Outlet context={outletContext} />
        </main>
      </div>

      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDeviceAdded={handleDeviceAdded}
      />
    </div>
  );
};

export default DashboardPage;