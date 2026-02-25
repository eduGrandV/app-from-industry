import z from "zod";

export const cleaningLogSchema = z.object({
  area: z.string(),

  data: z.date(),

  ph_agua_inicial: z.coerce.number().min(0).max(14),

  tipo_solucao: z.array(z.string()).min(1, "Selecione pelo menos uma solução"),


  hora_inicio_limpeza: z.string().min(4, "Hora obrigatória"),
  hora_fim_limpeza: z.string().min(4, "Hora obrigatória"),
  concentracao_pct: z.coerce.number().nonnegative(),
  temperatura_c: z.coerce.number(),

  hora_inicio_enxague: z.string().min(4, "Hora obrigatória"),
  hora_fim_enxague: z.string().min(4, "Hora obrigatória"),
  ph_agua_enxague: z.coerce.number().min(0).max(14),

  
  observacao: z.string().optional(),
  operador: z.string().min(1, "Nome do operador obrigatório"),
  responsavel_analista: z.string().min(1, "Assinatura obrigatória"),
  responsavel_gerencia: z.string().optional(),
});

export type CleaningLogFormData = z.infer<typeof cleaningLogSchema>;