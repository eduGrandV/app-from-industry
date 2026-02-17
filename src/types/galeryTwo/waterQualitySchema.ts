import z from "zod";

const phValidation = z.coerce.number().min(6.0).max(9.5).optional();
const cloroValidation = z.coerce.number().min(0.2).max(5.0).optional();
const turbidezValidation = z.coerce.number().max(5.0).optional();

export const waterQualitySchema = z.object({
  data: z.date(),
  responsavel: z.string().min(1, "Assinatura/Responsável é obrigatória"),

  //turno manha
  manha_hora: z.string().optional(),

  //ph
  manha_ph_01: phValidation,
  manha_ph_03: phValidation,

  //cloro
  manha_cloro_02: cloroValidation,
  manha_cloro_03: cloroValidation,

  //turbidez
  manha_turbidez_01: turbidezValidation,
  manha_turbidez_03: turbidezValidation,

  manha_obs: z.string().optional(),

  //tarde
  tarde_hora: z.string().optional(),

  // ph
  tarde_ph_01: phValidation,
  tarde_ph_03: phValidation,

  // cloro
  tarde_cloro_02: cloroValidation,
  tarde_cloro_03: cloroValidation,

  // Turbidez (01 | 03)
  tarde_turbidez_01: turbidezValidation,
  tarde_turbidez_03: turbidezValidation,

  tarde_obs: z.string().optional(),
});

export type WaterQualityFormData = z.infer<typeof waterQualitySchema>
