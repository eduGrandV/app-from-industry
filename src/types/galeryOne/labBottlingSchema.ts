import { z } from "zod";

export const labBottlingSchema = z.object({
  data: z.date(),
  lote: z.string().min(1, "Lote é obrigatório"),
  modelo_garrafa: z.string().min(1, "Informe o modelo da garrafa"),

  naoh: z.coerce.number().nonnegative(),
  brix: z.coerce.number().nonnegative(),
  acidez: z.coerce.number().nonnegative(),
  ratio: z.coerce.number().optional(),
  ph: z.coerce.number().min(0).max(14),

  densidade: z.coerce.number().nonnegative(),

  cor_420nm: z.coerce.number().optional(),
  cor_520nm: z.coerce.number().optional(),
  cor_620nm: z.coerce.number().optional(),

  sensorial: z.string().optional(),
  observacao: z.string().optional(),
});

export type LabBottlingFormData = z.infer<typeof labBottlingSchema>;
