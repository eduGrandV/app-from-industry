import { z } from 'zod';

const registroEnvaseSchema = z.object({
  horario: z.string().optional(),
  past_pressao: z.coerce.number().optional(),
  past_temp_agua: z.coerce.number().optional(),
  past_temp_suco: z.coerce.number().optional(),
  lav_temp: z.coerce.number().optional(),
  envase_bomba_hz: z.coerce.number().optional(),
  envase_temp_atual: z.coerce.number().optional(),
  envase_temp_garrafa: z.coerce.number().optional(),
  tamp_vazao: z.coerce.number().optional(),
  tamp_perda: z.coerce.number().nonnegative().optional(),
  observacao: z.string().optional(),
  
  // ---> JORNADA E PRODUTO (AGORA NO FINAL DO LOTE) <---
  modelo_garrafa: z.string().optional(),
  jornada_inicio: z.string().optional(),
  jornada_almoco_ini: z.string().optional(),
  jornada_almoco_fim: z.string().optional(),
  jornada_fim: z.string().optional(),
});

export const packagingMonitoringSchema = z.object({
  data: z.date(),
  lote: z.string().min(1, "Obrigatório"),
  registros: z.array(registroEnvaseSchema).min(1),
  assinatura_operador: z.string().min(1, "Assinatura obrigatória"),
});

export type PackagingMonitoringFormData = z.infer<typeof packagingMonitoringSchema>;