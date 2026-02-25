import { z } from 'zod';

const sequenciaSchema = z.object({
  inicio: z.coerce.number().optional(),
  fim: z.coerce.number().optional(),
});

export const labExtractionSchema = z.object({
  data: z.date(),
  variedade: z.string().optional(),
  fornecedor: z.string().optional(),
  
  naoh: z.coerce.number().optional(),
  brix: z.coerce.number().optional(),
  acidez: z.coerce.number().optional(),
  ph: z.coerce.number().optional(),
  ratio: z.coerce.number().optional(),
  
  densidade: z.coerce.number().optional(),
  temp: z.coerce.number().optional(),
  aroma: z.string().optional(),
  
  
  cor: z.array(z.string()).optional(), 
  
  qtde_bag: z.coerce.number().optional(),
  volume: z.coerce.number().optional(),

  
  sequencias: z.array(sequenciaSchema).optional(),
});

export type LabExtractionFormData = z.infer<typeof labExtractionSchema>;