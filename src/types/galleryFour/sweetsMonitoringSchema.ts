import { z } from 'zod';


const ingredienteSchema = z.object({
  variedade_marca: z.string().optional(),
  fornecedor: z.string().optional(),
  peso_kg: z.coerce.number().optional(),
});


const analiseSchema = z.object({
  brix: z.coerce.number().optional(),
  acidez: z.coerce.number().optional(),
  relacao: z.coerce.number().optional(),
  ph: z.coerce.number().optional(),
});


const perdaEmbalagemSchema = z.object({
  fornecedor: z.string().optional(),
  nao_conforme: z.coerce.number().nonnegative().optional(),
  quebra_estoque: z.coerce.number().nonnegative().optional(),
});

export const sweetsMonitoringSchema = z.object({
  
  data: z.date(),
  produtor: z.string().optional(),
  fruta: z.string().optional(),
  variedade: z.string().optional(),
  peso_total_kg: z.coerce.number().optional(),
  hora_ini: z.string().optional(),
  hora_fim: z.string().optional(),
  vol_polpa_kg: z.coerce.number().optional(),
  vol_doce_kg: z.coerce.number().optional(),
  total_potes: z.coerce.number().optional(),
  total_caixas: z.coerce.number().optional(),

  
  ingrediente_fruta: ingredienteSchema,
  ingrediente_agua: ingredienteSchema,
  ingrediente_acucar: ingredienteSchema,
  ingrediente_pectina: ingredienteSchema,
  ingrediente_suco: ingredienteSchema,

  
  analise_fruta: analiseSchema,
  analise_doce: analiseSchema,

  
  perda_ponto_preto: z.coerce.number().nonnegative().optional(),
  perda_corpo_estranho: z.coerce.number().nonnegative().optional(),
  perda_pote_quebrado: z.coerce.number().nonnegative().optional(),
  perda_pote_contaminado: z.coerce.number().nonnegative().optional(),
  perda_tampa_amassada: z.coerce.number().nonnegative().optional(),
  perda_falta_lote: z.string().optional(), 
  perda_extras: z.string().optional(), 

  
  emb_potes: perdaEmbalagemSchema,
  emb_tampas: perdaEmbalagemSchema,
  emb_rotulos: perdaEmbalagemSchema,

  
  observacoes: z.string().optional(),
  assinatura_responsavel: z.string().min(1, "Assinatura obrigatória"),
});

export type SweetsMonitoringFormData = z.infer<typeof sweetsMonitoringSchema>;