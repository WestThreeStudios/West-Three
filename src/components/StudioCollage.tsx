import ParallaxFrame from "./ParallaxFrame";

// Scroll section after burocratik.com/studios' Coimbra block: a small label
// and a giant city name, a full-bleed hero photo, then a column of photos on
// the left with the details sitting beside them, then a staggered mosaic of
// the rest. Every photo is a ParallaxFrame, so each one drifts inside its
// crop as you scroll.
//
// The set is the three phone-case + swimwear stories (brown polka, pink
// stripe, yellow polka). These files are the chat-sized previews (1333×2000)
// — swap in the full-resolution Drive exports before this goes live. All of
// them are 2:3 portraits, so the frames are 2:3 and nothing gets cropped
// except the wide hero.
const dir = "/work/brand-photography/collage";

const hero = {
  src: `${dir}/pink-phone.jpg`,
  alt: "Striped phone case held up in front of the face",
  // The case sits just above the middle of the frame — keep it in the
  // 16:9 crop.
  objectPosition: "center 45%",
};

const stack = [
  { src: `${dir}/brown-full.jpg`, alt: "Brown polka-dot set with a matching phone case" },
  { src: `${dir}/pink-icecream.jpg`, alt: "Striped phone case at the ear, ice cream in hand" },
  { src: `${dir}/yellow-full.jpg`, alt: "Yellow polka-dot set with a matching phone case" },
];

const mosaic = [
  { src: `${dir}/brown-wink.jpg`, alt: "Winking, phone case and book held close" },
  { src: `${dir}/pink-chest.jpg`, alt: "Striped phone case and pearl necklace detail" },
  { src: `${dir}/yellow-torso.jpg`, alt: "Yellow polka-dot set, phone case at the hip" },
  { src: `${dir}/brown-detail.jpg`, alt: "Brown polka-dot top with phone case in hand" },
  { src: `${dir}/pink-lipbutter.jpg`, alt: "Striped phone case with a lip balm tucked in" },
  { src: `${dir}/yellow-detail.jpg`, alt: "Phone case, sunglasses and lip liner detail" },
];

export default function StudioCollage() {
  return (
    <section className="mt-24 md:mt-32">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <p className="font-body text-sm md:w-1/4 md:pt-4">Based in</p>
        <h2 className="font-body text-[clamp(4.5rem,17vw,15rem)] font-normal leading-[0.9] tracking-[-0.045em] text-ink md:flex-1">
          Phoenix
        </h2>
      </div>

      {/* Full-bleed: break out of the page's side padding. */}
      <ParallaxFrame
        src={hero.src}
        alt={hero.alt}
        objectPosition={hero.objectPosition}
        sizes="100vw"
        priority
        className="-mx-6 mt-10 aspect-[4/5] md:-mx-10 md:mt-14 md:aspect-[16/9]"
      />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          {stack.map((photo) => (
            <ParallaxFrame
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              aspect="2/3"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          ))}
        </div>

        <aside className="md:sticky md:top-28 md:self-start">
          <p className="font-body text-xl leading-snug text-ink md:text-2xl">
            West Three
            <br />
            Phoenix, AZ
            <br />
            Studio &amp; on location
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=westthreestudio@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block py-3 font-body text-xl text-ink/45 transition-colors hover:text-ink md:mt-6 md:py-0 md:text-2xl"
          >
            westthreestudio@gmail.com
          </a>
        </aside>
      </div>

      {/* Staggered mosaic: two columns on phones, three from md up, with the
          middle column dropped so the rows don't line up edge to edge. */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 md:pb-20">
        {mosaic.map((photo, i) => (
          <ParallaxFrame
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            aspect="2/3"
            sizes="(min-width: 768px) 33vw, 50vw"
            className={i % 3 === 1 ? "md:translate-y-20" : ""}
          />
        ))}
      </div>
    </section>
  );
}
