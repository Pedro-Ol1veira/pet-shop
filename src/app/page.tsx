import { AppointmentForm } from "@/components/appointmetnForm/appointmetnForm";
import { DatePicker } from "@/components/datePicker";
import { PeriodSection } from "@/components/periodSection";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { groupAppointmentsByPeriod } from "@/utils/appointmentsUtils";
import { endOfDay, parseISO, startOfDay } from "date-fns";


export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const selectedDate = date ? parseISO(date) : new Date();

  const appointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: startOfDay(selectedDate),
        lte: endOfDay(selectedDate),
      }
    },
    orderBy: {
      date: 'asc'
    }
  }); 
  const periods = groupAppointmentsByPeriod(appointments);
  
  return (
    <div className="bg-backgraund-primary p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-title-size text-content-primary mb-2">Sua Agenda</h1>
          <p className="text-paragraph-medium-size text-content-secondary">
            Aqui voce pode ver todos os clientes agendados para hoje.
          </p>
        </div>
        <div className="hidden  md:flex items-center gap-4">
          <DatePicker />
        </div>
      </div>
      <div className="mt-3 mb-8 md:hidden">
        <DatePicker />
      </div>
      <div className="pb-24 md:pb-0">
        {periods.map((period, index) => (
          <PeriodSection period={period} key={index}/>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-[#23242C] py-4.5 px 6 md:bottom-6 
        md:right-6 md:left-auto md:top-auto md:w-auto md:bg-transparent md:p-0">
        <AppointmentForm>
          <Button variant="brand">Novo Agendamento</Button>
        </AppointmentForm>
      </div>
    </div>
  );
}
