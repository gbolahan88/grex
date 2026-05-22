import { useEffect, useState } from "react";
import "@/app/App.css"
import Image from "next/image"
import img1 from "@/assets/grex1.jpg"
import img2 from "@/assets/grex2.jpg"
import img3 from "@/assets/grex3.jpg"
import img4 from "@/assets/grex4.jpg"
import img5 from '@/assets/grex5.jpg'
import img6 from '@/assets/grex6.jpg'
import img7 from '@/assets/grex7.jpg'
import img8 from '@/assets/grex8.jpg'
import img9 from '@/assets/grex9.jpg'
import img10 from '@/assets/grex10.jpg'
import img11 from '@/assets/grex11.jpg'
import img12 from '@/assets/grex12.jpg'

const Images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12];

function Aboutslide() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Image src={Images[current]} alt="slide" style={{ width: '90%', height: '80%', objectFit: 'cover', borderRadius: 20 }} />
  );
}

export default Aboutslide;