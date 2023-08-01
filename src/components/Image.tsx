import { useState } from "react";
import defaultImage from "../assets/default-image-white.png";

const Image = ({
  src,
  style,
}: {
  src: string;
  style: React.CSSProperties | undefined;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      style={style}
      alt=""
      onError={() => {
        setImgSrc(defaultImage);
      }}
    />
  );
};

export default Image;
