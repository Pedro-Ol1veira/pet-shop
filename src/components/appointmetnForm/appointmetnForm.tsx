'use client';

import z from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel, } from "../ui/field";
import { CalendarIcon, ChevronDownIcon, Clock, Dog, Loader2, Phone, User } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from "../ui/input-group";
import { IMaskInput } from "react-imask";
import { format, setHours, setMinutes, startOfToday } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { createAppointment } from "@/app/actions";
import { useState } from "react";

const appointmentFormSchema = z.object({
    tutorName: z.string().min(3, "O nome do tutor é obrigatório"),
    petName: z.string().min(3, "O nome do pet é obrigatório"),
    phone: z.string().min(11, "O telefone é obrigatório").max(15, "Telefone inválido"),
    description: z.string(),
    scheduleAt: z
        .date({
            error: "A data é obrigatoria"
        })
        .min(startOfToday(), "A data não pode ser no passado"),
    time: z.string().min(1, "A hora é obrigatória")
}).refine((data) => {
    const [hour, minute] = data.time.split(":");
    const scheduleDateTime = setMinutes(setHours(data.scheduleAt, Number(hour)), Number(minute));

    return scheduleDateTime > new Date();
}, {
    path: ['time'],
    error: "O horario não pode ser no passado"
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export const AppointmentForm = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentFormSchema),
        defaultValues: {
            tutorName: '',
            petName: '',
            phone: '',
            description: '',
            scheduleAt: undefined,
            time: ''
        },
    });

    const onSubmit = async (data: AppointmentFormValues) => {
        const [ hour, minute ] = data.time.split(":");
        const scheduleAt = new Date(data.scheduleAt);
        scheduleAt.setHours(Number(hour), Number(minute), 0, 0);
        
        const result = await createAppointment({
            ...data,
            scheduleAt,
        })

        if(result?.error) {
            toast.error(result.error);
            return;
        }
        
        toast.success(`Agendamento criado con sucesso!`);
        setIsOpen(false);
        form.reset();
        
    };
    
    return(
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="brand">Novo Agendamento</Button>
            </DialogTrigger>

            <DialogContent variant="appointment" overlayVariant="blurred" showCloseButton>
                <DialogHeader>
                    <DialogTitle size="modal">Agende um atendimento</DialogTitle>
                    <DialogDescription size="modal">
                        Preencha os dados do cliente para realizar o agendamento:
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} id="form-rhf">
                    <FieldGroup>
                        <Controller control={form.control} name="tutorName" 
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-label-medium-size text-content-primary">Nome do Tutor</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <span className="flex items-center justify-center w-6 h-6">
                                                <User className="w-full h-full text-content-brand" />
                                            </span>
                                        </InputGroupAddon>
                                        <InputGroupInput 
                                            placeholder="Nome do tutor"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            )}
                        />

                        <Controller control={form.control} name="petName" 
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-label-medium-size text-content-primary">Nome do Pet</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <span className="flex items-center justify-center w-6 h-6">
                                                <Dog className="w-full h-full text-content-brand" />
                                            </span>
                                        </InputGroupAddon>
                                        <InputGroupInput 
                                            placeholder="Nome do pet"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            )}
                        />
                        
                        <Controller control={form.control} name="phone" 
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-label-medium-size text-content-primary">Telefone</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <span className="flex items-center justify-center w-6 h-6">
                                                <Phone className="w-full h-full text-content-brand" />
                                            </span>
                                        </InputGroupAddon>
                                        <IMaskInput 
                                            placeholder="(99) 99999-9999"
                                            mask="(00) 00000-0000"
                                            className="w-full pl-2"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            )}
                        />


                        <Controller control={form.control} name="description" 
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-label-medium-size text-content-primary">Descrição do serviço</FieldLabel>
                                    <InputGroupTextarea 
                                        placeholder="Descrição do serviço"
                                        aria-invalid={fieldState.invalid}
                                        {...field}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            )}
                        />

                        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                            <Controller control={form.control} name="scheduleAt"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="flex flex-col">
                                        <FieldLabel className="text-label-medium-size text-content-primary">Data</FieldLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className={cn(
                                                    'w-full justify-between text-left font-normal bg-background-tertiary border-border-primary text-content-primary hover:bg-background-tertiary hover:border-border-secondary hover:text-content-primary focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand focus:border-border-brand focus-visible:border-border-brand',
                                                    !field.value && 'text-content-secondary'
                                                )}>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="h-4 w-4 text-content-brand"/>
                                                        {field.value ? (
                                                            format(field.value, 'dd/MM/yyyy')
                                                        ): (
                                                            <span>Selecione uma data</span>
                                                        )}
                                                    </div>
                                                    <ChevronDownIcon className="opacity-50 h-4 w-4"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date < startOfToday()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                    </Field>
                                )}
                            />
                            <Controller control={form.control} name="time"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-label-medium-size text-content-primary">Hora</FieldLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-content-brand"/>
                                                    <SelectValue placeholder="--:-- --"/>
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TIME_OPTIONS.map((time) => (
                                                    <SelectItem key={time} value={time}>
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                    </Field>
                                )}
                            />
                        </div>
                    </FieldGroup>
                    <div className="flex justify-end py-4">
                        <Button type="submit" variant="brand" disabled={ form.formState.isSubmitting }>
                            {form.formState.isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Agendar
                        </Button>
                    </div>
                </form>
            </DialogContent>

        </Dialog>
    )
}

const generateTimeOptions = (): string[] => {
    const times = [];

    for(let hour = 9; hour <= 21; hour++) {
        for(let minute = 0; minute < 60; minute += 30) {
            if(hour == 21 && minute > 0) break;
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            times.push(timeString);
        }
    }

    return times;
}

const TIME_OPTIONS = generateTimeOptions();