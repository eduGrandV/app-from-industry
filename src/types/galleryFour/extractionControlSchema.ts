import { z } from 'zod';

// Sub-schema para Temperaturas (reaproveitado nas 3 etapas)
const tempControlSchema = z.object({
  temp_ini: z.coerce.number().optional(),
  temp_fim: z.coerce.number().optional(),
  hora_ini: z.string().optional(),
  hora_fim: z.string().optional(),
});

// Sub-schema para Análises (reaproveitado para Uva e Suco)
const analiseSchema = z.object({
  brix: z.coerce.number().optional(),
  acidez: z.coerce.number().optional(),
  relacao: z.coerce.number().optional(),
  ph: z.coerce.number().optional(),
  densidade: z.coerce.number().optional(),
});

export const extractionControlSchema = z.object({
  ano_mes: z.string().min(4, "Obrigatório"),
  
  // Recepção
  data_recepcao: z.date(),
  produtor: z.string().min(1, "Obrigatório"),
  area: z.string().optional(),
  variedade: z.string().optional(),
  qtd_caixas: z.coerce.number().int().nonnegative(),
  peso_total_kg: z.coerce.number().nonnegative(),
  hora_ini_extracao: z.string().optional(),
  hora_fim_extracao: z.string().optional(),
  rendimento_liq_pct: z.coerce.number().optional(),

  // Insumos
  enzima_tipo: z.string().optional(),
  enzima_forn: z.string().optional(),
  enzima_total_ml: z.coerce.number().optional(),
  
  bag_lote: z.string().optional(),
  bag_forn: z.string().optional(),
  bag_nao_conforme: z.coerce.number().optional(),

  // Controle de Temperatura
  temp_enzimatico: tempControlSchema,
  temp_pasteurizacao: tempControlSchema,
  temp_envase: tempControlSchema,

  // Análises
  analise_uva: analiseSchema,
  analise_suco: analiseSchema,

  // Lista Dinâmica de Tambores
  tambores: z.array(z.object({
    numero: z.string().min(1, "Nº obrigatório"),
    volume_L: z.coerce.number().min(1, "Volume obrigatório")
  })).min(1, "Adicione pelo menos um tambor"),

  // Rodapé
  observacao: z.string().optional(),
  assinatura_analista: z.string().min(1, "Assinatura do Analista obrigatória"),
  assinatura_gerencia: z.string().min(1, "Assinatura da Gerência obrigatória"),
});

export type ExtractionControlFormData = z.infer<typeof extractionControlSchema>;