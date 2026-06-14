import { AppointmentPeriodDay, AppointmentPeriod, Appointment } from "@/types/appointments";
import { Appointment as AppointmentPrisma } from "@/generated/prisma/browser";

export const appointments: AppointmentPrisma[] = [
  {
    id: '1',
    petName: "Rex",
    tutorName: "João Silva",
    description: "Banho e Tosa",
    phone: "(11) 98765-4321",
    date: new Date("2024-06-15T10:00:00Z"),
  },
  {
    id: '2',
    petName: "Mia",
    tutorName: "Maria Oliveira",
    phone: "(21) 91234-5678",
    description: "Consulta Veterinária",
    date: new Date("2024-06-15T14:00:00Z"),
  },
  {
    id: '3',
    petName: "Luna",
    tutorName: "Carlos Pereira",
    phone: "(31) 99876-5432",
    description: "Vacinação",
    date: new Date("2024-06-15T16:00:00Z"),
  },
  {
    id: '4',
    petName: "Bolt",
    tutorName: "Ana Costa",
    phone: "(41) 98765-4321",
    description: "Consulta de Rotina",
    date: new Date("2024-06-15T18:00:00Z"),
  }
];

export function getPeriod(hour: number): AppointmentPeriodDay {
  if (hour >= 9 && hour < 12) return "morning";
  else if (hour >= 12 && hour < 18) return "afternoon";
  else return "evening";

}

export function groupAppointmentsByPeriod(appointments: AppointmentPrisma[]): AppointmentPeriod[] {
  const transformedAppointments: Appointment[] = appointments.map((apt) => ({
    ...apt,
    time: apt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    service: apt.description,
    period: getPeriod(apt.date.getHours()),
    scheduleAt: apt.date,
  }));

  const morningAppointments = transformedAppointments.filter(apt => apt.period === 'morning');
  const afternoonAppointments = transformedAppointments.filter(apt => apt.period === 'afternoon');
  const eveningAppointments = transformedAppointments.filter(apt => apt.period === 'evening');
  
  return [
    {
      title: "Manhã",
      type: "morning",
      timeRange: "09:00 - 12:00",
      appointments: morningAppointments,
    },
    {
      title: "Tarde",
      type: "afternoon",
      timeRange: "13:00 - 18:00",
      appointments: afternoonAppointments,
    },
    {
      title: "Noite",
      type: "evening",
      timeRange: "19:00 - 21:00",
      appointments: eveningAppointments,
    }
  ]
}