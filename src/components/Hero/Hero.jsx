const Hero = () => {
  return (
    <section
      className="main min-h-[90vh] grid place-content-center"
      data-aos="zoom-in-up"
    >
      <div className="hero_content flex-between h-3/4">
        <div className="hero_text">
          <p className="text-7xl font-bold">
          Eat Smart<br /> Move Better <span className="p-2 bg-light-green"> Live Well.</span>
          </p>
          <p className="text-2xl w-3/4 text-gray-400 font-semibold mt-10">
          FitFortune is your go-to wellness partner, guiding you to enjoy every bite and embrace an active lifestyle.
          </p>
        </div>
        <div className="hero_image" data-aos="zoom-in-up" data-aos-duration="" >
          <img src={"/assets/hero-icon.png"} width={568} alt="Hero Image" />
        </div>
      </div>
      <div className="flex-center">
        <img src={"/assets/hero-arrow.png"} alt="Scroll down" />
      </div>
    </section>
  )
}

export default Hero