import { z } from "zod";

export const waterQualitySchema = z.object({
  data: z.date(),
  responsavel: z.string().min(1, "O responsável é obrigatório"),
  turno: z.enum(["Manhã", "Tarde"], {
  message: "Selecione o turno",
}),
  
  hora: z.string().min(1, "Horário obrigatório"),
  
  ph_01: z.coerce.number().optional(),
  ph_03: z.coerce.number().optional(),
  
  cloro_02: z.coerce.number().optional(),
  cloro_03: z.coerce.number().optional(),
  
  turbidez_01: z.coerce.number().optional(),
  turbidez_03: z.coerce.number().optional(),
  
  obs: z.string().optional(),
});

export type WaterQualityFormData = z.infer<typeof waterQualitySchema>;