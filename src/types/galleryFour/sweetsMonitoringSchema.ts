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



const recepcaoSchema = z.object({
  turno: z.string().optional(),
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
});

const ingredientesSchema = z.object({
  ref_lote: z.string().optional(), 
  ingrediente_fruta: ingredienteSchema,
  ingrediente_agua: ingredienteSchema,
  ingrediente_acucar: ingredienteSchema,
  ingrediente_pectina: ingredienteSchema,
  ingrediente_suco: ingredienteSchema,
});

const analisesSchema = z.object({
  ref_lote: z.string().optional(), 
  analise_fruta: analiseSchema,
  analise_doce: analiseSchema,
});

const perdasProducaoSchema = z.object({
  ref_lote: z.string().optional(),
  perda_ponto_preto: z.coerce.number().nonnegative().optional(),
  perda_corpo_estranho: z.coerce.number().nonnegative().optional(),
  perda_pote_quebrado: z.coerce.number().nonnegative().optional(),
  perda_pote_contaminado: z.coerce.number().nonnegative().optional(),
  perda_tampa_amassada: z.coerce.number().nonnegative().optional(),
  perda_falta_lote: z.string().optional(),
  perda_extras: z.string().optional(),
});

const perdasEmbalagemSchema = z.object({
  ref_lote: z.string().optional(),
  emb_potes: perdaEmbalagemSchema,
  emb_tampas: perdaEmbalagemSchema,
  emb_rotulos: perdaEmbalagemSchema,
});

export const sweetsMonitoringSchema = z.object({
  data: z.date(),
  
  recepcoes: z.array(recepcaoSchema).min(1),
  ingredientes: z.array(ingredientesSchema).min(1),
  analises: z.array(analisesSchema).min(1),
  perdas_producao: z.array(perdasProducaoSchema).min(1),
  perdas_embalagem: z.array(perdasEmbalagemSchema).min(1),
  
  observacoes: z.string().optional(),
  assinatura_responsavel: z.string().min(1, "Assinatura obrigatória"),
});

export type SweetsMonitoringFormData = z.infer<typeof sweetsMonitoringSchema>;