export const FIELD_LABELS: Record<string, string> = {
  marca: "Marca", model: "Model", varianta: "Variantă echipare", vin: "Serie șasiu (VIN)",
  capacitate: "Capacitate [cmc]", putere: "Putere [kW]", transmisie: "Transmisie",
  km: "Kilometri", primaInmatriculare: "Primă înmatriculare", proprietari: "Nr. proprietari",
  dotari: "Dotări suplimentare", descriereAvarii: "Descriere avarii", dataAccident: "Data accidentului",
  tipPolita: "Tip poliță", sistemCalcul: "Sistem calcul", motiv: "Motiv consultanță",
  locAccident: "Loc accident", dataOra: "Data și ora", victime: "Accident cu victime",
  nume: "Nume", telefon: "Telefon", email: "Email", localitate: "Localitate",
  mesaj: "Mesaj", raportTiparit: "Raport tipărit",
};

export const IMAGE_LABELS: Record<string, string> = {
  imgFata: "Față", imgSpate: "Spate", imgDreapta: "Lateral dreapta", imgStanga: "Lateral stânga",
  imgBord: "Bord", imgAvarii: "Avarii", imgPV: "Proces verbal",
  imgVehiculTau: "Vehiculul tău", imgVehiculVinovat: "Vehiculul vinovat",
};

export function fieldLabel(name: string): string {
  return FIELD_LABELS[name] ?? name;
}

export function imageLabel(name: string): string {
  return IMAGE_LABELS[name] ?? name;
}
