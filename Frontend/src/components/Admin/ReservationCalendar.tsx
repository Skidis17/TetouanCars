import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Reservation } from '../../types/reservation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReservationEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    reservation: Reservation;
  };
}

interface ReservationCalendarProps {
  reservations: Reservation[];
  onReservationClick: (reservation: Reservation) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ 
  reservations,
  onReservationClick 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' };
      case 'acceptee':
        return { bg: '#D1FAE5', border: '#10B981', text: '#065F46' };
      case 'refusee':
        return { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' };
      case 'annulee':
        return { bg: '#E5E7EB', border: '#9CA3AF', text: '#1F2937' };
      case 'terminee':
        return { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' };
      default:
        return { bg: '#E5E7EB', border: '#9CA3AF', text: '#1F2937' };
    }
  };

  const events: ReservationEvent[] = reservations.map(reservation => {
    const colors = getStatusColor(reservation.statut);
    const startDate = new Date(reservation.date_debut);
    const endDate = new Date(reservation.date_fin);
    
    // End date is exclusive in FullCalendar, so we need to add a day
    endDate.setDate(endDate.getDate() + 1);
    
    return {
      id: reservation._id,
      title: `Réservation #${reservation._id.substring(0, 8)}`,
      start: startDate,
      end: endDate,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: {
        reservation
      },
    };
  });

  const handleEventClick = (clickInfo: any) => {
    onReservationClick(clickInfo.event.extendedProps.reservation);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        locale={fr}
        height="auto"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
        dayMaxEvents={3}
        moreLinkText={count => `+${count} plus`}
        firstDay={1}
        buttonText={{
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine"
        }}
      />
    </div>
  );
};

export default ReservationCalendar;