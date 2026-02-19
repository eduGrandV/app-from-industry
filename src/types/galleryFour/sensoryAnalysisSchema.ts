import z from "zod";

export const sensoryAnalysisSchema = z.object({
  tipo_analise: z.enum(["Suco", "Geleia_Doce"]),
  data: z.date(),
  lote: z.string().min(1, "Obrigatório informar o lote"),
  comentarios: z.string().optional(),

  //perguntas compart
  aparencia: z.number().min(1).max(9, "Avalie a aparência"),
  sabor: z.number().min(1).max(9, "Avalie o sabor"),
  acidez: z.number().min(1).max(9, "Avalie a acidez"),
  docura: z.number().min(1).max(9, "Avalie a doçura"),
  avaliacao_global: z.number().min(1).max(9, "Faça a avaliação global"),

  //pergunt do suco
  aroma: z.number().min(1).max(9).optional(),
  cor: z.number().min(1).max(9).optional(),

  //pergunt da geleia
  textura: z.number().min(1).max(9).optional(),


});


export type SensoryAnalysisFormData = z.infer<typeof sensoryAnalysisSchema>;