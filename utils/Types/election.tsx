export type Election = {
  _id: string;
  area: string;
  date: string;
  type: string;
  presiding_officer: string;
  council_size: number;
  status: string;
  perAreaNominees: {
    [key: string]: number;
  };
  ecRatio: string;
  __v: number;
};