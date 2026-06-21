import { AppointmentForm } from "@/components/appointmetnForm/appointmetnForm";
import { PeriodSection } from "@/components/periodSection";
import { prisma } from "@/lib/prisma";
import { appointments, groupAppointmentsByPeriod } from "@/utils/appointmentsUtils";


export default async function Home() {
  const appointments = await prisma.appointment.findMany(); 
  
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
      </div>
      <div className="pb-24 md:pb-0">
        {periods.map((period, index) => (
          <PeriodSection period={period} key={index}/>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-[#23242C] py-4.5 px 6 md:bottom-6 
        md:right-6 md:left-auto md:top-auto md:w-auto md:bg-transparent md:p-0">
        <AppointmentForm />
      </div>
    </div>
  );
}
