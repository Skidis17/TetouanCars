import { useState, useEffect, useMemo } from 'react';
import { Client, Filters } from '../types/client';

export const useClientFilters = (clients: Client[]) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    ville: "",
    permisType: "",
    dateStart: "",
    dateEnd: ""
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Client | 'adresse.ville' | null;
    direction: 'ascending' | 'descending';
  }>({
    key: null,
    direction: 'ascending'
  });
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const cities = new Set<string>();
    const permisTypes = new Set<string>();
    
    clients.forEach(client => {
      if (client.adresse?.ville) cities.add(client.adresse.ville);
      if (client.permis_conduire) permisTypes.add(client.permis_conduire);
    });
    
    return {
      cities: Array.from(cities).sort(),
      permisTypes: Array.from(permisTypes).sort()
    };
  }, [clients]);

  // Apply filters and search
  const filteredClients = useMemo(() => {
    let result = [...clients];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(client => 
        client.nom.toLowerCase().includes(term) ||
        client.prenom.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.telephone.includes(term) ||
        (client.adresse?.ville && client.adresse.ville.toLowerCase().includes(term))
      );
    }

    // City filter
    if (filters.ville) {
      result = result.filter(client => 
        client.adresse?.ville?.toLowerCase().includes(filters.ville.toLowerCase())
      );
    }

    // Permis type filter
    if (filters.permisType) {
      result = result.filter(client => 
        client.permis_conduire === filters.permisType
      );
    }

    // Date range filter
    if (filters.dateStart && filters.dateEnd) {
      const start = new Date(filters.dateStart);
      const end = new Date(filters.dateEnd);
      end.setHours(23, 59, 59); // Include the end date fully

      result = result.filter(client => {
        const date = new Date(client.date_ajout);
        return date >= start && date <= end;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue, bValue;
        
        // Handle nested properties like 'adresse.ville'
        if (sortConfig.key === 'adresse.ville') {
          aValue = a.adresse?.ville || '';
          bValue = b.adresse?.ville || '';
        } else {
          aValue = a[sortConfig.key as keyof Client] || '';
          bValue = b[sortConfig.key as keyof Client] || '';
        }

        // Convert to lowercase if string
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        
        // Handle dates
        if (sortConfig.key === 'date_ajout') {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [clients, searchTerm, filters, sortConfig]);

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      ville: "",
      permisType: "",
      dateStart: "",
      dateEnd: ""
    });
    setSortConfig({ key: null, direction: 'ascending' });
  };

  const requestSort = (key: keyof Client | 'adresse.ville') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredClients,
    resetFilters,
    filtersOpen,
    setFiltersOpen,
    filterOptions,
    sortConfig,
    requestSort
  };
};