import { z } from 'zod';

const solutionSchema = z.object({
  agua_L: z.coerce.number().nonnegative().optional(),
  produto_g: z.coerce.number().nonnegative().optional(), 
  fluxo_pct: z.coerce.number().min(0).max(100).optional(), 
});

export const etaRoutineSchema = z.object({
  data: z.date(),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
turno: z.enum(["Manhã", "Tarde"], {
  message: "Selecione o turno",
}),
  hora: z.string().min(4, "Hora obrigatória"), 
  
  ph_agua_bruta: z.coerce.number().min(0).max(14).optional(),
  cloro_agua_clorada: z.coerce.number().min(0).max(10).optional(),
  
  barrilha: solutionSchema,
  sulfato: solutionSchema,
  cloro_sol: solutionSchema,

  limpeza_filtros: z.boolean().default(false),
  abertura_valvulas: z.boolean().default(false),
});

export type EtaRoutineFormData = z.infer<typeof etaRoutineSchema>;