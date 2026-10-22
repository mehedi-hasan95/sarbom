import z from "zod";
import { specificationValidator } from "./validators";

export type SPECIFICATION = z.infer<typeof specificationValidator>;
