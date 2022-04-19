export interface SchemeComponentList {
  code: string;
  num: string;
  length: string;
}
export interface SchemeList {
  length: string,
  lossLength: string,
  plannedSurplusLength: string,
  structureSpec: string,
  structureTexture: string,
  utilizationRate: string,
  source: string;
  loftingComponentInfoDtos: SchemeComponentList[]
}