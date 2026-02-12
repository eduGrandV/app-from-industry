import { z } from 'zod';

export const labWineSchema = z.object({
  // --- Identificação ---
  data: z.date(),
  analista: z.string().min(1, "Nome do analista é obrigatório"), 
  marca_tanque: z.string().min(1, "Marca/Tanque obrigatório"),
  lote: z.string().min(1, "Lote obrigatório"),

  
  // Densidade: 0,992 - 0,998
  densidade: z.coerce.number()
    .min(0.992, "Densidade baixa (< 0.992)")
    .max(0.998, "Densidade alta (> 0.998)"),

  alcool: z.coerce.number()
    .min(8.6, "Álcool baixo (< 8.6%)")
    .max(14.0, "Álcool alto (> 14%)"),

  acidez_total: z.coerce.number()
    .min(3, "Acidez baixa (< 3)")
    .max(9.75, "Acidez alta (> 9.75)"),

  acidez_volatil: z.coerce.number()
    .max(1.2, "Volátil acima do limite (1.2 g/L)"),
  
  so2_total: z.coerce.number()
    .max(0.35, "SO2 Total acima do limite (0.35 g/L)"),

 
  so2_livre: z.coerce.number()
    .min(0.020, "SO2 Livre baixo (< 0.020)")
    .max(0.030, "SO2 Livre alto (> 0.030)"),

  turbidez: z.coerce.number()
    .max(10, "Turbidez alta (> 10 NTU)"),


  indice_cor: z.coerce.number().nonnegative(),
  
  // pH: 3,1-3,4 (Branco) ou 3,3-3,6 (Tinto)
  ph: z.coerce.number()
    .min(3.1, "pH muito baixo (< 3.1)")
    .max(3.6, "pH muito alto (> 3.6)"),

  // Açúcar (g/L)
  acucar: z.coerce.number().nonnegative(),
});

export type LabWineFormData = z.infer<typeof labWineSchema>;