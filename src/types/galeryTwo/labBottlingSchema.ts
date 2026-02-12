import { z } from 'zod';

export const labBottlingSchema = z.object({
  //  Rastreabilidade
  data: z.date(),
  lote: z.string().min(1, "Lote é obrigatório"),
  modelo_garrafa: z.string().min(1, "Informe o modelo da garrafa"),
  
  //  Química 
  naoh: z.coerce.number().nonnegative(),
  brix: z.coerce.number().nonnegative(),
  acidez: z.coerce.number().nonnegative(),
  ratio: z.coerce.number().optional(),
  ph: z.coerce.number().min(0).max(14),
  
  //  Físico / Específicos 
  densidade: z.coerce.number().nonnegative(), // g.cm3
  cor_520nm: z.coerce.number().nonnegative(), 
  
  //  Qualitativo 
  sensorial: z.string().optional(), // Descrição de sabor/aroma
  observacao: z.string().optional(),
});

export type LabBottlingFormData = z.infer<typeof labBottlingSchema>;