import { z } from "zod";

export const labFruitSchema = z.object({
  data: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
    message: "A data é obrigatória",
  }),
  variedade: z.string().min(1, "informe a variedade da fruta"),
  area: z.string().min(1, "Informe a Área"),
  linha: z.string().min(1, "Informe a linha"),

  naoh: z.coerce.number().min(0, "NaOH deve ser positivo"),
  brix: z.coerce.number().min(0, "Brix deve ser positivo"),
  acidez: z.coerce
    .number()
    .min(0)
    .max(100, "Acidez deve ser porcentagem (0-100)"),
  ratio: z.coerce.number(), 
  ph: z.coerce.number().min(0).max(14, "O pH deve estar entre 0 e 14"),
});

export type LabFruitFormData = z.infer<typeof labFruitSchema>;
