//Convert string date to year
export default function toYear(date:string){
  const timestamp = Date.parse(date);
  const d = new Date(timestamp);
  return d.getFullYear();
}