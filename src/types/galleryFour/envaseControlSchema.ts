import { z } from 'zod';

const insumoSchema = z.object({
  lote_1: z.string().optional(),
  lote_2: z.string().optional(), 
  fornecedor: z.string().optional(),
  nao_conforme: z.coerce.number().nonnegative().optional(),
  quebra_estoque: z.coerce.number().nonnegative().optional(),
});

export const envaseControlSchema = z.object({
  ano_mes: z.string().min(4, "Obrigatório"),
  
  
  data: z.date(),
  lote_numero: z.string().min(1, "Obrigatório"),
  modelo_garrafa_tampa: z.string().optional(),
  temp_envase_c: z.coerce.number().optional(),
  hora_ini: z.string().optional(),
  hora_fim: z.string().optional(),
  vol_transferido_L: z.coerce.number().optional(),
  total_garrafas: z.coerce.number().optional(),
  rendimento_liq_pct: z.coerce.number().optional(),
  tambor_bag_numero: z.string().optional(),

  
  brix: z.coerce.number().optional(),
  acidez: z.coerce.number().optional(),
  relacao: z.coerce.number().optional(),
  ph: z.coerce.number().optional(),
  densidade: z.coerce.number().optional(),
  cor_520nm: z.coerce.number().optional(),

  
  perda_gf: z.coerce.number().nonnegative().optional(), 
  perda_gc: z.coerce.number().nonnegative().optional(), 
  perda_ga: z.coerce.number().nonnegative().optional(), 
  perda_gd: z.coerce.number().nonnegative().optional(), 

  
  insumo_garrafa: insumoSchema,
  insumo_tampa: insumoSchema,
  insumo_rotulo: insumoSchema,

  
  embalagens: z.array(z.object({
    data_embalagem: z.string().optional(), 
    garrafas_embaladas: z.coerce.number().optional(),
    total_caixas: z.coerce.number().optional()
  })).min(1),

  
  observacao: z.string().optional(),
  assinatura_operador: z.string().min(1, "Obrigatório"),
  assinatura_analista: z.string().min(1, "Obrigatório"),
  assinatura_gerencia: z.string().min(1, "Obrigatório"),
});

export type EnvaseControlFormData = z.infer<typeof envaseControlSchema>;