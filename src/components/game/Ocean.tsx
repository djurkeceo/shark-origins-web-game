interface OceanProps {
  backgroundImage: string
  backgroundColor: string
}

const Ocean = ({ backgroundImage, backgroundColor }: OceanProps) => {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: backgroundColor }}
      />
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  )
}

export default Ocean
