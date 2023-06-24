import { parseReceiptRawText } from "./lib/openai";

const text = `
SALAMANCA
Silvestre
SANCHEZ SIERRA, MODESTO
NIF: 7777286-C
Almirante Cervera, 34
08003 Barcelona
93 221 50 33
Fra.Simple: TA11380180 Cambrer: MARIA
OSE
Data: 11/03/2018
Hora: 16:30:00
Taula: 232
Comensale:10
Descripció
Quant Preu Import
PAN
10,00 1,95 19,50
PAELLA DE MARISCO
8,00
17,95
143.60
PULPO FEIRA
1,00
19,90
19,90
AGUA LITRO
2,00
2,65
5,30
CERVEZA 300
2,00
2,55
5,10
CERVEZA 500
4,00
5,65
22,60
COCA COLA
1,00
2,55
2,55
Base Imp
%IVA
IVA
198,68
10,00
19,87
Total: 218.55
ine is included and tip is not
tory. Tip is optional.
ias por su visita.
es
`;

async function main() {
  const start = performance.now();
  const output = await parseReceiptRawText(text);
  const time = (performance.now() - start) / 1000;
  console.log(output);
  console.log(time)
}

main();
