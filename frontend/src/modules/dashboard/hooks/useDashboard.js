import { useState, useCallback } from "react";

export const useDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    [],
  );

  const toggleSearch = useCallback(() => {
    setIsSearchVisible((prev) => {
      if (prev) {
        setSearchTerm("");
      }
      return !prev;
    });
  }, []);

  const toggleUserMenu = useCallback(
    () => setIsUserMenuOpen((prev) => !prev),
    [],
  );

  return {
    isSidebarOpen,
    isSearchVisible,
    isUserMenuOpen,
    searchTerm,
    setSearchTerm,
    toggleSidebar,
    toggleSearch,
    toggleUserMenu,
    setIsUserMenuOpen,
  };
};
