import z from "zod";

export const AREAS_PRAGAS = [
  "Extração",
  "Área de Produção",
  "Depósito de Produto Acabado",
  "Almoxarifado",
  "Recepção e Depósito de Embalagem",
] as const;

export const PESTS_LIST = [
  "Rato",
  "Aranha",
  "Escorpião",
  "Barata",
  "Grilo",
  "Pássaro",
  "Cobra",
  "Outros",
] as const;

export const pestControlSchema = z.object({
  data: z.date(),
  responsavel: z.string().optional(),
  observacoes_gerais: z.string().optional(),
  registros: z.record(z.string(), z.number()),
});

export type PestControlFormData = z.infer<typeof pestControlSchema>;