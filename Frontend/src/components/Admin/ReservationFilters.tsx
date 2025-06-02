import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { ReservationStatus } from '../../types/reservation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FilterOptions {
  status: ReservationStatus | 'all';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchTerm: string;
}

interface ReservationFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  defaultFilters: FilterOptions;
}

const ReservationFilters: React.FC<ReservationFiltersProps> = ({ 
  onFilterChange, 
  defaultFilters 
}) => {
  const [filters, setFilters] = React.useState<FilterOptions>(defaultFilters);
  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'en attente', label: 'En attente' },
    { value: 'acceptée', label: 'Acceptée' },
    { value: 'refusee', label: 'Refusée' },
    { value: 'annulee', label: 'Annulée' },
    { value: 'terminee', label: 'Terminée' }
  ];

  const handleStatusChange = (value: string) => {
    const newFilters = {
      ...filters,
      status: value as ReservationStatus | 'all'
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    const newFilters = {
      ...filters,
      dateRange: {
        ...filters.dateRange,
        start: date || null
      }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setStartDateOpen(false);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    const newFilters = {
      ...filters,
      dateRange: {
        ...filters.dateRange,
        end: date || null
      }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setEndDateOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      searchTerm: e.target.value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultValues: FilterOptions = {
      status: 'all',
      dateRange: {
        start: null,
        end: null
      },
      searchTerm: ''
    };
    setFilters(defaultValues);
    onFilterChange(defaultValues);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par ID, client, véhicule..."
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
          {filters.searchTerm && (
            <button
              onClick={() => handleSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span className="text-gray-400 hover:text-gray-600">
                ×
              </span>
            </button>
          )}
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Status Select */}
          <Select
            value={filters.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Date Range Pickers */}
          <div className="flex space-x-2">
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {filters.dateRange.start ? (
                    format(filters.dateRange.start, 'dd/MM/yyyy', { locale: fr })
                  ) : (
                    "Date début"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.dateRange.start || undefined}
                  onSelect={handleStartDateChange}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
            
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {filters.dateRange.end ? (
                    format(filters.dateRange.end, 'dd/MM/yyyy', { locale: fr })
                  ) : (
                    "Date fin"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.dateRange.end || undefined}
                  onSelect={handleEndDateChange}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Clear Filters Button */}
          <Button 
            variant="outline"
            onClick={clearFilters}
            className="text-sm"
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReservationFilters;