//FUNCION DE PRUEBA PARA SUMAR DOS NUMEROS

import { sum } from "../sum.js";
import { expect, test } from "vitest";

test("sum module", () => {
  expect(sum(1, 2)).toBe(3);
});
