import { z } from 'zod';

export const labExtractionSchema = z.object({
  data: z.date(),
  variedade: z.string().min(1, "Variedade é obrigatória"),
  fornecedor: z.string().min(1, "Fornecedor é obrigatório"),
  
  naoh: z.coerce.number().nonnegative(),
  brix: z.coerce.number().nonnegative(),
  acidez: z.coerce.number().nonnegative().max(100),
  ratio: z.coerce.number().optional(), 
  ph: z.coerce.number().min(0).max(14),
  
  densidade: z.coerce.number().nonnegative(),
  aroma: z.string().optional(), 
  cor: z.string().optional(),   
  temp: z.coerce.number(),     
  
  qtde_bag: z.coerce.number().int().nonnegative(),
  sequencia: z.coerce.number().int().nonnegative(),
  volume: z.coerce.number().nonnegative(),
});

export type LabExtractionFormData = z.infer<typeof labExtractionSchema>;