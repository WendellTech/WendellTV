//Convert minutes to hours & minutes
export default function toHM(minutes:string|number, suffix:boolean=true){
  if(typeof minutes === "string"){
    minutes = parseInt(minutes);
  }

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if(suffix) return `${h}h ${m}m`;
  
  return `${h} ${m}`;
}