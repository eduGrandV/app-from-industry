import { z } from 'zod';

export const raisinMonitoringSchema = z.object({
  lote: z.string().min(1, "Obrigatório"),
  variedade: z.string().optional(),
  brix_fruta: z.coerce.number().optional(),
  
  data_inicio: z.date(),
  data_fim: z.date(),
  
  temp_secagem_c: z.coerce.number().optional(),
  peso_ini_kg: z.coerce.number().optional(),
  peso_fim_kg: z.coerce.number().optional(),
  rendimento_pct: z.coerce.number().optional(),
  umidade_pct: z.coerce.number().optional(),
  
  qtd_embalagem_un: z.coerce.number().optional(),
  observacao: z.string().optional(),
  assinatura_analista: z.string().min(1, "Assinatura obrigatória"),
});

export type RaisinMonitoringFormData = z.infer<typeof raisinMonitoringSchema>;