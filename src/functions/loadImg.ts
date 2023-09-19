export default async function loadImg(src:string){
  return new Promise(resolve => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      img.decode().then(() => resolve(img));
    }
  });
}