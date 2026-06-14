import { PeriodSection } from "@/components/periodSection";
import { appointments, groupAppointmentsByPeriod } from "@/utils/appointmentsUtils";


export default async function Home() {
  // const appointments = await prisma.appointment.findMany(); 

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
    </div>
  );
}
