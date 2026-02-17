import { z } from 'zod';

const solutionSchema = z.object({
  agua_L: z.coerce.number().nonnegative().optional(),
  produto_g: z.coerce.number().nonnegative().optional(), 
  fluxo_pct: z.coerce.number().min(0).max(100).optional(), 
});

export const etaRoutineSchema = z.object({
  data: z.date(),
  responsavel: z.string().min(1, "Responsável é obrigatório"),

  // MANHÃ
  manha_hora: z.string().min(4, "Hora obrigatória"), 
  
  // Parâmetros Iniciais
  manha_ph_agua_bruta: z.coerce.number().min(0).max(14).optional(),
  manha_cloro_agua_clorada: z.coerce.number().min(0).max(10).optional(),
  
  // Soluções
  manha_barrilha: solutionSchema,
  manha_sulfato: solutionSchema,
  manha_cloro_sol: solutionSchema,

  // Operacional
  manha_limpeza_filtros: z.boolean(),
  manha_abertura_valvulas: z.boolean(),

  // TARDE
  tarde_hora: z.string().optional(),
  
  tarde_ph_agua_bruta: z.coerce.number().min(0).max(14).optional(),
  tarde_cloro_agua_clorada: z.coerce.number().min(0).max(10).optional(),
  
  tarde_barrilha: solutionSchema,
  tarde_sulfato: solutionSchema,
  tarde_cloro_sol: solutionSchema,

  tarde_limpeza_filtros: z.boolean(),
  tarde_abertura_valvulas: z.boolean(),
});

export type EtaRoutineFormData = z.infer<typeof etaRoutineSchema>;
