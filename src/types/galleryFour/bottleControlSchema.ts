import { z } from 'zod';

export const bottleControlSchema = z.object({
  ano_mes: z.string().min(4, "Obrigatório"),
  data: z.coerce.date(),
  
  // Identificação
  lote_producao: z.string().min(1, "Obrigatório"),
  modelo_garrafa: z.string().optional(),
  fornecedor: z.string().optional(),
  lote_garrafa: z.string().optional(),

  codigo_barras: z.string().optional(),


  nc_gd: z.coerce.number().nonnegative().optional(), // Garrafas Defeituosas
  nc_gc: z.coerce.number().nonnegative().optional(), // Garrafas Contaminadas
  nc_perdas: z.coerce.number().nonnegative().optional(), // Perdas no Processo

  // Assinaturas
  assinatura_operador: z.string().min(1, "Assinatura do Operador obrigatória"),
  assinatura_analista: z.string().min(1, "Assinatura do Analista obrigatória"),
  assinatura_gerencia: z.string().min(1, "Assinatura da Gerência obrigatória"),
});

export type BottleControlFormData = z.infer<typeof bottleControlSchema>;