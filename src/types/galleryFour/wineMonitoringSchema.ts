import { z } from 'zod';

const recepcaoUvaSchema = z.object({
  data_recepcao: z.string().optional(),
  produtor: z.string().optional(),
  area: z.string().optional(),
  variedade: z.string().optional(),
  qtd_caixas: z.coerce.number().optional(),
  peso_uva_kg: z.coerce.number().optional(),
  volume_l: z.coerce.number().optional(),
  rendimento_pct: z.coerce.number().optional(),
});

const vinificacaoSchema = z.object({
  data_hora: z.string().optional(),
  temp_c: z.coerce.number().optional(),
  densidade: z.coerce.number().optional(),
  aroma: z.string().optional(),
  remontagem: z.string().optional(),
  trasfega: z.string().optional(),
  turbidez: z.string().optional(),
  acucar_correcao: z.string().optional(),
  levedura_clarificante: z.string().optional(),
  conservante_antiox: z.string().optional(),
  tanque_vol: z.string().optional(),
});


const analiseMostoSchema = z.object({
  variedade: z.string().optional(),
  brix: z.coerce.number().optional(),
  att: z.coerce.number().optional(),
  ratio: z.coerce.number().optional(),
  ph: z.coerce.number().optional(),
  densidade: z.coerce.number().optional(),
  observacao: z.string().optional(),
});

const analiseVinhoSchema = z.object({
  densidade: z.coerce.number().optional(),
  alcool: z.coerce.number().optional(),
  acidez: z.coerce.number().optional(),
  acidez_volatil: z.coerce.number().optional(),
  so2_total: z.coerce.number().optional(),
  so2_livre: z.coerce.number().optional(),
  acucar: z.coerce.number().optional(),
  cor_620: z.coerce.number().optional(),
  turbidez: z.coerce.number().optional(),
});

export const wineMonitoringSchema = z.object({
  recepcoes: z.array(recepcaoUvaSchema).min(1),
  vinificacoes: z.array(vinificacaoSchema).min(1),
  
  
  analises_mosto: z.array(analiseMostoSchema).min(1),
  analises_vinho: z.array(analiseVinhoSchema).min(1),

  assinatura_gerencia: z.string().min(1, "Obrigatória"),
  assinatura_analista: z.string().min(1, "Obrigatória"),
});

export type WineMonitoringFormData = z.infer<typeof wineMonitoringSchema>;