'use server';

import { prisma } from "@/lib/prisma";
import { error } from "console";
import { revalidatePath } from "next/cache";
import z from "zod";

const appointmentSchema = z.object({
    tutorName: z.string(),
    petName: z.string(),
    phone: z.string(),
    description: z.string(),
    scheduleAt: z.date()
})

function calculatePeriod(hour: number) {
    const isMorning = hour >= 9 && hour < 12;
    const isAfternoon = hour >= 13 && hour < 18;
    const isEvening = hour >= 19 && hour < 21;

    return {
        isMorning,
        isAfternoon,
        isEvening
    }
}

type AppointmentData = z.infer<typeof appointmentSchema>;

export async function createAppointment(data: AppointmentData) {
    try {
        const parsedData = appointmentSchema.parse(data);

        const { scheduleAt } = parsedData;
        const hour = scheduleAt.getHours();

        const { isAfternoon, isEvening, isMorning } = calculatePeriod(hour);

        if(!isMorning && !isAfternoon && !isEvening) return {
            error: "Agendamentos so podem ser feito entre 9h e 12h ou 13h e 18h ou 19h e 21h"
        }
        
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                date: scheduleAt
            }
        });

        if(existingAppointment) return {
            error: "Este horario já esta reservado para atendimento"
        };

        await prisma.appointment.create({
            data: {
                description: parsedData.description,
                petName: parsedData.petName,
                phone: parsedData.phone,
                tutorName: parsedData.tutorName,
                date: scheduleAt,
            }
        });

        revalidatePath('/');

    } catch (error) {
        console.log(error);
        return {
            error: "Erro ao criar agendamento. Tente novamente."
        }
    }
    
}

export async function updateAppointment(id: string, data: AppointmentData) {
    try {
        const parsedData = appointmentSchema.parse(data);

        const { scheduleAt } = parsedData;
        const hour = scheduleAt.getHours();

        const { isAfternoon, isEvening, isMorning } = calculatePeriod(hour);

        if(!isMorning && !isAfternoon && !isEvening) return {
            error: "Agendamentos so podem ser feito entre 9h e 12h ou 13h e 18h ou 19h e 21h"
        }
        
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                date: scheduleAt,
                id: {
                    not: id
                }
            }
        });

        if(existingAppointment) return {
            error: "Este horario já esta reservado para atendimento"
        };

        await prisma.appointment.update({
            where: {
                id,
            },
            data: {
                description: parsedData.description,
                petName: parsedData.petName,
                phone: parsedData.phone,
                tutorName: parsedData.tutorName,
                date: scheduleAt,
            }
        });

        revalidatePath('/');
        
    } catch (error) {
        console.log(error);
        return {
            error: "Erro ao atualizar agendamento. Tente novamente."
        }
    }
}



export async function deleteAppointment(id: string) {
    try {
        await prisma.appointment.delete({
            where: {
                id
            }
        });

        revalidatePath('/');
    } catch (error) {
        console.log(error);
        return {
            error: "Erro ao remover agendamento. Tente novamente."
        }
    }
}